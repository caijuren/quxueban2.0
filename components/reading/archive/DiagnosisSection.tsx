'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon, type IconName } from '@/components/ui/icon';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { apiPost } from '@/lib/apiClient';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import ReadingAbilityRadar from '@/components/reading/ReadingAbilityRadar';
import {
  getPhaseByLadder,
  getReadingAbility,
  type ReadingAbilityId,
} from '@/lib/subjects/readingLiteracy';
import type { ReadingDiagnosisResult } from '@/lib/readingDiagnosis';

interface DiagnosisResponse {
  result: ReadingDiagnosisResult;
  source: 'ai' | 'local';
  reason?: string;
}

const PRIORITY_META: Record<
  'must' | 'should' | 'optional',
  { label: string; chip: string; icon: IconName }
> = {
  must: { label: '优先', chip: 'bg-error/10 text-error', icon: 'CircleAlert' },
  should: { label: '建议', chip: 'bg-warning/10 text-warning', icon: 'CircleHelp' },
  optional: { label: '可选', chip: 'bg-surface-highlight text-text-muted', icon: 'Circle' },
};

function scoreColor(score: number): string {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-warning';
  return 'text-error';
}

export default function DiagnosisSection({ childId }: { childId: string }) {
  const shouldReduceMotion = useReducedMotion();
  const [response, setResponse] = useState<DiagnosisResponse | null>(null);

  const diagnoseMutation = useMutation({
    mutationFn: async () => {
      const res = await apiPost<DiagnosisResponse>('/api/reading/diagnose', { childId });
      setResponse(res);
      return res;
    },
    onError: (e) => {
      toast.error('诊断失败', e instanceof Error ? e.message : undefined);
    },
  });

  const result = response?.result;

  return (
    <div className="space-y-4">
      {/* 生成入口 */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Card padding="lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                <Icon name="Brain" size="md" className="text-secondary" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-text-primary">AI 阅读诊断</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-text-muted">
                  综合分析阅读记录、能力证据与书籍素养标签，基于《中国青少年阅读素养框架》
                  输出当前梯级、6 维度评分与下一梯级行动建议
                </p>
              </div>
            </div>
            <Button
              size="md"
              isLoading={diagnoseMutation.isPending}
              leftIcon={<Icon name="WandSparkles" size="sm" />}
              onClick={() => diagnoseMutation.mutate()}
              className="shrink-0"
            >
              {result ? '重新诊断' : '生成诊断'}
            </Button>
          </div>
          {response?.source === 'local' && (
            <p className="mt-3 flex items-center gap-1.5 text-2xs text-warning">
              <Icon name="CircleAlert" size="xs" />
              当前为本地评估{response.reason ? `（${response.reason}）` : ''}，配置并启用 AI 后可获得更精准的诊断
            </p>
          )}
        </Card>
      </motion.div>

      {!result ? (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <Card padding="lg" className="border-dashed">
            <div className="flex flex-col items-center py-10 text-center">
              <Icon name="FileSearch" size="xl" className="mb-3 text-text-tertiary" />
              <p className="text-sm font-medium text-text-secondary">还没有诊断报告</p>
              <p className="mt-1 max-w-md text-2xs leading-relaxed text-text-muted">
                点击「生成诊断」后，系统会读取孩子的阅读记录、已确认的能力证据和书籍素养标签，
                由 AI 生成一份可执行的阅读提升报告
              </p>
            </div>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {/* 总体评分 + 习惯 */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 gap-4 lg:grid-cols-3"
          >
            <Card padding="lg" className="lg:col-span-2">
              <div className="flex items-start gap-4">
                <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary/10">
                  <span className={cn('font-display text-2xl font-bold', scoreColor(result.overallScore))}>
                    {result.overallScore}
                  </span>
                  <span className="text-2xs text-text-muted">综合评分</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <Badge variant="primary" size="sm">
                      第 {result.currentLadder} 梯 · {getPhaseByLadder(result.currentLadder)}阶段
                    </Badge>
                    <Badge variant={response?.source === 'ai' ? 'success' : 'warning'} size="sm">
                      {response?.source === 'ai' ? 'AI 诊断' : '本地评估'}
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-text-secondary">{result.summary}</p>
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <div className="mb-3 flex items-center gap-2">
                <Icon name="Clock" size="sm" className="text-primary" />
                <h4 className="text-sm font-semibold text-text-secondary">阅读习惯</h4>
              </div>
              <div className="flex items-end gap-2">
                <span className="font-display text-2xl font-bold text-text-primary">
                  {result.habits.dailyMinutes}
                  <span className="text-xs text-text-muted"> 分钟/天</span>
                </span>
                {result.habits.targetMinutes > 0 && (
                  <span className="mb-1 text-2xs text-text-muted">
                    目标 {result.habits.targetMinutes} 分钟
                  </span>
                )}
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-highlight">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    result.habits.dailyMinutes >= result.habits.targetMinutes
                      ? 'bg-success'
                      : 'bg-primary'
                  )}
                  style={{
                    width: `${Math.min(
                      100,
                      result.habits.targetMinutes > 0
                        ? (result.habits.dailyMinutes / result.habits.targetMinutes) * 100
                        : result.habits.dailyMinutes > 0
                          ? 100
                          : 0
                    )}%`,
                  }}
                />
              </div>
              <p className="mt-2 text-2xs leading-relaxed text-text-muted">
                {result.habits.frequency}
              </p>
            </Card>
          </motion.div>

          {/* 6 维度雷达 */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            <ReadingAbilityRadar
              assessment={{ ladder: result.currentLadder, dimensions: result.dimensions }}
              title="6 维度阅读能力评估"
              description="AI 基于阅读记录与能力证据的评分，点击维度可查看梯级描述"
            />
          </motion.div>

          {/* 优势 + 薄弱 */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="grid grid-cols-1 gap-4 lg:grid-cols-2"
          >
            <Card padding="lg">
              <div className="mb-3 flex items-center gap-2">
                <Icon name="TrendingUp" size="sm" className="text-success" />
                <h4 className="text-sm font-semibold text-text-secondary">优势表现</h4>
              </div>
              {result.strengths.length === 0 ? (
                <p className="text-sm text-text-muted">暂无足够数据判断优势</p>
              ) : (
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <Icon name="CircleCheck" size="sm" className="mt-0.5 shrink-0 text-success" />
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card padding="lg">
              <div className="mb-3 flex items-center gap-2">
                <Icon name="TrendingDown" size="sm" className="text-error" />
                <h4 className="text-sm font-semibold text-text-secondary">薄弱环节</h4>
              </div>
              {result.weaknesses.length === 0 ? (
                <p className="text-sm text-text-muted">暂无明显薄弱环节</p>
              ) : (
                <ul className="space-y-2">
                  {result.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <Icon name="CircleX" size="sm" className="mt-0.5 shrink-0 text-error" />
                      {w}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </motion.div>

          {/* 下一梯级建议 */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            <Card padding="lg" className="border-secondary/25 bg-secondary/5">
              <div className="mb-2 flex items-center gap-2">
                <Icon name="Lightbulb" size="sm" className="text-secondary" />
                <h4 className="text-sm font-semibold text-text-secondary">
                  下一梯级行动建议（第 {result.currentLadder} 梯 → 第 {Math.min(12, result.currentLadder + 1)} 梯）
                </h4>
              </div>
              <p className="text-sm leading-relaxed text-text-secondary">{result.nextStep}</p>
            </Card>
          </motion.div>

          {/* 行动清单 */}
          {result.suggestions.length > 0 && (
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
            >
              <Card padding="lg">
                <div className="mb-3 flex items-center gap-2">
                  <Icon name="ListChecks" size="sm" className="text-primary" />
                  <h4 className="text-sm font-semibold text-text-secondary">行动清单</h4>
                </div>
                <div className="space-y-2.5">
                  {result.suggestions.map((s, i) => {
                    const meta = PRIORITY_META[s.priority];
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-xl border border-border-subtle bg-surface-hover/50 p-3"
                      >
                        <div className={cn('flex size-7 shrink-0 items-center justify-center rounded-lg', meta.chip)}>
                          <Icon name={meta.icon} size="sm" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-text-secondary">{s.title}</p>
                            <span className={cn('rounded-full px-2 py-0.5 text-2xs', meta.chip)}>
                              {meta.label}
                            </span>
                          </div>
                          <p className="mt-0.5 text-2xs leading-relaxed text-text-muted">
                            {s.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}

          {/* 维度明细 */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25 }}
          >
            <Card padding="lg">
              <div className="mb-3 flex items-center gap-2">
                <Icon name="Layers" size="sm" className="text-accent" />
                <h4 className="text-sm font-semibold text-text-secondary">维度诊断明细</h4>
              </div>
              <div className="space-y-2.5">
                {result.dimensions.map((d) => {
                  const ability = getReadingAbility(d.id as ReadingAbilityId);
                  return (
                    <div
                      key={d.id}
                      className="rounded-xl border border-border-subtle bg-surface-hover/50 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-text-secondary">
                          {ability?.name ?? d.id}
                        </span>
                        <span className={cn('font-display text-sm font-bold', scoreColor(d.score))}>
                          {d.score}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-highlight">
                        <div
                          className="h-full rounded-full bg-accent transition-all duration-500"
                          style={{ width: `${d.score}%` }}
                        />
                      </div>
                      <p className="mt-1.5 text-2xs leading-relaxed text-text-muted">{d.comment}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
