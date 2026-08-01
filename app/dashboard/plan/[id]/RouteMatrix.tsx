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
    '二年级': 2,
    '三年级': 3,
    '四年级': 4,
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
  must: { label: '必须', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  should: { label: '建议', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  optional: { label: '可选', color: 'text-text-tertiary', bg: 'bg-slate-500/10', border: 'border-slate-500/30' },
};

export default function RouteMatrix({ rows, grades, currentGrade = '一升二', currentChildGrade = 1 }: RouteMatrixProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-2xl glass p-6 border border-border-subtle"
    >
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <h2 className="text-xl font-bold font-display flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-primary" />
            三公备考时间轴与成果矩阵
          </h2>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <Target className="w-3 h-3" />
              必须
            </span>
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Clock className="w-3 h-3" />
              建议
            </span>
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-500/10 text-text-tertiary border border-slate-500/30">
              <RotateCcw className="w-3 h-3" />
              可选
            </span>
          </div>
        </div>
        <p className="text-xs text-text-muted">
          注：二年级/三年级/四年级 指该完整学年（含暑假）；五年级上/下 指五年级上学期/下学期。
        </p>
      </div>

      <div className="overflow-x-auto -mx-2 px-2 pb-2">
        <div className="min-w-[780px]">
          {/* Header */}
          <div className="grid grid-cols-[150px_repeat(5,1fr)] gap-2 mb-2">
            <div className="px-3 py-2 text-sm font-medium text-text-muted flex items-end">
              分类 / 年级
            </div>
            {grades.map((grade) => {
              const isCurrent = grade === currentGrade;
              const timeRange = computeGradeTimeRange(grade, currentChildGrade);
              return (
                <div
                  key={grade}
                  className={`px-2 py-2 rounded-lg text-center flex flex-col items-center justify-center min-h-[48px] ${
                    isCurrent
                      ? 'bg-primary text-white'
                      : 'bg-surface-elevated text-text-secondary border border-border-subtle'
                  }`}
                >
                  <span className="text-xs font-bold">{grade}</span>
                  <span className={`text-2xs mt-0.5 ${isCurrent ? 'text-white/80' : 'text-text-muted'}`}>
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
                  <div className="px-3 py-3 rounded-xl bg-surface-elevated border border-border-subtle flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${row.color} flex items-center justify-center shrink-0`}
                    >
                      <Icon className="w-4 h-4 text-white" />
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
                          className="rounded-xl bg-surface-elevated border border-border-subtle min-h-[100px]"
                        />
                      );
                    }

                    const priority = cell.priority ? priorityConfig[cell.priority] : priorityConfig.should;
                    const isCurrent = grade === currentGrade;

                    return (
                      <motion.div
                        key={grade}
                        whileHover={{ y: -2, scale: 1.01 }}
                        className={`group relative rounded-xl p-3 border min-h-[100px] flex flex-col justify-between transition-all cursor-default ${
                          isCurrent
                            ? `${priority.bg} ${priority.border}`
                            : 'bg-surface-elevated border-border-subtle hover:border-border-default hover:bg-surface-elevated'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span
                              className={`text-2xs px-1.5 py-0.5 rounded border ${priority.color} ${priority.bg} ${priority.border}`}
                            >
                              {priority.label}
                            </span>
                            {cell.repeatable && (
                              <span title="可多次参加">
                                <RotateCcw className="w-3 h-3 text-text-muted" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-text-secondary leading-relaxed">
                            {cell.target}
                          </p>
                        </div>

                        {/* Hover detail */}
                        <div className="mt-2 pt-2 border-t border-border-subtle opacity-60 group-hover:opacity-100 transition-opacity">
                          {cell.fallback !== '—' && (
                            <p className="text-2xs text-text-muted flex items-start gap-1">
                              <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
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
