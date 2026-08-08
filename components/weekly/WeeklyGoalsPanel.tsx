'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { type WeeklyGoal, type WeeklyTaskItem, type TaskCategory } from '@/lib/storage.types';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { categoryIcons } from '@/lib/taskIcons';
import { getCategoryColorClass } from '@/lib/taskAlignment';

interface WeeklyGoalsPanelProps {
  goals: WeeklyGoal[];
  tasks: WeeklyTaskItem[];
  onChange: (goals: WeeklyGoal[]) => void;
  onConfigure?: () => void;
}

export default function WeeklyGoalsPanel({
  goals,
  tasks,
  onChange,
  onConfigure,
}: WeeklyGoalsPanelProps) {
  const tasksByGoal = useMemo(() => {
    const map: Record<string, WeeklyTaskItem[]> = {};
    goals.forEach((g) => (map[g.id] = []));
    tasks.forEach((t) => {
      if (t.goalId && map[t.goalId]) {
        map[t.goalId].push(t);
      }
    });
    return map;
  }, [goals, tasks]);

  const toggleChecklistItem = (goalId: string, itemId: string) => {
    const next = goals.map((g) => {
      if (g.id !== goalId) return g;
      const checklist = g.checklist || [];
      return {
        ...g,
        checklist: checklist.map((item) =>
          item.id === itemId ? { ...item, done: !item.done } : item
        ),
      };
    });
    onChange(next);
  };

  if (goals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border-subtle bg-surface-elevated p-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
              <Icon name="Target" size="md" className="text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">本周目标</h2>
              <p className="mt-0.5 text-xs text-text-muted">
                把具体任务描述填在这里，例如读哪几本书、做多少题
              </p>
            </div>
          </div>
          {onConfigure && (
            <button
              type="button"
              onClick={onConfigure}
              className="hover:bg-primary/90 flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-inverse transition-colors"
            >
              <Icon name="Settings2" size="sm" />
              去配置
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="Target" size="md" className="text-primary" />
          <h2 className="text-base font-bold text-text-primary">本周目标</h2>
        </div>
        <span className="text-xs text-text-muted">共 {goals.length} 个目标</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {goals.map((goal) => {
          const CategoryIcon = categoryIcons[goal.category];
          const linkedTasks = tasksByGoal[goal.id] || [];
          const doneTasks = linkedTasks.filter((t) => t.status === 'done').length;
          const target = goal.quantityTarget ?? 0;
          const effectiveDone = target === 0 ? doneTasks : Math.min(target, goal.quantityDone ?? 0);
          const rate = target === 0 ? 0 : Math.round((effectiveDone / target) * 100);
          const checklist = goal.checklist || [];
          const checklistDone = checklist.filter((i) => i.done).length;

          return (
            <div
              key={goal.id}
              className="rounded-2xl border border-border-subtle bg-surface-elevated p-4 transition-colors hover:border-border-strong"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex size-8 items-center justify-center rounded-lg ${getCategoryColorClass(
                      goal.category
                    )}`}
                  >
                    <CategoryIcon className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-secondary">{goal.title}</h3>
                    <p className="text-2xs text-text-muted">
                      {TASK_CATEGORY_LABELS[goal.category]}
                      {linkedTasks.length > 0 && ` · ${doneTasks}/${linkedTasks.length} 项任务`}
                    </p>
                  </div>
                </div>
                {target > 0 && (
                  <span className="text-xs font-bold tabular-nums text-primary">
                    {effectiveDone}/{target}
                    {goal.quantityUnit && (
                      <span className="ml-0.5 font-normal text-text-muted">
                        {goal.quantityUnit}
                      </span>
                    )}
                  </span>
                )}
              </div>

              {target > 0 && (
                <div className="mb-3">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-2xs text-text-muted">
                      <Icon name="TrendingUp" size="sm" />
                      完成率 {rate}%
                    </span>
                    {effectiveDone >= target && target > 0 && (
                      <span className="text-2xs text-success">目标达成</span>
                    )}
                  </div>
                </div>
              )}

              {checklist.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-2xs text-text-muted">
                    <Icon name="ListChecks" size="sm" />
                    明细清单
                    <span className="text-text-tertiary">
                      ({checklistDone}/{checklist.length})
                    </span>
                  </div>
                  <div className="max-h-[160px] space-y-1.5 overflow-y-auto pr-1">
                    {checklist.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleChecklistItem(goal.id, item.id)}
                        className={`flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left transition-colors ${
                          item.done ? 'bg-success/[0.06]' : 'hover:bg-surface-hover/50'
                        }`}
                      >
                        {item.done ? (
                          <Icon
                            name="CheckSquare"
                            size="sm"
                            className="mt-0.5 shrink-0 text-success"
                          />
                        ) : (
                          <Icon
                            name="Square"
                            size="sm"
                            className="mt-0.5 shrink-0 text-text-tertiary"
                          />
                        )}
                        <span
                          className={`text-xs leading-relaxed ${
                            item.done ? 'text-text-muted line-through' : 'text-text-secondary'
                          }`}
                        >
                          {item.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {checklist.length === 0 && target === 0 && (
                <p className="py-2 text-xs text-text-muted">暂无明细，可在编辑计划中添加</p>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
