'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SlideUp, StaggerContainer, StaggerItem } from '@/components/motion';
import { Icon } from '@/components/ui/icon';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';
import EmptyState from '@/components/ui/EmptyState';
import GlassCard from '@/components/ui/glass-card';
import MetricCard from '@/components/ui/metric-card';
import ProgressRing from '@/components/ui/progress-ring';
import TrendChart from '@/components/ui/trend-chart';
import Heatmap from '@/components/ui/heatmap';
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
} from '@/lib/weeklyTasks';
import { useGenerateAiSummary, useSaveWeeklyPlan } from '@/lib/hooks/useWeeklyPlans';

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

export default function ReportsPage() {
  const { children, currentChild, getWeeklyPlan } = useChildren();
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
      <SlideUp>
        <GlassCard strength="strong" glow="secondary" className="max-sm:!bg-surface max-sm:!backdrop-blur-none max-sm:!border-border-default p-5 sm:p-6">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 border-primary/20 flex size-10 items-center justify-center rounded-xl border">
                <Icon name="BarChart3" size="md" className="text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold sm:text-3xl">成长报告</h1>
            </div>

            {plan && stats && (
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setWeekId((w) => shiftWeekId(w, -1))}
                  className="flex size-8 items-center justify-center rounded-[14px] border border-border-default bg-surface text-text-secondary transition-colors hover:bg-surface-hover"
                  aria-label="上一周"
                >
                  <Icon name="ChevronLeft" size="sm" />
                </button>
                <div className="relative">
                  <select
                    value={weekId}
                    onChange={(e) => setWeekId(e.target.value)}
                    className="focus:border-primary/50 focus:ring-primary/10 min-w-[180px] cursor-pointer appearance-none rounded-[14px] border border-border-default bg-surface py-1.5 pl-3 pr-9 text-sm font-medium text-text-primary transition-colors focus:outline-none focus:ring-2"
                    aria-label="选择周"
                  >
                    {weekOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <Icon
                    name="ChevronDown"
                    size="sm"
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary"
                  />
                </div>
                <button
                  onClick={() => setWeekId((w) => shiftWeekId(w, 1))}
                  className="flex size-8 items-center justify-center rounded-[14px] border border-border-default bg-surface text-text-secondary transition-colors hover:bg-surface-hover"
                  aria-label="下一周"
                >
                  <Icon name="ChevronRight" size="sm" />
                </button>
              </div>
            )}
          </div>
        </GlassCard>
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
                <button
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
                </button>
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

            <GlassCard className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Icon name="Clock" size="sm" className="text-secondary" />
                <span className="text-xs text-text-muted">学习时长</span>
              </div>
              <p className="font-display text-2xl font-bold text-text-primary">
                {formatMinutes(actualMinutes)}
              </p>
              <p className="mt-0.5 text-xs text-text-tertiary">
                计划 {formatMinutes(totalMinutes)}
              </p>
            </GlassCard>

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

          {/* Share action */}
          <StaggerItem className="flex justify-end">
            <button
              onClick={() => alert('分享图功能将在后续迭代中提供')}
              className="hover:bg-primary/90 flex items-center gap-2 rounded-[14px] bg-primary px-5 py-2.5 text-sm font-medium text-text-primary shadow-[0_0_16px_rgba(244,63,122,0.25)] transition-all"
            >
              <Icon name="Share2" size="sm" />
              生成分享图
            </button>
          </StaggerItem>
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
