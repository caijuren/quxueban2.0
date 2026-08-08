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
    console.error('[miniapp bind-parent] wechat error:', data);
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

    const user = await prisma.user.findUnique({
      where: { bindCode },
    });

    if (!user) {
      return NextResponse.json({ error: '绑定码不存在' }, { status: 404 });
    }

    if (!user.bindCodeExpiresAt || user.bindCodeExpiresAt < new Date()) {
      return NextResponse.json({ error: '绑定码已过期' }, { status: 400 });
    }

    // 检查该微信是否已绑定其他家长
    const existingUser = await prisma.user.findUnique({
      where: { wechatOpenId: openId },
    });

    if (existingUser && existingUser.id !== user.id) {
      return NextResponse.json({ error: '该微信已绑定其他家长账号，请先解绑' }, { status: 409 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        wechatOpenId: openId,
        bindCode: null,
        bindCodeExpiresAt: null,
      },
    });

    const token = signMiniAppToken({ userId: user.id, role: 'parent' });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
      role: 'parent',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '绑定失败';
    console.error('[miniapp bind-parent] error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
