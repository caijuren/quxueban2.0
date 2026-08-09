'use client';

import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
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
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-warning';
  return 'text-error';
}

function scoreBg(score: number): string {
  if (score >= 80) return 'bg-success';
  if (score >= 60) return 'bg-warning';
  return 'bg-error';
}

export default function AIDiagnosisCard({
  subject,
  childId,
  childName = '孩子',
}: AIDiagnosisCardProps) {
  const { data: diagnosis, isLoading, error } = useAiDiagnosis(childId);

  const subjectHealth = diagnosis?.subjectHealth.find((s) => s.subject === subjectLabels[subject]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-border-subtle"
      style={{
        background:
          'linear-gradient(135deg, color-mix(in srgb, var(--color-secondary) 15%, transparent) 0%, color-mix(in srgb, var(--info) 8%, transparent) 100%)',
      }}
    >
      <div className="bg-secondary/20 absolute -right-20 -top-20 size-40 rounded-full blur-3xl" />
      <div className="bg-primary/10 absolute -bottom-20 -left-20 size-40 rounded-full blur-3xl" />

      <div className="relative p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="w-full">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-secondary-glow">
                <Icon name="Brain" size="md" className="text-text-primary" />
              </div>
              <div className="bg-secondary/10 border-secondary/20 flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs text-secondary">
                <Icon name="Sparkles" size="xs" animate="pulse" />
                AI 智能诊断
              </div>
            </div>
            <h2 className="mb-2 font-display text-xl font-bold">
              {subjectLabels[subject]}学科 AI 诊断
            </h2>
            <p className="mb-4 text-sm text-text-tertiary">
              基于 {childName} 的整体升学进度、路线匹配度和学科节奏，AI
              给出该学科的长期学习调整建议。
            </p>

            {!childId || isLoading ? (
              <div className="flex items-center gap-2 py-4 text-sm text-text-tertiary">
                <Icon name="Loader2" size="sm" animate="spin" />
                正在分析 {subjectLabels[subject]} 学科整体进度…
              </div>
            ) : error ? (
              <div className="flex items-start gap-2 py-2 text-sm text-error">
                <Icon name="AlertCircle" size="sm" className="mt-0.5 shrink-0" />
                <span>诊断失败：{error.message}</span>
              </div>
            ) : !diagnosis ? null : (
              <div className="space-y-4">
                {diagnosis.overallScore > 0 && (
                  <div className="bg-surface-elevated/60 flex items-center gap-4 rounded-xl border border-border-subtle p-4">
                    <div className="min-w-[72px] text-center">
                      <div
                        className={cn(
                          'font-display text-3xl font-bold',
                          scoreColor(diagnosis.overallScore)
                        )}
                      >
                        {diagnosis.overallScore}
                      </div>
                      <div className="mt-0.5 text-[11px] text-text-muted">综合评分</div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-relaxed text-text-secondary">
                        {diagnosis.summary}
                      </p>
                    </div>
                  </div>
                )}

                {subjectHealth && (
                  <div className="bg-surface-elevated/60 rounded-xl border border-border-subtle p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-text-secondary">
                        {subjectHealth.subject}健康度
                      </span>
                      <span
                        className={cn(
                          'font-display text-lg font-bold',
                          scoreColor(subjectHealth.score)
                        )}
                      >
                        {subjectHealth.score}
                      </span>
                    </div>
                    <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-highlight">
                      <div
                        className={cn('h-full rounded-full', scoreBg(subjectHealth.score))}
                        style={{ width: `${subjectHealth.score}%` }}
                      />
                    </div>
                    <p className="text-sm text-text-tertiary">{subjectHealth.comment}</p>
                  </div>
                )}

                {diagnosis.risks && diagnosis.risks.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
                      <Icon name="TrendingUp" size="xs" />
                      重点关注
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {diagnosis.risks.slice(0, 3).map((risk) => (
                        <span
                          key={risk.title}
                          className={cn(
                            'rounded-lg border px-3 py-1.5 text-xs font-medium',
                            risk.level === 'high'
                              ? 'bg-error/10 border-error/20 text-error'
                              : risk.level === 'medium'
                                ? 'bg-warning/10 border-warning/20 text-warning'
                                : 'bg-success/10 border-success/20 text-success'
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
                                'mt-1 h-1.5 w-1.5 shrink-0 rounded-full',
                                s.priority === 'must'
                                  ? 'bg-error'
                                  : s.priority === 'should'
                                    ? 'bg-warning'
                                    : 'bg-success'
                              )}
                            />
                            <span>
                              <span className="font-medium">{s.title}</span>
                              <span className="text-text-tertiary"> · {s.description}</span>
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
