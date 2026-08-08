'use client';

import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';

const insights = [
  {
    icon: 'Target',
    title: '路线匹配度 78%',
    status: '良好',
    color: 'success' as const,
  },
  {
    icon: 'TriangleAlert',
    title: '需关注：奥数尚未启动',
    status: '风险',
    color: 'warning' as const,
  },
  {
    icon: 'TrendingUp',
    title: '本月重点任务',
    status: '建议',
    color: 'accent' as const,
  },
] as const;

const colorClasses = {
  success: 'bg-success/10 border-success/20 text-success [&_span]:bg-success/20',
  warning: 'bg-warning/10 border-warning/20 text-warning [&_span]:bg-warning/20',
  accent: 'bg-accent/10 border-accent/20 text-accent [&_span]:bg-accent/20',
};

export default function AIReportVisual() {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            name="Sparkles"
            size="sm"
            animate="pulse"
            className="text-secondary"
            aria-hidden="true"
          />
          <span className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
            AI 智能检视
          </span>
        </div>
        <span className="font-mono text-[11px] text-secondary">GENERATED</span>
      </div>

      <div className="space-y-3 rounded-xl border border-border-subtle bg-background p-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-3">
            <div className="bg-secondary/10 flex size-9 items-center justify-center rounded-lg">
              <Icon
                name="Sparkles"
                size="sm"
                animate="pulse"
                className="text-secondary"
                aria-hidden="true"
              />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-text-primary">AI 诊断报告</h3>
              <p className="text-[11px] text-text-muted">基于当前进度生成 · 2025.07</p>
            </div>
          </div>
          <span className="font-mono text-[11px] text-secondary">v2.4</span>
        </div>

        {insights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.12, duration: 0.4 }}
            className={`rounded-lg p-3 ${colorClasses[insight.color]}`}
          >
            <div className="flex items-start gap-3">
              <Icon name={insight.icon} size="sm" className="mt-0.5 shrink-0" aria-hidden="true" />
              <div className="flex-1">
                <div className="mb-0.5 flex items-center justify-between">
                  <span className="text-sm font-semibold">{insight.title}</span>
                  <span className="rounded px-1.5 py-0.5 text-[10px]">{insight.status}</span>
                </div>
                <p className="text-xs leading-relaxed text-text-tertiary">
                  {insight.title.includes('匹配度')
                    ? '当前主路线与目标学校匹配良好，建议继续保持节奏'
                    : insight.title.includes('奥数')
                      ? '建议根据三公路线要求，提前布局关键能力项'
                      : '确定数学学习形式，建立每周稳定的学习节奏'}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="pt-1"
        >
          <div className="mb-2 h-px bg-border-subtle" />
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-text-muted">AI 建议 action</span>
            <span className="font-mono text-primary">START MATH FOUNDATION</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
