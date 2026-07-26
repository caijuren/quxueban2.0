'use client';

import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';

const insights = [
  {
    icon: Target,
    title: '路线匹配度 78%',
    status: '良好',
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.08)',
    border: 'rgba(34, 197, 94, 0.15)',
    description: '当前主路线与目标学校匹配良好，建议继续保持节奏',
  },
  {
    icon: AlertTriangle,
    title: '需关注：奥数尚未启动',
    status: '风险',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.15)',
    description: '建议根据三公路线要求，提前布局关键能力项',
  },
  {
    icon: TrendingUp,
    title: '本月重点任务',
    status: '建议',
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.08)',
    border: 'rgba(6, 182, 212, 0.15)',
    description: '确定数学学习形式，建立每周稳定的学习节奏',
  },
];

export default function AIReportVisual() {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface/30 p-6 corner-accent">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs font-mono text-slate-400">AI DIAGNOSIS // 智能检视</span>
        </div>
        <span className="text-xs font-mono text-secondary">GENERATED</span>
      </div>

      <div className="rounded-xl bg-background border border-white/5 p-5 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-bold font-display">AI 检视报告</h3>
              <p className="text-xs text-slate-500">基于当前进度生成 · 2025.07</p>
            </div>
          </div>
          <span className="text-xs font-mono text-secondary">v2.4</span>
        </div>

        {insights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.15, duration: 0.5 }}
            className="p-4 rounded-lg"
            style={{ backgroundColor: insight.bg, border: `1px solid ${insight.border}` }}
          >
            <div className="flex items-start gap-3">
              <insight.icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: insight.color }} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold" style={{ color: insight.color }}>
                    {insight.title}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: insight.border, color: insight.color }}
                  >
                    {insight.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400">{insight.description}</p>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-2"
        >
          <div className="h-px bg-white/5 mb-3" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">AI 建议 action</span>
            <span className="font-mono text-primary">START MATH FOUNDATION</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
