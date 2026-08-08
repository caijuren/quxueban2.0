'use client';
import { Icon } from '@/components/ui/icon';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import { Capability } from '@/lib/storage.types';
import {
  useCapabilities,
  useCreateCapability,
  useUpdateCapability,
  useDeleteCapability,
} from '@/lib/hooks/useCapabilities';
import SettingsSection from './SettingsSection';

const categoryLabels: Record<string, string> = {
  chinese: '语文',
  math: '数学',
  english: '英语',
  general: '通用能力',
  exam: '考试能力',
  admission: '升学事务',
};

const categoryOptions = [
  { value: 'chinese', label: '语文' },
  { value: 'math', label: '数学' },
  { value: 'english', label: '英语' },
  { value: 'general', label: '通用能力' },
  { value: 'exam', label: '考试能力' },
  { value: 'admission', label: '升学事务' },
];

const emptyCapability: Partial<Capability> = {
  name: '',
  category: 'general',
  description: '',
};

export default function CapabilitySection() {
  const shouldReduceMotion = useReducedMotion();
  const { data: capabilities = [], isLoading, error: queryError } = useCapabilities();
  const createCapability = useCreateCapability();
  const updateCapability = useUpdateCapability();
  const deleteCapability = useDeleteCapability();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Capability | null>(null);
  const [form, setForm] = useState<Partial<Capability>>({ ...emptyCapability });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const grouped = capabilities.reduce(
    (acc, cap) => {
      const key = cap.category;
      if (!acc[key]) acc[key] = [];
      acc[key].push(cap);
      return acc;
    },
    {} as Record<string, Capability[]>
  );

  const handleAdd = () => {
    setEditing(null);
    setForm({ ...emptyCapability });
    setModalOpen(true);
  };

  const handleEdit = (cap: Capability) => {
    setEditing(cap);
    setForm({ ...cap });
    setModalOpen(true);
  };

  const isSaving = createCapability.isPending || updateCapability.isPending;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.category) return;

    const payload = {
      name: form.name.trim(),
      category: form.category,
      description: form.description?.trim() || null,
    };

    try {
      if (editing) {
        await updateCapability.mutateAsync({ id: editing.id, data: payload });
      } else {
        await createCapability.mutateAsync(payload);
      }
      setModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : '保存失败');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个能力吗？已关联任务的能力删除后不会影响历史数据。')) return;
    try {
      setDeletingId(id);
      await deleteCapability.mutateAsync(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除失败');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <SettingsSection
      title="能力模型"
      description="定义孩子需要培养的能力维度，任务库中的任务可以关联到具体能力，供 AI 分析成长轨迹。"
    >
      {isLoading ? (
        <div className="py-12 text-center text-sm text-text-muted">
          <Icon name="Loader2" size="md" animate="spin" className="mx-auto mb-2" />
          加载能力模型...
        </div>
      ) : queryError ? (
        <div className="py-8 text-center text-sm text-error">
          {queryError instanceof Error ? queryError.message : '加载失败'}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, caps]) => (
            <div key={category}>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-4 w-1 rounded-full bg-primary" />
                <h3 className="text-sm font-bold text-text-secondary">
                  {categoryLabels[category] || category}
                </h3>
                <span className="rounded bg-surface-elevated px-1.5 py-0.5 text-2xs text-text-muted">
                  {caps.length}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {caps.map((cap) => (
                  <motion.div
                    key={cap.id}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group rounded-xl border border-border-subtle bg-surface-elevated p-4 transition-all hover:border-border-default"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-secondary">{cap.name}</span>
                        {cap.isSystem && (
                          <span className="bg-secondary/10 border-secondary/20 rounded border px-1.5 py-0.5 text-2xs text-secondary">
                            系统
                          </span>
                        )}
                      </div>
                      {!cap.isSystem && (
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => handleEdit(cap)}
                            className="rounded-lg p-1 text-text-tertiary hover:bg-surface-highlight"
                          >
                            <Icon name="Pencil" size="xs" />
                          </button>
                          <button
                            onClick={() => handleDelete(cap.id)}
                            disabled={deletingId === cap.id}
                            className="rounded-lg p-1 text-error hover:bg-surface-highlight disabled:opacity-50"
                          >
                            {deletingId === cap.id ? (
                              <Icon name="Loader2" size="xs" animate="spin" />
                            ) : (
                              <Icon name="Trash2" size="xs" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                    {cap.description && (
                      <p className="line-clamp-2 text-xs text-text-muted">{cap.description}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleAdd}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.12] py-2.5 text-sm text-text-tertiary transition-all hover:border-border-default hover:bg-surface-elevated hover:text-text-secondary"
      >
        <Icon name="Plus" size="sm" />
        添加自定义能力
      </button>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={shouldReduceMotion ? false : { scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-border-default bg-surface-elevated p-6 sm:p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-secondary">
                    {editing ? (
                      <Icon name="Pencil" size="md" className="text-text-primary" />
                    ) : (
                      <Icon name="Plus" size="md" className="text-text-primary" />
                    )}
                  </div>
                  <h2 className="font-display text-xl font-bold">
                    {editing ? '编辑能力' : '添加能力'}
                  </h2>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg p-2 text-text-tertiary hover:bg-surface-elevated"
                >
                  <Icon name="X" size="md" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs text-text-tertiary">
                    能力名称 <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="例如：审题能力"
                    className="focus:border-primary/50 w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs text-text-tertiary">所属分类</label>
                  <select
                    value={form.category || 'general'}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        category: e.target.value as Capability['category'],
                      }))
                    }
                    className="focus:border-primary/50 w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary focus:outline-none"
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs text-text-tertiary">描述</label>
                  <textarea
                    value={form.description || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="简要说明这个能力的含义和培养目标"
                    rows={3}
                    className="focus:border-primary/50 w-full resize-none rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-border-subtle pt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-text-tertiary transition-colors hover:text-text-secondary"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || !form.name?.trim()}
                    className="flex items-center gap-2 rounded-xl bg-secondary px-6 py-2 font-semibold text-text-primary transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Icon name="Loader2" size="sm" animate="spin" />
                    ) : (
                      <Icon name="Save" size="sm" />
                    )}
                    保存
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 rounded-xl border border-dashed border-border-default bg-surface-elevated p-4">
        <div className="flex items-start gap-2">
          <Icon name="Sparkles" size="sm" className="mt-0.5 text-secondary" />
          <div>
            <p className="mb-1 text-sm font-medium text-text-secondary">AI 分析基础</p>
            <p className="text-xs leading-relaxed text-text-muted">
              系统预设了 22 项常见能力。你可以添加自定义能力，但建议优先复用系统能力， 这样 AI
              在不同孩子之间才有可比较的成长数据。
            </p>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}
