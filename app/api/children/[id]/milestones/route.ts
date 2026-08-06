import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canViewChild } from '@/lib/family';
import { getMilestonesForChild } from '@/lib/milestones';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const childId = params.id;
  const userId = session.user.id;

  const child = await prisma.child.findUnique({
    where: { id: childId },
    select: { userId: true, familyId: true, routeId: true, grade: true },
  });

  if (!child) {
    return NextResponse.json({ error: 'Child not found' }, { status: 404 });
  }

  const hasAccess = await canViewChild(userId, child);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let milestones = await prisma.milestone.findMany({
    where: { childId },
    orderBy: [{ targetGrade: 'asc' }, { createdAt: 'asc' }],
  });

  // Auto-generate system milestones if none exist
  if (milestones.length === 0) {
    const templates = getMilestonesForChild(child.routeId, child.grade);
    if (templates.length > 0) {
      await prisma.milestone.createMany({
        data: templates.map((t) => ({
          childId,
          title: t.title,
          description: t.description ?? null,
          targetGrade: t.targetGrade,
          targetPeriod: t.targetPeriod ?? null,
          routeId: child.routeId,
          source: 'system',
          status: child.grade === t.targetGrade ? 'in_progress' : 'pending',
        })),
      });

      milestones = await prisma.milestone.findMany({
        where: { childId },
        orderBy: [{ targetGrade: 'asc' }, { createdAt: 'asc' }],
      });
    }
  }

  return NextResponse.json(milestones);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
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

  try {
    const body = await req.json();
    const milestone = await prisma.milestone.create({
      data: {
        childId,
        title: body.title,
        description: body.description ?? null,
        targetGrade: body.targetGrade ?? null,
        targetPeriod: body.targetPeriod ?? null,
        routeId: body.routeId ?? null,
        source: 'parent',
        status: body.status ?? 'pending',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      },
    });

    return NextResponse.json(milestone, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
