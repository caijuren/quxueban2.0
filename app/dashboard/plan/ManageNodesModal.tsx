'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Route } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import type { RoutePlan } from '@/lib/plans';

interface ManageNodesModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: RoutePlan[];
  onUpdate: (plans: RoutePlan[]) => void;
}

export default function ManageNodesModal({ isOpen, onClose, plans, onUpdate }: ManageNodesModalProps) {
  const [draftPlans, setDraftPlans] = useState<RoutePlan[]>(plans);

  useEffect(() => {
    if (isOpen) {
      setDraftPlans(plans);
    }
  }, [isOpen, plans]);

  const updateMilestone = (planId: string, index: number, field: 'time' | 'task', value: string) => {
    setDraftPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              milestones: plan.milestones.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
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
      icon={Route}
      iconClassName="bg-accent"
      size="lg"
      colorScheme="violet"
      zIndex={100}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-elevated text-text-tertiary text-sm hover:bg-surface-highlight transition-all"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-text-primary text-sm font-medium transition-all"
          >
            <Save className="w-4 h-4" />
            保存节点
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {draftPlans.map((plan) => (
          <div key={plan.id}>
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                  plan.type === 'primary'
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-secondary/10 border-secondary/30 text-secondary'
                }`}
              >
                {plan.type === 'primary' ? '主路线' : '备选路线'}
              </span>
              <h4 className="font-bold font-display text-text-secondary">{plan.name}</h4>
            </div>

            <div className="space-y-2">
              {plan.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={milestone.time}
                    onChange={(e) => updateMilestone(plan.id, index, 'time', e.target.value)}
                    placeholder="时间"
                    className="w-28 px-3 py-2 rounded-xl bg-surface-elevated border border-border-default text-sm text-text-secondary placeholder-slate-500 focus:outline-none focus:border-secondary transition-all"
                  />
                  <input
                    type="text"
                    value={milestone.task}
                    onChange={(e) => updateMilestone(plan.id, index, 'task', e.target.value)}
                    placeholder="节点任务"
                    className="flex-1 px-3 py-2 rounded-xl bg-surface-elevated border border-border-default text-sm text-text-secondary placeholder-slate-500 focus:outline-none focus:border-secondary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => removeMilestone(plan.id, index)}
                    className="w-9 h-9 rounded-xl bg-surface-elevated flex items-center justify-center text-text-muted hover:text-error hover:bg-error/10 transition-all"
                    aria-label="删除节点"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addMilestone(plan.id)}
              className="mt-3 flex items-center gap-1.5 text-sm text-secondary hover:text-secondary-glow transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加节点
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
}
