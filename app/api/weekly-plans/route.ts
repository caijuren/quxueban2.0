import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { normalizeWeeklyTask, alignTaskFromTemplate } from '@/lib/taskAlignment';
import { weeklyPlanCreateSchema, validateBody } from '@/lib/validation';
import { canManageChild, canViewChild, getViewableChildIdsForUser } from '@/lib/family';
import type { WeeklyTaskItem } from '@/lib/storage.types';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const childId = searchParams.get('childId');

  const viewableChildIds = await getViewableChildIdsForUser(session.user.id);
  if (childId && !viewableChildIds.includes(childId)) {
    return NextResponse.json([]);
  }

  const plans = await prisma.weeklyPlan.findMany({
    where: {
      childId: childId ?? { in: viewableChildIds },
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

  const child = await prisma.child.findUnique({
    where: { id: body.childId },
  });
  if (!child || !(await canManageChild(session.user.id, child))) {
    return NextResponse.json({ error: 'Child not found' }, { status: 404 });
  }

  const normalizedTasks = body.tasks.map((task) => {
    const normalized = normalizeWeeklyTask(task as WeeklyTaskItem);
    return alignTaskFromTemplate(normalized, {
      grade: child.grade,
      routeId: child.routeId,
    });
  });

  try {
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
        aiSummary: body.aiSummary,
        aiSummaryGeneratedAt: body.aiSummaryGeneratedAt
          ? new Date(body.aiSummaryGeneratedAt)
          : null,
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
        aiSummary: body.aiSummary,
        aiSummaryGeneratedAt: body.aiSummaryGeneratedAt
          ? new Date(body.aiSummaryGeneratedAt)
          : null,
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (err) {
    console.error('[weekly-plans POST] error:', err);
    const message = err instanceof Error ? err.message : 'Unknown server error';
    return NextResponse.json(
      { error: `保存周计划失败: ${message}`, details: message },
      { status: 500 }
    );
  }
}
