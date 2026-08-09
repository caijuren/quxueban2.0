'use client';
import Button from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';

import { motion } from 'framer-motion';

import { useState } from 'react';
import { TaskRationalityAssessment, AssessmentVerdict } from '@/lib/ai/taskAssessment';

interface TaskRationalityPanelProps {
  assessments: TaskRationalityAssessment[];
  taskTitles?: string[];
  compact?: boolean;
}

const verdictConfig: Record<
  AssessmentVerdict,
  { label: string; color: string; bg: string; border: string; icon: IconName }
> = {
  good: {
    label: '匹配良好',
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
    icon: 'CheckCircle2',
  },
  caution: {
    label: '建议留意',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    icon: 'AlertTriangle',
  },
  risk: {
    label: '存在风险',
    color: 'text-error',
    bg: 'bg-error/10',
    border: 'border-error/20',
    icon: 'AlertTriangle',
  },
};

export default function TaskRationalityPanel({
  assessments,
  taskTitles,
  compact = false,
}: TaskRationalityPanelProps) {
  const [expanded, setExpanded] = useState(!compact);

  if (assessments.length === 0) return null;

  const avgScore = Math.round(
    assessments.reduce((sum, a) => sum + a.overallScore, 0) / assessments.length
  );
  const worstVerdict = assessments.reduce<AssessmentVerdict>((acc, a) => {
    const order: AssessmentVerdict[] = ['risk', 'caution', 'good'];
    return order.indexOf(a.verdict) < order.indexOf(acc) ? a.verdict : acc;
  }, 'good');

  const config = verdictConfig[worstVerdict];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border ${config.border} ${config.bg} overflow-hidden`}
    >
      <Button
        variant="ghost"
        size="md"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <div
            className={`size-9 rounded-lg ${config.bg} border ${config.border} flex items-center justify-center`}
          >
            <Icon name={config.icon} size="sm" className={`size-4 ${config.color}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-text-secondary">AI 合理性评估</span>
              <span
                className={`rounded border px-1.5 py-0.5 text-xs ${config.border} ${config.color}`}
              >
                {config.label}
              </span>
            </div>
            <p className="text-[11px] text-text-tertiary">
              平均 {avgScore} 分 · {assessments.length} 项任务
            </p>
          </div>
        </div>
        {expanded ? (
          <Icon name="ChevronUp" size="sm" className="text-text-muted" />
        ) : (
          <Icon name="ChevronDown" size="sm" className="text-text-muted" />
        )}
      </Button>

      {expanded && (
        <div className="space-y-3 px-4 pb-4">
          {assessments.map((assessment, index) => {
            const title = taskTitles?.[index] ?? `任务 ${index + 1}`;
            const c = verdictConfig[assessment.verdict];
            return (
              <div key={index} className="rounded-lg border border-border-subtle bg-surface p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex min-w-0 items-center gap-2">
                    <Icon name={c.icon} size="xs" className={`size-3.5 ${c.color} shrink-0`} />
                    <span className="truncate text-xs font-semibold text-text-secondary">
                      {title}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${c.color}`}>
                    {assessment.overallScore} 分
                  </span>
                </div>

                <p className="mb-2 text-[11px] text-text-tertiary">{assessment.summary}</p>

                <div className="mb-2 space-y-1.5">
                  {assessment.dimensions.map((dim) => (
                    <div key={dim.id} className="flex items-center gap-2">
                      <span className="w-16 shrink-0 text-[10px] text-text-muted">{dim.name}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-hover">
                        <div
                          className={`h-full rounded-full ${
                            dim.label === 'risk'
                              ? 'bg-error'
                              : dim.label === 'caution'
                                ? 'bg-warning'
                                : 'bg-success'
                          }`}
                          style={{ width: `${dim.score}%` }}
                        />
                      </div>
                      <span className="w-7 text-right text-[10px] text-text-tertiary">
                        {dim.score}
                      </span>
                    </div>
                  ))}
                </div>

                {assessment.suggestions.length > 0 && (
                  <div className="flex items-start gap-1.5 text-[11px] text-text-tertiary">
                    <Icon name="Lightbulb" size="xs" className="mt-0.5 shrink-0 text-warning" />
                    <ul className="space-y-0.5">
                      {assessment.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
