import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canViewChild } from '@/lib/family';
import { chatSessionCreateSchema, validateBody } from '@/lib/validation';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const childId = searchParams.get('childId') || undefined;

  if (childId) {
    const child = await prisma.child.findUnique({
      where: { id: childId },
      select: { userId: true, familyId: true },
    });
    if (!child || !(await canViewChild(session.user.id, child))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const sessions = await prisma.chatSession.findMany({
    where: { userId: session.user.id, childId },
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: { select: { messages: true } },
      child: { select: { id: true, name: true, avatarColor: true } },
    },
  });

  return NextResponse.json(sessions);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(req, chatSessionCreateSchema);
  if (!validation.success) {
    return validation.response;
  }

  const { title, childId } = validation.data;
  const userId = session.user.id;

  if (childId) {
    const child = await prisma.child.findUnique({
      where: { id: childId },
      select: { userId: true, familyId: true },
    });
    if (!child || !(await canViewChild(userId, child))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  const chatSession = await prisma.chatSession.create({
    data: {
      userId,
      childId: childId || null,
      title: title || null,
    },
    include: {
      _count: { select: { messages: true } },
      child: { select: { id: true, name: true, avatarColor: true } },
    },
  });

  return NextResponse.json(chatSession, { status: 201 });
}
