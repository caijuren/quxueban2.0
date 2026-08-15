// 阅读梯级进度：从每周阅读打卡数据推导梯级，用于成长报告的趋势曲线
import { getReadingLadderByGrade, getReadingTargetByGrade } from './subjects/readingLiteracy';
import { WeeklyPlan, TaskCategory } from './storage.types';
import { getWeekRange, getISOWeek } from './weeklyTasks';

export interface WeeklyReadingProgress {
  weekId: string;
  label: string;
  minutes: number;
  targetMinutes: number;
  completionRate: number; // 0-100
  score: number; // 0-100 达成指数
  ladder: number; // 1-12
  hasData: boolean;
}

function getLatestRecord(task: {
  completionRecords?: Array<{ date?: string; status?: string; actualDurationMinutes?: number }>;
}) {
  const records = task.completionRecords ?? [];
  return records[records.length - 1];
}

export function computeWeeklyReadingProgress(
  plan: Pick<WeeklyPlan, 'weekId' | 'tasks'>,
  grade: number
): WeeklyReadingProgress {
  const baseLadder = getReadingLadderByGrade(grade);
  const target = getReadingTargetByGrade(grade);
  const targetMinutes = target ? target.dailyMinutes * 7 : 0;

  const readingTasks = plan.tasks.filter(
    (t) => (t.category || 'other') === ('reading' as TaskCategory)
  );

  let minutes = 0;
  let doneCount = 0;
  readingTasks.forEach((task) => {
    const record = getLatestRecord(task);
    minutes += record?.actualDurationMinutes ?? 0;
    if (record?.status === 'done' || record?.status === 'partially_done') doneCount++;
  });

  const hasData = readingTasks.length > 0 && minutes > 0;
  const completionRate =
    readingTasks.length > 0 ? Math.round((doneCount / readingTasks.length) * 100) : 0;

  const minutesRatio = targetMinutes > 0 ? minutes / targetMinutes : 0;
  const completion = completionRate / 100;
  const score = Math.round(Math.min(120, minutesRatio * 60 + completion * 40));

  let ladder = baseLadder;
  if (hasData) {
    if (minutesRatio >= 1.3 && completion >= 0.8) ladder = Math.min(12, baseLadder + 1);
    else if (minutesRatio >= 0.85 && completion >= 0.6) ladder = baseLadder;
    else if (minutesRatio >= 0.6) ladder = Math.max(1, baseLadder - 1);
    else if (minutesRatio >= 0.35) ladder = Math.max(1, baseLadder - 2);
    else ladder = Math.max(1, baseLadder - 3);
  }

  return {
    weekId: plan.weekId,
    label: plan.weekId,
    minutes,
    targetMinutes,
    completionRate,
    score,
    ladder,
    hasData,
  };
}

export function computeReadingLadderTrend(
  weeklyPlans: Array<Pick<WeeklyPlan, 'weekId' | 'tasks'>>,
  grade: number,
  currentWeekId: string,
  weeks = 8
): WeeklyReadingProgress[] {
  const result: WeeklyReadingProgress[] = [];
  const planByWeek = new Map(weeklyPlans.map((p) => [p.weekId, p]));

  let weekId = currentWeekId;
  for (let i = 0; i < weeks; i++) {
    const plan = planByWeek.get(weekId);
    if (plan) {
      result.unshift(computeWeeklyReadingProgress(plan, grade));
    } else {
      result.unshift({
        weekId,
        label: weekId,
        minutes: 0,
        targetMinutes: 0,
        completionRate: 0,
        score: 0,
        ladder: 0,
        hasData: false,
      });
    }
    weekId = shiftWeekId(weekId, -1);
  }

  return result;
}

function shiftWeekId(weekId: string, delta: number): string {
  const { start } = getWeekRange(weekId);
  const next = new Date(start);
  next.setDate(start.getDate() + delta * 7);
  return getISOWeek(next).weekId;
}
