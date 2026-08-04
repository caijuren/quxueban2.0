'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, CircleDot, Pause, XCircle } from 'lucide-react';
import {
  type WeeklyTaskItem,
  type TaskCategory,
  type DayOfWeek,
} from '@/lib/storage.types';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { categoryIcons } from '@/lib/taskIcons';
import { getCategoryColorClass } from '@/lib/taskAlignment';
import { getWeekRange, parseDurationMinutes } from '@/lib/weeklyTasks';

const DAYS: DayOfWeek[] = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

interface TaskRow {
  key: string;
  category: TaskCategory;
  focus: string;
  cells: (WeeklyTaskItem | undefined)[];
}

interface WeeklyTaskChecklistMatrixProps {
  tasks: WeeklyTaskItem[];
  weekId: string;
  onCellClick?: (task: WeeklyTaskItem) => void;
}

function getStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function StatusCell({
  task,
  dayIndex,
  weekStart,
  onClick,
}: {
  task: WeeklyTaskItem;
  dayIndex: number;
  weekStart: Date;
  onClick?: () => void;
}) {
  const status = task.status;
  const minutes = parseDurationMinutes(task.duration);
  const durationText = minutes > 0 ? `${minutes}分钟` : task.duration;

  const isOverdue = useMemo(() => {
    if (status === 'done' || status === 'in_progress' || status === 'partially_done') {
      return false;
    }
    const taskDate = getStartOfDay(weekStart);
    taskDate.setDate(weekStart.getDate() + dayIndex);
    return taskDate <= getStartOfDay(new Date());
  }, [status, dayIndex, weekStart]);

  if (status === 'done') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex flex-col items-center justify-center gap-1 w-full py-2.5 rounded-[14px] hover:bg-surface-hover transition-colors"
      >
        <CheckCircle2 className="w-5 h-5 text-success" />
        <span className="text-[10px] text-text-tertiary">{durationText}</span>
      </button>
    );
  }

  if (status === 'in_progress' || status === 'partially_done') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex flex-col items-center justify-center gap-1 w-full py-2.5 rounded-[14px] hover:bg-surface-hover transition-colors"
      >
        <CircleDot className="w-5 h-5 text-secondary" />
        <span className="text-[10px] text-text-tertiary">{durationText}</span>
      </button>
    );
  }

  if (isOverdue) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex flex-col items-center justify-center gap-1 w-full py-2.5 rounded-[14px] hover:bg-surface-hover transition-colors"
      >
        <XCircle className="w-5 h-5 text-error" />
        <span className="text-[10px] text-text-tertiary">未完成</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex flex-col items-center justify-center gap-1 w-full py-2.5 rounded-[14px] hover:bg-surface-hover transition-colors"
    >
      <Pause className="w-4 h-4 text-warning" />
      <span className="text-[10px] text-text-tertiary">待开始</span>
    </button>
  );
}

export default function WeeklyTaskChecklistMatrix({
  tasks,
  weekId,
  onCellClick,
}: WeeklyTaskChecklistMatrixProps) {
  const weekStart = useMemo(() => getWeekRange(weekId).start, [weekId]);

  const weekDates = useMemo(() => {
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      dates.push(`${d.getMonth() + 1}/${d.getDate()}`);
    }
    return dates;
  }, [weekStart]);

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
      <div className="rounded-[20px] bg-surface border border-border-default p-8 text-center text-sm text-text-muted">
        本周暂无任务，点击「编辑周计划」添加
      </div>
    );
  }

  return (
    <div className="rounded-[20px] bg-surface border border-border-default overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-border-default">
              <th className="sticky left-0 z-10 bg-surface/95 backdrop-blur-sm text-left py-3.5 px-5 text-xs font-medium text-text-muted w-[220px] min-w-[220px]">
                任务
              </th>
              {DAYS.map((day, idx) => (
                <th
                  key={day}
                  className="py-3.5 px-2 text-center text-xs font-medium text-text-muted w-[1/7]"
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span>{day}</span>
                    <span className="text-[10px] text-text-tertiary">{weekDates[idx]}</span>
                  </div>
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
                  className="border-b border-border-default last:border-b-0 hover:bg-surface-hover/40 transition-colors"
                >
                  <td className="sticky left-0 z-10 bg-surface/95 backdrop-blur-sm py-3.5 px-5 align-top">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-9 h-9 rounded-[14px] flex items-center justify-center ${colorClass}`}
                      >
                        <CategoryIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary leading-snug break-words">
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
                          className="py-2 px-1 text-center align-middle"
                        >
                          <span className="inline-flex items-center justify-center w-full py-4 text-text-muted/30">
                            —
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={day}
                        className="py-2 px-1 text-center align-middle"
                      >
                        <StatusCell
                          task={task}
                          dayIndex={dayIndex}
                          weekStart={weekStart}
                          onClick={() => onCellClick?.(task)}
                        />
                      </td>
                    );
                  })}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-border-default bg-surface">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
            <span>已完成</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
            <CircleDot className="w-3.5 h-3.5 text-secondary" />
            <span>进行中</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
            <Pause className="w-3 h-3 text-warning" />
            <span>未开始</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
            <XCircle className="w-3.5 h-3.5 text-error" />
            <span>未完成</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
            <span className="w-3.5 text-center text-text-muted/30">—</span>
            <span>无安排</span>
          </div>
        </div>
        <p className="text-xs text-text-muted">提示：拖拽任务可快速调整安排</p>
      </div>
    </div>
  );
}
