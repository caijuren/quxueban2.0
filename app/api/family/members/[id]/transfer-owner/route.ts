import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: { id: string };
}

export async function POST(_req: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  const target = await prisma.familyMember.findUnique({
    where: { id },
    include: { family: true },
  });
  if (!target) {
    return NextResponse.json({ error: '成员不存在' }, { status: 404 });
  }

  const myMembership = await prisma.familyMember.findFirst({
    where: {
      familyId: target.familyId,
      userId: session.user.id,
      status: 'ACTIVE',
    },
  });
  if (!myMembership || myMembership.role !== 'OWNER') {
    return NextResponse.json({ error: '只有家庭创建者可以转让' }, { status: 403 });
  }

  if (target.userId === session.user.id) {
    return NextResponse.json({ error: '不能转让给自己' }, { status: 400 });
  }

  if (target.status !== 'ACTIVE') {
    return NextResponse.json({ error: '只能转让给已加入的成员' }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.familyMember.update({
        where: { id: myMembership.id },
        data: { role: 'ADMIN' },
      });
      await tx.familyMember.update({
        where: { id: target.id },
        data: { role: 'OWNER' },
      });
      await tx.family.update({
        where: { id: target.familyId },
        data: { createdByUserId: target.userId },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : '转让失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
