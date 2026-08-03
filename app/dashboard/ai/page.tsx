'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Calendar,
  User,
  Loader2,
} from 'lucide-react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import { gradeLabel } from '@/lib/children';
import EmptyState from '@/components/ui/EmptyState';
import type { DiagnosisResult } from '@/lib/aiDiagnosis';

const sectionConfig = {
  subjectHealth: {
    title: '进度诊断',
    icon: CheckCircle2,
    color: 'text-success',
  },
  risks: {
    title: '风险预警',
    icon: AlertTriangle,
    color: 'text-warning',
  },
  suggestions: {
    title: '调整建议',
    icon: Lightbulb,
    color: 'text-secondary',
  },
  monthlyFocus: {
    title: '下月重点',
    icon: Calendar,
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
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-display mb-2">
            {currentChild ? `${currentChild.name}的 AI 检视` : 'AI 检视'}
          </h1>
          <p className="text-text-tertiary">
            {currentChild
              ? `当前阶段：${gradeLabel(currentChild.grade)} · 基于当前进度和目标生成诊断建议`
              : '基于当前进度和目标，智能生成诊断与调整建议'}
          </p>
        </div>
        <button
          onClick={generateDiagnosis}
          disabled={!currentChild || loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-secondary to-secondary-glow text-text-primary font-semibold hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {loading ? '生成中...' : '重新生成'}
        </button>
      </motion.div>

      {!currentChild && (
        <EmptyState
          icon={User}
          title="还没有孩子档案"
          description="请先在右上角添加孩子，系统会根据年级生成对应的 AI 诊断建议"
        />
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-surface-elevated p-6 border border-red-500/30 bg-red-500/10"
        >
          <p className="text-red-300">生成失败：{error}</p>
        </motion.div>
      )}

      {diagnosis && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl bg-surface-elevated p-6 border border-secondary/20"
            style={{ boxShadow: '0 0 60px rgba(139, 92, 246, 0.1)' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h2 className="text-xl font-bold font-display">AI 综合评估</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-text-tertiary">路线匹配度</span>
                    <span className="text-2xl font-bold text-primary">{diagnosis.overallScore}%</span>
                  </div>
                </div>
                <p className="text-text-secondary leading-relaxed">{diagnosis.summary}</p>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="text-text-tertiary">匹配等级：</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary/20 text-secondary font-medium">
                    {diagnosis.routeMatch.level}
                  </span>
                  <span className="text-text-muted">· {diagnosis.routeMatch.reason}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(Object.keys(sectionConfig) as Array<keyof typeof sectionConfig>).map((key, index) => {
              const section = sectionConfig[key];
              const items = diagnosis[key] as unknown[];
              const Icon = section.icon;

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="rounded-2xl bg-surface-elevated p-6"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <Icon className={`w-6 h-6 ${section.color}`} />
                    <h2 className="text-lg font-bold font-display">{section.title}</h2>
                  </div>
                  <ul className="space-y-3">
                    {items.length === 0 ? (
                      <li className="text-sm text-text-muted">暂无数据</li>
                    ) : (
                      items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${section.color.replace('text-', 'bg-')} mt-2 shrink-0`}
                          />
                          {getItemText(key, item)}
                        </li>
                      ))
                    )}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {!diagnosis && !loading && currentChild && !error && (
        <div className="rounded-2xl bg-surface-elevated p-12 text-center">
          <Sparkles className="w-12 h-12 text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">点击右上角「重新生成」获取 AI 诊断报告</p>
        </div>
      )}
    </div>
  );
}
