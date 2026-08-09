'use client';
import { Icon } from '@/components/ui/icon';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import DataTable, { type DataTableColumn } from '@/components/ui/data-table';
import Button from '@/components/ui/button';

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

  const tableColumns = useMemo<DataTableColumn<TableRow>[]>(
    () => [
      {
        key: 'subject',
        title: '学科',
        width: '96px',
        render: (row, index) => {
          const isNewSubject = index === 0 || rows[index - 1].subjectName !== row.subjectName;
          return isNewSubject ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-text-secondary">
              {row.subjectName}
            </span>
          ) : (
            <span className="text-sm text-text-muted">〃</span>
          );
        },
      },
      {
        key: 'module',
        title: '模块',
        width: '128px',
        render: (row) => {
          const CategoryIcon = categoryIcons[row.category];
          return (
            <div className="flex items-center gap-2">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-surface-highlight">
                <CategoryIcon className="size-4 text-text-tertiary" />
              </div>
              <span className="text-sm text-text-secondary">{row.moduleName}</span>
            </div>
          );
        },
      },
      {
        key: 'task',
        title: '本周任务',
        render: (row) => (
          <span
            className={`text-sm ${
              row.done ? 'text-text-muted line-through' : 'text-text-primary'
            }`}
          >
            {row.taskName}
          </span>
        ),
      },
      {
        key: 'target',
        title: '目标',
        width: '160px',
        render: (row) => <span className="text-sm text-text-tertiary">{row.targetText}</span>,
      },
      {
        key: 'status',
        title: '状态',
        width: '80px',
        align: 'center',
        render: (row) =>
          row.itemId ? (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => toggleItem(row.goalId, row.itemId)}
            >
              {row.done ? (
                <Icon name="CheckSquare" size="md" className="text-success" />
              ) : (
                <Icon name="Square" size="md" className="text-text-tertiary" />
              )}
            </Button>
          ) : (
            <span className="text-xs text-text-muted">—</span>
          ),
      },
    ],
    [rows, toggleItem]
  );

  if (rows.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border-subtle bg-surface-elevated p-8 text-center"
      >
        <div className="bg-primary/10 mx-auto mb-3 flex size-12 items-center justify-center rounded-xl">
          <Icon name="Target" size="lg" className="text-primary" />
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
      <DataTable<TableRow>
        columns={tableColumns}
        data={rows}
        rowKey="id"
        className="border-0 shadow-none bg-transparent"
      />
    </motion.div>
  );
}
