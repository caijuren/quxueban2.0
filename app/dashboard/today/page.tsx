'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  Calendar,
  Clock,
  BookOpen,
  Backpack,
  Dumbbell,
  Palette,
  GraduationCap,
  Target,
  Sparkles,
} from 'lucide-react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import ChildAvatar from '@/components/dashboard/ChildAvatar';
import EmptyState from '@/components/ui/EmptyState';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';
import CommandCard from '@/components/ui/CommandCard';
import { getTodayName, getCurrentWeekId } from '@/lib/weeklyTasks';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { getCategoryColorClass } from '@/lib/taskAlignment';
import { TaskCategory } from '@/lib/storage.types';

const categoryIcons: Record<TaskCategory, typeof BookOpen> = {
  school: Backpack,
  reading: BookOpen,
  sport: Dumbbell,
  interest: Palette,
  ability: Target,
  other: GraduationCap,
};

const allCategories: TaskCategory[] = [
  'school',
  'reading',
  'sport',
  'interest',
  'ability',
  'other',
];

function ProgressRing({
  rate,
  size = 64,
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
        <span className="text-sm font-bold font-display text-text-primary tabular-nums">
          {rate}%
        </span>
      </div>
    </div>
  );
}

function TaskCard({
  task,
  onToggle,
}: {
  task: {
    id: string;
    status: string;
    focus: string;
    duration: string;
    materials: string[];
  };
  onToggle: () => void;
}) {
  const isDone = task.status === 'done';

  return (
    <button
      onClick={onToggle}
      className={`group w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
        isDone
          ? 'bg-success/5 border-success/10'
          : 'bg-surface-light border-border-default hover:border-border-strong hover:bg-surface-highlight'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5 transition-transform group-active:scale-95">
          {isDone ? (
            <CheckCircle2 className="w-7 h-7 text-success" />
          ) : (
            <Circle className="w-7 h-7 text-text-muted group-hover:text-text-tertiary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`text-base font-semibold mb-1.5 transition-colors ${
              isDone ? 'text-text-tertiary line-through' : 'text-text-primary'
            }`}
          >
            {task.focus}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-text-tertiary">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {task.duration}
            </span>
            {task.materials.length > 0 && (
              <span className="truncate max-w-[200px]">
                {task.materials.join('、')}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

export default function TodayPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const { children, currentChild, getWeeklyPlan, updateTaskStatus } = useChildren();

  const todayName = getTodayName();
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
  const completionRate = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);
  const totalMinutes = todayTasks.reduce((sum, t) => {
    const match = t.duration.match(/(\d+)/);
    return sum + (match ? parseInt(match[1], 10) : 0);
  }, 0);
  const remainingMinutes = todayTasks
    .filter((t) => t.status !== 'done')
    .reduce((sum, t) => {
      const match = t.duration.match(/(\d+)/);
      return sum + (match ? parseInt(match[1], 10) : 0);
    }, 0);

  const handleToggle = (taskId: string, currentStatus: string) => {
    if (!currentChild || !currentWeekPlan?.id) return;
    updateTaskStatus(
      currentChild.id,
      getCurrentWeekId(),
      taskId,
      currentStatus === 'done' ? 'pending' : 'done'
    );
  };

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
    <div className="space-y-5 min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <ChildAvatar child={currentChild} size="lg" shape="rounded" />
          <div>
            <p className="text-xs text-text-tertiary mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              今日任务 · {todayName}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">
              {currentChild ? currentChild.name : '未选择孩子'}
            </h1>
          </div>
        </div>
        <div className="text-right shrink-0 hidden sm:block">
          <p className="text-3xl font-bold font-display tabular-nums text-text-primary">
            {doneCount}<span className="text-text-muted text-lg">/{totalCount}</span>
          </p>
          <p className="text-[10px] text-text-tertiary">已完成</p>
        </div>
      </motion.div>

      {/* Progress card */}
      {currentChild && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <CommandCard active className="p-4 sm:p-5">
            <div className="flex items-center gap-4 sm:gap-5">
              <ProgressRing rate={completionRate} />
              <div className="flex-1 min-w-0">
                <p className="text-base sm:text-lg font-semibold font-display text-text-primary">
                  {progressText}
                </p>
                <p className="text-xs sm:text-sm text-text-tertiary mt-1">
                  {totalCount > 0 ? (
                    <>
                      预计剩余 <span className="text-text-secondary font-medium">{remainingMinutes}</span> 分钟
                      <span className="mx-1.5 text-border-strong">·</span>
                      今日总计 <span className="text-text-secondary font-medium">{totalMinutes}</span> 分钟
                    </>
                  ) : (
                    '当前孩子今天没有安排任务'
                  )}
                </p>
              </div>
              <div className="text-right shrink-0 sm:hidden">
                <p className="text-2xl font-bold font-display tabular-nums text-text-primary">
                  {doneCount}<span className="text-text-muted text-sm">/{totalCount}</span>
                </p>
                <p className="text-[10px] text-text-tertiary">已完成</p>
              </div>
            </div>
          </CommandCard>
        </motion.div>
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
        /* Task list */
        <div className="space-y-5">
          {allCategories.map((category, catIndex) => {
            const tasks = groupedTasks.get(category) ?? [];
            if (tasks.length === 0) return null;
            const CategoryIcon = categoryIcons[category];
            const categoryDone = tasks.filter((t) => t.status === 'done').length;
            const allDone = tasks.every((t) => t.status === 'done');

            return (
              <motion.div
                key={category}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + catIndex * 0.05 }}
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${getCategoryColorClass(
                        category
                      )}`}
                    >
                      <CategoryIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-semibold text-text-secondary">
                      {TASK_CATEGORY_LABELS[category]}
                    </span>
                    {allDone && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-success/10 text-success border border-success/10">
                        已完成
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-text-tertiary tabular-nums">
                    {categoryDone}/{tasks.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={() => handleToggle(task.id, task.status)}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Weekly view shortcut */}
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
    </div>
  );
}
