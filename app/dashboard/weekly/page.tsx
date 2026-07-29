'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Clock,
  Target,
  Sparkles,
  RotateCcw,
  Send,
  Pencil,
  Plus,
  Trash2,
  Library,
  ChevronDown,
  Copy,
  AlertTriangle,
  Share2,
  X,
  Trophy,
  TrendingUp,
} from 'lucide-react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import TaskCard from '@/components/dashboard/TaskCard';
import EmptyState from '@/components/ui/EmptyState';
import MetricRing from '@/components/ui/MetricRing';
import WeeklyReportExport from '@/components/weekly/WeeklyReportExport';
import { gradeLabel } from '@/lib/children';
import { categoryIcons, allCategories } from '@/lib/taskIcons';
import {
  type WeeklyPlan,
  type WeeklyTaskItem,
  type TaskStatus,
  type SubjectId,
  type DayOfWeek,
  type TaskCategory,
  type TaskTemplate,
  type TaskAlignment,
} from '@/lib/storage.types';
import {
  getCurrentWeekId,
  getISOWeek,
  getWeekRange,
  formatWeekLabel,
  getTasksByDay,
  getPlanStats,
  generateAiReview,
  getTodayName,
  toggleTaskStatus,
  dayOrder,
  parseDurationMinutes,
} from '@/lib/weeklyTasks';
import {
  TASK_CATEGORY_LABELS,
  TASK_ALIGNMENT_LABELS,
} from '@/lib/taskTemplates';
import {
  getCategoryColorClass,
  getAlignmentColorClass,
  computeTaskAlignment,
} from '@/lib/taskAlignment';

const durationPresets = ['15分钟', '20分钟', '30分钟', '45分钟', '60分钟'];

type ViewMode = 'day' | 'matrix';

function shiftWeekId(weekId: string, delta: number): string {
  const { start } = getWeekRange(weekId);
  const next = new Date(start);
  next.setDate(start.getDate() + delta * 7);
  return getISOWeek(next).weekId;
}

interface EditPlanModalProps {
  plan: WeeklyPlan;
  onClose: () => void;
  onSave: (tasks: WeeklyTaskItem[]) => void;
}

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

  const [tasks, setTasks] = useState<WeeklyTaskItem[]>(initialTasks);
  const [collapsedDays, setCollapsedDays] = useState<Record<DayOfWeek, boolean>>(
    () => {
      const init = {} as Record<DayOfWeek, boolean>;
      dayOrder.forEach((d) => (init[d] = false));
      return init;
    }
  );
  const [copyingTaskId, setCopyingTaskId] = useState<string | null>(null);
  const [showUnsavedPrompt, setShowUnsavedPrompt] = useState(false);

  const hasChanges = useMemo(() => {
    return JSON.stringify(initialTasks) !== JSON.stringify(tasks);
  }, [initialTasks, tasks]);

  useEffect(() => {
    if (!hasChanges) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasChanges]);

  const updateTask = (
    id: string,
    updates: Partial<Omit<WeeklyTaskItem, 'id'>>
  ) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
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

  const handleSave = () => {
    const validTasks = tasks.filter((t) => t.focus.trim() !== '');
    onSave(validTasks);
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
    dayOrder.forEach((d) =>
      grouped[d].sort((a, b) => a.category.localeCompare(b.category))
    );
    return grouped;
  }, [tasks]);

  const dayStats = useMemo(() => {
    const stats: Record<DayOfWeek, { count: number; minutes: number }> =
      {} as any;
    dayOrder.forEach((day) => {
      const list = tasksByDay[day];
      stats[day] = {
        count: list.length,
        minutes: list.reduce(
          (sum, t) => sum + parseDurationMinutes(t.duration),
          0
        ),
      };
    });
    return stats;
  }, [tasksByDay]);

  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center sm:justify-center sm:p-4 bg-black/70 backdrop-blur-sm"
      onClick={handleClose}
    >
      <motion.div
        initial={shouldReduceMotion ? false : { scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-plan-title"
        className="w-full h-full sm:h-auto sm:max-w-3xl sm:max-h-[85vh] overflow-y-auto rounded-none sm:rounded-3xl glass sm:border border-border-default p-5 sm:p-8 modal-scroll"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-glow-primary">
              <Pencil className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="edit-plan-title" className="text-h3 font-display text-white">
                编辑周任务
              </h2>
              <p className="text-micro text-text-tertiary">
                按星期分组管理，支持复制到多天
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-surface-light text-text-tertiary focus-ring"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {dayOrder.map((day) => {
            const dayTasks = tasksByDay[day];
            const { count, minutes } = dayStats[day];
            const isCollapsed = collapsedDays[day];
            return (
              <div
                key={day}
                className="rounded-2xl hud-panel overflow-hidden"
              >
                <button
                  onClick={() => toggleDay(day)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-light/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-caption font-bold text-white">{day}</span>
                    <span className="text-micro px-2 py-0.5 rounded-full bg-surface-elevated text-text-tertiary border border-border-default">
                      {count} 项
                    </span>
                    {minutes > 0 && (
                      <span className="text-micro px-2 py-0.5 rounded-full bg-surface-elevated text-text-tertiary border border-border-default">
                        约 {minutes} 分钟
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addTask(day);
                      }}
                      className="p-1.5 rounded-lg hover:bg-surface-elevated text-text-tertiary hover:text-white transition-colors focus-ring"
                      aria-label={`${day}添加任务`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <ChevronDown
                      className={`w-4 h-4 text-text-muted transition-transform ${
                        isCollapsed ? '-rotate-90' : ''
                      }`}
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 space-y-3">
                        {dayTasks.length === 0 && (
                          <div className="text-center py-4 text-micro text-text-muted">
                            暂无任务，点击上方 + 添加
                          </div>
                        )}
                        {dayTasks.map((task) => (
                          <TaskEditRow
                            key={task.id}
                            task={task}
                            isCopying={copyingTaskId === task.id}
                            onUpdate={updateTask}
                            onDelete={deleteTask}
                            onToggleCopy={() =>
                              setCopyingTaskId(
                                copyingTaskId === task.id ? null : task.id
                              )
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

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-xl text-caption text-text-tertiary hover:text-white transition-colors focus-ring"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-white text-caption font-semibold hover:shadow-glow-primary transition-all focus-ring"
          >
            <Send className="w-4 h-4" />
            保存
          </button>
        </div>
      </motion.div>

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
    </motion.div>
  );
}

interface TaskEditRowProps {
  task: WeeklyTaskItem;
  isCopying: boolean;
  onUpdate: (id: string, updates: Partial<Omit<WeeklyTaskItem, 'id'>>) => void;
  onDelete: (id: string) => void;
  onToggleCopy: () => void;
  onCopy: (days: DayOfWeek[]) => void;
}

function TaskEditRow({
  task,
  isCopying,
  onUpdate,
  onDelete,
  onToggleCopy,
  onCopy,
}: TaskEditRowProps) {
  const [selectedDays, setSelectedDays] = useState<Set<DayOfWeek>>(new Set());
  const [materialInput, setMaterialInput] = useState('');
  const CategoryIcon = categoryIcons[task.category];

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
    <div className="rounded-xl bg-surface-light border border-border-default p-3">
      <div className="grid grid-cols-12 gap-2 items-start">
        <div className="col-span-6 sm:col-span-2">
          <label className="block text-micro text-text-muted mb-1">分类</label>
          <div className="relative">
            <CategoryIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
            <select
              value={task.category}
              onChange={(e) =>
                onUpdate(task.id, {
                  category: e.target.value as TaskCategory,
                })
              }
              className="w-full pl-7 pr-2 text-micro bg-surface border border-border-default rounded-lg py-1.5 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            >
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {TASK_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-span-6 sm:col-span-5">
          <label className="block text-micro text-text-muted mb-1">任务内容</label>
          <input
            type="text"
            value={task.focus}
            onChange={(e) => onUpdate(task.id, { focus: e.target.value })}
            placeholder="例如：古诗新学"
            className="w-full text-micro bg-surface border border-border-default rounded-lg px-2 py-1.5 text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
          />
        </div>

        <div className="col-span-6 sm:col-span-2">
          <label className="block text-micro text-text-muted mb-1">时长</label>
          <input
            type="text"
            value={task.duration}
            onChange={(e) => onUpdate(task.id, { duration: e.target.value })}
            placeholder="30分钟"
            className="w-full text-micro bg-surface border border-border-default rounded-lg px-2 py-1.5 text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
          />
          <div className="flex flex-wrap gap-1 mt-1.5">
            {durationPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onUpdate(task.id, { duration: preset })}
                className={`text-micro px-1.5 py-0.5 rounded transition-colors ${
                  task.duration === preset
                    ? 'bg-primary-dim text-primary border border-primary/30'
                    : 'bg-surface text-text-muted hover:bg-surface-elevated'
                }`}
              >
                {preset.replace('分钟', '')}
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-5 sm:col-span-2 flex justify-end items-end gap-1">
          <button
            onClick={onToggleCopy}
            className={`p-1.5 rounded-lg transition-colors focus-ring ${
              isCopying
                ? 'bg-secondary-dim text-secondary'
                : 'hover:bg-surface-elevated text-text-muted hover:text-white'
            }`}
            aria-label="复制到其它日期"
            title="复制到其它日期"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger transition-colors focus-ring"
            aria-label="删除任务"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-2">
        <label className="block text-micro text-text-muted mb-1">材料/关键词</label>
        <div className="flex flex-wrap items-center gap-1.5">
          {task.materials.map((m, idx) => (
            <span
              key={`${m}-${idx}`}
              className="text-micro px-2 py-0.5 rounded-full bg-surface-elevated text-text-secondary border border-border-default flex items-center gap-1"
            >
              {m}
              <button
                onClick={() =>
                  onUpdate(task.id, {
                    materials: task.materials.filter((_, i) => i !== idx),
                  })
                }
                className="hover:text-danger"
                aria-label={`删除 ${m}`}
              >
                <X className="w-3 h-3" />
              </button>
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
            className="min-w-[120px] text-micro bg-transparent border-none px-1 py-0.5 text-white placeholder:text-text-muted focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      <AnimatePresence>
        {isCopying && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-border-default">
              <p className="text-micro text-text-tertiary mb-2">复制到以下日期：</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {dayOrder.map((day) => {
                  const selected = selectedDays.has(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-2.5 py-1 rounded-lg text-micro transition-all focus-ring ${
                        selected
                          ? 'bg-secondary-dim text-secondary border border-secondary/30'
                          : 'bg-surface text-text-tertiary border border-border-default hover:bg-surface-light'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={selectedDays.size === 0}
                  className="px-3 py-1.5 rounded-lg bg-secondary-dim text-secondary text-micro hover:bg-secondary/15 transition-colors disabled:opacity-50 focus-ring"
                >
                  确认复制
                </button>
                <button
                  type="button"
                  onClick={onToggleCopy}
                  className="px-3 py-1.5 rounded-lg bg-surface text-text-tertiary text-micro hover:bg-surface-light transition-colors focus-ring"
                >
                  取消
                </button>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] flex items-center sm:justify-center sm:p-4 bg-black/80 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl glass border border-border-default p-6 text-center mx-4"
      >
        <AlertTriangle className="w-10 h-10 text-warning mx-auto mb-3" />
        <h3 className="text-h4 font-bold text-white mb-2">有未保存的更改</h3>
        <p className="text-caption text-text-tertiary mb-6">
          关闭后将丢失本次编辑内容，确定要取消吗？
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-caption text-text-secondary hover:text-white transition-colors focus-ring"
          >
            继续编辑
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-danger/10 text-danger text-caption hover:bg-danger/15 transition-colors focus-ring"
          >
            放弃更改
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface TaskLibraryModalProps {
  childId: string;
  childGrade: number;
  childRouteId?: string | null;
  weekId: string;
  existingTasks: WeeklyTaskItem[];
  onClose: () => void;
  onAdd: (tasks: WeeklyTaskItem[]) => void;
}

function TaskLibraryModal({
  childId,
  childGrade,
  childRouteId,
  onClose,
  onAdd,
}: TaskLibraryModalProps) {
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<Set<string>>(new Set());
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('周一');
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    fetch('/api/task-templates')
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredTemplates = useMemo(() => {
    let list = templates;
    if (selectedCategory !== 'all') {
      list = list.filter((t) => t.category === selectedCategory);
    }
    return list.map((tpl) => ({
      ...tpl,
      alignment: computeTaskAlignment({
        child: { grade: childGrade, routeId: childRouteId },
        template: tpl,
      }),
    })) as (TaskTemplate & { alignment: TaskAlignment })[];
  }, [templates, selectedCategory, childGrade, childRouteId]);

  const toggleTemplate = (id: string) => {
    setSelectedTemplateIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdd = () => {
    const selected = templates.filter((t) => selectedTemplateIds.has(t.id));
    const newTasks: WeeklyTaskItem[] = selected.map((tpl) => {
      const category = tpl.category as TaskCategory;
      const alignment = computeTaskAlignment({
        child: { grade: childGrade, routeId: childRouteId },
        template: tpl,
      });
      return {
        id: `library-${tpl.id}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        category,
        subjectId: ['chinese', 'math', 'english'].includes(category)
          ? (category as SubjectId)
          : undefined,
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
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center sm:justify-center sm:p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={shouldReduceMotion ? false : { scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="library-title"
        className="w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[85vh] overflow-y-auto rounded-none sm:rounded-3xl glass sm:border border-border-default p-5 sm:p-8 modal-scroll"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center shadow-glow-secondary">
              <Library className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="library-title" className="text-h3 font-display text-white">
                从任务库选择
              </h2>
              <p className="text-micro text-text-tertiary">
                勾选常用任务，一键添加到{selectedDay}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-light text-text-tertiary focus-ring"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-micro transition-colors focus-ring ${
                selectedCategory === 'all'
                  ? 'bg-secondary-dim text-secondary border border-secondary/30'
                  : 'bg-surface text-text-tertiary border border-border-default hover:text-white hover:bg-surface-light'
              }`}
            >
              全部
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-micro transition-colors focus-ring ${
                  selectedCategory === cat
                    ? 'bg-secondary-dim text-secondary border border-secondary/30'
                    : 'bg-surface text-text-tertiary border border-border-default hover:text-white hover:bg-surface-light'
                }`}
              >
                {TASK_CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-micro text-text-muted">添加到</span>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
              className="text-micro bg-surface border border-border-default rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-secondary/50"
            >
              {dayOrder.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-text-muted text-caption">加载中...</div>
        ) : filteredTemplates.length === 0 ? (
          <div className="py-12 text-center text-text-muted text-caption">暂无任务模板</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-h-[50vh] overflow-y-auto pr-1">
            {filteredTemplates.map((tpl) => {
              const selected = selectedTemplateIds.has(tpl.id);
              const CategoryIcon = categoryIcons[tpl.category];
              const alignment = tpl.alignment;
              return (
                <button
                  key={tpl.id}
                  onClick={() => toggleTemplate(tpl.id)}
                  className={`text-left rounded-xl border p-3 transition-all focus-ring ${
                    selected
                      ? 'bg-secondary-dim border-secondary/30 shadow-glow-secondary'
                      : 'bg-surface border-border-default hover:bg-surface-light hover:border-border-strong'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        selected ? 'bg-secondary border-secondary' : 'border-border-strong'
                      }`}
                    >
                      {selected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <CategoryIcon className="w-3.5 h-3.5 text-text-tertiary" />
                        <span className="text-micro text-text-tertiary">
                          {TASK_CATEGORY_LABELS[tpl.category]}
                        </span>
                        {alignment && alignment !== 'unrelated' && (
                          <span
                            className={`text-micro px-1.5 py-0.5 rounded border ${getAlignmentColorClass(
                              alignment
                            )}`}
                          >
                            {TASK_ALIGNMENT_LABELS[alignment]}
                          </span>
                        )}
                        {alignment === 'unrelated' && (
                          <span className="text-micro px-1.5 py-0.5 rounded bg-surface-elevated text-text-muted border border-border-default">
                            不相关
                          </span>
                        )}
                        <span className="text-micro px-1.5 py-0.5 rounded-full bg-surface-elevated text-text-secondary border border-border-default ml-auto">
                          {tpl.duration}
                        </span>
                      </div>
                      <p className="text-caption font-semibold text-white mb-1 truncate">
                        {tpl.title}
                      </p>
                      {tpl.description && (
                        <p className="text-micro text-text-muted line-clamp-2 mb-1">
                          {tpl.description}
                        </p>
                      )}
                      {tpl.routeTags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {tpl.routeTags.map((tag) => (
                            <span
                              key={tag}
                              className="text-micro px-1 py-0.5 rounded bg-surface-elevated text-text-muted border border-border-default"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-caption text-text-muted">
            已选 <span className="data-value text-text-secondary">{selectedTemplateIds.size}</span> 项
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-caption text-text-tertiary hover:text-white transition-colors focus-ring"
            >
              取消
            </button>
            <button
              onClick={handleAdd}
              disabled={selectedTemplateIds.size === 0}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-secondary to-secondary-glow text-white text-caption font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow-secondary transition-all focus-ring"
            >
              <Plus className="w-4 h-4" />
              添加选中任务
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function WeeklyTasksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();
  const viewFromUrl = searchParams.get('view') as ViewMode | null;
  const {
    currentChild,
    getWeeklyPlan,
    generateWeeklyPlanDraft,
    publishWeeklyPlan,
    updateTaskStatus,
    reviewWeeklyPlan,
  } = useChildren();

  const [weekId, setWeekId] = useState<string>(getCurrentWeekId());
  const [viewMode, setViewModeState] = useState<ViewMode>(
    viewFromUrl === 'matrix' ? 'matrix' : 'day'
  );
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getTodayName());
  const [matrixDay, setMatrixDay] = useState<DayOfWeek>(getTodayName());
  const [draftPlan, setDraftPlan] = useState<WeeklyPlan | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const today = getTodayName();

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', mode);
    router.replace(`/dashboard/weekly?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    setDraftPlan(null);
    setSelectedDay(today);
    setMatrixDay(today);
  }, [weekId, today]);

  const plan = useMemo(() => {
    if (!currentChild) return undefined;
    return getWeeklyPlan(weekId, currentChild.id);
  }, [currentChild, getWeeklyPlan, weekId]);

  const displayPlan = draftPlan ?? plan;
  const isDraft = !!draftPlan;
  const isPublished = !!plan?.publishedAt;
  const stats = useMemo(
    () => (displayPlan ? getPlanStats(displayPlan) : null),
    [displayPlan]
  );

  const { year, week } = useMemo(() => {
    const parsed = weekId.split('-W');
    return { year: parsed[0], week: parsed[1] };
  }, [weekId]);

  const handleGenerate = () => {
    if (!currentChild) return;
    setDraftPlan(generateWeeklyPlanDraft(currentChild, weekId));
  };

  const handlePublish = async () => {
    if (!draftPlan) return;
    await publishWeeklyPlan(draftPlan);
    setDraftPlan(null);
  };

  const handleCancelDraft = () => {
    setDraftPlan(null);
  };

  const handleToggleTask = async (task: WeeklyTaskItem) => {
    if (!currentChild || !displayPlan) return;
    if (isDraft) {
      setDraftPlan((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tasks: prev.tasks.map((t) =>
            t.id === task.id
              ? {
                  ...t,
                  status: toggleTaskStatus(t.status),
                  completedAt:
                    t.status !== 'done' ? new Date().toISOString() : undefined,
                }
              : t
          ),
        };
      });
      return;
    }
    await updateTaskStatus(
      currentChild.id,
      weekId,
      task.id,
      toggleTaskStatus(task.status)
    );
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

  const handleSaveTasks = async (tasks: WeeklyTaskItem[]) => {
    if (!displayPlan || !currentChild) return;
    if (isDraft) {
      setDraftPlan({ ...displayPlan, tasks });
    } else {
      await publishWeeklyPlan({ ...displayPlan, tasks });
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

  const lastWeekId = useMemo(() => shiftWeekId(weekId, -1), [weekId]);
  const lastWeekPlan = useMemo(() => {
    if (!currentChild) return undefined;
    return getWeeklyPlan(lastWeekId, currentChild.id);
  }, [currentChild, getWeeklyPlan, lastWeekId]);
  const lastWeekUncompleted = useMemo(() => {
    if (!lastWeekPlan) return [];
    return lastWeekPlan.tasks.filter(
      (t) => t.status !== 'done' && t.status !== 'skipped'
    );
  }, [lastWeekPlan]);

  if (!currentChild) {
    return (
      <div className="space-y-8">
        <h1 className="text-h1 font-display neon-text">周任务作战室</h1>
        <EmptyState
          icon={Target}
          title="还没有孩子档案"
          description="添加孩子后，系统会根据年级自动生成每周任务计划"
        />
      </div>
    );
  }

  const tasksByDay = displayPlan ? getTasksByDay(displayPlan) : null;

  const handleCarryOverLastWeek = () => {
    if (!currentChild || lastWeekUncompleted.length === 0) return;
    const carriedTasks = lastWeekUncompleted.map((t) => ({
      ...t,
      id: `carryover-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      status: 'pending' as TaskStatus,
      day: '周一' as DayOfWeek,
    }));
    if (displayPlan) {
      const updatedTasks = [...displayPlan.tasks, ...carriedTasks];
      if (isDraft) {
        setDraftPlan({ ...displayPlan, tasks: updatedTasks });
      } else {
        publishWeeklyPlan({ ...displayPlan, tasks: updatedTasks });
      }
    } else {
      setDraftPlan({
        weekId,
        childId: currentChild.id,
        tasks: carriedTasks,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <p className="text-caption font-bold text-text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            周任务作战室
          </p>
          <h1 className="text-h1 font-display tracking-tight neon-text">
            {currentChild.name}
          </h1>
          <p className="text-caption text-text-tertiary mt-1">
            {gradeLabel(currentChild.grade)} · {formatWeekLabel(weekId)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekId((w) => shiftWeekId(w, -1))}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface border border-border-default text-text-secondary hover:text-white hover:border-border-strong hover:bg-surface-light transition-all focus-ring"
            aria-label="上一周"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-4 py-2 rounded-xl bg-surface border border-border-default text-caption font-bold text-white min-w-[130px] text-center data-value">
            {year}年第{week}周
          </div>
          <button
            onClick={() => setWeekId((w) => shiftWeekId(w, 1))}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface border border-border-default text-text-secondary hover:text-white hover:border-border-strong hover:bg-surface-light transition-all focus-ring"
            aria-label="下一周"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Action bar */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex flex-wrap items-center gap-2">
          {!displayPlan && (
            <button
              onClick={handleGenerate}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-white text-caption font-bold hover:shadow-glow-primary transition-all duration-200 focus-ring"
            >
              <Target className="w-4 h-4" />
              生成本周计划
            </button>
          )}
          {isDraft && (
            <>
              <button
                onClick={handlePublish}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-white text-caption font-bold hover:shadow-glow-primary transition-all duration-200 focus-ring"
              >
                <Send className="w-4 h-4" />
                发布
              </button>
              <button
                onClick={handleCancelDraft}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface border border-border-default text-text-secondary text-caption font-semibold hover:text-white hover:border-border-strong hover:bg-surface-light transition-all focus-ring"
              >
                <X className="w-4 h-4" />
                取消
              </button>
            </>
          )}
          {isPublished && !isDraft && (
            <button
              onClick={handleOpenReview}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-secondary to-secondary-glow text-white text-caption font-bold hover:shadow-glow-secondary transition-all duration-200 focus-ring"
            >
              <Sparkles className="w-4 h-4" />
              {plan?.reviewedAt ? '查看复盘' : '本周复盘'}
            </button>
          )}
          {isPublished && !isDraft && stats && (
            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface border border-border-default text-text-secondary text-caption font-semibold hover:text-white hover:border-border-strong hover:bg-surface-light transition-all focus-ring"
            >
              <Share2 className="w-4 h-4" />
              导出周报
            </button>
          )}
          {displayPlan && (
            <>
              <button
                onClick={() => setLibraryOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface border border-border-default text-text-secondary text-caption font-semibold hover:text-white hover:border-border-strong hover:bg-surface-light transition-all focus-ring"
              >
                <Library className="w-4 h-4" />
                从任务库选择
              </button>
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface border border-border-default text-text-secondary text-caption font-semibold hover:text-white hover:border-border-strong hover:bg-surface-light transition-all focus-ring"
              >
                <Pencil className="w-4 h-4" />
                {isDraft ? '编辑任务' : '调整任务'}
              </button>
            </>
          )}
          {isDraft && (
            <span className="text-micro text-text-muted">预览模式：发布后才会保存</span>
          )}
        </div>

        <div className="flex items-center gap-1 bg-surface rounded-xl p-1 border border-border-default">
          <button
            onClick={() => setViewMode('day')}
            aria-pressed={viewMode === 'day'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-micro font-semibold transition-all focus-ring ${
              viewMode === 'day'
                ? 'bg-surface-light text-white border border-border-strong'
                : 'text-text-tertiary hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            日视图
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            aria-pressed={viewMode === 'matrix'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-micro font-semibold transition-all focus-ring ${
              viewMode === 'matrix'
                ? 'bg-surface-light text-white border border-border-strong'
                : 'text-text-tertiary hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            周矩阵
          </button>
        </div>
      </motion.div>

      {lastWeekUncompleted.length > 0 && weekId === getCurrentWeekId() && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-2xl border border-warning/20 bg-warning/[0.06] p-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-caption font-bold text-white">
                  上周有 <span className="data-value">{lastWeekUncompleted.length}</span> 项任务未补完
                </p>
                <p className="text-micro text-text-tertiary mt-0.5">
                  可以一键添加到本周，避免学习任务中断
                </p>
              </div>
            </div>
            <button
              onClick={handleCarryOverLastWeek}
              className="shrink-0 px-4 py-2 rounded-xl bg-warning/10 border border-warning/20 text-warning text-caption font-bold hover:bg-warning/15 transition-colors focus-ring"
            >
              一键添加到本周
            </button>
          </div>
        </motion.div>
      )}

      {stats && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          <div className="hud-panel p-4 flex items-center gap-4">
            <MetricRing
              rate={stats.completionRate}
              size={64}
              strokeWidth={6}
            />
            <div>
              <p className="text-micro text-text-muted">本周完成率</p>
              <p className="text-h4 font-display data-value text-white">
                {stats.done}/{stats.total}
              </p>
              <p className="text-micro text-text-muted">
                {stats.pending > 0 ? `还剩 ${stats.pending} 项` : '全部完成'}
              </p>
            </div>
          </div>

          <div className="hud-panel p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <p className="text-micro text-text-muted">计划总时长</p>
            </div>
            <p className="text-h4 font-display data-value text-white">
              {Math.round((stats.estimatedMinutes / 60) * 10) / 10}h
            </p>
            <p className="text-micro text-text-muted">约 {stats.estimatedMinutes} 分钟</p>
          </div>

          <div className="hud-panel p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-secondary" />
              <p className="text-micro text-text-muted">分类完成</p>
            </div>
            <div className="space-y-1 max-h-[72px] overflow-y-auto">
              {allCategories
                .filter((cat) => stats.byCategory[cat].total > 0)
                .map((cat) => {
                  const s = stats.byCategory[cat];
                  return (
                    <div key={cat} className="flex items-center justify-between text-micro">
                      <span className="text-text-tertiary">{TASK_CATEGORY_LABELS[cat]}</span>
                      <span
                        className={
                          s.total === s.done
                            ? 'text-primary data-value font-semibold'
                            : 'text-text-secondary data-value'
                        }
                      >
                        {s.done}/{s.total}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="hud-panel p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Trophy className="w-3.5 h-3.5 text-warning" />
              <p className="text-micro text-text-muted">本周状态</p>
            </div>
            <p className="text-h4 font-bold text-white">
              {isDraft ? '草稿待发布' : isPublished ? '已发布' : '未生成'}
            </p>
            <p className="text-micro text-text-muted">
              {plan?.reviewedAt ? '已完成复盘' : plan?.publishedAt ? '待复盘' : '—'}
            </p>
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {!displayPlan ? (
          <motion.div
            key="empty"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            className="rounded-2xl glass p-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-dim to-secondary-dim flex items-center justify-center mx-auto mb-4 border border-primary/10">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-h3 font-display text-white mb-2">
              本周计划尚未发布
            </h3>
            <p className="text-caption text-text-tertiary mb-6 max-w-md mx-auto">
              系统会根据 {currentChild.name} 的年级，从语数英三科模板自动生成本周任务。发布后即可每日打卡。
            </p>
            <button
              onClick={handleGenerate}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-white font-bold hover:shadow-glow-primary transition-all focus-ring"
            >
              生成本周计划
            </button>
          </motion.div>
        ) : viewMode === 'day' ? (
          <motion.div
            key="day"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex gap-2 overflow-x-auto pb-2">
              {dayOrder.map((day) => {
                const dayStats = stats?.byDay[day];
                const isToday = day === today && weekId === getCurrentWeekId();
                const isSelected = day === selectedDay;
                const done = dayStats?.done ?? 0;
                const total = dayStats?.total ?? 0;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    aria-pressed={isSelected}
                    className={`flex-shrink-0 relative px-4 py-2.5 rounded-xl text-left min-w-[72px] transition-all border focus-ring ${
                      isSelected
                        ? 'bg-primary-dim border-primary/30 text-white shadow-glow-sm'
                        : 'bg-surface border-border-default text-text-secondary hover:bg-surface-light hover:border-border-strong'
                    }`}
                  >
                    {isToday && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary shadow-glow-primary" />
                    )}
                    <p className="text-caption font-bold text-white">
                      {day}
                    </p>
                    <p className="text-micro text-text-muted mt-0.5 data-value">
                      {total === 0 ? '无任务' : `${done}/${total}`}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {tasksByDay?.[selectedDay]?.length === 0 ? (
                <div className="lg:col-span-2 rounded-2xl glass border border-border-default p-8 text-center text-text-muted text-caption">
                  {selectedDay} 没有安排任务
                </div>
              ) : (
                tasksByDay?.[selectedDay].map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={() => handleToggleTask(task)}
                    onNoteBlur={(note) => handleNoteBlur(task, note)}
                    showNote
                    isDraft={isDraft}
                  />
                ))
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="matrix"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            className="rounded-2xl hud-panel p-4 sm:p-5"
          >
            {/* Desktop matrix */}
            <div className="hidden lg:block overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-8 gap-2 mb-2">
                  <div className="text-micro font-medium text-text-muted px-3 py-2">分类</div>
                  {dayOrder.map((day) => {
                    const isToday = day === today && weekId === getCurrentWeekId();
                    const ds = stats?.byDay[day];
                    return (
                      <div
                        key={day}
                        className={`text-center text-micro font-bold px-2 py-2 rounded-xl border ${
                          isToday
                            ? 'bg-primary-dim text-primary border-primary/20'
                            : 'text-text-secondary border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          {day}
                          {isToday && <span className="indicator-dot" />}
                        </div>
                        {ds && ds.total > 0 && (
                          <span className="block text-micro text-text-muted mt-0.5 data-value">
                            {ds.done}/{ds.total}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {allCategories
                  .filter((cat) =>
                    displayPlan.tasks.some((t) => (t.category || 'other') === cat)
                  )
                  .map((category) => {
                    const CategoryIcon = categoryIcons[category];
                    return (
                      <div key={category} className="grid grid-cols-8 gap-2 mb-2">
                        <div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-surface border border-border-default">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center border ${getCategoryColorClass(
                              category
                            )}`}
                          >
                            <CategoryIcon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-caption font-bold text-white">
                            {TASK_CATEGORY_LABELS[category]}
                          </span>
                        </div>
                        {dayOrder.map((day) => {
                          const task = tasksByDay?.[day].find(
                            (t) => (t.category || 'other') === category
                          );
                          const taskDone = task?.status === 'done';
                          return task ? (
                            <button
                              key={day}
                              type="button"
                              onClick={() => handleToggleTask(task)}
                              aria-label={`${TASK_CATEGORY_LABELS[category]} ${day}：${task.focus}，${task.duration}，点击${taskDone ? '取消完成' : '标记完成'}`}
                              className={`relative group px-2 py-3 rounded-xl border transition-all min-h-[80px] text-left focus-ring ${
                                taskDone
                                  ? 'bg-surface/60 border-border-default border-l-2 border-l-primary/70'
                                  : 'bg-surface border-border-default hover:border-primary/30 hover:bg-surface-light hover:shadow-glow-sm'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-micro text-text-muted data-value">{task.duration}</span>
                                {taskDone && <CheckCircle2 className="w-3 h-3 text-primary" />}
                              </div>
                              <p
                                className={`text-micro font-medium line-clamp-2 ${
                                  taskDone ? 'text-text-muted line-through' : 'text-white'
                                }`}
                              >
                                {task.focus}
                              </p>

                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-3 rounded-xl bg-surface border border-border-default shadow-panel opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                                <p className="text-caption font-bold text-white mb-1">{task.focus}</p>
                                <p className="text-micro text-text-muted mb-2">
                                  {TASK_CATEGORY_LABELS[category]} · {task.duration}
                                </p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {task.materials.map((m) => (
                                    <span
                                      key={m}
                                      className="text-micro px-1.5 py-0.5 rounded bg-surface-elevated text-text-secondary border border-border-default"
                                    >
                                      {m}
                                    </span>
                                  ))}
                                </div>
                                <p className="text-micro text-text-muted">
                                  点击{taskDone ? '取消完成' : '标记完成'}
                                </p>
                              </div>
                            </button>
                          ) : (
                            <div
                              key={day}
                              className="rounded-xl min-h-[80px] border border-dashed border-border-default/60"
                            />
                          );
                        })}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Mobile matrix */}
            <div className="lg:hidden space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dayOrder.map((day) => {
                  const isToday = day === today && weekId === getCurrentWeekId();
                  const isSelected = day === matrixDay;
                  const ds = stats?.byDay[day];
                  return (
                    <button
                      key={day}
                      onClick={() => setMatrixDay(day)}
                      aria-pressed={isSelected}
                      className={`flex-shrink-0 relative px-4 py-2.5 rounded-xl text-left min-w-[72px] transition-all border focus-ring ${
                        isSelected
                          ? 'bg-primary-dim border-primary/30 shadow-glow-sm'
                          : 'bg-surface border-border-default hover:bg-surface-light hover:border-border-strong'
                      }`}
                    >
                      {isToday && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary shadow-glow-primary" />
                      )}
                      <p className="text-caption font-bold text-white">{day}</p>
                      <p className="text-micro text-text-muted mt-0.5 data-value">
                        {ds && ds.total > 0 ? `${ds.done}/${ds.total}` : '无任务'}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2">
                {allCategories
                  .filter((cat) =>
                    displayPlan.tasks.some((t) => (t.category || 'other') === cat)
                  )
                  .map((category) => {
                    const task = tasksByDay?.[matrixDay].find(
                      (t) => (t.category || 'other') === category
                    );
                    return task ? (
                      <TaskCard
                        key={category}
                        task={task}
                        onToggle={() => handleToggleTask(task)}
                        compact
                      />
                    ) : (
                      <div
                        key={category}
                        className="rounded-2xl border border-dashed border-border-default p-4 flex items-center gap-3 opacity-60"
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getCategoryColorClass(
                            category
                          )}`}
                        >
                          {(() => {
                            const CategoryIcon = categoryIcons[category];
                            return <CategoryIcon className="w-4 h-4" />;
                          })()}
                        </div>
                        <div>
                          <p className="text-caption font-medium text-text-secondary">
                            {TASK_CATEGORY_LABELS[category]}
                          </p>
                          <p className="text-micro text-text-muted">当天无安排</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reviewOpen && stats && displayPlan && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center sm:justify-center sm:p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setReviewOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="review-title"
              initial={shouldReduceMotion ? false : { scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[85vh] overflow-y-auto rounded-none sm:rounded-3xl glass sm:border border-border-default p-5 sm:p-8 modal-scroll"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center shadow-glow-secondary">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 id="review-title" className="text-h3 font-display text-white">
                      本周复盘
                    </h2>
                    <p className="text-micro text-text-tertiary">{formatWeekLabel(weekId)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setReviewOpen(false)}
                  className="p-2 rounded-lg hover:bg-surface-light text-text-tertiary focus-ring"
                  aria-label="关闭"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="hud-panel p-4 text-center">
                  <p className="text-h2 text-white font-display data-value">{stats.completionRate}%</p>
                  <p className="text-micro text-text-muted">完成率</p>
                </div>
                <div className="hud-panel p-4 text-center">
                  <p className="text-h2 text-white font-display data-value">{stats.done}</p>
                  <p className="text-micro text-text-muted">已完成</p>
                </div>
                <div className="hud-panel p-4 text-center">
                  <p className="text-h2 text-white font-display data-value">{stats.pending}</p>
                  <p className="text-micro text-text-muted">待补</p>
                </div>
              </div>

              <div className="rounded-2xl bg-secondary-dim border border-secondary/20 p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <p className="text-caption font-bold text-white">AI 点评</p>
                </div>
                <p className="text-caption text-text-secondary leading-relaxed">
                  {generateAiReview(displayPlan, currentChild.name)}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-caption font-bold text-white mb-2">
                  家长评语
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="写下对孩子的鼓励、问题或下周调整..."
                  className="w-full bg-surface border border-border-default rounded-xl px-4 py-3 text-caption text-white placeholder:text-text-muted focus:outline-none focus:border-secondary/50 resize-none"
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setReviewOpen(false)}
                  className="px-4 py-2 rounded-xl text-caption text-text-tertiary hover:text-white transition-colors focus-ring"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveReview}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-secondary to-secondary-glow text-white font-bold hover:shadow-glow-secondary transition-all focus-ring"
                >
                  <RotateCcw className="w-4 h-4" />
                  保存复盘
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
          childGrade={currentChild.grade}
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
    </div>
  );
}

function WeeklyTasksSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface" />
          <div className="space-y-2">
            <div className="h-5 w-32 rounded bg-surface" />
            <div className="h-3 w-48 rounded bg-surface" />
          </div>
        </div>
        <div className="h-8 w-28 rounded-lg bg-surface" />
      </div>
      <div className="h-10 rounded-xl bg-surface" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-surface" />
        ))}
      </div>
      <div className="h-[420px] rounded-2xl bg-surface" />
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
