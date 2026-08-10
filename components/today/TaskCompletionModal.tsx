'use client';
import { Icon, type IconName } from '@/components/ui/icon';

import { useEffect, useMemo, useState } from 'react';

import {
  TaskStatus,
  TaskCompletionQuality,
  TaskCompletionRecord,
  WeeklyTaskItem,
  WeeklyGoal,
} from '@/lib/storage.types';
import { TaskCompletionInput } from '@/lib/validation';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import CommandCard from '@/components/ui/CommandCard';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/textarea';

const statusConfig: Record<
  TaskStatus,
  { label: string; icon: IconName; color: string; bg: string }
> = {
  pending: {
    label: '未完成',
    icon: 'Circle',
    color: 'text-text-muted',
    bg: 'bg-surface-light border-border-default',
  },
  in_progress: {
    label: '进行中',
    icon: 'Play',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30',
  },
  partially_done: {
    label: '部分完成',
    icon: 'Minus',
    color: 'text-warning',
    bg: 'bg-warning/10 border-warning/30',
  },
  done: {
    label: '已完成',
    icon: 'CheckCircle2',
    color: 'text-success',
    bg: 'bg-success/10 border-success/30',
  },
  skipped: {
    label: '跳过',
    icon: 'AlertCircle',
    color: 'text-text-tertiary',
    bg: 'bg-surface/10 border-border-default/30',
  },
  rescheduled: {
    label: '改期',
    icon: 'RotateCcw',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30',
  },
};

const qualityConfig: Record<TaskCompletionQuality, { label: string; color: string }> = {
  excellent: { label: '优秀', color: 'text-success bg-success/10 border-success/30' },
  good: { label: '良好', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  average: { label: '一般', color: 'text-warning bg-warning/10 border-warning/30' },
  needs_work: { label: '需努力', color: 'text-error bg-error/10 border-error/30' },
};

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function getLatestRecord(task: WeeklyTaskItem, date: string): TaskCompletionRecord | undefined {
  return task.completionRecords?.find((r) => r.date === date);
}

interface TaskCompletionModalProps {
  open: boolean;
  task: WeeklyTaskItem | null;
  childId?: string;
  date?: string;
  onClose: () => void;
  onSubmit: (taskId: string, input: TaskCompletionInput) => Promise<void>;
}

export default function TaskCompletionModal({
  open,
  task,
  childId,
  date: dateProp,
  onClose,
  onSubmit,
}: TaskCompletionModalProps) {
  const date = dateProp && /^\d{4}-\d{2}-\d{2}$/.test(dateProp) ? dateProp : getTodayStr();
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
  const [audioUrls, setAudioUrls] = useState<string[]>([]);
  const [audioTranscript, setAudioTranscript] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setStatus(latestRecord?.status ?? task?.status ?? 'pending');
    setProgress(latestRecord?.progress ?? (task?.status === 'done' ? 100 : 0));
    setActualDurationMinutes(latestRecord?.actualDurationMinutes ?? 0);
    setQuality(latestRecord?.quality ?? null);
    setNote(latestRecord?.note ?? '');
    setImageUrls(latestRecord?.imageUrls ?? []);
    setAudioUrls(latestRecord?.audioUrls ?? []);
    setUploadError(null);
    setAudioTranscript(latestRecord?.audioTranscript ?? '');
  }, [open, latestRecord, task]);

  useEffect(() => {
    if (status === 'done') setProgress(100);
    else if (status === 'pending') setProgress(0);
  }, [status]);

  const handleRemoveImage = (url: string) => {
    setImageUrls(imageUrls.filter((u) => u !== url));
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', task?.id ?? 'unknown');
    if (childId) formData.append('childId', childId);
    formData.append('date', date);

    const res = await fetch('/api/upload/task-evidence', {
      method: 'POST',
      body: formData,
      credentials: 'same-origin',
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || '上传失败');
    }
    return data.url as string;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!task) return;

    setUploading(true);
    setUploadError(null);

    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const url = await uploadFile(file);
        if (!imageUrls.includes(url)) {
          newUrls.push(url);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : '上传失败';
        setUploadError(message);
        console.error('[TaskCompletionModal] upload error:', err);
      }
    }

    if (newUrls.length > 0) {
      setImageUrls((prev) => [...prev, ...newUrls]);
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleRemoveAudio = (url: string) => {
    setAudioUrls(audioUrls.filter((u) => u !== url));
    if (audioUrls.length <= 1) {
      setAudioTranscript('');
    }
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
        audioUrls,
        audioTranscript,
        capabilityProgress: latestRecord?.capabilityProgress ?? [],
        quantityIncrement: latestRecord?.quantityIncrement ?? 0,
        checklistProgress: latestRecord?.checklistProgress ?? [],
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
      icon="CheckCircle2"
      iconClassName="bg-accent"
      colorScheme="accent"
      size="md"
      zIndex={110}
      footer={
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="secondary"
            size="md"
            className="flex-1"
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            variant="primary"
            size="md"
            className="flex-1"
          >
            {submitting ? '保存中...' : '保存记录'}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Status selector */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
            <Icon name="AlertCircle" size="xs" />
            完成状态
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['done', 'partially_done', 'pending'] as TaskStatus[]).map((s) => {
              const config = statusConfig[s];
              const StatusIcon = config.icon;
              const active = status === s;
              return (
                <Button
                  key={s}
                  onClick={() => setStatus(s)}
                  variant="secondary"
                  size="sm"
                  className={`flex-1 gap-1.5 ${
                    active
                      ? `${config.bg} ${config.color}`
                      : 'hover:bg-surface-light border-border-default bg-surface text-text-tertiary hover:border-border-strong'
                  }`}
                >
                  <Icon name={StatusIcon} size="xs" />
                  {config.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Progress */}
        {status === 'partially_done' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-text-secondary">完成进度</label>
              <span className="text-sm font-bold tabular-nums text-text-primary">{progress}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={progress}
              onChange={(e) => setProgress(parseInt(e.target.value, 10))}
              className="bg-surface-light h-2 w-full cursor-pointer appearance-none rounded-lg accent-primary"
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
            <label className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
              <Icon name="Clock" size="xs" />
              实际耗时（分钟）
            </label>
            <input
              type="number"
              min={0}
              value={actualDurationMinutes || ''}
              onChange={(e) => setActualDurationMinutes(parseInt(e.target.value || '0', 10))}
              placeholder="0"
              className="focus:border-primary/50 w-full rounded-xl border border-border-default bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
              <Icon name="Award" size="xs" />
              完成质量
            </label>
            <Select
              value={quality ?? ''}
              onChange={(e) => setQuality((e.target.value as TaskCompletionQuality) || null)}
              placeholder="不评价"
              size="md"
              className="bg-surface"
              options={(Object.keys(qualityConfig) as TaskCompletionQuality[]).map((q) => ({
                value: q,
                label: qualityConfig[q].label,
              }))}
            />
          </div>
        </div>

        {/* Note */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
            <Icon name="MessageSquare" size="xs" />
            备注 / 反思
          </label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="记录了什么？遇到了什么问题？"
            rows={3}
            resize="none"
            className="focus:border-primary/50 border-border-default bg-surface px-3 py-2.5 text-text-primary"
          />
        </div>

        {/* Images */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
            <Icon name="Image" size="xs" />
            佐证图片
          </label>
          <label
            className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-3 transition-colors ${
              uploading
                ? 'bg-surface/50 cursor-not-allowed border-border-default text-text-muted'
                : 'hover:border-primary/50 hover:bg-surface-light border-border-default bg-surface text-text-secondary'
            }`}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? (
              <>
                <span className="border-primary/30 size-4 animate-spin rounded-full border-2 border-t-primary" />
                <span className="text-sm">上传中...</span>
              </>
            ) : (
              <>
                <Icon name="Image" size="sm" />
                <span className="text-sm">点击上传照片</span>
              </>
            )}
          </label>
          {uploadError && (
            <p className="flex items-center gap-1 text-xs text-error">
              <Icon name="AlertCircle" size="xs" />
              {uploadError}
            </p>
          )}
          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {imageUrls.map((url) => (
                <div
                  key={url}
                  className="group relative size-20 overflow-hidden rounded-lg border border-border-default bg-surface"
                >
                  <img src={url} alt="佐证图片" className="size-full object-cover" />
                  <Button
                    onClick={() => handleRemoveImage(url)}
                    variant="ghost"
                    size="xs"
                    className="bg-surface/80 absolute right-0.5 top-0.5 rounded p-0.5 text-text-muted hover:text-error"
                    aria-label="移除佐证图片"
                  >
                    <Icon name="X" size="xs" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audio evidence from miniapp */}
        {audioUrls.length > 0 && (
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
              <Icon name="Mic" size="xs" />
              语音记录
            </label>
            <div className="flex flex-wrap gap-2">
              {audioUrls.map((url) => (
                <div
                  key={url}
                  className="group flex max-w-full items-center gap-2 rounded-lg border border-border-default bg-surface px-2.5 py-1.5 text-xs text-text-tertiary"
                >
                  <audio src={url} controls className="h-6 max-w-[220px]" />
                  <Button
                    onClick={() => handleRemoveAudio(url)}
                    variant="ghost"
                    size="xs"
                    className="hover:bg-error/10 rounded p-0.5 text-text-muted hover:text-error"
                    aria-label="移除语音记录"
                  >
                    <Icon name="X" size="xs" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Voice transcript */}
        {audioTranscript && (
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
              <Icon name="FileText" size="xs" />
              语音转文字
            </label>
            <div className="rounded-xl border border-border-default bg-surface px-3 py-2.5 text-xs leading-relaxed text-text-tertiary">
              {audioTranscript}
            </div>
          </div>
        )}

        {/* Preview */}
        <CommandCard className="bg-surface/50 p-3.5">
          <p className="mb-2 text-xs font-medium text-text-secondary">记录预览</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span
              className={`rounded-lg border px-2 py-1 ${statusConfig[status].bg} ${statusConfig[status].color}`}
            >
              {statusConfig[status].label}
            </span>
            {status === 'partially_done' && (
              <span className="rounded-lg border border-border-default bg-surface px-2 py-1 text-text-secondary">
                进度 {progress}%
              </span>
            )}
            {actualDurationMinutes > 0 && (
              <span className="rounded-lg border border-border-default bg-surface px-2 py-1 text-text-secondary">
                {actualDurationMinutes} 分钟
              </span>
            )}
            {quality && (
              <span className={`rounded-lg border px-2 py-1 ${qualityConfig[quality].color}`}>
                {qualityConfig[quality].label}
              </span>
            )}
          </div>
          {note && <p className="mt-2 line-clamp-2 text-xs text-text-tertiary">{note}</p>}
        </CommandCard>
      </div>
    </Modal>
  );
}
