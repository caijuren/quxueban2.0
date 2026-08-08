import { Child } from './children';
import { getChinesePlanByGrade, getChineseStatusByGrade } from './subjects/chinese';
import { getMathPlanByGrade, getMathStatusByGrade } from './subjects/math';
import { getEnglishPlanByGrade, getEnglishStatusByGrade } from './subjects/english';
import {
  type WeeklyPlan,
  type WeeklyTaskItem,
  type SubjectId,
  type DayOfWeek,
  type TaskStatus,
  type TaskCategory,
  type TaskTemplate,
  type TaskWeeklySchedule,
  type TimeSlot,
} from './storage.types';
import { computeTaskAlignment } from './taskAlignment';
import { SYSTEM_TASK_TEMPLATES, TASK_CATEGORY_LABELS } from './taskTemplates';

export const dayOrder: DayOfWeek[] = [
  '周一',
  '周二',
  '周三',
  '周四',
  '周五',
  '周六',
  '周日',
];

export const timeSlotOrder: TimeSlot[] = [
  'morning',
  'afternoon',
  'evening',
  'flexible',
];

export function getCategoryDefaultTimeSlot(category: TaskCategory): TimeSlot {
  const map: Record<TaskCategory, TimeSlot> = {
    school: 'morning',
    reading: 'afternoon',
    sport: 'afternoon',
    interest: 'evening',
    ability: 'evening',
    other: 'flexible',
  };
  return map[category] || 'flexible';
}

export function getTimeSlotLabel(timeSlot: TimeSlot): string {
  const map: Record<TimeSlot, string> = {
    morning: '上午',
    beforeNoon: '上午',
    noon: '中午',
    afternoon: '下午',
    afterSchool: '放学后',
    evening: '晚上',
    night: '夜间',
    flexible: '灵活',
  };
  return map[timeSlot] || '灵活';
}

export const subjectMeta: Record<
  SubjectId,
  { name: string; color: string; gradient: string }
> = {
  chinese: { name: '语文', color: '#06b6d4', gradient: 'from-accent to-accent-glow' },
  math: { name: '数学', color: '#f43f5e', gradient: 'from-primary to-primary-glow' },
  english: { name: '英语', color: '#8b5cf6', gradient: 'from-secondary to-secondary-glow' },
};

interface SubjectTemplate {
  weeklyTemplate: Array<{
    day: string;
    focus: string;
    duration: string;
    materials: string[];
  }>;
}

function getThursday(d: Date): Date {
  const t = new Date(d);
  t.setDate(d.getDate() - ((d.getDay() + 6) % 7) + 3);
  t.setHours(0, 0, 0, 0);
  return t;
}

export function getISOWeek(date: Date): { year: number; week: number; weekId: string } {
  const thu = getThursday(date);
  const year = thu.getFullYear();
  const firstThu = getThursday(new Date(year, 0, 4));
  const days = Math.round((thu.getTime() - firstThu.getTime()) / 86400000);
  const week = 1 + Math.floor((days + 3) / 7);
  return {
    year,
    week,
    weekId: `${year}-W${String(week).padStart(2, '0')}`,
  };
}

export function getCurrentWeekId(): string {
  return getISOWeek(new Date()).weekId;
}

export function parseWeekId(weekId: string): { year: number; week: number } {
  const [yearStr, weekStr] = weekId.split('-W');
  return {
    year: parseInt(yearStr || '0', 10),
    week: parseInt(weekStr || '0', 10),
  };
}

export function getWeekRange(weekId: string): { start: Date; end: Date } {
  const { year, week } = parseWeekId(weekId);
  const firstThu = getThursday(new Date(year, 0, 4));
  const monday = new Date(firstThu);
  monday.setDate(firstThu.getDate() - 3 + (week - 1) * 7);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { start: monday, end: sunday };
}

export function formatWeekLabel(weekId: string): string {
  const { start, end } = getWeekRange(weekId);
  const fmt = (d: Date) => `${d.getMonth() + 1}月${d.getDate()}日`;
  return `${fmt(start)} - ${fmt(end)}`;
}

export function generateTaskId(subjectId: SubjectId | TaskCategory, index: number): string {
  return `${subjectId}-${index}-${Math.random().toString(36).slice(2, 7)}`;
}

const subjectRouteTags: Record<SubjectId, string[]> = {
  chinese: ['sanchu_gongban', 'sanchu_minban', 'sanchu_guoji', 'zhongkao_putong', 'zhongkao_tese', 'gaokao_zongping', 'gaokao_qiangji'],
  math: ['sanchu_gongban', 'sanchu_minban', 'sanchu_guoji', 'zhongkao_putong', 'zhongkao_tese', 'gaokao_zongping', 'gaokao_qiangji'],
  english: ['sanchu_gongban', 'sanchu_minban', 'sanchu_guoji', 'zhongkao_putong', 'zhongkao_tese', 'gaokao_zongping', 'gaokao_qiangji'],
};

export function generateWeeklyPlan(
  child: Child,
  weekId: string = getCurrentWeekId()
): WeeklyPlan {
  const subjectPlans: Record<SubjectId, SubjectTemplate> = {
    chinese: getChinesePlanByGrade(child.grade) as SubjectTemplate,
    math: getMathPlanByGrade(child.grade) as SubjectTemplate,
    english: getEnglishPlanByGrade(child.grade) as SubjectTemplate,
  };

  const tasks: WeeklyTaskItem[] = [];

  (Object.keys(subjectPlans) as SubjectId[]).forEach((subjectId) => {
    subjectPlans[subjectId].weeklyTemplate.forEach((template, index) => {
      const alignment = computeTaskAlignment({
        child: { routeId: child.routeId },
        template: {
          routeTags: subjectRouteTags[subjectId],
        },
      });

      tasks.push({
        id: generateTaskId(subjectId, index),
        category: 'ability',
        subjectId,
        source: 'auto',
        day: template.day as DayOfWeek,
        focus: template.focus,
        duration: template.duration,
        materials: template.materials,
        status: 'pending',
        alignment,
      });
    });
  });

  return {
    weekId,
    childId: child.id,
    tasks,
  };
}

export function generateWeeklyPlanFromLibrary(
  child: Child,
  weekId: string = getCurrentWeekId()
): WeeklyPlan {
  const candidates = SYSTEM_TASK_TEMPLATES.filter((tpl) => {
    if (tpl.routeTags.length === 0) return true;
    if (!child.routeId) return false;
    return tpl.routeTags.includes(child.routeId);
  });

  const tasks: WeeklyTaskItem[] = [];
  const days: DayOfWeek[] = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

  candidates.forEach((tpl, index) => {
    const alignment = computeTaskAlignment({
      child: { routeId: child.routeId },
      template: tpl,
    });

    tasks.push({
      id: `library-${tpl.id}-${index}-${Math.random().toString(36).slice(2, 7)}`,
      category: tpl.category,
      source: 'library',
      templateId: tpl.id,
      alignment,
      day: days[index % days.length],
      focus: tpl.title,
      duration: tpl.duration,
      materials: tpl.materials,
      status: 'pending',
    });
  });

  return {
    weekId,
    childId: child.id,
    tasks,
  };
}

const scheduleDayMap: Record<Exclude<TaskWeeklySchedule, 'auto' | 'custom'>, DayOfWeek[]> = {
  daily: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  weekdays: ['周一', '周二', '周三', '周四', '周五'],
  weekends: ['周六', '周日'],
};

export function getScheduledDays(
  weeklySchedule: TaskWeeklySchedule | string | null | undefined,
  customScheduleDays: DayOfWeek[] = []
): DayOfWeek[] {
  const schedule =
    typeof weeklySchedule === 'string' ? weeklySchedule.toLowerCase() : weeklySchedule;
  if (!schedule || schedule === 'auto') return [];
  if (schedule === 'custom') {
    return dayOrder.filter((d) => customScheduleDays?.includes(d));
  }
  return scheduleDayMap[schedule as Exclude<TaskWeeklySchedule, 'auto' | 'custom'>] ?? [];
}

export function expandTemplateToWeeklyTasks(
  template: TaskTemplate,
  options: {
    childRouteId?: string | null;
    baseIndex?: number;
    defaultDay?: DayOfWeek;
  } = {}
): WeeklyTaskItem[] {
  const { childRouteId, baseIndex = 0, defaultDay = '周一' } = options;
  const alignment = computeTaskAlignment({
    child: { routeId: childRouteId },
    template,
  });

  const scheduledDays = getScheduledDays(
    template.weeklySchedule,
    template.customScheduleDays
  );

  const targetDays = scheduledDays.length > 0 ? scheduledDays : [defaultDay];

  return targetDays.map((day, idx) => ({
    id: `library-${template.id}-${baseIndex}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
    category: template.category,
    source: 'library',
    templateId: template.id,
    alignment,
    day,
    focus: template.title,
    duration: template.duration,
    materials: template.materials,
    status: 'pending',
  }));
}

export function generateWeeklyPlanFromSelectedTemplates(
  child: Child,
  weekId: string,
  templates: TaskTemplate[]
): WeeklyPlan {
  const tasks: WeeklyTaskItem[] = [];

  // Track daily load (in minutes) to balance auto templates
  const dayLoad: Record<DayOfWeek, number> = {
    周一: 0,
    周二: 0,
    周三: 0,
    周四: 0,
    周五: 0,
    周六: 0,
    周日: 0,
  };

  let taskIndex = 0;

  // 1. Expand templates with explicit schedules first
  templates.forEach((tpl) => {
    if (tpl.weeklySchedule && tpl.weeklySchedule !== 'auto') {
      const expanded = expandTemplateToWeeklyTasks(tpl, {
        childRouteId: child.routeId,
        baseIndex: taskIndex++,
      });
      expanded.forEach((t) => {
        dayLoad[t.day] += parseDurationMinutes(t.duration);
      });
      tasks.push(...expanded);
    }
  });

  // 2. Distribute auto templates round-robin starting from Saturday so weekends also get tasks
  const autoTemplates = templates.filter(
    (tpl) => !tpl.weeklySchedule || tpl.weeklySchedule === 'auto'
  );
  autoTemplates.forEach((tpl, idx) => {
    const day = dayOrder[(idx + 5) % dayOrder.length];
    const expanded = expandTemplateToWeeklyTasks(tpl, {
      childRouteId: child.routeId,
      baseIndex: taskIndex++,
      defaultDay: day,
    });
    expanded.forEach((t) => {
      dayLoad[t.day] += parseDurationMinutes(t.duration);
    });
    tasks.push(...expanded);
  });

  return {
    weekId,
    childId: child.id,
    tasks,
  };
}

export function getTasksByDay(plan: WeeklyPlan): Record<DayOfWeek, WeeklyTaskItem[]> {
  const grouped: Record<DayOfWeek, WeeklyTaskItem[]> = {
    周一: [],
    周二: [],
    周三: [],
    周四: [],
    周五: [],
    周六: [],
    周日: [],
  };
  plan.tasks.forEach((task) => {
    grouped[task.day].push(task);
  });
  dayOrder.forEach((day) => {
    grouped[day].sort((a, b) => a.category.localeCompare(b.category));
  });
  return grouped;
}

export function parseDurationMinutes(duration: string): number {
  const match = duration.match(/(\d+)(?:\s*[-~～]\s*(\d+))?/);
  if (!match) return 0;
  const min = parseInt(match[1], 10);
  const max = match[2] ? parseInt(match[2], 10) : min;
  return Math.round((min + max) / 2);
}

export interface PlanStats {
  total: number;
  done: number;
  skipped: number;
  pending: number;
  completionRate: number;
  estimatedMinutes: number;
  quantityTarget: number;
  quantityDone: number;
  quantityRate: number;
  byCategory: Record<
    TaskCategory,
    { total: number; done: number; skipped: number; pending: number }
  >;
  byDay: Record<DayOfWeek, { total: number; done: number }>;
}

const defaultCategories: TaskCategory[] = [
  'school',
  'reading',
  'sport',
  'interest',
  'ability',
  'other',
];

export function getPlanStats(plan: WeeklyPlan): PlanStats {
  const total = plan.tasks.length;
  const done = plan.tasks.filter((t) => t.status === 'done').length;
  const skipped = plan.tasks.filter((t) => t.status === 'skipped').length;
  const pending = total - done - skipped;
  const completionRate = total === 0 ? 0 : Math.round((done / total) * 100);
  const estimatedMinutes = plan.tasks.reduce(
    (sum, t) => sum + parseDurationMinutes(t.duration),
    0
  );

  const goals = plan.goals || [];
  const quantityTarget = goals.reduce(
    (sum, g) => sum + (g.quantityTarget ?? 0),
    0
  );
  const quantityDone = Math.min(
    quantityTarget,
    goals.reduce((sum, g) => sum + (g.quantityDone ?? 0), 0)
  );
  const quantityRate =
    quantityTarget === 0 ? 0 : Math.round((quantityDone / quantityTarget) * 100);

  const byCategory = {} as Record<
    TaskCategory,
    { total: number; done: number; skipped: number; pending: number }
  >;
  defaultCategories.forEach((cat) => {
    byCategory[cat] = { total: 0, done: 0, skipped: 0, pending: 0 };
  });

  const byDay: Record<DayOfWeek, { total: number; done: number }> = {
    周一: { total: 0, done: 0 },
    周二: { total: 0, done: 0 },
    周三: { total: 0, done: 0 },
    周四: { total: 0, done: 0 },
    周五: { total: 0, done: 0 },
    周六: { total: 0, done: 0 },
    周日: { total: 0, done: 0 },
  };

  plan.tasks.forEach((task) => {
    const category = task.category || 'other';
    byCategory[category].total += 1;
    byDay[task.day].total += 1;
    if (task.status === 'done') {
      byCategory[category].done += 1;
      byDay[task.day].done += 1;
    } else if (task.status === 'skipped') {
      byCategory[category].skipped += 1;
    } else {
      byCategory[category].pending += 1;
    }
  });

  return {
    total,
    done,
    skipped,
    pending,
    completionRate,
    estimatedMinutes,
    quantityTarget,
    quantityDone,
    quantityRate,
    byCategory,
    byDay,
  };
}

export interface SubjectStat {
  subjectId: SubjectId;
  name: string;
  color: string;
  total: number;
  done: number;
  skipped: number;
  rate: number;
  plannedMinutes: number;
  actualMinutes: number;
  currentTopic: string;
  dailyTime: string;
  weakSkills: string[];
  focusList: string[];
}

const reportSubjectMeta: Record<
  SubjectId,
  { getStatus: (grade: number) => { currentTopic: string; dailyTime: string; weakSkills: string[] } }
> = {
  chinese: {
    getStatus: (grade) => {
      const s = getChineseStatusByGrade(grade);
      return { currentTopic: s.currentTopic, dailyTime: s.dailyChineseTime, weakSkills: s.weakSkills };
    },
  },
  math: {
    getStatus: (grade) => {
      const s = getMathStatusByGrade(grade);
      return { currentTopic: s.currentTopic, dailyTime: s.dailyMathTime, weakSkills: s.weakSkills };
    },
  },
  english: {
    getStatus: (grade) => {
      const s = getEnglishStatusByGrade(grade);
      return {
        currentTopic: `${s.gradeLabel} · RAZ ${s.razLevel} · OD ${s.odUnit}/${s.odTotal}`,
        dailyTime: s.dailyEnglishTime,
        weakSkills: s.weakSkills,
      };
    },
  },
};

export function getSubjectStats(plan: WeeklyPlan, grade: number): SubjectStat[] {
  const subjects: SubjectId[] = ['chinese', 'math', 'english'];

  return subjects.map((subjectId) => {
    const tasks = plan.tasks.filter((t) => t.subjectId === subjectId);
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'done').length;
    const skipped = tasks.filter((t) => t.status === 'skipped').length;
    const rate = total === 0 ? 0 : Math.round((done / total) * 100);
    const plannedMinutes = tasks.reduce((sum, t) => sum + parseDurationMinutes(t.duration), 0);
    const actualMinutes = tasks.reduce((sum, t) => {
      const lastRecord = t.completionRecords?.[t.completionRecords.length - 1];
      return sum + (lastRecord?.actualDurationMinutes ?? 0);
    }, 0);
    const focusList = tasks
      .filter((t) => t.status === 'done')
      .map((t) => t.focus)
      .slice(0, 3);

    const status = reportSubjectMeta[subjectId].getStatus(grade);

    return {
      subjectId,
      name: subjectMeta[subjectId].name,
      color: subjectMeta[subjectId].color,
      total,
      done,
      skipped,
      rate,
      plannedMinutes,
      actualMinutes,
      currentTopic: status.currentTopic,
      dailyTime: status.dailyTime,
      weakSkills: status.weakSkills,
      focusList,
    };
  });
}

export function generateAiReview(plan: WeeklyPlan, childName: string): string {
  const stats = getPlanStats(plan);
  if (stats.total === 0) {
    return '本周还没有发布任务，先去「发布本周计划」吧。';
  }

  const lines: string[] = [
    `${childName}本周共 ${stats.total} 项任务，已完成 ${stats.done} 项，整体完成率 ${stats.completionRate}%。`,
  ];

  if (stats.quantityTarget > 0) {
    lines.push(
      `定量目标完成 ${stats.quantityDone}/${stats.quantityTarget}，完成率 ${stats.quantityRate}%。`
    );
  }

  const activeCategories = defaultCategories.filter((cat) => stats.byCategory[cat].total > 0);
  activeCategories.forEach((category) => {
    const s = stats.byCategory[category];
    const missed = s.total - s.done - s.skipped;
    if (missed > 0) {
      lines.push(`${TASK_CATEGORY_LABELS[category]}缺 ${missed} 项，建议优先补上。`);
    } else {
      lines.push(`${TASK_CATEGORY_LABELS[category]}全部完成，保持得不错。`);
    }
  });

  const missedDays = dayOrder.filter(
    (day) => stats.byDay[day].total > 0 && stats.byDay[day].done < stats.byDay[day].total
  );
  if (missedDays.length > 0) {
    lines.push(`${missedDays.join('、')}还有未完成任务，建议固定时段补齐。`);
  }

  if (stats.completionRate >= 90) {
    lines.push('整体节奏很好，下周可以继续保持。');
  } else if (stats.completionRate >= 60) {
    lines.push('完成度尚可，下周建议把缺项前置到早晨或放学后第一时间完成。');
  } else {
    lines.push('本周完成度偏低，建议下周减少任务量或拆分时段，先建立正反馈。');
  }

  return lines.join('');
}

export function getTodayName(): DayOfWeek {
  const dayIndex = new Date().getDay();
  const mapping: DayOfWeek[] = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return mapping[dayIndex];
}

export function toggleTaskStatus(current: TaskStatus): TaskStatus {
  return current === 'done' ? 'pending' : 'done';
}
