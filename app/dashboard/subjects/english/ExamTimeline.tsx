'use client';

import { motion } from 'framer-motion';
import { Award, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { examTimeline } from '@/lib/subjects/english';

export default function ExamTimeline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl glass p-6 border border-border-subtle"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
          <Award className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display">证书考试时间轴</h2>
          <p className="text-sm text-text-tertiary">KET → PET → 小托福，关键节点与报名提醒</p>
        </div>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-4 bottom-4 w-px bg-gradient-to-b from-amber-500/50 via-orange-500/30 to-transparent" />

        <div className="space-y-4">
          {examTimeline.map((exam, index) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + index * 0.1 }}
              className="relative pl-14"
            >
              {/* Node */}
              <div
                className="absolute left-0 top-1 w-10 h-10 rounded-full border-2 flex items-center justify-center"
                style={{
                  borderColor: '#f59e0b',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)',
                }}
              >
                <span className="text-xs font-bold text-amber-400">{index + 1}</span>
              </div>

              {/* Card */}
              <div className="rounded-xl bg-surface-elevated border border-border-subtle p-4 hover:bg-surface-elevated transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-text-secondary flex items-center gap-2">
                      {exam.name}
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-xs border border-amber-500/20">
                        目标 {exam.target}
                      </span>
                    </h3>
                    <p className="text-sm text-text-tertiary mt-0.5">{exam.month} · {exam.date}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Calendar className="w-3.5 h-3.5" />
                    报名截止：{exam.registerBefore}
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-lg bg-warning/5 border border-warning/10 p-3">
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
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
