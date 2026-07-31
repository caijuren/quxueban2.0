'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, Loader2, Sparkles } from 'lucide-react';
import { Capability } from '@/lib/storage.types';
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
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Capability | null>(null);
  const [form, setForm] = useState<Partial<Capability>>({ ...emptyCapability });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCapabilities = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/capabilities');
      if (!res.ok) throw new Error('加载失败');
      const data = await res.json();
      setCapabilities(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCapabilities();
  }, [fetchCapabilities]);

  const grouped = capabilities.reduce((acc, cap) => {
    const key = cap.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(cap);
    return acc;
  }, {} as Record<string, Capability[]>);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.category) return;

    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        category: form.category,
        description: form.description?.trim() || null,
      };

      let updated: Capability;
      if (editing) {
        const res = await fetch(`/api/capabilities/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('保存失败');
        updated = await res.json();
        setCapabilities((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const res = await fetch('/api/capabilities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('创建失败');
        updated = await res.json();
        setCapabilities((prev) => [...prev, updated]);
      }
      setModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个能力吗？已关联任务的能力删除后不会影响历史数据。')) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/api/capabilities/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('删除失败');
      setCapabilities((prev) => prev.filter((c) => c.id !== id));
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
      {loading ? (
        <div className="py-12 text-center text-slate-500 text-sm">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
          加载能力模型...
        </div>
      ) : error ? (
        <div className="py-8 text-center text-error text-sm">{error}</div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, caps]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 rounded-full bg-gradient-to-b from-primary to-secondary" />
                <h3 className="text-sm font-bold text-slate-200">
                  {categoryLabels[category] || category}
                </h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500">
                  {caps.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {caps.map((cap) => (
                  <motion.div
                    key={cap.id}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 hover:border-white/[0.12] transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-200">{cap.name}</span>
                        {cap.isSystem && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20">
                            系统
                          </span>
                        )}
                      </div>
                      {!cap.isSystem && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(cap)}
                            className="p-1 rounded-lg hover:bg-white/10 text-slate-400"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(cap.id)}
                            disabled={deletingId === cap.id}
                            className="p-1 rounded-lg hover:bg-white/10 text-error disabled:opacity-50"
                          >
                            {deletingId === cap.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                    {cap.description && (
                      <p className="text-xs text-slate-500 line-clamp-2">{cap.description}</p>
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
        className="w-full mt-6 py-2.5 rounded-xl border border-dashed border-white/[0.12] text-slate-400 hover:text-slate-200 hover:border-white/20 hover:bg-white/[0.03] transition-all flex items-center justify-center gap-2 text-sm"
      >
        <Plus className="w-4 h-4" />
        添加自定义能力
      </button>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={shouldReduceMotion ? false : { scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl glass border border-white/10 p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center">
                    {editing ? <Pencil className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
                  </div>
                  <h2 className="text-xl font-bold font-display">
                    {editing ? '编辑能力' : '添加能力'}
                  </h2>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/5 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">
                    能力名称 <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="例如：审题能力"
                    className="w-full text-sm bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">所属分类</label>
                  <select
                    value={form.category || 'general'}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as Capability['category'] }))}
                    className="w-full text-sm bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-primary/50"
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">描述</label>
                  <textarea
                    value={form.description || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="简要说明这个能力的含义和培养目标"
                    rows={3}
                    className="w-full text-sm bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !form.name?.trim()}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-secondary to-secondary-glow text-white font-semibold hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    保存
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 rounded-xl border border-dashed border-border-default bg-white/[0.02] p-4">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-secondary mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-300 mb-1">AI 分析基础</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              系统预设了 22 项常见能力。你可以添加自定义能力，但建议优先复用系统能力，
              这样 AI 在不同孩子之间才有可比较的成长数据。
            </p>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}
