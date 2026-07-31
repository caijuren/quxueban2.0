'use client';

import { motion } from 'framer-motion';
import { Calculator, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';
import { gradeLabel } from '@/lib/children';
import { getMathStatusByGrade, getMathPlanByGrade } from '@/lib/subjects/math';
import MathTrackMap from './MathTrackMap';
import SubjectCheckIn from '../SubjectCheckIn';
import AIDiagnosisCard from '../AIDiagnosisCard';
import MathPhaseCard from './MathPhaseCard';
import MathTodayTasks from './MathTodayTasks';
import MathExamTimeline from './MathExamTimeline';

export default function MathSubjectPage() {
  const { currentChild } = useChildren();

  if (!currentChild) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold font-display">数学学科路径</h1>
        <ChildEmptyState description="添加孩子后，系统会根据年级生成数学学科路径与打卡任务" />
      </div>
    );
  }

  const grade = currentChild.grade;
  const status = getMathStatusByGrade(grade);
  const mathPlan = getMathPlanByGrade(grade);
  const checkInTasks = mathPlan.weeklyTemplate.map((t) => ({
    id: t.day,
    label: `${t.day} · ${t.focus}`,
    duration: t.duration,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回总览
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display">数学学科路径</h1>
              <p className="text-sm text-slate-400">
                {currentChild ? `${currentChild.name} · ${gradeLabel(grade, currentChild.educationSystem)} · 从当前到三公录取的数学能力规划地图` : '从当前到三公录取的数学能力规划地图'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Check-in + AI diagnosis */}
      {currentChild && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SubjectCheckIn
              childId={currentChild.id}
              subject="math"
              tasks={checkInTasks}
              title="数学今日打卡"
              subtitle="完成每日任务，稳步冲 AMC8"
            />
          </div>
          <div className="lg:col-span-1">
            <AIDiagnosisCard subject="math" childName={currentChild.name} />
          </div>
        </div>
      )}

      {/* Today tasks */}
      <MathTodayTasks grade={grade} />

      {/* Track map */}
      <MathTrackMap />

      {/* Current phase */}
      <MathPhaseCard grade={grade} />

      {/* Exam timeline */}
      <MathExamTimeline />

      {/* Link to overall plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/20 p-4"
      >
        <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-slate-200 mb-1">本路径服务于三公冲刺路线的 AMC8 硬通货</p>
          <p className="text-sm text-slate-400">
            数学学科路径是小升初方案中「三公冲刺型」路线的核心竞赛支撑。最终目标：三年级袋鼠银奖，四年级澳洲 AMC Distinction，五年级 AMC8 20+。
            <Link href="/dashboard/plan" className="text-primary hover:underline ml-1">
              查看完整小升初方案 →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
