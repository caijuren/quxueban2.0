'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Child, gradeLabel } from '@/lib/children';
import CommandCard from '@/components/ui/CommandCard';

const abilities = [
  { name: '奥数思维', current: 20, target: 85, average: 35, trend: 'up' },
  { name: '英语能力', current: 55, target: 90, average: 45, trend: 'up' },
  { name: '语文素养', current: 45, target: 80, average: 50, trend: 'down' },
  { name: '综合素质', current: 30, target: 75, average: 40, trend: 'up' },
  { name: '竞赛经历', current: 10, target: 70, average: 15, trend: 'minus' },
];

const trendConfig: Record<string, { icon: typeof TrendingUp; color: string; label: string }> = {
  up: { icon: TrendingUp, color: 'text-success', label: '超前' },
  down: { icon: TrendingDown, color: 'text-error', label: '落后' },
  minus: { icon: Minus, color: 'text-text-muted', label: '持平' },
};

interface ProgressPanelProps {
  child: Child;
}

export default function ProgressPanel({ child }: ProgressPanelProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Ability bars */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-2"
      >
        <CommandCard className="p-6 h-full">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold font-display">能力准备度</h2>
            <span className="text-xs text-text-muted ml-auto">
              {gradeLabel(child.grade, child.educationSystem)} · 对比目标与同龄平均
            </span>
          </div>

          <div className="space-y-5">
            {abilities.map((ability, index) => {
              const trend = trendConfig[ability.trend];
              return (
                <motion.div
                  key={ability.name}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.06 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-text-secondary">{ability.name}</span>
                      <span className={`flex items-center gap-1 text-[10px] ${trend.color}`}>
                        <trend.icon className="w-3 h-3" />
                        {trend.label}
                      </span>
                    </div>
                    <div className="text-xs text-text-muted">
                      <span className="text-text-primary font-semibold">{ability.current}%</span>
                      {' / '}
                      目标 {ability.target}%
                    </div>
                  </div>
                  <div className="relative h-2 rounded-full bg-surface-elevated overflow-hidden">
                    <motion.div
                      initial={shouldReduceMotion ? false : { width: 0 }}
                      animate={{ width: `${ability.current}%` }}
                      transition={{ duration: 0.8, delay: 0.15 + index * 0.06 }}
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-secondary"
                    />
                    <div
                      className="absolute inset-y-0 w-0.5 bg-border-strong"
                      style={{ left: `${ability.target}%` }}
                    />
                    <div
                      className="absolute inset-y-0 w-0.5 border-l border-dashed border-border-subtle"
                      style={{ left: `${ability.average}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-text-muted">
                    <span>同龄平均 {ability.average}%</span>
                    <span>目标 {ability.target}%</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CommandCard>
      </motion.div>

      {/* Summary card */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <CommandCard className="p-6 h-full border-secondary/10">
          <h2 className="text-base font-bold font-display mb-4">总体评估</h2>

          <div className="text-center mb-5">
            <div className="relative inline-flex items-center justify-center w-28 h-28">
              <svg className="w-full h-full -rotate-90">
                <circle cx="56" cy="56" r="48" className="text-border-subtle" stroke="currentColor" strokeWidth="10" fill="none" />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="url(#progressGradient)"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="301.59"
                  strokeDashoffset="205.08"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--secondary))" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-display">32%</span>
                <span className="text-[10px] text-text-muted">总体准备度</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-success/10 border border-success/20">
              <p className="text-xs text-success font-semibold mb-0.5">优势项</p>
              <p className="text-xs text-text-secondary">英语基础较好，已超前同龄平均水平</p>
            </div>
            <div className="p-3 rounded-xl bg-warning/10 border border-warning/20">
              <p className="text-xs text-warning font-semibold mb-0.5">短板项</p>
              <p className="text-xs text-text-secondary">奥数思维和竞赛经历尚未启动，需尽快规划</p>
            </div>
          </div>
        </CommandCard>
      </motion.div>
    </div>
  );
}
