'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';
import ChildAvatar from '@/components/dashboard/ChildAvatar';
import { Icon } from '@/components/ui/icon';
import Button from '@/components/ui/button';
import GlassCard from '@/components/ui/glass-card';
import CommandCard from '@/components/ui/CommandCard';
import MetricCard from '@/components/ui/metric-card';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/skeleton';
import {
  useReports,
  useReportDetail,
  useGenerateReport,
  useRegenerateReport,
  type GrowthReportSummary,
} from '@/lib/hooks/useReports';
import { getWeeklyPeriod, getMonthlyPeriod, formatPeriodLabel } from '@/lib/reports/date';

type ReportType = 'WEEKLY' | 'MONTHLY';

function formatPeriod(report: GrowthReportSummary): string {
  return formatPeriodLabel(report.type, new Date(report.periodStart));
}

function ReportSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-48 w-full rounded-2xl" />
    </div>
  );
}

export default function BriefingPage() {
  const shouldReduceMotion = useReducedMotion();
  const { children, currentChild, currentChildId, setCurrentChildId } = useChildren();

  const [reportType, setReportType] = useState<ReportType>('WEEKLY');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const childId = currentChild?.id;
  const { data: listData, isLoading: listLoading } = useReports(childId, reportType, 1, 10);
  const generateReport = useGenerateReport();
  const regenerateReport = useRegenerateReport();

  const activeReportId = selectedReportId ?? listData?.reports[0]?.id ?? undefined;
  const { data: detailData, isLoading: detailLoading } = useReportDetail(activeReportId);

  const activeReport = detailData?.report;
  const isGenerating = activeReport?.status === 'GENERATING';

  const periodLabel = useMemo(() => {
    if (activeReport) return formatPeriod(activeReport);
    return reportType === 'WEEKLY' ? getWeeklyPeriod().label : getMonthlyPeriod().label;
  }, [activeReport, reportType]);

  const handleGenerate = () => {
    if (!childId) return;
    generateReport.mutate({ childId, type: reportType });
  };

  const handleRegenerate = () => {
    if (!activeReportId) return;
    regenerateReport.mutate(activeReportId);
  };

  if (!currentChild) {
    return (
      <div className="space-y-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <div className="bg-primary/10 border-primary/20 flex size-10 items-center justify-center rounded-xl border">
            <Icon name="Sparkles" size="md" className="text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">AI 成长简报</h1>
        </motion.div>
        <ChildEmptyState description="添加孩子后，即可生成 AI 成长简报" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center"
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 border-primary/20 flex size-10 items-center justify-center rounded-xl border">
            <Icon name="Sparkles" size="md" className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">AI 成长简报</h1>
            <p className="mt-0.5 text-sm text-text-tertiary">
              {currentChild.name} · 自动生成学习复盘与下周建议
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {children.map((child) => {
            const active = child.id === currentChildId;
            return (
              <Button
                variant="secondary"
                key={child.id}
                onClick={() => setCurrentChildId(child.id)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm transition-all ${
                  active
                    ? 'bg-primary/[0.08] border-primary/30 text-primary'
                    : 'border-border-subtle bg-surface-elevated text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`}
              >
                <ChildAvatar child={child} size="sm" shape="rounded" />
                <span className="font-medium">{child.name}</span>
              </Button>
            );
          })}
        </div>
      </motion.div>

      {/* Type tabs */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex items-center gap-2 rounded-xl border border-border-subtle bg-surface-elevated p-1.5 w-fit"
      >
        <Button
          variant="secondary"
          onClick={() => setReportType('WEEKLY')}
          className={`rounded-lg border-0 px-4 py-1.5 text-sm font-medium transition-colors ${
            reportType === 'WEEKLY'
              ? 'bg-primary/10 text-primary'
              : 'bg-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          周报
        </Button>
        <Button
          variant="secondary"
          onClick={() => setReportType('MONTHLY')}
          className={`rounded-lg border-0 px-4 py-1.5 text-sm font-medium transition-colors ${
            reportType === 'MONTHLY'
              ? 'bg-primary/10 text-primary'
              : 'bg-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          月报
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {!activeReportId && !listLoading && (
            <GlassCard className="flex flex-col items-center justify-center p-10 text-center">
              <div className="bg-ai/10 mb-4 flex size-14 items-center justify-center rounded-2xl">
                <Icon name="Sparkles" size="lg" className="text-ai" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-text-secondary">还没有{reportType === 'WEEKLY' ? '周报' : '月报'}</h3>
              <p className="mb-6 max-w-sm text-sm text-text-tertiary">
                AI 会根据本周的学习、阅读、能力证据和积分数据，自动生成一份家庭教育简报。
              </p>
              <Button
                onClick={handleGenerate}
                disabled={generateReport.isPending}
                className="flex items-center gap-2 rounded-xl bg-ai px-5 py-2.5 text-sm font-medium text-white hover:bg-ai/90 disabled:opacity-50"
              >
                {generateReport.isPending ? (
                  <Icon name="Loader2" size="sm" animate="spin" />
                ) : (
                  <Icon name="Sparkles" size="sm" />
                )}
                {generateReport.isPending ? '创建中...' : `生成本期${reportType === 'WEEKLY' ? '周报' : '月报'}`}
              </Button>
            </GlassCard>
          )}

          {detailLoading && <ReportSkeleton />}

          {!detailLoading && activeReport && (
            <>
              {/* AI Summary */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <GlassCard strength="strong" glow="ai" className="max-sm:!border-border-default max-sm:!bg-surface max-sm:!backdrop-blur-none p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Icon name="Sparkles" size="md" animate={isGenerating ? 'spin' : 'pulse'} className="text-ai" />
                      <h2 className="text-lg font-bold text-text-secondary">{periodLabel}简报</h2>
                      {isGenerating && (
                        <span className="rounded-full border border-ai/20 bg-ai/10 px-2 py-0.5 text-[10px] text-ai">
                          生成中
                        </span>
                      )}
                    </div>
                    <Button
                      variant="secondary"
                      onClick={handleRegenerate}
                      disabled={isGenerating || regenerateReport.isPending}
                      className="bg-ai/10 border-ai/20 hover:bg-ai/15 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-ai transition-colors disabled:opacity-50"
                    >
                      {regenerateReport.isPending ? (
                        <Icon name="Loader2" size="xs" animate="spin" />
                      ) : (
                        <Icon name="RotateCw" size="xs" />
                      )}
                      {isGenerating ? '生成中...' : '重新生成'}
                    </Button>
                  </div>

                  {activeReport.status === 'FAILED' ? (
                    <div className="border-error/20 bg-error/10 flex items-center gap-2 rounded-xl border p-4 text-sm text-error">
                      <Icon name="CircleAlert" size="sm" />
                      简报生成失败，请检查 AI 配置后重试。
                    </div>
                  ) : (
                    <div className="bg-ai/[0.06] border-ai/15 rounded-xl border p-4">
                      <p className="text-sm leading-relaxed text-text-tertiary">
                        {activeReport.summary || (isGenerating ? 'AI 正在分析数据并生成简报，请稍候...' : '暂无总结')}
                      </p>
                    </div>
                  )}
                </GlassCard>
              </motion.div>

              {/* Charts */}
              {!isGenerating && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="grid grid-cols-2 gap-4 lg:grid-cols-4"
                >
                  <MetricCard
                    label="任务完成率"
                    value={activeReport.chartsData?.taskCompletionRate ?? 0}
                    icon="Target"
                    variant="glass"
                    countUp
                    suffix="%"
                  />
                  <MetricCard
                    label="阅读时长"
                    value={activeReport.chartsData?.readingMinutes ?? 0}
                    icon="BookOpen"
                    variant="glass"
                    countUp
                    suffix="分"
                    description={`目标 ${activeReport.chartsData?.readingTargetMinutes ?? 0} 分`}
                  />
                  <MetricCard
                    label="能力证据"
                    value={activeReport.chartsData?.evidenceCount ?? 0}
                    icon="Image"
                    variant="glass"
                    countUp
                    suffix="条"
                  />
                  <MetricCard
                    label="获得积分"
                    value={activeReport.chartsData?.earnedPoints ?? 0}
                    icon="Star"
                    variant="glass"
                    countUp
                    suffix="分"
                  />
                </motion.div>
              )}

              {/* Highlights & Concerns */}
              {!isGenerating && (activeReport.highlights.length > 0 || activeReport.concerns.length > 0) && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2"
                >
                  <CommandCard className="p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Icon name="ThumbsUp" size="md" className="text-success" />
                      <h2 className="text-base font-bold text-text-secondary">本周亮点</h2>
                    </div>
                    {activeReport.highlights.length === 0 ? (
                      <p className="text-sm text-text-muted">本周暂无特别亮点</p>
                    ) : (
                      <div className="space-y-3">
                        {activeReport.highlights.map((h, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-border-subtle bg-surface-elevated p-3"
                          >
                            <p className="text-sm font-semibold text-text-secondary">{h.title}</p>
                            <p className="mt-1 text-xs leading-relaxed text-text-tertiary">{h.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CommandCard>

                  <CommandCard className="p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Icon name="AlertCircle" size="md" className="text-warning" />
                      <h2 className="text-base font-bold text-text-secondary">需关注</h2>
                    </div>
                    {activeReport.concerns.length === 0 ? (
                      <p className="text-sm text-text-muted">本周无明显问题，保持节奏即可</p>
                    ) : (
                      <div className="space-y-3">
                        {activeReport.concerns.map((c, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-border-subtle bg-surface-elevated p-3"
                          >
                            <p className="text-sm font-semibold text-text-secondary">{c.title}</p>
                            <p className="mt-1 text-xs leading-relaxed text-text-tertiary">{c.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CommandCard>
                </motion.div>
              )}

              {/* Ability Insights */}
              {!isGenerating && activeReport.abilityInsights && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                >
                  <CommandCard className="p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Icon name="Brain" size="md" className="text-secondary" />
                      <h2 className="text-base font-bold text-text-secondary">能力洞察</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
                        <p className="mb-1 text-xs text-text-muted">优势能力</p>
                        <p className="text-sm font-semibold text-success">
                          {activeReport.abilityInsights.strength || '-'}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
                        <p className="mb-1 text-xs text-text-muted">待提升</p>
                        <p className="text-sm font-semibold text-warning">
                          {activeReport.abilityInsights.weakness || '-'}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
                        <p className="mb-1 text-xs text-text-muted">提升建议</p>
                        <p className="text-sm font-medium text-text-tertiary">
                          {activeReport.abilityInsights.suggestion || '-'}
                        </p>
                      </div>
                    </div>
                  </CommandCard>
                </motion.div>
              )}

              {/* Next Week Plan */}
              {!isGenerating && activeReport.nextWeekPlan.length > 0 && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <CommandCard className="p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Icon name="CalendarCheck" size="md" className="text-primary" />
                      <h2 className="text-base font-bold text-text-secondary">下周行动建议</h2>
                    </div>
                    <div className="space-y-3">
                      {activeReport.nextWeekPlan.map((plan, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {idx + 1}
                          </span>
                          <p className="text-sm leading-relaxed text-text-tertiary">{plan}</p>
                        </div>
                      ))}
                    </div>
                  </CommandCard>
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Sidebar: history list */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <CommandCard className="h-full p-5">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Icon name="History" size="md" className="text-text-tertiary" />
                <h2 className="text-base font-bold text-text-secondary">历史简报</h2>
              </div>
              <Button
                variant="secondary"
                onClick={handleGenerate}
                disabled={generateReport.isPending}
                className="bg-primary/10 border-primary/20 hover:bg-primary/15 flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium text-primary disabled:opacity-50"
              >
                {generateReport.isPending ? (
                  <Icon name="Loader2" size="xs" animate="spin" />
                ) : (
                  <Icon name="Plus" size="xs" />
                )}
                生成
              </Button>
            </div>

            {listLoading && (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            )}

            {!listLoading && (listData?.reports.length ?? 0) === 0 && (
              <EmptyState
                icon="FileText"
                title="暂无历史简报"
                description="点击上方生成按钮创建第一份简报"
                size="sm"
              />
            )}

            {!listLoading && listData && listData.reports.length > 0 && (
              <div className="space-y-2">
                {listData.reports.map((report) => {
                  const active = report.id === activeReportId;
                  return (
                    <button
                      key={report.id}
                      onClick={() => setSelectedReportId(report.id)}
                      className={`w-full rounded-xl border p-3 text-left transition-all ${
                        active
                          ? 'border-primary/30 bg-primary/[0.08]'
                          : 'border-border-subtle bg-surface-elevated hover:bg-surface-hover'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-semibold ${active ? 'text-primary' : 'text-text-secondary'}`}>
                          {formatPeriod(report)}
                        </p>
                        {report.status === 'GENERATING' && (
                          <span className="rounded-full border border-ai/20 bg-ai/10 px-2 py-0.5 text-[10px] text-ai">
                            生成中
                          </span>
                        )}
                        {report.status === 'FAILED' && (
                          <span className="rounded-full border border-error/20 bg-error/10 px-2 py-0.5 text-[10px] text-error">
                            失败
                          </span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-text-tertiary">{report.summary || '暂无摘要'}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </CommandCard>
        </motion.div>
      </div>
    </div>
  );
}
