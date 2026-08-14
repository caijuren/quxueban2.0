'use client';

import { useMemo } from 'react';
import { Icon } from '@/components/ui/icon';
import GlassCard from '@/components/ui/glass-card';
import { ProgressBar } from '@/components/motion/progress-bar';
import ReadingAbilityRadar from '@/components/reading/ReadingAbilityRadar';
import {
  getReadingLadderByGrade,
  getReadingTargetByGrade,
} from '@/lib/subjects/readingLiteracy';
import { WeeklyPlan, TaskCategory } from '@/lib/storage.types';
import { parseDurationMinutes } from '@/lib/weeklyTasks';
import { cn } from '@/lib/utils';

interface ReadingReportSectionProps {
  childName: string;
  grade: number;
  plan: WeeklyPlan;
}

function getWeeklyReadingMinutes(plan: WeeklyPlan): number {
  return plan.tasks
    .filter((t) => (t.category || 'other') === ('reading' as TaskCategory))
    .reduce((sum, t) => {
      const record = t.completionRecords?.[t.completionRecords.length - 1];
      return sum + (record?.actualDurationMinutes ?? 0);
    }, 0);
}

export default function ReadingReportSection({
  childName,
  grade,
  plan,
}: ReadingReportSectionProps) {
  const target = getReadingTargetByGrade(grade);
  const ladder = getReadingLadderByGrade(grade);

  const weeklyMinutes = useMemo(() => getWeeklyReadingMinutes(plan), [plan]);
  const weeklyTarget = target ? target.dailyMinutes * 7 : 0;
  const rate =
    weeklyTarget > 0 ? Math.min(100, Math.round((weeklyMinutes / weeklyTarget) * 100)) : 0;
  const reached = weeklyTarget > 0 && weeklyMinutes >= weeklyTarget;

  return (
    <GlassCard className="p-5">
      <div className="mb-5 flex items-center gap-2">
        <Icon name="BookOpen" size="md" className="text-primary" />
        <h2 className="text-lg font-bold text-text-secondary">阅读素养</h2>
        <span className="text-xs text-text-muted">（基于《中国青少年阅读素养框架》）</span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly reading goal */}
        <div className="space-y-4">
          <div
            className={cn(
              'rounded-xl border p-4',
              reached ? 'border-success/30 bg-success/5' : 'border-border-subtle bg-surface-elevated'
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-text-secondary">本周阅读时长</span>
              <span
                className={cn(
                  'font-display text-lg font-bold tabular-nums',
                  reached ? 'text-success' : 'text-text-primary'
                )}
              >
                {weeklyMinutes}
                <span className="text-xs text-text-muted"> / {weeklyTarget} 分钟</span>
              </span>
            </div>
            <ProgressBar value={rate} size="md" barClassName={reached ? 'bg-success' : undefined} />
            <p className={cn('mt-2 text-2xs', reached ? 'text-success' : 'text-text-muted')}>
              {reached
                ? '本周阅读时长已达标'
                : `周目标 ${weeklyTarget} 分钟（日均 ${target?.dailyMinutes ?? '-'} 分钟）`}
            </p>
          </div>

          {target && target.annualChars > 0 && (
            <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
              <div className="flex items-center gap-2">
                <Icon name="BookMarked" size="sm" className="text-primary" />
                <span className="text-xs font-medium text-text-secondary">年阅读量目标</span>
              </div>
              <p className="mt-1.5 font-display text-lg font-bold text-text-primary">
                ≥ {target.annualChars}
                <span className="text-xs text-text-muted"> 万字 / 年</span>
              </p>
              <p className="mt-1 text-2xs text-text-muted">
                当前梯级 {ladder} 梯（{childName} 年级对应）
              </p>
            </div>
          )}

          <p className="text-2xs leading-relaxed text-text-muted">
            阅读时长与年阅读量目标来自教育部行业标准《中国青少年阅读素养框架》（JY/T
            0663—2026），按孩子年级自动匹配梯级。
          </p>
        </div>

        {/* Reading ability radar */}
        <div className="lg:col-span-2">
          <ReadingAbilityRadar
            currentLadder={ladder}
            title={`${childName}的阅读素养评估`}
            description="6 个阅读能力维度 · 四阶十二梯进阶体系"
          />
        </div>
      </div>
    </GlassCard>
  );
}
