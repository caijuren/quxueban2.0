'use client';

import { motion } from 'framer-motion';
import { Target, Clock, TrendingUp, AlertCircle, Calculator, Award } from 'lucide-react';
import { getMathPlanByGrade, getMathStatusByGrade } from '@/lib/subjects/math';

export default function MathPhaseCard({ grade }: { grade: number }) {
  const plan = getMathPlanByGrade(grade);
  const status = getMathStatusByGrade(grade);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl border border-border-subtle bg-surface-elevated p-6"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500">
          <Target className="size-5 text-text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold">当前阶段：{plan.grade}</h2>
          <p className="text-sm text-text-tertiary">{plan.period}</p>
        </div>
      </div>

      {/* Status overview */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
          <p className="mb-1 text-xs text-text-muted">当前专题</p>
          <p className="text-lg font-bold text-text-secondary">{status.currentTopic}</p>
        </div>

        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
          <p className="mb-1 text-xs text-text-muted">每日数学</p>
          <p className="text-2xl font-bold text-text-secondary">{status.dailyMathTime}</p>
          <p className="mt-1 text-xs text-text-muted">含校内 + 奥数</p>
        </div>

        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
          <p className="mb-1 text-xs text-text-muted">弱项</p>
          <p className="text-lg font-bold text-warning">
            {status.weakSkills.slice(0, 2).join('、')}
          </p>
          <p className="mt-1 text-xs text-text-muted">重点补强</p>
        </div>

        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
          <p className="mb-1 text-xs text-text-muted">下一场考试</p>
          <p className="text-lg font-bold text-text-secondary">{status.nextExam}</p>
          <p className="mt-1 text-xs text-text-muted">{status.nextExamDate}</p>
        </div>
      </div>

      {/* Targets */}
      <div className="mb-6 rounded-xl border border-border-subtle bg-surface-elevated p-4">
        <h3 className="mb-4 flex items-center gap-2 font-bold text-text-secondary">
          <TrendingUp className="size-4 text-secondary" />
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
          <Clock className="size-4 text-accent" />
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
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-warning" />
          <div>
            <p className="mb-1 font-medium text-text-secondary">
              {status.weakSkills.slice(0, 2).join('、')}是当前弱项
            </p>
            <p className="text-sm text-text-tertiary">
              通过「错题本 + 专项练习」针对性突破，保持每周至少一次限时训练提升速度。
              不要跳过校内作业，校内成绩是竞赛的基础。
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
