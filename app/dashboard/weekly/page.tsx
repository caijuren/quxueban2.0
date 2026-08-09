'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/textarea';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';
import CommandCard from '@/components/ui/CommandCard';
import WeeklyReportExport from '@/components/weekly/WeeklyReportExport';
import GeneratePlanModal from '@/components/weekly/GeneratePlanModal';
import WeeklyTaskChecklistMatrix from '@/components/weekly/WeeklyTaskChecklistMatrix';
import WeeklyTaskList from '@/components/weekly/WeeklyTaskList';
import { EditPlanModal } from '@/components/weekly/EditPlanModal';
import { TaskLibraryModal } from '@/components/weekly/TaskLibraryModal';
import { SaveTemplateModal } from '@/components/weekly/SaveTemplateModal';
import { ApplyTemplateModal } from '@/components/weekly/ApplyTemplateModal';
import { CopyHistoryModal } from '@/components/weekly/CopyHistoryModal';
import { WeeklyPlanAnalytics } from '@/components/weekly/WeeklyPlanAnalytics';
import {
  type WeeklyPlan,
  type WeeklyTaskItem,
  type WeeklyGoal,
  type TaskStatus,
} from '@/lib/storage.types';
import {
  getCurrentWeekId,
  getISOWeek,
  getWeekRange,
  formatWeekLabel,
  parseWeekId,
  getPlanStats,
  generateAiReview,
  toggleTaskStatus,
  parseDurationMinutes,
} from '@/lib/weeklyTasks';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { getCategoryColorClass } from '@/lib/taskAlignment';
import {
  useWeeklyPlanTemplates,
  useCreateWeeklyPlanTemplate,
} from '@/lib/hooks/useWeeklyPlanTemplates';
import { useCopyWeeklyPlan } from '@/lib/hooks/useWeeklyPlans';
import { detectConflicts } from '@/lib/weeklyPlanConflicts';
import { allCategories, categoryIcons } from '@/components/weekly/weeklyConstants';

function shiftWeekId(weekId: string, delta: number): string {
  const { start } = getWeekRange(weekId);
  const next = new Date(start);
  next.setDate(start.getDate() + delta * 7);
  return getISOWeek(next).weekId;
}

function buildWeekOptions(centerWeekId: string) {
  const currentWeekId = getCurrentWeekId();
  const currentStart = getWeekRange(currentWeekId).start;
  const oneWeek = 7 * 24 * 60 * 60 * 1000;

  return Array.from({ length: 9 }, (_, i) => i - 4).map((delta) => {
    const id = shiftWeekId(centerWeekId, delta);
    const { year, week } = parseWeekId(id);
    const start = getWeekRange(id).start;
    const weeksFromCurrent = Math.round((start.getTime() - currentStart.getTime()) / oneWeek);
    const relationLabel =
      weeksFromCurrent === 0
        ? '本周'
        : weeksFromCurrent === 1
          ? '下周'
          : weeksFromCurrent === -1
            ? '上周'
            : `${year}年第${String(week).padStart(2, '0')}周`;
    return {
      value: id,
      label: `${relationLabel} · ${formatWeekLabel(id)}`,
    };
  });
}

function ProgressRing({ rate, size = 96 }: { rate: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - rate / 100);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="size-full -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--border-default)"
          strokeWidth={10}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-primary-hover)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-bold">{rate}%</span>
        <span className="text-2xs text-text-muted">完成率</span>
      </div>
    </div>
  );
}

function MoreActions({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [open]);

  const wrappedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    const originalOnClick = child.props.onClick as (() => void) | undefined;
    return React.cloneElement(child, {
      onClick: () => {
        originalOnClick?.();
        setOpen(false);
      },
    });
  });

  return (
    <div className="relative" ref={ref}>
      <Button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-[14px] border border-border-default bg-surface px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
        variant="secondary"
        size="md"
      >
        更多
        <Icon
          name="ChevronDown"
          size="xs"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-52 rounded-[14px] border border-border-default bg-surface-elevated py-1.5 shadow-[0_8px_32px_color-mix(in_srgb,black_40%,transparent)]"
          >
            {wrappedChildren}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WeeklyTasksContent() {
  const shouldReduceMotion = useReducedMotion();
  const { currentChild, getWeeklyPlan, publishWeeklyPlan, updateTaskStatus, reviewWeeklyPlan } =
    useChildren();

  const [weekId, setWeekId] = useState<string>(getCurrentWeekId());
  const [draftPlan, setDraftPlan] = useState<WeeklyPlan | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryMode, setLibraryMode] = useState<'add' | 'makeup'>('add');
  const [reportOpen, setReportOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);
  const [applyTemplateOpen, setApplyTemplateOpen] = useState(false);
  const [copyHistoryOpen, setCopyHistoryOpen] = useState(false);
  const [conflictsExpanded, setConflictsExpanded] = useState(false);

  const createTemplate = useCreateWeeklyPlanTemplate(currentChild?.id);
  const { data: weeklyPlanTemplates = [] } = useWeeklyPlanTemplates(currentChild?.id);
  const copyPlan = useCopyWeeklyPlan();

  useEffect(() => {
    setDraftPlan(null);
  }, [weekId]);

  const plan = useMemo(() => {
    if (!currentChild) return undefined;
    return getWeeklyPlan(weekId, currentChild.id);
  }, [currentChild, getWeeklyPlan, weekId]);

  const displayPlan = draftPlan ?? plan;
  const isDraft = !!draftPlan;
  const isPublished = !!plan?.publishedAt;
  const stats = useMemo(() => (displayPlan ? getPlanStats(displayPlan) : null), [displayPlan]);

  const weekOptions = useMemo(() => buildWeekOptions(weekId), [weekId]);

  const handleGenerate = () => {
    setGenerateOpen(true);
  };

  const handlePublishDraft = async (plan: WeeklyPlan) => {
    await publishWeeklyPlan(plan);
    setGenerateOpen(false);
    setWeekId(plan.weekId);
  };

  const handlePublish = async () => {
    if (!draftPlan) return;
    await publishWeeklyPlan(draftPlan);
    setDraftPlan(null);
  };

  const handleCancelDraft = () => {
    setDraftPlan(null);
  };

  const adjustGoalProgress = (
    goals: WeeklyGoal[] | undefined,
    task: WeeklyTaskItem,
    newStatus: TaskStatus
  ): WeeklyGoal[] => {
    if (!goals || !task.goalId) return goals ?? [];
    const wasDone = task.status === 'done';
    const isDone = newStatus === 'done';
    if (wasDone === isDone) return goals;
    return goals.map((g) => {
      if (g.id !== task.goalId) return g;
      const current = g.quantityDone ?? 0;
      const next = isDone ? current + 1 : Math.max(0, current - 1);
      return { ...g, quantityDone: next };
    });
  };

  const handleToggleTask = async (task: WeeklyTaskItem) => {
    if (!currentChild || !displayPlan) return;
    const newStatus = toggleTaskStatus(task.status);
    if (isDraft) {
      setDraftPlan((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tasks: prev.tasks.map((t) =>
            t.id === task.id
              ? {
                  ...t,
                  status: newStatus,
                  completedAt: newStatus === 'done' ? new Date().toISOString() : undefined,
                }
              : t
          ),
          goals: adjustGoalProgress(prev.goals, task, newStatus),
        };
      });
      return;
    }
    await updateTaskStatus(currentChild.id, weekId, task.id, newStatus);
  };

  const handleNoteBlur = async (task: WeeklyTaskItem, note: string) => {
    if (!currentChild || !displayPlan || isDraft) return;
    await updateTaskStatus(currentChild.id, weekId, task.id, task.status, note);
  };

  const handleOpenReview = () => {
    setReviewComment(plan?.reviewComment ?? '');
    setReviewOpen(true);
  };

  const handleSaveReview = async () => {
    if (!currentChild || !plan) return;
    await reviewWeeklyPlan(currentChild.id, weekId, reviewComment);
    setReviewOpen(false);
  };

  const handleSaveTasks = async (tasks: WeeklyTaskItem[], goals: WeeklyGoal[]) => {
    if (!displayPlan || !currentChild) return;
    if (isDraft) {
      setDraftPlan({ ...displayPlan, tasks, goals });
    } else {
      await publishWeeklyPlan({ ...displayPlan, tasks, goals });
    }
  };

  const handleAddFromLibrary = (newTasks: WeeklyTaskItem[]) => {
    if (!displayPlan || !currentChild) return;
    const updatedTasks = [...displayPlan.tasks, ...newTasks];
    if (isDraft) {
      setDraftPlan({ ...displayPlan, tasks: updatedTasks });
    } else {
      publishWeeklyPlan({ ...displayPlan, tasks: updatedTasks });
    }
  };

  const handleGoalsChange = async (goals: WeeklyGoal[]) => {
    if (!displayPlan || !currentChild) return;
    if (isDraft) {
      setDraftPlan({ ...displayPlan, goals });
    } else {
      await publishWeeklyPlan({ ...displayPlan, goals });
    }
  };

  const conflicts = useMemo(
    () => (displayPlan ? detectConflicts(displayPlan.tasks) : []),
    [displayPlan]
  );

  if (!currentChild) {
    return (
      <div className="space-y-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 border-primary/20 flex size-10 items-center justify-center rounded-xl border">
              <Icon name="Calendar" size="md" className="text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold sm:text-3xl">周计划</h1>
            </div>
          </div>
        </motion.div>
        <ChildEmptyState description="添加孩子后，系统会根据年级自动生成每周计划计划" />
      </div>
    );
  }

  const handleSaveAsTemplate = async (name: string, description: string) => {
    if (!displayPlan || !currentChild) return;
    const resetTasks = displayPlan.tasks.map((t) => ({
      ...t,
      id: `template-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      status: 'pending' as TaskStatus,
      completedAt: undefined,
      completionRecords: undefined,
    }));
    const resetGoals = (displayPlan.goals ?? []).map((g) => ({
      ...g,
      id: `template-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      quantityDone: 0,
      checklist: (g.checklist || []).map((item) => ({
        ...item,
        id: `template-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        done: false,
      })),
    }));
    await createTemplate.mutateAsync({
      name,
      description,
      tasks: resetTasks,
      goals: resetGoals,
      isDefault: false,
    });
    setSaveTemplateOpen(false);
  };

  const handleApplyTemplate = async (templateId: string, mode: 'merge' | 'replace') => {
    if (!displayPlan || !currentChild) return;
    const tpl = weeklyPlanTemplates.find((t) => t.id === templateId);
    if (!tpl) return;
    const resetTasks = tpl.tasks.map((t) => ({
      ...t,
      id: `tplapply-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      status: 'pending' as TaskStatus,
      completedAt: undefined,
      completionRecords: undefined,
    }));
    const resetGoals = (tpl.goals ?? []).map((g) => ({
      ...g,
      id: `tplapply-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      quantityDone: 0,
      checklist: (g.checklist || []).map((item) => ({
        ...item,
        id: `tplapply-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        done: false,
      })),
    }));
    const nextTasks = mode === 'replace' ? resetTasks : [...displayPlan.tasks, ...resetTasks];
    const nextGoals =
      mode === 'replace' ? resetGoals : [...(displayPlan.goals ?? []), ...resetGoals];
    if (isDraft) {
      setDraftPlan({ ...displayPlan, tasks: nextTasks, goals: nextGoals });
    } else {
      await publishWeeklyPlan({ ...displayPlan, tasks: nextTasks, goals: nextGoals });
    }
    setApplyTemplateOpen(false);
  };

  const handleCopyFromHistory = async (sourceWeekId: string) => {
    if (!currentChild) return;
    await copyPlan.mutateAsync({
      childId: currentChild.id,
      targetWeekId: weekId,
      sourceWeekId,
    });
    setCopyHistoryOpen(false);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 border-primary/20 flex size-10 items-center justify-center rounded-[14px] border">
            <Icon name="Calendar" size="md" className="text-primary" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
              周计划
            </h1>
            {isDraft && (
              <span className="bg-primary/10 border-primary/20 rounded-full border px-2 py-0.5 text-xs font-medium text-primary">
                草稿待发布
              </span>
            )}
          </div>
        </div>

        {/* Week selector */}
        <div className="flex items-center justify-end gap-3">
          <Button
            onClick={() => setWeekId((w) => shiftWeekId(w, -1))}
            className="flex size-8 items-center justify-center rounded-[14px] border border-border-default bg-surface text-text-secondary transition-colors hover:bg-surface-hover"
            aria-label="上一周"
            variant="secondary"
            size="sm"
          >
            <Icon name="ChevronLeft" size="sm" />
          </Button>
          <div className="relative">
            <Select
              value={weekId}
              onChange={(e) => setWeekId(e.target.value)}
              size="sm"
              className="w-auto min-w-[180px] bg-surface"
              options={weekOptions}
            />
          </div>
          <Button
            onClick={() => setWeekId((w) => shiftWeekId(w, 1))}
            className="flex size-8 items-center justify-center rounded-[14px] border border-border-default bg-surface text-text-secondary transition-colors hover:bg-surface-hover"
            aria-label="下一周"
            variant="secondary"
            size="sm"
          >
            <Icon name="ChevronRight" size="sm" />
          </Button>
        </div>

        {/* Toolbar */}
        <CommandCard className="p-3">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2">
              {!displayPlan && (
                <Button
                  onClick={handleGenerate}
                  className="inline-flex items-center gap-1.5 rounded-[14px] px-3.5 py-2 text-sm font-medium"
                  variant="secondary"
                  size="md"
                >
                  <Icon name="Target" size="xs" />
                  生成本周计划
                </Button>
              )}
              {displayPlan && !isDraft && (
                <Button
                  onClick={() => setEditOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-[14px] px-3.5 py-2 text-sm font-medium"
                  variant="secondary"
                  size="md"
                >
                  <Icon name="Pencil" size="xs" />
                  编辑周计划
                </Button>
              )}
              {isDraft && (
                <>
                  <Button
                    onClick={handlePublish}
                    className="inline-flex items-center gap-1.5 rounded-[14px] px-3.5 py-2 text-sm font-medium"
                    variant="primary"
                    size="md"
                  >
                    <Icon name="Send" size="xs" />
                    发布
                  </Button>
                  <Button
                    onClick={handleCancelDraft}
                    className="inline-flex items-center gap-1.5 rounded-[14px] px-3.5 py-2 text-sm font-medium"
                    variant="secondary"
                    size="md"
                  >
                    <Icon name="X" size="xs" />
                    取消
                  </Button>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {displayPlan && !isDraft && isPublished && (
                <Button
                  onClick={handleOpenReview}
                  className="inline-flex items-center gap-1.5 rounded-[14px] border border-border-default bg-surface px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                  variant="secondary"
                  size="md"
                >
                  <Icon name="Sparkles" size="xs" animate="pulse" />
                  {plan?.reviewedAt ? '查看复盘' : '本周复盘'}
                </Button>
              )}
              {displayPlan && (
                <>
                  <Button
                    onClick={() => {
                      setLibraryMode('add');
                      setLibraryOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-[14px] border border-border-default bg-surface px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                    variant="secondary"
                    size="md"
                  >
                    <Icon name="Library" size="xs" />
                    添加任务
                  </Button>
                  <Button
                    onClick={() => {
                      setLibraryMode('makeup');
                      setLibraryOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-[14px] border border-border-default bg-surface px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                    variant="secondary"
                    size="md"
                  >
                    <Icon name="CalendarPlus" size="xs" />
                    补任务
                  </Button>
                  <MoreActions>
                    <Button
                      onClick={() => setSaveTemplateOpen(true)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                      variant="ghost"
                      size="sm"
                    >
                      <Icon name="Save" size="sm" />
                      保存为模板
                    </Button>
                    <Button
                      onClick={() => setApplyTemplateOpen(true)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                      variant="ghost"
                      size="sm"
                    >
                      <Icon name="LayoutTemplate" size="sm" />
                      套用模板
                    </Button>
                    <Button
                      onClick={() => setCopyHistoryOpen(true)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                      variant="ghost"
                      size="sm"
                    >
                      <Icon name="History" size="sm" />
                      复制历史周
                    </Button>
                    {isPublished && !isDraft && stats && (
                      <Button
                        onClick={() => setReportOpen(true)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                        variant="ghost"
                        size="sm"
                      >
                        <Icon name="Share2" size="sm" />
                        导出周计划
                      </Button>
                    )}
                  </MoreActions>
                </>
              )}
            </div>
          </div>
        </CommandCard>
      </motion.div>

      {conflicts.length > 0 && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border-warning/20 bg-warning/[0.06] rounded-2xl border p-4"
        >
          <div className="flex items-start gap-3">
            <Icon name="TriangleAlert" size="md" className="mt-0.5 shrink-0 text-warning" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-text-secondary">
                  本周计划存在 {conflicts.length} 项潜在冲突
                </p>
                <Button
                  onClick={() => setConflictsExpanded((v) => !v)}
                  className="inline-flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-text-secondary"
                  variant="ghost"
                  size="xs"
                >
                  {conflictsExpanded ? '收起' : '查看详情'}
                  <Icon
                    name="ChevronDown"
                    size="xs"
                    className={`transition-transform ${conflictsExpanded ? 'rotate-180' : ''}`}
                  />
                </Button>
              </div>
              <AnimatePresence initial={false}>
                {conflictsExpanded && (
                  <motion.ul
                    initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    className="mt-2 space-y-1 overflow-hidden"
                  >
                    {conflicts.map((c) => (
                      <li key={c.id} className="text-xs text-text-tertiary">
                        {c.message}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
              {!conflictsExpanded && (
                <p className="mt-1 line-clamp-1 text-xs text-text-muted">
                  {conflicts
                    .slice(0, 2)
                    .map((c) => c.message)
                    .join(' · ')}
                  {conflicts.length > 2 && ` 等 ${conflicts.length} 项`}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {stats && displayPlan && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CommandCard className="p-5">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              {/* Left: progress ring */}
              <div className="shrink-0">
                <div className="relative h-[96px] w-[96px]">
                  <svg className="size-full -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="var(--border-default)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="url(#weeklyProgressGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - stats.completionRate / 100)}
                      className="transition-all duration-700 ease-out"
                    />
                    <defs>
                      <linearGradient
                        id="weeklyProgressGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="var(--color-primary-glow)" />
                        <stop offset="100%" stopColor="var(--color-primary)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-xl font-bold text-text-primary">
                      {stats.completionRate}%
                    </span>
                    <span className="text-[10px] text-text-muted">完成率</span>
                  </div>
                </div>
              </div>

              {/* Center: title + summary */}
              <div className="min-w-0 flex-1">
                <p className="font-display text-xl font-semibold text-text-primary">本周整体进度</p>
                <p className="mt-1.5 text-sm text-text-tertiary">
                  已完成 <span className="font-medium text-text-secondary">{stats.done} 项</span>
                  <span className="mx-1.5 text-text-muted">·</span>
                  剩余 <span className="font-medium text-text-secondary">{stats.pending} 项</span>
                </p>
              </div>

              {/* Right: action */}
              <div className="flex shrink-0 items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-text-muted hover:text-text-secondary"
                >
                  查看详情
                  <Icon name="ChevronRight" size="xs" />
                </Button>
              </div>
            </div>
          </CommandCard>
        </motion.div>
      )}

      {displayPlan && <WeeklyPlanAnalytics plan={displayPlan} />}

      {displayPlan && (
        <WeeklyTaskList
          goals={displayPlan.goals ?? []}
          tasks={displayPlan.tasks}
          weekLabel={formatWeekLabel(weekId)}
          onChange={handleGoalsChange}
        />
      )}

      <AnimatePresence mode="wait">
        {!displayPlan ? (
          <motion.div
            key="empty"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            className="rounded-2xl bg-surface-elevated p-12 text-center"
          >
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl border border-border-default bg-surface-elevated">
              <Icon name="Calendar" size="xl" className="text-primary" />
            </div>
            <h3 className="mb-2 font-display text-xl font-bold">本周计划尚未发布</h3>
            <p className="mx-auto mb-6 max-w-md text-sm text-text-tertiary">
              从任务库中选择任务，按周发布时间属性自动生成矩阵。发布后即可每日打卡。
            </p>
            <Button
              onClick={handleGenerate}
              variant="secondary"
              size="lg"
            >
              生成本周计划
            </Button>
          </motion.div>
        ) : (
          <WeeklyTaskChecklistMatrix
            tasks={displayPlan.tasks}
            weekId={weekId}
            onCellClick={handleToggleTask}
          />
        )}
      </AnimatePresence>

      {reviewOpen && stats && displayPlan && (
        <Modal
          isOpen
          onClose={() => setReviewOpen(false)}
          title="本周复盘"
          subtitle={formatWeekLabel(weekId)}
          icon="Sparkles"
          iconClassName="bg-accent"
          size="lg"
          footer={
            <div className="flex w-full items-center justify-end gap-3">
              <Button
                onClick={() => setReviewOpen(false)}
                className="rounded-lg px-4 py-2 text-text-tertiary transition-colors hover:text-text-primary"
                variant="ghost"
                size="md"
              >
                取消
              </Button>
              <Button
                onClick={handleSaveReview}
                variant="secondary"
                size="lg"
              >
                <Icon name="RotateCcw" size="sm" />
                保存复盘
              </Button>
            </div>
          }
        >
          <div className="max-h-[70vh] space-y-6 overflow-y-auto pr-1">
            {/* Top stats: routine + quantified */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <CommandCard className="flex items-center gap-5 p-5">
                <ProgressRing rate={stats.completionRate} size={88} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-secondary">例常完成率</p>
                  <p className="mt-1 text-2xs text-text-muted">
                    已完成 <span className="font-medium text-text-secondary">{stats.done}</span> /
                    共 <span className="font-medium text-text-secondary">{stats.total}</span> 项
                  </p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${stats.completionRate}%` }}
                    />
                  </div>
                  <p className="mt-2 text-2xs text-text-muted">
                    {stats.pending > 0
                      ? `待补 ${stats.pending} 项，建议固定时段补齐`
                      : '例常任务全部完成，节奏很棒'}
                  </p>
                </div>
              </CommandCard>

              <CommandCard className="flex items-center gap-5 p-5">
                <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border-4 border-accent/20 bg-accent/10">
                  <div className="text-center">
                    <p className="font-display text-xl font-bold text-accent">
                      {stats.quantityTarget > 0 ? stats.quantityRate : '—'}
                    </p>
                    {stats.quantityTarget > 0 && <p className="text-[9px] text-text-muted">%</p>}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-secondary">量化完成率</p>
                  {stats.quantityTarget > 0 ? (
                    <>
                      <p className="mt-1 text-2xs text-text-muted">
                        达成{' '}
                        <span className="font-medium text-text-secondary">
                          {stats.quantityDone}
                        </span>{' '}
                        / 目标{' '}
                        <span className="font-medium text-text-secondary">
                          {stats.quantityTarget}
                        </span>
                      </p>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface">
                        <div
                          className="h-full rounded-full bg-accent transition-all duration-500"
                          style={{ width: `${stats.quantityRate}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="mt-1 text-2xs text-text-muted">
                      本周未设定定量目标，可在编辑计划时添加
                    </p>
                  )}
                </div>
              </CommandCard>
            </div>

            {/* Category breakdown */}
            <CommandCard className="p-5">
              <p className="mb-4 text-sm font-semibold text-text-secondary">分类完成情况</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {allCategories
                  .filter((cat) => stats.byCategory[cat].total > 0)
                  .map((cat) => {
                    const s = stats.byCategory[cat];
                    const rate = s.total === 0 ? 0 : Math.round((s.done / s.total) * 100);
                    const categoryIcon = categoryIcons[cat];
                    return (
                      <div
                        key={cat}
                        className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-elevated p-3"
                      >
                        <div
                          className={`flex size-9 items-center justify-center rounded-lg ${getCategoryColorClass(
                            cat
                          )}`}
                        >
                          <Icon name={categoryIcon} size="sm" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs font-medium text-text-secondary">
                              {TASK_CATEGORY_LABELS[cat]}
                            </span>
                            <span className="text-xs font-bold tabular-nums text-text-primary">
                              {rate}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
                            <div
                              className="h-full rounded-full bg-primary transition-all duration-500"
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                          <p className="mt-1 text-2xs text-text-muted">
                            {s.done}/{s.total} 完成
                            {s.pending > 0 && ` · ${s.pending} 项待补`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CommandCard>

            {/* AI review */}
            <div className="rounded-xl border border-accent/15 bg-accent/[0.06] p-4">
              <div className="mb-2 flex items-center gap-2">
                <Icon name="Sparkles" size="sm" animate="pulse" className="text-accent" />
                <p className="text-sm font-semibold text-text-secondary">AI 点评</p>
              </div>
              <p className="text-sm leading-relaxed text-text-tertiary">
                {generateAiReview(displayPlan, currentChild.name)}
              </p>
            </div>

            {/* Parent comment */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">家长评语</label>
              <Textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="写下对孩子的鼓励、问题或下周调整..."
                className="border-border-default bg-surface px-4 py-3 text-text-primary"
                rows={4}
                resize="none"
              />
            </div>
          </div>
        </Modal>
      )}

      {editOpen && displayPlan && (
        <EditPlanModal
          plan={displayPlan}
          onClose={() => setEditOpen(false)}
          onSave={handleSaveTasks}
        />
      )}

      {libraryOpen && currentChild && displayPlan && (
        <TaskLibraryModal
          childId={currentChild.id}
          childRouteId={currentChild.routeId}
          weekId={weekId}
          existingTasks={displayPlan.tasks}
          mode={libraryMode}
          onClose={() => setLibraryOpen(false)}
          onAdd={handleAddFromLibrary}
        />
      )}

      {reportOpen && displayPlan && currentChild && (
        <WeeklyReportExport
          plan={displayPlan}
          childName={currentChild.name}
          onClose={() => setReportOpen(false)}
        />
      )}

      {generateOpen && currentChild && (
        <GeneratePlanModal
          initialWeekId={weekId}
          onClose={() => setGenerateOpen(false)}
          onPublish={handlePublishDraft}
        />
      )}

      {saveTemplateOpen && displayPlan && (
        <SaveTemplateModal
          onClose={() => setSaveTemplateOpen(false)}
          onSave={handleSaveAsTemplate}
          saving={createTemplate.isPending}
        />
      )}

      {applyTemplateOpen && displayPlan && (
        <ApplyTemplateModal
          templates={weeklyPlanTemplates}
          onClose={() => setApplyTemplateOpen(false)}
          onApply={handleApplyTemplate}
        />
      )}

      {copyHistoryOpen && currentChild && (
        <CopyHistoryModal
          childId={currentChild.id}
          currentWeekId={weekId}
          onClose={() => setCopyHistoryOpen(false)}
          onCopy={handleCopyFromHistory}
        />
      )}
    </div>
  );
}

function WeeklyTasksSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-surface-elevated" />
          <div className="space-y-2">
            <div className="h-5 w-32 rounded bg-surface-elevated" />
            <div className="h-3 w-48 rounded bg-surface-elevated" />
          </div>
        </div>
        <div className="h-8 w-28 rounded-lg bg-surface-elevated" />
      </div>
      <div className="h-10 rounded-xl bg-surface-elevated" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-surface-elevated" />
        ))}
      </div>
      <div className="h-[420px] rounded-2xl bg-surface-elevated" />
    </div>
  );
}

export default function WeeklyTasksPage() {
  return (
    <Suspense fallback={<WeeklyTasksSkeleton />}>
      <WeeklyTasksContent />
    </Suspense>
  );
}
