import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canViewChild, canManageChild } from '@/lib/family';
import { parentLogUpdateSchema, validateBody } from '@/lib/validation';

type Params = { params: { id: string; logId: string } };

export async function PATCH(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(req, parentLogUpdateSchema);
  if (!validation.success) {
    return validation.response;
  }

  const childId = params.id;
  const userId = session.user.id;

  const child = await prisma.child.findUnique({
    where: { id: childId },
    select: { userId: true, familyId: true },
  });
  if (!child) {
    return NextResponse.json({ error: 'Child not found' }, { status: 404 });
  }

  const canManage = await canManageChild(userId, child);
  if (!canManage) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const log = await prisma.parentLog.findFirst({
    where: { id: params.logId, childId },
  });
  if (!log) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = validation.data;
  const data: Record<string, unknown> = {};
  if (body.content !== undefined) data.content = body.content;
  if (body.imageUrls !== undefined) data.imageUrls = body.imageUrls;
  if (body.tags !== undefined) data.tags = body.tags;

  try {
    const updated = await prisma.parentLog.update({
      where: { id: params.logId },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const childId = params.id;
  const userId = session.user.id;

  const child = await prisma.child.findUnique({
    where: { id: childId },
    select: { userId: true, familyId: true },
  });
  if (!child) {
    return NextResponse.json({ error: 'Child not found' }, { status: 404 });
  }

  const canManage = await canManageChild(userId, child);
  if (!canManage) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const log = await prisma.parentLog.findFirst({
    where: { id: params.logId, childId },
  });
  if (!log) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.parentLog.delete({ where: { id: params.logId } });

  return NextResponse.json({ success: true });
}
