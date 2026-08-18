import { prisma } from '@/lib/prisma';
import type { WeeklyTaskItem, TaskCategory, DayOfWeek } from '@/lib/storage.types';
import { getReadingTargetByGrade } from '@/lib/subjects/readingLiteracy';
import { parseDurationMinutes } from '@/lib/weeklyTasks';
import type { ReportPeriod } from './date';
import { getPeriodWeekIds } from './date';

export interface TaskAggregation {
  totalTasks: number;
  completedTasks: number;
  partiallyDoneTasks: number;
  skippedTasks: number;
  pendingTasks: number;
  completionRate: number;
  actualMinutesTotal: number;
  estimatedMinutesTotal: number;
  byCategory: Array<{ category: TaskCategory; label: string; total: number; done: number; rate: number }>;
  byDay: Array<{ day: DayOfWeek; total: number; done: number }>;
  dailyTrend: Array<{ date: string; total: number; done: number }>;
}

export interface ReadingAggregation {
  totalMinutes: number;
  readingCount: number;
  bookCount: number;
  targetMinutes: number;
  targetMetRate: number;
  byType: Array<{ type: string; count: number; minutes: number }>;
  dailyMinutes: Array<{ date: string; minutes: number }>;
}

export interface EvidenceAggregation {
  totalCount: number;
  confirmedCount: number;
  pendingCount: number;
  rejectedCount: number;
  byDimension: Array<{ dimensionId: string; dimensionName: string; count: number }>;
}

export interface PointAggregation {
  earned: number;
  spent: number;
  net: number;
  bySource: Record<string, number>;
}

export interface AggregatedReportData {
  child: {
    id: string;
    name: string;
    grade: number;
  };
  period: ReportPeriod;
  tasks: TaskAggregation;
  reading: ReadingAggregation;
  evidence: EvidenceAggregation;
  points: PointAggregation;
}

const CATEGORY_LABELS: Record<TaskCategory, string> = {
  school: '校内学习',
  reading: '阅读',
  sport: '运动',
  interest: '兴趣',
  ability: '能力',
  other: '其他',
};

const DAY_ORDER: DayOfWeek[] = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const EVIDENCE_DIMENSION_MAP: Record<string, string> = {
  character_assessment: '认读能力',
  independent_reading: '理解能力',
  vocabulary_understanding: '理解能力',
  discourse_structure: '鉴赏能力',
  reading_expression: '创新能力',
};

const READING_ABILITY_NAMES: Record<string, string> = {
  recognition: '认读能力',
  comprehension: '理解能力',
  appreciation: '鉴赏能力',
  evaluation: '评价能力',
  application: '应用能力',
  innovation: '创新能力',
};

function normalizeTasks(raw: unknown): WeeklyTaskItem[] {
  return Array.isArray(raw) ? (raw as WeeklyTaskItem[]) : [];
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function isDateInRange(dateStr: string, start: Date, end: Date): boolean {
  const d = new Date(dateStr);
  return d >= start && d <= end;
}

export async function aggregateReportData(
  childId: string,
  period: ReportPeriod
): Promise<AggregatedReportData> {
  const child = await prisma.child.findUnique({
    where: { id: childId },
    select: { id: true, name: true, grade: true },
  });
  if (!child) {
    throw new Error('Child not found');
  }

  const { periodStart, periodEnd } = period;

  const [taskStats, readingStats, evidenceStats, pointStats] = await Promise.all([
    aggregateTasks(childId, periodStart, periodEnd),
    aggregateReading(childId, periodStart, periodEnd, child.grade),
    aggregateEvidence(childId, periodStart, periodEnd),
    aggregatePoints(childId, periodStart, periodEnd),
  ]);

  return {
    child: {
      id: child.id,
      name: child.name,
      grade: child.grade,
    },
    period,
    tasks: taskStats,
    reading: readingStats,
    evidence: evidenceStats,
    points: pointStats,
  };
}

async function aggregateTasks(
  childId: string,
  periodStart: Date,
  periodEnd: Date
): Promise<TaskAggregation> {
  const weekIds = getPeriodWeekIds(periodStart, periodEnd);

  const plans = await prisma.weeklyPlan.findMany({
    where: { childId, weekId: { in: weekIds } },
    select: { weekId: true, tasks: true },
  });

  let totalTasks = 0;
  let completedTasks = 0;
  let partiallyDoneTasks = 0;
  let skippedTasks = 0;
  let pendingTasks = 0;
  let actualMinutesTotal = 0;
  let estimatedMinutesTotal = 0;

  const byCategory = new Map<TaskCategory, { total: number; done: number }>();
  const byDay = new Map<DayOfWeek, { total: number; done: number }>();
  const dailyMap = new Map<string, { total: number; done: number }>();

  DAY_ORDER.forEach((day) => byDay.set(day, { total: 0, done: 0 }));

  plans.forEach((plan) => {
    const tasks = normalizeTasks(plan.tasks);
    tasks.forEach((task) => {
      const category = task.category || 'other';
      const day = task.day;
      const record = (task.completionRecords ?? []).slice(-1)[0];
      const status = record?.status ?? task.status ?? 'pending';
      const actualMinutes = record?.actualDurationMinutes ?? 0;
      const estimatedMinutes = parseDurationMinutes(task.duration);

      totalTasks += 1;
      estimatedMinutesTotal += estimatedMinutes;

      if (!byCategory.has(category)) {
        byCategory.set(category, { total: 0, done: 0 });
      }
      const cat = byCategory.get(category)!;
      cat.total += 1;

      const dayStats = byDay.get(day) ?? { total: 0, done: 0 };
      dayStats.total += 1;

      if (status === 'done') {
        completedTasks += 1;
        cat.done += 1;
        dayStats.done += 1;
      } else if (status === 'partially_done') {
        partiallyDoneTasks += 1;
        cat.done += 1;
        dayStats.done += 1;
      } else if (status === 'skipped') {
        skippedTasks += 1;
      } else {
        pendingTasks += 1;
      }

      actualMinutesTotal += actualMinutes;

      // Aggregate by completion record date when available
      if (record?.date) {
        const dateKey = record.date.slice(0, 10);
        if (!dailyMap.has(dateKey)) {
          dailyMap.set(dateKey, { total: 0, done: 0 });
        }
        const daily = dailyMap.get(dateKey)!;
        daily.total += 1;
        if (status === 'done' || status === 'partially_done') {
          daily.done += 1;
        }
      }
    });
  });

  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const byCategoryResult = Array.from(byCategory.entries())
    .map(([category, stats]) => ({
      category,
      label: CATEGORY_LABELS[category] ?? category,
      total: stats.total,
      done: stats.done,
      rate: stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100),
    }))
    .sort((a, b) => b.total - a.total);

  const byDayResult = DAY_ORDER.map((day) => ({
    day,
    total: byDay.get(day)?.total ?? 0,
    done: byDay.get(day)?.done ?? 0,
  }));

  // Build daily trend for the period
  const dailyTrend: Array<{ date: string; total: number; done: number }> = [];
  const cursor = new Date(periodStart);
  while (cursor <= periodEnd) {
    const dateKey = toISODate(cursor);
    const stats = dailyMap.get(dateKey) ?? { total: 0, done: 0 };
    dailyTrend.push({ date: dateKey, total: stats.total, done: stats.done });
    cursor.setDate(cursor.getDate() + 1);
  }

  return {
    totalTasks,
    completedTasks,
    partiallyDoneTasks,
    skippedTasks,
    pendingTasks,
    completionRate,
    actualMinutesTotal,
    estimatedMinutesTotal,
    byCategory: byCategoryResult,
    byDay: byDayResult,
    dailyTrend,
  };
}

async function aggregateReading(
  childId: string,
  periodStart: Date,
  periodEnd: Date,
  grade: number
): Promise<ReadingAggregation> {
  const records = await prisma.readingRecord.findMany({
    where: {
      childId,
      readDate: { gte: periodStart, lte: periodEnd },
    },
    select: {
      readDate: true,
      durationMinutes: true,
      readingBookId: true,
      readingBook: { select: { textType: true } },
    },
    orderBy: { readDate: 'asc' },
  });

  const totalMinutes = records.reduce((sum, r) => sum + (r.durationMinutes ?? 0), 0);
  const readingCount = records.length;
  const bookIds = new Set(records.map((r) => r.readingBookId));
  const bookCount = bookIds.size;

  const target = getReadingTargetByGrade(grade);
  const daysDiff = Math.max(1, Math.round((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  const targetMinutes = target ? target.dailyMinutes * daysDiff : 0;
  const targetMetRate = targetMinutes === 0 ? 0 : Math.min(100, Math.round((totalMinutes / targetMinutes) * 100));

  const byType = new Map<string, { count: number; minutes: number }>();
  const dailyMinutes = new Map<string, number>();

  records.forEach((r) => {
    const type = r.readingBook?.textType ?? 'other';
    if (!byType.has(type)) {
      byType.set(type, { count: 0, minutes: 0 });
    }
    const t = byType.get(type)!;
    t.count += 1;
    t.minutes += r.durationMinutes ?? 0;

    const dateKey = toISODate(r.readDate);
    dailyMinutes.set(dateKey, (dailyMinutes.get(dateKey) ?? 0) + (r.durationMinutes ?? 0));
  });

  return {
    totalMinutes,
    readingCount,
    bookCount,
    targetMinutes,
    targetMetRate,
    byType: Array.from(byType.entries()).map(([type, stats]) => ({
      type: type === 'other' ? '其他' : type,
      count: stats.count,
      minutes: stats.minutes,
    })),
    dailyMinutes: Array.from(dailyMinutes.entries())
      .map(([date, minutes]) => ({ date, minutes }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}

async function aggregateEvidence(
  childId: string,
  periodStart: Date,
  periodEnd: Date
): Promise<EvidenceAggregation> {
  const evidences = await prisma.readingEvidence.findMany({
    where: {
      childId,
      occurredAt: { gte: periodStart, lte: periodEnd },
    },
    select: {
      status: true,
      type: true,
      indicatorIds: true,
    },
  });

  let confirmedCount = 0;
  let pendingCount = 0;
  let rejectedCount = 0;
  const byDimension = new Map<string, { dimensionId: string; dimensionName: string; count: number }>();

  evidences.forEach((e) => {
    if (e.status === 'confirmed') confirmedCount += 1;
    else if (e.status === 'rejected') rejectedCount += 1;
    else pendingCount += 1;

    const indicatorIds = Array.isArray(e.indicatorIds) ? (e.indicatorIds as string[]) : [];
    if (indicatorIds.length === 0) {
      const mapped = EVIDENCE_DIMENSION_MAP[e.type] ?? '其他';
      const key = mapped;
      if (!byDimension.has(key)) {
        byDimension.set(key, { dimensionId: e.type, dimensionName: mapped, count: 0 });
      }
      byDimension.get(key)!.count += 1;
    } else {
      indicatorIds.forEach((id) => {
        const name = READING_ABILITY_NAMES[id] ?? id;
        if (!byDimension.has(id)) {
          byDimension.set(id, { dimensionId: id, dimensionName: name, count: 0 });
        }
        byDimension.get(id)!.count += 1;
      });
    }
  });

  return {
    totalCount: evidences.length,
    confirmedCount,
    pendingCount,
    rejectedCount,
    byDimension: Array.from(byDimension.values()).sort((a, b) => b.count - a.count),
  };
}

async function aggregatePoints(
  childId: string,
  periodStart: Date,
  periodEnd: Date
): Promise<PointAggregation> {
  const logs = await prisma.pointLog.findMany({
    where: {
      childId,
      createdAt: { gte: periodStart, lte: periodEnd },
    },
    select: { points: true, source: true },
  });

  let earned = 0;
  let spent = 0;
  const bySource: Record<string, number> = {};

  logs.forEach((log) => {
    if (log.points > 0) earned += log.points;
    else spent += Math.abs(log.points);

    bySource[log.source] = (bySource[log.source] ?? 0) + log.points;
  });

  return { earned, spent, net: earned - spent, bySource };
}
