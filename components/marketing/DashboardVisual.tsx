'use client';

import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';

const subjects = [
  { name: '数学', progress: 72, color: 'primary' as const },
  { name: '英语', progress: 85, color: 'secondary' as const },
  { name: '语文', progress: 60, color: 'accent' as const },
  { name: '竞赛', progress: 35, color: 'warning' as const },
];

const metrics = [
  { label: '整体进度', value: '68%', status: '正常' },
  { label: '本月任务', value: '12/16', status: '进行中' },
  { label: '风险项目', value: '2', status: '需关注' },
];

const colorClasses: Record<string, { text: string; bg: string }> = {
  primary: { text: 'text-primary', bg: 'bg-primary' },
  secondary: { text: 'text-secondary', bg: 'bg-secondary' },
  accent: { text: 'text-accent', bg: 'bg-accent' },
  warning: { text: 'text-warning', bg: 'bg-warning' },
};

export default function DashboardVisual() {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="BarChart3" size="sm" className="text-primary" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-text-tertiary">
            实时进度总览
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-40" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <span className="font-mono text-[11px] text-primary">LIVE</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.08 }}
              className="rounded-xl border border-border-subtle bg-surface p-3"
            >
              <div className="mb-1 text-[10px] text-text-muted">{metric.label}</div>
              <div className="font-display text-lg font-bold tabular-nums text-text-primary">
                {metric.value}
              </div>
              <div className="mt-0.5 text-[10px] text-text-muted">{metric.status}</div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-4 rounded-xl border border-border-subtle bg-surface p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
            学科准备度
          </div>
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.08 }}
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs text-text-secondary">{subject.name}</span>
                <span
                  className={`font-mono text-xs tabular-nums ${colorClasses[subject.color].text}`}
                >
                  {subject.progress}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-hover">
                <motion.div
                  className={`h-full rounded-full ${colorClasses[subject.color].bg}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${subject.progress}%` }}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.08, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="border-primary/20 bg-primary/5 flex items-center justify-between rounded-xl border p-4"
        >
          <div>
            <div className="mb-0.5 text-[10px] text-text-muted">健康度评分</div>
            <div className="font-display text-lg font-bold tabular-nums text-primary">78/100</div>
          </div>
          <div className="text-right">
            <div className="mb-0.5 text-[10px] text-text-muted">评估结论</div>
            <div className="text-xs text-text-secondary">整体良好，奥数需加强</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
