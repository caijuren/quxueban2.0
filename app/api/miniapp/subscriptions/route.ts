import { NextResponse } from 'next/server';
import { getMiniAppUser, unauthorizedResponse } from '@/lib/miniapp/auth';
import { saveSubscriptionStatus } from '@/lib/miniapp/subscription';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const auth = await getMiniAppUser(req);
  if (!auth) return unauthorizedResponse();

  try {
    const body = await req.json();
    const { results } = body;

    if (!results || typeof results !== 'object') {
      return NextResponse.json({ error: '缺少订阅结果' }, { status: 400 });
    }

    if (auth.type === 'parent') {
      await saveSubscriptionStatus(auth.userId, results);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : '保存订阅状态失败';
    console.error('[miniapp subscriptions] error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
