'use client';
import { Icon } from '@/components/ui/icon';
import Button from '@/components/ui/button';

import { useMemo } from 'react';
import Image from 'next/image';

import Modal from '@/components/ui/Modal';
import { WeeklyTaskItem, TaskCompletionQuality } from '@/lib/storage.types';

const qualityLabelMap: Record<TaskCompletionQuality, string> = {
  excellent: '优秀',
  good: '良好',
  average: '一般',
  needs_work: '需努力',
};

interface DailyVictoryModalProps {
  open: boolean;
  childName: string;
  date: string;
  tasks: WeeklyTaskItem[];
  onClose: () => void;
  onPush: () => void;
  pushing: boolean;
  pushed: boolean;
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function getTodayRecord(task: WeeklyTaskItem, date: string) {
  return task.completionRecords?.find((r) => r.date === date);
}

export default function DailyVictoryModal({
  open,
  childName,
  date,
  tasks,
  onClose,
  onPush,
  pushing,
  pushed,
}: DailyVictoryModalProps) {
  const isAllDone = useMemo(
    () => tasks.length > 0 && tasks.every((t) => t.status === 'done'),
    [tasks]
  );

  const stats = useMemo(() => {
    const targetDate = date || getTodayStr();
    const doneTasks = tasks.filter((t) => t.status === 'done');
    const totalMinutes = doneTasks.reduce((sum, t) => {
      const record = getTodayRecord(t, targetDate);
      return sum + (record?.actualDurationMinutes || 0);
    }, 0);

    const qualities = doneTasks
      .map((t) => getTodayRecord(t, targetDate)?.quality)
      .filter(Boolean) as TaskCompletionQuality[];

    let avgQuality = '-';
    if (qualities.length > 0) {
      const scoreMap: Record<TaskCompletionQuality, number> = {
        excellent: 4,
        good: 3,
        average: 2,
        needs_work: 1,
      };
      const avg = qualities.reduce((sum, q) => sum + scoreMap[q], 0) / qualities.length;
      if (avg >= 3.5) avgQuality = '优秀';
      else if (avg >= 2.5) avgQuality = '良好';
      else if (avg >= 1.5) avgQuality = '一般';
      else avgQuality = '需努力';
    }

    const imageUrls = doneTasks.flatMap((t) => getTodayRecord(t, targetDate)?.imageUrls || []);

    const audioUrls = doneTasks.flatMap((t) => getTodayRecord(t, targetDate)?.audioUrls || []);

    const audioTranscript = doneTasks
      .map((t) => getTodayRecord(t, targetDate)?.audioTranscript)
      .filter(Boolean)
      .join('\n');

    return {
      doneCount: doneTasks.length,
      totalMinutes,
      avgQuality,
      imageUrls,
      audioUrls,
      audioTranscript,
    };
  }, [tasks, date]);

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={isAllDone ? '今日任务全部完成' : '今日学习简报'}
      subtitle={`${childName} · ${date}`}
      icon="Trophy"
      iconClassName="bg-gradient-to-br from-amber-400 to-orange-500"
      colorScheme="gold"
      size="md"
      zIndex={120}
      footer={
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="secondary"
            size="md"
            className="flex-1"
          >
            关闭
          </Button>
          <Button
            onClick={onPush}
            disabled={pushing || pushed}
            variant="primary"
            size="md"
            className="flex-1"
          >
            {pushing ? (
              '推送中...'
            ) : pushed ? (
              '已推送'
            ) : (
              <>
                <Icon name="Send" size="sm" />
                推送到钉钉
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Hero badge */}
        <div className="flex flex-col items-center py-4">
          <div className="mb-4 flex size-20 items-center justify-center rounded-full border-2 border-amber-400/30 bg-gradient-to-br from-amber-400/20 to-orange-500/20">
            <Icon name="Trophy" size="xl" className="text-amber-400" />
          </div>
          <p className="text-lg font-bold text-text-primary">
            {isAllDone ? '太棒了！' : '今日学习简报'}
          </p>
          <p className="text-sm text-text-tertiary">
            {isAllDone ? '所有任务都已打卡完成' : `已完成 ${stats.doneCount} 项任务，继续加油`}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border-default bg-surface p-4 text-center">
            <p className="font-display text-2xl font-bold tabular-nums text-primary">
              {stats.doneCount}
            </p>
            <p className="mt-1 text-xs text-text-tertiary">完成任务</p>
          </div>
          <div className="rounded-xl border border-border-default bg-surface p-4 text-center">
            <p className="font-display text-2xl font-bold tabular-nums text-primary">
              {stats.totalMinutes}
            </p>
            <p className="mt-1 text-xs text-text-tertiary">总投入分钟</p>
          </div>
          <div className="rounded-xl border border-border-default bg-surface p-4 text-center">
            <p className="font-display text-2xl font-bold tabular-nums text-primary">
              {stats.avgQuality}
            </p>
            <p className="mt-1 text-xs text-text-tertiary">平均质量</p>
          </div>
        </div>

        {/* Photos */}
        {stats.imageUrls.length > 0 && (
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
              <Icon name="Image" size="xs" />
              今日打卡照片
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {stats.imageUrls.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border-default bg-surface"
                >
                  <Image
                    src={url}
                    alt={`打卡照片 ${idx + 1}`}
                    fill
                    sizes="64px"
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audio recordings */}
        {stats.audioUrls.length > 0 && (
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
              <Icon name="Mic" size="xs" />
              今日语音记录
            </p>
            <div className="flex flex-col gap-2">
              {stats.audioUrls.map((url, idx) => (
                <audio key={`${url}-${idx}`} src={url} controls className="h-8 w-full" />
              ))}
            </div>
          </div>
        )}

        {/* Voice transcript */}
        {stats.audioTranscript && (
          <div className="space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
              <Icon name="FileText" size="xs" />
              语音转文字
            </p>
            <div className="whitespace-pre-line rounded-lg border border-border-default bg-surface p-3 text-xs leading-relaxed text-text-tertiary">
              {stats.audioTranscript}
            </div>
          </div>
        )}

        {pushed && <p className="text-center text-xs text-success">今日简报已成功推送到钉钉</p>}
      </div>
    </Modal>
  );
}
