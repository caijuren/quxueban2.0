'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import Link from 'next/link';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';
import { gradeLabel } from '@/lib/children';
import { useSubjectPlan } from '@/lib/hooks/useSubjectPlan';
import { getMathStatusByGrade, getMathPlanByGrade } from '@/lib/subjects/math';
import SubjectTrackMap from '@/components/subjects/SubjectTrackMap';
import SubjectExamTimeline from '@/components/subjects/SubjectExamTimeline';
import SubjectCheckIn from '../SubjectCheckIn';
import AIDiagnosisCard from '../AIDiagnosisCard';
import MathPhaseCard from './MathPhaseCard';
import MathTodayTasks from './MathTodayTasks';
import Alert from '@/components/ui/alert';

export default function MathSubjectPage() {
  const { currentChild } = useChildren();
  const shouldReduceMotion = useReducedMotion();
  const { data: config, isLoading, error: queryError } = useSubjectPlan('math');

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
              <Icon name="Calculator" size="md" className="text-secondary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold sm:text-3xl">数学学科路径</h1>
            </div>
          </div>
        </motion.div>
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
            <Icon name="Calculator" size="md" className="text-secondary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">数学学科路径</h1>
            <p className="mt-0.5 text-sm text-text-tertiary">
              {currentChild.name} · {gradeLabel(currentChild.grade)}
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/subjects/math/config"
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
              subject="math"
              tasks={checkInTasks}
              title="数学今日打卡"
              subtitle="完成每日任务，稳步冲 AMC8"
            />
          </div>
          <div className="lg:col-span-1">
            <AIDiagnosisCard
              subject="math"
              childId={currentChild.id}
              childName={currentChild.name}
            />
          </div>
        </div>
      )}

      {/* Today tasks */}
      <MathTodayTasks grade={grade} />

      {isLoading && (
        <div className="flex h-[40vh] items-center justify-center">
          <Icon name="Loader2" size="xl" animate="spin" className="text-primary" />
        </div>
      )}

      {queryError && (
        <Alert
          type="error"
          title="加载失败"
          description={queryError instanceof Error ? queryError.message : '无法加载数学学科规划'}
        />
      )}

      {config && (
        <>
          {/* Track map */}
          <SubjectTrackMap
            config={config}
            title="数学三条线规划地图"
            subtitle="从现在到三公，三条主线并行推进"
            currentGrade={grade}
          />

          {/* Current phase */}
          <MathPhaseCard grade={grade} />

          {/* Exam timeline */}
          <SubjectExamTimeline
            config={config}
            title="竞赛证书考试时间轴"
            subtitle="袋鼠 → 澳洲 AMC → AMC8，关键节点与报名提醒"
          />
        </>
      )}

      {/* Link to overall plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-primary/5 border-primary/20 flex items-start gap-3 rounded-xl border p-4"
      >
        <Icon name="AlertCircle" size="md" className="mt-0.5 shrink-0 text-primary" />
        <div>
          <p className="mb-1 font-medium text-text-secondary">
            本路径服务于三公冲刺路线的 AMC8 硬通货
          </p>
          <p className="text-sm text-text-tertiary">
            数学学科路径是小升初方案中「三公冲刺型」路线的核心竞赛支撑。最终目标：三年级袋鼠银奖，四年级澳洲
            AMC Distinction，五年级 AMC8 20+。
            <Link href="/dashboard/plan" className="ml-1 text-primary hover:underline">
              查看完整小升初方案 →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
