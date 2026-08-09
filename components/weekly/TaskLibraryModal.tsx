'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '@/components/ui/icon';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import Modal from '@/components/ui/Modal';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/skeleton';
import {
  type WeeklyTaskItem,
  type TaskCategory,
  type DayOfWeek,
  type TaskTemplate,
  type TaskAlignment,
} from '@/lib/storage.types';
import { getCurrentWeekId } from '@/lib/weeklyTasks';
import {
  TASK_CATEGORY_LABELS,
  TASK_ALIGNMENT_LABELS,
} from '@/lib/taskTemplates';
import { getAlignmentColorClass, computeTaskAlignment } from '@/lib/taskAlignment';
import TaskRationalityPanel from '@/components/ai/TaskRationalityPanel';
import {
  type TaskRationalityAssessment,
  type AssessmentTaskInput,
} from '@/lib/ai/taskAssessment';
import { useTaskTemplates } from '@/lib/hooks/useTaskTemplates';
import { useAssessTasks } from '@/lib/hooks/useTaskAssessment';
import { categoryIcons, allCategories, DIFFICULTY_LABELS, DIFFICULTY_COLORS, SEMESTER_LABELS } from './weeklyConstants';

interface TaskLibraryModalProps {
  childId: string;
  childRouteId?: string | null;
  weekId: string;
  existingTasks: WeeklyTaskItem[];
  mode?: 'add' | 'makeup';
  onClose: () => void;
  onAdd: (tasks: WeeklyTaskItem[]) => void;
}

export function TaskLibraryModal({
  childId,
  childRouteId,
  weekId,
  existingTasks,
  mode = 'add',
  onClose,
  onAdd,
}: TaskLibraryModalProps) {
  const { data: templates = [], isLoading: loading } = useTaskTemplates(childId, {
    status: 'active',
  });
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<Set<string>>(new Set());
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(() => {
    if (mode !== 'makeup' || weekId !== getCurrentWeekId()) return '周一';
    const dayMap: Record<number, DayOfWeek> = {
      0: '周日',
      1: '周一',
      2: '周二',
      3: '周三',
      4: '周四',
      5: '周五',
      6: '周六',
    };
    return dayMap[new Date().getDay()];
  });
  const [assessments, setAssessments] = useState<TaskRationalityAssessment[] | null>(null);
  const assess = useAssessTasks();

  useEffect(() => {
    setAssessments(null);
  }, [selectedTemplateIds, selectedDay]);

  useEffect(() => {
    if (mode === 'makeup' && weekId === getCurrentWeekId()) {
      const dayMap: Record<number, DayOfWeek> = {
        0: '周日',
        1: '周一',
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六',
      };
      setSelectedDay(dayMap[new Date().getDay()]);
    } else {
      setSelectedDay('周一');
    }
  }, [mode, weekId]);

  const filteredTemplates = useMemo(() => {
    let list = templates;
    if (selectedCategory !== 'all') {
      list = list.filter((t) => t.category === selectedCategory);
    }
    return list.map((tpl) => ({
      ...tpl,
      alignment: computeTaskAlignment({
        child: { routeId: childRouteId },
        template: tpl,
      }),
    })) as (TaskTemplate & { alignment: TaskAlignment })[];
  }, [templates, selectedCategory, childRouteId]);

  const toggleTemplate = (id: string) => {
    setSelectedTemplateIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedTemplates = useMemo(
    () => templates.filter((t) => selectedTemplateIds.has(t.id)),
    [templates, selectedTemplateIds]
  );

  const allFilteredSelected = useMemo(
    () =>
      filteredTemplates.length > 0 && filteredTemplates.every((t) => selectedTemplateIds.has(t.id)),
    [filteredTemplates, selectedTemplateIds]
  );

  const toggleAllFiltered = () => {
    setSelectedTemplateIds((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filteredTemplates.forEach((t) => next.delete(t.id));
      } else {
        filteredTemplates.forEach((t) => next.add(t.id));
      }
      return next;
    });
  };

  const runAssessment = async () => {
    if (selectedTemplates.length === 0) return;
    const inputs: AssessmentTaskInput[] = selectedTemplates.map((tpl) => ({
      title: tpl.title,
      category: tpl.category,
      difficulty: tpl.difficulty,
      duration: tpl.duration,
      taskType: tpl.taskType,
      frequency: tpl.frequency,
      routeTags: tpl.routeTags,
      milestoneTag: tpl.milestoneTag,
      capabilityLinks: tpl.capabilityLinks?.map((l) => ({
        capabilityName: l.capability?.name ?? l.capabilityId,
        weight: l.weight,
      })),
    }));

    try {
      const results = await assess.mutateAsync({
        childId,
        tasks: inputs,
        context: { existingTasks, selectedDay },
      });
      setAssessments(results);
    } catch {
      // 评估失败不阻塞添加
      setAssessments(null);
    }
  };

  const handleAdd = () => {
    if (!assessments) {
      runAssessment();
      return;
    }

    const newTasks: WeeklyTaskItem[] = selectedTemplates.map((tpl) => {
      const category = tpl.category as TaskCategory;
      const alignment = computeTaskAlignment({
        child: { routeId: childRouteId },
        template: tpl,
      });
      return {
        id: `library-${tpl.id}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        category,
        source: 'library',
        templateId: tpl.id,
        day: selectedDay,
        focus: tpl.title,
        duration: tpl.duration,
        materials: tpl.materials,
        status: 'pending',
        alignment,
      };
    });
    onAdd(newTasks);
    onClose();
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={mode === 'makeup' ? '补任务' : '从任务库选择'}
      subtitle={
        mode === 'makeup'
          ? `选择要补到${selectedDay}的任务`
          : `勾选常用任务一键添加到${selectedDay}`
      }
      icon={mode === 'makeup' ? 'CalendarPlus' : 'Library'}
      iconClassName="bg-secondary"
      size="xl"
      colorScheme="violet"
      footer={
        <div className="flex w-full items-center justify-between">
          <p className="text-xs text-text-muted">已选 {selectedTemplateIds.size} 项</p>
          <div className="flex items-center gap-3">
            <Button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-text-tertiary transition-colors hover:text-text-secondary"
              variant="ghost"
              size="md"
            >
              取消
            </Button>
            <Button
              onClick={handleAdd}
              disabled={selectedTemplateIds.size === 0 || assess.isPending}
              variant="secondary"
              size="lg"
            >
              {assess.isPending ? (
                <>
                  <Icon name="Loader" size="sm" animate="spin" />
                  评估中...
                </>
              ) : assessments ? (
                <>
                  <Icon name="CircleCheck" size="sm" />
                  {mode === 'makeup' ? '确认补任务' : '确认添加'}
                </>
              ) : (
                <>
                  <Icon name="Sparkles" size="sm" animate="pulse" />
                  {mode === 'makeup' ? 'AI 评估并补任务' : 'AI 评估并添加'}
                </>
              )}
            </Button>
          </div>
        </div>
      }
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setSelectedCategory('all')}
            className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
              selectedCategory === 'all'
                ? 'bg-surface-highlight text-text-primary'
                : 'bg-surface-elevated text-text-tertiary hover:text-text-secondary'
            }`}
            variant="secondary"
            size="sm"
          >
            全部
          </Button>
          {allCategories.map((cat) => (
            <Button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                selectedCategory === cat
                  ? 'bg-surface-highlight text-text-primary'
                  : 'bg-surface-elevated text-text-tertiary hover:text-text-secondary'
              }`}
              variant="secondary"
              size="sm"
            >
              {TASK_CATEGORY_LABELS[cat]}
            </Button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Button
            onClick={toggleAllFiltered}
            disabled={filteredTemplates.length === 0}
            className="flex items-center gap-1.5 text-xs text-text-secondary transition-colors hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
            variant="ghost"
            size="xs"
          >
            <div
              className={`flex size-4 items-center justify-center rounded border ${
                allFilteredSelected ? 'border-primary bg-primary' : 'border-border-default'
              }`}
            >
              {allFilteredSelected && (
                <Icon name="CircleCheck" size="xs" className="text-text-primary" />
              )}
            </div>
            全选
          </Button>
          <span className="text-xs text-text-muted">添加到</span>
          <Select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
            size="sm"
            className="w-auto min-w-[120px] bg-surface"
            options={[
              { value: '周一', label: '周一' },
              { value: '周二', label: '周二' },
              { value: '周三', label: '周三' },
              { value: '周四', label: '周四' },
              { value: '周五', label: '周五' },
              { value: '周六', label: '周六' },
              { value: '周日', label: '周日' },
            ]}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Skeleton variant="rounded" width={200} height={24} />
        </div>
      ) : filteredTemplates.length === 0 ? (
        <EmptyState scene="no-data" size="sm" />
      ) : (
        <div className="mb-6 grid max-h-[50vh] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
          {filteredTemplates.map((tpl) => {
            const selected = selectedTemplateIds.has(tpl.id);
            const categoryIcon = categoryIcons[tpl.category];
            const alignment = tpl.alignment;
            const difficultyColor = tpl.difficulty ? DIFFICULTY_COLORS[tpl.difficulty] : '';
            return (
              <Button
                key={tpl.id}
                onClick={() => toggleTemplate(tpl.id)}
                className={`rounded-lg border p-3 text-left transition-all ${
                  selected
                    ? 'bg-primary/[0.08] border-primary/25'
                    : 'border-border-subtle bg-surface-elevated hover:bg-surface-highlight'
                }`}
                variant="secondary"
                size="sm"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex size-5 items-center justify-center rounded border ${
                      selected ? 'border-primary bg-primary' : 'border-border-default'
                    }`}
                  >
                    {selected && (
                      <Icon name="CircleCheck" size="xs" className="text-text-primary" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-1.5">
                      <Icon name={categoryIcon} size="xs" className="text-text-tertiary" />
                      <span className="text-2xs text-text-tertiary">
                        {TASK_CATEGORY_LABELS[tpl.category]}
                      </span>
                      {tpl.difficulty && DIFFICULTY_LABELS[tpl.difficulty] && (
                        <span
                          className={`rounded border px-1.5 py-0.5 text-2xs ${difficultyColor}`}
                        >
                          {DIFFICULTY_LABELS[tpl.difficulty]}
                        </span>
                      )}
                      {tpl.semesterTag && SEMESTER_LABELS[tpl.semesterTag] && (
                        <span className="rounded border border-accent/15 bg-accent/[0.08] px-1.5 py-0.5 text-2xs text-accent">
                          {SEMESTER_LABELS[tpl.semesterTag]}
                        </span>
                      )}
                      {alignment && alignment !== 'unrelated' && (
                        <span
                          className={`rounded border px-1.5 py-0.5 text-2xs ${getAlignmentColorClass(
                            alignment
                          )}`}
                        >
                          {TASK_ALIGNMENT_LABELS[alignment]}
                        </span>
                      )}
                      {alignment === 'unrelated' && (
                        <span className="rounded border border-border-default bg-surface-highlight px-1.5 py-0.5 text-2xs text-text-tertiary">
                          不相关
                        </span>
                      )}
                      <span className="ml-auto rounded bg-surface-elevated px-1.5 py-0.5 text-2xs text-text-secondary">
                        {tpl.duration}
                      </span>
                    </div>
                    <p className="mb-1 truncate text-sm font-semibold text-text-secondary">
                      {tpl.title}
                    </p>
                    {tpl.description && (
                      <p className="mb-1 line-clamp-2 text-2xs text-text-muted">
                        {tpl.description}
                      </p>
                    )}
                    {tpl.tags.length > 0 && (
                      <div className="mb-1 flex flex-wrap gap-1">
                        {tpl.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-surface-elevated px-1 py-0.5 text-[9px] text-text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                        {tpl.tags.length > 3 && (
                          <span className="rounded bg-surface-elevated px-1 py-0.5 text-[9px] text-text-muted">
                            +{tpl.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    {tpl.routeTags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tpl.routeTags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-surface-elevated px-1 py-0.5 text-[9px] text-text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      )}

      {assessments && selectedTemplateIds.size > 0 && (
        <div className="mb-4">
          <TaskRationalityPanel
            assessments={assessments}
            taskTitles={selectedTemplates.map((t) => t.title)}
            compact={assessments.length > 1}
          />
        </div>
      )}
    </Modal>
  );
}
