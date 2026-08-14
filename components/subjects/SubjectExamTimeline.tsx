'use client';
import { Icon } from '@/components/ui/icon';

import { motion } from 'framer-motion';

import { SubjectPlanConfig } from '@/lib/subjects/subjectPlan';

interface SubjectExamTimelineProps {
  config: SubjectPlanConfig;
  title?: string;
  subtitle?: string;
}

export default function SubjectExamTimeline({
  config,
  title = '荣誉考试时间轴',
  subtitle = '关键节点与报名提醒',
}: SubjectExamTimelineProps) {
  const exams = config.examTimeline || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-xl border border-border-subtle bg-surface-elevated p-6"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="to-warning/70 flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-warning">
          <Icon name="Award" size="md" className="text-text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold">{title}</h2>
          <p className="text-sm text-text-tertiary">{subtitle}</p>
        </div>
      </div>

      <div className="relative">
        <div className="from-warning/50 via-warning/30 absolute inset-y-4 left-5 w-px bg-gradient-to-b to-transparent" />

        <div className="space-y-4">
          {exams.map((exam, index) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + index * 0.1 }}
              className="relative pl-14"
            >
              <div className="bg-warning/10 absolute left-0 top-1 flex size-10 items-center justify-center rounded-full border-2 border-warning">
                <span className="text-xs font-bold text-warning">{index + 1}</span>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 transition-colors hover:bg-surface-elevated">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="flex items-center gap-2 font-bold text-text-secondary">
                      {exam.name}
                      {exam.target && (
                        <span className="bg-warning/10 border-warning/20 rounded-md border px-2 py-0.5 text-xs text-warning">
                          目标 {exam.target}
                        </span>
                      )}
                    </h3>
                    <p className="mt-0.5 text-sm text-text-tertiary">
                      {exam.month} {exam.date && `· ${exam.date}`}
                    </p>
                  </div>
                  {exam.registerBefore && (
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <Icon name="Calendar" size="xs" />
                      报名截止：{exam.registerBefore}
                    </div>
                  )}
                </div>

                {exam.notes && (
                  <div className="bg-warning/5 border-warning/10 flex items-start gap-2 rounded-lg border p-3">
                    <Icon name="AlertTriangle" size="sm" className="mt-0.5 shrink-0 text-warning" />
                    <p className="text-xs text-text-tertiary">{exam.notes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {exams.length === 0 && (
            <div className="rounded-xl border border-border-subtle bg-surface-elevated p-6 text-center text-sm text-text-muted">
              暂无赛事节点，请在配置页添加
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
