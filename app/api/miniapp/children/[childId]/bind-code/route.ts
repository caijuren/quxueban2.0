import { NextResponse } from 'next/server';
import { getMiniAppUser, unauthorizedResponse } from '@/lib/miniapp/auth';
import { prisma } from '@/lib/prisma';
import type { NextRequest } from 'next/server';
import { randomInt } from 'node:crypto';
import { bindRateLimit, getClientIp } from '@/lib/rateLimit';

function generateBindCode(): string {
  return randomInt(100000, 1000000).toString();
}

function getExpiryDate(minutes = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export async function POST(req: NextRequest, { params }: { params: { childId: string } }) {
  const auth = await getMiniAppUser(req);
  if (!auth || auth.type !== 'parent') return unauthorizedResponse();

  if (!(await bindRateLimit(`generate-miniapp:${getClientIp(req)}`)).allowed) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  const { childId } = params;

  const child = await prisma.child.findFirst({
    where: { id: childId, userId: auth.userId },
  });

  if (!child) {
    return NextResponse.json({ error: 'Child not found' }, { status: 404 });
  }

  // 如果已经绑定过微信，先解绑再生成新码
  const bindCode = generateBindCode();

  await prisma.child.update({
    where: { id: childId },
    data: {
      bindCode,
      bindCodeExpiresAt: getExpiryDate(),
      wechatOpenId: null,
    },
  });

  return NextResponse.json({ bindCode, expiresAt: getExpiryDate().toISOString() });
}
