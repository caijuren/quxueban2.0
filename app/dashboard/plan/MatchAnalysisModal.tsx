'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import {
  X,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Globe,
  Trophy,
  Pencil,
  Save,
  RotateCcw,
} from 'lucide-react';
import { RoutePlan } from '@/lib/plans';

interface Metric {
  name: string;
  score: number;
  target: number;
  color: string;
  icon: typeof Target;
  trend: 'up' | 'down' | 'stable';
  weight: number;
}

const defaultMetrics: Metric[] = [
  { name: '奥数基础', score: 35, target: 80, color: '#f43f5e', icon: Target, trend: 'up', weight: 1 },
  { name: '英语水平', score: 40, target: 85, color: '#8b5cf6', icon: Globe, trend: 'up', weight: 1 },
  { name: '竞赛经历', score: 15, target: 70, color: '#f59e0b', icon: Trophy, trend: 'up', weight: 1 },
  { name: '综合素质', score: 25, target: 60, color: '#06b6d4', icon: Sparkles, trend: 'stable', weight: 1 },
];

function calcMatch(metrics: Metric[]) {
  const totalWeight = metrics.reduce((sum, m) => sum + m.weight, 0);
  const raw = metrics.reduce((sum, m) => sum + (m.score / m.target) * 100 * m.weight, 0) / totalWeight;
  return Math.min(Math.round(raw), 100);
}

function getAdvice(match: number) {
  if (match >= 80) return { text: '匹配度较高，保持当前节奏并查漏补缺', level: 'good' as const };
  if (match >= 60) return { text: '有一定基础，建议重点突破薄弱科目', level: 'medium' as const };
  return { text: '距离三公录取标准还有较大差距，建议重点加强奥数和英语学习', level: 'low' as const };
}

export default function MatchAnalysisModal({
  isOpen,
  onClose,
  plan,
}: {
  isOpen: boolean;
  onClose: () => void;
  plan: RoutePlan;
}) {
  const [metrics, setMetrics] = useState<Metric[]>(defaultMetrics);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const match = useMemo(() => calcMatch(metrics), [metrics]);
  const advice = useMemo(() => getAdvice(match), [match]);

  const handleScoreChange = (index: number, value: number) => {
    setMetrics((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], score: Math.min(value, next[index].target * 1.2) };
      return next;
    });
  };

  const reset = () => setMetrics(defaultMetrics);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl flex flex-col bg-surface border border-primary/30 shadow-dropdown"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 p-6 pb-4 border-b border-border-subtle">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display">路线匹配度分析</h3>
                  <p className="text-xs text-text-tertiary">{plan.name} · 当前匹配度 {match}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing((v) => !v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isEditing
                      ? 'bg-success/20 text-success hover:bg-success/30'
                      : 'bg-surface-light text-text-secondary hover:bg-surface-highlight'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-3.5 h-3.5" /> 完成
                    </>
                  ) : (
                    <>
                      <Pencil className="w-3.5 h-3.5" /> 编辑
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-surface-light flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-highlight transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex-1 overflow-y-auto p-6 pt-4">
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      className="stroke-border-subtle"
                      strokeWidth="8"
                    />
                    <motion.circle
                      key={match}
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#matchGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: match / 100 }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      style={{
                        filter: 'drop-shadow(0 0 12px var(--shadow-primary))',
                      }}
                    />
                    <defs>
                      <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--color-primary-glow)" />
                        <stop offset="100%" stopColor="var(--color-secondary)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                      {match}%
                    </span>
                    <span className="text-xs text-text-tertiary">匹配度</span>
                  </div>
                </div>
              </div>
              <p
                className={`text-center text-sm ${
                  advice.level === 'good' ? 'text-success' : advice.level === 'medium' ? 'text-warning' : 'text-text-tertiary'
                }`}
              >
                {advice.text}
              </p>
            </div>

            <div className="space-y-4">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-surface-light rounded-xl p-4 border border-border-subtle"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${metric.color}20` }}>
                        <metric.icon className="w-4 h-4" style={{ color: metric.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{metric.name}</p>
                        <p className="text-xs text-text-tertiary">目标：{metric.target}分</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-success" />
                      ) : metric.trend === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-warning" />
                      ) : (
                        <Minus className="w-4 h-4 text-text-secondary" />
                      )}
                      {isEditing ? (
                        <input
                          type="number"
                          min={0}
                          max={Math.round(metric.target * 1.2)}
                          value={Math.round(metric.score)}
                          onChange={(e) => handleScoreChange(index, Number(e.target.value))}
                          className="w-16 ml-1 px-2 py-1 rounded-md bg-surface-light text-sm font-bold text-text-primary text-center border border-border-default focus:border-primary focus:outline-none"
                        />
                      ) : (
                        <span
                          className={`text-sm font-bold ${
                            metric.score >= metric.target
                              ? 'text-success'
                              : metric.score >= metric.target * 0.7
                              ? 'text-warning'
                              : 'text-text-secondary'
                          }`}
                        >
                          {Math.round(metric.score)}分
                        </span>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <input
                      type="range"
                      min={0}
                      max={Math.round(metric.target * 1.2)}
                      step={1}
                      value={Math.round(metric.score)}
                      onChange={(e) => handleScoreChange(index, Number(e.target.value))}
                      className="w-full h-2 rounded-full bg-surface-highlight appearance-none cursor-pointer accent-primary"
                      style={{ accentColor: metric.color } as React.CSSProperties}
                    />
                  ) : (
                    <div className="h-2 rounded-full bg-surface-highlight overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((metric.score / metric.target) * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: metric.color,
                          boxShadow: `0 0 10px ${metric.color}60`,
                        }}
                      />
                    </div>
                  )}

                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-text-tertiary">
                      差距：{Math.max(0, metric.target - Math.round(metric.score))}分
                    </span>
                    <span
                      className={`text-xs ${
                        metric.score >= metric.target
                          ? 'text-success'
                          : metric.score >= metric.target * 0.7
                          ? 'text-warning'
                          : 'text-primary'
                      }`}
                    >
                      {metric.score >= metric.target ? '已达标' : metric.score >= metric.target * 0.7 ? '接近目标' : '需加强'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border-subtle">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-text-tertiary mb-1">综合建议</p>
                  <p className="text-sm text-text-secondary">
                    当前阶段重点提升{metrics.slice(0, 2).map((m) => m.name).join('和')}，建议四年级前完成 AMC8 和小托福考试
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={reset}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-light text-text-secondary text-sm hover:bg-surface-highlight transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    重置
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-text-primary text-sm font-medium hover:shadow-glow-primary transition-all">
                    制定提升计划
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
