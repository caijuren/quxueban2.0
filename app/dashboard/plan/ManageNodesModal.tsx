'use client';
import { Icon } from '@/components/ui/icon';
import Button from '@/components/ui/button';

import { useState, useEffect } from 'react';

import Modal from '@/components/ui/Modal';
import type { RoutePlan } from '@/lib/plans';

interface ManageNodesModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: RoutePlan[];
  onUpdate: (plans: RoutePlan[]) => void;
}

export default function ManageNodesModal({
  isOpen,
  onClose,
  plans,
  onUpdate,
}: ManageNodesModalProps) {
  const [draftPlans, setDraftPlans] = useState<RoutePlan[]>(plans);

  useEffect(() => {
    if (isOpen) {
      setDraftPlans(plans);
    }
  }, [isOpen, plans]);

  const updateMilestone = (
    planId: string,
    index: number,
    field: 'time' | 'task',
    value: string
  ) => {
    setDraftPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              milestones: plan.milestones.map((m, i) =>
                i === index ? { ...m, [field]: value } : m
              ),
            }
          : plan
      )
    );
  };

  const addMilestone = (planId: string) => {
    setDraftPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? { ...plan, milestones: [...plan.milestones, { time: '', task: '' }] }
          : plan
      )
    );
  };

  const removeMilestone = (planId: string, index: number) => {
    setDraftPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? { ...plan, milestones: plan.milestones.filter((_, i) => i !== index) }
          : plan
      )
    );
  };

  const handleSave = () => {
    onUpdate(draftPlans);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="管理节点"
      subtitle="编辑各条路线的关键里程碑"
      icon="Route"
      iconClassName="bg-accent"
      size="lg"
      colorScheme="violet"
      zIndex={100}
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            size="md"
            className="bg-surface-elevated text-text-tertiary hover:bg-surface-highlight"
          >
            取消
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            variant="primary"
            size="md"
            className="bg-accent text-text-primary"
          >
            <Icon name="Save" size="sm" />
            保存节点
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {draftPlans.map((plan) => (
          <div key={plan.id}>
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                  plan.type === 'primary'
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-secondary/10 border-secondary/30 text-secondary'
                }`}
              >
                {plan.type === 'primary' ? '主路线' : '备选路线'}
              </span>
              <h4 className="font-display font-bold text-text-secondary">{plan.name}</h4>
            </div>

            <div className="space-y-2">
              {plan.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={milestone.time}
                    onChange={(e) => updateMilestone(plan.id, index, 'time', e.target.value)}
                    placeholder="时间"
                    className="w-28 rounded-xl border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary placeholder-slate-500 transition-all focus:border-secondary focus:outline-none"
                  />
                  <input
                    type="text"
                    value={milestone.task}
                    onChange={(e) => updateMilestone(plan.id, index, 'task', e.target.value)}
                    placeholder="节点任务"
                    className="flex-1 rounded-xl border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary placeholder-slate-500 transition-all focus:border-secondary focus:outline-none"
                  />
                  <Button
                    type="button"
                    onClick={() => removeMilestone(plan.id, index)}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-error/10 size-9 text-text-muted hover:text-error"
                    aria-label="删除节点"
                  >
                    <Icon name="Trash2" size="sm" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              onClick={() => addMilestone(plan.id)}
              variant="link"
              size="sm"
              className="mt-3 text-secondary"
            >
              <Icon name="Plus" size="sm" />
              添加节点
            </Button>
          </div>
        ))}
      </div>
    </Modal>
  );
}
