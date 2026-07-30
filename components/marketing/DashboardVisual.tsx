'use client';

import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

const subjects = [
  { name: '数学', progress: 72, color: '#e11d48' },
  { name: '英语', progress: 85, color: '#7c3aed' },
  { name: '语文', progress: 60, color: '#f43f5e' },
  { name: '竞赛', progress: 35, color: '#8b5cf6' },
];

const metrics = [
  { label: '整体进度', value: '68%', status: '正常' },
  { label: '本月任务', value: '12/16', status: '进行中' },
  { label: '风险项目', value: '2', status: '需关注' },
];

export default function DashboardVisual() {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-5 corner-accent backdrop-blur-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          <span className="text-xs font-mono text-text-tertiary uppercase tracking-wider">
            实时进度仪表盘
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-xs font-mono text-primary">LIVE</span>
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
              className="p-3 rounded-xl bg-surface-light border border-border-subtle"
            >
              <div className="text-xs text-text-muted mb-1">{metric.label}</div>
              <div className="text-lg font-bold font-display text-text-primary tabular-nums">{metric.value}</div>
              <div className="text-xs text-text-muted mt-0.5">{metric.status}</div>
            </motion.div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-surface-light border border-border-subtle space-y-4">
          <div className="text-xs font-mono text-text-muted uppercase tracking-wider">
            学科准备度
          </div>
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.08 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-text-secondary">{subject.name}</span>
                <span className="text-xs font-mono tabular-nums" style={{ color: subject.color }}>
                  {subject.progress}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-highlight overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: subject.color }}
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
          className="flex items-center justify-between p-4 rounded-xl border border-primary/20 bg-primary/[0.03]"
        >
          <div>
            <div className="text-xs text-text-muted mb-0.5">健康度评分</div>
            <div className="text-lg font-bold font-display text-primary tabular-nums">78/100</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-text-muted mb-0.5">评估结论</div>
            <div className="text-xs text-text-secondary">整体良好，奥数需加强</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
