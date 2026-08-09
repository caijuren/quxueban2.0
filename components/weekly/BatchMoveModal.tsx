'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@/components/ui/icon';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/select';
import {
  getISOWeek,
  getWeekRange,
  formatWeekLabel,
  parseWeekId,
  getCurrentWeekId,
} from '@/lib/weeklyTasks';

interface BatchMoveModalProps {
  isOpen: boolean;
  currentWeekId: string;
  onClose: () => void;
  onConfirm: (targetWeekId: string) => void;
}

function shiftWeekId(weekId: string, delta: number): string {
  const { start } = getWeekRange(weekId);
  const next = new Date(start);
  next.setDate(start.getDate() + delta * 7);
  return getISOWeek(next).weekId;
}

function buildWeekOptions(centerWeekId: string) {
  const currentWeekId = getCurrentWeekId();
  const currentStart = getWeekRange(currentWeekId).start;
  const oneWeek = 7 * 24 * 60 * 60 * 1000;

  return Array.from({ length: 9 }, (_, i) => i - 4).map((delta) => {
    const id = shiftWeekId(centerWeekId, delta);
    const { year, week } = parseWeekId(id);
    const start = getWeekRange(id).start;
    const weeksFromCurrent = Math.round((start.getTime() - currentStart.getTime()) / oneWeek);
    const relationLabel =
      weeksFromCurrent === 0
        ? '本周'
        : weeksFromCurrent === 1
          ? '下周'
          : weeksFromCurrent === -1
            ? '上周'
            : `${year}年第${String(week).padStart(2, '0')}周`;
    return {
      value: id,
      label: `${relationLabel} · ${formatWeekLabel(id)}`,
    };
  });
}

export function BatchMoveModal({ isOpen, currentWeekId, onClose, onConfirm }: BatchMoveModalProps) {
  const options = useMemo(
    () => buildWeekOptions(currentWeekId).filter((o) => o.value !== currentWeekId),
    [currentWeekId]
  );
  const [targetWeekId, setTargetWeekId] = useState(options[0]?.value ?? '');

  useEffect(() => {
    if (isOpen) {
      setTargetWeekId(options[0]?.value ?? '');
    }
  }, [isOpen, options]);

  const handleConfirm = () => {
    if (!targetWeekId) return;
    onConfirm(targetWeekId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="移动到其他周"
      subtitle="将选中的任务移动到目标周计划"
      icon="MoveRight"
      size="sm"
      footer={
        <div className="flex w-full items-center justify-end gap-3">
          <Button variant="ghost" size="md" onClick={onClose}>
            取消
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={handleConfirm}
            disabled={!targetWeekId}
            leftIcon={<Icon name="MoveRight" size="sm" />}
          >
            确认移动
          </Button>
        </div>
      }
    >
      <label className="mb-2 block text-sm font-medium text-text-secondary">目标周</label>
      <Select
        value={targetWeekId}
        onChange={(e) => setTargetWeekId(e.target.value)}
        options={options}
        size="md"
        className="bg-surface"
      />
      <p className="mt-3 text-xs text-text-muted">
        移动后会从当前周删除选中任务，并添加到目标周。目标周需已发布计划。
      </p>
    </Modal>
  );
}
