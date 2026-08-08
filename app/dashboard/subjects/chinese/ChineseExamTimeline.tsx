'use client';

import { motion } from 'framer-motion';
import { Award, Calendar, AlertTriangle } from 'lucide-react';
import { SubjectPlanConfig } from '@/lib/subjects/subjectPlan';

interface ChineseExamTimelineProps {
  config: SubjectPlanConfig;
}

export default function ChineseExamTimeline({ config }: ChineseExamTimelineProps) {
  const events = config.examTimeline;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl border border-border-subtle bg-surface-elevated p-6"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="to-warning/70 flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-warning">
          <Award className="size-5 text-text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold">语文荣誉与赛事时间轴</h2>
          <p className="text-sm text-text-tertiary">
            汉字小达人 → 古诗文大会 → 综合荣誉整理，关键节点与提醒
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="from-warning/50 via-warning/30 absolute inset-y-4 left-5 w-px bg-gradient-to-b to-transparent" />

        <div className="space-y-4">
          {events.map((exam, index) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + index * 0.1 }}
              className="relative pl-14"
            >
              {/* Node */}
              <div className="bg-warning/10 absolute left-0 top-1 flex size-10 items-center justify-center rounded-full border-2 border-warning">
                <span className="text-xs font-bold text-warning">{index + 1}</span>
              </div>

              {/* Card */}
              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 transition-colors hover:bg-surface-elevated">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="flex items-center gap-2 font-bold text-text-secondary">
                      {exam.name}
                      <span className="bg-warning/10 border-warning/20 rounded-md border px-2 py-0.5 text-xs text-warning">
                        目标 {exam.target}
                      </span>
                    </h3>
                    <p className="mt-0.5 text-sm text-text-tertiary">
                      {exam.month} · {exam.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Calendar className="size-3.5" />
                    {exam.registerBefore}
                  </div>
                </div>

                <div className="bg-warning/5 border-warning/10 flex items-start gap-2 rounded-lg border p-3">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
                  <p className="text-xs text-text-tertiary">{exam.notes}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
