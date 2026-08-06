'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { CalendarCheck, Clock, CheckCircle2, Circle, AlertCircle, Flag } from 'lucide-react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import { gradeLabel } from '@/lib/children';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';

const milestones = [
  {
    grade: '一升二',
    period: '当前',
    tasks: [
      { name: '建立学习习惯，每日阅读 30 分钟', status: 'completed' },
      { name: '完成一年级期末成绩记录', status: 'completed' },
      { name: '确定三年级奥数学习形式', status: 'in_progress' },
      { name: '评估英语启蒙基础，制定 KET 长期计划', status: 'pending' },
    ],
  },
  {
    grade: '二年级',
    period: '2025.9 - 2026.6',
    tasks: [
      { name: 'RAZ 爬坡（quiz 正确率 80%+）+ OD1 系统学习', status: 'pending' },
      { name: '培养数学逻辑思维', status: 'pending' },
      { name: '参加 1-2 项综合素质活动', status: 'pending' },
    ],
  },
  {
    grade: '三年级',
    period: '2026.9 - 2027.6',
    tasks: [
      { name: '启动奥数系统学习', status: 'pending' },
      { name: '三年级寒假冲 KET 卓越 140+', status: 'pending' },
      { name: '语文阅读和写作能力强化', status: 'pending' },
    ],
  },
];

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; bg: string; label: string }> = {
  completed: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: '已完成' },
  in_progress: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: '进行中' },
  pending: { icon: Circle, color: 'text-text-tertiary', bg: 'bg-surface-hover', label: '待开始' },
};

export default function MilestonesPage() {
  const { currentChild } = useChildren();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="space-y-8">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Flag className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display">
              {currentChild ? `${currentChild.name}的里程碑任务` : '里程碑任务'}
            </h1>
          </div>
        </div>
      </motion.div>

      {!currentChild && (
        <ChildEmptyState description="添加孩子后，系统会根据年级展示对应的里程碑任务" />
      )}

      <div className="space-y-6">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.grade}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="rounded-2xl bg-surface-elevated p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center">
                <CalendarCheck className="w-6 h-6 text-text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display">{milestone.grade}</h2>
                <p className="text-sm text-text-tertiary">{milestone.period}</p>
              </div>
              {milestone.period === '当前' && (
                <span className="ml-auto px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/30">
                  当前阶段
                </span>
              )}
            </div>

            <div className="space-y-3">
              {milestone.tasks.map((task) => {
                const config = statusConfig[task.status];
                return (
                  <div
                    key={task.name}
                    className="flex items-center justify-between p-4 rounded-lg bg-surface-hover hover:bg-surface-hover transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}>
                        <config.icon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <span className="text-text-secondary group-hover:text-text-primary transition-colors">{task.name}</span>
                    </div>
                    <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-2xl bg-surface-elevated p-6 border border-warning/20 bg-warning/5"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-warning mb-1">三年级是关键窗口期</h3>
            <p className="text-sm text-text-tertiary">
              三公路线通常需要三年级开始系统奥数和英语拓展。当前一升二阶段重点是打好基础、确定方向。
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
