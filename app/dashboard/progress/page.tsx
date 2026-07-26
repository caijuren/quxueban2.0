'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Minus, User } from 'lucide-react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import { gradeLabel } from '@/lib/children';
import EmptyState from '@/components/ui/EmptyState';

const abilities = [
  { name: '奥数思维', current: 20, target: 85, average: 35, trend: 'up' },
  { name: '英语能力', current: 55, target: 90, average: 45, trend: 'up' },
  { name: '语文素养', current: 45, target: 80, average: 50, trend: 'down' },
  { name: '综合素质', current: 30, target: 75, average: 40, trend: 'up' },
  { name: '竞赛经历', current: 10, target: 70, average: 15, trend: 'minus' },
];

const trendConfig: Record<string, { icon: typeof TrendingUp; color: string; label: string }> = {
  up: { icon: TrendingUp, color: 'text-success', label: '超前' },
  down: { icon: TrendingDown, color: 'text-danger', label: '落后' },
  minus: { icon: Minus, color: 'text-slate-400', label: '持平' },
};

export default function ProgressPage() {
  const { currentChild } = useChildren();

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold font-display mb-2">
          {currentChild ? `${currentChild.name}的进度追踪` : '进度追踪'}
        </h1>
        <p className="text-slate-400">
          {currentChild
            ? `当前阶段：${gradeLabel(currentChild.grade)} · 对比目标与同龄平均`
            : '对比目标、同龄平均，掌握孩子各项能力准备度'}
        </p>
      </motion.div>

      {!currentChild && (
        <EmptyState
          icon={User}
          title="还没有孩子档案"
          description="请先在右上角添加孩子，系统会根据年级展示对应的能力准备度"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ability bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 rounded-2xl glass p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold font-display">能力准备度</h2>
          </div>

          <div className="space-y-6">
            {abilities.map((ability, index) => {
              const trend = trendConfig[ability.trend];
              return (
                <motion.div
                  key={ability.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-slate-200">{ability.name}</span>
                      <span className={`flex items-center gap-1 text-xs ${trend.color}`}>
                        <trend.icon className="w-3 h-3" />
                        {trend.label}
                      </span>
                    </div>
                    <div className="text-sm text-slate-400">
                      <span className="text-white font-semibold">{ability.current}%</span>
                      {' / '}
                      目标 {ability.target}%
                    </div>
                  </div>
                  <div className="relative h-3 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${ability.current}%` }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-secondary"
                    />
                    <div
                      className="absolute inset-y-0 w-0.5 bg-white/40"
                      style={{ left: `${ability.target}%` }}
                    />
                    <div
                      className="absolute inset-y-0 w-0.5 bg-white/20 border-l border-dashed border-slate-500"
                      style={{ left: `${ability.average}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
                    <span>同龄平均 {ability.average}%</span>
                    <span>目标 {ability.target}%</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl glass p-6 border border-secondary/20"
          style={{ boxShadow: '0 0 40px rgba(139, 92, 246, 0.1)' }}
        >
          <h2 className="text-xl font-bold font-display mb-6">总体评估</h2>

          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center w-32 h-32">
              <svg className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray="351.86"
                  strokeDashoffset="239.26"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-display">32%</span>
                <span className="text-xs text-slate-400">总体准备度</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-success/10 border border-success/20">
              <p className="text-sm text-success font-semibold mb-1">优势项</p>
              <p className="text-sm text-slate-300">英语基础较好，已超前同龄平均水平</p>
            </div>
            <div className="p-4 rounded-xl bg-warning/10 border border-warning/20">
              <p className="text-sm text-warning font-semibold mb-1">短板项</p>
              <p className="text-sm text-slate-300">奥数思维和竞赛经历尚未启动，需尽快规划</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
