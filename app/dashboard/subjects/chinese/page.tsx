'use client';

import { motion } from 'framer-motion';
import { ScrollText, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useChildren } from '@/components/dashboard/ChildrenContext';
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
  const grade = currentChild?.grade || 2;
  const chinesePlan = getChinesePlanByGrade(grade);
  const checkInTasks = chinesePlan.weeklyTemplate.map((t) => ({
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
            className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回仪表盘
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center">
              <ScrollText className="w-5 h-5 text-text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display">语文学科路径</h1>
              <p className="text-sm text-slate-600">
                {currentChild ? `${currentChild.name} · ${gradeLabel(grade)} · 从当前到三公录取的语文素养作战地图` : '从当前到三公录取的语文素养作战地图'}
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
          <p className="font-medium text-slate-800 mb-1">本路径服务于三公冲刺路线的语文素养与综合荣誉</p>
          <p className="text-sm text-slate-600">
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
