import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { familyInviteSchema, validateBody } from '@/lib/validation';

const MANAGER_ROLES = new Set(['OWNER', 'ADMIN']);

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(req, familyInviteSchema);
  if (!validation.success) {
    return validation.response;
  }

  const { username, role } = validation.data;

  const myMembership = await prisma.familyMember.findFirst({
    where: { userId: session.user.id, status: 'ACTIVE' },
    include: { family: true },
  });
  if (!myMembership || !MANAGER_ROLES.has(myMembership.role)) {
    return NextResponse.json({ error: '无权限邀请成员' }, { status: 403 });
  }

  const targetUser = await prisma.user.findUnique({ where: { username } });
  if (!targetUser) {
    return NextResponse.json({ error: '该用户不存在' }, { status: 404 });
  }
  if (targetUser.id === session.user.id) {
    return NextResponse.json({ error: '不能邀请自己' }, { status: 400 });
  }

  const existing = await prisma.familyMember.findFirst({
    where: { familyId: myMembership.familyId, userId: targetUser.id },
  });
  if (existing && existing.status !== 'DISABLED') {
    return NextResponse.json({ error: '该用户已是家庭成员或已收到邀请' }, { status: 400 });
  }

  try {
    let member;
    if (existing) {
      member = await prisma.familyMember.update({
        where: { id: existing.id },
        data: {
          role,
          status: 'INVITED',
          invitedBy: session.user.id,
          invitedAt: new Date(),
          joinedAt: null,
        },
        include: {
          user: { select: { id: true, username: true, name: true, avatarUrl: true } },
        },
      });
    } else {
      member = await prisma.familyMember.create({
        data: {
          familyId: myMembership.familyId,
          userId: targetUser.id,
          role,
          status: 'INVITED',
          invitedBy: session.user.id,
        },
        include: {
          user: { select: { id: true, username: true, name: true, avatarUrl: true } },
        },
      });
    }

    return NextResponse.json(
      {
        member: {
          id: member.id,
          role: member.role,
          status: member.status,
          invitedAt: member.invitedAt.toISOString(),
          joinedAt: null,
          user: member.user,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : '邀请失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
