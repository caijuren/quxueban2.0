import { Child } from './children';
import { SYSTEM_TASK_TEMPLATES, SystemTaskTemplate } from './taskTemplates';
import { TaskAlignment, TaskCategory, WeeklyTaskItem } from './storage.types';

export interface AlignmentInput {
  child: Pick<Child, 'grade' | 'routeId'>;
  template: Pick<
    SystemTaskTemplate,
    'gradeMin' | 'gradeMax' | 'routeTags'
  >;
}

export function computeTaskAlignment({ child, template }: AlignmentInput): TaskAlignment {
  const { grade, routeId } = child;
  const { gradeMin, gradeMax, routeTags } = template;

  // 通用任务（无路线标签）不判断路线匹配，按年级判断
  if (!routeTags || routeTags.length === 0) {
    if (grade < gradeMin) return 'ahead';
    if (grade > gradeMax) return 'behind';
    return 'optional';
  }

  // 路线不匹配的任务标记为不相关
  if (!routeId || !routeTags.includes(routeId)) {
    return 'unrelated';
  }

  // 路线匹配，按年级判断阶段
  if (grade < gradeMin) return 'ahead';
  if (grade > gradeMax) return 'behind';
  return 'ontrack';
}

export function getCategoryColorClass(category: TaskCategory): string {
  // Constrained to pink/purple/slate family for the neon command center look
  const map: Record<TaskCategory, string> = {
    chinese: 'bg-primary/15 text-primary-glow border-primary/25',
    math: 'bg-secondary/15 text-secondary-glow border-secondary/25',
    english: 'bg-secondary/12 text-secondary border-secondary/22',
    school: 'bg-surface-highlight text-text-secondary border-border-subtle',
    reading: 'bg-secondary/10 text-secondary-glow border-secondary/18',
    sport: 'bg-primary/12 text-primary border-primary/20',
    interest: 'bg-secondary/14 text-secondary-glow border-secondary/24',
    other: 'bg-surface-light text-text-tertiary border-border-subtle',
  };
  return map[category] || map.other;
}

export function getAlignmentColorClass(alignment: TaskAlignment): string {
  const map: Record<TaskAlignment, string> = {
    ahead: 'bg-secondary/12 text-secondary-glow border-secondary/20',
    ontrack: 'bg-primary/12 text-primary border-primary/20',
    behind: 'bg-danger/12 text-danger border-danger/25',
    optional: 'bg-surface-light text-text-tertiary border-border-subtle',
    unrelated: 'bg-surface-light text-text-muted border-border-subtle',
  };
  return map[alignment] || map.optional;
}

export function normalizeWeeklyTask(task: Partial<WeeklyTaskItem> & Pick<WeeklyTaskItem, 'id' | 'focus' | 'day'>): WeeklyTaskItem {
  const subjectId = task.subjectId;
  let category = task.category;
  if (!category && subjectId) {
    category = subjectId as TaskCategory;
  }
  if (!category) {
    category = 'other';
  }

  return {
    id: task.id,
    category,
    subjectId,
    source: task.source || 'manual',
    templateId: task.templateId,
    alignment: task.alignment,
    day: task.day,
    focus: task.focus,
    duration: task.duration || '30分钟',
    materials: task.materials || [],
    status: task.status || 'pending',
    completedAt: task.completedAt,
    note: task.note,
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
