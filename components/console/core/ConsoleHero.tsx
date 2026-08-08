'use client';

import { Icon } from '@/components/ui/icon';
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
      className="relative overflow-hidden rounded-[20px] border border-border-default bg-gradient-to-br from-surface to-surface-elevated p-6"
    >
      {/* Ambient glow */}
      <div className="bg-primary/10 pointer-events-none absolute -right-20 -top-20 size-64 rounded-full blur-3xl" />
      <div className="bg-ai/10 pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full blur-3xl" />

      <div className="relative">
        {/* Breadcrumb / title */}
        <div className="mb-4 flex items-center gap-2 text-xs text-text-muted">
          <Icon name="Home" size="sm" />
          <span>家庭学习控制台</span>
          <span>/</span>
          <span className="text-text-secondary">成长概览</span>
        </div>

        {/* Child selector + status */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <button
            onClick={onSwitchChild}
            className="hover:border-primary/30 group flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface-hover p-2 pr-4 transition-all hover:bg-surface-hover"
          >
            <ChildAvatar child={child} size="xl" shape="rounded" fallbackIcon />
            <div className="text-left">
              <p className="text-lg font-bold leading-tight text-text-primary">
                {child ? child.name : '未选择孩子'}
              </p>
              <p className="text-xs text-text-tertiary">
                {child
                  ? `${gradeLabel(child.grade, child.educationSystem)} · ${stage}`
                  : '请选择孩子'}
              </p>
            </div>
            <Icon
              name="ChevronDown"
              size="sm"
              className="text-text-muted transition-colors group-hover:text-primary"
            />
          </button>

          <div className="flex items-center gap-3 sm:gap-4">
            {completionRate !== undefined && (
              <div className="rounded-xl bg-surface-hover px-4 py-2">
                <p className="text-2xs text-text-muted">本周完成</p>
                <p className="text-base font-bold text-primary">{completionRate}%</p>
              </div>
            )}
            {aiSuggestionsCount !== undefined && (
              <div className="rounded-xl bg-surface-hover px-4 py-2">
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
