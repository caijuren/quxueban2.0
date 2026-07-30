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
  Calculator,
  Languages,
  Backpack,
  Dumbbell,
  Palette,
  GraduationCap,
  Target,
} from 'lucide-react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import EmptyState from '@/components/ui/EmptyState';
import CommandCard from '@/components/ui/CommandCard';
import { getTodayName, getCurrentWeekId, getPlanStats } from '@/lib/weeklyTasks';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { getCategoryColorClass } from '@/lib/taskAlignment';
import { TaskCategory } from '@/lib/storage.types';

const categoryIcons: Record<TaskCategory, typeof BookOpen> = {
  chinese: BookOpen,
  math: Calculator,
  english: Languages,
  school: Backpack,
  reading: BookOpen,
  sport: Dumbbell,
  interest: Palette,
  other: GraduationCap,
};

const allCategories: TaskCategory[] = [
  'chinese',
  'math',
  'english',
  'school',
  'reading',
  'sport',
  'interest',
  'other',
];

export default function TodayPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const {
    children,
    currentChild,
    setCurrentChildId,
    getWeeklyPlan,
    updateTaskStatus,
  } = useChildren();

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

  return (
    <div className="space-y-5 min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            今日作战 · {todayName}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold font-display">
            {currentChild ? currentChild.name : '未选择孩子'}
          </h1>
          {children.length > 1 && (
            <div className="flex items-center gap-2 mt-2">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setCurrentChildId(child.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    currentChild?.id === child.id
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-white/5 text-slate-400 border border-white/[0.06] hover:bg-white/[0.08]'
                  }`}
                >
                  {child.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-3xl font-bold font-display tabular-nums">
            {doneCount}<span className="text-slate-500 text-lg">/{totalCount}</span>
          </p>
          <p className="text-[10px] text-slate-500">已完成</p>
        </div>
      </motion.div>

      {/* Progress summary */}
      {totalCount > 0 && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <CommandCard className="p-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                style={{
                  background: `conic-gradient(var(--tw-colors-primary) ${completionRate * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                }}
              >
                <span className="text-sm">{completionRate}%</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-200">
                  {completionRate === 100
                    ? '今日任务全部完成！'
                    : completionRate >= 60
                    ? '完成度不错，继续加油'
                    : '今天任务还不少，先完成重要的'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  预计剩余 {remainingMinutes} 分钟 · 今日总计 {totalMinutes} 分钟
                </p>
              </div>
            </div>
          </CommandCard>
        </motion.div>
      )}

      {/* Task list */}
      {totalCount === 0 ? (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <EmptyState
            icon={Calendar}
            title="今日无任务"
            description="当前孩子今天没有安排任务，去周任务页面添加吧。"
            action={{
              label: '去周任务',
              onClick: () => router.push('/dashboard/weekly'),
            }}
          />
        </motion.div>
      ) : (
        <div className="space-y-5">
          {allCategories.map((category, catIndex) => {
            const tasks = groupedTasks.get(category) ?? [];
            if (tasks.length === 0) return null;
            const CategoryIcon = categoryIcons[category];
            const allDone = tasks.every((t) => t.status === 'done');

            return (
              <motion.div
                key={category}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + catIndex * 0.05 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${getCategoryColorClass(
                      category
                    )}`}
                  >
                    <CategoryIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">
                    {TASK_CATEGORY_LABELS[category]}
                  </span>
                  {allDone && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-success/10 text-success">
                      已完成
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {tasks.map((task) => {
                    const isDone = task.status === 'done';
                    return (
                      <button
                        key={task.id}
                        onClick={() => handleToggle(task.id, task.status)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all ${
                          isDone
                            ? 'bg-success/5 border-success/10'
                            : 'bg-white/[0.03] border-white/[0.06] active:scale-[0.99]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 mt-0.5">
                            {isDone ? (
                              <CheckCircle2 className="w-7 h-7 text-success" />
                            ) : (
                              <Circle className="w-7 h-7 text-slate-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-base font-semibold mb-1 ${
                                isDone ? 'text-slate-500 line-through' : 'text-slate-200'
                              }`}
                            >
                              {task.focus}
                            </p>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {task.duration}
                              </span>
                              {task.materials.length > 0 && (
                                <span className="truncate">
                                  {task.materials.join('、')}
                                </span>
                              )}
                            </div>
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

      {/* Weekly view shortcut */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="pt-2"
      >
        <button
          onClick={() => router.push('/dashboard/weekly')}
          className="w-full py-3 rounded-xl border border-dashed border-white/[0.12] text-slate-400 hover:text-slate-200 hover:border-white/20 hover:bg-white/[0.03] transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Target className="w-4 h-4" />
          查看完整周计划
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
