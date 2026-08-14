'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { getReadingTargetByGrade } from '@/lib/subjects/readingLiteracy';
import { WeeklyTaskItem } from '@/lib/storage.types';
import { cn } from '@/lib/utils';

interface ReadingGoalCardProps {
  grade: number;
  tasks: WeeklyTaskItem[];
  date: string;
}

function getTodayReadingMinutes(tasks: WeeklyTaskItem[], date: string): number {
  return tasks.reduce((sum, task) => {
    const record = task.completionRecords?.find((r) => r.date === date);
    return sum + (record?.actualDurationMinutes ?? 0);
  }, 0);
}

export default function ReadingGoalCard({ grade, tasks, date }: ReadingGoalCardProps) {
  const target = getReadingTargetByGrade(grade);

  const todayMinutes = useMemo(() => getTodayReadingMinutes(tasks, date), [tasks, date]);

  if (!target || target.dailyMinutes <= 0) return null;

  const rate = Math.min(100, Math.round((todayMinutes / target.dailyMinutes) * 100));
  const reached = todayMinutes >= target.dailyMinutes;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'mb-3 overflow-hidden rounded-xl border p-3.5',
        reached
          ? 'border-success/30 bg-success/5'
          : 'border-border-subtle bg-surface-elevated'
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex size-7 items-center justify-center rounded-lg',
              reached ? 'bg-success/15' : 'bg-primary/10'
            )}
          >
            <Icon
              name="BookOpen"
              size="sm"
              className={reached ? 'text-success' : 'text-primary'}
            />
          </div>
          <span className="text-xs font-medium text-text-secondary">
            今日阅读目标
            <span className="ml-1 text-2xs text-text-muted">（按年级匹配）</span>
          </span>
        </div>
        <span
          className={cn(
            'font-display text-sm font-bold tabular-nums',
            reached ? 'text-success' : 'text-text-primary'
          )}
        >
          {todayMinutes}
          <span className="text-xs text-text-muted"> / {target.dailyMinutes} 分钟</span>
        </span>
      </div>

      <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-highlight">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${rate}%` }}
          transition={{ duration: 0.6 }}
          className={cn(
            'h-full rounded-full',
            reached
              ? 'bg-gradient-to-r from-success to-accent'
              : 'bg-gradient-to-r from-primary to-secondary'
          )}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className={cn('text-2xs', reached ? 'text-success' : 'text-text-muted')}>
          {reached ? '今日阅读目标已达成，继续保持' : `还差 ${Math.max(0, target.dailyMinutes - todayMinutes)} 分钟达标`}
        </p>
        {target.annualChars > 0 && (
          <p className="flex items-center gap-1 text-2xs text-text-muted">
            <Icon name="BookMarked" size="xs" className="text-primary" />
            年阅读量目标 ≥ {target.annualChars} 万字
          </p>
        )}
      </div>
    </motion.div>
  );
}
