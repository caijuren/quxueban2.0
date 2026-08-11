import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { randomInt } from 'node:crypto';
import { bindRateLimit, getClientIp } from '@/lib/rateLimit';

function generateBindCode(): string {
  return randomInt(100000, 1000000).toString();
}

function getExpiryDate(minutes = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!bindRateLimit(`generate:${getClientIp(req)}`).allowed) {
    return NextResponse.json({ error: '请求过于频繁，请稍后再试' }, { status: 429 });
  }

  // 清除其他用户可能占用的相同绑定码，避免生成冲突
  let code = generateBindCode();
  let existing = await prisma.user.findUnique({ where: { bindCode: code } });
  let attempts = 0;
  while (existing && attempts < 10) {
    code = generateBindCode();
    existing = await prisma.user.findUnique({ where: { bindCode: code } });
    attempts++;
  }
  if (existing) {
    return NextResponse.json({ error: '生成绑定码失败，请重试' }, { status: 500 });
  }

  const expiresAt = getExpiryDate();

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      bindCode: code,
      bindCodeExpiresAt: expiresAt,
    },
  });

  return NextResponse.json({ bindCode: code, expiresAt: expiresAt.toISOString() });
}
