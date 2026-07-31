'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
  Backpack,
  Calculator,
  Dumbbell,
  Palette,
  GraduationCap,
  Sparkles,
  Filter,
  Archive,
  RotateCcw,
  Tag,
} from 'lucide-react';
import {
  TaskTemplate,
  TaskCategory,
  Capability,
  TaskCapabilityLink,
  AssessmentCriterion,
  TaskType,
  TaskFrequency,
} from '@/lib/storage.types';
import {
  TASK_CATEGORY_LABELS,
} from '@/lib/taskTemplates';
import { getCategoryColorClass } from '@/lib/taskAlignment';
import SettingsSection from './SettingsSection';

const categoryIcons: Record<TaskCategory, typeof BookOpen> = {
  school: Backpack,
  reading: BookOpen,
  sport: Dumbbell,
  interest: Palette,
  ability: Calculator,
  other: GraduationCap,
};

const allCategories: TaskCategory[] = [
  'school',
  'reading',
  'sport',
  'interest',
  'ability',
  'other',
];

const difficultyOptions = [
  { value: 'easy', label: '基础', color: 'bg-success/10 text-success border-success/20' },
  { value: 'medium', label: '提高', color: 'bg-warning/10 text-warning border-warning/20' },
  { value: 'hard', label: '挑战', color: 'bg-error/10 text-error border-error/20' },
] as const;

const semesterOptions = [
  { value: 'semester', label: '开学期' },
  { value: 'vacation', label: '寒暑假' },
  { value: 'exam', label: '考前冲刺' },
] as const;

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

const taskTypeOptions = [
  { value: 'daily', label: '日常任务' },
  { value: 'milestone', label: '里程碑任务' },
  { value: 'remedial', label: '补救任务' },
  { value: 'sprint', label: '冲刺任务' },
  { value: 'diagnostic', label: '诊断任务' },
] as const;

const frequencyOptions = [
  { value: 'once', label: '一次性' },
  { value: 'daily', label: '每天' },
  { value: 'weekly', label: '每周' },
  { value: 'custom', label: '自定义' },
] as const;

const capabilityCategoryLabels: Record<string, string> = {
  chinese: '语文',
  math: '数学',
  english: '英语',
  general: '通用能力',
  exam: '考试能力',
  admission: '升学事务',
};

const emptyTemplate: Omit<TaskTemplate, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'archivedAt' | 'useCount' | 'lastUsedAt'> = {
  title: '',
  category: 'school',
  duration: '30分钟',
  difficulty: 'medium',
  materials: [],
  description: '',
  routeTags: [],
  milestoneTag: '',
  semesterTag: '',
  tags: [],
  source: 'user',
  isActive: true,
  taskType: 'daily',
  frequency: 'once',
  customFrequency: null,
  assessmentCriteria: [],
  capabilityLinks: [],
};

export default function TaskLibrarySection() {
  const shouldReduceMotion = useReducedMotion();
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'all'>('all');
  const [filterSource, setFilterSource] = useState<'all' | 'system' | 'user'>('all');
  const [filterStatus, setFilterStatus] = useState<'active' | 'archived' | 'all'>('active');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TaskTemplate | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [archivingId, setArchivingId] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterCategory !== 'all') params.set('category', filterCategory);
      params.set('status', filterStatus);
      const res = await fetch(`/api/task-templates?${params.toString()}`);
      if (!res.ok) throw new Error('加载失败');
      const data = await res.json();
      setTemplates(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, [filterCategory, filterStatus]);

  const fetchCapabilities = useCallback(async () => {
    try {
      const res = await fetch('/api/capabilities');
      if (!res.ok) throw new Error('加载能力失败');
      const data = await res.json();
      setCapabilities(data);
    } catch {
      // 能力加载失败不阻塞任务库
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
    fetchCapabilities();
  }, [fetchTemplates, fetchCapabilities]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesSource = filterSource === 'all' || t.source === filterSource;
      return matchesSearch && matchesSource;
    });
  }, [templates, search, filterSource]);

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

  const handleArchive = async (id: string, archive: boolean) => {
    try {
      setArchivingId(id);
      const res = await fetch(`/api/task-templates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archive }),
      });
      if (!res.ok) throw new Error(archive ? '归档失败' : '恢复失败');
      const updated = await res.json();
      setTemplates((prev) =>
        filterStatus === 'active' && archive
          ? prev.filter((t) => t.id !== id)
          : prev.map((t) => (t.id === id ? updated : t))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : archive ? '归档失败' : '恢复失败');
    } finally {
      setArchivingId(null);
    }
  };

  const handleSave = async (data: typeof emptyTemplate) => {
    try {
      setSaving(true);
      const payload = {
        ...data,
        materials: data.materials.filter(Boolean),
        routeTags: data.routeTags.filter(Boolean),
        tags: data.tags.filter(Boolean),
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索任务名称或描述"
              className="w-full pl-9 pr-3 py-2 text-xs bg-white/5 border border-white/[0.08] rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as TaskCategory | 'all')}
              className="text-xs bg-white/5 border border-white/[0.08] rounded-lg px-2 py-2 text-slate-200 focus:outline-none focus:border-primary/50"
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
              className="text-xs bg-white/5 border border-white/[0.08] rounded-lg px-2 py-2 text-slate-200 focus:outline-none focus:border-primary/50"
            >
              <option value="all">全部来源</option>
              <option value="system">系统预设</option>
              <option value="user">自定义</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="text-xs bg-white/5 border border-white/[0.08] rounded-lg px-2 py-2 text-slate-200 focus:outline-none focus:border-primary/50"
            >
              <option value="active">使用中</option>
              <option value="archived">已归档</option>
              <option value="all">全部</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
            加载任务库...
          </div>
        ) : error ? (
          <div className="py-8 text-center text-error text-sm">{error}</div>
        ) : filteredTemplates.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">
            未找到匹配的任务模板
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredTemplates.map((tpl) => {
              const CategoryIcon = categoryIcons[tpl.category];
              const difficultyInfo = difficultyOptions.find((d) => d.value === (tpl.difficulty || 'medium'));
              const semesterInfo = semesterOptions.find((s) => s.value === tpl.semesterTag);
              const isArchived = !!tpl.archivedAt;
              return (
                <motion.div
                  key={tpl.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`group rounded-xl border transition-all p-3 ${
                    isArchived
                      ? 'bg-white/[0.015] border-white/[0.04] opacity-70'
                      : 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getCategoryColorClass(
                        tpl.category
                      )}`}
                    >
                      <CategoryIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-slate-200 truncate">
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
                        {isArchived && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-400 border border-slate-500/20 shrink-0">
                            已归档
                          </span>
                        )}
                        {tpl.taskType && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20 shrink-0">
                            {taskTypeOptions.find((t) => t.value === tpl.taskType)?.label || tpl.taskType}
                          </span>
                        )}
                        {tpl.capabilityLinks.length > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20 shrink-0">
                            {tpl.capabilityLinks.length} 项能力
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mb-1.5 line-clamp-1">
                        {tpl.description || '暂无描述'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                        <span className="px-1.5 py-0.5 rounded bg-white/5">
                          {TASK_CATEGORY_LABELS[tpl.category]}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-white/5">
                          {tpl.duration}
                        </span>
                        {difficultyInfo && (
                          <span className={`px-1.5 py-0.5 rounded border ${difficultyInfo.color}`}>
                            {difficultyInfo.label}
                          </span>
                        )}
                        {semesterInfo && (
                          <span className="px-1.5 py-0.5 rounded bg-info/10 text-info border border-info/20">
                            {semesterInfo.label}
                          </span>
                        )}
                        {tpl.milestoneTag && (
                          <span className="px-1.5 py-0.5 rounded bg-warning/10 text-warning border border-warning/20">
                            {tpl.milestoneTag}
                          </span>
                        )}
                      </div>
                      {tpl.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tpl.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500 flex items-center gap-0.5"
                            >
                              <Tag className="w-2.5 h-2.5" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {tpl.routeTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tpl.routeTags.map((tag) => {
                            const routeLabel = routeOptions.find((r) => r.value === tag)?.label || tag;
                            return (
                              <span
                                key={tag}
                                className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500"
                              >
                                {routeLabel}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-white/[0.06]">
                    <button
                      onClick={() => handleEdit(tpl)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-xs hover:bg-white/10 transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                      编辑
                    </button>
                    <button
                      onClick={() => handleArchive(tpl.id, !isArchived)}
                      disabled={archivingId === tpl.id}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-50 ${
                        isArchived
                          ? 'bg-success/10 text-success hover:bg-success/15'
                          : 'bg-slate-500/10 text-slate-400 hover:bg-slate-500/15'
                      }`}
                    >
                      {archivingId === tpl.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : isArchived ? (
                        <RotateCcw className="w-3 h-3" />
                      ) : (
                        <Archive className="w-3 h-3" />
                      )}
                      {isArchived ? '恢复' : '归档'}
                    </button>
                    <button
                      onClick={() => handleDelete(tpl.id)}
                      disabled={deletingId === tpl.id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-error/10 text-error text-xs hover:bg-error/15 transition-colors disabled:opacity-50"
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
          className="w-full mt-4 py-2.5 rounded-xl border border-dashed border-white/[0.12] text-slate-400 hover:text-slate-200 hover:border-white/20 hover:bg-white/[0.03] transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          添加自定义任务
        </button>
      </SettingsSection>

      <AnimatePresence>
        {modalOpen && (
          <TaskTemplateModal
            initial={editing}
            capabilities={capabilities}
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
  capabilities: Capability[];
  onClose: () => void;
  onSave: (data: typeof emptyTemplate) => void;
  saving: boolean;
}

function TaskTemplateModal({ initial, capabilities, onClose, onSave, saving }: TaskTemplateModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const [form, setForm] = useState(() =>
    initial
      ? {
          title: initial.title,
          category: initial.category,
          duration: initial.duration,
          difficulty: initial.difficulty ?? 'medium',
          materials: initial.materials,
          description: initial.description ?? '',
          routeTags: initial.routeTags,
          milestoneTag: initial.milestoneTag ?? '',
          semesterTag: initial.semesterTag ?? '',
          tags: initial.tags,
          source: initial.source,
          isActive: initial.isActive,
          taskType: initial.taskType ?? 'daily',
          frequency: initial.frequency ?? 'once',
          customFrequency: initial.customFrequency ?? null,
          assessmentCriteria: initial.assessmentCriteria ?? [],
          capabilityLinks: initial.capabilityLinks ?? [],
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

  const addCapabilityLink = (capabilityId: string) => {
    setForm((prev) => {
      if (prev.capabilityLinks.some((l) => l.capabilityId === capabilityId)) return prev;
      return {
        ...prev,
        capabilityLinks: [
          ...prev.capabilityLinks,
          { capabilityId, weight: 1, expectedProgress: 0 } as TaskCapabilityLink,
        ],
      };
    });
  };

  const updateCapabilityLink = (capabilityId: string, updates: Partial<TaskCapabilityLink>) => {
    setForm((prev) => ({
      ...prev,
      capabilityLinks: prev.capabilityLinks.map((l) =>
        l.capabilityId === capabilityId ? { ...l, ...updates } : l
      ),
    }));
  };

  const removeCapabilityLink = (capabilityId: string) => {
    setForm((prev) => ({
      ...prev,
      capabilityLinks: prev.capabilityLinks.filter((l) => l.capabilityId !== capabilityId),
    }));
  };

  const addAssessmentCriterion = () => {
    setForm((prev) => ({
      ...prev,
      assessmentCriteria: [...prev.assessmentCriteria, { metric: '', target: '', selfReport: true }],
    }));
  };

  const updateAssessmentCriterion = (index: number, updates: Partial<AssessmentCriterion>) => {
    setForm((prev) => ({
      ...prev,
      assessmentCriteria: prev.assessmentCriteria.map((c, i) => (i === index ? { ...c, ...updates } : c)),
    }));
  };

  const removeAssessmentCriterion = (index: number) => {
    setForm((prev) => ({
      ...prev,
      assessmentCriteria: prev.assessmentCriteria.filter((_, i) => i !== index),
    }));
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
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
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
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl glass border border-white/10 p-6 sm:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center">
              {initial ? <Pencil className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h2 id="task-template-title" className="text-xl font-bold font-display">
                {initial ? '编辑任务模板' : '新增任务模板'}
              </h2>
              <p className="text-xs text-slate-400">
                {initial ? '修改后所有未来周计划引用都会更新' : '创建后可在周计划中一键选用'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 focus-ring"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">
              任务名称 <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="例如：完成学校作业"
              className="w-full text-sm bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary/50"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">分类</label>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value as TaskCategory)}
                className="w-full text-sm bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-primary/50"
              >
                {allCategories.map((c) => (
                  <option key={c} value={c}>
                    {TASK_CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">参考时长</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => updateField('duration', e.target.value)}
                placeholder="30分钟"
                className="w-full text-sm bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">难度</label>
              <select
                value={form.difficulty ?? 'medium'}
                onChange={(e) => updateField('difficulty', e.target.value as 'easy' | 'medium' | 'hard')}
                className="w-full text-sm bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-primary/50"
              >
                {difficultyOptions.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">任务描述</label>
            <textarea
              value={form.description ?? ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="简要说明任务内容和目标"
              rows={3}
              className="w-full text-sm bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">所需材料（用逗号分隔）</label>
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
              className="w-full text-sm bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">关联里程碑标签</label>
              <input
                type="text"
                value={form.milestoneTag ?? ''}
                onChange={(e) => updateField('milestoneTag', e.target.value)}
                placeholder="例如：AMC8 / 古诗文大会"
                className="w-full text-sm bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">适用学期场景</label>
              <select
                value={form.semesterTag ?? ''}
                onChange={(e) => updateField('semesterTag', e.target.value)}
                className="w-full text-sm bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-primary/50"
              >
                <option value="">全年通用</option>
                {semesterOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">自由标签（用逗号分隔）</label>
            <input
              type="text"
              value={form.tags.join('，')}
              onChange={(e) =>
                updateField(
                  'tags',
                  e.target.value.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
                )
              }
              placeholder="例如：晨读，睡前，周末补漏"
              className="w-full text-sm bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary/50"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-2">适用路线（不选则所有路线通用）</label>
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
                        : 'bg-white/5 text-slate-400 border border-white/[0.06] hover:bg-white/[0.08]'
                    }`}
                  >
                    {selected && <Sparkles className="w-3 h-3 inline-block mr-1" />}
                    {route.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">任务类型</label>
              <select
                value={form.taskType}
                onChange={(e) => updateField('taskType', e.target.value as TaskType)}
                className="w-full text-sm bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-primary/50"
              >
                {taskTypeOptions.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">执行频率</label>
              <select
                value={form.frequency}
                onChange={(e) => updateField('frequency', e.target.value as TaskFrequency)}
                className="w-full text-sm bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-primary/50"
              >
                {frequencyOptions.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {form.frequency === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">次数</label>
                <input
                  type="number"
                  min={1}
                  value={form.customFrequency?.times ?? 1}
                  onChange={(e) =>
                    updateField('customFrequency', {
                      ...form.customFrequency,
                      times: parseInt(e.target.value || '1', 10),
                      period: form.customFrequency?.period ?? 'week',
                    })
                  }
                  className="w-full text-sm bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">周期</label>
                <select
                  value={form.customFrequency?.period ?? 'week'}
                  onChange={(e) =>
                    updateField('customFrequency', {
                      ...form.customFrequency,
                      times: form.customFrequency?.times ?? 1,
                      period: e.target.value as 'day' | 'week' | 'month',
                    })
                  }
                  className="w-full text-sm bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-primary/50"
                >
                  <option value="day">每天</option>
                  <option value="week">每周</option>
                  <option value="month">每月</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs text-slate-400">能力关联（用于 AI 分析）</label>
              <span className="text-[10px] text-slate-500">权重越高，对能力影响越大</span>
            </div>

            {form.capabilityLinks.length > 0 && (
              <div className="space-y-2 mb-3">
                {form.capabilityLinks.map((link) => {
                  const capability = capabilities.find((c) => c.id === link.capabilityId);
                  if (!capability) return null;
                  return (
                    <div
                      key={link.capabilityId}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/[0.06]"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-200">{capability.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                            {capabilityCategoryLabels[capability.category] || capability.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={2}
                          step={0.1}
                          value={link.weight}
                          onChange={(e) =>
                            updateCapabilityLink(link.capabilityId, { weight: parseFloat(e.target.value) || 0 })
                          }
                          className="w-16 text-sm bg-white/5 border border-white/[0.08] rounded-lg px-2 py-1 text-slate-200 text-center focus:outline-none focus:border-primary/50"
                          title="权重"
                        />
                        <button
                          type="button"
                          onClick={() => removeCapabilityLink(link.capabilityId)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  addCapabilityLink(e.target.value);
                  e.target.value = '';
                }
              }}
              className="w-full text-sm bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-primary/50"
            >
              <option value="">+ 添加关联能力</option>
              {capabilities
                .filter((c) => !form.capabilityLinks.some((l) => l.capabilityId === c.id))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({capabilityCategoryLabels[c.category] || c.category})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs text-slate-400">评估标准</label>
              <button
                type="button"
                onClick={addAssessmentCriterion}
                className="text-[10px] text-primary hover:text-primary-glow transition-colors"
              >
                + 添加标准
              </button>
            </div>

            {form.assessmentCriteria.length === 0 ? (
              <p className="text-xs text-slate-500">未设置评估标准，AI 将默认以「是否完成」作为评估依据。</p>
            ) : (
              <div className="space-y-2">
                {form.assessmentCriteria.map((criterion, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center p-2.5 rounded-lg bg-white/5 border border-white/[0.06]"
                  >
                    <input
                      type="text"
                      value={criterion.metric}
                      onChange={(e) => updateAssessmentCriterion(index, { metric: e.target.value })}
                      placeholder="指标，例如：正确率"
                      className="text-sm bg-transparent border-b border-white/[0.08] px-1 py-1 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary/50"
                    />
                    <input
                      type="text"
                      value={criterion.target}
                      onChange={(e) => updateAssessmentCriterion(index, { target: e.target.value })}
                      placeholder="目标，例如：>= 80%"
                      className="text-sm bg-transparent border-b border-white/[0.08] px-1 py-1 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary/50"
                    />
                    <label className="flex items-center gap-1 text-[10px] text-slate-400 whitespace-nowrap cursor-pointer">
                      <input
                        type="checkbox"
                        checked={criterion.selfReport}
                        onChange={(e) => updateAssessmentCriterion(index, { selfReport: e.target.checked })}
                        className="rounded border-white/[0.08] bg-white/5 text-primary focus:ring-0"
                      />
                      自评
                    </label>
                    <button
                      type="button"
                      onClick={() => removeAssessmentCriterion(index)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving || !form.title.trim()}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-secondary to-secondary-glow text-white font-semibold hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
