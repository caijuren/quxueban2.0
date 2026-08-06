import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canViewChild, canManageChild } from '@/lib/family';
import { parentLogCreateSchema, validateBody } from '@/lib/validation';

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
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

  const hasAccess = await canViewChild(userId, child);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const logs = await prisma.parentLog.findMany({
    where: { childId },
    orderBy: { date: 'desc' },
  });

  return NextResponse.json(logs);
}

export async function POST(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(req, parentLogCreateSchema);
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

  const body = validation.data;

  try {
    const log = await prisma.parentLog.upsert({
      where: {
        childId_date: {
          childId,
          date: body.date,
        },
      },
      update: {
        content: body.content,
        imageUrls: body.imageUrls,
        tags: body.tags,
      },
      create: {
        userId,
        childId,
        date: body.date,
        content: body.content,
        imageUrls: body.imageUrls,
        tags: body.tags,
      },
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
