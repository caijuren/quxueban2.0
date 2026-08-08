import { Child } from './children';
import { SYSTEM_TASK_TEMPLATES, SystemTaskTemplate } from './taskTemplates';
import { TaskAlignment, TaskCategory, WeeklyTaskItem, TaskCompletionRecord } from './storage.types';

export interface AlignmentInput {
  child: Pick<Child, 'routeId'>;
  template: Pick<SystemTaskTemplate, 'routeTags'>;
}

export function computeTaskAlignment({ child, template }: AlignmentInput): TaskAlignment {
  const { routeId } = child;
  const { routeTags } = template;

  // 通用任务（无路线标签）视为可选补充
  if (!routeTags || routeTags.length === 0) {
    return 'optional';
  }

  // 路线不匹配的任务标记为不相关
  if (!routeId || !routeTags.includes(routeId)) {
    return 'unrelated';
  }

  // 路线匹配即视为当前阶段
  return 'ontrack';
}

export function getCategoryColorClass(category: TaskCategory): string {
  const map: Record<TaskCategory, string> = {
    school: 'bg-success/20 text-success border-success/30',
    reading: 'bg-secondary/20 text-secondary border-secondary/30',
    sport: 'bg-warning/20 text-warning border-warning/30',
    interest: 'bg-primary/20 text-primary border-primary/30',
    ability: 'bg-accent/20 text-accent border-accent/30',
    other: 'bg-surface-hover text-text-tertiary border-border-default/30',
  };
  return map[category] || map.other;
}

export function getAlignmentColorClass(alignment: TaskAlignment): string {
  const map: Record<TaskAlignment, string> = {
    ahead: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    ontrack: 'bg-success/20 text-success border-success/30',
    behind: 'bg-error/20 text-error border-error/30',
    optional: 'bg-surface-hover text-text-tertiary border-border-default/30',
    unrelated: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  };
  return map[alignment] || map.optional;
}

function normalizeCompletionRecord(
  record: Partial<TaskCompletionRecord> & Pick<TaskCompletionRecord, 'id' | 'date' | 'status'>
): TaskCompletionRecord {
  return {
    id: record.id,
    date: record.date,
    status: record.status,
    progress: record.progress ?? 0,
    actualDurationMinutes: record.actualDurationMinutes ?? 0,
    quality: record.quality ?? null,
    note: record.note ?? '',
    imageUrls: record.imageUrls ?? [],
    audioUrls: record.audioUrls ?? [],
    audioTranscript: record.audioTranscript,
    capabilityProgress: record.capabilityProgress ?? [],
    quantityIncrement: record.quantityIncrement ?? 0,
    checklistProgress: record.checklistProgress ?? [],
    metadata: record.metadata,
    dingtalkPushedAt: record.dingtalkPushedAt,
    createdAt: record.createdAt ?? new Date().toISOString(),
    updatedAt: record.updatedAt ?? new Date().toISOString(),
  };
}

export function normalizeWeeklyTask(
  task: Partial<WeeklyTaskItem> & Pick<WeeklyTaskItem, 'id' | 'focus' | 'day'>
): WeeklyTaskItem {
  const subjectId = task.subjectId;
  let category = task.category;
  if (!category && subjectId) {
    category = subjectId as TaskCategory;
  }
  if (!category) {
    category = 'other';
  }

  const completionRecords = (task.completionRecords || [])
    .filter((r): r is TaskCompletionRecord => !!r.id && !!r.date && !!r.status)
    .map((r) => normalizeCompletionRecord(r));

  return {
    id: task.id,
    category,
    subjectId,
    source: task.source || 'manual',
    templateId: task.templateId,
    alignment: task.alignment,
    day: task.day,
    timeSlot: task.timeSlot,
    goalId: task.goalId,
    focus: task.focus,
    duration: task.duration || '30分钟',
    materials: task.materials || [],
    status: task.status || 'pending',
    completedAt: task.completedAt,
    note: task.note,
    completionRecords: completionRecords.length > 0 ? completionRecords : undefined,
  };
}

export function alignTaskFromTemplate(
  task: WeeklyTaskItem,
  child: Pick<Child, 'grade' | 'routeId'>
): WeeklyTaskItem {
  if (!task.templateId) return task;

  const template = SYSTEM_TASK_TEMPLATES.find((t) => t.id === task.templateId);
  if (!template) return task;

  return {
    ...task,
    alignment: computeTaskAlignment({ child, template }),
  };
}
