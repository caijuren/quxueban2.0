'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import Link from 'next/link';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';
import { gradeLabel } from '@/lib/children';
import { useSubjectPlan } from '@/lib/hooks/useSubjectPlan';
import ChineseTrackMap from './ChineseTrackMap';
import ChineseYearlyMatrix from './ChineseYearlyMatrix';
import ChineseExamTimeline from './ChineseExamTimeline';
import AIDiagnosisCard from '../AIDiagnosisCard';

export default function ChineseSubjectPage() {
  const { currentChild } = useChildren();
  const shouldReduceMotion = useReducedMotion();
  const { data: config, isLoading, error: queryError } = useSubjectPlan('chinese');

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
              <h1 className="font-display text-2xl font-bold sm:text-3xl">语文学科路径</h1>
            </div>
          </div>
        </motion.div>
        <ChildEmptyState description="添加孩子后，系统会根据年级生成语文学科路径" />
      </div>
    );
  }

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
            <h1 className="font-display text-2xl font-bold sm:text-3xl">语文学科路径</h1>
            <p className="mt-0.5 text-sm text-text-tertiary">
              {currentChild.name} · {gradeLabel(currentChild.grade)}
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/subjects/chinese/config"
          className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-elevated px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
        >
          <Icon name="Settings" size="sm" />
          编辑规划
        </Link>
      </motion.div>

      {currentChild && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <AIDiagnosisCard
              subject="chinese"
              childId={currentChild.id}
              childName={currentChild.name}
            />
          </div>
        </div>
      )}

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
        <div className="space-y-8">
          {/* Link to overall plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-primary/5 border-primary/20 flex items-start gap-3 rounded-xl border p-4"
          >
            <Icon name="AlertCircle" size="md" className="mt-0.5 shrink-0 text-primary" />
            <div>
              <p className="mb-1 font-medium text-text-secondary">
                本路径服务于三公冲刺路线的语文素养与综合荣誉
              </p>
              <p className="text-sm leading-relaxed text-text-tertiary">
                语文学科路径是小升初方案中「三公冲刺型」路线的人文素养与面谈表达支撑。核心目标：古诗文积累
                120 首+、汉字小达人/古诗文大会荣誉、流畅自信的面谈表达。
              </p>
              <Link
                href="/dashboard/plan"
                className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                查看完整小升初方案 →
              </Link>
            </div>
          </motion.div>

          {/* Track map */}
          <ChineseTrackMap config={config} currentGrade={currentChild.grade} />

          {/* Key achievement matrix */}
          <ChineseYearlyMatrix config={config} currentGrade={currentChild.grade} />

          {/* Exam timeline */}
          <ChineseExamTimeline config={config} />
        </div>
      )}
    </div>
  );
}
