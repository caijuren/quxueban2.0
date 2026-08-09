'use client';

import { useState, useEffect, useCallback } from 'react';
import { SlideUp, StaggerContainer, StaggerItem } from '@/components/motion';
import Button from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import { gradeLabel } from '@/lib/children';
import EmptyState from '@/components/ui/EmptyState';
import GlassCard from '@/components/ui/glass-card';
import type { DiagnosisResult } from '@/lib/aiDiagnosis';

const sectionConfig = {
  subjectHealth: {
    title: '进度诊断',
    icon: 'CheckCircle2' as const,
    color: 'text-success',
  },
  risks: {
    title: '风险预警',
    icon: 'AlertTriangle' as const,
    color: 'text-warning',
  },
  suggestions: {
    title: '调整建议',
    icon: 'Lightbulb' as const,
    color: 'text-secondary',
  },
  monthlyFocus: {
    title: '下月重点',
    icon: 'Calendar' as const,
    color: 'text-accent',
  },
};

export default function AIPage() {
  const { currentChild } = useChildren();
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDiagnosis = useCallback(async () => {
    if (!currentChild) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId: currentChild.id }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `请求失败: ${res.status}`);
      }

      const data = (await res.json()) as DiagnosisResult;
      setDiagnosis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成诊断失败');
    } finally {
      setLoading(false);
    }
  }, [currentChild]);

  useEffect(() => {
    if (currentChild && !diagnosis && !loading) {
      generateDiagnosis();
    }
  }, [currentChild, diagnosis, loading, generateDiagnosis]);

  const getItemText = (key: keyof typeof sectionConfig, item: unknown): string => {
    if (typeof item === 'string') return item;
    if (key === 'subjectHealth') {
      const it = item as DiagnosisResult['subjectHealth'][0];
      return `${it.subject}：${it.comment}（${it.status}，${it.score}分）`;
    }
    if (key === 'risks') {
      const it = item as DiagnosisResult['risks'][0];
      return `${it.title}：${it.description}`;
    }
    if (key === 'suggestions') {
      const it = item as DiagnosisResult['suggestions'][0];
      return `${it.title}：${it.description}`;
    }
    const it = item as DiagnosisResult['monthlyFocus'][0];
    return `${it.title}：${it.description}`;
  };

  return (
    <div className="space-y-8">
      <SlideUp className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 font-display text-3xl font-bold">
            {currentChild ? `${currentChild.name}的 AI 检视` : 'AI 检视'}
          </h1>
          <p className="text-text-tertiary">
            {currentChild
              ? `当前阶段：${gradeLabel(currentChild.grade)} · 基于当前进度和目标生成诊断建议`
              : '基于当前进度和目标，智能生成诊断与调整建议'}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={generateDiagnosis}
          disabled={!currentChild || loading}
          className="bg-gradient-to-r from-secondary to-secondary-glow px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <Icon name="Loader2" size="sm" animate="spin" />
          ) : (
            <Icon name="RefreshCw" size="sm" />
          )}
          {loading ? '生成中...' : '重新生成'}
        </Button>
      </SlideUp>

      {!currentChild && (
        <EmptyState
          icon="User"
          title="还没有孩子档案"
          description="请先在右上角添加孩子，系统会根据年级生成对应的 AI 诊断建议"
        />
      )}

      {error && (
        <SlideUp className="border-error/30 bg-error/10 rounded-2xl border p-6">
          <p className="text-error">生成失败：{error}</p>
        </SlideUp>
      )}

      {diagnosis && (
        <>
          <SlideUp>
            <GlassCard strength="strong" glow="ai" className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-secondary to-secondary-glow">
                  <Icon name="Sparkles" size="lg" animate="pulse" className="text-text-primary" />
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="font-display text-xl font-bold">AI 综合评估</h2>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-text-tertiary">路线匹配度</span>
                      <span className="text-2xl font-bold text-secondary">
                        {diagnosis.overallScore}%
                      </span>
                    </div>
                  </div>
                  <p className="leading-relaxed text-text-secondary">{diagnosis.summary}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <span className="text-text-tertiary">匹配等级：</span>
                    <span className="bg-secondary/20 rounded-full px-2.5 py-0.5 font-medium text-secondary">
                      {diagnosis.routeMatch.level}
                    </span>
                    <span className="text-text-muted">· {diagnosis.routeMatch.reason}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </SlideUp>

          <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {(Object.keys(sectionConfig) as Array<keyof typeof sectionConfig>).map((key) => {
              const section = sectionConfig[key];
              const items = diagnosis[key] as unknown[];

              return (
                <StaggerItem key={key}>
                  <GlassCard className="h-full p-6">
                    <div className="mb-5 flex items-center gap-3">
                      <Icon name={section.icon} size="lg" className={section.color} />
                      <h2 className="font-display text-lg font-bold">{section.title}</h2>
                    </div>
                    <ul className="space-y-3">
                      {items.length === 0 ? (
                        <li className="text-sm text-text-muted">暂无数据</li>
                      ) : (
                        items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary"
                          >
                            <span
                              className={`size-1.5 rounded-full ${section.color.replace('text-', 'bg-')} mt-2 shrink-0`}
                            />
                            {getItemText(key, item)}
                          </li>
                        ))
                      )}
                    </ul>
                  </GlassCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </>
      )}

      {!diagnosis && !loading && currentChild && !error && (
        <GlassCard className="p-12 text-center">
          <Icon name="Sparkles" size="xl" animate="pulse" className="mx-auto mb-4 text-secondary" />
          <p className="text-text-secondary">点击右上角「重新生成」获取 AI 诊断报告</p>
        </GlassCard>
      )}
    </div>
  );
}
