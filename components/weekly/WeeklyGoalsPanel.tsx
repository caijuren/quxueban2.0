'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CheckSquare,
  Square,
  Target,
  TrendingUp,
  ListChecks,
} from 'lucide-react';
import {
  type WeeklyGoal,
  type WeeklyTaskItem,
  type TaskCategory,
} from '@/lib/storage.types';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { categoryIcons } from '@/lib/taskIcons';
import { getCategoryColorClass } from '@/lib/taskAlignment';

interface WeeklyGoalsPanelProps {
  goals: WeeklyGoal[];
  tasks: WeeklyTaskItem[];
  onChange: (goals: WeeklyGoal[]) => void;
}

export default function WeeklyGoalsPanel({
  goals,
  tasks,
  onChange,
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
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h2 className="text-base font-bold text-text-primary">本周目标</h2>
        </div>
        <span className="text-xs text-text-muted">
          共 {goals.length} 个目标
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
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
              className="rounded-2xl bg-surface-elevated border border-border-subtle p-4 hover:border-border-strong transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCategoryColorClass(
                      goal.category
                    )}`}
                  >
                    <CategoryIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-secondary">
                      {goal.title}
                    </h3>
                    <p className="text-2xs text-text-muted">
                      {TASK_CATEGORY_LABELS[goal.category]}
                      {linkedTasks.length > 0 &&
                        ` · ${doneTasks}/${linkedTasks.length} 项任务`}
                    </p>
                  </div>
                </div>
                {target > 0 && (
                  <span className="text-xs font-bold text-primary tabular-nums">
                    {effectiveDone}/{target}
                    {goal.quantityUnit && (
                      <span className="text-text-muted font-normal ml-0.5">
                        {goal.quantityUnit}
                      </span>
                    )}
                  </span>
                )}
              </div>

              {target > 0 && (
                <div className="mb-3">
                  <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-2xs text-text-muted flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
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
                    <ListChecks className="w-3 h-3" />
                    明细清单
                    <span className="text-text-tertiary">
                      ({checklistDone}/{checklist.length})
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {checklist.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleChecklistItem(goal.id, item.id)}
                        className={`w-full flex items-start gap-2 text-left px-2 py-1.5 rounded-lg transition-colors ${
                          item.done
                            ? 'bg-success/[0.06]'
                            : 'hover:bg-surface-hover/50'
                        }`}
                      >
                        {item.done ? (
                          <CheckSquare className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-text-tertiary shrink-0 mt-0.5" />
                        )}
                        <span
                          className={`text-xs leading-relaxed ${
                            item.done
                              ? 'text-text-muted line-through'
                              : 'text-text-secondary'
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
                <p className="text-xs text-text-muted py-2">
                  暂无明细，可在编辑计划中添加
                </p>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
