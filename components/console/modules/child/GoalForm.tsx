'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { LearningGoal } from '@/lib/types';
import { LearningGoalCreateInput } from '@/lib/validation';

interface GoalFormProps {
  initial?: LearningGoal | null;
  onSubmit: (data: LearningGoalCreateInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const subjects = [
  { value: 'chinese', label: '语文' },
  { value: 'math', label: '数学' },
  { value: 'english', label: '英语' },
  { value: 'overall', label: '综合' },
];

const goalTypes = [
  { value: 'reading_count', label: '阅读数量' },
  { value: 'ability_score', label: '能力分数' },
  { value: 'habit', label: '习惯养成' },
  { value: 'custom', label: '自定义' },
];

const metricTypes = [
  { value: 'count', label: '数量' },
  { value: 'score', label: '分数' },
  { value: 'duration', label: '时长' },
  { value: 'habit', label: '习惯' },
];

const periods = ['2026春季', '2026秋季', '2027春季', '2027秋季', '长期'];

export default function GoalForm({ initial, onSubmit, onCancel, isLoading }: GoalFormProps) {
  const [form, setForm] = useState<LearningGoalCreateInput>({
    subject: initial?.subject ?? 'chinese',
    goalType: initial?.goalType ?? 'custom',
    metricType: initial?.metricType ?? 'count',
    title: initial?.title ?? '',
    target: initial?.target ?? '',
    period: initial?.period ?? '2026春季',
    source: initial?.source ?? 'parent',
    status: initial?.status ?? 'active',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const update = <K extends keyof LearningGoalCreateInput>(key: K, value: LearningGoalCreateInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[20px] bg-surface border border-border-default shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
          <h3 className="text-base font-bold text-text-primary">
            {initial ? '编辑目标' : '新增目标'}
          </h3>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center text-text-muted hover:text-text-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs text-text-muted mb-1.5">目标标题</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="例如：一年阅读 100 本书"
              className="w-full px-3 py-2.5 rounded-xl bg-surface-hover border border-border-default text-sm text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-text-muted mb-1.5">学科</label>
              <select
                value={form.subject}
                onChange={(e) => update('subject', e.target.value as LearningGoalCreateInput['subject'])}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-hover border border-border-default text-sm text-text-secondary focus:outline-none focus:border-primary/50"
              >
                {subjects.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1.5">目标周期</label>
              <select
                value={form.period}
                onChange={(e) => update('period', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-hover border border-border-default text-sm text-text-secondary focus:outline-none focus:border-primary/50"
              >
                {periods.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-text-muted mb-1.5">目标类型</label>
              <select
                value={form.goalType}
                onChange={(e) => update('goalType', e.target.value as LearningGoalCreateInput['goalType'])}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-hover border border-border-default text-sm text-text-secondary focus:outline-none focus:border-primary/50"
              >
                {goalTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1.5">评价指标</label>
              <select
                value={form.metricType}
                onChange={(e) => update('metricType', e.target.value as LearningGoalCreateInput['metricType'])}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-hover border border-border-default text-sm text-text-secondary focus:outline-none focus:border-primary/50"
              >
                {metricTypes.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-text-muted mb-1.5">具体目标</label>
            <input
              type="text"
              value={form.target ?? ''}
              onChange={(e) => update('target', e.target.value)}
              placeholder="例如：100本 / 90分 / 30分钟"
              className="w-full px-3 py-2.5 rounded-xl bg-surface-hover border border-border-default text-sm text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading || !form.title.trim()}
              className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '保存中...' : '保存目标'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl bg-surface-hover text-text-secondary text-sm font-medium hover:bg-surface-hover transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
