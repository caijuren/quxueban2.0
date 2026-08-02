'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, BookOpen, Save, RotateCcw, AlertCircle, Check, Loader2, FileJson } from 'lucide-react';
import Link from 'next/link';
import { useSubjectPlan, useUpdateSubjectPlan } from '@/lib/hooks/useSubjectPlan';
import { SubjectPlanConfigData } from '@/lib/subjects/subjectPlan';
import { subjectPlanConfigDataSchema } from '@/lib/validation';
import { ZodError } from 'zod';

export default function ChinesePlanConfigPage() {
  const shouldReduceMotion = useReducedMotion();
  const { data: config, isLoading, error: queryError } = useSubjectPlan('chinese');
  const updateConfig = useUpdateSubjectPlan('chinese');

  const initialJson = useMemo(() => {
    if (!config) return '';
    const { id, createdAt, updatedAt, isSystem, ...data } = config;
    return JSON.stringify(data, null, 2);
  }, [config]);

  const [jsonText, setJsonText] = useState(initialJson);
  const [parseError, setParseError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setJsonText(initialJson);
    setParseError(null);
    setSaveSuccess(false);
  }, [initialJson]);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setParseError(null);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'JSON 格式错误');
    }
  };

  const handleReset = () => {
    if (!confirm('确定要恢复为默认配置吗？当前未保存的修改会丢失。')) return;
    setJsonText(initialJson);
    setParseError(null);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setParseError(null);
    setSaveSuccess(false);

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'JSON 格式错误');
      return;
    }

    const validation = subjectPlanConfigDataSchema.safeParse(parsed);
    if (!validation.success) {
      const issues = (validation.error as ZodError).issues
        .map((issue) => `${issue.path.join('.')}：${issue.message}`)
        .slice(0, 10)
        .join('\n');
      setParseError(`校验失败：\n${issues}`);
      return;
    }

    try {
      await updateConfig.mutateAsync(validation.data as SubjectPlanConfigData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : '保存失败');
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/subjects/chinese"
        className="inline-flex items-center gap-1 text-sm text-text-tertiary hover:text-primary transition-colors mb-2"
      >
        <ArrowLeft className="w-4 h-4" />
        返回语文学科路径
      </Link>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display">语文规划配置</h1>
            <p className="text-sm text-text-tertiary mt-0.5">编辑 JSON 以调整 6 条线、节点、年级目标和赛事</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFormat}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/[0.08] text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors disabled:opacity-50"
          >
            <FileJson className="w-4 h-4" />
            格式化
          </button>
          <button
            onClick={handleReset}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/[0.08] text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            重置
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || updateConfig.isPending}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {updateConfig.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {updateConfig.isPending ? '保存中' : saveSuccess ? '已保存' : '保存'}
          </button>
        </div>
      </motion.div>

      {isLoading && (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {queryError && (
        <div className="rounded-2xl border border-error/20 bg-error/10 p-6 text-error">
          {queryError instanceof Error ? queryError.message : '加载失败'}
        </div>
      )}

      {!isLoading && !queryError && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4"
        >
          {parseError && (
            <div className="rounded-xl border border-error/20 bg-error/10 p-4 text-error whitespace-pre-wrap text-sm">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">配置有误</span>
              </div>
              {parseError}
            </div>
          )}

          {saveSuccess && (
            <div className="rounded-xl border border-success/20 bg-success/10 p-4 text-success text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span className="font-medium">配置已保存</span>
            </div>
          )}

          <div className="rounded-2xl glass border border-border-subtle overflow-hidden">
            <div className="p-4 border-b border-border-subtle flex items-center justify-between">
              <div>
                <h2 className="font-bold text-text-secondary">JSON 配置</h2>
                <p className="text-xs text-text-tertiary mt-0.5">
                  修改后会自动校验格式，保存后立即生效
                </p>
              </div>
              {config?.isSystem && (
                <span className="text-2xs px-2 py-1 rounded bg-secondary/10 text-secondary border border-secondary/20">
                  当前使用系统默认
                </span>
              )}
            </div>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              spellCheck={false}
              className="w-full h-[60vh] bg-surface-elevated p-4 font-mono text-sm text-text-secondary focus:outline-none resize-none"
              placeholder="加载中..."
            />
          </div>

          <div className="rounded-xl border border-dashed border-border-default bg-surface-elevated p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-text-tertiary mt-0.5" />
              <div className="text-xs text-text-muted leading-relaxed space-y-1">
                <p>
                  <strong className="text-text-secondary">配置说明：</strong>
                </p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>tracks：6 条线路的名称、颜色和描述</li>
                  <li>timeAxis：时间轴标签和位置（0-100）</li>
                  <li>nodes：地图上的节点，trackId 需对应 tracks 中的 id</li>
                  <li>yearlyTargets：每个年级在每条线上的目标</li>
                  <li>examTimeline：荣誉赛事时间轴</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
