import { NextResponse } from 'next/server';
import { signMiniAppToken } from '@/lib/miniapp/auth';
import { prisma } from '@/lib/prisma';

interface WechatSessionResponse {
  openid?: string;
  unionid?: string;
  session_key?: string;
  errcode?: number;
  errmsg?: string;
}

async function fetchWechatOpenId(code: string): Promise<string | null> {
  const appId = process.env.WECHAT_MINIAPP_APPID;
  const secret = process.env.WECHAT_MINIAPP_SECRET;

  if (!appId || !secret) {
    throw new Error('微信小程序 AppID 或 Secret 未配置');
  }

  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
  const res = await fetch(url);
  const data: WechatSessionResponse = await res.json();

  if (data.errcode) {
    console.error('[miniapp bind-child] wechat error:', data);
    return null;
  }

  return data.openid || null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, bindCode } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: '缺少微信登录 code' }, { status: 400 });
    }

    if (!bindCode || typeof bindCode !== 'string') {
      return NextResponse.json({ error: '缺少绑定码' }, { status: 400 });
    }

    const openId = await fetchWechatOpenId(code);
    if (!openId) {
      return NextResponse.json({ error: '微信登录失败，请重试' }, { status: 400 });
    }

    const child = await prisma.child.findUnique({
      where: { bindCode },
    });

    if (!child) {
      return NextResponse.json({ error: '绑定码不存在' }, { status: 404 });
    }

    if (!child.bindCodeExpiresAt || child.bindCodeExpiresAt < new Date()) {
      return NextResponse.json({ error: '绑定码已过期' }, { status: 400 });
    }

    // 检查该微信是否已绑定其他孩子
    const existingChild = await prisma.child.findUnique({
      where: { wechatOpenId: openId },
    });

    if (existingChild && existingChild.id !== child.id) {
      return NextResponse.json(
        { error: '该微信已绑定其他孩子，请先解绑' },
        { status: 409 }
      );
    }

    await prisma.child.update({
      where: { id: child.id },
      data: {
        wechatOpenId: openId,
        bindCode: null,
        bindCodeExpiresAt: null,
      },
    });

    const token = signMiniAppToken({ userId: child.id, role: 'child' });

    return NextResponse.json({
      token,
      child: {
        id: child.id,
        name: child.name,
        grade: child.grade,
        avatarColor: child.avatarColor,
        avatarUrl: child.avatarUrl,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '绑定失败';
    console.error('[miniapp bind-child] error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
