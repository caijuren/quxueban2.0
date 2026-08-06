import { prisma } from './prisma';
import { normalizeWeeklyTask } from './taskAlignment';
import { getCurrentWeekId } from './weeklyTasks';
import { TaskCompletionRecord, WeeklyTaskItem } from './storage.types';

export interface WeeklyStats {
  completed: number;
  total: number;
  weekId: string;
}

export interface GamificationContext {
  userId: string;
  childId: string;
  weeklyStats?: WeeklyStats;
  completionRecords?: TaskCompletionRecord[];
  milestoneCompleted?: boolean;
}

export interface BadgeDefinition {
  key: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  points: number;
  condition: (
    context: GamificationContext,
    existingKeys: string[],
    streaks: { currentStreak: number; longestStreak: number }
  ) => boolean;
}

export interface BadgeAwardResult {
  newBadges: BadgeDefinition[];
  pointsAdded: number;
  totalPoints: number;
  streaks: { currentStreak: number; longestStreak: number };
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    key: 'first_checkin',
    name: '首次打卡',
    description: '完成第一次任务打卡',
    icon: 'Star',
    color: '#f59e0b',
    points: 10,
    condition: (context) =>
      (context.completionRecords?.some((r) => r.status === 'done') ?? false),
  },
  {
    key: 'week_perfect',
    name: '周计划达人',
    description: '本周任务全部完成',
    icon: 'Trophy',
    color: '#10b981',
    points: 50,
    condition: (context) =>
      !!context.weeklyStats &&
      context.weeklyStats.total > 0 &&
      context.weeklyStats.completed >= context.weeklyStats.total,
  },
  {
    key: 'streak_7',
    name: '坚持一周',
    description: '连续 7 天完成打卡',
    icon: 'Flame',
    color: '#f43f5e',
    points: 30,
    condition: (_, __, streaks) => streaks.currentStreak >= 7,
  },
  {
    key: 'streak_21',
    name: '习惯养成',
    description: '连续 21 天完成打卡',
    icon: 'Zap',
    color: '#8b5cf6',
    points: 100,
    condition: (_, __, streaks) => streaks.currentStreak >= 21,
  },
  {
    key: 'milestone_complete',
    name: '里程碑达成',
    description: '完成一个重要里程碑',
    icon: 'Medal',
    color: '#06b6d4',
    points: 80,
    condition: (context) => context.milestoneCompleted === true,
  },
];

function getDoneDates(records: TaskCompletionRecord[]): string[] {
  const doneSet = new Set(
    records.filter((r) => r.status === 'done').map((r) => r.date)
  );
  return Array.from(doneSet).sort();
}

export function calculateStreak(
  _childId: string,
  completionRecords: TaskCompletionRecord[]
): { currentStreak: number; longestStreak: number } {
  const dates = getDoneDates(completionRecords);
  if (dates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  let longestStreak = 1;
  let currentRun = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      currentRun++;
    } else {
      currentRun = 1;
    }
    longestStreak = Math.max(longestStreak, currentRun);
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const lastDate = dates[dates.length - 1];
  let currentStreak = 0;
  if (lastDate === todayStr || lastDate === yesterdayStr) {
    currentStreak = 1;
    for (let i = dates.length - 2; i >= 0; i--) {
      const d1 = new Date(dates[i]);
      const d2 = new Date(dates[i + 1]);
      const diff = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return { currentStreak, longestStreak };
}

export async function getGamificationContext(
  childId: string,
  userId: string
): Promise<GamificationContext> {
  const plans = await prisma.weeklyPlan.findMany({
    where: { childId, userId },
  });

  const records: TaskCompletionRecord[] = [];
  let weeklyStats: WeeklyStats | undefined;
  const currentWeekId = getCurrentWeekId();

  for (const plan of plans) {
    const rawTasks =
      (plan.tasks as unknown as Partial<WeeklyTaskItem>[]) || [];
    const tasks = rawTasks.map((task) =>
      normalizeWeeklyTask(task as WeeklyTaskItem)
    );

    for (const task of tasks) {
      if (task.completionRecords) {
        records.push(...task.completionRecords);
      }
    }

    if (plan.weekId === currentWeekId) {
      const completed = tasks.filter((t) => t.status === 'done').length;
      weeklyStats = {
        completed,
        total: tasks.length,
        weekId: currentWeekId,
      };
    }
  }

  return {
    userId,
    childId,
    completionRecords: records,
    weeklyStats,
  };
}

async function getCurrentTotalPoints(
  userId: string,
  childId: string
): Promise<number> {
  const latest = await prisma.pointLog.findFirst({
    where: { userId, childId },
    orderBy: { createdAt: 'desc' },
    select: { total: true },
  });
  return latest?.total ?? 0;
}

export async function checkAndAwardBadges(
  childId: string,
  context: GamificationContext
): Promise<BadgeAwardResult> {
  const { userId } = context;

  const existingBadges = await prisma.badge.findMany({
    where: { userId, childId },
    select: { key: true },
  });
  const existingKeys = existingBadges.map((b) => b.key);

  const streaks = calculateStreak(
    childId,
    context.completionRecords ?? []
  );

  const newBadges = BADGE_DEFINITIONS.filter((badge) => {
    if (existingKeys.includes(badge.key)) return false;
    return badge.condition(context, existingKeys, streaks);
  });

  let pointsAdded = 0;

  if (context.weeklyStats && context.weeklyStats.completed > 0) {
    pointsAdded += context.weeklyStats.completed * 5;
  }
  if (context.milestoneCompleted) {
    pointsAdded += 50;
  }
  for (const badge of newBadges) {
    pointsAdded += badge.points;
  }

  const previousTotal = await getCurrentTotalPoints(userId, childId);
  const totalPoints = previousTotal + pointsAdded;

  if (newBadges.length > 0) {
    await prisma.badge.createMany({
      data: newBadges.map((badge) => ({
        userId,
        childId,
        key: badge.key,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        color: badge.color,
        level: 1,
      })),
      skipDuplicates: true,
    });
  }

  if (pointsAdded > 0) {
    await prisma.pointLog.create({
      data: {
        userId,
        childId,
        points: pointsAdded,
        total: totalPoints,
        reason:
          newBadges.length > 0
            ? `获得徽章：${newBadges.map((b) => b.name).join('、')}`
            : '任务完成奖励',
        source: 'system',
      },
    });
  }

  return {
    newBadges,
    pointsAdded,
    totalPoints,
    streaks,
  };
}
