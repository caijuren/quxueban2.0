'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  Calendar,
  Target,
} from 'lucide-react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import TaskCard from '@/components/dashboard/TaskCard';
import EmptyState from '@/components/ui/EmptyState';
import MetricRing from '@/components/ui/MetricRing';
import { getTodayName, getCurrentWeekId } from '@/lib/weeklyTasks';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { getCategoryColorClass } from '@/lib/taskAlignment';
import { TaskCategory } from '@/lib/storage.types';
import { categoryIcons, allCategories } from '@/lib/taskIcons';
import { gradeLabel } from '@/lib/children';

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
          <p className="text-caption font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            今日作战 · {todayName}
          </p>
          <h1 className="text-h1 font-display tracking-tight neon-text">
            {currentChild ? currentChild.name : '未选择孩子'}
          </h1>
          {currentChild && (
            <p className="text-caption text-text-tertiary mt-1">
              {gradeLabel(currentChild.grade)} · {todayName}任务清单
            </p>
          )}
          {children.length > 1 && (
            <div className="flex items-center gap-2 mt-3">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setCurrentChildId(child.id)}
                  className={`px-3 py-1.5 rounded-xl text-caption font-semibold transition-all border focus-ring ${
                    currentChild?.id === child.id
                      ? 'bg-primary-dim text-primary border-primary/25 shadow-glow-sm'
                      : 'bg-surface text-text-tertiary border-border-default hover:border-border-strong hover:bg-surface-light'
                  }`}
                >
                  {child.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="text-right shrink-0 hud-panel px-4 py-3">
          <p className="text-h2 font-display data-value">
            <span className="text-primary">{doneCount}</span>
            <span className="text-text-muted text-h4">/{totalCount}</span>
          </p>
          <p className="text-micro text-text-muted font-medium">已完成</p>
        </div>
      </motion.div>

      {/* Progress summary */}
      {totalCount > 0 && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <div className="hud-panel p-4 sm:p-5">
            <div className="flex items-center gap-5">
              <MetricRing
                rate={completionRate}
                size={72}
                strokeWidth={8}
                label={`${completionRate}%`}
                sublabel="完成率"
              />
              <div className="flex-1 min-w-0">
                <p className="text-h4 font-bold text-white">
                  {completionRate === 100
                    ? '今日任务全部完成！'
                    : completionRate >= 60
                    ? '完成度不错，继续加油'
                    : '今天任务还不少，先完成重要的'}
                </p>
                <p className="text-caption text-text-tertiary mt-1">
                  预计剩余 <span className="data-value text-text-secondary">{remainingMinutes}</span> 分钟 · 今日总计 <span className="data-value text-text-secondary">{totalMinutes}</span> 分钟
                </p>
              </div>
            </div>
          </div>
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
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border ${getCategoryColorClass(
                      category
                    )}`}
                  >
                    <CategoryIcon className="w-4 h-4" />
                  </div>
                  <span className="text-caption font-bold text-white">
                    {TASK_CATEGORY_LABELS[category]}
                  </span>
                  {allDone && (
                    <span className="text-micro px-2 py-0.5 rounded-full bg-primary-dim text-primary font-semibold border border-primary/20 flex items-center gap-1.5">
                      <span className="indicator-dot" />
                      已完成
                    </span>
                  )}
                </div>

                <div className="space-y-2.5">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={() => handleToggle(task.id, task.status)}
                      showNote
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
          className="w-full py-3.5 rounded-2xl border border-dashed border-border-strong text-text-tertiary hover:text-white hover:border-primary/30 hover:bg-primary-dim transition-all flex items-center justify-center gap-2 text-caption font-semibold focus-ring"
        >
          <Target className="w-4 h-4" />
          查看完整周计划
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
