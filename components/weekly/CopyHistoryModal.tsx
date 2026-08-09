'use client';

import React, { useMemo } from 'react';
import { Icon } from '@/components/ui/icon';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/button';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/skeleton';
import { useWeeklyPlans } from '@/lib/hooks/useWeeklyPlans';
import { formatWeekLabel } from '@/lib/weeklyTasks';

interface CopyHistoryModalProps {
  childId: string;
  currentWeekId: string;
  onClose: () => void;
  onCopy: (sourceWeekId: string) => void;
}

export function CopyHistoryModal({ childId, currentWeekId, onClose, onCopy }: CopyHistoryModalProps) {
  const { data: plans = [], isLoading } = useWeeklyPlans(childId);
  const history = useMemo(
    () =>
      plans
        .filter((p) => p.weekId !== currentWeekId)
        .sort((a, b) => b.weekId.localeCompare(a.weekId)),
    [plans, currentWeekId]
  );

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="复制历史周计划"
      subtitle="选择历史周计划复制到当前周"
      icon="History"
      size="lg"
    >
      <div className="max-h-[60vh] space-y-2 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Skeleton variant="rounded" width={240} height={24} />
          </div>
        ) : history.length === 0 ? (
          <EmptyState scene="no-data" size="sm" />
        ) : (
          history.map((plan) => (
            <div
              key={plan.weekId}
              className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-elevated p-3"
            >
              <div>
                <p className="text-sm font-medium text-text-secondary">
                  {formatWeekLabel(plan.weekId)}
                </p>
                <p className="mt-0.5 text-2xs text-text-tertiary">
                  {plan.tasks.length} 个任务 ·{' '}
                  {plan.tasks.filter((t) => t.status === 'done').length} 已完成
                </p>
              </div>
              <Button
                onClick={() => onCopy(plan.weekId)}
                className="bg-secondary/10 hover:bg-secondary/20 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-secondary transition-colors"
                variant="secondary"
                size="sm"
              >
                <Icon name="Copy" size="xs" />
                复制
              </Button>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
