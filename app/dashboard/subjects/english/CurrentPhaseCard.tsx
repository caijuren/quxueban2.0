'use client';

import { motion } from 'framer-motion';
import { Target, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { getEnglishPlanByGrade, getEnglishStatusByGrade, getEnglishProgress } from '@/lib/subjects/english';

export default function CurrentPhaseCard({ grade }: { grade: number }) {
  const plan = getEnglishPlanByGrade(grade);
  const status = getEnglishStatusByGrade(grade);
  const progress = getEnglishProgress(status.odUnit, status.odTotal);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl bg-surface-elevated p-6 border border-border-subtle"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border-default flex items-center justify-center">
          <Target className="w-5 h-5 text-text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display">当前阶段：{plan.grade}</h2>
          <p className="text-sm text-text-tertiary">{plan.period}</p>
        </div>
      </div>

      {/* Status overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl bg-surface-elevated p-4 border border-border-subtle">
          <p className="text-xs text-text-muted mb-1">OD 进度</p>
          <p className="text-2xl font-bold text-text-secondary">
            {status.odUnit}/{status.odTotal}
          </p>
          <div className="mt-2 h-1.5 rounded-full bg-surface-highlight overflow-hidden">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${progress.odProgress}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl bg-surface-elevated p-4 border border-border-subtle">
          <p className="text-xs text-text-muted mb-1">RAZ 级别</p>
          <p className="text-2xl font-bold text-text-secondary">{status.razLevel}</p>
          <p className="text-xs text-text-muted mt-1">目标：{plan.targets.find((t) => t.label.includes('RAZ'))?.target || '维持'}</p>
        </div>

        <div className="rounded-xl bg-surface-elevated p-4 border border-border-subtle">
          <p className="text-xs text-text-muted mb-1">每日英语</p>
          <p className="text-2xl font-bold text-text-secondary">{status.dailyEnglishTime}</p>
          <p className="text-xs text-text-muted mt-1">含听说读写</p>
        </div>

        <div className="rounded-xl bg-surface-elevated p-4 border border-border-subtle">
          <p className="text-xs text-text-muted mb-1">弱项</p>
          <p className="text-2xl font-bold text-warning">{status.weakSkills.slice(0, 2).join('、')}</p>
          <p className="text-xs text-text-muted mt-1">重点补强</p>
        </div>
      </div>

      {/* Targets */}
      <div className="rounded-xl bg-surface-elevated border border-border-subtle p-4 mb-6">
        <h3 className="font-bold text-text-secondary mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-secondary" />
          阶段目标
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plan.targets.map((target) => (
            <div key={target.label} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
              <span className="text-sm text-text-tertiary">{target.label}</span>
              <div className="text-right">
                <span className="text-xs text-text-muted line-through">{target.current}</span>
                <span className="text-sm text-text-secondary ml-2">{target.target}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly template */}
      <div className="rounded-xl bg-surface-elevated border border-border-subtle p-4">
        <h3 className="font-bold text-text-secondary mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent" />
          每周计划模板
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-2">
          {plan.weeklyTemplate.map((task) => (
            <div
              key={task.day}
              className="rounded-lg bg-surface-elevated border border-border-subtle p-3 hover:bg-surface-highlight transition-colors"
            >
              <p className="text-xs text-primary font-medium mb-1">{task.day}</p>
              <p className="text-sm font-medium text-text-secondary mb-2">{task.focus}</p>
              <p className="text-xs text-text-muted mb-2">{task.duration}</p>
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
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-warning/10 border border-warning/20 p-4">
          <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-text-secondary mb-1">{status.weakSkills.slice(0, 2).join('、')}是当前弱项</p>
            <p className="text-sm text-text-tertiary">
              通过「复述本 + 口袋领航」练说，通过「OD 配套练习册 + 每周小练笔」练写。
              不要跳过 OD 课程里的 Communicate 和 Writing 环节。
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
