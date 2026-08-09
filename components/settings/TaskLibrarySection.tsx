'use client';
import { Icon } from '@/components/ui/icon';

import Select from '@/components/ui/select';
import Textarea from '@/components/ui/textarea';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

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
import { TASK_CATEGORY_LABELS, getTemplateStage } from '@/lib/taskTemplates';
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
import { TaskTemplateCreateInput, TaskTemplateUpdateInput } from '@/lib/validation';

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

const emptyTemplate: Omit<
  TaskTemplate,
  'id' | 'userId' | 'createdAt' | 'updatedAt' | 'archivedAt' | 'useCount' | 'lastUsedAt'
> = {
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
  const currentStage = currentChild
    ? gradeToStage(currentChild.grade, currentChild.educationSystem)
    : null;

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
      const matchesSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesSource = filterSource === 'all' || t.source === filterSource;
      const stage = getTemplateStage(t);
      const matchesStage = !currentStage || stage === 'general' || stage === currentStage;
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
    const { source: _source, isActive: _isActive, childId: _childId, ...rest } = data;
    return {
      ...rest,
      title: rest.title.trim(),
      description: rest.description?.trim() || null,
      milestoneTag: rest.milestoneTag?.trim() || null,
      semesterTag: rest.semesterTag?.trim() || null,
      materials: rest.materials.filter(Boolean),
      routeTags: rest.routeTags.filter(Boolean),
      tags: rest.tags.filter(Boolean),
      customScheduleDays: rest.weeklySchedule === 'custom' ? rest.customScheduleDays : [],
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
      <div className="flex flex-col gap-3 lg:flex-row">
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索任务名称或描述"
          leftIcon={<Icon name="Search" size="xs" />}
          className="flex-1 bg-surface-elevated"
        />

        <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
          <Icon name="Filter" size="xs" className="text-text-muted" />
          <Select
            options={[
              { value: 'all', label: '全部分类' },
              ...allCategories.map((c) => ({ value: c, label: TASK_CATEGORY_LABELS[c] })),
            ]}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as TaskCategory | 'all')}
            size="sm"
            containerClassName="w-auto min-w-[110px]"
            className="bg-surface-elevated"
          />
          <Select
            options={[
              { value: 'all', label: '全部来源' },
              { value: 'system', label: '系统预设' },
              { value: 'user', label: '自定义' },
            ]}
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value as typeof filterSource)}
            size="sm"
            containerClassName="w-auto min-w-[110px]"
            className="bg-surface-elevated"
          />
          <Select
            options={[
              { value: 'active', label: '使用中' },
              { value: 'archived', label: '已归档' },
              { value: 'all', label: '全部' },
            ]}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            size="sm"
            containerClassName="w-auto min-w-[110px]"
            className="bg-surface-elevated"
          />

          <Button
            variant="secondary"
            size="sm"
            onClick={handleAdd}
            leftIcon={<Icon name="Plus" size="sm" />}
            className="font-semibold"
          >
            添加任务
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-text-muted">
          <Icon name="Loader2" size="md" animate="spin" className="mx-auto mb-2" />
          加载任务库...
        </div>
      ) : error ? (
        <div className="py-8 text-center text-sm text-error">{error}</div>
      ) : filteredTemplates.length === 0 ? (
        <div className="py-8 text-center text-sm text-text-muted">
          {currentStage
            ? `未找到匹配「${currentStage}」学段的模板，可切换学段或添加新任务`
            : '未找到匹配的任务模板'}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredTemplates.map((tpl) => {
            const CategoryIcon = categoryIcons[tpl.category];
            const difficultyInfo = difficultyOptions.find(
              (d) => d.value === (tpl.difficulty || 'medium')
            );
            const semesterInfo = semesterOptions.find((s) => s.value === tpl.semesterTag);
            const isArchived = !!tpl.archivedAt;
            const stage = getTemplateStage(tpl);
            return (
              <motion.div
                key={tpl.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group flex h-full flex-col rounded-xl border p-3 transition-all ${
                  isArchived
                    ? 'border-white/[0.04] bg-white/[0.015] opacity-70'
                    : 'border-border-subtle bg-surface-elevated hover:border-border-default'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${getCategoryColorClass(
                      tpl.category
                    )}`}
                  >
                    <CategoryIcon className="size-4" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col pl-0.5">
                    <h3
                      className="truncate pl-1 text-sm font-bold text-text-secondary"
                      title={tpl.title}
                    >
                      {tpl.title}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {tpl.source === 'system' && (
                        <span className="bg-secondary/10 border-secondary/20 shrink-0 rounded border px-1.5 py-0.5 text-2xs text-secondary">
                          系统预设
                        </span>
                      )}
                      {tpl.source === 'user' && (
                        <span className="bg-primary/[0.08] border-primary/20 shrink-0 rounded border px-1.5 py-0.5 text-2xs text-primary">
                          自定义
                        </span>
                      )}
                      {isArchived && (
                        <span className="bg-surface/10 border-border-default/20 shrink-0 rounded border px-1.5 py-0.5 text-2xs text-text-tertiary">
                          已归档
                        </span>
                      )}
                      {tpl.taskType && (
                        <span className="shrink-0 rounded border border-accent/20 bg-accent/10 px-1.5 py-0.5 text-2xs text-accent">
                          {taskTypeOptions.find((t) => t.value === tpl.taskType)?.label ||
                            tpl.taskType}
                        </span>
                      )}
                      {tpl.capabilityLinks.length > 0 && (
                        <span className="bg-secondary/10 border-secondary/20 shrink-0 rounded border px-1.5 py-0.5 text-2xs text-secondary">
                          {tpl.capabilityLinks.length} 项能力
                        </span>
                      )}
                      {tpl.weeklySchedule && tpl.weeklySchedule !== 'auto' && (
                        <span className="bg-info/10 border-info/20 shrink-0 rounded border px-1.5 py-0.5 text-2xs text-info">
                          {weeklyScheduleOptions.find((o) => o.value === tpl.weeklySchedule)
                            ?.label || tpl.weeklySchedule}
                        </span>
                      )}
                    </div>

                    {tpl.description && (
                      <p className="mt-2 line-clamp-1 pl-1 text-xs text-text-muted">
                        {tpl.description}
                      </p>
                    )}

                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      <span className="rounded border border-border-subtle bg-surface-elevated px-1.5 py-0.5 text-2xs text-text-tertiary">
                        {TASK_CATEGORY_LABELS[tpl.category]}
                      </span>
                      <span className="rounded border border-border-subtle bg-surface-elevated px-1.5 py-0.5 text-2xs text-text-tertiary">
                        {tpl.duration}
                      </span>
                      {difficultyInfo && (
                        <span
                          className={`rounded border px-1.5 py-0.5 text-2xs ${difficultyInfo.color}`}
                        >
                          {difficultyInfo.label}
                        </span>
                      )}
                      {semesterInfo && (
                        <span className="rounded border border-border-subtle bg-surface-elevated px-1.5 py-0.5 text-2xs text-text-tertiary">
                          {semesterInfo.label}
                        </span>
                      )}
                      {tpl.milestoneTag && (
                        <span className="rounded border border-border-subtle bg-surface-elevated px-1.5 py-0.5 text-2xs text-text-tertiary">
                          {tpl.milestoneTag}
                        </span>
                      )}
                      {stage !== 'general' ? (
                        <span className="rounded border border-border-subtle bg-surface-elevated px-1.5 py-0.5 text-2xs text-text-tertiary">
                          {stage}
                        </span>
                      ) : (
                        <span className="rounded border border-border-subtle bg-surface-elevated px-1.5 py-0.5 text-2xs text-text-tertiary">
                          全学段
                        </span>
                      )}
                      {tpl.routeTags.map((tag) => {
                        const routeLabel = routeOptions.find((r) => r.value === tag)?.label || tag;
                        return (
                          <span
                            key={tag}
                            className="rounded border border-border-subtle bg-surface-elevated px-1.5 py-0.5 text-2xs text-text-tertiary"
                          >
                            {routeLabel}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-end gap-2 border-t border-border-subtle pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(tpl)}
                    className="bg-surface-elevated hover:bg-surface-highlight"
                  >
                    <Icon name="Pencil" size="xs" />
                    编辑
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleArchive(tpl.id, !isArchived)}
                    disabled={archivingId === tpl.id}
                    className={`${
                      isArchived
                        ? 'bg-success/10 text-success hover:bg-success/15'
                        : 'bg-surface/10 text-text-tertiary hover:bg-surface/15'
                    }`}
                  >
                    {archivingId === tpl.id ? (
                      <Icon name="Loader2" size="xs" animate="spin" />
                    ) : isArchived ? (
                      <Icon name="RotateCcw" size="xs" />
                    ) : (
                      <Icon name="Archive" size="xs" />
                    )}
                    {isArchived ? '恢复' : '归档'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(tpl.id)}
                    disabled={deletingId === tpl.id}
                    className="hover:bg-error/15"
                  >
                    {deletingId === tpl.id ? (
                      <Icon name="Loader2" size="xs" animate="spin" />
                    ) : (
                      <Icon name="Trash2" size="xs" />
                    )}
                    删除
                  </Button>
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

function TaskTemplateModal({
  initial,
  capabilities,
  onClose,
  onSave,
  saving,
}: TaskTemplateModalProps) {
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

  const updateField = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
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
      assessmentCriteria: [
        ...prev.assessmentCriteria,
        { metric: '', target: '', selfReport: true },
      ],
    }));
  };

  const updateAssessmentCriterion = (index: number, updates: Partial<AssessmentCriterion>) => {
    setForm((prev) => ({
      ...prev,
      assessmentCriteria: prev.assessmentCriteria.map((c, i) =>
        i === index ? { ...c, ...updates } : c
      ),
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
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
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
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border-default bg-surface-elevated"
      >
        <div className="flex items-center justify-between p-6 pb-0 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-secondary">
              {initial ? (
                <Icon name="Pencil" size="md" className="text-text-primary" />
              ) : (
                <Icon name="Plus" size="md" className="text-text-primary" />
              )}
            </div>
            <div>
              <h2 id="task-template-title" className="font-display text-xl font-bold">
                {initial ? '编辑任务模板' : '新增任务模板'}
              </h2>
              <p className="text-xs text-text-tertiary">
                {initial ? '修改后所有未来周计划引用都会更新' : '创建后可在周计划中一键选用'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="xs"
            onClick={onClose}
            className="p-2 hover:bg-surface-elevated"
            aria-label="关闭"
          >
            <Icon name="X" size="md" />
          </Button>
        </div>

        <form
          id="task-template-form"
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 overflow-y-auto p-6 sm:p-8"
        >
          <div>
            <label className="mb-1.5 block text-xs text-text-tertiary">
              任务名称 <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="例如：完成学校作业"
              className="focus:border-primary/50 w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs text-text-tertiary">分类</label>
              <Select
                options={allCategories.map((c) => ({ value: c, label: TASK_CATEGORY_LABELS[c] }))}
                value={form.category}
                onChange={(e) => updateField('category', e.target.value as TaskCategory)}
                size="md"
                className="bg-surface-elevated"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-text-tertiary">参考时长</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => updateField('duration', e.target.value)}
                placeholder="30分钟"
                className="focus:border-primary/50 w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-text-tertiary">难度</label>
              <Select
                options={difficultyOptions.map((d) => ({ value: d.value, label: d.label }))}
                value={form.difficulty ?? 'medium'}
                onChange={(e) =>
                  updateField('difficulty', e.target.value as 'easy' | 'medium' | 'hard')
                }
                size="md"
                className="bg-surface-elevated"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-text-tertiary">任务描述</label>
            <textarea
              value={form.description ?? ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="简要说明任务内容和目标"
              rows={3}
              className="focus:border-primary/50 w-full resize-none rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs text-text-tertiary">
              所需材料（用逗号分隔）
            </label>
            <input
              type="text"
              value={form.materials.join('，')}
              onChange={(e) =>
                updateField(
                  'materials',
                  e.target.value
                    .split(/[,，]/)
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
              placeholder="例如：课本，作业本，铅笔"
              className="focus:border-primary/50 w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs text-text-tertiary">关联里程碑标签</label>
              <Select
                options={milestoneOptions}
                value={milestoneSelectValue}
                onChange={(e) => handleMilestoneChange(e.target.value)}
                size="md"
                className="bg-surface-elevated"
              />
              {milestoneSelectValue === '__custom__' && (
                <input
                  type="text"
                  value={customMilestone}
                  onChange={(e) => {
                    setCustomMilestone(e.target.value);
                    updateField('milestoneTag', e.target.value);
                  }}
                  placeholder="输入自定义里程碑名称"
                  className="focus:border-primary/50 mt-2 w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none"
                />
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-text-tertiary">适用学期场景</label>
              <Select
                options={[
                  { value: '', label: '全年通用' },
                  ...semesterOptions.map((s) => ({ value: s.value, label: s.label })),
                ]}
                value={form.semesterTag ?? ''}
                onChange={(e) => updateField('semesterTag', e.target.value)}
                size="md"
                className="bg-surface-elevated"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <label className="block text-xs text-text-tertiary">
                适用路线（不选则所有路线通用）
              </label>
              <span
                className="cursor-help text-text-muted"
                title="选择任务对应的升学路线，不选则该任务对所有路线都可见"
              >
                <Icon name="Info" size="xs" />
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {routeOptions.map((route) => {
                const selected = form.routeTags.includes(route.value);
                return (
                  <Button
                    key={route.value}
                    variant="ghost"
                    size="xs"
                    type="button"
                    onClick={() => toggleRouteTag(route.value)}
                    className={`px-2.5 py-1.5 ${
                      selected
                        ? 'bg-primary/15 border-primary/30 border text-primary'
                        : 'border border-border-subtle bg-surface-elevated text-text-tertiary hover:bg-surface-highlight'
                    }`}
                  >
                    {selected && <Icon name="Sparkles" size="xs" className="mr-1 inline-block" />}
                    {route.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs text-text-tertiary">任务类型</label>
              <Select
                options={taskTypeOptions.map((t) => ({ value: t.value, label: t.label }))}
                value={form.taskType}
                onChange={(e) => updateField('taskType', e.target.value as TaskType)}
                size="md"
                className="bg-surface-elevated"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-text-tertiary">执行频率</label>
              <Select
                options={frequencyOptions.map((f) => ({ value: f.value, label: f.label }))}
                value={form.frequency}
                onChange={(e) => updateField('frequency', e.target.value as TaskFrequency)}
                size="md"
                className="bg-surface-elevated"
              />
            </div>
          </div>

          {form.frequency === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs text-text-tertiary">次数</label>
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
                  className="focus:border-primary/50 w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-text-tertiary">周期</label>
                <Select
                  options={[
                    { value: 'day', label: '每天' },
                    { value: 'week', label: '每周' },
                    { value: 'month', label: '每月' },
                  ]}
                  value={form.customFrequency?.period ?? 'week'}
                  onChange={(e) =>
                    updateField('customFrequency', {
                      ...form.customFrequency,
                      times: form.customFrequency?.times ?? 1,
                      period: e.target.value as 'day' | 'week' | 'month',
                    })
                  }
                  size="md"
                  className="bg-surface-elevated"
                />
              </div>
            </div>
          )}

          <div>
            <div className="mb-2 flex items-center gap-1.5">
              <label className="block text-xs text-text-tertiary">周计划时间属性</label>
              <span
                className="cursor-help text-text-muted"
                title="设置任务在周计划中的默认出现规则"
              >
                <Icon name="Info" size="xs" />
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {weeklyScheduleOptions.map((option) => {
                const selected = form.weeklySchedule === option.value;
                return (
                  <Button
                    key={option.value}
                    variant="ghost"
                    type="button"
                    onClick={() => {
                      updateField('weeklySchedule', option.value);
                      if (option.value !== 'custom') {
                        updateField('customScheduleDays', []);
                      }
                    }}
                    className={`rounded-xl border p-3 text-left ${
                      selected
                        ? 'bg-secondary/10 border-secondary/30'
                        : 'border-border-subtle bg-surface-elevated hover:bg-surface-highlight'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${
                          selected ? 'border-secondary bg-secondary' : 'border-border-default'
                        }`}
                      >
                        {selected && <div className="size-1.5 rounded-full bg-white" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-text-secondary">
                          {option.label}
                        </span>
                        <p className="text-2xs text-text-muted">{option.description}</p>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>

            {form.weeklySchedule === 'custom' && (
              <div className="mt-3 rounded-xl border border-border-subtle bg-surface-elevated p-3">
                <p className="mb-2 text-xs text-text-tertiary">选择出现的星期：</p>
                <div className="flex flex-wrap gap-2">
                  {dayOptions.map((day) => {
                    const selected = form.customScheduleDays.includes(day.value);
                    return (
                      <Button
                        key={day.value}
                        variant="ghost"
                        size="xs"
                        type="button"
                        onClick={() => {
                          const next = new Set(form.customScheduleDays);
                          if (next.has(day.value)) next.delete(day.value);
                          else next.add(day.value);
                          updateField('customScheduleDays', Array.from(next));
                        }}
                        className={`px-3 py-1.5 ${
                          selected
                            ? 'bg-secondary/15 border-secondary/30 border text-secondary'
                            : 'border border-border-subtle bg-surface-elevated text-text-tertiary hover:bg-surface-highlight'
                        }`}
                      >
                        {day.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-xs text-text-tertiary">能力关联（用于 AI 分析）</label>
              <span className="text-2xs text-text-muted">权重越高，对能力影响越大</span>
            </div>

            {form.capabilityLinks.length > 0 && (
              <div className="mb-3 space-y-2">
                {form.capabilityLinks.map((link) => {
                  const capability = capabilities.find((c) => c.id === link.capabilityId);
                  if (!capability) return null;
                  return (
                    <div
                      key={link.capabilityId}
                      className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface-elevated p-2.5"
                    >
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-text-secondary">
                            {capability.name}
                          </span>
                          <span className="rounded bg-surface-elevated px-1.5 py-0.5 text-2xs text-text-tertiary">
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
                            updateCapabilityLink(link.capabilityId, {
                              weight: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="focus:border-primary/50 w-16 rounded-lg border border-border-default bg-surface-elevated px-2 py-1 text-center text-sm text-text-secondary focus:outline-none"
                          title="权重"
                        />
                        <Button
                          variant="ghost"
                          size="xs"
                          type="button"
                          onClick={() => removeCapabilityLink(link.capabilityId)}
                          className="p-1.5 hover:bg-surface-highlight"
                        >
                          <Icon name="X" size="xs" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <Select
              options={[
                { value: '', label: '+ 添加关联能力' },
                ...capabilities
                  .filter((c) => !form.capabilityLinks.some((l) => l.capabilityId === c.id))
                  .map((c) => ({ value: c.id, label: `${c.name} (${capabilityCategoryLabels[c.category] || c.category})` })),
              ]}
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  addCapabilityLink(e.target.value);
                }
              }}
              size="md"
              className="bg-surface-elevated"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-xs text-text-tertiary">评估标准</label>
              <Button
                variant="link"
                size="xs"
                type="button"
                onClick={addAssessmentCriterion}
                className="hover:text-primary-glow"
              >
                + 添加标准
              </Button>
            </div>

            {form.assessmentCriteria.length === 0 ? (
              <p className="text-xs text-text-muted">
                未设置评估标准，AI 将默认以「是否完成」作为评估依据。
              </p>
            ) : (
              <div className="space-y-2">
                {form.assessmentCriteria.map((criterion, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-2 rounded-lg border border-border-subtle bg-surface-elevated p-2.5"
                  >
                    <input
                      type="text"
                      value={criterion.metric}
                      onChange={(e) => updateAssessmentCriterion(index, { metric: e.target.value })}
                      placeholder="指标，例如：正确率"
                      className="focus:border-primary/50 border-b border-border-default bg-transparent p-1 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none"
                    />
                    <input
                      type="text"
                      value={criterion.target}
                      onChange={(e) => updateAssessmentCriterion(index, { target: e.target.value })}
                      placeholder="目标，例如：>= 80%"
                      className="focus:border-primary/50 border-b border-border-default bg-transparent p-1 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none"
                    />
                    <label className="flex cursor-pointer items-center gap-1 whitespace-nowrap text-2xs text-text-tertiary">
                      <input
                        type="checkbox"
                        checked={criterion.selfReport}
                        onChange={(e) =>
                          updateAssessmentCriterion(index, { selfReport: e.target.checked })
                        }
                        className="rounded border-border-default bg-surface-elevated text-primary focus:ring-0"
                      />
                      自评
                    </label>
                    <Button
                      variant="ghost"
                      size="xs"
                      type="button"
                      onClick={() => removeAssessmentCriterion(index)}
                      className="p-1.5 hover:bg-surface-highlight"
                    >
                      <Icon name="X" size="xs" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-border-subtle p-6 pt-4 sm:p-8">
          <Button
            variant="ghost"
            size="md"
            type="button"
            onClick={onClose}
            className="hover:text-text-secondary"
          >
            取消
          </Button>
          <Button
            variant="primary"
            size="lg"
            type="submit"
            form="task-template-form"
            disabled={saving || !form.title.trim()}
            className="bg-secondary hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]"
          >
            {saving ? <Icon name="Loader2" size="sm" animate="spin" /> : <Icon name="Save" size="sm" />}
            保存
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
