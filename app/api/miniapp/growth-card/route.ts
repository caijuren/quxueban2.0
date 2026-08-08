import { NextResponse } from 'next/server';
import { getMiniAppUser, unauthorizedResponse } from '@/lib/miniapp/auth';
import { prisma } from '@/lib/prisma';
import { getCurrentWeekId, getPlanStats } from '@/lib/weeklyTasks';
import { normalizeWeeklyTask } from '@/lib/taskAlignment';
import type { NextRequest } from 'next/server';
import type { WeeklyTaskItem, TaskCompletionRecord, WeeklyPlan } from '@/lib/storage.types';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function getDateStr(date: Date) {
  return date.toISOString().split('T')[0];
}

function computeStreak(plans: Array<{ tasks: unknown; weekId: string }>): number {
  const completionByDate = new Map<string, { total: number; done: number }>();

  plans.forEach((plan) => {
    const rawTasks = (plan.tasks as unknown as Partial<WeeklyTaskItem>[]) || [];
    const tasks = rawTasks.map((task) => normalizeWeeklyTask(task as WeeklyTaskItem));

    tasks.forEach((task) => {
      const records = task.completionRecords || [];
      records.forEach((record: TaskCompletionRecord) => {
        const entry = completionByDate.get(record.date) || { total: 0, done: 0 };
        entry.total += 1;
        if (record.status === 'done') {
          entry.done += 1;
        }
        completionByDate.set(record.date, entry);
      });
    });
  });

  const today = new Date();
  let streak = 0;

  // 从今天开始往前数连续有完成任务的天数（今天已完成才计入）
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = getDateStr(d);
    const entry = completionByDate.get(dateStr);

    if (entry && entry.done > 0) {
      streak += 1;
    } else if (i === 0) {
      // 今天还没打卡，从昨天开始算
      continue;
    } else {
      break;
    }
  }

  return streak;
}

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
  const todayStr = getTodayStr();

  const [currentPlan, recentPlans, badges, milestones] = await Promise.all([
    prisma.weeklyPlan.findUnique({
      where: { childId_weekId: { childId, weekId } },
    }),
    prisma.weeklyPlan.findMany({
      where: { childId },
      orderBy: { weekId: 'desc' },
      take: 12,
    }),
    prisma.badge.findMany({
      where: { childId },
      orderBy: { unlockedAt: 'desc' },
      take: 20,
    }),
    prisma.milestone.findMany({
      where: { childId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ]);

  let weeklyStats = {
    total: 0,
    done: 0,
    pending: 0,
    completionRate: 0,
    estimatedMinutes: 0,
  };

  if (currentPlan) {
    const rawTasks = (currentPlan.tasks as unknown as Partial<WeeklyTaskItem>[]) || [];
    const normalizedTasks = rawTasks.map((task) => normalizeWeeklyTask(task as WeeklyTaskItem));
    const stats = getPlanStats({
      tasks: normalizedTasks,
      weekId: currentPlan.weekId,
      childId: currentPlan.childId,
    } as WeeklyPlan);
    weeklyStats = {
      total: stats.total,
      done: stats.done,
      pending: stats.pending,
      completionRate: stats.completionRate,
      estimatedMinutes: stats.estimatedMinutes,
    };
  }

  const streak = computeStreak(recentPlans);

  const todayRecords: TaskCompletionRecord[] = [];
  recentPlans.forEach((plan) => {
    const rawTasks = (plan.tasks as unknown as Partial<WeeklyTaskItem>[]) || [];
    const tasks = rawTasks.map((task) => normalizeWeeklyTask(task as WeeklyTaskItem));
    tasks.forEach((task) => {
      (task.completionRecords || []).forEach((record) => {
        if (record.date === todayStr) {
          todayRecords.push(record);
        }
      });
    });
  });

  const todayDone = todayRecords.filter((r) => r.status === 'done').length;
  const todayMinutes = todayRecords.reduce((sum, r) => sum + (r.actualDurationMinutes || 0), 0);

  return NextResponse.json({
    weeklyStats,
    streak,
    todayDone,
    todayMinutes,
    badges: badges.map((b) => ({
      id: b.id,
      key: b.key,
      name: b.name,
      description: b.description,
      icon: b.icon,
      color: b.color,
      level: b.level,
      unlockedAt: b.unlockedAt.toISOString(),
    })),
    milestones: milestones.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      targetGrade: m.targetGrade,
      targetPeriod: m.targetPeriod,
      status: m.status,
      completedAt: m.completedAt?.toISOString() || null,
      score: m.score,
    })),
  });
}
