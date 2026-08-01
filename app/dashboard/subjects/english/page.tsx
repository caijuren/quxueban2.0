'use client';

import { motion } from 'framer-motion';
import { Languages, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';
import { gradeLabel } from '@/lib/children';
import { getEnglishStatusByGrade, getEnglishPlanByGrade } from '@/lib/subjects/english';
import EnglishTrackMap from './EnglishTrackMap';
import SubjectCheckIn from '../SubjectCheckIn';
import AIDiagnosisCard from '../AIDiagnosisCard';
import CurrentPhaseCard from './CurrentPhaseCard';
import TodayTasks from './TodayTasks';
import OD1Schedule from './OD1Schedule';
import ResourceList from './ResourceList';
import SpeakWritePlan from './SpeakWritePlan';
import ExamTimeline from './ExamTimeline';
import LexileReference from './LexileReference';

export default function EnglishSubjectPage() {
  const { currentChild } = useChildren();

  if (!currentChild) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold font-display">英语学科路径</h1>
        <ChildEmptyState description="添加孩子后，系统会根据年级生成英语学科路径与打卡任务" />
      </div>
    );
  }

  const grade = currentChild.grade;
  const status = getEnglishStatusByGrade(grade);
  const englishPlan = getEnglishPlanByGrade(grade);
  const checkInTasks = englishPlan.weeklyTemplate.map((t) => ({
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
            className="inline-flex items-center gap-1 text-sm text-text-tertiary hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回总览
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-violet-400 flex items-center justify-center">
              <Languages className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display">英语学科路径</h1>
              <p className="text-sm text-text-tertiary">
                {currentChild ? `${currentChild.name} · ${gradeLabel(grade, currentChild.educationSystem)} · 从当前到三公录取的英语能力规划地图` : '从当前到三公录取的英语能力规划地图'}
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
              subject="english"
              tasks={checkInTasks}
              title="英语今日打卡"
              subtitle="完成每日任务，积小胜为大胜"
            />
          </div>
          <div className="lg:col-span-1">
            <AIDiagnosisCard subject="english" childName={currentChild.name} />
          </div>
        </div>
      )}

      {/* Today tasks */}
      <TodayTasks grade={grade} />

      {/* Track map */}
      <EnglishTrackMap />

      {/* Current phase */}
      <CurrentPhaseCard grade={grade} />

      {/* Speak & write weak skills plan */}
      <SpeakWritePlan grade={grade} />

      {/* OD1 schedule - only for grade 2 */}
      {grade === 2 && <OD1Schedule currentUnit={status.odUnit} />}

      {/* Exam timeline + Lexile reference */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ExamTimeline />
        <LexileReference />
      </div>

      {/* Resources & checkpoints */}
      <ResourceList />

      {/* Link to overall plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/20 p-4"
      >
        <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-text-secondary mb-1">本路径服务于三公冲刺路线</p>
          <p className="text-sm text-text-tertiary">
            英语学科路径是小升初方案中「三公冲刺型」路线的底层能力支撑。最终目标：三年级寒假 KET 卓越 140+，四年级寒假 PET 卓越 160+，五年级上小托福 850+。
            <Link href="/dashboard/plan" className="text-primary hover:underline ml-1">
              查看完整小升初方案 →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
