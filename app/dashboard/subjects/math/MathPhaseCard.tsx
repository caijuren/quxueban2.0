'use client';

import { motion } from 'framer-motion';
import { Target, Clock, TrendingUp, AlertCircle, Calculator, Award } from 'lucide-react';
import { getMathPlanByGrade, getMathStatusByGrade } from '@/lib/subjects/math';

export default function MathPhaseCard({ grade }: { grade: number }) {
  const plan = getMathPlanByGrade(grade);
  const status = getMathStatusByGrade(grade);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl glass p-6 border border-white/5"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-display">当前阶段：{plan.grade}</h2>
          <p className="text-sm text-slate-400">{plan.period}</p>
        </div>
      </div>

      {/* Status overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl bg-white/5 p-4 border border-white/5">
          <p className="text-xs text-slate-500 mb-1">当前专题</p>
          <p className="text-lg font-bold text-slate-200">
            {status.currentTopic}
          </p>
        </div>

        <div className="rounded-xl bg-white/5 p-4 border border-white/5">
          <p className="text-xs text-slate-500 mb-1">每日数学</p>
          <p className="text-2xl font-bold text-slate-200">{status.dailyMathTime}</p>
          <p className="text-xs text-slate-500 mt-1">含校内 + 奥数</p>
        </div>

        <div className="rounded-xl bg-white/5 p-4 border border-white/5">
          <p className="text-xs text-slate-500 mb-1">弱项</p>
          <p className="text-lg font-bold text-warning">{status.weakSkills.slice(0, 2).join('、')}</p>
          <p className="text-xs text-slate-500 mt-1">重点补强</p>
        </div>

        <div className="rounded-xl bg-white/5 p-4 border border-white/5">
          <p className="text-xs text-slate-500 mb-1">下一场考试</p>
          <p className="text-lg font-bold text-slate-200">{status.nextExam}</p>
          <p className="text-xs text-slate-500 mt-1">{status.nextExamDate}</p>
        </div>
      </div>

      {/* Targets */}
      <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 mb-6">
        <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-secondary" />
          阶段目标
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plan.targets.map((target) => (
            <div key={target.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-sm text-slate-400">{target.label}</span>
              <div className="text-right">
                <span className="text-xs text-slate-500 line-through">{target.current}</span>
                <span className="text-sm text-slate-200 ml-2">{target.target}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly template */}
      <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
        <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent" />
          每周计划模板
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-2">
          {plan.weeklyTemplate.map((task) => (
            <div
              key={task.day}
              className="rounded-lg bg-white/5 border border-white/5 p-3 hover:bg-white/[0.07] transition-colors"
            >
              <p className="text-xs text-primary font-medium mb-1">{task.day}</p>
              <p className="text-sm font-medium text-slate-200 mb-2">{task.focus}</p>
              <p className="text-xs text-slate-500 mb-2">{task.duration}</p>
              <div className="space-y-1">
                {task.materials.map((material) => (
                  <p key={material} className="text-[10px] text-slate-400">
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
            <p className="font-medium text-slate-200 mb-1">{status.weakSkills.slice(0, 2).join('、')}是当前弱项</p>
            <p className="text-sm text-slate-400">
              通过「错题本 + 专项练习」针对性突破，保持每周至少一次限时训练提升速度。
              不要跳过校内作业，校内成绩是竞赛的基础。
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
