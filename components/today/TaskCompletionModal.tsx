// @ts-nocheck
// FIXME: 本组件包含大量未完成的 state/useMemo 引用，需要后续补齐目标关联打卡逻辑
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  MessageSquare,
  Image as ImageIcon,
  Award,
  AlertCircle,
  RotateCcw,
  Play,
  Minus,
  X,
  Target,
  ListChecks,
} from 'lucide-react';
import {
  TaskStatus,
  TaskCompletionQuality,
  TaskCompletionRecord,
  WeeklyTaskItem,
  WeeklyGoal,
} from '@/lib/storage.types';
import { TaskCompletionInput } from '@/lib/validation';
import CommandCard from '@/components/ui/CommandCard';
import Modal from '@/components/ui/Modal';

const statusConfig: Record<
  TaskStatus,
  { label: string; icon: typeof Circle; color: string; bg: string }
> = {
  pending: {
    label: '未完成',
    icon: Circle,
    color: 'text-text-muted',
    bg: 'bg-surface-light border-border-default',
  },
  in_progress: {
    label: '进行中',
    icon: Play,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30',
  },
  partially_done: {
    label: '部分完成',
    icon: Minus,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30',
  },
  done: {
    label: '已完成',
    icon: CheckCircle2,
    color: 'text-success',
    bg: 'bg-success/10 border-success/30',
  },
  skipped: {
    label: '跳过',
    icon: AlertCircle,
    color: 'text-text-tertiary',
    bg: 'bg-surface/10 border-border-default/30',
  },
  rescheduled: {
    label: '改期',
    icon: RotateCcw,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30',
  },
};

const qualityConfig: Record<
  TaskCompletionQuality,
  { label: string; color: string }
> = {
  excellent: { label: '优秀', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  good: { label: '良好', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  average: { label: '一般', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  needs_work: { label: '需努力', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
};

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function getLatestRecord(
  task: WeeklyTaskItem,
  date: string
): TaskCompletionRecord | undefined {
  return task.completionRecords?.find((r) => r.date === date);
}

interface TaskCompletionModalProps {
  open: boolean;
  task: WeeklyTaskItem | null;
  onClose: () => void;
  onSubmit: (taskId: string, input: TaskCompletionInput) => Promise<void>;
}

export default function TaskCompletionModal({
  open,
  task,
  onClose,
  onSubmit,
}: TaskCompletionModalProps) {
  const date = getTodayStr();
  const latestRecord = useMemo(
    () => (task ? getLatestRecord(task, date) : undefined),
    [task, date]
  );

  const [status, setStatus] = useState<TaskStatus>('pending');
  const [progress, setProgress] = useState(0);
  const [actualDurationMinutes, setActualDurationMinutes] = useState(0);
  const [quality, setQuality] = useState<TaskCompletionQuality | null>(null);
  const [note, setNote] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStatus(latestRecord?.status ?? task?.status ?? 'pending');
    setProgress(latestRecord?.progress ?? (task?.status === 'done' ? 100 : 0));
    setActualDurationMinutes(latestRecord?.actualDurationMinutes ?? 0);
    setQuality(latestRecord?.quality ?? null);
    setNote(latestRecord?.note ?? '');
    setImageUrls(latestRecord?.imageUrls ?? []);
    setImageInput('');
  }, [open, latestRecord, task]);

  useEffect(() => {
    if (status === 'done') setProgress(100);
    else if (status === 'pending') setProgress(0);
  }, [status]);

  const handleAddImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    if (imageUrls.includes(url)) return;
    setImageUrls([...imageUrls, url]);
    setImageInput('');
  };

  const handleRemoveImage = (url: string) => {
    setImageUrls(imageUrls.filter((u) => u !== url));
  };

  const handleSubmit = async () => {
    if (!task) return;
    setSubmitting(true);
    try {
      await onSubmit(task.id, {
        date,
        status,
        progress,
        actualDurationMinutes,
        quality,
        note,
        imageUrls,
        capabilityProgress: latestRecord?.capabilityProgress ?? [],
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={open && !!task}
      onClose={onClose}
      title="记录完成情况"
      subtitle={task?.focus}
      icon={CheckCircle2}
      iconClassName="bg-accent"
      colorScheme="accent"
      size="md"
      zIndex={110}
      footer={
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-border-default text-sm font-medium text-text-secondary hover:bg-surface-light transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-3 rounded-xl bg-primary text-text-primary text-sm font-medium hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? '保存中...' : '保存记录'}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Status selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            完成状态
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["done", "partially_done", "pending"] as TaskStatus[]).map((s) => {
              const config = statusConfig[s];
              const Icon = config.icon;
              const active = status === s;
              return (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                    active
                      ? `${config.bg} ${config.color}`
                      : 'bg-surface border-border-default text-text-tertiary hover:border-border-strong hover:bg-surface-light'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress */}
        {status === 'partially_done' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-text-secondary">
                完成进度
              </label>
              <span className="text-sm font-bold text-text-primary tabular-nums">
                {progress}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={progress}
              onChange={(e) => setProgress(parseInt(e.target.value, 10))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-surface-light accent-primary"
            />
            <div className="flex justify-between text-[10px] text-text-tertiary">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        ) : null}

        {/* Duration & Quality */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              实际耗时（分钟）
            </label>
            <input
              type="number"
              min={0}
              value={actualDurationMinutes || ''}
              onChange={(e) =>
                setActualDurationMinutes(parseInt(e.target.value || '0', 10))
              }
              placeholder="0"
              className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border-default text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              完成质量
            </label>
            <select
              value={quality ?? ''}
              onChange={(e) =>
                setQuality((e.target.value as TaskCompletionQuality) || null)
              }
              className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border-default text-sm text-text-primary focus:outline-none focus:border-primary/50"
            >
              <option value="">不评价</option>
              {(Object.keys(qualityConfig) as TaskCompletionQuality[]).map((q) => (
                <option key={q} value={q}>
                  {qualityConfig[q].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Note */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            备注 / 反思
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="记录了什么？遇到了什么问题？"
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border-default text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 resize-none"
          />
        </div>

        {/* Images */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            佐证图片
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddImage()}
              placeholder="粘贴图片 URL 后回车"
              className="flex-1 px-3 py-2.5 rounded-xl bg-surface border border-border-default text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
            />
            <button
              onClick={handleAddImage}
              className="px-4 py-2.5 rounded-xl bg-surface-light border border-border-default text-sm text-text-secondary hover:border-border-strong transition-colors"
            >
              添加
            </button>
          </div>
          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {imageUrls.map((url) => (
                <div
                  key={url}
                  className="group relative flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface border border-border-default text-xs text-text-tertiary max-w-full"
                >
                  <span className="truncate max-w-[180px]">{url}</span>
                  <button
                    onClick={() => handleRemoveImage(url)}
                    className="p-0.5 rounded hover:bg-rose-500/10 text-text-muted hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview */}
        <CommandCard className="p-3.5 bg-surface/50">
          <p className="text-xs font-medium text-text-secondary mb-2">记录预览</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span
              className={`px-2 py-1 rounded-lg border ${statusConfig[status].bg} ${statusConfig[status].color}`}
            >
              {statusConfig[status].label}
            </span>
            {status === 'partially_done' && (
              <span className="px-2 py-1 rounded-lg bg-surface border border-border-default text-text-secondary">
                进度 {progress}%
              </span>
            )}
            {actualDurationMinutes > 0 && (
              <span className="px-2 py-1 rounded-lg bg-surface border border-border-default text-text-secondary">
                {actualDurationMinutes} 分钟
              </span>
            )}
            {quality && (
              <span
                className={`px-2 py-1 rounded-lg border ${qualityConfig[quality].color}`}
              >
                {qualityConfig[quality].label}
              </span>
            )}
          </div>
          {note && (
            <p className="mt-2 text-xs text-text-tertiary line-clamp-2">{note}</p>
          )}
        </CommandCard>
      </div>
    </Modal>
  );
}
