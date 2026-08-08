'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import Link from 'next/link';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';
import { gradeLabel } from '@/lib/children';
import { useSubjectPlan } from '@/lib/hooks/useSubjectPlan';
import { getEnglishStatusByGrade, getEnglishPlanByGrade } from '@/lib/subjects/english';
import SubjectTrackMap from '@/components/subjects/SubjectTrackMap';
import SubjectExamTimeline from '@/components/subjects/SubjectExamTimeline';
import SubjectCheckIn from '../SubjectCheckIn';
import AIDiagnosisCard from '../AIDiagnosisCard';
import CurrentPhaseCard from './CurrentPhaseCard';
import TodayTasks from './TodayTasks';
import OD1Schedule from './OD1Schedule';
import ResourceList from './ResourceList';
import SpeakWritePlan from './SpeakWritePlan';
import LexileReference from './LexileReference';

export default function EnglishSubjectPage() {
  const { currentChild } = useChildren();
  const shouldReduceMotion = useReducedMotion();
  const { data: config, isLoading, error: queryError } = useSubjectPlan('english');

  if (!currentChild) {
    return (
      <div className="space-y-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="bg-secondary/10 border-secondary/20 flex size-10 items-center justify-center rounded-xl border">
              <Icon name="BookOpen" size="md" className="text-secondary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold sm:text-3xl">英语学科路径</h1>
            </div>
          </div>
        </motion.div>
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
      <Link
        href="/dashboard"
        className="mb-2 inline-flex items-center gap-1 text-sm text-text-tertiary transition-colors hover:text-primary"
      >
        <Icon name="ArrowLeft" size="sm" />
        返回总览
      </Link>

      {/* Header */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="bg-secondary/10 border-secondary/20 flex size-10 items-center justify-center rounded-xl border">
            <Icon name="BookOpen" size="md" className="text-secondary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">英语学科路径</h1>
            <p className="mt-0.5 text-sm text-text-tertiary">
              {currentChild.name} · {gradeLabel(currentChild.grade)}
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/subjects/english/config"
          className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-elevated px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
        >
          <Icon name="Settings" size="sm" />
          编辑规划
        </Link>
      </motion.div>

      {/* Check-in + AI diagnosis */}
      {currentChild && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
            <AIDiagnosisCard
              subject="english"
              childId={currentChild.id}
              childName={currentChild.name}
            />
          </div>
        </div>
      )}

      {/* Today tasks */}
      <TodayTasks grade={grade} />

      {isLoading && (
        <div className="flex h-[40vh] items-center justify-center">
          <Icon name="Loader2" size="xl" animate="spin" className="text-primary" />
        </div>
      )}

      {queryError && (
        <div className="border-error/20 bg-error/10 rounded-2xl border p-6 text-error">
          {queryError instanceof Error ? queryError.message : '加载失败'}
        </div>
      )}

      {config && (
        <>
          {/* Track map */}
          <SubjectTrackMap
            config={config}
            title="英语三条线规划地图"
            subtitle="从现在到三公，三条主线并行推进"
            currentGrade={grade}
          />

          {/* Current phase */}
          <CurrentPhaseCard grade={grade} />

          {/* Speak & write weak skills plan */}
          <SpeakWritePlan grade={grade} />

          {/* OD1 schedule - only for grade 2 */}
          {grade === 2 && <OD1Schedule currentUnit={status.odUnit} />}

          {/* Exam timeline + Lexile reference */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <SubjectExamTimeline
              config={config}
              title="证书考试时间轴"
              subtitle="KET → PET → 小托福，关键节点与报名提醒"
            />
            <LexileReference />
          </div>
        </>
      )}

      {/* Resources & checkpoints */}
      <ResourceList />

      {/* Link to overall plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-primary/5 border-primary/20 flex items-start gap-3 rounded-xl border p-4"
      >
        <Icon name="AlertCircle" size="md" className="mt-0.5 shrink-0 text-primary" />
        <div>
          <p className="mb-1 font-medium text-text-secondary">本路径服务于三公冲刺路线</p>
          <p className="text-sm text-text-tertiary">
            英语学科路径是小升初方案中「三公冲刺型」路线的底层能力支撑。最终目标：三年级寒假 KET
            卓越 140+，四年级寒假 PET 卓越 160+，五年级上小托福 850+。
            <Link href="/dashboard/plan" className="ml-1 text-primary hover:underline">
              查看完整小升初方案 →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
