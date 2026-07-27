import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const childId = searchParams.get('childId');

  const plans = await prisma.weeklyPlan.findMany({
    where: {
      userId: session.user.id,
      ...(childId ? { childId } : {}),
    },
    orderBy: { weekId: 'desc' },
  });

  return NextResponse.json(plans);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { childId, weekId, tasks, publishedAt, reviewedAt, parentComment } = body;

  if (!childId || !weekId || !Array.isArray(tasks)) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  const child = await prisma.child.findFirst({
    where: { id: childId, userId: session.user.id },
  });
  if (!child) {
    return NextResponse.json({ error: 'Child not found' }, { status: 404 });
  }

  const plan = await prisma.weeklyPlan.upsert({
    where: {
      childId_weekId: {
        childId,
        weekId,
      },
    },
    update: {
      tasks,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      reviewedAt: reviewedAt ? new Date(reviewedAt) : null,
      parentComment,
    },
    create: {
      userId: session.user.id,
      childId,
      weekId,
      tasks,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      reviewedAt: reviewedAt ? new Date(reviewedAt) : null,
      parentComment,
    },
  });

  return NextResponse.json(plan, { status: 201 });
}
