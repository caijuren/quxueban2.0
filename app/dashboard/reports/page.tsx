'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SlideUp, StaggerContainer, StaggerItem } from '@/components/motion';
import { Icon } from '@/components/ui/icon';
import Select from '@/components/ui/select';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';
import EmptyState from '@/components/ui/EmptyState';
import GlassCard from '@/components/ui/glass-card';
import MetricCard from '@/components/ui/metric-card';
import ProgressRing from '@/components/ui/progress-ring';
import TrendChart from '@/components/ui/trend-chart';
import Heatmap from '@/components/ui/heatmap';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { ProgressBar } from '@/components/motion/progress-bar';
import Skeleton from '@/components/ui/skeleton';
import { categoryIcons } from '@/lib/taskIcons';
import { TASK_CATEGORY_LABELS, TASK_CATEGORY_COLORS } from '@/lib/taskTemplates';
import {
  type WeeklyPlan,
  type TaskCategory,
  type DayOfWeek,
  type TaskCompletionRecord,
} from '@/lib/storage.types';
import {
  getCurrentWeekId,
  getISOWeek,
  getWeekRange,
  parseWeekId,
  formatWeekLabel,
  getPlanStats,
  getSubjectStats,
  parseDurationMinutes,
  dayOrder,
  subjectMeta,
} from '@/lib/weeklyTasks';
import Button from '@/components/ui/button';
import { useGenerateAiSummary, useSaveWeeklyPlan } from '@/lib/hooks/useWeeklyPlans';
import ReadingReportSection from '@/components/reading/ReadingReportSection';

function shiftWeekId(weekId: string, delta: number): string {
  const { start } = getWeekRange(weekId);
  const next = new Date(start);
  next.setDate(start.getDate() + delta * 7);
  return getISOWeek(next).weekId;
}

function buildWeekOptions(centerWeekId: string) {
  const currentWeekId = getCurrentWeekId();
  const currentStart = getWeekRange(currentWeekId).start;
  const oneWeek = 7 * 24 * 60 * 60 * 1000;

  return Array.from({ length: 9 }, (_, i) => i - 4).map((delta) => {
    const id = shiftWeekId(centerWeekId, delta);
    const { year, week } = parseWeekId(id);
    const start = getWeekRange(id).start;
    const weeksFromCurrent = Math.round((start.getTime() - currentStart.getTime()) / oneWeek);
    const relationLabel =
      weeksFromCurrent === 0
        ? '本周'
        : weeksFromCurrent === 1
          ? '下周'
          : weeksFromCurrent === -1
            ? '上周'
            : `${year}年第${String(week).padStart(2, '0')}周`;
    return {
      value: id,
      label: `${relationLabel} · ${formatWeekLabel(id)}`,
    };
  });
}

function getDayDateLabel(weekId: string, day: DayOfWeek): string {
  const { start } = getWeekRange(weekId);
  const dayIndex = dayOrder.indexOf(day);
  const d = new Date(start);
  d.setDate(start.getDate() + dayIndex);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

type ProgressStatus = 'ahead' | 'ontrack' | 'slightly_behind' | 'behind';

function computeProgressStatus(
  timeProgress: number,
  taskProgress: number
): { status: ProgressStatus; label: string; color: string; message: string } {
  const diff = taskProgress - timeProgress;

  if (diff >= 10) {
    return {
      status: 'ahead',
      label: '超前完成',
      color: 'text-success',
      message: '本周进度超前，节奏很棒，可以适当增加挑战。',
    };
  }
  if (diff >= -5) {
    return {
      status: 'ontrack',
      label: '正常推进',
      color: 'text-success',
      message: '时间进度与任务进度基本匹配，保持当前节奏即可。',
    };
  }
  if (diff >= -20) {
    return {
      status: 'slightly_behind',
      label: '略有滞后',
      color: 'text-warning',
      message: '任务进度略落后于时间进度，建议后面几天加紧补齐。',
    };
  }
  return {
    status: 'behind',
    label: '明显延迟',
    color: 'text-error',
    message: '本周任务完成明显滞后，建议优先完成核心任务，并调整下周计划量。',
  };
}

function getCategoryMinutes(plan: WeeklyPlan, category: TaskCategory): number {
  return plan.tasks
    .filter((t) => (t.category || 'other') === category)
    .reduce((sum, t) => sum + parseDurationMinutes(t.duration), 0);
}

function getCompletedCategoryMinutes(plan: WeeklyPlan, category: TaskCategory): number {
  return plan.tasks
    .filter((t) => (t.category || 'other') === category && t.status === 'done')
    .reduce((sum, t) => sum + parseDurationMinutes(t.duration), 0);
}

function getLatestCompletionRecord(task: {
  completionRecords?: TaskCompletionRecord[];
}): TaskCompletionRecord | undefined {
  const records = task.completionRecords || [];
  return records[records.length - 1];
}

function formatRecordDetail(record: TaskCompletionRecord): string {
  const m = record.metadata;
  if (!m) return record.note || '';

  const parts: string[] = [];
  if (m.bookTitle) {
    parts.push(`《${m.bookTitle}》`);
    if (m.pageStart !== undefined && m.pageEnd !== undefined) {
      parts.push(`第 ${m.pageStart}-${m.pageEnd} 页`);
    }
  }
  if (m.workbookTitle) {
    parts.push(m.workbookTitle);
    if (m.problemRange) parts.push(m.problemRange);
    if (m.wrongCount !== undefined) parts.push(`错题 ${m.wrongCount} 道`);
  }
  const quantityIncrement = m.quantityIncrement ?? record.quantityIncrement;
  if (quantityIncrement && quantityIncrement > 0) {
    parts.push(`${quantityIncrement}${m.quantityUnit || ''}`);
  }
  if (record.note && record.note !== '孩子自己打卡' && record.note !== '家长代打卡') {
    parts.push(record.note);
  }

  return parts.filter(Boolean).join(' · ') || record.note || '';
}

interface WeeklySubjectPoint {
  weekId: string;
  label: string;
  chinese: number;
  math: number;
  english: number;
}

function getSubjectWeeklyTrend(
  weeklyPlans: WeeklyPlan[],
  childId: string,
  currentWeekId: string
): WeeklySubjectPoint[] {
  const weeks = Array.from({ length: 4 }, (_, i) => shiftWeekId(currentWeekId, -i)).reverse();
  return weeks.map((id) => {
    const plan = weeklyPlans.find((p) => p.childId === childId && p.weekId === id);
    const tasks = plan?.tasks ?? [];
    const actualMinutes = (subjectId: 'chinese' | 'math' | 'english') =>
      tasks
        .filter((t) => t.subjectId === subjectId)
        .reduce((sum, t) => {
          const record = t.completionRecords?.[t.completionRecords.length - 1];
          return sum + (record?.actualDurationMinutes ?? 0);
        }, 0);
    return {
      weekId: id,
      label: formatWeekLabel(id),
      chinese: actualMinutes('chinese'),
      math: actualMinutes('math'),
      english: actualMinutes('english'),
    };
  });
}

interface TimeAnalysisAlert {
  id: string;
  type: 'warning' | 'info' | 'success';
  message: string;
}

function getTimeAnalysisAlerts(
  subjectStats: ReturnType<typeof getSubjectStats>,
  totalPlanned: number,
  totalActual: number
): TimeAnalysisAlert[] {
  const alerts: TimeAnalysisAlert[] = [];

  if (subjectStats.length === 0) return alerts;

  const maxSubject = subjectStats.reduce((max, s) =>
    s.plannedMinutes > max.plannedMinutes ? s : max
  );
  const totalPlannedMinutes = subjectStats.reduce((sum, s) => sum + s.plannedMinutes, 0);

  if (totalPlannedMinutes > 0) {
    const maxRatio = maxSubject.plannedMinutes / totalPlannedMinutes;
    if (maxRatio > 0.5) {
      alerts.push({
        id: 'subject-imbalance',
        type: 'warning',
        message: `${maxSubject.name}计划占比 ${Math.round(maxRatio * 100)}%，建议适当平衡各学科时间。`,
      });
    }
  }

  subjectStats.forEach((s) => {
    if (s.plannedMinutes > 0 && s.actualMinutes === 0) {
      alerts.push({
        id: `${s.subjectId}-no-actual`,
        type: 'warning',
        message: `${s.name}本周有计划但暂无实际投入记录。`,
      });
    } else if (s.plannedMinutes > 0 && s.actualMinutes < s.plannedMinutes * 0.3) {
      alerts.push({
        id: `${s.subjectId}-low-actual`,
        type: 'info',
        message: `${s.name}实际投入 ${formatMinutes(s.actualMinutes)}，仅完成计划的 ${Math.round((s.actualMinutes / s.plannedMinutes) * 100)}%。`,
      });
    }
  });

  if (totalPlanned > 0 && totalActual > totalPlanned * 1.3) {
    alerts.push({
      id: 'over-time',
      type: 'info',
      message: `本周实际投入 ${formatMinutes(totalActual)}，超出计划 ${formatMinutes(totalActual - totalPlanned)}。`,
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: 'balanced',
      type: 'success',
      message: '本周学科时间分配较为均衡，继续保持。',
    });
  }

  return alerts;
}

function SubjectTooltip({ active, payload }: { active?: boolean; payload?: Array<Record<string, unknown>> }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-sm shadow-lg">
      {payload.map((entry, i) => (
        <p key={i} className="tabular-nums text-text-primary" style={{ color: String(entry.color) }}>
          {String(entry.name)}: {formatMinutes(Number(entry.value))}
        </p>
      ))}
    </div>
  );
}

export default function ReportsPage() {
  const { children, currentChild, getWeeklyPlan, weeklyPlans } = useChildren();
  const generateAiSummary = useGenerateAiSummary();

  const [weekId, setWeekId] = useState<string>(getCurrentWeekId());
  const [aiGenerating, setAiGenerating] = useState(false);
  const [autoGenerated, setAutoGenerated] = useState(false);

  const plan = useMemo(() => {
    if (!currentChild) return undefined;
    return getWeeklyPlan(weekId, currentChild.id);
  }, [currentChild, getWeeklyPlan, weekId]);

  const stats = useMemo(() => (plan ? getPlanStats(plan) : null), [plan]);

  const subjectStats = useMemo(() => {
    if (!plan || !currentChild) return [];
    return getSubjectStats(plan, currentChild.grade);
  }, [plan, currentChild]);

  const weekOptions = useMemo(() => buildWeekOptions(weekId), [weekId]);

  const timeProgress = useMemo(() => {
    const now = new Date();
    const { start, end } = getWeekRange(weekId);
    if (now < start) return 0;
    if (now > end) return 100;
    const total = end.getTime() - start.getTime() + 24 * 60 * 60 * 1000;
    const elapsed = now.getTime() - start.getTime();
    return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
  }, [weekId]);

  const taskProgress = useMemo(() => {
    if (!stats || stats.total === 0) return 0;
    return Math.round((stats.done / stats.total) * 100);
  }, [stats]);

  const progressStatus = useMemo(
    () => computeProgressStatus(timeProgress, taskProgress),
    [timeProgress, taskProgress]
  );

  const totalMinutes = useMemo(
    () => (plan ? plan.tasks.reduce((sum, t) => sum + parseDurationMinutes(t.duration), 0) : 0),
    [plan]
  );

  const completedMinutes = useMemo(
    () =>
      plan
        ? plan.tasks
            .filter((t) => t.status === 'done')
            .reduce((sum, t) => sum + parseDurationMinutes(t.duration), 0)
        : 0,
    [plan]
  );

  const actualMinutes = useMemo(
    () =>
      plan
        ? plan.tasks.reduce((sum, t) => {
            const record = getLatestCompletionRecord(t);
            return sum + (record?.actualDurationMinutes ?? 0);
          }, 0)
        : 0,
    [plan]
  );

  const checkedInDays = useMemo(() => {
    if (!stats) return 0;
    return dayOrder.filter((day) => stats.byDay[day].done > 0).length;
  }, [stats]);

  const categoryStats = useMemo(() => {
    if (!plan) return [];
    return (Object.keys(TASK_CATEGORY_LABELS) as TaskCategory[])
      .map((category) => {
        const totalMin = getCategoryMinutes(plan, category);
        const completedMin = getCompletedCategoryMinutes(plan, category);
        const s = stats?.byCategory[category];
        return {
          category,
          label: TASK_CATEGORY_LABELS[category],
          totalMin,
          completedMin,
          total: s?.total ?? 0,
          done: s?.done ?? 0,
          rate: s && s.total > 0 ? Math.round((s.done / s.total) * 100) : 0,
        };
      })
      .filter((c) => c.total > 0)
      .sort((a, b) => b.totalMin - a.totalMin);
  }, [plan, stats]);

  const dailyTrend = useMemo(() => {
    if (!stats) return [];
    return dayOrder.map((day) => ({
      day,
      date: getDayDateLabel(weekId, day),
      total: stats.byDay[day].total,
      done: stats.byDay[day].done,
    }));
  }, [stats, weekId]);

  const highFrequencyTasks = useMemo(() => {
    if (!plan) return [];
    const tasks = plan.tasks
      .filter((t) => t.status === 'done' || t.status === 'partially_done')
      .map((t) => ({
        id: t.id,
        focus: t.focus,
        day: t.day,
        category: t.category,
        status: t.status,
        record: getLatestCompletionRecord(t),
      }))
      .filter((t) => t.record)
      .slice(0, 8);
    return tasks;
  }, [plan]);

  const subjectTimeData = useMemo(() => {
    return subjectStats
      .filter((s) => s.plannedMinutes > 0 || s.actualMinutes > 0)
      .map((s) => ({
        subjectId: s.subjectId,
        name: s.name,
        color: s.color,
        plannedMinutes: s.plannedMinutes,
        actualMinutes: s.actualMinutes,
      }));
  }, [subjectStats]);

  const subjectWeeklyTrend = useMemo(() => {
    if (!currentChild) return [];
    return getSubjectWeeklyTrend(weeklyPlans, currentChild.id, weekId);
  }, [weeklyPlans, currentChild, weekId]);

  const timeAnalysisAlerts = useMemo(() => {
    return getTimeAnalysisAlerts(subjectStats, totalMinutes, actualMinutes);
  }, [subjectStats, totalMinutes, actualMinutes]);

  useEffect(() => {
    if (!plan?.id || plan.aiSummary || autoGenerated || aiGenerating) return;
    setAutoGenerated(true);
    setAiGenerating(true);
    generateAiSummary.mutate(plan.id, {
      onSettled: () => setAiGenerating(false),
    });
  }, [plan?.id, plan?.aiSummary, autoGenerated, aiGenerating, generateAiSummary]);

  useEffect(() => {
    setAutoGenerated(false);
  }, [weekId, currentChild?.id]);

  const handleRefreshAiSummary = () => {
    if (!plan?.id) return;
    setAiGenerating(true);
    generateAiSummary.mutate(plan.id, {
      onSettled: () => setAiGenerating(false),
    });
  };

  if (!currentChild) {
    return (
      <div className="space-y-8">
        <SlideUp className="flex items-center gap-3">
          <div className="bg-primary/10 border-primary/20 flex size-10 items-center justify-center rounded-xl border">
            <Icon name="BarChart3" size="md" className="text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">成长报告</h1>
        </SlideUp>
        <ChildEmptyState description="添加孩子后，即可查看日报与周报" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <SlideUp className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
            <Icon name="BarChart3" size="md" className="text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">成长报告</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => (window.location.href = '/dashboard/reports/briefing')}
            className="bg-ai/10 border-ai/20 hover:bg-ai/15 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium text-ai transition-colors"
          >
            <Icon name="Sparkles" size="sm" />
            AI 简报
          </Button>

          {plan && stats && (
          <div className="flex items-center justify-end gap-1 rounded-xl border border-border-default bg-surface-elevated p-1 shadow-sm">
            <Button
              variant="secondary"
              onClick={() => setWeekId((w) => shiftWeekId(w, -1))}
              size="sm"
              className="size-8 rounded-lg border-0 bg-transparent p-0"
              aria-label="上一周"
            >
              <Icon name="ChevronLeft" size="sm" />
            </Button>
            <div className="relative">
              <Select
                value={weekId}
                onChange={(e) => setWeekId(e.target.value)}
                size="sm"
                className="min-w-[180px] border-0 bg-transparent focus:ring-0"
                options={weekOptions}
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => setWeekId((w) => shiftWeekId(w, 1))}
              size="sm"
              className="size-8 rounded-lg border-0 bg-transparent p-0"
              aria-label="下一周"
            >
              <Icon name="ChevronRight" size="sm" />
            </Button>
          </div>
        )}
        </div>
      </SlideUp>

      {plan && stats && (
        <StaggerContainer className="space-y-6">
          {/* AI weekly summary */}
          <StaggerItem>
            <GlassCard strength="strong" glow="ai" className="max-sm:!bg-surface max-sm:!backdrop-blur-none max-sm:!border-border-default p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Icon name="Sparkles" size="md" animate="pulse" className="text-ai" />
                  <h2 className="text-lg font-bold text-text-secondary">AI 周报总结</h2>
                </div>
                <Button
                  variant="secondary"
                  onClick={handleRefreshAiSummary}
                  disabled={aiGenerating}
                  className="bg-ai/10 border-ai/20 hover:bg-ai/15 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-ai transition-colors disabled:opacity-50"
                >
                  {aiGenerating ? (
                    <Icon name="Loader2" size="xs" animate="spin" />
                  ) : (
                    <Icon name="RotateCw" size="xs" />
                  )}
                  {aiGenerating ? '生成中...' : '重新生成'}
                </Button>
              </div>

              {plan.aiSummary ? (
                <div className="bg-ai/[0.06] border-ai/15 rounded-xl border p-4">
                  <p className="text-sm leading-relaxed text-text-tertiary">{plan.aiSummary}</p>
                </div>
              ) : (
                <div className="rounded-xl border border-border-subtle bg-surface-elevated p-6 text-center">
                  <p className="text-sm text-text-muted">
                    {aiGenerating ? 'AI 正在分析本周数据...' : '点击上方按钮生成本周 AI 总结。'}
                  </p>
                </div>
              )}
            </GlassCard>
          </StaggerItem>

          {/* Overview cards */}
          <StaggerItem className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="计划任务"
              value={stats.total}
              icon="Target"
              variant="glass"
              countUp
              suffix="项"
            />

            <MetricCard
              label="学习时长"
              value={formatMinutes(actualMinutes)}
              icon="Clock"
              variant="glass"
              description={`计划 ${formatMinutes(totalMinutes)}`}
            />

            <MetricCard
              label="打卡天数"
              value={checkedInDays}
              icon="Calendar"
              variant="glass"
              countUp
              suffix="天"
            />

            <MetricCard
              label="完成率"
              value={stats.completionRate}
              icon="TrendingUp"
              variant="glass"
              countUp
              suffix="%"
            />
          </StaggerItem>

          {/* Progress analysis */}
          <StaggerItem>
            <GlassCard className="p-5">
              <div className="mb-5 flex items-center gap-2">
                <Icon name="TrendingUp" size="md" className="text-primary" />
                <h2 className="text-lg font-bold text-text-secondary">整体目标推进分析</h2>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">时间进度</span>
                    <span className="text-sm font-bold text-text-primary">{timeProgress}%</span>
                  </div>
                  <ProgressBar value={timeProgress} size="lg" barClassName="bg-secondary" />
                  <p className="text-xs text-text-muted">
                    本周已过去 {Math.round((timeProgress / 100) * 7)} / 7 天
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">任务进度</span>
                    <span className="text-sm font-bold text-text-primary">{taskProgress}%</span>
                  </div>
                  <ProgressBar value={taskProgress} variant="gradient" size="lg" />
                  <p className="text-xs text-text-muted">
                    已完成 {stats.done} / {stats.total} 项任务
                  </p>
                </div>

                <GlassCard strength="subtle" className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`text-sm font-bold ${progressStatus.color}`}>
                      {progressStatus.label}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-text-tertiary">
                    {progressStatus.message}
                  </p>
                </GlassCard>
              </div>
            </GlassCard>
          </StaggerItem>

          {/* Subject analysis */}
          <StaggerItem>
            <GlassCard className="p-5">
              <div className="mb-5 flex items-center gap-2">
                <Icon name="Target" size="md" className="text-secondary" />
                <h2 className="text-lg font-bold text-text-secondary">学科分析</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {subjectStats.map((subject) => (
                  <GlassCard key={subject.subjectId} strength="subtle" className="space-y-4 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex size-10 items-center justify-center rounded-xl text-sm font-bold text-white"
                          style={{ backgroundColor: subject.color }}
                        >
                          {subject.name.slice(0, 1)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-secondary">
                            {subject.name}
                          </p>
                          <p className="text-xs text-text-muted">
                            {subject.total > 0
                              ? `${subject.done}/${subject.total} 完成`
                              : '本周无任务'}
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-text-primary">{subject.rate}%</span>
                    </div>

                    <ProgressBar value={subject.rate} size="sm" />

                    <div className="space-y-1 text-xs">
                      <p className="text-text-muted">
                        <span className="text-text-secondary">当前阶段：</span>
                        {subject.currentTopic}
                      </p>
                      <p className="text-text-muted">
                        <span className="text-text-secondary">建议时长：</span>
                        {subject.dailyTime}/天
                      </p>
                      <p className="text-text-muted">
                        <span className="text-text-secondary">实际投入：</span>
                        {formatMinutes(subject.actualMinutes)} / 计划{' '}
                        {formatMinutes(subject.plannedMinutes)}
                      </p>
                    </div>

                    {subject.weakSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {subject.weakSkills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-warning/10 border-warning/20 rounded-full border px-2 py-0.5 text-[10px] text-warning"
                          >
                            薄弱：{skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {subject.focusList.length > 0 && (
                      <div className="border-t border-border-subtle pt-2">
                        <p className="mb-1 text-[10px] text-text-muted">本周完成重点</p>
                        <div className="flex flex-wrap gap-1">
                          {subject.focusList.map((focus, idx) => (
                            <span
                              key={idx}
                              className="rounded-md border border-border-subtle bg-surface px-2 py-0.5 text-[10px] text-text-secondary"
                            >
                              {focus}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </GlassCard>
                ))}
              </div>
            </GlassCard>
          </StaggerItem>

          {/* Subject time analysis */}
          <StaggerItem>
            <GlassCard className="p-5">
              <div className="mb-5 flex items-center gap-2">
                <Icon name="PieChart" size="md" className="text-primary" />
                <h2 className="text-lg font-bold text-text-secondary">学科时间投入分析</h2>
              </div>

              {subjectTimeData.length === 0 ? (
                <EmptyState scene="no-data" size="sm" />
              ) : (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <MetricCard
                      label="计划总时长"
                      value={Math.round(totalMinutes / 60 * 10) / 10}
                      suffix="h"
                      icon="Clock"
                      variant="glass"
                    />
                    <MetricCard
                      label="实际总时长"
                      value={Math.round(actualMinutes / 60 * 10) / 10}
                      suffix="h"
                      icon="Timer"
                      variant="glass"
                    />
                    <MetricCard
                      label="时间完成率"
                      value={totalMinutes > 0 ? Math.round((actualMinutes / totalMinutes) * 100) : 0}
                      suffix="%"
                      icon="TrendingUp"
                      variant="glass"
                    />
                    <GlassCard className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-text-secondary">最大投入学科</p>
                          <p className="mt-1 truncate text-2xl font-bold text-text-primary">
                            {subjectTimeData.reduce((max, s) =>
                              s.actualMinutes > max.actualMinutes ? s : max
                            )?.name ?? '-'}
                          </p>
                        </div>
                        <div className="bg-primary/10 shrink-0 rounded-lg p-2 text-primary">
                          <Icon name="Target" size="md" />
                        </div>
                      </div>
                    </GlassCard>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Pie chart */}
                    <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
                      <p className="mb-3 text-sm font-semibold text-text-secondary">学科实际时长占比</p>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={subjectTimeData}
                              dataKey="actualMinutes"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={4}
                            >
                              {subjectTimeData.map((entry) => (
                                <Cell key={entry.subjectId} fill={entry.color} stroke="transparent" />
                              ))}
                            </Pie>
                            <RechartsTooltip content={<SubjectTooltip />} />
                            <RechartsLegend
                              verticalAlign="bottom"
                              iconType="circle"
                              formatter={(value: string, entry: { payload?: { actualMinutes?: number; plannedMinutes?: number } }) =>
                                `${value} · ${formatMinutes(entry?.payload?.actualMinutes ?? 0)}`
                              }
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Bar chart */}
                    <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
                      <p className="mb-3 text-sm font-semibold text-text-secondary">计划 vs 实际时长</p>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={subjectTimeData}
                            margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
                          >
                            <CartesianGrid stroke="var(--border-subtle)" strokeWidth={1} vertical={false} />
                            <XAxis
                              dataKey="name"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                              dy={8}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                              width={40}
                              tickFormatter={(v: number) => `${Math.round(v / 60)}h`}
                            />
                            <RechartsTooltip content={<SubjectTooltip />} />
                            <Bar
                              dataKey="plannedMinutes"
                              name="计划时长"
                              fill="var(--color-primary)"
                              radius={[4, 4, 0, 0]}
                              barSize={24}
                            />
                            <Bar
                              dataKey="actualMinutes"
                              name="实际时长"
                              fill="var(--color-secondary)"
                              radius={[4, 4, 0, 0]}
                              barSize={24}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Trend chart */}
                  <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
                    <p className="mb-3 text-sm font-semibold text-text-secondary">近 4 周学科实际投入趋势</p>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={subjectWeeklyTrend}
                          margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
                        >
                          <CartesianGrid stroke="var(--border-subtle)" strokeWidth={1} vertical={false} />
                          <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
                            dy={8}
                            tickFormatter={(value: string) => value.split(' - ')[0]}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
                            width={40}
                            tickFormatter={(v: number) => `${Math.round(v / 60)}h`}
                          />
                          <RechartsTooltip content={<SubjectTooltip />} />
                          <Line
                            type="monotone"
                            dataKey="chinese"
                            name="语文"
                            stroke={subjectMeta.chinese.color}
                            strokeWidth={2}
                            dot={{ r: 3, fill: subjectMeta.chinese.color }}
                            activeDot={{ r: 5 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="math"
                            name="数学"
                            stroke={subjectMeta.math.color}
                            strokeWidth={2}
                            dot={{ r: 3, fill: subjectMeta.math.color }}
                            activeDot={{ r: 5 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="english"
                            name="英语"
                            stroke={subjectMeta.english.color}
                            strokeWidth={2}
                            dot={{ r: 3, fill: subjectMeta.english.color }}
                            activeDot={{ r: 5 }}
                          />
                          <RechartsLegend iconType="circle" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Alerts */}
                  {timeAnalysisAlerts.length > 0 && (
                    <div className="space-y-2">
                      {timeAnalysisAlerts.map((alert) => {
                        const alertStyles = {
                          warning: 'border-warning/20 bg-warning/10 text-warning',
                          info: 'border-ai/20 bg-ai/10 text-ai',
                          success: 'border-success/20 bg-success/10 text-success',
                        };
                        const iconMap = {
                          warning: 'AlertTriangle',
                          info: 'Info',
                          success: 'CheckCircle2',
                        } as const;
                        return (
                          <div
                            key={alert.id}
                            className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${alertStyles[alert.type]}`}
                          >
                            <Icon name={iconMap[alert.type]} size="sm" className="mt-0.5 shrink-0" />
                            <span>{alert.message}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          </StaggerItem>

          {/* Reading literacy */}
          <StaggerItem>
            <ReadingReportSection
              childId={currentChild.id}
              childName={currentChild.name}
              grade={currentChild.grade}
              plan={plan}
              weeklyPlans={weeklyPlans}
            />
          </StaggerItem>

          {/* High-frequency task details */}
          {highFrequencyTasks.length > 0 && (
            <StaggerItem>
              <GlassCard className="p-5">
                <div className="mb-5 flex items-center gap-2">
                  <Icon name="Calendar" size="md" className="text-accent" />
                  <h2 className="text-lg font-bold text-text-secondary">任务完成明细</h2>
                </div>

                <div className="space-y-3">
                  {highFrequencyTasks.map((task) => {
                    const detail = task.record ? formatRecordDetail(task.record) : '';
                    return (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 rounded-xl border border-border-subtle bg-surface-elevated p-3"
                      >
                        <div
                          className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] ${
                            task.status === 'done'
                              ? 'bg-success/15 text-success'
                              : 'bg-warning/15 text-warning'
                          }`}
                        >
                          {task.status === 'done' ? '✓' : '◐'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-text-secondary">{task.focus}</p>
                          {detail && (
                            <p className="mt-0.5 truncate text-xs text-text-muted">{detail}</p>
                          )}
                        </div>
                        <span className="shrink-0 text-xs text-text-muted">{task.day}</span>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </StaggerItem>
          )}

          {/* Category analysis */}
          <StaggerItem>
            <GlassCard className="p-5">
              <div className="mb-5 flex items-center gap-2">
                <Icon name="BarChart3" size="md" className="text-secondary" />
                <h2 className="text-lg font-bold text-text-secondary">各领域投入分析</h2>
              </div>

              {categoryStats.length === 0 ? (
                <EmptyState scene="no-data" size="sm" />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryStats.map((cat) => {
                    const CategoryIcon = categoryIcons[cat.category];
                    return (
                      <div
                        key={cat.category}
                        className="space-y-3 rounded-xl border border-border-subtle bg-surface-elevated p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex size-9 items-center justify-center rounded-lg ${TASK_CATEGORY_COLORS[cat.category]}`}
                          >
                            <CategoryIcon className="size-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-text-secondary">
                              {cat.label}
                            </p>
                            <p className="text-xs text-text-muted">
                              {cat.completedMin} / {cat.totalMin} 分钟
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-text-muted">完成率</span>
                            <span className="font-bold text-text-primary">{cat.rate}%</span>
                          </div>
                          <ProgressBar value={cat.rate} variant="gradient" size="sm" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </GlassCard>
          </StaggerItem>

          {/* Daily trend */}
          <StaggerItem>
            <GlassCard className="p-5">
              <div className="mb-5 flex items-center gap-2">
                <Icon name="Calendar" size="md" className="text-accent" />
                <h2 className="text-lg font-bold text-text-secondary">每日完成趋势</h2>
              </div>

              <TrendChart
                data={dailyTrend.map((d) => ({ ...d, date: `${d.day}\n${d.date}` }))}
                xKey="day"
                bars={[
                  { key: 'total', name: '总任务', color: 'var(--color-primary)' },
                  { key: 'done', name: '已完成', color: 'var(--color-secondary)' },
                ]}
                type="bar"
                height={180}
              />
            </GlassCard>
          </StaggerItem>

          {/* Sharing is not available yet; keep the report focused on actionable data. */}
        </StaggerContainer>
      )}

      {!plan && (
        <SlideUp>
          <EmptyState
            icon="Calendar"
            title="本周暂无计划"
            description="去「周计划」页面发布本周计划后，这里会生成周报。"
          />
        </SlideUp>
      )}
    </div>
  );
}
