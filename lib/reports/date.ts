import { getISOWeek, getWeekRange, parseWeekId, formatWeekLabel } from '@/lib/weeklyTasks';

export interface ReportPeriod {
  periodStart: Date;
  periodEnd: Date;
  label: string;
}

function startOfDay(d: Date): Date {
  const t = new Date(d);
  t.setHours(0, 0, 0, 0);
  return t;
}

function endOfDay(d: Date): Date {
  const t = new Date(d);
  t.setHours(23, 59, 59, 999);
  return t;
}

function addDays(d: Date, days: number): Date {
  const t = new Date(d);
  t.setDate(t.getDate() + days);
  return t;
}

export function getWeeklyPeriod(date: Date = new Date()): ReportPeriod & { weekId: string } {
  const { weekId } = getISOWeek(date);
  const { start, end } = getWeekRange(weekId);
  return {
    weekId,
    periodStart: startOfDay(start),
    periodEnd: endOfDay(end),
    label: formatWeekLabel(weekId),
  };
}

export function getMonthlyPeriod(date: Date = new Date()): ReportPeriod {
  const year = date.getFullYear();
  const month = date.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return {
    periodStart: startOfDay(start),
    periodEnd: endOfDay(end),
    label: `${year}年${month + 1}月`,
  };
}

export function getPeriodWeekIds(periodStart: Date, periodEnd: Date): string[] {
  const weekIds = new Set<string>();
  let cursor = startOfDay(periodStart);
  const end = endOfDay(periodEnd);

  while (cursor <= end) {
    const { weekId } = getISOWeek(cursor);
    weekIds.add(weekId);
    cursor = addDays(cursor, 7);
  }

  return Array.from(weekIds);
}

export function formatPeriodLabel(type: 'WEEKLY' | 'MONTHLY', periodStart: Date): string {
  if (type === 'WEEKLY') {
    const { weekId } = getISOWeek(periodStart);
    return formatWeekLabel(weekId);
  }
  const d = new Date(periodStart);
  return `${d.getFullYear()}年${d.getMonth() + 1}月`;
}

export function getPreviousPeriodStart(
  type: 'WEEKLY' | 'MONTHLY',
  periodStart: Date
): Date {
  const d = new Date(periodStart);
  if (type === 'WEEKLY') {
    d.setDate(d.getDate() - 7);
    return getWeeklyPeriod(d).periodStart;
  }
  d.setMonth(d.getMonth() - 1);
  return getMonthlyPeriod(d).periodStart;
}
