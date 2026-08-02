import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { normalizeWeeklyTask, alignTaskFromTemplate } from '@/lib/taskAlignment';
import { weeklyPlanCreateSchema, validateBody } from '@/lib/validation';
import type { WeeklyTaskItem } from '@/lib/storage.types';

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

  const normalizedPlans = plans.map((plan) => {
    const rawTasks = (plan.tasks as unknown as Partial<WeeklyTaskItem>[]) || [];
    const normalizedTasks = rawTasks.map((task) =>
      normalizeWeeklyTask(task as WeeklyTaskItem)
    );
    return {
      ...plan,
      tasks: normalizedTasks,
    };
  });

  return NextResponse.json(normalizedPlans);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(req, weeklyPlanCreateSchema);
  if (!validation.success) {
    return validation.response;
  }

  const body = validation.data;

  const child = await prisma.child.findFirst({
    where: { id: body.childId, userId: session.user.id },
  });
  if (!child) {
    return NextResponse.json({ error: 'Child not found' }, { status: 404 });
  }

  const normalizedTasks = body.tasks.map((task) => {
    const normalized = normalizeWeeklyTask(task as WeeklyTaskItem);
    return alignTaskFromTemplate(normalized, {
      grade: child.grade,
      routeId: child.routeId,
    });
  });

  const plan = await prisma.weeklyPlan.upsert({
    where: {
      childId_weekId: {
        childId: body.childId,
        weekId: body.weekId,
      },
    },
    update: {
      tasks: normalizedTasks as unknown as object[],
      goals: body.goals as unknown as object[],
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      reviewedAt: body.reviewedAt ? new Date(body.reviewedAt) : null,
      parentComment: body.parentComment,
    },
    create: {
      userId: session.user.id,
      childId: body.childId,
      weekId: body.weekId,
      tasks: normalizedTasks as unknown as object[],
      goals: body.goals as unknown as object[],
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      reviewedAt: body.reviewedAt ? new Date(body.reviewedAt) : null,
      parentComment: body.parentComment,
    },
  });

  return NextResponse.json(plan, { status: 201 });
}
