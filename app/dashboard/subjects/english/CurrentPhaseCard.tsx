'use client';

import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import {
  getEnglishPlanByGrade,
  getEnglishStatusByGrade,
  getEnglishProgress,
} from '@/lib/subjects/english';

export default function CurrentPhaseCard({ grade }: { grade: number }) {
  const plan = getEnglishPlanByGrade(grade);
  const status = getEnglishStatusByGrade(grade);
  const progress = getEnglishProgress(status.odUnit, status.odTotal);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-xl border border-border-subtle bg-surface-elevated p-6"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl border border-border-default bg-surface-elevated">
          <Icon name="Target" size="md" className="text-text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold">当前阶段：{plan.grade}</h2>
          <p className="text-sm text-text-tertiary">{plan.period}</p>
        </div>
      </div>

      {/* Status overview */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
          <p className="mb-1 text-xs text-text-muted">OD 进度</p>
          <p className="text-2xl font-bold text-text-secondary">
            {status.odUnit}/{status.odTotal}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-highlight">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${progress.odProgress}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
          <p className="mb-1 text-xs text-text-muted">RAZ 级别</p>
          <p className="text-2xl font-bold text-text-secondary">{status.razLevel}</p>
          <p className="mt-1 text-xs text-text-muted">
            目标：{plan.targets.find((t) => t.label.includes('RAZ'))?.target || '维持'}
          </p>
        </div>

        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
          <p className="mb-1 text-xs text-text-muted">每日英语</p>
          <p className="text-2xl font-bold text-text-secondary">{status.dailyEnglishTime}</p>
          <p className="mt-1 text-xs text-text-muted">含听说读写</p>
        </div>

        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
          <p className="mb-1 text-xs text-text-muted">弱项</p>
          <p className="text-2xl font-bold text-warning">
            {status.weakSkills.slice(0, 2).join('、')}
          </p>
          <p className="mt-1 text-xs text-text-muted">重点补强</p>
        </div>
      </div>

      {/* Targets */}
      <div className="mb-6 rounded-xl border border-border-subtle bg-surface-elevated p-4">
        <h3 className="mb-4 flex items-center gap-2 font-bold text-text-secondary">
          <Icon name="TrendingUp" size="sm" className="text-secondary" />
          阶段目标
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {plan.targets.map((target) => (
            <div
              key={target.label}
              className="flex items-center justify-between border-b border-border-subtle py-2 last:border-0"
            >
              <span className="text-sm text-text-tertiary">{target.label}</span>
              <div className="text-right">
                <span className="text-xs text-text-muted line-through">{target.current}</span>
                <span className="ml-2 text-sm text-text-secondary">{target.target}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly template */}
      <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
        <h3 className="mb-4 flex items-center gap-2 font-bold text-text-secondary">
          <Icon name="Clock" size="sm" className="text-accent" />
          每周计划模板
        </h3>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-7">
          {plan.weeklyTemplate.map((task) => (
            <div
              key={task.day}
              className="rounded-lg border border-border-subtle bg-surface-elevated p-3 transition-colors hover:bg-surface-highlight"
            >
              <p className="mb-1 text-xs font-medium text-primary">{task.day}</p>
              <p className="mb-2 text-sm font-medium text-text-secondary">{task.focus}</p>
              <p className="mb-2 text-xs text-text-muted">{task.duration}</p>
              <div className="space-y-1">
                {task.materials.map((material) => (
                  <p key={material} className="text-2xs text-text-tertiary">
                    {material}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak skills alert */}
      {plan.weakSkills && plan.weakSkills.length > 0 && (
        <div className="bg-warning/10 border-warning/20 mt-6 flex items-start gap-3 rounded-xl border p-4">
          <Icon name="AlertCircle" size="md" className="mt-0.5 shrink-0 text-warning" />
          <div>
            <p className="mb-1 font-medium text-text-secondary">
              {status.weakSkills.slice(0, 2).join('、')}是当前弱项
            </p>
            <p className="text-sm text-text-tertiary">
              通过「复述本 + 口袋领航」练说，通过「OD 配套练习册 + 每周小练笔」练写。 不要跳过 OD
              课程里的 Communicate 和 Writing 环节。
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
