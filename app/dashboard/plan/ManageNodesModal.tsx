'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, Plus, Trash2, Save, Route } from 'lucide-react';
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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
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

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl flex flex-col overflow-hidden bg-surface border border-secondary/30 shadow-dropdown"
        >
          <div className="relative z-10 p-6 pb-4 border-b border-border-subtle flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                <Route className="w-5 h-5 text-text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display">管理节点</h3>
                <p className="text-xs text-text-tertiary">编辑各条路线的关键里程碑</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-surface-light flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-highlight transition-all"
              aria-label="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-8">
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
                  <h4 className="font-bold font-display text-text-primary">{plan.name}</h4>
                </div>

                <div className="space-y-2">
                  {plan.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={milestone.time}
                        onChange={(e) => updateMilestone(plan.id, index, 'time', e.target.value)}
                        placeholder="时间"
                        className="w-28 px-3 py-2 rounded-xl bg-surface-light border border-border-default text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-secondary transition-all"
                      />
                      <input
                        type="text"
                        value={milestone.task}
                        onChange={(e) => updateMilestone(plan.id, index, 'task', e.target.value)}
                        placeholder="节点任务"
                        className="flex-1 px-3 py-2 rounded-xl bg-surface-light border border-border-default text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-secondary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => removeMilestone(plan.id, index)}
                        className="w-9 h-9 rounded-xl bg-surface-light flex items-center justify-center text-text-secondary hover:text-danger hover:bg-danger/10 transition-all"
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

          <div className="relative z-10 p-6 pt-4 border-t border-border-subtle flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface-light text-text-secondary text-sm hover:bg-surface-highlight transition-all"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-secondary to-accent text-text-primary text-sm font-medium hover:shadow-glow-secondary transition-all"
            >
              <Save className="w-4 h-4" />
              保存节点
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
