import { NextResponse } from 'next/server';
import { getMiniAppUser, unauthorizedResponse } from '@/lib/miniapp/auth';
import { prisma } from '@/lib/prisma';
import type { NextRequest } from 'next/server';

function generateBindCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getExpiryDate(minutes = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { childId: string } }
) {
  const auth = await getMiniAppUser(req);
  if (!auth || auth.type !== 'parent') return unauthorizedResponse();

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
