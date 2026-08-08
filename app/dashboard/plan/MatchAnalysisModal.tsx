'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
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
import Modal from '@/components/ui/Modal';
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
  {
    name: '奥数基础',
    score: 35,
    target: 80,
    color: 'primary',
    icon: Target,
    trend: 'up',
    weight: 1,
  },
  {
    name: '英语水平',
    score: 40,
    target: 85,
    color: 'secondary',
    icon: Globe,
    trend: 'up',
    weight: 1,
  },
  {
    name: '竞赛经历',
    score: 15,
    target: 70,
    color: 'warning',
    icon: Trophy,
    trend: 'up',
    weight: 1,
  },
  {
    name: '综合素质',
    score: 25,
    target: 60,
    color: 'accent',
    icon: Sparkles,
    trend: 'stable',
    weight: 1,
  },
];

const metricColorClasses: Record<
  string,
  { text: string; bg: string; accent: string; glow: string }
> = {
  primary: {
    text: 'text-primary',
    bg: 'bg-primary/20',
    accent: 'accent-primary',
    glow: 'shadow-primary/40',
  },
  secondary: {
    text: 'text-secondary',
    bg: 'bg-secondary/20',
    accent: 'accent-secondary',
    glow: 'shadow-secondary/40',
  },
  warning: {
    text: 'text-warning',
    bg: 'bg-warning/20',
    accent: 'accent-warning',
    glow: 'shadow-warning/40',
  },
  accent: {
    text: 'text-accent',
    bg: 'bg-accent/20',
    accent: 'accent-accent',
    glow: 'shadow-accent/40',
  },
};

function calcMatch(metrics: Metric[]) {
  const totalWeight = metrics.reduce((sum, m) => sum + m.weight, 0);
  const raw =
    metrics.reduce((sum, m) => sum + (m.score / m.target) * 100 * m.weight, 0) / totalWeight;
  return Math.min(Math.round(raw), 100);
}

function getAdvice(match: number) {
  if (match >= 80) return { text: '匹配度较高，保持当前节奏并查漏补缺', level: 'good' as const };
  if (match >= 60) return { text: '有一定基础，建议重点突破薄弱科目', level: 'medium' as const };
  return {
    text: '距离三公录取标准还有较大差距，建议重点加强奥数和英语学习',
    level: 'low' as const,
  };
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="路线匹配度分析"
      subtitle={`${plan.name} · 当前匹配度 ${match}%`}
      icon={Sparkles}
      iconClassName="bg-secondary"
      size="lg"
      colorScheme="rose"
      zIndex={100}
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsEditing((v) => !v)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              isEditing
                ? 'bg-success/20 hover:bg-success/30 text-success'
                : 'bg-surface-elevated text-text-secondary hover:bg-surface-highlight'
            }`}
          >
            {isEditing ? (
              <>
                <Save className="size-3.5" /> 完成
              </>
            ) : (
              <>
                <Pencil className="size-3.5" /> 编辑
              </>
            )}
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1.5 rounded-lg bg-surface-elevated px-3 py-2 text-sm text-text-tertiary transition-all hover:bg-surface-highlight"
            >
              <RotateCcw className="size-3.5" />
              重置
            </button>
            <button
              type="button"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-inverse transition-all hover:bg-primary/90"
            >
              制定提升计划
            </button>
          </div>
        </div>
      }
    >
      <div>
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-center">
            <div className="relative size-32">
              <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
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
                    <stop offset="0%" stopColor="var(--color-primary)" />
                    <stop offset="100%" stopColor="var(--color-secondary)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl font-bold text-primary">{match}%</span>
                <span className="text-xs text-text-muted">匹配度</span>
              </div>
            </div>
          </div>
          <p
            className={`text-center text-sm ${
              advice.level === 'good'
                ? 'text-success'
                : advice.level === 'medium'
                  ? 'text-warning'
                  : 'text-text-tertiary'
            }`}
          >
            {advice.text}
          </p>
        </div>

        <div className="space-y-4">
          {metrics.map((metric, index) => {
            const metricStyle = metricColorClasses[metric.color];
            return (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="rounded-xl border border-border-subtle bg-surface-elevated p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-8 items-center justify-center rounded-lg ${metricStyle.bg}`}
                    >
                      <metric.icon className={`size-4 ${metricStyle.text}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary">{metric.name}</p>
                      <p className="text-xs text-text-muted">目标：{metric.target}分</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="size-4 text-success" />
                    ) : metric.trend === 'down' ? (
                      <TrendingDown className="size-4 text-warning" />
                    ) : (
                      <Minus className="size-4 text-text-muted" />
                    )}
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        max={Math.round(metric.target * 1.2)}
                        value={Math.round(metric.score)}
                        onChange={(e) => handleScoreChange(index, Number(e.target.value))}
                        className="ml-1 w-16 rounded-md border border-border-default bg-surface-highlight px-2 py-1 text-center text-sm font-bold text-text-primary focus:border-primary focus:outline-none"
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
                    className={`h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-highlight ${metricStyle.accent}`}
                  />
                ) : (
                  <div className="h-2 overflow-hidden rounded-full bg-surface-elevated">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((metric.score / metric.target) * 100, 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
                      className={`h-full rounded-full ${metricStyle.text.replace('text-', 'bg-')}`}
                    />
                  </div>
                )}

                <div className="mt-1 flex justify-between">
                  <span className="text-xs text-text-muted">
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
                    {metric.score >= metric.target
                      ? '已达标'
                      : metric.score >= metric.target * 0.7
                        ? '接近目标'
                        : '需加强'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 border-t border-border-subtle pt-4">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-1 text-xs text-text-muted">综合建议</p>
              <p className="text-sm text-text-secondary">
                当前阶段重点提升
                {metrics
                  .slice(0, 2)
                  .map((m) => m.name)
                  .join('和')}
                ，建议四年级前完成 AMC8 和小托福考试
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
