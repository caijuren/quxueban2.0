import { NextResponse } from 'next/server';
import { getMiniAppUser, unauthorizedResponse } from '@/lib/miniapp/auth';
import { prisma } from '@/lib/prisma';
import { getCurrentWeekId, getPlanStats } from '@/lib/weeklyTasks';
import { normalizeWeeklyTask } from '@/lib/taskAlignment';
import type { NextRequest } from 'next/server';
import type { WeeklyPlan, WeeklyTaskItem } from '@/lib/storage.types';

export async function GET(req: NextRequest) {
  const auth = await getMiniAppUser(req);
  if (!auth) return unauthorizedResponse();

  let childId: string;

  if (auth.type === 'child') {
    childId = auth.childId;
  } else {
    const { searchParams } = new URL(req.url);
    const requestedChildId = searchParams.get('childId');

    if (!requestedChildId) {
      return NextResponse.json({ error: '缺少 childId' }, { status: 400 });
    }

    const child = await prisma.child.findFirst({
      where: { id: requestedChildId, userId: auth.userId },
    });

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    childId = requestedChildId;
  }

  const weekId = getCurrentWeekId();

  const plan = await prisma.weeklyPlan.findUnique({
    where: {
      childId_weekId: {
        childId,
        weekId,
      },
    },
  });

  if (!plan) {
    return NextResponse.json({
      weekId,
      tasks: [],
      stats: {
        total: 0,
        done: 0,
        skipped: 0,
        pending: 0,
        completionRate: 0,
        estimatedMinutes: 0,
      },
    });
  }

  const rawTasks = (plan.tasks as unknown as Partial<WeeklyTaskItem>[]) || [];
  const normalizedTasks = rawTasks.map((task) => normalizeWeeklyTask(task as WeeklyTaskItem));

  const stats = getPlanStats({
    tasks: normalizedTasks,
    weekId: plan.weekId,
    childId: plan.childId,
  } as WeeklyPlan);

  return NextResponse.json({
    weekId,
    tasks: normalizedTasks,
    stats: {
      total: stats.total,
      done: stats.done,
      skipped: stats.skipped,
      pending: stats.pending,
      completionRate: stats.completionRate,
      estimatedMinutes: stats.estimatedMinutes,
    },
  });
}
