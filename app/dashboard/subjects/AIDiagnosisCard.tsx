'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles, Zap, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useWeeklyPlans } from '@/lib/hooks/useWeeklyPlans';
import { useAssessTasks } from '@/lib/hooks/useTaskAssessment';
import TaskRationalityPanel from '@/components/ai/TaskRationalityPanel';
import { AssessmentTaskInput } from '@/lib/ai/taskAssessment';
import { WeeklyTaskItem } from '@/lib/storage.types';

interface AIDiagnosisCardProps {
  subject: 'english' | 'math' | 'chinese';
  childId?: string;
  childName?: string;
}

const subjectLabels: Record<string, string> = {
  english: '英语',
  math: '数学',
  chinese: '语文',
};

const insights: Record<string, string[]> = {
  english: ['RAZ 当前级别与目标差距', 'KET/PET/小托福备考节奏', '口语/书写弱项提升建议'],
  math: ['奥数进度与 AMC8 目标匹配度', '计算速度与准确率分析', '竞赛时间规划建议'],
  chinese: ['古诗文积累进度评估', '输出能力训练重点', '竞赛荣誉规划建议'],
};

function toAssessmentInput(task: WeeklyTaskItem): AssessmentTaskInput {
  return {
    title: task.focus,
    category: task.category,
    difficulty: null,
    duration: task.duration,
  };
}

export default function AIDiagnosisCard({ subject, childId, childName = '孩子' }: AIDiagnosisCardProps) {
  const { data: plans, isLoading: plansLoading } = useWeeklyPlans(childId);
  const { mutate: assess, data: assessments, isPending, error } = useAssessTasks();

  const subjectTasks = useMemo(() => {
    if (!plans || plans.length === 0) return [];
    const latest = plans.reduce((a, b) => (a.weekId > b.weekId ? a : b));
    return latest.tasks.filter((t) => t.subjectId === subject);
  }, [plans, subject]);

  useEffect(() => {
    if (!childId || subjectTasks.length === 0) return;
    const tasks = subjectTasks.map(toAssessmentInput);
    assess({ childId, tasks, context: {} });
  }, [childId, subjectTasks, assess]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl relative overflow-hidden border border-border-subtle"
      style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)',
      }}
    >
      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="w-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-violet-400 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="px-2 py-0.5 rounded-md bg-secondary/10 text-secondary text-xs border border-secondary/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI 智能诊断
              </div>
            </div>
            <h2 className="text-xl font-bold font-display mb-2">
              {subjectLabels[subject]}学科 AI 诊断
            </h2>
            <p className="text-sm text-text-tertiary mb-4">
              基于 {childName} 的当前进度、打卡记录和弱项，AI 将给出个性化的学习调整建议。
            </p>

            {!childId || plansLoading || isPending ? (
              <div className="flex items-center gap-2 text-sm text-text-tertiary py-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                正在分析 {subjectLabels[subject]} 任务合理性…
              </div>
            ) : error ? (
              <div className="flex items-start gap-2 text-sm text-error py-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>诊断失败：{error.message}</span>
              </div>
            ) : subjectTasks.length === 0 ? (
              <div className="text-sm text-text-tertiary py-2">
                当前周计划暂无{subjectLabels[subject]}任务，发布计划后将自动生成诊断。
              </div>
            ) : assessments && assessments.length > 0 ? (
              <div className="mt-2">
                <TaskRationalityPanel
                  assessments={assessments}
                  taskTitles={subjectTasks.map((t) => t.focus)}
                  compact
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mb-5">
                {insights[subject].map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-lg bg-surface-elevated border border-border-subtle text-xs text-text-secondary flex items-center gap-1.5"
                  >
                    <Zap className="w-3 h-3 text-warning" />
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
