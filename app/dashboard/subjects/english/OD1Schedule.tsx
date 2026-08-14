'use client';

import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import { od1Schedule } from '@/lib/subjects/english';

export default function OD1Schedule({ currentUnit = 7 }: { currentUnit?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-xl border border-border-subtle bg-surface-elevated p-6"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-violet-400">
          <Icon name="BookOpen" size="md" className="text-text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold">OD1 Unit 7-18 进度表</h2>
          <p className="text-sm text-text-tertiary">从现在到 2026.01，OD1 收尾的详细执行节奏</p>
        </div>
      </div>

      <div className="mb-5 rounded-xl border border-border-subtle bg-surface-elevated p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-text-tertiary">当前进度</span>
          <span className="text-sm font-bold text-primary">
            第 {currentUnit - 6} / 12 周 · Unit {currentUnit}/18
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-highlight">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentUnit - 6) / 12) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-secondary to-violet-400"
          />
        </div>
      </div>

      <div className="space-y-3">
        {od1Schedule.map((item, index) => {
          const isCurrent = item.unit === currentUnit;
          const isPast = item.unit < currentUnit;
          const isFuture = item.unit > currentUnit;

          return (
            <motion.div
              key={item.unit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + index * 0.03 }}
              className={`relative rounded-xl border p-4 transition-all ${
                isCurrent
                  ? 'border-primary/30 bg-surface-elevated'
                  : isPast
                    ? 'border-border-subtle bg-surface-elevated opacity-50'
                    : 'border-border-subtle bg-surface-elevated'
              }`}
            >
              {isCurrent && (
                <div className="absolute -left-1 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex shrink-0 items-center gap-3 sm:w-32">
                  {isPast ? (
                    <Icon name="CheckCircle2" size="md" className="shrink-0 text-success" />
                  ) : isCurrent ? (
                    <div className="size-5 shrink-0 rounded-full border-2 border-primary" />
                  ) : (
                    <Icon name="Circle" size="md" className="shrink-0 text-text-muted" />
                  )}
                  <div>
                    <p
                      className={`font-bold ${isCurrent ? 'text-primary' : 'text-text-secondary'}`}
                    >
                      Unit {item.unit}
                    </p>
                    <p className="text-xs text-text-muted">{item.weeks}</p>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="mb-1 text-sm font-medium text-text-secondary">{item.bigQuestion}</p>
                  <p className="mb-2 text-xs text-text-muted">
                    主题：{item.theme} · 重点：{item.focus}
                  </p>
                  <div className="flex items-start gap-1.5">
                    <div className="mt-1.5 size-1 shrink-0 rounded-full bg-warning" />
                    <p className="text-xs text-text-tertiary">{item.checkpoint}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
