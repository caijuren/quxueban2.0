'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { Trophy, Send, Image as ImageIcon } from 'lucide-react';
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
      const avg =
        qualities.reduce((sum, q) => sum + scoreMap[q], 0) / qualities.length;
      if (avg >= 3.5) avgQuality = '优秀';
      else if (avg >= 2.5) avgQuality = '良好';
      else if (avg >= 1.5) avgQuality = '一般';
      else avgQuality = '需努力';
    }

    const imageUrls = doneTasks.flatMap(
      (t) => getTodayRecord(t, targetDate)?.imageUrls || []
    );

    return {
      doneCount: doneTasks.length,
      totalMinutes,
      avgQuality,
      imageUrls,
    };
  }, [tasks, date]);

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={isAllDone ? '今日任务全部完成' : '今日学习简报'}
      subtitle={`${childName} · ${date}`}
      icon={Trophy}
      iconClassName="bg-gradient-to-br from-amber-400 to-orange-500"
      colorScheme="gold"
      size="md"
      zIndex={120}
      footer={
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-border-default text-sm font-medium text-text-secondary hover:bg-surface-light transition-colors"
          >
            关闭
          </button>
          <button
            onClick={onPush}
            disabled={pushing || pushed}
            className="flex-1 py-3 rounded-xl bg-primary text-text-primary text-sm font-medium hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
          >
            {pushing ? (
              '推送中...'
            ) : pushed ? (
              '已推送'
            ) : (
              <>
                <Send className="w-4 h-4" />
                推送到钉钉
              </>
            )}
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Hero badge */}
        <div className="flex flex-col items-center py-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 border-2 border-amber-400/30 flex items-center justify-center mb-4">
            <Trophy className="w-10 h-10 text-amber-400" />
          </div>
          <p className="text-lg font-bold text-text-primary">
            {isAllDone ? '太棒了！' : '今日学习简报'}
          </p>
          <p className="text-sm text-text-tertiary">
            {isAllDone
              ? '所有任务都已打卡完成'
              : `已完成 ${stats.doneCount} 项任务，继续加油`}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-4 rounded-xl bg-surface border border-border-default">
            <p className="text-2xl font-bold font-display text-primary tabular-nums">
              {stats.doneCount}
            </p>
            <p className="text-xs text-text-tertiary mt-1">完成任务</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-surface border border-border-default">
            <p className="text-2xl font-bold font-display text-primary tabular-nums">
              {stats.totalMinutes}
            </p>
            <p className="text-xs text-text-tertiary mt-1">总投入分钟</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-surface border border-border-default">
            <p className="text-2xl font-bold font-display text-primary tabular-nums">
              {stats.avgQuality}
            </p>
            <p className="text-xs text-text-tertiary mt-1">平均质量</p>
          </div>
        </div>

        {/* Photos */}
        {stats.imageUrls.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              今日打卡照片
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {stats.imageUrls.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="relative shrink-0 w-16 h-16 rounded-lg bg-surface border border-border-default overflow-hidden"
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

        {pushed && (
          <p className="text-xs text-center text-success">
            今日简报已成功推送到钉钉
          </p>
        )}
      </div>
    </Modal>
  );
}
