'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles, Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import { useAiDiagnosis } from '@/lib/hooks/useAiDiagnosis';
import { cn } from '@/lib/utils';

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

function scoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-rose-400';
}

function scoreBg(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-rose-500';
}

export default function AIDiagnosisCard({
  subject,
  childId,
  childName = '孩子',
}: AIDiagnosisCardProps) {
  const { data: diagnosis, isLoading, error } = useAiDiagnosis(childId);

  const subjectHealth = diagnosis?.subjectHealth.find(
    (s) => s.subject === subjectLabels[subject]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl relative overflow-hidden border border-border-subtle"
      style={{
        background:
          'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 100%)',
      }}
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-secondary/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="w-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-violet-400 flex items-center justify-center">
                <Brain className="w-5 h-5 text-text-primary" />
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
              基于 {childName} 的整体升学进度、路线匹配度和学科节奏，AI
              给出该学科的长期学习调整建议。
            </p>

            {!childId || isLoading ? (
              <div className="flex items-center gap-2 text-sm text-text-tertiary py-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                正在分析 {subjectLabels[subject]} 学科整体进度…
              </div>
            ) : error ? (
              <div className="flex items-start gap-2 text-sm text-error py-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>诊断失败：{error.message}</span>
              </div>
            ) : !diagnosis ? null : (
              <div className="space-y-4">
                {diagnosis.overallScore > 0 && (
                  <div className="flex items-center gap-4 rounded-xl bg-surface-elevated/60 border border-border-subtle p-4">
                    <div className="text-center min-w-[72px]">
                      <div
                        className={cn(
                          'text-3xl font-bold font-display',
                          scoreColor(diagnosis.overallScore)
                        )}
                      >
                        {diagnosis.overallScore}
                      </div>
                      <div className="text-[11px] text-text-muted mt-0.5">
                        综合评分
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {diagnosis.summary}
                      </p>
                    </div>
                  </div>
                )}

                {subjectHealth && (
                  <div className="rounded-xl bg-surface-elevated/60 border border-border-subtle p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text-secondary">
                        {subjectHealth.subject}健康度
                      </span>
                      <span
                        className={cn(
                          'text-lg font-bold font-display',
                          scoreColor(subjectHealth.score)
                        )}
                      >
                        {subjectHealth.score}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-surface-highlight overflow-hidden mb-2">
                      <div
                        className={cn('h-full rounded-full', scoreBg(subjectHealth.score))}
                        style={{ width: `${subjectHealth.score}%` }}
                      />
                    </div>
                    <p className="text-sm text-text-tertiary">
                      {subjectHealth.comment}
                    </p>
                  </div>
                )}

                {diagnosis.risks && diagnosis.risks.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium text-text-muted flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      重点关注
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {diagnosis.risks.slice(0, 3).map((risk) => (
                        <span
                          key={risk.title}
                          className={cn(
                            'px-3 py-1.5 rounded-lg border text-xs font-medium',
                            risk.level === 'high'
                              ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                              : risk.level === 'medium'
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          )}
                        >
                          {risk.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {diagnosis.suggestions && diagnosis.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium text-text-muted">AI 建议</h3>
                    <ul className="space-y-2">
                      {diagnosis.suggestions
                        .filter(
                          (s) =>
                            s.title.includes(subjectLabels[subject]) ||
                            s.description.includes(subjectLabels[subject]) ||
                            s.priority === 'must'
                        )
                        .slice(0, 3)
                        .map((s) => (
                          <li
                            key={s.title}
                            className="flex items-start gap-2 text-sm text-text-secondary"
                          >
                            <span
                              className={cn(
                                'mt-1 w-1.5 h-1.5 rounded-full shrink-0',
                                s.priority === 'must'
                                  ? 'bg-rose-400'
                                  : s.priority === 'should'
                                    ? 'bg-amber-400'
                                    : 'bg-emerald-400'
                              )}
                            />
                            <span>
                              <span className="font-medium">{s.title}</span>
                              <span className="text-text-tertiary">
                                {' '}
                                · {s.description}
                              </span>
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
