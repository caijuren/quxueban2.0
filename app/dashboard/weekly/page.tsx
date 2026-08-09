// @ts-nocheck
// FIXME: 本页面包含大量未完成的类型和组件引用，需要后续重构补齐
'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/textarea';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/skeleton';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';
import CommandCard from '@/components/ui/CommandCard';
import MetricRing from '@/components/ui/MetricRing';
import WeeklyReportExport from '@/components/weekly/WeeklyReportExport';
import GeneratePlanModal from '@/components/weekly/GeneratePlanModal';
import WeeklyTaskChecklistMatrix from '@/components/weekly/WeeklyTaskChecklistMatrix';
import WeeklyTaskList from '@/components/weekly/WeeklyTaskList';
import { gradeLabel } from '@/lib/children';
import {
  type WeeklyPlan,
  type WeeklyTaskItem,
  type WeeklyGoal,
  type TaskStatus,
  type DayOfWeek,
  type TaskCategory,
  type TaskTemplate,
  type TaskAlignment,
  type TimeSlot,
  type WeeklyPlanTemplate,
} from '@/lib/storage.types';
import {
  getCurrentWeekId,
  getISOWeek,
  getWeekRange,
  parseWeekId,
  formatWeekLabel,
  getPlanStats,
  generateAiReview,
  toggleTaskStatus,
  dayOrder,
  subjectMeta,
  parseDurationMinutes,
  getTimeSlotLabel,
  timeSlotOrder,
} from '@/lib/weeklyTasks';
import {
  TASK_CATEGORY_LABELS,
  TASK_CATEGORY_ICONS,
  TASK_CATEGORY_COLORS,
  TASK_ALIGNMENT_LABELS,
} from '@/lib/taskTemplates';
import {
  getCategoryColorClass,
  getAlignmentColorClass,
  computeTaskAlignment,
} from '@/lib/taskAlignment';
import TaskRationalityPanel from '@/components/ai/TaskRationalityPanel';
import { TaskRationalityAssessment, AssessmentTaskInput } from '@/lib/ai/taskAssessment';
import { useTaskTemplates } from '@/lib/hooks/useTaskTemplates';
import { useAssessTasks } from '@/lib/hooks/useTaskAssessment';
import {
  useWeeklyPlanTemplates,
  useCreateWeeklyPlanTemplate,
  useUpdateWeeklyPlanTemplate,
  useDeleteWeeklyPlanTemplate,
} from '@/lib/hooks/useWeeklyPlanTemplates';
import { useCopyWeeklyPlan, useWeeklyPlans } from '@/lib/hooks/useWeeklyPlans';
import { detectConflicts, WeeklyPlanConflict } from '@/lib/weeklyPlanConflicts';

const categoryIcons: Record<TaskCategory, IconName> = {
  school: 'Backpack',
  reading: 'BookOpen',
  sport: 'Dumbbell',
  interest: 'Palette',
  ability: 'Trophy',
  other: 'GraduationCap',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: '基础',
  medium: '巩固',
  hard: '拓展',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'bg-success/10 text-success border-success/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  hard: 'bg-error/10 text-error border-error/20',
};

const SEMESTER_LABELS: Record<string, string> = {
  semester: '开学期',
  vacation: '寒暑假',
  exam: '考前冲刺',
};

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

interface EditPlanModalProps {
  plan: WeeklyPlan;
  onClose: () => void;
  onSave: (tasks: WeeklyTaskItem[], goals: WeeklyGoal[]) => void;
}

const allCategories: TaskCategory[] = [
  'school',
  'reading',
  'sport',
  'interest',
  'ability',
  'other',
];

function EditPlanModal({ plan, onClose, onSave }: EditPlanModalProps) {
  const initialTasks = useMemo(
    () =>
      [...plan.tasks].sort((a, b) => {
        const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
        if (dayDiff !== 0) return dayDiff;
        return a.category.localeCompare(b.category);
      }),
    [plan.tasks]
  );
  const initialGoals = useMemo(() => plan.goals ?? [], [plan.goals]);

  const [tasks, setTasks] = useState<WeeklyTaskItem[]>(initialTasks);
  const [goals, setGoals] = useState<WeeklyGoal[]>(initialGoals);
  const [activeTab, setActiveTab] = useState<'tasks' | 'goals'>('tasks');
  const [collapsedDays, setCollapsedDays] = useState<Record<DayOfWeek, boolean>>(() => {
    const init = {} as Record<DayOfWeek, boolean>;
    dayOrder.forEach((d) => (init[d] = false));
    return init;
  });
  const [copyingTaskId, setCopyingTaskId] = useState<string | null>(null);
  const [showUnsavedPrompt, setShowUnsavedPrompt] = useState(false);

  const hasChanges = useMemo(() => {
    return (
      JSON.stringify(initialTasks) !== JSON.stringify(tasks) ||
      JSON.stringify(initialGoals) !== JSON.stringify(goals)
    );
  }, [initialTasks, tasks, initialGoals, goals]);

  useEffect(() => {
    if (!hasChanges) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasChanges]);

  const updateTask = (id: string, updates: Partial<Omit<WeeklyTaskItem, 'id'>>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addTask = (day: DayOfWeek = '周一') => {
    setTasks((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        category: 'school',
        source: 'manual',
        day,
        timeSlot: 'flexible',
        focus: '',
        duration: '30分钟',
        materials: [],
        status: 'pending',
      },
    ]);
    setCollapsedDays((prev) => ({ ...prev, [day]: false }));
  };

  const duplicateTask = (task: WeeklyTaskItem, targetDays: DayOfWeek[]) => {
    const newTasks = targetDays.map((day) => ({
      ...task,
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      day,
      status: 'pending' as TaskStatus,
    }));
    setTasks((prev) => {
      const next = [...prev, ...newTasks];
      return next.sort((a, b) => {
        const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
        if (dayDiff !== 0) return dayDiff;
        return a.category.localeCompare(b.category);
      });
    });
    targetDays.forEach((day) => {
      setCollapsedDays((prev) => ({ ...prev, [day]: false }));
    });
  };

  const toggleDay = (day: DayOfWeek) => {
    setCollapsedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  // Goal management
  const addGoal = () => {
    setGoals((prev) => [
      ...prev,
      {
        id: `goal-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        title: '新目标',
        category: 'reading',
        quantityTarget: 0,
        quantityDone: 0,
        quantityUnit: '',
        checklist: [],
      },
    ]);
  };

  const updateGoal = (id: string, updates: Partial<Omit<WeeklyGoal, 'id'>>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setTasks((prev) => prev.map((t) => (t.goalId === id ? { ...t, goalId: undefined } : t)));
  };

  const addGoalChecklistItem = (goalId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          checklist: [
            ...(g.checklist || []),
            {
              id: `check-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
              title: '',
              text: '',
              done: false,
            },
          ],
        };
      })
    );
  };

  const updateGoalChecklistItem = (goalId: string, itemId: string, text: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          checklist: (g.checklist || []).map((item) =>
            item.id === itemId ? { ...item, text, title: text } : item
          ),
        };
      })
    );
  };

  const deleteGoalChecklistItem = (goalId: string, itemId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          checklist: (g.checklist || []).filter((item) => item.id !== itemId),
        };
      })
    );
  };

  const handleSave = () => {
    const validTasks = tasks.filter((t) => t.focus.trim() !== '');
    const validGoals = goals
      .filter((g) => g.title.trim() !== '')
      .map((g) => ({
        ...g,
        checklist: (g.checklist || []).filter((item) => item.text.trim() !== ''),
      }));
    onSave(validTasks, validGoals);
    onClose();
  };

  const handleClose = () => {
    if (hasChanges) {
      setShowUnsavedPrompt(true);
      return;
    }
    onClose();
  };

  const tasksByDay = useMemo(() => {
    const grouped: Record<DayOfWeek, WeeklyTaskItem[]> = {
      周一: [],
      周二: [],
      周三: [],
      周四: [],
      周五: [],
      周六: [],
      周日: [],
    };
    tasks.forEach((t) => grouped[t.day].push(t));
    dayOrder.forEach((d) => grouped[d].sort((a, b) => a.category.localeCompare(b.category)));
    return grouped;
  }, [tasks]);

  const dayStats = useMemo(() => {
    const stats = {} as Record<DayOfWeek, { count: number; minutes: number }>;
    dayOrder.forEach((day) => {
      const list = tasksByDay[day];
      stats[day] = {
        count: list.length,
        minutes: list.reduce((sum, t) => sum + parseDurationMinutes(t.duration), 0),
      };
    });
    return stats;
  }, [tasksByDay]);

  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <Modal
        isOpen
        onClose={handleClose}
        title="编辑周计划"
        subtitle="管理任务安排与本周目标"
        icon="Pencil"
        iconClassName="bg-accent"
        size="lg"
        footer={
          <div className="flex w-full items-center justify-end gap-3">
            <Button variant="ghost" size="md" onClick={handleClose}>
              取消
            </Button>
            <Button variant="secondary" size="lg" onClick={handleSave}>
              <Icon name="Send" size="sm" />
              保存
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-xl border border-border-subtle bg-surface-elevated p-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 ${activeTab === 'tasks'
                  ? 'bg-primary text-text-primary'
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              任务安排
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab('goals')}
              className={`flex-1 ${activeTab === 'goals'
                  ? 'bg-primary text-text-primary'
                  : 'text-text-tertiary hover:text-text-secondary'
              }`}
            >
              本周目标
            </Button>
          </div>

          {activeTab === 'tasks' && (
            <div className="space-y-3">
              {dayOrder.map((day) => {
                const dayTasks = tasksByDay[day];
                const { count, minutes } = dayStats[day];
                const isCollapsed = collapsedDays[day];
                return (
                  <div
                    key={day}
                    className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-hover"
                  >
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={() => toggleDay(day)}
                      className="hover:bg-surface-hover/50 flex w-full items-center justify-between px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-text-secondary">{day}</span>
                        <span className="rounded-full bg-surface-hover px-2 py-0.5 text-xs text-text-tertiary">
                          {count} 项
                        </span>
                        {minutes > 0 && (
                          <span className="rounded-full bg-surface-hover px-2 py-0.5 text-xs text-text-tertiary">
                            约 {minutes} 分钟
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            addTask(day);
                          }}
                          className="rounded-lg p-1.5"
                          aria-label={`${day}添加任务`}
                        >
                          <Icon name="Plus" size="sm" />
                        </Button>
                        <Icon
                          name="ChevronDown"
                          size="sm"
                          className={`text-text-muted transition-transform ${
                            isCollapsed ? '-rotate-90' : ''
                          }`}
                        />
                      </div>
                    </Button>

                    <AnimatePresence initial={false}>
                      {!isCollapsed && (
                        <motion.div
                          initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-3 p-3">
                            {dayTasks.length === 0 && (
                              <EmptyState scene="no-data" size="sm" compact />
                            )}
                            {dayTasks.map((task) => (
                              <TaskEditRow
                                key={task.id}
                                task={task}
                                goals={goals}
                                isCopying={copyingTaskId === task.id}
                                onUpdate={updateTask}
                                onDelete={deleteTask}
                                onToggleCopy={() =>
                                  setCopyingTaskId(copyingTaskId === task.id ? null : task.id)
                                }
                                onCopy={(days) => {
                                  duplicateTask(task, days);
                                  setCopyingTaskId(null);
                                }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-text-muted">
                  目标用于汇总进度，任务可绑定到目标自动累计完成量
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={addGoal}
                >
                  <Icon name="Plus" size="xs" />
                  新建目标
                </Button>
              </div>

              {goals.length === 0 && (
                <div className="rounded-2xl border border-border-subtle bg-surface-hover py-10 text-center">
                  <Icon name="Target" size="xl" className="mx-auto mb-2 text-text-muted" />
                  <p className="text-sm text-text-muted">还没有目标，点击上方添加</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="space-y-3 rounded-2xl border border-border-subtle bg-surface-hover p-4"
                  >
                    <div className="grid grid-cols-12 items-start gap-3">
                      <div className="col-span-5">
                        <label className="mb-1 block text-2xs text-text-muted">目标名称</label>
                        <input
                          type="text"
                          value={goal.title}
                          onChange={(e) => updateGoal(goal.id, { title: e.target.value })}
                          placeholder="例如：阅读精读"
                          className="w-full rounded-lg border border-border-default bg-surface px-2 py-1.5 text-xs text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="mb-1 block text-2xs text-text-muted">类别</label>
                        <Select
                          value={goal.category}
                          onChange={(e) =>
                            updateGoal(goal.id, { category: e.target.value as TaskCategory })
                          }
                          size="sm"
                          className="bg-surface"
                          options={allCategories.map((c) => ({
                            value: c,
                            label: TASK_CATEGORY_LABELS[c],
                          }))}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="mb-1 block text-2xs text-text-muted">目标量</label>
                        <input
                          type="number"
                          min={0}
                          value={goal.quantityTarget ?? 0}
                          onChange={(e) =>
                            updateGoal(goal.id, {
                              quantityTarget: parseInt(e.target.value || '0', 10),
                            })
                          }
                          className="w-full rounded-lg border border-border-default bg-surface px-2 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="mb-1 block text-2xs text-text-muted">单位</label>
                        <input
                          type="text"
                          value={goal.quantityUnit ?? ''}
                          onChange={(e) => updateGoal(goal.id, { quantityUnit: e.target.value })}
                          placeholder="篇/首"
                          className="w-full rounded-lg border border-border-default bg-surface px-2 py-1.5 text-xs text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="block text-2xs text-text-muted">明细清单</label>
                        <Button
                          type="button"
                          onClick={() => addGoalChecklistItem(goal.id)}
                          className="text-2xs text-primary hover:text-primary-glow"
                          variant="link"
                          size="xs"
                        >
                          + 添加明细
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(goal.checklist || []).map((item) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item.text}
                              onChange={(e) =>
                                updateGoalChecklistItem(goal.id, item.id, e.target.value)
                              }
                              placeholder="例如：《朝花夕拾》精读第二章"
                              className="flex-1 rounded-lg border border-border-default bg-surface px-2 py-1.5 text-xs text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none"
                            />
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => deleteGoalChecklistItem(goal.id, item.id)}
                              className="hover:bg-error/10 rounded-lg p-1.5 text-text-muted hover:text-error"
                            >
                              <Icon name="Trash2" size="xs" />
                            </Button>
                          </div>
                        ))}
                        {(goal.checklist || []).length === 0 && (
                          <p className="text-xs text-text-muted">暂无明细</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="danger"
                        size="xs"
                        onClick={() => deleteGoal(goal.id)}
                        className="hover:text-error/80"
                      >
                        <Icon name="Trash2" size="xs" />
                        删除目标
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>

      <AnimatePresence>
        {showUnsavedPrompt && (
          <UnsavedPrompt
            onCancel={() => setShowUnsavedPrompt(false)}
            onConfirm={() => {
              setShowUnsavedPrompt(false);
              onClose();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

const durationPresets = ['15分钟', '20分钟', '30分钟', '45分钟', '60分钟'];

interface TaskEditRowProps {
  task: WeeklyTaskItem;
  goals: WeeklyGoal[];
  isCopying: boolean;
  onUpdate: (id: string, updates: Partial<Omit<WeeklyTaskItem, 'id'>>) => void;
  onDelete: (id: string) => void;
  onToggleCopy: () => void;
  onCopy: (days: DayOfWeek[]) => void;
}

function TaskEditRow({
  task,
  goals,
  isCopying,
  onUpdate,
  onDelete,
  onToggleCopy,
  onCopy,
}: TaskEditRowProps) {
  const [selectedDays, setSelectedDays] = useState<Set<DayOfWeek>>(new Set());
  const [materialInput, setMaterialInput] = useState('');
  const categoryIcon = categoryIcons[task.category];

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const handleCopy = () => {
    if (selectedDays.size === 0) return;
    onCopy(Array.from(selectedDays));
    setSelectedDays(new Set());
  };

  return (
    <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3">
      <div className="grid grid-cols-12 items-start gap-2">
        <div className="col-span-6 sm:col-span-2">
          <label className="mb-1 block text-2xs text-text-muted">分类</label>
          <div className="relative">
            <Icon
              name={categoryIcon}
              size="xs"
              className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-text-tertiary"
            />
            <Select
              value={task.category}
              onChange={(e) =>
                onUpdate(task.id, {
                  category: e.target.value as TaskCategory,
                })
              }
              size="sm"
              className="bg-surface"
              options={allCategories.map((c) => ({
                value: c,
                label: TASK_CATEGORY_LABELS[c],
              }))}
            />
          </div>
        </div>

        <div className="col-span-6 sm:col-span-4">
          <label className="mb-1 block text-2xs text-text-muted">任务内容</label>
          <input
            type="text"
            value={task.focus}
            onChange={(e) => onUpdate(task.id, { focus: e.target.value })}
            placeholder="例如：古诗新学"
            className="w-full rounded-lg border border-border-default bg-surface px-2 py-1.5 text-xs text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none"
          />
        </div>

        <div className="col-span-4 sm:col-span-2">
          <label className="mb-1 block text-2xs text-text-muted">时段</label>
          <Select
            value={task.timeSlot || 'flexible'}
            onChange={(e) => onUpdate(task.id, { timeSlot: e.target.value as TimeSlot })}
            size="sm"
            className="bg-surface"
            options={timeSlotOrder.map((slot) => ({
              value: slot,
              label: getTimeSlotLabel(slot),
            }))}
          />
        </div>

        <div className="col-span-4 sm:col-span-2">
          <label className="mb-1 block text-2xs text-text-muted">时长</label>
          <input
            type="text"
            value={task.duration}
            onChange={(e) => onUpdate(task.id, { duration: e.target.value })}
            placeholder="30分钟"
            className="w-full rounded-lg border border-border-default bg-surface px-2 py-1.5 text-xs text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none"
          />
          <div className="mt-1.5 flex flex-wrap gap-1">
            {durationPresets.map((preset) => (
              <Button
                key={preset}
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => onUpdate(task.id, { duration: preset })}
                className={`rounded px-1.5 py-0.5 text-[9px] ${
                  task.duration === preset
                    ? 'border border-accent/30 bg-accent/20 text-accent'
                    : 'bg-surface-elevated text-text-muted hover:bg-surface-highlight'
                }`}
              >
                {preset.replace('分钟', '')}
              </Button>
            ))}
          </div>
        </div>

        <div className="col-span-4 flex items-end justify-end gap-1 sm:col-span-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={onToggleCopy}
            className={`focus-ring rounded-lg p-1.5 ${
              isCopying
                ? 'bg-primary/[0.08] text-primary'
                : 'text-text-muted hover:bg-surface-highlight hover:text-text-secondary'
            }`}
            aria-label="复制到其它日期"
            title="复制到其它日期"
          >
            <Icon name="Copy" size="sm" />
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onDelete(task.id)}
            className="hover:bg-error/10 focus-ring rounded-lg p-1.5 text-text-muted hover:text-error"
            aria-label="删除任务"
          >
            <Icon name="Trash2" size="sm" />
          </Button>
        </div>
      </div>

      <div className="mt-2">
        <label className="mb-1 block text-2xs text-text-muted">绑定目标</label>
        <Select
          value={task.goalId || ''}
          onChange={(e) =>
            onUpdate(task.id, {
              goalId: e.target.value || undefined,
            })
          }
          size="sm"
          className="bg-surface"
          placeholder="不绑定目标"
          options={goals.map((g) => ({
            value: g.id,
            label: g.title,
          }))}
        />
      </div>

      <div className="mt-2">
        <label className="mb-1 block text-2xs text-text-muted">材料/关键词</label>
        <div className="flex flex-wrap items-center gap-1.5">
          {task.materials.map((m, idx) => (
            <span
              key={`${m}-${idx}`}
              className="flex items-center gap-1 rounded-full bg-surface-highlight px-2 py-0.5 text-2xs text-text-secondary"
            >
              {m}
              <Button
                onClick={() =>
                  onUpdate(task.id, {
                    materials: task.materials.filter((_, i) => i !== idx),
                  })
                }
                className="hover:text-error"
                aria-label={`删除 ${m}`}
                variant="ghost"
                size="xs"
              >
                <Icon name="X" size="xs" />
              </Button>
            </span>
          ))}
          <input
            type="text"
            value={materialInput}
            onChange={(e) => {
              const value = e.target.value;
              if (value.includes(',') || value.includes('，')) {
                const parts = value
                  .split(/[,，]/)
                  .map((s) => s.trim())
                  .filter(Boolean);
                if (parts.length > 0) {
                  onUpdate(task.id, {
                    materials: [...task.materials, ...parts],
                  });
                }
                setMaterialInput('');
              } else {
                setMaterialInput(value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const value = materialInput.trim();
                if (value) {
                  onUpdate(task.id, {
                    materials: [...task.materials, value],
                  });
                  setMaterialInput('');
                }
              }
            }}
            placeholder={task.materials.length === 0 ? '输入后回车或逗号分隔' : ''}
            className="min-w-[120px] border-none bg-transparent px-1 py-0.5 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      <div className="mt-2">
        <label className="mb-1 block text-2xs text-text-muted">详细说明（周总结会引用）</label>
        <Textarea
          value={task.note || ''}
          onChange={(e) => onUpdate(task.id, { note: e.target.value })}
          placeholder="例如：今天阅读《夏洛的网》第1-3章，完成生词摘抄..."
          rows={2}
          resize="none"
          className="border-border-default bg-surface px-2 py-1.5 text-xs text-text-primary"
        />
      </div>

      <AnimatePresence>
        {isCopying && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 border-t border-border-subtle pt-3">
              <p className="mb-2 text-2xs text-text-tertiary">复制到以下日期：</p>
              <div className="mb-3 flex flex-wrap gap-2">
                {dayOrder.map((day) => {
                  const selected = selectedDays.has(day);
                  return (
                    <Button
                      key={day}
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => toggleDay(day)}
                      className={`rounded-lg px-2.5 py-1 ${
                        selected
                          ? 'bg-primary/[0.08] border-primary/25 border text-primary'
                          : 'border border-border-subtle bg-surface-elevated text-text-tertiary hover:bg-surface-elevated'
                      }`}
                    >
                      {day}
                    </Button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  disabled={selectedDays.size === 0}
                  className="bg-primary/[0.08] hover:bg-primary/[0.12] text-primary"
                >
                  确认复制
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onToggleCopy}
                  className="bg-surface-elevated text-text-tertiary hover:bg-surface-highlight"
                >
                  取消
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface UnsavedPromptProps {
  onCancel: () => void;
  onConfirm: () => void;
}

function UnsavedPrompt({ onCancel, onConfirm }: UnsavedPromptProps) {
  return (
    <Modal
      isOpen
      onClose={onCancel}
      title="有未保存的更改"
      subtitle="关闭后将丢失本次编辑内容"
      icon="AlertTriangle"
      iconClassName="bg-warning"
      size="sm"
      showClose={false}
      footer={
        <div className="flex w-full items-center justify-center gap-3">
          <Button
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-text-tertiary transition-colors hover:text-text-primary"
            variant="ghost"
            size="md"
          >
            继续编辑
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-error/15 hover:bg-error/20 rounded-lg px-4 py-2 text-error transition-colors"
            variant="danger"
            size="md"
          >
            放弃更改
          </Button>
        </div>
      }
    >
      <p className="text-center text-sm text-text-tertiary">
        当前编辑内容尚未保存，确定要关闭弹窗吗？
      </p>
    </Modal>
  );
}

interface TaskLibraryModalProps {
  childId: string;
  childRouteId?: string | null;
  weekId: string;
  existingTasks: WeeklyTaskItem[];
  onClose: () => void;
  onAdd: (tasks: WeeklyTaskItem[]) => void;
}

function TaskLibraryModal({
  childId,
  childRouteId,
  weekId,
  existingTasks,
  onClose,
  onAdd,
}: TaskLibraryModalProps) {
  const { data: templates = [], isLoading: loading } = useTaskTemplates(childId, {
    status: 'active',
  });
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<Set<string>>(new Set());
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('周一');
  const [assessments, setAssessments] = useState<TaskRationalityAssessment[] | null>(null);
  const assess = useAssessTasks();

  useEffect(() => {
    setAssessments(null);
  }, [selectedTemplateIds, selectedDay]);

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
      title="从任务库选择"
      subtitle={`勾选常用任务一键添加到${selectedDay}`}
      icon="Library"
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
                  确认添加
                </>
              ) : (
                <>
                  <Icon name="Sparkles" size="sm" animate="pulse" />
                  AI 评估并添加
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
            options={dayOrder.map((d) => ({
              value: d,
              label: d,
            }))}
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
                    className={`mt-0.5 flex size-5 items-center justify-center rounded border ${selected ? 'border-primary bg-primary' : 'border-border-default'}`}
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
                          className={`rounded border px-1.5 py-0.5 text-2xs ${getAlignmentColorClass(alignment)}`}
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
                    onClick={() => setLibraryOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-[14px] border border-border-default bg-surface px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                    variant="secondary"
                    size="md"
                  >
                    <Icon name="Library" size="xs" />
                    从任务库选择
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
          icon={Sparkles}
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

function SaveTemplateModal({
  onClose,
  onSave,
  saving,
}: {
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  saving: boolean;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="保存为周计划模板"
      subtitle="将当前周计划保存为可复用的模板"
      icon="Save"
      size="md"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-text-tertiary transition-colors hover:text-text-secondary"
            variant="ghost"
            size="md"
          >
            取消
          </Button>
          <Button
            onClick={() => onSave(name, description)}
            disabled={saving || !name.trim()}
            className="flex items-center gap-2 rounded-xl bg-secondary px-5 py-2 font-semibold text-text-primary transition-all hover:shadow-[0_0_30px_color-mix(in_srgb,var(--color-secondary)_40%,transparent)] disabled:opacity-50"
            variant="secondary"
            size="md"
          >
            {saving ? (
              <Icon name="Loader" size="sm" animate="spin" />
            ) : (
              <Icon name="Save" size="sm" />
            )}
            保存
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs text-text-tertiary">模板名称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：三年级上学期第 1 周"
            className="focus:border-primary/50 w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-text-tertiary">备注说明（可选）</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="简要描述模板适用场景"
            rows={3}
            resize="none"
            className="focus:border-primary/50 border-border-default bg-surface-elevated px-3 py-2 text-text-secondary"
          />
        </div>
      </div>
    </Modal>
  );
}

function ApplyTemplateModal({
  templates,
  onClose,
  onApply,
}: {
  templates: WeeklyPlanTemplate[];
  onClose: () => void;
  onApply: (templateId: string, mode: 'merge' | 'replace') => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<'merge' | 'replace'>('merge');

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="套用周计划模板"
      subtitle="选择已有模板应用到当前周计划"
      icon="LayoutTemplate"
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-text-tertiary transition-colors hover:text-text-secondary"
            variant="ghost"
            size="md"
          >
            取消
          </Button>
          <Button
            onClick={() => selectedId && onApply(selectedId, mode)}
            disabled={!selectedId}
            className="flex items-center gap-2 rounded-xl bg-secondary px-5 py-2 font-semibold text-text-primary transition-all hover:shadow-[0_0_30px_color-mix(in_srgb,var(--color-secondary)_40%,transparent)] disabled:opacity-50"
            variant="secondary"
            size="md"
          >
            套用
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-xl border border-border-default bg-surface-elevated p-1">
          <Button
            onClick={() => setMode('merge')}
            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === 'merge'
                ? 'bg-secondary text-text-primary'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
            variant="ghost"
            size="sm"
          >
            合并到当前计划
          </Button>
          <Button
            onClick={() => setMode('replace')}
            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === 'replace'
                ? 'bg-secondary text-text-primary'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
            variant="ghost"
            size="sm"
          >
            替换当前计划
          </Button>
        </div>

        {templates.length === 0 ? (
          <EmptyState scene="no-data" size="sm" />
        ) : (
          <div className="max-h-[50vh] space-y-2 overflow-y-auto">
            {templates.map((tpl) => (
              <Button
                key={tpl.id}
                onClick={() => setSelectedId(tpl.id)}
                className={`w-full rounded-xl border p-3 text-left transition-all ${
                  selectedId === tpl.id
                    ? 'bg-secondary/10 border-secondary/30'
                    : 'border-border-subtle bg-surface-elevated hover:border-border-default'
                }`}
                variant="secondary"
                size="sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-secondary">{tpl.name}</span>
                  {selectedId === tpl.id && (
                    <Icon name="CircleCheck" size="sm" className="text-secondary" />
                  )}
                </div>
                {tpl.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-text-muted">{tpl.description}</p>
                )}
                <p className="mt-2 text-2xs text-text-tertiary">{tpl.tasks.length} 个任务</p>
              </Button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

function CopyHistoryModal({
  childId,
  currentWeekId,
  onClose,
  onCopy,
}: {
  childId: string;
  currentWeekId: string;
  onClose: () => void;
  onCopy: (sourceWeekId: string) => void;
}) {
  const { data: plans = [], isLoading } = useWeeklyPlans(childId);
  const history = useMemo(
    () =>
      plans
        .filter((p) => p.weekId !== currentWeekId)
        .sort((a, b) => b.weekId.localeCompare(a.weekId)),
    [plans, currentWeekId]
  );

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="复制历史周计划"
      subtitle="选择历史周计划复制到当前周"
      icon="History"
      size="lg"
    >
      <div className="max-h-[60vh] space-y-2 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Skeleton variant="rounded" width={240} height={24} />
          </div>
        ) : history.length === 0 ? (
          <EmptyState scene="no-data" size="sm" />
        ) : (
          history.map((plan) => (
            <div
              key={plan.weekId}
              className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-elevated p-3"
            >
              <div>
                <p className="text-sm font-medium text-text-secondary">
                  {formatWeekLabel(plan.weekId)}
                </p>
                <p className="mt-0.5 text-2xs text-text-tertiary">
                  {plan.tasks.length} 个任务 ·{' '}
                  {plan.tasks.filter((t) => t.status === 'done').length} 已完成
                </p>
              </div>
              <Button
                onClick={() => onCopy(plan.weekId)}
                className="bg-secondary/10 hover:bg-secondary/20 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-secondary transition-colors"
                variant="secondary"
                size="sm"
              >
                <Icon name="Copy" size="xs" />
                复制
              </Button>
            </div>
          ))
        )}
      </div>
    </Modal>
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
