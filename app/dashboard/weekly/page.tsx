'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Clock,
  Target,
  Sparkles,
  RotateCcw,
  Send,
  BookOpen,
  Calculator,
  Languages,
  X,
  Trophy,
  TrendingUp,
  Plus,
  Trash2,
  Pencil,
  Library,
  GraduationCap,
  Backpack,
  Dumbbell,
  Palette,
  ChevronDown,
  Copy,
  AlertTriangle,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import EmptyState from '@/components/ui/EmptyState';
import CommandCard from '@/components/ui/CommandCard';
import MetricRing from '@/components/ui/MetricRing';
import { gradeLabel } from '@/lib/children';
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
  subjectMeta,
  parseDurationMinutes,
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

type ViewMode = 'day' | 'matrix';

function shiftWeekId(weekId: string, delta: number): string {
  const { start } = getWeekRange(weekId);
  const next = new Date(start);
  next.setDate(start.getDate() + delta * 7);
  return getISOWeek(next).weekId;
}

function ProgressRing({ rate, size = 96 }: { rate: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - rate / 100);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
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
            <stop offset="0%" stopColor="#ff2d6a" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-display">{rate}%</span>
        <span className="text-[10px] text-slate-500">完成率</span>
      </div>
    </div>
  );
}

interface EditPlanModalProps {
  plan: WeeklyPlan;
  onClose: () => void;
  onSave: (tasks: WeeklyTaskItem[]) => void;
}

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
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
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
        className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl glass border border-white/10 p-6 sm:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center">
              <Pencil className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="edit-plan-title" className="text-xl font-bold font-display">编辑周任务</h2>
              <p className="text-xs text-slate-400">
                按星期分组管理，支持复制到多天
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 focus-ring"
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
                className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
              >
                <button
                  onClick={() => toggleDay(day)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-200">{day}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                      {count} 项
                    </span>
                    {minutes > 0 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
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
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
                      aria-label={`${day}添加任务`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform ${
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
                          <div className="text-center py-4 text-xs text-slate-500">
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
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 transition-colors focus-ring"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-accent to-accent-glow text-white font-semibold hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all focus-ring"
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

const durationPresets = ['15分钟', '20分钟', '30分钟', '45分钟', '60分钟'];

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
    <div className="rounded-xl bg-white/5 border border-white/5 p-3">
      <div className="grid grid-cols-12 gap-2 items-start">
        <div className="col-span-6 sm:col-span-2">
          <label className="block text-[10px] text-slate-500 mb-1">分类</label>
          <div className="relative">
            <CategoryIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={task.category}
              onChange={(e) =>
                onUpdate(task.id, {
                  category: e.target.value as TaskCategory,
                })
              }
              className="w-full pl-7 pr-2 text-xs bg-white/5 border border-white/10 rounded-lg py-1.5 text-slate-200 focus:outline-none focus:border-accent/50"
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
          <label className="block text-[10px] text-slate-500 mb-1">任务内容</label>
          <input
            type="text"
            value={task.focus}
            onChange={(e) => onUpdate(task.id, { focus: e.target.value })}
            placeholder="例如：古诗新学"
            className="w-full text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-accent/50"
          />
        </div>

        <div className="col-span-6 sm:col-span-2">
          <label className="block text-[10px] text-slate-500 mb-1">时长</label>
          <input
            type="text"
            value={task.duration}
            onChange={(e) => onUpdate(task.id, { duration: e.target.value })}
            placeholder="30分钟"
            className="w-full text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-accent/50"
          />
          <div className="flex flex-wrap gap-1 mt-1.5">
            {durationPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onUpdate(task.id, { duration: preset })}
                className={`text-[9px] px-1.5 py-0.5 rounded transition-colors ${
                  task.duration === preset
                    ? 'bg-accent/20 text-accent border border-accent/30'
                    : 'bg-white/5 text-slate-500 hover:bg-white/10'
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
                ? 'bg-secondary/15 text-secondary'
                : 'hover:bg-white/10 text-slate-500 hover:text-slate-300'
            }`}
            aria-label="复制到其它日期"
            title="复制到其它日期"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg hover:bg-error/10 text-slate-500 hover:text-error transition-colors focus-ring"
            aria-label="删除任务"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-2">
        <label className="block text-[10px] text-slate-500 mb-1">材料/关键词</label>
        <div className="flex flex-wrap items-center gap-1.5">
          {task.materials.map((m, idx) => (
            <span
              key={`${m}-${idx}`}
              className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 flex items-center gap-1"
            >
              {m}
              <button
                onClick={() =>
                  onUpdate(task.id, {
                    materials: task.materials.filter((_, i) => i !== idx),
                  })
                }
                className="hover:text-error"
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
            className="min-w-[120px] text-xs bg-transparent border-none px-1 py-0.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-0"
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
            <div className="mt-3 pt-3 border-t border-white/[0.06]">
              <p className="text-[10px] text-slate-400 mb-2">复制到以下日期：</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {dayOrder.map((day) => {
                  const selected = selectedDays.has(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                        selected
                          ? 'bg-secondary/15 text-secondary border border-secondary/30'
                          : 'bg-white/5 text-slate-400 border border-white/[0.06] hover:bg-white/[0.08]'
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
                  className="px-3 py-1.5 rounded-lg bg-secondary/15 text-secondary text-xs hover:bg-secondary/20 transition-colors disabled:opacity-50"
                >
                  确认复制
                </button>
                <button
                  type="button"
                  onClick={onToggleCopy}
                  className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-xs hover:bg-white/10 transition-colors"
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
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl glass border border-white/10 p-6 text-center"
      >
        <AlertTriangle className="w-10 h-10 text-warning mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-200 mb-2">有未保存的更改</h3>
        <p className="text-xs text-slate-400 mb-6">
          关闭后将丢失本次编辑内容，确定要取消吗？
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-slate-300 hover:text-white transition-colors"
          >
            继续编辑
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-error/15 text-error hover:bg-error/20 transition-colors"
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
  weekId,
  existingTasks,
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

  const filteredTemplates = useMemo(
    () => {
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
    },
    [templates, selectedCategory, childGrade, childRouteId]
  );

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
        aria-labelledby="library-title"
        className="w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl glass border border-white/10 p-6 sm:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center">
              <Library className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="library-title" className="text-xl font-bold font-display">从任务库选择</h2>
              <p className="text-xs text-slate-400">
                勾选常用任务，一键添加到{selectedDay}
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

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-white/10 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              全部
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  selectedCategory === cat
                    ? 'bg-white/10 text-white'
                    : 'bg-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                {TASK_CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-slate-500">添加到</span>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
              className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200"
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
          <div className="py-12 text-center text-slate-500 text-sm">加载中...</div>
        ) : filteredTemplates.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">暂无任务模板</div>
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
                  className={`text-left rounded-xl border p-3 transition-all ${
                    selected
                      ? 'bg-secondary/10 border-secondary/30'
                      : 'bg-white/5 border-white/5 hover:bg-white/[0.07]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center ${selected ? 'bg-secondary border-secondary' : 'border-white/20'}`}>
                      {selected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CategoryIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] text-slate-400">{TASK_CATEGORY_LABELS[tpl.category]}</span>
                        {alignment && alignment !== 'unrelated' && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getAlignmentColorClass(alignment)}`}>
                            {TASK_ALIGNMENT_LABELS[alignment]}
                          </span>
                        )}
                        {alignment === 'unrelated' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-500/20 text-zinc-400 border border-zinc-500/30">
                            不相关
                          </span>
                        )}
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300 ml-auto">{tpl.duration}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-200 mb-1 truncate">{tpl.title}</p>
                      {tpl.description && (
                        <p className="text-[10px] text-slate-500 line-clamp-2 mb-1">{tpl.description}</p>
                      )}
                      {tpl.routeTags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {tpl.routeTags.map((tag) => (
                            <span key={tag} className="text-[9px] px-1 py-0.5 rounded bg-white/5 text-slate-500">
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
          <p className="text-xs text-slate-500">
            已选 {selectedTemplateIds.size} 项
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleAdd}
              disabled={selectedTemplateIds.size === 0}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-secondary to-secondary-glow text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all"
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
  const [draftPlan, setDraftPlan] = useState<WeeklyPlan | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);

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

  if (!currentChild) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold font-display">周任务作战室</h1>
        <EmptyState
          icon={Target}
          title="还没有孩子档案"
          description="添加孩子后，系统会根据年级自动生成每周任务计划"
        />
      </div>
    );
  }

  const tasksByDay = displayPlan ? getTasksByDay(displayPlan) : null;

  return (
    <div className="space-y-6">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display">周任务作战室</h1>
              <p className="text-sm text-slate-400">
                {currentChild.name} · {gradeLabel(currentChild.grade)} · {formatWeekLabel(weekId)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekId((w) => shiftWeekId(w, -1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors focus-ring"
            aria-label="上一周"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-3 py-1.5 rounded-lg glass border border-white/[0.08] text-sm font-medium min-w-[120px] text-center tabular-nums">
            {year}年第{week}周
          </div>
          <button
            onClick={() => setWeekId((w) => shiftWeekId(w, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors focus-ring"
            aria-label="下一周"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

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
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-glow text-white text-sm font-semibold hover:shadow-glow-primary transition-all duration-200 focus-ring"
            >
              <Target className="w-3.5 h-3.5" />
              生成本周计划
            </button>
          )}
          {isDraft && (
            <>
              <button
                onClick={handlePublish}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-primary to-primary-glow text-white text-sm font-semibold hover:shadow-glow-primary transition-all duration-200 focus-ring"
              >
                <Send className="w-3.5 h-3.5" />
                发布
              </button>
              <button
                onClick={handleCancelDraft}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-colors focus-ring"
              >
                <X className="w-3.5 h-3.5" />
                取消
              </button>
            </>
          )}
          {isPublished && !isDraft && (
            <button
              onClick={handleOpenReview}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-secondary to-secondary-glow text-white text-sm font-semibold hover:shadow-glow-secondary transition-all duration-200 focus-ring"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {plan?.reviewedAt ? '查看复盘' : '本周复盘'}
            </button>
          )}
          {displayPlan && (
            <>
              <button
                onClick={() => setLibraryOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-colors focus-ring"
              >
                <Library className="w-3.5 h-3.5" />
                从任务库选择
              </button>
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-colors focus-ring"
              >
                <Pencil className="w-3.5 h-3.5" />
                {isDraft ? '编辑任务' : '调整任务'}
              </button>
            </>
          )}
          {isDraft && (
            <span className="text-xs text-slate-500">预览模式：发布后才会保存</span>
          )}
        </div>

        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setViewMode('day')}
            aria-pressed={viewMode === 'day'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all focus-ring ${
              viewMode === 'day'
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            日视图
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            aria-pressed={viewMode === 'matrix'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all focus-ring ${
              viewMode === 'matrix'
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            周矩阵
          </button>
        </div>
      </motion.div>

      {stats && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          <CommandCard className="p-4 flex items-center gap-4">
            <MetricRing rate={stats.completionRate} size={64} strokeWidth={6} />
            <div>
              <p className="text-xs text-slate-500">本周完成率</p>
              <p className="text-lg font-bold font-display tabular-nums text-slate-100">
                {stats.done}/{stats.total}
              </p>
              <p className="text-[10px] text-slate-500">
                {stats.pending > 0 ? `还剩 ${stats.pending} 项` : '全部完成'}
              </p>
            </div>
          </CommandCard>

          <CommandCard className="p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <p className="text-xs text-slate-500">计划总时长</p>
            </div>
            <p className="text-lg font-bold font-display tabular-nums text-slate-100">
              {Math.round((stats.estimatedMinutes / 60) * 10) / 10}h
            </p>
            <p className="text-[10px] text-slate-500">约 {stats.estimatedMinutes} 分钟</p>
          </CommandCard>

          <CommandCard className="p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-secondary" />
              <p className="text-xs text-slate-500">分类完成</p>
            </div>
            <div className="space-y-1 max-h-[72px] overflow-y-auto">
              {(['chinese', 'math', 'english', 'school', 'reading', 'sport', 'interest', 'other'] as TaskCategory[])
                .filter((cat) => stats.byCategory[cat].total > 0)
                .map((cat) => {
                  const s = stats.byCategory[cat];
                  return (
                    <div key={cat} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{TASK_CATEGORY_LABELS[cat]}</span>
                      <span className={s.total === s.done ? 'text-success tabular-nums' : 'text-slate-300 tabular-nums'}>
                        {s.done}/{s.total}
                      </span>
                    </div>
                  );
                })}
            </div>
          </CommandCard>

          <CommandCard className="p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Trophy className="w-3.5 h-3.5 text-warning" />
              <p className="text-xs text-slate-500">本周状态</p>
            </div>
            <p className="text-base font-semibold text-slate-100">
              {isDraft ? '草稿待发布' : isPublished ? '已发布' : '未生成'}
            </p>
            <p className="text-[10px] text-slate-500">
              {plan?.reviewedAt ? '已完成复盘' : plan?.publishedAt ? '待复盘' : '—'}
            </p>
          </CommandCard>
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-display mb-2">本周计划尚未发布</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
              系统会根据 {currentChild.name} 的年级，从语数英三科模板自动生成本周任务。发布后即可每日打卡。
            </p>
            <button
              onClick={handleGenerate}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-white font-semibold hover:shadow-[0_0_30px_rgba(255,45,106,0.4)] transition-all focus-ring"
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
            <div className="flex gap-1.5 overflow-x-auto pb-2">
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
                    className={`flex-shrink-0 relative px-3 py-2 rounded-lg text-left min-w-[68px] transition-all border focus-ring ${
                      isSelected
                        ? 'bg-white/[0.08] border-primary/30'
                        : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1]'
                    }`}
                  >
                    {isToday && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary shadow-glow-primary" />
                    )}
                    <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {day}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 tabular-nums">
                      {total === 0 ? '无任务' : `${done}/${total}`}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {tasksByDay?.[selectedDay]?.length === 0 ? (
                <div className="lg:col-span-3 rounded-xl glass border border-white/[0.06] p-8 text-center text-slate-500 text-sm">
                  {selectedDay} 没有安排任务
                </div>
              ) : (
                tasksByDay?.[selectedDay].map((task, index) => {
                  const category = task.category || 'other';
                  const CategoryIcon = categoryIcons[category];
                  const isDone = task.status === 'done';
                  const alignment = task.alignment;
                  return (
                    <motion.div
                      key={task.id}
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CommandCard
                        className={`p-4 ${isDone ? 'border-success/20' : ''}`}
                        active={isDone}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleToggleTask(task)}
                            className="mt-0.5 text-slate-400 hover:text-primary transition-colors focus-ring rounded-full"
                            aria-label={isDone ? '标记为未完成' : '标记为完成'}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-5 h-5 text-success" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div
                                className={`w-6 h-6 rounded-md flex items-center justify-center ${getCategoryColorClass(category)}`}
                              >
                                <CategoryIcon className="w-3 h-3" />
                              </div>
                              <span className="text-[11px] font-medium text-slate-400">
                                {TASK_CATEGORY_LABELS[category]}
                              </span>
                              {alignment && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getAlignmentColorClass(alignment)}`}>
                                  {TASK_ALIGNMENT_LABELS[alignment]}
                                </span>
                              )}
                              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-300">
                                {task.duration}
                              </span>
                            </div>
                            <p
                              className={`text-sm font-semibold mb-2 ${
                                isDone ? 'text-slate-500 line-through' : 'text-slate-200'
                              }`}
                            >
                              {task.focus}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {task.materials.map((m) => (
                                <span
                                  key={m}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-400 border border-white/[0.06]"
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
                            {!isDraft && (
                              <textarea
                                defaultValue={task.note ?? ''}
                                onBlur={(e) => handleNoteBlur(task, e.target.value)}
                                placeholder="完成备注（正确率、感受等）"
                                className="w-full text-xs bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 resize-none"
                                rows={2}
                              />
                            )}
                          </div>
                        </div>
                      </CommandCard>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="matrix"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            className="rounded-2xl glass p-5 overflow-x-auto"
          >
            <div className="min-w-[800px]">
              <div className="grid grid-cols-8 gap-2 mb-2">
                <div className="text-xs text-slate-500 font-medium px-3 py-2">分类</div>
                {dayOrder.map((day) => {
                  const isToday = day === today && weekId === getCurrentWeekId();
                  const ds = stats?.byDay[day];
                  return (
                    <div
                      key={day}
                      className={`text-center text-xs font-medium px-2 py-2 rounded-lg ${
                        isToday ? 'bg-primary/10 text-primary' : 'text-slate-400'
                      }`}
                    >
                      {day}
                      {ds && ds.total > 0 && (
                        <span className="block text-[10px] text-slate-500 mt-0.5">
                          {ds.done}/{ds.total}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {allCategories
                .filter((cat) => displayPlan.tasks.some((t) => (t.category || 'other') === cat))
                .map((category) => {
                  const CategoryIcon = categoryIcons[category];
                  return (
                    <div key={category} className="grid grid-cols-8 gap-2 mb-2">
                      <div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-white/5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${getCategoryColorClass(category)}`}
                        >
                          <CategoryIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm font-medium text-slate-300">{TASK_CATEGORY_LABELS[category]}</span>
                      </div>
                      {dayOrder.map((day) => {
                        const task = tasksByDay?.[day].find((t) => (t.category || 'other') === category);
                        const taskDone = task?.status === 'done';
                        return (
                          <button
                            key={day}
                            type="button"
                            disabled={!task}
                            onClick={() => task && handleToggleTask(task)}
                            aria-label={
                              task
                                ? `${TASK_CATEGORY_LABELS[category]} ${day}：${task.focus}，${task.duration}，点击${taskDone ? '取消完成' : '标记完成'}`
                                : `${TASK_CATEGORY_LABELS[category]} ${day}：无任务`
                            }
                            className={`relative group px-2 py-3 rounded-xl border transition-all min-h-[80px] text-left disabled:cursor-default ${
                              task
                                ? taskDone
                                  ? 'bg-success/10 border-success/20 hover:bg-success/[0.12]'
                                  : 'bg-white/5 border-white/5 hover:bg-white/[0.07]'
                                : 'bg-transparent border-transparent'
                            }`}
                          >
                            {task && (
                              <>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] text-slate-500">{task.duration}</span>
                                  {task.status === 'done' && (
                                    <CheckCircle2 className="w-3 h-3 text-success" />
                                  )}
                                </div>
                                <p className="text-xs font-medium text-slate-200 line-clamp-2">
                                  {task.focus}
                                </p>

                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-3 rounded-xl bg-surface border border-white/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                                  <p className="text-xs font-bold text-slate-200 mb-1">
                                    {task.focus}
                                  </p>
                                  <p className="text-[10px] text-slate-500 mb-2">
                                    {TASK_CATEGORY_LABELS[category]} · {task.duration}
                                  </p>
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {task.materials.map((m) => (
                                      <span
                                        key={m}
                                        className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400"
                                      >
                                        {m}
                                      </span>
                                    ))}
                                  </div>
                                  <p className="text-[10px] text-slate-500">
                                    点击{task.status === 'done' ? '取消完成' : '标记完成'}
                                  </p>
                                </div>
                              </>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
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
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
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
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl glass border border-white/10 p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 id="review-title" className="text-xl font-bold font-display">本周复盘</h2>
                    <p className="text-xs text-slate-400">{formatWeekLabel(weekId)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setReviewOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/5 text-slate-400 focus-ring"
                  aria-label="关闭"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="rounded-xl bg-white/5 p-4 text-center">
                  <p className="text-2xl font-bold text-slate-200">{stats.completionRate}%</p>
                  <p className="text-xs text-slate-500">完成率</p>
                </div>
                <div className="rounded-xl bg-white/5 p-4 text-center">
                  <p className="text-2xl font-bold text-slate-200">{stats.done}</p>
                  <p className="text-xs text-slate-500">已完成</p>
                </div>
                <div className="rounded-xl bg-white/5 p-4 text-center">
                  <p className="text-2xl font-bold text-slate-200">{stats.pending}</p>
                  <p className="text-xs text-slate-500">待补</p>
                </div>
              </div>

              <div className="rounded-xl bg-secondary/5 border border-secondary/20 p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <p className="text-sm font-semibold text-slate-200">AI 点评</p>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {generateAiReview(displayPlan, currentChild.name)}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  家长评语
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="写下对孩子的鼓励、问题或下周调整..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-secondary/50 resize-none"
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setReviewOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 transition-colors focus-ring"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveReview}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-secondary to-secondary-glow text-white font-semibold hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all focus-ring"
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
    </div>
  );
}

function WeeklyTasksSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5" />
          <div className="space-y-2">
            <div className="h-5 w-32 rounded bg-white/5" />
            <div className="h-3 w-48 rounded bg-white/5" />
          </div>
        </div>
        <div className="h-8 w-28 rounded-lg bg-white/5" />
      </div>
      <div className="h-10 rounded-xl bg-white/5" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-white/5" />
        ))}
      </div>
      <div className="h-[420px] rounded-2xl bg-white/5" />
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
