'use client';
import { Icon } from '@/components/ui/icon';

import { motion } from 'framer-motion';

import type { KeyResultNode } from '@/lib/plans';

interface KeyResultsBoardProps {
  nodes: KeyResultNode[];
}

const statusConfig = {
  completed: {
    icon: 'CheckCircle2',
    label: '已完成',
    bg: 'bg-success/10',
    border: 'border-success/30',
    text: 'text-success',
    dot: 'bg-success',
  },
  'in-progress': {
    icon: 'Clock',
    label: '进行中',
    bg: 'bg-primary/10',
    border: 'border-primary/30',
    text: 'text-primary',
    dot: 'bg-primary',
  },
  pending: {
    icon: 'CircleDashed',
    label: '待开始',
    bg: 'bg-surface-elevated',
    border: 'border-border-default',
    text: 'text-text-tertiary',
    dot: 'bg-text-muted',
  },
  'at-risk': {
    icon: 'AlertTriangle',
    label: '有风险',
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    text: 'text-warning',
    dot: 'bg-warning',
  },
};

export default function KeyResultsBoard({ nodes }: KeyResultsBoardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-2xl border border-border-subtle bg-surface-elevated p-6"
    >
      <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold">
        <Icon name="Flag" size="md" className="text-primary" />
        关键结果看板
      </h2>

      <div className="relative">
        <div className="absolute inset-y-3 left-[19px] w-0.5 bg-primary opacity-30" />
        <div className="space-y-4">
          {nodes.map((node, index) => {
            const status = statusConfig[node.status];
            const isFinal = index === nodes.length - 1;

            return (
              <motion.div
                key={`${node.time}-${node.title}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.08 }}
                className={`relative flex items-start gap-4 rounded-xl border p-4 pl-12 ${isFinal ? 'bg-primary/5 border-primary/30' : 'border-border-subtle bg-surface-elevated'}`}
              >
                <div
                  className={`absolute left-3 top-4 size-4 rounded-full ${status.dot} z-10 ring-4 ring-surface`}
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-text-tertiary">{node.time}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${status.bg} ${status.text} border ${status.border}`}
                    >
                      <Icon name={status.icon} size="xs" className="size-3" />
                      {status.label}
                    </span>
                  </div>
                  <h3 className="mb-1 font-bold text-text-secondary">{node.title}</h3>
                  <p className="mb-2 text-sm text-text-secondary">{node.result}</p>
                  {node.fallbackSignal && (
                    <p className="flex items-start gap-1 text-xs text-text-muted">
                      <Icon
                        name="AlertTriangle"
                        size="xs"
                        className="mt-0.5 shrink-0 text-warning"
                      />
                      {node.fallbackSignal}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
