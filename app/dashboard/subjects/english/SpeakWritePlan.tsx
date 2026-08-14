'use client';

import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { getSpeakWritePlanByGrade } from '@/lib/subjects/english';

export default function SpeakWritePlan({ grade }: { grade: number }) {
  const plan = getSpeakWritePlanByGrade(grade);

  if (!plan) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="rounded-xl border border-border-subtle bg-surface-elevated p-6"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="to-warning/70 flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-warning">
          <Icon name="Target" size="md" className="text-text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold">说写弱项专项补强</h2>
          <p className="text-sm text-text-tertiary">
            针对「{plan.weakSkills.join('、')}」的每日专项计划
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Speaking */}
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-secondary to-violet-400">
              <Icon name="Mic" size="md" className="text-text-primary" />
            </div>
            <div>
              <p className="font-bold text-text-secondary">{plan.dailySpeaking.title}</p>
              <p className="text-xs text-text-muted">{plan.dailySpeaking.duration}</p>
            </div>
          </div>
          <ol className="space-y-2">
            {plan.dailySpeaking.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-text-tertiary">
                <span className="bg-secondary/20 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs text-secondary">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Writing */}
        <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow">
              <Icon name="PenTool" size="md" className="text-text-primary" />
            </div>
            <div>
              <p className="font-bold text-text-secondary">{plan.dailyWriting.title}</p>
              <p className="text-xs text-text-muted">{plan.dailyWriting.duration}</p>
            </div>
          </div>
          <ol className="space-y-2">
            {plan.dailyWriting.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-text-tertiary">
                <span className="bg-primary/20 mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs text-primary">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="bg-warning/10 border-warning/20 flex items-start gap-3 rounded-xl border p-4">
        <Icon name="AlertCircle" size="md" className="mt-0.5 shrink-0 text-warning" />
        <div>
          <p className="mb-1 font-medium text-text-secondary">本周目标</p>
          <p className="text-sm text-text-tertiary">{plan.weeklyGoal}</p>
        </div>
      </div>
    </motion.div>
  );
}
