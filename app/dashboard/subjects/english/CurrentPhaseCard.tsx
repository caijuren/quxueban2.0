'use client';

import { motion } from 'framer-motion';
import { Target, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { getEnglishPlanByGrade, getEnglishStatusByGrade, getEnglishProgress } from '@/lib/subjects/english';

export default function CurrentPhaseCard({ grade }: { grade: number }) {
  const plan = getEnglishPlanByGrade(grade);
  const status = getEnglishStatusByGrade(grade);
  const progress = getEnglishProgress(status.odUnit, status.odTotal);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl glass p-6 border border-white/5"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Target className="w-5 h-5 text-text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display">当前阶段：{plan.grade}</h2>
          <p className="text-sm text-slate-600">{plan.period}</p>
        </div>
      </div>

      {/* Status overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl bg-black/5 p-4 border border-white/5">
          <p className="text-xs text-slate-600 mb-1">OD 进度</p>
          <p className="text-2xl font-bold text-slate-800">
            {status.odUnit}/{status.odTotal}
          </p>
          <div className="mt-2 h-1.5 rounded-full bg-black/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
              style={{ width: `${progress.odProgress}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl bg-black/5 p-4 border border-white/5">
          <p className="text-xs text-slate-600 mb-1">RAZ 级别</p>
          <p className="text-2xl font-bold text-slate-800">{status.razLevel}</p>
          <p className="text-xs text-slate-600 mt-1">目标：{plan.targets.find((t) => t.label.includes('RAZ'))?.target || '维持'}</p>
        </div>

        <div className="rounded-xl bg-black/5 p-4 border border-white/5">
          <p className="text-xs text-slate-600 mb-1">每日英语</p>
          <p className="text-2xl font-bold text-slate-800">{status.dailyEnglishTime}</p>
          <p className="text-xs text-slate-600 mt-1">含听说读写</p>
        </div>

        <div className="rounded-xl bg-black/5 p-4 border border-white/5">
          <p className="text-xs text-slate-600 mb-1">弱项</p>
          <p className="text-2xl font-bold text-warning">{status.weakSkills.slice(0, 2).join('、')}</p>
          <p className="text-xs text-slate-600 mt-1">重点补强</p>
        </div>
      </div>

      {/* Targets */}
      <div className="rounded-xl bg-black/[0.03] border border-white/5 p-4 mb-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-secondary" />
          阶段目标
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plan.targets.map((target) => (
            <div key={target.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-sm text-slate-600">{target.label}</span>
              <div className="text-right">
                <span className="text-xs text-slate-600 line-through">{target.current}</span>
                <span className="text-sm text-slate-800 ml-2">{target.target}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly template */}
      <div className="rounded-xl bg-black/[0.03] border border-white/5 p-4">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent" />
          每周任务模板
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-2">
          {plan.weeklyTemplate.map((task) => (
            <div
              key={task.day}
              className="rounded-lg bg-black/5 border border-white/5 p-3 hover:bg-white/[0.07] transition-colors"
            >
              <p className="text-xs text-primary font-medium mb-1">{task.day}</p>
              <p className="text-sm font-medium text-slate-800 mb-2">{task.focus}</p>
              <p className="text-xs text-slate-600 mb-2">{task.duration}</p>
              <div className="space-y-1">
                {task.materials.map((material) => (
                  <p key={material} className="text-[10px] text-slate-600">
                    {material}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak skills alert */}
      {plan.weakSkills && plan.weakSkills.length > 0 && (
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-warning/10 border border-warning/20 p-4">
          <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-slate-800 mb-1">{status.weakSkills.slice(0, 2).join('、')}是当前弱项</p>
            <p className="text-sm text-slate-600">
              通过「复述本 + 口袋领航」练说，通过「OD 配套练习册 + 每周小练笔」练写。
              不要跳过 OD 课程里的 Communicate 和 Writing 环节。
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
