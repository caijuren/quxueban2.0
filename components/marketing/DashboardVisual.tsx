'use client';

import { motion } from 'framer-motion';

const subjects = [
  { name: '数学', progress: 72, color: '#ff2d6a' },
  { name: '英语', progress: 85, color: '#8b5cf6' },
  { name: '语文', progress: 60, color: '#06b6d4' },
  { name: '竞赛', progress: 35, color: '#f59e0b' },
];

const metrics = [
  { label: '整体进度', value: '68%', status: '正常' },
  { label: '本月任务', value: '12/16', status: '进行中' },
  { label: '风险项目', value: '2', status: '需关注' },
];

export default function DashboardVisual() {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface/30 p-6 corner-accent">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-mono text-slate-400">PROGRESS DASHBOARD // 实时追踪</span>
        </div>
        <span className="text-xs font-mono text-primary">LIVE</span>
      </div>

      <div className="space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-4 rounded-xl bg-background border border-white/5"
            >
              <div className="text-xs text-slate-500 mb-1">{metric.label}</div>
              <div className="text-2xl font-bold font-display text-white">{metric.value}</div>
              <div className="text-xs text-slate-600 mt-1">{metric.status}</div>
            </motion.div>
          ))}
        </div>

        {/* Subject bars */}
        <div className="p-5 rounded-xl bg-background border border-white/5 space-y-5">
          <div className="text-xs font-mono text-slate-500 mb-2">SUBJECT READINESS</div>
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">{subject.name}</span>
                <span className="text-sm font-mono" style={{ color: subject.color }}>
                  {subject.progress}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-light overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: subject.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${subject.progress}%` }}
                  transition={{ duration: 1, delay: 0.8 + index * 0.1, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Health score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex items-center justify-between p-4 rounded-xl border border-primary/20 bg-primary/5"
        >
          <div>
            <div className="text-xs text-slate-500 mb-1">健康度评分</div>
            <div className="text-2xl font-bold font-display text-primary">78/100</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-1">评估结论</div>
            <div className="text-sm text-slate-300">整体良好，奥数需加强</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
