'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, CircleDot, CircleEqual } from 'lucide-react';
import {
  type WeeklyTaskItem,
  type TaskCategory,
  type DayOfWeek,
  type TaskStatus,
} from '@/lib/storage.types';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { categoryIcons } from '@/lib/taskIcons';
import { getCategoryColorClass } from '@/lib/taskAlignment';

const DAYS: DayOfWeek[] = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

interface TaskRow {
  key: string;
  category: TaskCategory;
  focus: string;
  cells: (WeeklyTaskItem | undefined)[];
}

interface WeeklyTaskChecklistMatrixProps {
  tasks: WeeklyTaskItem[];
  onCellClick?: (task: WeeklyTaskItem) => void;
}

function StatusIcon({ status }: { status: TaskStatus }) {
  const className = 'w-5 h-5';
  switch (status) {
    case 'done':
      return <CheckCircle2 className={`${className} text-success`} />;
    case 'partially_done':
      return <CircleDot className={`${className} text-warning`} />;
    case 'in_progress':
      return <CircleEqual className={`${className} text-accent`} />;
    case 'skipped':
    case 'rescheduled':
      return <Circle className={`${className} text-text-muted/40`} />;
    case 'pending':
    default:
      return <Circle className={`${className} text-text-muted`} />;
  }
}

function StatusLabel(status: TaskStatus) {
  switch (status) {
    case 'done':
      return '已完成';
    case 'partially_done':
      return '部分完成';
    case 'in_progress':
      return '进行中';
    case 'skipped':
      return '已跳过';
    case 'rescheduled':
      return '已改期';
    case 'pending':
    default:
      return '待完成';
  }
}

export default function WeeklyTaskChecklistMatrix({
  tasks,
  onCellClick,
}: WeeklyTaskChecklistMatrixProps) {
  const rows = useMemo<TaskRow[]>(() => {
    const groups = new Map<string, TaskRow>();

    tasks.forEach((task) => {
      const key = `${task.category}|${task.focus}`;
      if (!groups.has(key)) {
        groups.set(key, {
          key,
          category: task.category,
          focus: task.focus,
          cells: new Array(7).fill(undefined),
        });
      }
      const row = groups.get(key)!;
      const dayIndex = DAYS.indexOf(task.day);
      if (dayIndex >= 0) {
        row.cells[dayIndex] = task;
      }
    });

    return Array.from(groups.values()).sort((a, b) => {
      const catOrder: Record<TaskCategory, number> = {
        school: 0,
        reading: 1,
        sport: 2,
        ability: 3,
        interest: 4,
        other: 5,
      };
      if (catOrder[a.category] !== catOrder[b.category]) {
        return catOrder[a.category] - catOrder[b.category];
      }
      return a.focus.localeCompare(b.focus);
    });
  }, [tasks]);

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl bg-surface-elevated border border-border-subtle p-8 text-center text-sm text-text-muted">
        本周暂无任务，点击「编辑周计划」添加
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-surface-elevated border border-border-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="border-b border-border-subtle bg-surface-highlight/50">
              <th className="sticky left-0 z-10 bg-surface-highlight/95 backdrop-blur-sm text-left py-3 px-4 text-xs font-medium text-text-muted w-[240px] min-w-[240px]">
                任务
              </th>
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="py-3 px-2 text-center text-xs font-medium text-text-muted w-[1/7]"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => {
              const CategoryIcon = categoryIcons[row.category];
              const colorClass = getCategoryColorClass(row.category);
              const categoryLabel = TASK_CATEGORY_LABELS[row.category];

              return (
                <motion.tr
                  key={row.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIndex * 0.03 }}
                  className="border-b border-border-subtle last:border-b-0 hover:bg-surface-highlight/30 transition-colors"
                >
                  <td className="sticky left-0 z-10 bg-surface-elevated/95 backdrop-blur-sm py-3 px-4 align-top">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center ${colorClass}`}
                      >
                        <CategoryIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary leading-snug break-words">
                          {row.focus}
                        </p>
                        <p className="text-[11px] text-text-muted mt-0.5">
                          {categoryLabel}
                        </p>
                      </div>
                    </div>
                  </td>
                  {row.cells.map((task, dayIndex) => {
                    const day = DAYS[dayIndex];
                    if (!task) {
                      return (
                        <td
                          key={day}
                          className="py-3 px-2 text-center align-middle"
                        >
                          <span className="inline-block w-5 h-5 text-text-muted/20">
                            —
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={day}
                        className="py-3 px-2 text-center align-middle"
                      >
                        <button
                          type="button"
                          onClick={() => onCellClick?.(task)}
                          title={`${day} · ${StatusLabel(task.status)}`}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-surface-hover transition-colors focus-ring"
                        >
                          <StatusIcon status={task.status} />
                        </button>
                      </td>
                    );
                  })}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
