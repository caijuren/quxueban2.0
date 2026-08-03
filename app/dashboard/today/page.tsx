'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Check,
  ChevronRight,
  CalendarCheck,
  Clock,
  Target,
  Sparkles,
  Send,
  Trophy,
} from 'lucide-react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import EmptyState from '@/components/ui/EmptyState';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';
import CommandCard from '@/components/ui/CommandCard';
import TaskCompletionModal from '@/components/today/TaskCompletionModal';
import DailyVictoryModal from '@/components/today/DailyVictoryModal';
import { categoryIcons, allCategories } from '@/lib/taskIcons';
import { getTodayName, getCurrentWeekId } from '@/lib/weeklyTasks';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { getCategoryColorClass } from '@/lib/taskAlignment';
import { useCompleteTask } from '@/lib/hooks/useWeeklyPlans';
import { useDingTalkPush } from '@/lib/hooks/useDingTalk';
import { TaskCategory, WeeklyTaskItem } from '@/lib/storage.types';
import { TaskCompletionInput } from '@/lib/validation';

function ProgressRing({
  rate,
  size = 56,
  stroke = 5,
}: {
  rate: number;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (rate / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progress-gradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
        <defs>
          <linearGradient id="progress-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold font-display text-text-primary tabular-nums">
          {rate}%
        </span>
      </div>
    </div>
  );
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function getTodayRecord(task: WeeklyTaskItem, date: string) {
  return task.completionRecords?.find((r) => r.date === date);
}

function isDayPushed(tasks: WeeklyTaskItem[], date: string) {
  return tasks.some((task) => {
    const record = getTodayRecord(task, date);
    return !!record?.dingtalkPushedAt;
  });
}

function isDayFullyDone(tasks: WeeklyTaskItem[]) {
  if (tasks.length === 0) return false;
  return tasks.every((t) => t.status === 'done');
}

function parseDurationMinutes(duration: string): number {
  const match = duration.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function getCategoryTimeSlot(category: TaskCategory): string {
  const map: Record<TaskCategory, string> = {
    school: '上午',
    reading: '下午',
    sport: '下午',
    interest: '傍晚',
    ability: '晚上',
    other: '灵活',
  };
  return map[category] || '灵活';
}

export default function TodayPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const { children, currentChild, getWeeklyPlan } = useChildren();
  const completeTask = useCompleteTask();
  const dingTalkPush = useDingTalkPush();

  const todayName = getTodayName();
  const todayDate = getTodayStr();
  const currentWeekPlan = currentChild
    ? getWeeklyPlan(getCurrentWeekId(), currentChild.id)
    : undefined;
  const todayTasks = useMemo(
    () => currentWeekPlan?.tasks.filter((t) => t.day === todayName) ?? [],
    [currentWeekPlan, todayName]
  );

  const groupedTasks = useMemo(() => {
    const grouped = new Map<TaskCategory, typeof todayTasks>();
    allCategories.forEach((cat) => grouped.set(cat, []));
    todayTasks.forEach((task) => {
      const cat = (task.category || 'other') as TaskCategory;
      if (!grouped.has(cat)) grouped.set(cat, []);
      grouped.get(cat)!.push(task);
    });
    return grouped;
  }, [todayTasks]);

  const doneCount = todayTasks.filter((t) => t.status === 'done').length;
  const totalCount = todayTasks.length;
  const completionRate =
    totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);
  const totalMinutes = todayTasks.reduce(
    (sum, t) => sum + parseDurationMinutes(t.duration),
    0
  );
  const remainingMinutes = todayTasks
    .filter((t) => t.status !== 'done')
    .reduce((sum, t) => sum + parseDurationMinutes(t.duration), 0);

  const isFullyDone = isDayFullyDone(todayTasks);
  const isPushed = isDayPushed(todayTasks, todayDate);

  const [selectedTask, setSelectedTask] = useState<WeeklyTaskItem | null>(null);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [victoryOpen, setVictoryOpen] = useState(false);
  const [manualPushTriggered, setManualPushTriggered] = useState(false);
  const autoPushTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpenCompletion = (task: WeeklyTaskItem) => {
    setSelectedTask(task);
    setCompletionOpen(true);
  };

  const handleSubmitCompletion = async (
    taskId: string,
    input: TaskCompletionInput
  ) => {
    if (!currentWeekPlan?.id) return;
    await completeTask.mutateAsync({
      planId: currentWeekPlan.id,
      taskId,
      input,
    });
  };

  const handlePush = useCallback(async () => {
    if (!currentChild) return;
    await dingTalkPush.mutateAsync({
      childId: currentChild.id,
      date: todayDate,
    });
    setManualPushTriggered(true);
  }, [currentChild, todayDate, dingTalkPush]);

  // Auto-push at 23:59:50 if all done and not yet pushed
  useEffect(() => {
    if (!currentChild || !isFullyDone || isPushed || manualPushTriggered) {
      if (autoPushTimerRef.current) {
        clearTimeout(autoPushTimerRef.current);
        autoPushTimerRef.current = null;
      }
      return;
    }

    const now = new Date();
    const target = new Date(now);
    target.setHours(23, 59, 50, 0);
    if (target.getTime() <= now.getTime()) {
      handlePush();
      return;
    }

    const delay = target.getTime() - now.getTime();
    autoPushTimerRef.current = setTimeout(() => {
      handlePush();
    }, delay);

    return () => {
      if (autoPushTimerRef.current) {
        clearTimeout(autoPushTimerRef.current);
      }
    };
  }, [currentChild, isFullyDone, isPushed, manualPushTriggered, todayDate, handlePush]);

  // Catch up: if previous days had all-done unpushed summaries, push them on load
  useEffect(() => {
    if (!currentChild || !currentWeekPlan) return;

    const checkDates = [todayDate];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    checkDates.push(yesterday.toISOString().split('T')[0]);

    checkDates.forEach((date) => {
      const dayName = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][
        new Date(date).getDay()
      ];
      const dayTasks = currentWeekPlan.tasks.filter((t) => t.day === dayName);
      if (
        dayTasks.length > 0 &&
        isDayFullyDone(dayTasks) &&
        !isDayPushed(dayTasks, date)
      ) {
        dingTalkPush.mutate({ childId: currentChild.id, date });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChild?.id, currentWeekPlan?.id]);

  // Show victory modal automatically when 100% complete
  useEffect(() => {
    if (isFullyDone && !isPushed && !manualPushTriggered) {
      setVictoryOpen(true);
    }
  }, [isFullyDone, isPushed, manualPushTriggered]);

  const progressText =
    completionRate === 100
      ? '今日任务全部完成！'
      : completionRate >= 60
      ? '完成度不错，继续加油'
      : totalCount > 0
      ? '今天任务还不少，先完成重要的'
      : '今日暂无任务';

  if (children.length === 0) {
    return <ChildEmptyState description="添加孩子后，系统会根据年级自动生成今日任务" />;
  }

  return (
    <div className="space-y-6 min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <CalendarCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">
              {currentChild ? currentChild.name : '未选择孩子'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isFullyDone && (
            <button
              onClick={() => setVictoryOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-success/10 border border-success/20 text-success text-xs font-medium hover:bg-success/20 transition-colors"
            >
              <Trophy className="w-3.5 h-3.5" />
              今日胜利
            </button>
          )}
          <div className="text-right shrink-0">
            <p className="text-2xl sm:text-3xl font-bold font-display tabular-nums text-text-primary">
              {doneCount}
              <span className="text-text-muted text-base sm:text-lg">/{totalCount}</span>
            </p>
            <p className="text-[10px] text-text-tertiary">已完成</p>
          </div>
        </div>
      </motion.div>

      {/* Sticky progress summary */}
      {currentChild && (
        <div className="sticky top-4 z-30">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <CommandCard active className="p-3 sm:p-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <ProgressRing rate={completionRate} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-semibold font-display text-text-primary">
                    {progressText}
                  </p>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    {totalCount > 0 ? (
                      <>
                        剩余{' '}
                        <span className="text-text-secondary font-medium">
                          {remainingMinutes}
                        </span>{' '}
                        分钟 · 今日总计{' '}
                        <span className="text-text-secondary font-medium">
                          {totalMinutes}
                        </span>{' '}
                        分钟
                      </>
                    ) : (
                      '当前孩子今天没有安排任务'
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setVictoryOpen(true)}
                  disabled={!isFullyDone}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border-default text-xs font-medium text-text-secondary hover:bg-surface-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                  推送
                </button>
              </div>
            </CommandCard>
          </motion.div>
        </div>
      )}

      {/* Empty state */}
      {currentChild && totalCount === 0 ? (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <EmptyState
            icon={Sparkles}
            title="今日无任务"
            description="当前孩子今天没有安排任务，去周计划页面添加吧。"
            action={{
              label: '去周计划',
              onClick: () => router.push('/dashboard/weekly'),
            }}
          />
        </motion.div>
      ) : (
        /* Task grid */
        <div className="space-y-5">
          {allCategories.map((category, catIndex) => {
            const tasks = groupedTasks.get(category) ?? [];
            if (tasks.length === 0) return null;
            const categoryDone = tasks.filter((t) => t.status === 'done').length;
            const categoryRate = Math.round((categoryDone / tasks.length) * 100);
            const categoryColorClass = getCategoryColorClass(category);

            return (
              <motion.div
                key={category}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + catIndex * 0.05 }}
              >
                {/* Category header with progress bar */}
                <div className="mb-2.5 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-text-secondary tracking-wide">
                      {TASK_CATEGORY_LABELS[category]}
                    </span>
                    <span className="text-xs font-medium text-text-tertiary tabular-nums">
                      {categoryDone}/{tasks.length}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-surface rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${categoryColorClass.replace('text-', 'bg-').replace('/10', '').replace('/20', '')}`}
                      style={{ width: `${categoryRate}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {tasks.map((task) => {
                    const isDone = task.status === 'done';
                    const record = getTodayRecord(task, todayDate);
                    const quality = record?.quality;
                    const CategoryIcon = categoryIcons[category];
                    const materialsText = task.materials.join('、');

                    return (
                      <button
                        key={task.id}
                        onClick={() => handleOpenCompletion(task)}
                        className={`group relative text-left p-2.5 rounded-xl border transition-all duration-200 min-h-[84px] flex items-start gap-3 overflow-hidden ${
                          isDone
                            ? 'bg-surface border-success/20 opacity-80'
                            : 'bg-surface-light border-border-default hover:border-border-strong hover:bg-surface-highlight'
                        }`}
                      >
                        {/* Left completion checkbox */}
                        <div
                          className={`shrink-0 w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center transition-all ${
                            isDone
                              ? 'bg-success border-success'
                              : 'border-text-muted group-hover:border-text-tertiary'
                          }`}
                        >
                          {isDone && <Check className="w-3 h-3 text-text-primary" />}
                        </div>

                        {/* Done indicator line */}
                        {isDone && (
                          <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-success/60" />
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0 py-0.5">
                          <div className="flex items-start gap-2">
                            <p
                              className={`text-sm font-semibold leading-snug flex-1 transition-colors ${
                                isDone
                                  ? 'text-text-tertiary line-through'
                                  : 'text-text-primary'
                              }`}
                            >
                              {task.focus}
                            </p>
                            <div className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center ${categoryColorClass}`}>
                              <CategoryIcon className="w-3.5 h-3.5" />
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-surface-elevated border border-border-subtle text-text-tertiary">
                              <Clock className="w-3 h-3" />
                              {task.duration}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-elevated border border-border-subtle text-text-tertiary">
                              {getCategoryTimeSlot(category)}
                            </span>
                            {materialsText && (
                              <span
                                title={materialsText}
                                className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-elevated border border-border-subtle text-text-tertiary truncate max-w-[120px]"
                              >
                                {materialsText}
                              </span>
                            )}
                            {quality && (
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                                  quality === 'excellent'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : quality === 'good'
                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                    : quality === 'average'
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                }`}
                              >
                                {quality === 'excellent'
                                  ? '优秀'
                                  : quality === 'good'
                                  ? '良好'
                                  : quality === 'average'
                                  ? '一般'
                                  : '需努力'}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Bottom action bar */}
      {totalCount > 0 && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2"
        >
          <button
            onClick={() => setVictoryOpen(true)}
            disabled={!isFullyDone}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border-default text-sm font-medium text-text-secondary hover:bg-surface-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            手动推送简报
          </button>
          <button
            onClick={() => router.push('/dashboard/weekly')}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-border-default text-text-tertiary hover:text-text-secondary hover:border-border-strong hover:bg-surface-light transition-all text-sm"
          >
            <Target className="w-4 h-4" />
            查看完整周计划
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Weekly view shortcut */}
      {totalCount === 0 && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="pt-2"
        >
          <button
            onClick={() => router.push('/dashboard/weekly')}
            className="w-full py-3 rounded-xl border border-dashed border-border-default text-text-tertiary hover:text-text-secondary hover:border-border-strong hover:bg-surface-light transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Target className="w-4 h-4" />
            查看完整周计划
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      <TaskCompletionModal
        open={completionOpen}
        task={selectedTask}
        onClose={() => setCompletionOpen(false)}
        onSubmit={handleSubmitCompletion}
      />

      {currentChild && (
        <DailyVictoryModal
          open={victoryOpen}
          childName={currentChild.name}
          date={todayDate}
          tasks={todayTasks}
          onClose={() => setVictoryOpen(false)}
          onPush={handlePush}
          pushing={dingTalkPush.isPending}
          pushed={isPushed || manualPushTriggered}
        />
      )}
    </div>
  );
}
