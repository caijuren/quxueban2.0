import { WeeklyTaskItem, DayOfWeek, TaskCategory } from './storage.types';
import { parseDurationMinutes, dayOrder } from './weeklyTasks';

export type ConflictType = 'daily_overload' | 'category_concentration' | 'late_evening';

export interface WeeklyPlanConflict {
  id: string;
  type: ConflictType;
  day: DayOfWeek;
  message: string;
  severity: 'warning' | 'error';
  details?: {
    minutes?: number;
    category?: TaskCategory;
    categoryRatio?: number;
    taskIds?: string[];
  };
}

const SCHOOL_DAY_LIMIT = 120;
const WEEKEND_LIMIT = 180;
const CATEGORY_CONCENTRATION_THRESHOLD = 0.5;
const WEEKEND_DAYS: DayOfWeek[] = ['周六', '周日'];

function isWeekend(day: DayOfWeek): boolean {
  return WEEKEND_DAYS.includes(day);
}

function getConflictId(type: ConflictType, day: DayOfWeek, suffix?: string): string {
  return `${type}-${day}${suffix ? `-${suffix}` : ''}`;
}

export function detectConflicts(tasks: WeeklyTaskItem[]): WeeklyPlanConflict[] {
  const conflicts: WeeklyPlanConflict[] = [];

  const tasksByDay = dayOrder.reduce((acc, day) => {
    acc[day] = tasks.filter((t) => t.day === day);
    return acc;
  }, {} as Record<DayOfWeek, WeeklyTaskItem[]>);

  dayOrder.forEach((day) => {
    const dayTasks = tasksByDay[day];
    if (dayTasks.length === 0) return;

    const totalMinutes = dayTasks.reduce(
      (sum, t) => sum + parseDurationMinutes(t.duration),
      0
    );
    const limit = isWeekend(day) ? WEEKEND_LIMIT : SCHOOL_DAY_LIMIT;

    if (totalMinutes > limit) {
      conflicts.push({
        id: getConflictId('daily_overload', day),
        type: 'daily_overload',
        day,
        message: `${day} 任务总时长约 ${totalMinutes} 分钟，超过建议上限 ${limit} 分钟`,
        severity: totalMinutes > limit * 1.3 ? 'error' : 'warning',
        details: { minutes: totalMinutes },
      });
    }

    const categoryCounts = dayTasks.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {} as Record<TaskCategory, number>);

    Object.entries(categoryCounts).forEach(([category, count]) => {
      const ratio = count / dayTasks.length;
      if (ratio > CATEGORY_CONCENTRATION_THRESHOLD) {
        conflicts.push({
          id: getConflictId('category_concentration', day, category),
          type: 'category_concentration',
          day,
          message: `${day} ${getCategoryLabel(category as TaskCategory)}任务占比 ${Math.round(
            ratio * 100
          )}%，建议增加多样性`,
          severity: 'warning',
          details: {
            category: category as TaskCategory,
            categoryRatio: ratio,
          },
        });
      }
    });

    const nightTasks = dayTasks.filter((t) => t.timeSlot === 'night');
    if (nightTasks.length > 0) {
      conflicts.push({
        id: getConflictId('late_evening', day),
        type: 'late_evening',
        day,
        message: `${day} 有 ${nightTasks.length} 项夜间任务，可能影响休息`,
        severity: 'warning',
        details: { taskIds: nightTasks.map((t) => t.id) },
      });
    }
  });

  return conflicts;
}

function getCategoryLabel(category: TaskCategory): string {
  const labels: Record<TaskCategory, string> = {
    school: '校内',
    reading: '阅读',
    sport: '体育',
    interest: '兴趣',
    ability: '能力',
    other: '其他',
  };
  return labels[category] || category;
}

export function hasBlockingConflicts(tasks: WeeklyTaskItem[]): boolean {
  return detectConflicts(tasks).some((c) => c.severity === 'error');
}
