import { Child } from '@/lib/children';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { normalizeWeeklyTask } from '@/lib/taskAlignment';
import { WeeklyTaskItem } from '@/lib/storage.types';
import { DailySummaryInput } from './dailySummary';

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: '未完成',
    in_progress: '进行中',
    partially_done: '部分完成',
    done: '已完成',
    skipped: '跳过',
    rescheduled: '改期',
  };
  return map[status] || status;
}

function getQualityLabel(quality: string | null): string {
  if (!quality) return '';
  const map: Record<string, string> = {
    excellent: '优秀',
    good: '良好',
    average: '一般',
    needs_work: '需努力',
  };
  return map[quality] || quality;
}

export function buildDailySummaryInput(
  child: Child,
  date: string,
  dayName: string,
  rawTasks: Partial<WeeklyTaskItem>[],
  options?: { taskIds?: string[] }
): { input: DailySummaryInput; todayTasks: WeeklyTaskItem[] } | null {
  const tasks = rawTasks.map((task) => normalizeWeeklyTask(task as WeeklyTaskItem));

  const todayTasks = tasks.filter((t) => {
    if (options?.taskIds && options.taskIds.length > 0) {
      return options.taskIds.includes(t.id);
    }
    return t.day === dayName;
  });

  if (todayTasks.length === 0) {
    return null;
  }

  const doneCount = todayTasks.filter((t) => t.status === 'done').length;
  const partialCount = todayTasks.filter((t) => t.status === 'partially_done').length;
  const pendingCount = todayTasks.filter((t) => t.status === 'pending' || t.status === 'in_progress').length;
  const skippedCount = todayTasks.filter((t) => t.status === 'skipped' || t.status === 'rescheduled').length;
  const totalActualMinutes = todayTasks.reduce((sum, t) => {
    const record = t.completionRecords?.find((r) => r.date === date);
    return sum + (record?.actualDurationMinutes || 0);
  }, 0);

  const summaryInputTasks = todayTasks.map((task) => {
    const record = task.completionRecords?.find((r) => r.date === date);
    const category = TASK_CATEGORY_LABELS[task.category] || '其他';
    return {
      focus: task.focus,
      categoryLabel: category,
      statusLabel: getStatusLabel(task.status),
      progress: record?.progress ?? (task.status === 'done' ? 100 : 0),
      actualDurationMinutes: record?.actualDurationMinutes || 0,
      duration: task.duration,
      qualityLabel: record?.quality ? getQualityLabel(record.quality) : undefined,
      note: record?.note || undefined,
    };
  });

  return {
    input: {
      child,
      date,
      dayName,
      tasks: summaryInputTasks,
      doneCount,
      partialCount,
      pendingCount,
      skippedCount,
      totalActualMinutes,
    },
    todayTasks,
  };
}
