'use client';

import { motion } from 'framer-motion';
import { Grid3X3, Target, Clock, AlertTriangle, RotateCcw } from 'lucide-react';
import type { RouteMatrixRow } from '@/lib/plans';

interface RouteMatrixProps {
  rows: RouteMatrixRow[];
  grades: readonly string[];
  currentGrade?: string;
  currentChildGrade?: number;
}

function computeGradeTimeRange(grade: string, childGrade: number): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  // 9 月前属于上一学年，9 月起属于新学年
  const currentSchoolYearStart = now.getMonth() >= 8 ? currentYear : currentYear - 1;

  const labelToTargetGrade: Record<string, number> = {
    二年级: 2,
    三年级: 3,
    四年级: 4,
  };

  if (grade === '五年级上') {
    const year = currentSchoolYearStart + (5 - childGrade);
    return `${year}.09 - ${year + 1}.01`;
  }
  if (grade === '五年级下') {
    const year = currentSchoolYearStart + (5 - childGrade) + 1;
    return `${year}.02 - ${year}.06`;
  }

  const targetGrade = labelToTargetGrade[grade];
  if (!targetGrade) return '';

  const year = currentSchoolYearStart + (targetGrade - childGrade);
  return `${year}.09 - ${year + 1}.08`;
}

const priorityConfig = {
  must: { label: '必须', color: 'text-error', bg: 'bg-error/10', border: 'border-error/30' },
  should: {
    label: '建议',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/30',
  },
  optional: {
    label: '可选',
    color: 'text-text-tertiary',
    bg: 'bg-text-muted/10',
    border: 'border-text-muted/30',
  },
};

export default function RouteMatrix({
  rows,
  grades,
  currentGrade = '一升二',
  currentChildGrade = 1,
}: RouteMatrixProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-2xl border border-border-subtle bg-surface-elevated p-6"
    >
      <div className="mb-6">
        <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <Grid3X3 className="size-5 text-primary" />
            三公备考时间轴与成果矩阵
          </h2>
          <div className="flex items-center gap-3 text-xs">
            <span className="bg-error/10 border-error/30 flex items-center gap-1.5 rounded-lg border px-2 py-1 text-error">
              <Target className="size-3" />
              必须
            </span>
            <span className="bg-warning/10 border-warning/30 flex items-center gap-1.5 rounded-lg border px-2 py-1 text-warning">
              <Clock className="size-3" />
              建议
            </span>
            <span className="bg-text-muted/10 border-text-muted/30 flex items-center gap-1.5 rounded-lg border px-2 py-1 text-text-tertiary">
              <RotateCcw className="size-3" />
              可选
            </span>
          </div>
        </div>
        <p className="text-xs text-text-muted">
          注：二年级/三年级/四年级 指该完整学年（含暑假）；五年级上/下 指五年级上学期/下学期。
        </p>
      </div>

      <div className="-mx-2 overflow-x-auto px-2 pb-2">
        <div className="min-w-[780px]">
          {/* Header */}
          <div className="mb-2 grid grid-cols-[150px_repeat(5,1fr)] gap-2">
            <div className="flex items-end px-3 py-2 text-sm font-medium text-text-muted">
              分类 / 年级
            </div>
            {grades.map((grade) => {
              const isCurrent = grade === currentGrade;
              const timeRange = computeGradeTimeRange(grade, currentChildGrade);
              return (
                <div
                  key={grade}
                  className={`flex min-h-[48px] flex-col items-center justify-center rounded-lg p-2 text-center ${
                    isCurrent
                      ? 'bg-primary text-text-primary'
                      : 'border border-border-subtle bg-surface-elevated text-text-secondary'
                  }`}
                >
                  <span className="text-xs font-bold">{grade}</span>
                  <span
                    className={`mt-0.5 text-2xs ${isCurrent ? 'text-text-primary/80' : 'text-text-muted'}`}
                  >
                    {timeRange}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Rows */}
          <div className="space-y-2">
            {rows.map((row, rowIndex) => {
              const Icon = row.icon;
              return (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + rowIndex * 0.05 }}
                  className="grid grid-cols-[150px_repeat(5,1fr)] gap-2"
                >
                  {/* Row header */}
                  <div className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-elevated p-3">
                    <div
                      className={`size-9 rounded-lg bg-gradient-to-br ${row.color} flex shrink-0 items-center justify-center`}
                    >
                      <Icon className="size-4 text-text-primary" />
                    </div>
                    <span className="text-sm font-bold text-text-secondary">{row.category}</span>
                  </div>

                  {/* Cells */}
                  {grades.map((grade) => {
                    const cell = row.cells.find((c) => c.grade === grade);
                    if (!cell) {
                      return (
                        <div
                          key={grade}
                          className="min-h-[100px] rounded-xl border border-border-subtle bg-surface-elevated"
                        />
                      );
                    }

                    const priority = cell.priority
                      ? priorityConfig[cell.priority]
                      : priorityConfig.should;
                    const isCurrent = grade === currentGrade;

                    return (
                      <motion.div
                        key={grade}
                        whileHover={{ y: -2, scale: 1.01 }}
                        className={`group relative flex min-h-[100px] cursor-default flex-col justify-between rounded-xl border p-3 transition-all ${
                          isCurrent
                            ? `${priority.bg} ${priority.border}`
                            : 'border-border-subtle bg-surface-elevated hover:border-border-default hover:bg-surface-elevated'
                        }`}
                      >
                        <div>
                          <div className="mb-1.5 flex items-center justify-between gap-1">
                            <span
                              className={`rounded border px-1.5 py-0.5 text-2xs ${priority.color} ${priority.bg} ${priority.border}`}
                            >
                              {priority.label}
                            </span>
                            {cell.repeatable && (
                              <span title="可多次参加">
                                <RotateCcw className="size-3 text-text-muted" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium leading-relaxed text-text-secondary">
                            {cell.target}
                          </p>
                        </div>

                        {/* Hover detail */}
                        <div className="mt-2 border-t border-border-subtle pt-2 opacity-60 transition-opacity group-hover:opacity-100">
                          {cell.fallback !== '—' && (
                            <p className="flex items-start gap-1 text-2xs text-text-muted">
                              <AlertTriangle className="mt-0.5 size-3 shrink-0" />
                              {cell.fallback}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-text-muted">
        当前高亮：{currentGrade}。鼠标悬停单元格可查看弹性说明。
      </p>
    </motion.div>
  );
}
