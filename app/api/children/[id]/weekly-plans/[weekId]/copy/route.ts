import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { weeklyPlanCopySchema, validateBody } from '@/lib/validation';
import { canManageChild, canViewChild } from '@/lib/family';
import { normalizeWeeklyTask } from '@/lib/taskAlignment';
import type { WeeklyTaskItem, WeeklyGoal } from '@/lib/storage.types';

type Params = { params: { id: string; weekId: string } };

export async function POST(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(req, weeklyPlanCopySchema);
  if (!validation.success) {
    return validation.response;
  }

  const { sourceWeekId, targetWeekId } = validation.data;
  const childId = params.id;

  if (targetWeekId !== params.weekId) {
    return NextResponse.json(
      { error: '目标周 ID 与 URL 不一致' },
      { status: 400 }
    );
  }

  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child || !(await canViewChild(session.user.id, child))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (!(await canManageChild(session.user.id, child))) {
    return NextResponse.json({ error: '无权限管理该孩子' }, { status: 403 });
  }

  const sourcePlan = await prisma.weeklyPlan.findUnique({
    where: { childId_weekId: { childId, weekId: sourceWeekId } },
  });

  if (!sourcePlan) {
    return NextResponse.json(
      { error: '源周计划不存在' },
      { status: 404 }
    );
  }

  const rawTasks = (sourcePlan.tasks as unknown as Partial<WeeklyTaskItem>[]) || [];
  const copiedTasks: WeeklyTaskItem[] = rawTasks.map((task) =>
    normalizeWeeklyTask({
      ...task,
      id: `copy-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      status: 'pending',
      completedAt: undefined,
      completionRecords: undefined,
    } as WeeklyTaskItem)
  );

  const rawGoals = (sourcePlan.goals as unknown as WeeklyGoal[]) || [];
  const copiedGoals: WeeklyGoal[] = rawGoals.map((goal) => ({
    ...goal,
    id: `copy-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    quantityDone: 0,
    checklist: (goal.checklist || []).map((item) => ({
      ...item,
      id: `copy-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      done: false,
    })),
  }));

  const targetPlan = await prisma.weeklyPlan.upsert({
    where: { childId_weekId: { childId, weekId: targetWeekId } },
    update: {
      tasks: copiedTasks as unknown as object[],
      goals: copiedGoals as unknown as object[],
      publishedAt: new Date(),
    },
    create: {
      userId: session.user.id,
      childId,
      weekId: targetWeekId,
      tasks: copiedTasks as unknown as object[],
      goals: copiedGoals as unknown as object[],
      publishedAt: new Date(),
    },
  });

  return NextResponse.json({
    ...targetPlan,
    tasks: copiedTasks,
    goals: copiedGoals,
  });
}
