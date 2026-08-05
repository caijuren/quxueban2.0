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

async function fetchWechatOpenId(code: string): Promise<string> {
  const appId = process.env.WECHAT_MINIAPP_APPID;
  const secret = process.env.WECHAT_MINIAPP_SECRET;

  if (!appId || !secret) {
    throw new Error('微信小程序 AppID 或 Secret 未配置');
  }

  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
  const res = await fetch(url);
  const data: WechatSessionResponse = await res.json();

  if (data.errcode) {
    console.error('[miniapp login] wechat error:', data);
    throw new Error(`微信接口错误：${data.errmsg || '未知错误'}（errcode: ${data.errcode}）`);
  }

  if (!data.openid) {
    throw new Error('微信未返回用户 openid');
  }

  return data.openid;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: '缺少微信登录 code' }, { status: 400 });
    }

    let openId: string;
    try {
      openId = await fetchWechatOpenId(code);
    } catch (wechatErr) {
      const message = wechatErr instanceof Error ? wechatErr.message : '微信登录失败';
      console.error('[miniapp login] fetch openid failed:', wechatErr);
      return NextResponse.json({ error: message }, { status: 400 });
    }

    // 先尝试家长登录
    const user = await prisma.user.findUnique({
      where: { wechatOpenId: openId },
    });

    if (user) {
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
    }

    // 再尝试孩子登录
    const child = await prisma.child.findUnique({
      where: { wechatOpenId: openId },
    });

    if (child) {
      const token = signMiniAppToken({ userId: child.id, role: 'child' });

      return NextResponse.json({
        token,
        user: {
          id: child.id,
          name: child.name,
          avatarColor: child.avatarColor,
          avatarUrl: child.avatarUrl,
          grade: child.grade,
        },
        role: 'child',
        selectedChild: {
          id: child.id,
          name: child.name,
          grade: child.grade,
          avatarColor: child.avatarColor,
          avatarUrl: child.avatarUrl,
        },
      });
    }

    return NextResponse.json(
      {
        error: '账号未绑定',
        code: 'NOT_BOUND',
        message: '该微信尚未绑定趣学伴账号，请先在 Web 端绑定微信或使用绑定码进行孩子绑定。',
      },
      { status: 404 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : '登录失败';
    console.error('[miniapp login] error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
