import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { familyMemberUpdateSchema, validateBody } from '@/lib/validation';

const MANAGER_ROLES = new Set(['OWNER', 'ADMIN']);

interface RouteContext {
  params: { id: string };
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const validation = await validateBody(req, familyMemberUpdateSchema);
  if (!validation.success) {
    return validation.response;
  }

  const target = await prisma.familyMember.findUnique({
    where: { id },
    include: { family: true },
  });
  if (!target) {
    return NextResponse.json({ error: '成员不存在' }, { status: 404 });
  }

  const myMembership = await prisma.familyMember.findFirst({
    where: { familyId: target.familyId, userId: session.user.id, status: 'ACTIVE' },
  });
  if (!myMembership) {
    return NextResponse.json({ error: '你不是该家庭成员' }, { status: 403 });
  }

  const isSelf = target.userId === session.user.id;
  const isOwner = target.role === 'OWNER';

  if (validation.data.status === 'ACTIVE') {
    // 接受邀请：只能自己操作
    if (!isSelf) {
      return NextResponse.json({ error: '只能接受自己的邀请' }, { status: 403 });
    }
    if (target.status !== 'INVITED') {
      return NextResponse.json({ error: '邀请状态不正确' }, { status: 400 });
    }
    const updated = await prisma.familyMember.update({
      where: { id },
      data: { status: 'ACTIVE', joinedAt: new Date() },
      include: { user: { select: { id: true, username: true, name: true, avatarUrl: true } } },
    });
    return NextResponse.json({
      member: {
        id: updated.id,
        role: updated.role,
        status: updated.status,
        invitedAt: updated.invitedAt.toISOString(),
        joinedAt: updated.joinedAt ? updated.joinedAt.toISOString() : null,
        user: updated.user,
      },
    });
  }

  // 其他修改需要管理员权限
  if (!MANAGER_ROLES.has(myMembership.role)) {
    return NextResponse.json({ error: '无权限修改成员' }, { status: 403 });
  }

  // 不能修改所有者
  if (isOwner && !isSelf) {
    return NextResponse.json({ error: '不能修改家庭创建者' }, { status: 403 });
  }

  // 只有 OWNER 可以设置 ADMIN
  if (validation.data.role === 'ADMIN' && myMembership.role !== 'OWNER') {
    return NextResponse.json({ error: '只有创建者可以设置管理员' }, { status: 403 });
  }

  const updated = await prisma.familyMember.update({
    where: { id },
    data: validation.data,
    include: { user: { select: { id: true, username: true, name: true, avatarUrl: true } } },
  });

  return NextResponse.json({
    member: {
      id: updated.id,
      role: updated.role,
      status: updated.status,
      invitedAt: updated.invitedAt.toISOString(),
      joinedAt: updated.joinedAt ? updated.joinedAt.toISOString() : null,
      user: updated.user,
    },
  });
}

export async function DELETE(_req: Request, { params }: RouteContext) {
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

  const isSelf = target.userId === session.user.id;

  if (isSelf) {
    // 自己离开：不能是创建者
    if (target.role === 'OWNER') {
      return NextResponse.json({ error: '创建者需要先转让家庭或解散家庭' }, { status: 400 });
    }
    await prisma.familyMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  }

  const myMembership = await prisma.familyMember.findFirst({
    where: { familyId: target.familyId, userId: session.user.id, status: 'ACTIVE' },
  });
  if (!myMembership || !MANAGER_ROLES.has(myMembership.role)) {
    return NextResponse.json({ error: '无权限移除成员' }, { status: 403 });
  }

  if (target.role === 'OWNER') {
    return NextResponse.json({ error: '不能移除家庭创建者' }, { status: 403 });
  }

  await prisma.familyMember.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
