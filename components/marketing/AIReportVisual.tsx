'use client';

import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';

const insights = [
  {
    icon: Target,
    title: '路线匹配度 78%',
    status: '良好',
    color: '#22c55e',
  },
  {
    icon: AlertTriangle,
    title: '需关注：奥数尚未启动',
    status: '风险',
    color: '#f59e0b',
  },
  {
    icon: TrendingUp,
    title: '本月重点任务',
    status: '建议',
    color: '#06b6d4',
  },
];

export default function AIReportVisual() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 corner-accent backdrop-blur-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-secondary" aria-hidden="true" />
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            AI 智能检视
          </span>
        </div>
        <span className="text-[11px] font-mono text-secondary">GENERATED</span>
      </div>

      <div className="rounded-xl bg-background border border-white/[0.06] p-4 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-secondary" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-base font-bold font-display">AI 诊断报告</h3>
              <p className="text-[11px] text-slate-500">基于当前进度生成 · 2025.07</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-secondary">v2.4</span>
        </div>

        {insights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.12, duration: 0.4 }}
            className="p-3 rounded-lg"
            style={{ backgroundColor: `${insight.color}08`, border: `1px solid ${insight.color}20` }}
          >
            <div className="flex items-start gap-3">
              <insight.icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: insight.color }} aria-hidden="true" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold" style={{ color: insight.color }}>
                    {insight.title}
                  </span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: `${insight.color}20`, color: insight.color }}
                  >
                    {insight.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
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
          <div className="h-px bg-white/[0.06] mb-2" />
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">AI 建议 action</span>
            <span className="font-mono text-primary">START MATH FOUNDATION</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
