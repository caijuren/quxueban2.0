'use client';

import { motion } from 'framer-motion';
import { Flag, AlertTriangle, CheckCircle2, Clock, CircleDashed } from 'lucide-react';
import type { KeyResultNode } from '@/lib/plans';

interface KeyResultsBoardProps {
  nodes: KeyResultNode[];
}

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    label: '已完成',
    bg: 'bg-success/10',
    border: 'border-success/30',
    text: 'text-success',
    dot: 'bg-success',
  },
  'in-progress': {
    icon: Clock,
    label: '进行中',
    bg: 'bg-primary/10',
    border: 'border-primary/30',
    text: 'text-primary',
    dot: 'bg-primary',
  },
  pending: {
    icon: CircleDashed,
    label: '待开始',
    bg: 'bg-surface-highlight',
    border: 'border-border-subtle',
    text: 'text-text-secondary',
    dot: 'bg-text-muted',
  },
  'at-risk': {
    icon: AlertTriangle,
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
      className="rounded-2xl glass p-6 border border-border-subtle"
    >
      <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
        <Flag className="w-5 h-5 text-primary" />
        关键结果看板
      </h2>

      <div className="relative">
        <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent opacity-30" />
        <div className="space-y-4">
          {nodes.map((node, index) => {
            const status = statusConfig[node.status];
            const StatusIcon = status.icon;
            const isFinal = index === nodes.length - 1;

            return (
              <motion.div
                key={`${node.time}-${node.title}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.08 }}
                className={`relative flex items-start gap-4 pl-12 rounded-xl p-4 border ${isFinal ? 'bg-primary/5 border-primary/30' : 'bg-surface-light border-border-subtle'}`}
              >
                <div
                  className={`absolute left-3 top-4 w-4 h-4 rounded-full ${status.dot} ring-4 ring-surface z-10`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm text-text-secondary font-medium">{node.time}</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text} border ${status.border}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                  <h3 className="font-bold text-text-primary mb-1">{node.title}</h3>
                  <p className="text-sm text-text-secondary mb-2">{node.result}</p>
                  {node.fallbackSignal && (
                    <p className="text-xs text-text-secondary flex items-start gap-1">
                      <AlertTriangle className="w-3 h-3 text-warning shrink-0 mt-0.5" />
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
