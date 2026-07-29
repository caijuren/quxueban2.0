import { Child } from './children';
import {
  type WeeklyPlan,
  type TaskCategory,
  type DayOfWeek,
} from './storage.types';
import { dayOrder, getTodayName, getPlanStats, getCurrentWeekId } from './weeklyTasks';
import { TASK_CATEGORY_LABELS } from './taskTemplates';

export type AlertLevel = 'urgent' | 'warning' | 'info';
export type AlertType =
  | 'today_pending'
  | 'missed_yesterday'
  | 'category_gap'
  | 'low_completion'
  | 'milestone_deadline';

export interface Alert {
  id: string;
  type: AlertType;
  level: AlertLevel;
  title: string;
  content: string;
  childId: string;
  childName: string;
  action?: {
    label: string;
    href: string;
  };
  createdAt: string;
}

const categoryOrder: TaskCategory[] = [
  'chinese',
  'math',
  'english',
  'school',
  'reading',
  'sport',
  'interest',
  'other',
];

function getYesterdayName(today: DayOfWeek): DayOfWeek {
  const idx = dayOrder.indexOf(today);
  return idx === 0 ? '周日' : dayOrder[idx - 1];
}

function getPrevDayName(day: DayOfWeek, delta: number): DayOfWeek {
  const idx = dayOrder.indexOf(day);
  return dayOrder[(idx - delta + 7) % 7];
}

function todayPendingAlert(
  child: Child,
  currentPlan: WeeklyPlan | undefined
): Alert | null {
  if (!currentPlan) return null;
  const todayName = getTodayName();
  const todayTasks = currentPlan.tasks.filter((t) => t.day === todayName);
  const pending = todayTasks.filter((t) => t.status !== 'done');
  if (pending.length === 0) return null;

  const totalMinutes = pending.reduce((sum, t) => {
    const match = t.duration.match(/(\d+)/);
    return sum + (match ? parseInt(match[1], 10) : 0);
  }, 0);

  return {
    id: `today-${child.id}-${currentPlan.weekId}`,
    type: 'today_pending',
    level: 'urgent',
    title: `${child.name} · 今日还有 ${pending.length} 项任务未完成`,
    content: `剩余任务预计需要 ${totalMinutes} 分钟，建议固定时段优先完成。`,
    childId: child.id,
    childName: child.name,
    action: { label: '去打卡', href: '/dashboard/weekly' },
    createdAt: new Date().toISOString(),
  };
}

function yesterdayMissedAlert(
  child: Child,
  currentPlan: WeeklyPlan | undefined
): Alert | null {
  if (!currentPlan) return null;
  const yesterdayName = getYesterdayName(getTodayName());
  const yesterdayTasks = currentPlan.tasks.filter((t) => t.day === yesterdayName);
  const missed = yesterdayTasks.filter(
    (t) => t.status !== 'done' && t.status !== 'skipped'
  );
  if (missed.length === 0) return null;

  const categories = Array.from(new Set(missed.map((t) => t.category)))
    .map((c) => TASK_CATEGORY_LABELS[c as TaskCategory] || c)
    .join('、');

  return {
    id: `yesterday-${child.id}-${currentPlan.weekId}`,
    type: 'missed_yesterday',
    level: 'warning',
    title: `${child.name} · 昨日 ${missed.length} 项任务未补完`,
    content: `涉及 ${categories}，建议今天安排时间补齐，避免累计。`,
    childId: child.id,
    childName: child.name,
    action: { label: '补任务', href: '/dashboard/weekly' },
    createdAt: new Date().toISOString(),
  };
}

function categoryGapAlert(
  child: Child,
  currentPlan: WeeklyPlan | undefined
): Alert | null {
  if (!currentPlan) return null;

  const todayName = getTodayName();
  const tasksByDay = (day: DayOfWeek) =>
    currentPlan.tasks.filter((t) => t.day === day);

  for (const category of categoryOrder) {
    let consecutiveDays = 0;
    for (let i = 1; i <= 3; i++) {
      const dayName = getPrevDayName(todayName, i);
      const hasTask = tasksByDay(dayName).some((t) => t.category === category);
      if (!hasTask) consecutiveDays++;
      else break;
    }

    if (consecutiveDays >= 2) {
      return {
        id: `gap-${child.id}-${category}`,
        type: 'category_gap',
        level: 'warning',
        title: `${child.name} · ${TASK_CATEGORY_LABELS[category]}已连续 ${consecutiveDays} 天未安排`,
        content: `建议今天在周计划里补一项${TASK_CATEGORY_LABELS[category]}任务，保持节奏。`,
        childId: child.id,
        childName: child.name,
        action: { label: '调整周计划', href: '/dashboard/weekly' },
        createdAt: new Date().toISOString(),
      };
    }
  }

  return null;
}

function lowCompletionAlert(
  child: Child,
  currentPlan: WeeklyPlan | undefined
): Alert | null {
  if (!currentPlan || currentPlan.tasks.length === 0) return null;
  const stats = getPlanStats(currentPlan);
  if (stats.completionRate >= 60) return null;

  return {
    id: `completion-${child.id}-${currentPlan.weekId}`,
    type: 'low_completion',
    level: 'warning',
    title: `${child.name} · 本周完成率偏低（${stats.completionRate}%）`,
    content: `已完成 ${stats.done}/${stats.total} 项，建议减少任务量或拆分时段，先建立正反馈。`,
    childId: child.id,
    childName: child.name,
    action: { label: '查看周任务', href: '/dashboard/weekly' },
    createdAt: new Date().toISOString(),
  };
}

interface GenerateAlertsInput {
  children: Child[];
  weeklyPlans: WeeklyPlan[];
}

export function generateAlerts({
  children,
  weeklyPlans,
}: GenerateAlertsInput): Alert[] {
  const alerts: Alert[] = [];

  children.forEach((child) => {
    const currentPlan = weeklyPlans.find(
      (p) => p.childId === child.id && p.weekId === getCurrentWeekId()
    );

    const addIf = (alert: Alert | null) => {
      if (alert) alerts.push(alert);
    };

    addIf(todayPendingAlert(child, currentPlan));
    addIf(yesterdayMissedAlert(child, currentPlan));
    addIf(categoryGapAlert(child, currentPlan));
    addIf(lowCompletionAlert(child, currentPlan));
  });

  return alerts.sort((a, b) => {
    const levelWeight = { urgent: 0, warning: 1, info: 2 };
    return levelWeight[a.level] - levelWeight[b.level];
  });
}
