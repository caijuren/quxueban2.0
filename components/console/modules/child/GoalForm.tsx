'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
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

const periods = [
  { value: '2026春季', label: '2026春季' },
  { value: '2026秋季', label: '2026秋季' },
  { value: '2027春季', label: '2027春季' },
  { value: '2027秋季', label: '2027秋季' },
  { value: '长期', label: '长期' },
];

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

  const update = <K extends keyof LearningGoalCreateInput>(
    key: K,
    value: LearningGoalCreateInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[85vh] w-full max-w-md overflow-hidden overflow-y-auto rounded-[20px] border border-border-default bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <h3 className="text-base font-bold text-text-primary">
            {initial ? '编辑目标' : '新增目标'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="flex size-8 items-center justify-center rounded-lg bg-surface-hover text-text-muted transition-colors hover:text-text-secondary"
          >
            <Icon name="X" size="sm" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label className="mb-1.5 block text-xs text-text-muted">目标标题</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="例如：一年阅读 100 本书"
              className="focus:border-primary/50 w-full rounded-xl border border-border-default bg-surface-hover px-3 py-2.5 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs text-text-muted">学科</label>
              <Select
                options={subjects}
                value={form.subject}
                onChange={(e) =>
                  update('subject', e.target.value as LearningGoalCreateInput['subject'])
                }
                size="md"
                className="bg-surface-hover"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-text-muted">目标周期</label>
              <Select
                options={periods}
                value={form.period}
                onChange={(e) => update('period', e.target.value)}
                size="md"
                className="bg-surface-hover"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs text-text-muted">目标类型</label>
              <Select
                options={goalTypes}
                value={form.goalType}
                onChange={(e) =>
                  update('goalType', e.target.value as LearningGoalCreateInput['goalType'])
                }
                size="md"
                className="bg-surface-hover"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-text-muted">评价指标</label>
              <Select
                options={metricTypes}
                value={form.metricType}
                onChange={(e) =>
                  update('metricType', e.target.value as LearningGoalCreateInput['metricType'])
                }
                size="md"
                className="bg-surface-hover"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-text-muted">具体目标</label>
            <input
              type="text"
              value={form.target ?? ''}
              onChange={(e) => update('target', e.target.value)}
              placeholder="例如：100本 / 90分 / 30分钟"
              className="focus:border-primary/50 w-full rounded-xl border border-border-default bg-surface-hover px-3 py-2.5 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isLoading || !form.title.trim()}
              className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-medium text-inverse transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? '保存中...' : '保存目标'}
            </Button>
            <Button
              variant="secondary"
              size="md"
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl bg-surface-hover py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover"
            >
              取消
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
