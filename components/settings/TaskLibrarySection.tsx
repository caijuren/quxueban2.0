'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Save,
  Loader2,
  Sparkles,
  Filter,
  Archive,
  RotateCcw,
  Info,
} from 'lucide-react';
import {
  TaskTemplate,
  TaskCategory,
  Capability,
  TaskCapabilityLink,
  AssessmentCriterion,
  TaskType,
  TaskFrequency,
  TaskWeeklySchedule,
  DayOfWeek,
} from '@/lib/storage.types';
import {
  TASK_CATEGORY_LABELS,
  getTemplateStage,
} from '@/lib/taskTemplates';
import { getCategoryColorClass } from '@/lib/taskAlignment';
import { categoryIcons, allCategories } from '@/lib/taskIcons';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import { gradeToStage } from '@/lib/children';
import { getStageByRouteId } from '@/lib/plans';
import {
  useTaskTemplates,
  useCreateTaskTemplate,
  useUpdateTaskTemplate,
  useDeleteTaskTemplate,
} from '@/lib/hooks/useTaskTemplates';
import { useCapabilities } from '@/lib/hooks/useCapabilities';
import {
  TaskTemplateCreateInput,
  TaskTemplateUpdateInput,
} from '@/lib/validation';


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
  { value: 'sg', label: '三公冲刺' },
  { value: 'yaohao', label: '私立摇号' },
  { value: 'gongban', label: '公办对口/直升' },
  { value: 'sizhong', label: '四校八大自招冲刺' },
  { value: 'shizhong', label: '嘉定区市重点冲刺' },
  { value: 'quzhong', label: '区重点/特色高中' },
];

const milestoneOptions = [
  { value: '', label: '无' },
  { value: 'AMC8', label: 'AMC8' },
  { value: 'KET', label: 'KET' },
  { value: 'PET', label: 'PET' },
  { value: 'TOEFL Junior', label: '小托福 / TOEFL Junior' },
  { value: '古诗文大会', label: '古诗文大会' },
  { value: '汉字小达人', label: '汉字小达人' },
  { value: '三公网申', label: '三公网申' },
  { value: '面谈准备', label: '面谈准备' },
  { value: '中考数学', label: '中考数学' },
  { value: '中考语文', label: '中考语文' },
  { value: '中考英语', label: '中考英语' },
  { value: '中考体育', label: '中考体育' },
  { value: '__custom__', label: '其他（手动输入）' },
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

const weeklyScheduleOptions: {
  value: TaskWeeklySchedule;
  label: string;
  description: string;
}[] = [
  { value: 'auto', label: '自动分配', description: '每周出现一次，发布时可调整日期' },
  { value: 'daily', label: '每天', description: '周一到周日每天都出现' },
  { value: 'weekdays', label: '仅工作日', description: '周一到周五出现' },
  { value: 'weekends', label: '仅周末', description: '周六和周日出现' },
  { value: 'custom', label: '指定星期', description: '只在选中的星期出现' },
];

const dayOptions: { value: DayOfWeek; label: string }[] = [
  { value: '周一', label: '周一' },
  { value: '周二', label: '周二' },
  { value: '周三', label: '周三' },
  { value: '周四', label: '周四' },
  { value: '周五', label: '周五' },
  { value: '周六', label: '周六' },
  { value: '周日', label: '周日' },
];

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
  weeklySchedule: 'auto',
  customScheduleDays: [],
  assessmentCriteria: [],
  capabilityLinks: [],
};

export default function TaskLibrarySection() {
  const { currentChild } = useChildren();
  const currentStage = currentChild ? gradeToStage(currentChild.grade, currentChild.educationSystem) : null;

  const shouldReduceMotion = useReducedMotion();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'all'>('all');
  const [filterSource, setFilterSource] = useState<'all' | 'system' | 'user'>('all');
  const [filterStatus, setFilterStatus] = useState<'active' | 'archived' | 'all'>('active');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TaskTemplate | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [archivingId, setArchivingId] = useState<string | null>(null);

  const {
    data: templates = [],
    isLoading: loading,
    error: queryError,
  } = useTaskTemplates(currentChild?.id, {
    category: filterCategory === 'all' ? undefined : filterCategory,
    status: filterStatus,
  });
  const { data: capabilities = [] } = useCapabilities();
  const createTemplate = useCreateTaskTemplate(currentChild?.id);
  const updateTemplate = useUpdateTaskTemplate(currentChild?.id);
  const deleteTemplate = useDeleteTaskTemplate(currentChild?.id);

  const error = queryError instanceof Error ? queryError.message : '';

  // Lock body scroll while modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesSource = filterSource === 'all' || t.source === filterSource;
      const stage = getTemplateStage(t);
      const matchesStage =
        !currentStage || stage === 'general' || stage === currentStage;
      return matchesSearch && matchesSource && matchesStage;
    });
  }, [templates, search, filterSource, currentStage]);

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (tpl: TaskTemplate) => {
    setEditing(tpl);
    setModalOpen(true);
  };

  const isSaving = createTemplate.isPending || updateTemplate.isPending;

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个任务模板吗？删除后无法恢复。')) return;
    try {
      setDeletingId(id);
      await deleteTemplate.mutateAsync(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : '删除失败');
    } finally {
      setDeletingId(null);
    }
  };

  const handleArchive = async (id: string, archive: boolean) => {
    try {
      setArchivingId(id);
      await updateTemplate.mutateAsync({ id, data: { archive } });
    } catch (err) {
      alert(err instanceof Error ? err.message : archive ? '归档失败' : '恢复失败');
    } finally {
      setArchivingId(null);
    }
  };

  const normalizeTemplatePayload = (
    data: typeof emptyTemplate
  ): TaskTemplateCreateInput | TaskTemplateUpdateInput => {
    const {
      source: _source,
      isActive: _isActive,
      childId: _childId,
      ...rest
    } = data;
    return {
      ...rest,
      title: rest.title.trim(),
      description: rest.description?.trim() || null,
      milestoneTag: rest.milestoneTag?.trim() || null,
      semesterTag: rest.semesterTag?.trim() || null,
      materials: rest.materials.filter(Boolean),
      routeTags: rest.routeTags.filter(Boolean),
      tags: rest.tags.filter(Boolean),
      customScheduleDays:
        rest.weeklySchedule === 'custom' ? rest.customScheduleDays : [],
    };
  };

  const handleSave = async (data: typeof emptyTemplate) => {
    const payload = normalizeTemplatePayload(data);

    try {
      if (editing) {
        await updateTemplate.mutateAsync({ id: editing.id, data: payload });
      } else {
        await createTemplate.mutateAsync(payload as TaskTemplateCreateInput);
      }
      setModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : '保存失败');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索任务名称或描述"
              className="w-full pl-9 pr-3 py-2 text-xs bg-surface-elevated border border-border-default rounded-lg text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-text-muted" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as TaskCategory | 'all')}
              className="text-xs bg-surface-elevated border border-border-default rounded-lg px-2 py-2 text-text-secondary focus:outline-none focus:border-primary/50"
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
              className="text-xs bg-surface-elevated border border-border-default rounded-lg px-2 py-2 text-text-secondary focus:outline-none focus:border-primary/50"
            >
              <option value="all">全部来源</option>
              <option value="system">系统预设</option>
              <option value="user">自定义</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="text-xs bg-surface-elevated border border-border-default rounded-lg px-2 py-2 text-text-secondary focus:outline-none focus:border-primary/50"
            >
              <option value="active">使用中</option>
              <option value="archived">已归档</option>
              <option value="all">全部</option>
            </select>

            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-text-primary text-xs font-semibold hover:opacity-90 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              添加任务
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-text-muted text-sm">
            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
            加载任务库...
          </div>
        ) : error ? (
          <div className="py-8 text-center text-error text-sm">{error}</div>
        ) : filteredTemplates.length === 0 ? (
          <div className="py-8 text-center text-text-muted text-sm">
            {currentStage
              ? `未找到匹配「${currentStage}」学段的模板，可切换学段或添加新任务`
              : '未找到匹配的任务模板'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredTemplates.map((tpl) => {
              const CategoryIcon = categoryIcons[tpl.category];
              const difficultyInfo = difficultyOptions.find((d) => d.value === (tpl.difficulty || 'medium'));
              const semesterInfo = semesterOptions.find((s) => s.value === tpl.semesterTag);
              const isArchived = !!tpl.archivedAt;
              const stage = getTemplateStage(tpl);
              return (
                <motion.div
                  key={tpl.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`group rounded-xl border transition-all p-3 flex flex-col h-full ${
                    isArchived
                      ? 'bg-white/[0.015] border-white/[0.04] opacity-70'
                      : 'bg-surface-elevated border-border-subtle hover:border-border-default'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getCategoryColorClass(
                        tpl.category
                      )}`}
                    >
                      <CategoryIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col pl-0.5">
                      <h3
                        className="text-sm font-bold text-text-secondary truncate pl-1"
                        title={tpl.title}
                      >
                        {tpl.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        {tpl.source === 'system' && (
                          <span className="text-2xs px-1.5 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20 shrink-0">
                            系统预设
                          </span>
                        )}
                        {tpl.source === 'user' && (
                          <span className="text-2xs px-1.5 py-0.5 rounded bg-primary/[0.08] text-primary border border-primary/20 shrink-0">
                            自定义
                          </span>
                        )}
                        {isArchived && (
                          <span className="text-2xs px-1.5 py-0.5 rounded bg-surface/10 text-text-tertiary border border-border-default/20 shrink-0">
                            已归档
                          </span>
                        )}
                        {tpl.taskType && (
                          <span className="text-2xs px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20 shrink-0">
                            {taskTypeOptions.find((t) => t.value === tpl.taskType)?.label || tpl.taskType}
                          </span>
                        )}
                        {tpl.capabilityLinks.length > 0 && (
                          <span className="text-2xs px-1.5 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20 shrink-0">
                            {tpl.capabilityLinks.length} 项能力
                          </span>
                        )}
                        {tpl.weeklySchedule && tpl.weeklySchedule !== 'auto' && (
                          <span className="text-2xs px-1.5 py-0.5 rounded bg-info/10 text-info border border-info/20 shrink-0">
                            {weeklyScheduleOptions.find((o) => o.value === tpl.weeklySchedule)?.label || tpl.weeklySchedule}
                          </span>
                        )}
                      </div>

                      {tpl.description && (
                        <p className="text-xs text-text-muted mt-2 line-clamp-1 pl-1">
                          {tpl.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                        <span className="text-2xs px-1.5 py-0.5 rounded bg-surface-elevated text-text-tertiary border border-border-subtle">
                          {TASK_CATEGORY_LABELS[tpl.category]}
                        </span>
                        <span className="text-2xs px-1.5 py-0.5 rounded bg-surface-elevated text-text-tertiary border border-border-subtle">
                          {tpl.duration}
                        </span>
                        {difficultyInfo && (
                          <span className={`text-2xs px-1.5 py-0.5 rounded border ${difficultyInfo.color}`}>
                            {difficultyInfo.label}
                          </span>
                        )}
                        {semesterInfo && (
                          <span className="text-2xs px-1.5 py-0.5 rounded bg-surface-elevated text-text-tertiary border border-border-subtle">
                            {semesterInfo.label}
                          </span>
                        )}
                        {tpl.milestoneTag && (
                          <span className="text-2xs px-1.5 py-0.5 rounded bg-surface-elevated text-text-tertiary border border-border-subtle">
                            {tpl.milestoneTag}
                          </span>
                        )}
                        {stage !== 'general' ? (
                          <span className="text-2xs px-1.5 py-0.5 rounded bg-surface-elevated text-text-tertiary border border-border-subtle">
                            {stage}
                          </span>
                        ) : (
                          <span className="text-2xs px-1.5 py-0.5 rounded bg-surface-elevated text-text-tertiary border border-border-subtle">
                            全学段
                          </span>
                        )}
                        {tpl.routeTags.map((tag) => {
                          const routeLabel = routeOptions.find((r) => r.value === tag)?.label || tag;
                          return (
                            <span
                              key={tag}
                              className="text-2xs px-1.5 py-0.5 rounded bg-surface-elevated text-text-tertiary border border-border-subtle"
                            >
                              {routeLabel}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-t border-border-subtle flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(tpl)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-elevated text-text-secondary text-xs hover:bg-surface-highlight transition-colors"
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
                          : 'bg-surface/10 text-text-tertiary hover:bg-surface/15'
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

      <AnimatePresence>
        {modalOpen && (
          <TaskTemplateModal
            initial={editing}
            capabilities={capabilities}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            saving={isSaving}
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
          weeklySchedule: initial.weeklySchedule ?? 'auto',
          customScheduleDays: initial.customScheduleDays ?? [],
          assessmentCriteria: initial.assessmentCriteria ?? [],
          capabilityLinks: initial.capabilityLinks ?? [],
        }
      : { ...emptyTemplate }
  );

  const [customMilestone, setCustomMilestone] = useState(
    initial?.milestoneTag &&
      !milestoneOptions.some((o) => o.value && o.value === initial.milestoneTag)
      ? initial.milestoneTag
      : ''
  );

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const milestoneSelectValue = useMemo(() => {
    if (!form.milestoneTag) return '';
    const matched = milestoneOptions.find((o) => o.value === form.milestoneTag);
    return matched ? matched.value : '__custom__';
  }, [form.milestoneTag]);

  const handleMilestoneChange = (value: string) => {
    if (value === '__custom__') {
      updateField('milestoneTag', customMilestone);
    } else {
      updateField('milestoneTag', value);
      if (value) setCustomMilestone('');
    }
  };

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
        className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl bg-surface-elevated border border-border-default overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 sm:p-8 pb-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              {initial ? <Pencil className="w-5 h-5 text-text-primary" /> : <Plus className="w-5 h-5 text-text-primary" />}
            </div>
            <div>
              <h2 id="task-template-title" className="text-xl font-bold font-display">
                {initial ? '编辑任务模板' : '新增任务模板'}
              </h2>
              <p className="text-xs text-text-tertiary">
                {initial ? '修改后所有未来周计划引用都会更新' : '创建后可在周计划中一键选用'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-elevated text-text-tertiary focus-ring"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          id="task-template-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 sm:p-8 pt-6 space-y-4"
        >
          <div>
            <label className="block text-xs text-text-tertiary mb-1.5">
              任务名称 <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="例如：完成学校作业"
              className="w-full text-sm bg-surface-elevated border border-border-default rounded-lg px-3 py-2 text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">分类</label>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value as TaskCategory)}
                className="w-full text-sm bg-surface-elevated border border-border-default rounded-lg px-3 py-2 text-text-secondary focus:outline-none focus:border-primary/50"
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
                className="w-full text-sm bg-surface-elevated border border-border-default rounded-lg px-3 py-2 text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">难度</label>
              <select
                value={form.difficulty ?? 'medium'}
                onChange={(e) => updateField('difficulty', e.target.value as 'easy' | 'medium' | 'hard')}
                className="w-full text-sm bg-surface-elevated border border-border-default rounded-lg px-3 py-2 text-text-secondary focus:outline-none focus:border-primary/50"
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
            <label className="block text-xs text-text-tertiary mb-1.5">任务描述</label>
            <textarea
              value={form.description ?? ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="简要说明任务内容和目标"
              rows={3}
              className="w-full text-sm bg-surface-elevated border border-border-default rounded-lg px-3 py-2 text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary/50 resize-none"
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
              className="w-full text-sm bg-surface-elevated border border-border-default rounded-lg px-3 py-2 text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">关联里程碑标签</label>
              <select
                value={milestoneSelectValue}
                onChange={(e) => handleMilestoneChange(e.target.value)}
                className="w-full text-sm bg-surface-elevated border border-border-default rounded-lg px-3 py-2 text-text-secondary focus:outline-none focus:border-primary/50"
              >
                {milestoneOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {milestoneSelectValue === '__custom__' && (
                <input
                  type="text"
                  value={customMilestone}
                  onChange={(e) => {
                    setCustomMilestone(e.target.value);
                    updateField('milestoneTag', e.target.value);
                  }}
                  placeholder="输入自定义里程碑名称"
                  className="w-full mt-2 text-sm bg-surface-elevated border border-border-default rounded-lg px-3 py-2 text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
                />
              )}
            </div>
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">适用学期场景</label>
              <select
                value={form.semesterTag ?? ''}
                onChange={(e) => updateField('semesterTag', e.target.value)}
                className="w-full text-sm bg-surface-elevated border border-border-default rounded-lg px-3 py-2 text-text-secondary focus:outline-none focus:border-primary/50"
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
            <div className="flex items-center gap-1.5 mb-2">
              <label className="block text-xs text-text-tertiary">适用路线（不选则所有路线通用）</label>
              <span
                className="text-text-muted cursor-help"
                title="选择任务对应的升学路线，不选则该任务对所有路线都可见"
              >
                <Info className="w-3 h-3" />
              </span>
            </div>
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
                        : 'bg-surface-elevated text-text-tertiary border border-border-subtle hover:bg-surface-highlight'
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
              <label className="block text-xs text-text-tertiary mb-1.5">任务类型</label>
              <select
                value={form.taskType}
                onChange={(e) => updateField('taskType', e.target.value as TaskType)}
                className="w-full text-sm bg-surface-elevated border border-border-default rounded-lg px-3 py-2 text-text-secondary focus:outline-none focus:border-primary/50"
              >
                {taskTypeOptions.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-tertiary mb-1.5">执行频率</label>
              <select
                value={form.frequency}
                onChange={(e) => updateField('frequency', e.target.value as TaskFrequency)}
                className="w-full text-sm bg-surface-elevated border border-border-default rounded-lg px-3 py-2 text-text-secondary focus:outline-none focus:border-primary/50"
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
                <label className="block text-xs text-text-tertiary mb-1.5">次数</label>
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
                  className="w-full text-sm bg-surface-elevated border border-border-default rounded-lg px-3 py-2 text-text-secondary focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="block text-xs text-text-tertiary mb-1.5">周期</label>
                <select
                  value={form.customFrequency?.period ?? 'week'}
                  onChange={(e) =>
                    updateField('customFrequency', {
                      ...form.customFrequency,
                      times: form.customFrequency?.times ?? 1,
                      period: e.target.value as 'day' | 'week' | 'month',
                    })
                  }
                  className="w-full text-sm bg-surface-elevated border border-border-default rounded-lg px-3 py-2 text-text-secondary focus:outline-none focus:border-primary/50"
                >
                  <option value="day">每天</option>
                  <option value="week">每周</option>
                  <option value="month">每月</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <label className="block text-xs text-text-tertiary">周计划时间属性</label>
              <span
                className="text-text-muted cursor-help"
                title="设置任务在周计划中的默认出现规则"
              >
                <Info className="w-3 h-3" />
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {weeklyScheduleOptions.map((option) => {
                const selected = form.weeklySchedule === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      updateField('weeklySchedule', option.value);
                      if (option.value !== 'custom') {
                        updateField('customScheduleDays', []);
                      }
                    }}
                    className={`text-left rounded-xl border p-3 transition-all ${
                      selected
                        ? 'bg-secondary/10 border-secondary/30'
                        : 'bg-surface-elevated border-border-subtle hover:bg-surface-highlight'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selected ? 'border-secondary bg-secondary' : 'border-border-default'
                        }`}
                      >
                        {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-sm font-medium text-text-secondary">{option.label}</span>
                    </div>
                    <p className="text-2xs text-text-muted mt-1 ml-6">{option.description}</p>
                  </button>
                );
              })}
            </div>

            {form.weeklySchedule === 'custom' && (
              <div className="mt-3 p-3 rounded-xl bg-surface-elevated border border-border-subtle">
                <p className="text-xs text-text-tertiary mb-2">选择出现的星期：</p>
                <div className="flex flex-wrap gap-2">
                  {dayOptions.map((day) => {
                    const selected = form.customScheduleDays.includes(day.value);
                    return (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => {
                          const next = new Set(form.customScheduleDays);
                          if (next.has(day.value)) next.delete(day.value);
                          else next.add(day.value);
                          updateField('customScheduleDays', Array.from(next));
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                          selected
                            ? 'bg-secondary/15 text-secondary border border-secondary/30'
                            : 'bg-surface-elevated text-text-tertiary border border-border-subtle hover:bg-surface-highlight'
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs text-text-tertiary">能力关联（用于 AI 分析）</label>
              <span className="text-2xs text-text-muted">权重越高，对能力影响越大</span>
            </div>

            {form.capabilityLinks.length > 0 && (
              <div className="space-y-2 mb-3">
                {form.capabilityLinks.map((link) => {
                  const capability = capabilities.find((c) => c.id === link.capabilityId);
                  if (!capability) return null;
                  return (
                    <div
                      key={link.capabilityId}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-elevated border border-border-subtle"
                    >
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-text-secondary">{capability.name}</span>
                          <span className="text-2xs px-1.5 py-0.5 rounded bg-surface-elevated text-text-tertiary">
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
                          className="w-16 text-sm bg-surface-elevated border border-border-default rounded-lg px-2 py-1 text-text-secondary text-center focus:outline-none focus:border-primary/50"
                          title="权重"
                        />
                        <button
                          type="button"
                          onClick={() => removeCapabilityLink(link.capabilityId)}
                          className="p-1.5 rounded-lg hover:bg-surface-highlight text-text-tertiary"
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
              className="w-full text-sm bg-surface-elevated border border-border-default rounded-lg px-3 py-2 text-text-secondary focus:outline-none focus:border-primary/50"
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
              <label className="block text-xs text-text-tertiary">评估标准</label>
              <button
                type="button"
                onClick={addAssessmentCriterion}
                className="text-2xs text-primary hover:text-primary-glow transition-colors"
              >
                + 添加标准
              </button>
            </div>

            {form.assessmentCriteria.length === 0 ? (
              <p className="text-xs text-text-muted">未设置评估标准，AI 将默认以「是否完成」作为评估依据。</p>
            ) : (
              <div className="space-y-2">
                {form.assessmentCriteria.map((criterion, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center p-2.5 rounded-lg bg-surface-elevated border border-border-subtle"
                  >
                    <input
                      type="text"
                      value={criterion.metric}
                      onChange={(e) => updateAssessmentCriterion(index, { metric: e.target.value })}
                      placeholder="指标，例如：正确率"
                      className="text-sm bg-transparent border-b border-border-default px-1 py-1 text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
                    />
                    <input
                      type="text"
                      value={criterion.target}
                      onChange={(e) => updateAssessmentCriterion(index, { target: e.target.value })}
                      placeholder="目标，例如：>= 80%"
                      className="text-sm bg-transparent border-b border-border-default px-1 py-1 text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary/50"
                    />
                    <label className="flex items-center gap-1 text-2xs text-text-tertiary whitespace-nowrap cursor-pointer">
                      <input
                        type="checkbox"
                        checked={criterion.selfReport}
                        onChange={(e) => updateAssessmentCriterion(index, { selfReport: e.target.checked })}
                        className="rounded border-border-default bg-surface-elevated text-primary focus:ring-0"
                      />
                      自评
                    </label>
                    <button
                      type="button"
                      onClick={() => removeAssessmentCriterion(index)}
                      className="p-1.5 rounded-lg hover:bg-surface-highlight text-text-tertiary"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </form>

        <div className="flex items-center justify-end gap-3 p-6 sm:p-8 pt-4 border-t border-border-subtle">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-text-tertiary hover:text-text-secondary transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            form="task-template-form"
            disabled={saving || !form.title.trim()}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-secondary text-text-primary font-semibold hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            保存
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
