'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  RotateCw,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';
import CommandCard from '@/components/ui/CommandCard';
import EmptyState from '@/components/ui/EmptyState';
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
    const weeksFromCurrent = Math.round(
      (start.getTime() - currentStart.getTime()) / oneWeek
    );
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

function getCompletedCategoryMinutes(
  plan: WeeklyPlan,
  category: TaskCategory
): number {
  return plan.tasks
    .filter((t) => (t.category || 'other') === category && t.status === 'done')
    .reduce((sum, t) => sum + parseDurationMinutes(t.duration), 0);
}

function getLatestCompletionRecord(
  task: { completionRecords?: TaskCompletionRecord[] }
): TaskCompletionRecord | undefined {
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
  const shouldReduceMotion = useReducedMotion();
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
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display">成长报告</h1>
        </motion.div>
        <ChildEmptyState description="添加孩子后，即可查看日报与周报" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display">成长报告</h1>
      </motion.div>

      {plan && stats && (
        <>
          {/* Week selector */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="flex items-center justify-end gap-2"
          >
            <button
              onClick={() => setWeekId((w) => shiftWeekId(w, -1))}
              className="w-8 h-8 flex items-center justify-center rounded-[14px] bg-surface border border-border-default text-text-secondary hover:bg-surface-hover transition-colors"
              aria-label="上一周"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="relative">
              <select
                value={weekId}
                onChange={(e) => setWeekId(e.target.value)}
                className="appearance-none pl-3 pr-9 py-1.5 rounded-[14px] border border-border-default bg-surface text-sm font-medium text-text-primary min-w-[180px] focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-colors cursor-pointer"
                aria-label="选择周"
              >
                {weekOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
            </div>
            <button
              onClick={() => setWeekId((w) => shiftWeekId(w, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-[14px] bg-surface border border-border-default text-text-secondary hover:bg-surface-hover transition-colors"
              aria-label="下一周"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* AI weekly summary */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <CommandCard className="p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-ai" />
                  <h2 className="text-lg font-bold text-text-secondary">AI 周报总结</h2>
                </div>
                <button
                  onClick={handleRefreshAiSummary}
                  disabled={aiGenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ai/10 border border-ai/20 text-ai text-xs font-medium hover:bg-ai/15 transition-colors disabled:opacity-50"
                >
                  {aiGenerating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RotateCw className="w-3.5 h-3.5" />
                  )}
                  {aiGenerating ? '生成中...' : '重新生成'}
                </button>
              </div>

              {plan.aiSummary ? (
                <div className="rounded-xl bg-ai/[0.06] border border-ai/15 p-4">
                  <p className="text-sm text-text-tertiary leading-relaxed">{plan.aiSummary}</p>
                </div>
              ) : (
                <div className="rounded-xl bg-surface-elevated border border-border-subtle p-6 text-center">
                  <p className="text-sm text-text-muted">
                    {aiGenerating ? 'AI 正在分析本周数据...' : '点击上方按钮生成本周 AI 总结。'}
                  </p>
                </div>
              )}
            </CommandCard>
          </motion.div>

          {/* Overview cards */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <CommandCard className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-xs text-text-muted">计划任务</span>
              </div>
              <p className="text-2xl font-bold font-display text-text-primary">{stats.total}</p>
              <p className="text-xs text-text-tertiary mt-0.5">已完成 {stats.done} 项</p>
            </CommandCard>

            <CommandCard className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-secondary" />
                <span className="text-xs text-text-muted">学习时长</span>
              </div>
              <p className="text-2xl font-bold font-display text-text-primary">
                {formatMinutes(actualMinutes)}
              </p>
              <p className="text-xs text-text-tertiary mt-0.5">计划 {formatMinutes(totalMinutes)}</p>
            </CommandCard>

            <CommandCard className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-accent" />
                <span className="text-xs text-text-muted">打卡天数</span>
              </div>
              <p className="text-2xl font-bold font-display text-text-primary">{checkedInDays}</p>
              <p className="text-xs text-text-tertiary mt-0.5">本周有打卡</p>
            </CommandCard>

            <CommandCard className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-xs text-text-muted">完成率</span>
              </div>
              <p className="text-2xl font-bold font-display text-text-primary">
                {stats.completionRate}%
              </p>
              <p className="text-xs text-text-tertiary mt-0.5">
                {stats.pending > 0 ? `${stats.pending} 项待完成` : '全部完成'}
              </p>
            </CommandCard>
          </motion.div>

          {/* Progress analysis */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <CommandCard className="p-5">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-text-secondary">整体目标推进分析</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">时间进度</span>
                    <span className="text-sm font-bold text-text-primary">{timeProgress}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-surface rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${timeProgress}%` }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="h-full rounded-full bg-secondary"
                    />
                  </div>
                  <p className="text-xs text-text-muted">
                    本周已过去 {Math.round((timeProgress / 100) * 7)} / 7 天
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">任务进度</span>
                    <span className="text-sm font-bold text-text-primary">{taskProgress}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-surface rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${taskProgress}%` }}
                      transition={{ duration: 0.6, delay: 0.35 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                  <p className="text-xs text-text-muted">
                    已完成 {stats.done} / {stats.total} 项任务
                  </p>
                </div>

                <div className="rounded-xl bg-surface-elevated border border-border-subtle p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-sm font-bold ${progressStatus.color}`}>
                      {progressStatus.label}
                    </span>
                  </div>
                  <p className="text-sm text-text-tertiary leading-relaxed">
                    {progressStatus.message}
                  </p>
                </div>
              </div>
            </CommandCard>
          </motion.div>

          {/* Subject analysis */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <CommandCard className="p-5">
              <div className="flex items-center gap-2 mb-5">
                <Target className="w-5 h-5 text-secondary" />
                <h2 className="text-lg font-bold text-text-secondary">学科分析</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subjectStats.map((subject) => (
                  <div
                    key={subject.subjectId}
                    className="rounded-xl bg-surface-elevated border border-border-subtle p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: subject.color }}
                        >
                          {subject.name.slice(0, 1)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-secondary">
                            {subject.name}
                          </p>
                          <p className="text-xs text-text-muted">
                            {subject.total > 0 ? `${subject.done}/${subject.total} 完成` : '本周无任务'}
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-text-primary">{subject.rate}%</span>
                    </div>

                    <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${subject.rate}%` }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                    </div>

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
                        {formatMinutes(subject.actualMinutes)} / 计划 {formatMinutes(subject.plannedMinutes)}
                      </p>
                    </div>

                    {subject.weakSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {subject.weakSkills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-full text-[10px] bg-warning/10 text-warning border border-warning/20"
                          >
                            薄弱：{skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {subject.focusList.length > 0 && (
                      <div className="pt-2 border-t border-border-subtle">
                        <p className="text-[10px] text-text-muted mb-1">本周完成重点</p>
                        <div className="flex flex-wrap gap-1">
                          {subject.focusList.map((focus, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[10px] bg-surface text-text-secondary border border-border-subtle"
                            >
                              {focus}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CommandCard>
          </motion.div>

          {/* High-frequency task details */}
          {highFrequencyTasks.length > 0 && (
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <CommandCard className="p-5">
                <div className="flex items-center gap-2 mb-5">
                  <Calendar className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-bold text-text-secondary">任务完成明细</h2>
                </div>

                <div className="space-y-3">
                  {highFrequencyTasks.map((task) => {
                    const detail = task.record ? formatRecordDetail(task.record) : '';
                    return (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 p-3 rounded-xl bg-surface-elevated border border-border-subtle"
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                            task.status === 'done'
                              ? 'bg-success/15 text-success'
                              : 'bg-warning/15 text-warning'
                          }`}
                        >
                          {task.status === 'done' ? '✓' : '◐'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-secondary">{task.focus}</p>
                          {detail && (
                            <p className="text-xs text-text-muted mt-0.5 truncate">{detail}</p>
                          )}
                        </div>
                        <span className="text-xs text-text-muted shrink-0">{task.day}</span>
                      </div>
                    );
                  })}
                </div>
              </CommandCard>
            </motion.div>
          )}

          {/* Category analysis */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <CommandCard className="p-5">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 className="w-5 h-5 text-secondary" />
                <h2 className="text-lg font-bold text-text-secondary">各领域投入分析</h2>
              </div>

              {categoryStats.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-8">暂无分类数据</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryStats.map((cat) => {
                    const CategoryIcon = categoryIcons[cat.category];
                    return (
                      <div
                        key={cat.category}
                        className="rounded-xl bg-surface-elevated border border-border-subtle p-4 space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center ${TASK_CATEGORY_COLORS[cat.category]}`}
                          >
                            <CategoryIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-secondary truncate">
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
                          <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${cat.rate}%` }}
                              transition={{ duration: 0.5, delay: 0.35 }}
                              className="h-full rounded-full bg-primary"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CommandCard>
          </motion.div>

          {/* Daily trend */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <CommandCard className="p-5">
              <div className="flex items-center gap-2 mb-5">
                <Calendar className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-bold text-text-secondary">每日完成趋势</h2>
              </div>

              <div className="flex items-end justify-between gap-2 h-44">
                {dailyTrend.map((day) => {
                  const maxTotal = Math.max(...dailyTrend.map((d) => d.total), 1);
                  const heightPercent = maxTotal > 0 ? (day.total / maxTotal) * 100 : 0;
                  const donePercent = day.total > 0 ? (day.done / day.total) * 100 : 0;
                  return (
                    <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full h-28 bg-surface rounded-xl overflow-hidden">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPercent}%` }}
                          transition={{ duration: 0.5, delay: 0.35 }}
                          className="absolute bottom-0 left-0 right-0 bg-surface-elevated"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPercent * (donePercent / 100)}%` }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-primary/70 rounded-xl"
                        />
                        {day.total > 0 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-text-primary drop-shadow">
                              {day.done}/{day.total}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-text-secondary">{day.day}</p>
                        <p className="text-[10px] text-text-muted">{day.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CommandCard>
          </motion.div>

          {/* Share action */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="flex justify-end"
          >
            <button
              onClick={() => alert('分享图功能将在后续迭代中提供')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-[14px] bg-primary text-text-primary text-sm font-medium hover:bg-primary/90 transition-all shadow-[0_0_16px_rgba(244,63,122,0.25)]"
            >
              <Share2 className="w-4 h-4" />
              生成分享图
            </button>
          </motion.div>
        </>
      )}

      {!plan && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <EmptyState
            icon={Calendar}
            title="本周暂无计划"
            description="去「周计划」页面发布本周计划后，这里会生成周报。"
          />
        </motion.div>
      )}
    </div>
  );
}
