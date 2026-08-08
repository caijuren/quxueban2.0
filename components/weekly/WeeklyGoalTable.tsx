'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Target } from 'lucide-react';
import {
  type WeeklyGoal,
  type WeeklyTaskItem,
  type TaskCategory,
  type SubjectId,
} from '@/lib/storage.types';
import { subjectMeta } from '@/lib/weeklyTasks';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { categoryIcons } from '@/lib/taskIcons';

interface WeeklyGoalTableProps {
  goals: WeeklyGoal[];
  tasks: WeeklyTaskItem[];
  onChange: (goals: WeeklyGoal[]) => void;
}

interface TableRow {
  id: string;
  subjectId: SubjectId | 'other';
  subjectName: string;
  moduleName: string;
  category: TaskCategory;
  taskName: string;
  targetText: string;
  done: boolean;
  goalId: string;
  itemId: string;
}

const CATEGORY_TO_SUBJECT: Record<TaskCategory, SubjectId | 'other'> = {
  reading: 'chinese',
  school: 'other',
  sport: 'other',
  interest: 'other',
  ability: 'other',
  other: 'other',
};

function getSubjectForGoal(goal: WeeklyGoal, tasks: WeeklyTaskItem[]): SubjectId | 'other' {
  const linkedTasks = tasks.filter((t) => t.goalId === goal.id);
  const subjectCounts: Record<string, number> = {};
  linkedTasks.forEach((t) => {
    if (t.subjectId) {
      subjectCounts[t.subjectId] = (subjectCounts[t.subjectId] || 0) + 1;
    }
  });

  const subjects = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1]);
  if (subjects.length > 0) {
    return subjects[0][0] as SubjectId;
  }

  return CATEGORY_TO_SUBJECT[goal.category] || 'other';
}

function getSubjectName(subjectId: SubjectId | 'other'): string {
  if (subjectId === 'other') return '其他';
  return subjectMeta[subjectId]?.name || '其他';
}

export default function WeeklyGoalTable({ goals, tasks, onChange }: WeeklyGoalTableProps) {
  const rows = useMemo<TableRow[]>(() => {
    const result: TableRow[] = [];
    goals.forEach((goal) => {
      const subjectId = getSubjectForGoal(goal, tasks);
      const checklist = goal.checklist || [];

      if (checklist.length === 0) {
        result.push({
          id: `${goal.id}-empty`,
          subjectId,
          subjectName: getSubjectName(subjectId),
          moduleName: goal.title,
          category: goal.category,
          taskName: goal.title,
          targetText: goal.quantityTarget
            ? `完成 ${goal.quantityTarget}${goal.quantityUnit || '项'}`
            : '暂无明细',
          done: false,
          goalId: goal.id,
          itemId: '',
        });
        return;
      }

      checklist.forEach((item) => {
        result.push({
          id: `${goal.id}-${item.id}`,
          subjectId,
          subjectName: getSubjectName(subjectId),
          moduleName: goal.title,
          category: goal.category,
          taskName: item.title || item.text || '未命名任务',
          targetText: item.title ? item.text || '' : '',
          done: item.done,
          goalId: goal.id,
          itemId: item.id,
        });
      });
    });

    const subjectOrder: Record<string, number> = { chinese: 0, math: 1, english: 2, other: 3 };
    return result.sort((a, b) => {
      const subjectDiff = (subjectOrder[a.subjectId] ?? 9) - (subjectOrder[b.subjectId] ?? 9);
      if (subjectDiff !== 0) return subjectDiff;
      if (a.moduleName !== b.moduleName) return a.moduleName.localeCompare(b.moduleName);
      return a.taskName.localeCompare(b.taskName);
    });
  }, [goals, tasks]);

  const toggleItem = (goalId: string, itemId: string) => {
    const next = goals.map((g) => {
      if (g.id !== goalId) return g;
      return {
        ...g,
        checklist: (g.checklist || []).map((item) =>
          item.id === itemId ? { ...item, done: !item.done } : item
        ),
      };
    });
    onChange(next);
  };

  if (rows.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border-subtle bg-surface-elevated p-8 text-center"
      >
        <div className="bg-primary/10 mx-auto mb-3 flex size-12 items-center justify-center rounded-xl">
          <Target className="size-6 text-primary" />
        </div>
        <h3 className="mb-1 text-base font-bold text-text-primary">暂无本周目标</h3>
        <p className="text-sm text-text-muted">
          在编辑周计划时添加目标与明细清单，即可在此查看任务目标表
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-elevated"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="bg-surface-highlight/50 border-b border-border-subtle">
              <th className="w-24 px-4 py-3 text-left text-xs font-medium text-text-muted">学科</th>
              <th className="w-32 px-4 py-3 text-left text-xs font-medium text-text-muted">模块</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-muted">本周任务</th>
              <th className="w-40 px-4 py-3 text-left text-xs font-medium text-text-muted">目标</th>
              <th className="w-20 px-4 py-3 text-center text-xs font-medium text-text-muted">
                状态
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const CategoryIcon = categoryIcons[row.category];
              const isNewSubject = index === 0 || rows[index - 1].subjectName !== row.subjectName;

              return (
                <tr
                  key={row.id}
                  className={[
                    'border-border-subtle/50 border-b transition-colors',
                    row.done ? 'bg-success/[0.03]' : 'hover:bg-surface-hover/30',
                    isNewSubject ? 'border-t border-border-subtle' : '',
                  ].join(' ')}
                >
                  <td className="px-4 py-3 align-top">
                    {isNewSubject ? (
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-text-secondary">
                        {row.subjectName}
                      </span>
                    ) : (
                      <span className="text-sm text-text-muted">〃</span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-2">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-surface-highlight">
                        <CategoryIcon className="size-4 text-text-tertiary" />
                      </div>
                      <span className="text-sm text-text-secondary">{row.moduleName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span
                      className={`text-sm ${
                        row.done ? 'text-text-muted line-through' : 'text-text-primary'
                      }`}
                    >
                      {row.taskName}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className="text-sm text-text-tertiary">{row.targetText}</span>
                  </td>
                  <td className="px-4 py-3 text-center align-top">
                    {row.itemId ? (
                      <button
                        type="button"
                        onClick={() => toggleItem(row.goalId, row.itemId)}
                        className="inline-flex items-center justify-center rounded-lg p-1 transition-colors hover:bg-surface-hover"
                      >
                        {row.done ? (
                          <CheckSquare className="size-5 text-success" />
                        ) : (
                          <Square className="size-5 text-text-tertiary" />
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-text-muted">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
