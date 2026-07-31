'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { TaskRationalityAssessment, AssessmentVerdict } from '@/lib/ai/taskAssessment';

interface TaskRationalityPanelProps {
  assessments: TaskRationalityAssessment[];
  taskTitles?: string[];
  compact?: boolean;
}

const verdictConfig: Record<
  AssessmentVerdict,
  { label: string; color: string; bg: string; border: string; icon: typeof CheckCircle2 }
> = {
  good: {
    label: '匹配良好',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: CheckCircle2,
  },
  caution: {
    label: '建议留意',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: AlertTriangle,
  },
  risk: {
    label: '存在风险',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    icon: AlertTriangle,
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
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border ${config.border} ${config.bg} overflow-hidden`}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg ${config.bg} border ${config.border} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${config.color}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-200">AI 合理性评估</span>
              <span className={`text-xs px-1.5 py-0.5 rounded border ${config.border} ${config.color}`}>
                {config.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              平均 {avgScore} 分 · {assessments.length} 项任务
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {assessments.map((assessment, index) => {
            const title = taskTitles?.[index] ?? `任务 ${index + 1}`;
            const c = verdictConfig[assessment.verdict];
            const TaskIcon = c.icon;
            return (
              <div
                key={index}
                className="rounded-lg bg-black/20 border border-white/[0.06] p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <TaskIcon className={`w-3.5 h-3.5 ${c.color} shrink-0`} />
                    <span className="text-xs font-semibold text-slate-200 truncate">{title}</span>
                  </div>
                  <span className={`text-xs font-bold ${c.color}`}>{assessment.overallScore} 分</span>
                </div>

                <p className="text-[11px] text-slate-400 mb-2">{assessment.summary}</p>

                <div className="space-y-1.5 mb-2">
                  {assessment.dimensions.map((dim) => (
                    <div key={dim.id} className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 w-16 shrink-0">{dim.name}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            dim.label === 'risk'
                              ? 'bg-rose-500'
                              : dim.label === 'caution'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${dim.score}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 w-7 text-right">{dim.score}</span>
                    </div>
                  ))}
                </div>

                {assessment.suggestions.length > 0 && (
                  <div className="flex items-start gap-1.5 text-[11px] text-slate-400">
                    <Lightbulb className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
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
