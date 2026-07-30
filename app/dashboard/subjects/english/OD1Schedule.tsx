'use client';

import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Circle } from 'lucide-react';
import { od1Schedule } from '@/lib/subjects/english';

export default function OD1Schedule({ currentUnit = 7 }: { currentUnit?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl glass p-6 border border-white/5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-violet-400 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display">OD1 Unit 7-18 进度表</h2>
          <p className="text-sm text-slate-600">从现在到 2026.01，OD1 收尾的详细执行节奏</p>
        </div>
      </div>

      <div className="rounded-xl bg-black/[0.03] border border-white/5 p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">当前进度</span>
          <span className="text-sm font-bold text-primary">
            第 {currentUnit - 6} / 12 周 · Unit {currentUnit}/18
          </span>
        </div>
        <div className="h-2 rounded-full bg-black/10 overflow-hidden">
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
                  ? 'bg-black/[0.05] border-primary/30'
                  : isPast
                  ? 'bg-black/[0.02] border-white/5 opacity-50'
                  : 'bg-black/[0.02] border-white/5'
              }`}
            >
              {isCurrent && (
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full bg-gradient-to-b from-primary to-secondary" />
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 sm:w-32 shrink-0">
                  {isPast ? (
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full border-2 border-primary shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600 shrink-0" />
                  )}
                  <div>
                    <p className={`font-bold ${isCurrent ? 'text-primary' : 'text-slate-700'}`}>
                      Unit {item.unit}
                    </p>
                    <p className="text-xs text-slate-600">{item.weeks}</p>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-sm text-slate-700 font-medium mb-1">
                    {item.bigQuestion}
                  </p>
                  <p className="text-xs text-slate-600 mb-2">
                    主题：{item.theme} · 重点：{item.focus}
                  </p>
                  <div className="flex items-start gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-warning mt-1.5 shrink-0" />
                    <p className="text-xs text-slate-600">{item.checkpoint}</p>
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
