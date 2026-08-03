'use client';

import { motion } from 'framer-motion';
import { Mic, PenTool, Target, AlertCircle } from 'lucide-react';
import { getSpeakWritePlanByGrade } from '@/lib/subjects/english';

export default function SpeakWritePlan({ grade }: { grade: number }) {
  const plan = getSpeakWritePlanByGrade(grade);

  if (!plan) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="rounded-2xl bg-surface-elevated p-6 border border-border-subtle"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warning to-orange-400 flex items-center justify-center">
          <Target className="w-5 h-5 text-text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display">说写弱项专项补强</h2>
          <p className="text-sm text-text-tertiary">
            针对「{plan.weakSkills.join('、')}」的每日专项计划
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Speaking */}
        <div className="rounded-xl bg-surface-elevated border border-border-subtle p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-violet-400 flex items-center justify-center">
              <Mic className="w-5 h-5 text-text-primary" />
            </div>
            <div>
              <p className="font-bold text-text-secondary">{plan.dailySpeaking.title}</p>
              <p className="text-xs text-text-muted">{plan.dailySpeaking.duration}</p>
            </div>
          </div>
          <ol className="space-y-2">
            {plan.dailySpeaking.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-text-tertiary">
                <span className="w-5 h-5 rounded-full bg-secondary/20 text-secondary text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Writing */}
        <div className="rounded-xl bg-surface-elevated border border-border-subtle p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-rose-400 flex items-center justify-center">
              <PenTool className="w-5 h-5 text-text-primary" />
            </div>
            <div>
              <p className="font-bold text-text-secondary">{plan.dailyWriting.title}</p>
              <p className="text-xs text-text-muted">{plan.dailyWriting.duration}</p>
            </div>
          </div>
          <ol className="space-y-2">
            {plan.dailyWriting.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-text-tertiary">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-warning/10 border border-warning/20 p-4">
        <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-text-secondary mb-1">本周目标</p>
          <p className="text-sm text-text-tertiary">{plan.weeklyGoal}</p>
        </div>
      </div>
    </motion.div>
  );
}
