'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Library,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Save,
  Loader2,
  BookOpen,
  Calculator,
  Languages,
  Backpack,
  Dumbbell,
  Palette,
  GraduationCap,
  Sparkles,
  Filter,
} from 'lucide-react';
import {
  TaskTemplate,
  TaskCategory,
} from '@/lib/storage.types';
import {
  TASK_CATEGORY_LABELS,
} from '@/lib/taskTemplates';
import { getCategoryColorClass } from '@/lib/taskAlignment';
import SettingsSection from './SettingsSection';

const categoryIcons: Record<TaskCategory, typeof BookOpen> = {
  chinese: BookOpen,
  math: Calculator,
  english: Languages,
  school: Backpack,
  reading: BookOpen,
  sport: Dumbbell,
  interest: Palette,
  other: GraduationCap,
};

const allCategories: TaskCategory[] = [
  'chinese',
  'math',
  'english',
  'school',
  'reading',
  'sport',
  'interest',
  'other',
];

const routeOptions = [
  { value: 'sanchu_gongban', label: '三公公办' },
  { value: 'sanchu_minban', label: '三公民办' },
  { value: 'sanchu_guoji', label: '三公国际' },
  { value: 'zhongkao_putong', label: '中考普通' },
  { value: 'zhongkao_tese', label: '中考特色' },
  { value: 'gaokao_zongping', label: '高考综评' },
  { value: 'gaokao_qiangji', label: '高考强基' },
  { value: 'gongban_duikou', label: '公办对口' },
];

const emptyTemplate: Omit<TaskTemplate, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
  title: '',
  category: 'school',
  gradeMin: 1,
  gradeMax: 12,
  duration: '30分钟',
  materials: [],
  description: '',
  routeTags: [],
  milestoneTag: '',
  source: 'user',
  isActive: true,
};

export default function TaskLibrarySection() {
  const shouldReduceMotion = useReducedMotion();
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'all'>('all');
  const [filterSource, setFilterSource] = useState<'all' | 'system' | 'user'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TaskTemplate | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/task-templates');
      if (!res.ok) throw new Error('加载失败');
      const data = await res.json();
      setTemplates(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
      const matchesSource = filterSource === 'all' || t.source === filterSource;
      return matchesSearch && matchesCategory && matchesSource;
    });
  }, [templates, search, filterCategory, filterSource]);

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (tpl: TaskTemplate) => {
    setEditing(tpl);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个任务模板吗？删除后无法恢复。')) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/api/task-templates/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('删除失败');
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除失败');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = async (data: typeof emptyTemplate) => {
    try {
      setSaving(true);
      const payload = {
        ...data,
        materials: data.materials.filter(Boolean),
        routeTags: data.routeTags.filter(Boolean),
      };

      if (editing) {
        const res = await fetch(`/api/task-templates/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('保存失败');
        const updated = await res.json();
        setTemplates((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
        );
      } else {
        const res = await fetch('/api/task-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('创建失败');
        const created = await res.json();
        setTemplates((prev) => [created, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <SettingsSection
        title="任务库管理"
        description="预设任务模板，生成周计划时可直接选用。系统模板可修改，也可添加自己的专属任务。"
      >
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索任务名称或描述"
              className="w-full pl-9 pr-3 py-2 text-xs bg-surface-light border border-border-default rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-text-tertiary" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as TaskCategory | 'all')}
              className="text-xs bg-surface-light border border-border-default rounded-lg px-2 py-2 text-text-primary focus:outline-none focus:border-primary/50"
            >
              <option value="all">全部分类</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {TASK_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value as typeof filterSource)}
              className="text-xs bg-surface-light border border-border-default rounded-lg px-2 py-2 text-text-primary focus:outline-none focus:border-primary/50"
            >
              <option value="all">全部来源</option>
              <option value="system">系统预设</option>
              <option value="user">自定义</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-text-secondary text-sm">
            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
            加载任务库...
          </div>
        ) : error ? (
          <div className="py-8 text-center text-danger text-sm">{error}</div>
        ) : filteredTemplates.length === 0 ? (
          <div className="py-8 text-center text-text-secondary text-sm">
            未找到匹配的任务模板
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filteredTemplates.map((tpl) => {
              const CategoryIcon = categoryIcons[tpl.category];
              return (
                <motion.div
                  key={tpl.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group rounded-xl bg-surface-light border border-border-subtle hover:border-border-default transition-all p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${getCategoryColorClass(
                        tpl.category
                      )}`}
                    >
                      <CategoryIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-text-primary truncate">
                          {tpl.title}
                        </h3>
                        {tpl.source === 'system' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20 shrink-0">
                            系统预设
                          </span>
                        )}
                        {tpl.source === 'user' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 shrink-0">
                            自定义
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-text-secondary mb-2 line-clamp-2">
                        {tpl.description || '暂无描述'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-text-secondary">
                        <span className="px-1.5 py-0.5 rounded bg-surface">
                          {TASK_CATEGORY_LABELS[tpl.category]}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-surface">
                          {tpl.duration}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-surface">
                          {tpl.gradeMin}-{tpl.gradeMax} 年级
                        </span>
                        {tpl.milestoneTag && (
                          <span className="px-1.5 py-0.5 rounded bg-warning/10 text-warning border border-warning/20">
                            {tpl.milestoneTag}
                          </span>
                        )}
                      </div>
                      {tpl.routeTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tpl.routeTags.map((tag) => {
                            const routeLabel = routeOptions.find((r) => r.value === tag)?.label || tag;
                            return (
                              <span
                                key={tag}
                                className="text-[9px] px-1.5 py-0.5 rounded bg-surface text-text-tertiary"
                              >
                                {routeLabel}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border-subtle">
                    <button
                      onClick={() => handleEdit(tpl)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface text-text-secondary text-xs hover:bg-surface-light transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(tpl.id)}
                      disabled={deletingId === tpl.id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-danger/10 text-danger text-xs hover:bg-danger/15 transition-colors disabled:opacity-50"
                    >
                      {deletingId === tpl.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                      删除
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <button
          onClick={handleAdd}
          className="w-full mt-4 py-2.5 rounded-xl border border-dashed border-border-default text-text-tertiary hover:text-text-secondary hover:border-border-strong hover:bg-surface-light transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          添加自定义任务
        </button>
      </SettingsSection>

      <AnimatePresence>
        {modalOpen && (
          <TaskTemplateModal
            initial={editing}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            saving={saving}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface TaskTemplateModalProps {
  initial: TaskTemplate | null;
  onClose: () => void;
  onSave: (data: typeof emptyTemplate) => void;
  saving: boolean;
}

function TaskTemplateModal({ initial, onClose, onSave, saving }: TaskTemplateModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const [form, setForm] = useState(() =>
    initial
      ? {
          title: initial.title,
          category: initial.category,
          gradeMin: initial.gradeMin,
          gradeMax: initial.gradeMax,
          duration: initial.duration,
          materials: initial.materials,
          description: initial.description ?? '',
          routeTags: initial.routeTags,
          milestoneTag: initial.milestoneTag ?? '',
          source: initial.source,
          isActive: initial.isActive,
        }
      : { ...emptyTemplate }
  );

  const updateField = <K extends keyof typeof form>(
    field: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleRouteTag = (tag: string) => {
    setForm((prev) => {
      const has = prev.routeTags.includes(tag);
      return {
        ...prev,
        routeTags: has ? prev.routeTags.filter((t) => t !== tag) : [...prev.routeTags, tag],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave(form);
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={shouldReduceMotion ? false : { scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-template-title"
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl glass border border-border-subtle p-6 sm:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center">
              {initial ? <Pencil className="w-5 h-5 text-text-primary" /> : <Plus className="w-5 h-5 text-text-primary" />}
            </div>
            <div>
              <h2 id="task-template-title" className="text-xl font-bold font-display">
                {initial ? '编辑任务模板' : '新增任务模板'}
              </h2>
              <p className="text-xs text-text-secondary">
                {initial ? '修改后所有未来周计划引用都会更新' : '创建后可在周任务中一键选用'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface text-text-tertiary focus-ring"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-text-tertiary mb-1.5">
              任务名称 <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="例如：完成学校作业"
              className="w-full text-sm bg-surface-light border border-border-default rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">分类</label>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value as TaskCategory)}
                className="w-full text-sm bg-surface-light border border-border-default rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary/50"
              >
                {allCategories.map((c) => (
                  <option key={c} value={c}>
                    {TASK_CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">参考时长</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => updateField('duration', e.target.value)}
                placeholder="30分钟"
                className="w-full text-sm bg-surface-light border border-border-default rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">最低年级</label>
              <input
                type="number"
                min={1}
                max={12}
                value={form.gradeMin}
                onChange={(e) => updateField('gradeMin', parseInt(e.target.value || '1', 10))}
                className="w-full text-sm bg-surface-light border border-border-default rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">最高年级</label>
              <input
                type="number"
                min={1}
                max={12}
                value={form.gradeMax}
                onChange={(e) => updateField('gradeMax', parseInt(e.target.value || '12', 10))}
                className="w-full text-sm bg-surface-light border border-border-default rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-text-tertiary mb-1.5">任务描述</label>
            <textarea
              value={form.description ?? ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="简要说明任务内容和目标"
              rows={3}
              className="w-full text-sm bg-surface-light border border-border-default rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs text-text-tertiary mb-1.5">所需材料（用逗号分隔）</label>
            <input
              type="text"
              value={form.materials.join('，')}
              onChange={(e) =>
                updateField(
                  'materials',
                  e.target.value.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
                )
              }
              placeholder="例如：课本，作业本，铅笔"
              className="w-full text-sm bg-surface-light border border-border-default rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="block text-xs text-text-tertiary mb-1.5">关联里程碑标签</label>
            <input
              type="text"
              value={form.milestoneTag ?? ''}
              onChange={(e) => updateField('milestoneTag', e.target.value)}
              placeholder="例如：AMC8 / 古诗文大会"
              className="w-full text-sm bg-surface-light border border-border-default rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="block text-xs text-text-tertiary mb-2">适用路线（不选则所有路线通用）</label>
            <div className="flex flex-wrap gap-2">
              {routeOptions.map((route) => {
                const selected = form.routeTags.includes(route.value);
                return (
                  <button
                    key={route.value}
                    type="button"
                    onClick={() => toggleRouteTag(route.value)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                      selected
                        ? 'bg-primary/15 text-primary border border-primary/30'
                        : 'bg-surface-light text-text-secondary border border-border-subtle hover:bg-surface'
                    }`}
                  >
                    {selected && <Sparkles className="w-3 h-3 inline-block mr-1" />}
                    {route.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-text-secondary hover:text-text-primary transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving || !form.title.trim()}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-secondary to-secondary-glow text-text-primary font-semibold hover:shadow-glow-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              保存
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
