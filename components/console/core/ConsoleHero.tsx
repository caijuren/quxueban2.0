'use client';

import { ChevronDown, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { Child } from '@/lib/children';
import ChildAvatar from '@/components/dashboard/ChildAvatar';
import { gradeLabel, gradeToStage } from '@/lib/children';

interface ConsoleHeroProps {
  child: Child | null;
  completionRate?: number;
  aiSuggestionsCount?: number;
  onSwitchChild?: () => void;
}

export default function ConsoleHero({
  child,
  completionRate,
  aiSuggestionsCount,
  onSwitchChild,
}: ConsoleHeroProps) {
  const stage = child ? gradeToStage(child.grade, child.educationSystem) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-surface to-surface-elevated border border-border-default p-6"
    >
      {/* Ambient glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-ai/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        {/* Breadcrumb / title */}
        <div className="flex items-center gap-2 text-text-muted text-xs mb-4">
          <Home className="w-3.5 h-3.5" />
          <span>家庭学习控制台</span>
          <span>/</span>
          <span className="text-text-secondary">成长概览</span>
        </div>

        {/* Child selector + status */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <button
            onClick={onSwitchChild}
            className="group flex items-center gap-3 p-2 pr-4 rounded-2xl bg-surface-hover border border-border-subtle hover:border-primary/30 hover:bg-surface-hover transition-all"
          >
            <ChildAvatar child={child} size="xl" shape="rounded" fallbackIcon />
            <div className="text-left">
              <p className="text-lg font-bold text-text-primary leading-tight">
                {child ? child.name : '未选择孩子'}
              </p>
              <p className="text-xs text-text-tertiary">
                {child
                  ? `${gradeLabel(child.grade, child.educationSystem)} · ${stage}`
                  : '请选择孩子'}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
          </button>

          <div className="flex items-center gap-3 sm:gap-4">
            {completionRate !== undefined && (
              <div className="px-4 py-2 rounded-xl bg-surface-hover">
                <p className="text-2xs text-text-muted">本周完成</p>
                <p className="text-base font-bold text-primary">{completionRate}%</p>
              </div>
            )}
            {aiSuggestionsCount !== undefined && (
              <div className="px-4 py-2 rounded-xl bg-surface-hover">
                <p className="text-2xs text-text-muted">AI 建议</p>
                <p className="text-base font-bold text-ai">{aiSuggestionsCount} 条</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
