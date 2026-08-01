'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ScrollText, ArrowLeft, AlertCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';
import { gradeLabel } from '@/lib/children';
import { getChineseStatusByGrade, getChinesePlanByGrade } from '@/lib/subjects/chinese';
import ChineseTrackMap from './ChineseTrackMap';
import SubjectCheckIn from '../SubjectCheckIn';
import AIDiagnosisCard from '../AIDiagnosisCard';
import ChinesePhaseCard from './ChinesePhaseCard';
import ChineseTodayTasks from './ChineseTodayTasks';
import ChineseExamTimeline from './ChineseExamTimeline';

export default function ChineseSubjectPage() {
  const { currentChild } = useChildren();
  const shouldReduceMotion = useReducedMotion();

  if (!currentChild) {
    return (
      <div className="space-y-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display">语文学科路径</h1>
            </div>
          </div>
        </motion.div>
        <ChildEmptyState description="添加孩子后，系统会根据年级生成语文学科路径与打卡任务" />
      </div>
    );
  }

  const grade = currentChild.grade;
  const chinesePlan = getChinesePlanByGrade(grade);
  const checkInTasks = chinesePlan.weeklyTemplate.map((t) => ({
    id: t.day,
    label: `${t.day} · ${t.focus}`,
    duration: t.duration,
  }));

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-text-tertiary hover:text-primary transition-colors mb-2"
      >
        <ArrowLeft className="w-4 h-4" />
        返回总览
      </Link>

      {/* Header */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display">语文学科路径</h1>
          </div>
        </div>
      </motion.div>

      {/* Check-in + AI diagnosis */}
      {currentChild && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SubjectCheckIn
              childId={currentChild.id}
              subject="chinese"
              tasks={checkInTasks}
              title="语文今日打卡"
              subtitle="完成每日任务，积淀人文素养"
            />
          </div>
          <div className="lg:col-span-1">
            <AIDiagnosisCard subject="chinese" childName={currentChild.name} />
          </div>
        </div>
      )}

      {/* Today tasks */}
      <ChineseTodayTasks grade={grade} />

      {/* Track map */}
      <ChineseTrackMap />

      {/* Current phase */}
      <ChinesePhaseCard grade={grade} />

      {/* Exam timeline */}
      <ChineseExamTimeline />

      {/* Link to overall plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/20 p-4"
      >
        <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-text-secondary mb-1">本路径服务于三公冲刺路线的语文素养与综合荣誉</p>
          <p className="text-sm text-text-tertiary">
            语文学科路径是小升初方案中「三公冲刺型」路线的人文素养与面谈表达支撑。核心目标：古诗文积累 120 首+、汉字小达人/古诗文大会荣誉、流畅自信的面谈表达。
            <Link href="/dashboard/plan" className="text-primary hover:underline ml-1">
              查看完整小升初方案 →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
