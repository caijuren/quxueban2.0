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
  Share2,
  Loader2,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import EmptyState from '@/components/ui/EmptyState';
import ChildEmptyState from '@/components/dashboard/ChildEmptyState';
import CommandCard from '@/components/ui/CommandCard';
import MetricRing from '@/components/ui/MetricRing';
import WeeklyReportExport from '@/components/weekly/WeeklyReportExport';
import GeneratePlanModal from '@/components/weekly/GeneratePlanModal';
import WeeklyMatrix from '@/components/weekly/WeeklyMatrix';
import { gradeLabel } from '@/lib/children';
import {
  type WeeklyPlan,
  type WeeklyTaskItem,
  type TaskStatus,
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
import TaskRationalityPanel from '@/components/ai/TaskRationalityPanel';
import {
  TaskRationalityAssessment,
  AssessmentTaskInput,
} from '@/lib/ai/taskAssessment';
import { useTaskTemplates } from '@/lib/hooks/useTaskTemplates';
import { useAssessTasks } from '@/lib/hooks/useTaskAssessment';

const categoryIcons: Record<TaskCategory, typeof BookOpen> = {
  school: Backpack,
  reading: BookOpen,
  sport: Dumbbell,
  interest: Palette,
  ability: Trophy,
  other: GraduationCap,
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
            <stop offset="100%" stopColor="#ff5c8a" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-display">{rate}%</span>
        <span className="text-2xs text-text-muted">完成率</span>
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
    const stats = {} as Record<DayOfWeek, { count: number; minutes: number }>;
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
      className="fixed inset-0 lg:left-64 z-[110] flex items-center sm:justify-center sm:p-4 bg-black/70 backdrop-blur-sm"
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
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <Pencil className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="edit-plan-title" className="text-xl font-bold font-display">编辑周计划</h2>
              <p className="text-xs text-text-tertiary">
                按星期分组管理，支持复制到多天
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-surface-elevated text-text-tertiary focus-ring"
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
                className="rounded-2xl bg-surface-elevated border border-border-subtle overflow-hidden"
              >
                <button
                  onClick={() => toggleDay(day)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-elevated transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-text-secondary">{day}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated text-text-tertiary">
                      {count} 项
                    </span>
                    {minutes > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated text-text-tertiary">
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
                      className="p-1.5 rounded-lg hover:bg-surface-highlight text-text-tertiary hover:text-text-secondary transition-colors"
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
                          <div className="text-center py-4 text-xs text-text-muted">
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
            className="px-4 py-2 rounded-xl text-text-tertiary hover:text-text-secondary transition-colors focus-ring"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-accent text-white font-semibold transition-all focus-ring"
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
    <div className="rounded-xl bg-surface-elevated border border-border-subtle p-3">
      <div className="grid grid-cols-12 gap-2 items-start">
        <div className="col-span-6 sm:col-span-2">
          <label className="block text-2xs text-text-muted mb-1">分类</label>
          <div className="relative">
            <CategoryIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary pointer-events-none" />
            <select
              value={task.category}
              onChange={(e) =>
                onUpdate(task.id, {
                  category: e.target.value as TaskCategory,
                })
              }
              className="w-full pl-7 pr-2 text-xs bg-surface-elevated border border-border-default rounded-lg py-1.5 text-text-secondary focus:outline-none focus:border-accent/50"
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
          <label className="block text-2xs text-text-muted mb-1">任务内容</label>
          <input
            type="text"
            value={task.focus}
            onChange={(e) => onUpdate(task.id, { focus: e.target.value })}
            placeholder="例如：古诗新学"
            className="w-full text-xs bg-surface-elevated border border-border-default rounded-lg px-2 py-1.5 text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
          />
        </div>

        <div className="col-span-6 sm:col-span-2">
          <label className="block text-2xs text-text-muted mb-1">时长</label>
          <input
            type="text"
            value={task.duration}
            onChange={(e) => onUpdate(task.id, { duration: e.target.value })}
            placeholder="30分钟"
            className="w-full text-xs bg-surface-elevated border border-border-default rounded-lg px-2 py-1.5 text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-accent/50"
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
                    : 'bg-surface-elevated text-text-muted hover:bg-surface-highlight'
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
                ? 'bg-primary/[0.08] text-primary'
                : 'hover:bg-surface-highlight text-text-muted hover:text-text-secondary'
            }`}
            aria-label="复制到其它日期"
            title="复制到其它日期"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors focus-ring"
            aria-label="删除任务"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-2">
        <label className="block text-2xs text-text-muted mb-1">材料/关键词</label>
        <div className="flex flex-wrap items-center gap-1.5">
          {task.materials.map((m, idx) => (
            <span
              key={`${m}-${idx}`}
              className="text-2xs px-2 py-0.5 rounded-full bg-surface-highlight text-text-secondary flex items-center gap-1"
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
            className="min-w-[120px] text-xs bg-transparent border-none px-1 py-0.5 text-text-secondary placeholder:text-text-muted focus:outline-none focus:ring-0"
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
            <div className="mt-3 pt-3 border-t border-border-subtle">
              <p className="text-2xs text-text-tertiary mb-2">复制到以下日期：</p>
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
                          ? 'bg-primary/[0.08] text-primary border border-primary/25'
                          : 'bg-surface-elevated text-text-tertiary border border-border-subtle hover:bg-surface-elevated'
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
                  className="px-3 py-1.5 rounded-lg bg-primary/[0.08] text-primary text-xs hover:bg-primary/[0.12] transition-colors disabled:opacity-50"
                >
                  确认复制
                </button>
                <button
                  type="button"
                  onClick={onToggleCopy}
                  className="px-3 py-1.5 rounded-lg bg-surface-elevated text-text-tertiary text-xs hover:bg-surface-highlight transition-colors"
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
        <h3 className="text-lg font-bold text-text-secondary mb-2">有未保存的更改</h3>
        <p className="text-xs text-text-tertiary mb-6">
          关闭后将丢失本次编辑内容，确定要取消吗？
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-text-secondary hover:text-white transition-colors"
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
  const { data: templates = [], isLoading: loading } = useTaskTemplates({ status: 'active' });
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<Set<string>>(new Set());
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('周一');
  const [assessments, setAssessments] = useState<TaskRationalityAssessment[] | null>(null);
  const assess = useAssessTasks();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setAssessments(null);
  }, [selectedTemplateIds, selectedDay]);

  const filteredTemplates = useMemo(
    () => {
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
    },
    [templates, selectedCategory, childRouteId]
  );

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
    () => filteredTemplates.length > 0 && filteredTemplates.every((t) => selectedTemplateIds.has(t.id)),
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
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 lg:left-64 z-[110] flex items-center sm:justify-center sm:p-4 bg-black/70 backdrop-blur-sm"
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
            <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border-default flex items-center justify-center">
              <Library className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="library-title" className="text-xl font-bold font-display">从任务库选择</h2>
              </div>
              <p className="text-xs text-text-tertiary">
                勾选常用任务一键添加到{selectedDay}
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

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-surface-highlight text-white'
                  : 'bg-surface-elevated text-text-tertiary hover:text-text-secondary'
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
                    ? 'bg-surface-highlight text-white'
                    : 'bg-surface-elevated text-text-tertiary hover:text-text-secondary'
                }`}
              >
                {TASK_CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={toggleAllFiltered}
              disabled={filteredTemplates.length === 0}
              className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center ${
                  allFilteredSelected ? 'bg-primary border-primary' : 'border-border-default'
                }`}
              >
                {allFilteredSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
              全选
            </button>
            <span className="text-xs text-text-muted">添加到</span>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
              className="text-xs bg-surface-elevated border border-border-default rounded-lg px-2 py-1.5 text-text-secondary"
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
          <div className="py-12 text-center text-text-muted text-sm">加载中...</div>
        ) : filteredTemplates.length === 0 ? (
          <div className="py-12 text-center text-text-muted text-sm">
            暂无任务模板
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-h-[50vh] overflow-y-auto pr-1">
            {filteredTemplates.map((tpl) => {
              const selected = selectedTemplateIds.has(tpl.id);
              const CategoryIcon = categoryIcons[tpl.category];
              const alignment = tpl.alignment;
              const difficultyColor = tpl.difficulty ? DIFFICULTY_COLORS[tpl.difficulty] : '';
              return (
                <button
                  key={tpl.id}
                  onClick={() => toggleTemplate(tpl.id)}
                  className={`text-left rounded-xl border p-3 transition-all ${
                    selected
                      ? 'bg-primary/[0.08] border-primary/25'
                      : 'bg-surface-elevated border-border-subtle hover:bg-surface-highlight'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center ${selected ? 'bg-primary border-primary' : 'border-border-default'}`}>
                      {selected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <CategoryIcon className="w-3.5 h-3.5 text-text-tertiary" />
                        <span className="text-2xs text-text-tertiary">{TASK_CATEGORY_LABELS[tpl.category]}</span>
                        {tpl.difficulty && DIFFICULTY_LABELS[tpl.difficulty] && (
                          <span className={`text-2xs px-1.5 py-0.5 rounded border ${difficultyColor}`}>
                            {DIFFICULTY_LABELS[tpl.difficulty]}
                          </span>
                        )}
                        {tpl.semesterTag && SEMESTER_LABELS[tpl.semesterTag] && (
                          <span className="text-2xs px-1.5 py-0.5 rounded bg-accent/[0.08] text-accent border border-accent/15">
                            {SEMESTER_LABELS[tpl.semesterTag]}
                          </span>
                        )}
                        {alignment && alignment !== 'unrelated' && (
                          <span className={`text-2xs px-1.5 py-0.5 rounded border ${getAlignmentColorClass(alignment)}`}>
                            {TASK_ALIGNMENT_LABELS[alignment]}
                          </span>
                        )}
                        {alignment === 'unrelated' && (
                          <span className="text-2xs px-1.5 py-0.5 rounded bg-surface-highlight text-text-tertiary border border-border-default">
                            不相关
                          </span>
                        )}
                        <span className="text-2xs px-1.5 py-0.5 rounded bg-surface-elevated text-text-secondary ml-auto">{tpl.duration}</span>
                      </div>
                      <p className="text-sm font-semibold text-text-secondary mb-1 truncate">{tpl.title}</p>
                      {tpl.description && (
                        <p className="text-2xs text-text-muted line-clamp-2 mb-1">{tpl.description}</p>
                      )}
                      {tpl.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-1">
                          {tpl.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[9px] px-1 py-0.5 rounded bg-surface-elevated text-text-muted">
                              {tag}
                            </span>
                          ))}
                          {tpl.tags.length > 3 && (
                            <span className="text-[9px] px-1 py-0.5 rounded bg-surface-elevated text-text-muted">
                              +{tpl.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      {tpl.routeTags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {tpl.routeTags.map((tag) => (
                            <span key={tag} className="text-[9px] px-1 py-0.5 rounded bg-surface-elevated text-text-muted">
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

        {assessments && selectedTemplateIds.size > 0 && (
          <div className="mb-4">
            <TaskRationalityPanel
              assessments={assessments}
              taskTitles={selectedTemplates.map((t) => t.title)}
              compact={assessments.length > 1}
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted">
            已选 {selectedTemplateIds.size} 项
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-text-tertiary hover:text-text-secondary transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleAdd}
              disabled={selectedTemplateIds.size === 0 || assess.isPending}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {assess.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  评估中...
                </>
              ) : assessments ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  确认添加
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  AI 评估并添加
                </>
              )}
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
  const [reportOpen, setReportOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);

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

  const handleMoveTask = async (
    taskId: string,
    targetDay: DayOfWeek,
    targetCategory: TaskCategory
  ) => {
    if (!displayPlan || !currentChild) return;
    const updatedTasks = displayPlan.tasks.map((t) =>
      t.id === taskId ? { ...t, day: targetDay, category: targetCategory } : t
    );
    const updatedPlan = { ...displayPlan, tasks: updatedTasks };
    if (isDraft) {
      setDraftPlan(updatedPlan);
    } else {
      await publishWeeklyPlan(updatedPlan);
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
        <h1 className="text-3xl font-bold font-display">周计划</h1>
        <ChildEmptyState description="添加孩子后，系统会根据年级自动生成每周计划计划" />
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
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border-default flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display">周计划</h1>
              <p className="text-sm text-text-tertiary">
                {currentChild.name} · {gradeLabel(currentChild.grade, currentChild.educationSystem)} · {formatWeekLabel(weekId)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekId((w) => shiftWeekId(w, -1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-elevated hover:bg-surface-highlight text-text-secondary transition-colors focus-ring"
            aria-label="上一周"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-3 py-1.5 rounded-lg glass border border-border-default text-sm font-medium min-w-[120px] text-center tabular-nums">
            {year}年第{week}周
          </div>
          <button
            onClick={() => setWeekId((w) => shiftWeekId(w, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-elevated hover:bg-surface-highlight text-text-secondary transition-colors focus-ring"
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
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-white text-sm font-semibold transition-all duration-200 focus-ring"
            >
              <Target className="w-3.5 h-3.5" />
              生成本周计划
            </button>
          )}
          {isDraft && (
            <>
              <button
                onClick={handlePublish}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-white text-sm font-semibold transition-all duration-200 focus-ring"
              >
                <Send className="w-3.5 h-3.5" />
                发布
              </button>
              <button
                onClick={handleCancelDraft}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-elevated hover:bg-surface-highlight text-text-secondary text-sm transition-colors focus-ring"
              >
                <X className="w-3.5 h-3.5" />
                取消
              </button>
            </>
          )}
          {isPublished && !isDraft && (
            <button
              onClick={handleOpenReview}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent text-white text-sm font-semibold transition-all duration-200 focus-ring"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {plan?.reviewedAt ? '查看复盘' : '本周复盘'}
            </button>
          )}
          {isPublished && !isDraft && stats && (
            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-elevated hover:bg-surface-highlight text-text-secondary text-sm transition-colors focus-ring"
            >
              <Share2 className="w-3.5 h-3.5" />
              导出周报
            </button>
          )}
          {displayPlan && (
            <>
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-elevated hover:bg-surface-highlight text-text-secondary text-sm transition-colors focus-ring"
              >
                <Plus className="w-3.5 h-3.5" />
                手动添加任务
              </button>
              <button
                onClick={() => setLibraryOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-elevated hover:bg-surface-highlight text-text-secondary text-sm transition-colors focus-ring"
              >
                <Library className="w-3.5 h-3.5" />
                从任务库选择
              </button>
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-elevated hover:bg-surface-highlight text-text-secondary text-sm transition-colors focus-ring"
              >
                <Pencil className="w-3.5 h-3.5" />
                {isDraft ? '编辑任务' : '调整任务'}
              </button>
            </>
          )}
          {isDraft && (
            <span className="text-xs text-text-muted">预览模式：发布后才会保存</span>
          )}
        </div>

        <div className="flex items-center gap-1 bg-surface-elevated rounded-lg p-1">
          <button
            onClick={() => setViewMode('day')}
            aria-pressed={viewMode === 'day'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all focus-ring ${
              viewMode === 'day'
                ? 'bg-surface-highlight text-white'
                : 'text-text-tertiary hover:text-text-secondary'
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
                ? 'bg-surface-highlight text-white'
                : 'text-text-tertiary hover:text-text-secondary'
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
          className="rounded-xl border border-warning/20 bg-warning/5 p-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-text-secondary">
                  上周有 {lastWeekUncompleted.length} 项任务未补完
                </p>
                <p className="text-xs text-text-tertiary mt-0.5">
                  可以一键添加到本周，避免学习任务中断
                </p>
              </div>
            </div>
            <button
              onClick={handleCarryOverLastWeek}
              className="shrink-0 px-4 py-2 rounded-lg bg-warning/10 border border-warning/20 text-warning text-sm font-medium hover:bg-warning/15 transition-colors focus-ring"
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
          <CommandCard className="p-4 flex items-center gap-4">
            <MetricRing rate={stats.completionRate} size={64} strokeWidth={6} />
            <div>
              <p className="text-xs text-text-muted">本周完成率</p>
              <p className="text-lg font-bold font-display tabular-nums text-text-primary">
                {stats.done}/{stats.total}
              </p>
              <p className="text-2xs text-text-muted">
                {stats.pending > 0 ? `还剩 ${stats.pending} 项` : '全部完成'}
              </p>
            </div>
          </CommandCard>

          <CommandCard className="p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="w-3.5 h-3.5 text-accent" />
              <p className="text-xs text-text-muted">计划总时长</p>
            </div>
            <p className="text-lg font-bold font-display tabular-nums text-text-primary">
              {Math.round((stats.estimatedMinutes / 60) * 10) / 10}h
            </p>
            <p className="text-2xs text-text-muted">约 {stats.estimatedMinutes} 分钟</p>
          </CommandCard>

          <CommandCard className="p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-accent" />
              <p className="text-xs text-text-muted">分类完成</p>
            </div>
            <div className="space-y-1 max-h-[72px] overflow-y-auto">
              {(['school', 'reading', 'sport', 'interest', 'ability', 'other'] as TaskCategory[])
                .filter((cat) => stats.byCategory[cat].total > 0)
                .map((cat) => {
                  const s = stats.byCategory[cat];
                  return (
                    <div key={cat} className="flex items-center justify-between text-xs">
                      <span className="text-text-tertiary">{TASK_CATEGORY_LABELS[cat]}</span>
                      <span className={s.total === s.done ? 'text-success tabular-nums' : 'text-text-secondary tabular-nums'}>
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
              <p className="text-xs text-text-muted">本周状态</p>
            </div>
            <p className="text-base font-semibold text-text-primary">
              {isDraft ? '草稿待发布' : isPublished ? '已发布' : '未生成'}
            </p>
            <p className="text-2xs text-text-muted">
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
            <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-border-default flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-display mb-2">本周计划尚未发布</h3>
            <p className="text-sm text-text-tertiary mb-6 max-w-md mx-auto">
              从任务库中选择任务，按周发布时间属性自动生成矩阵。发布后即可每日打卡。
            </p>
            <button
              onClick={handleGenerate}
              className="px-6 py-3 rounded-xl bg-primary text-white font-semibold transition-all focus-ring"
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
                        ? 'bg-surface-elevated border-primary/30'
                        : 'bg-surface-elevated border-border-subtle hover:bg-surface-elevated hover:border-border-default'
                    }`}
                  >
                    {isToday && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary" />
                    )}
                    <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-text-secondary'}`}>
                      {day}
                    </p>
                    <p className="text-2xs text-text-muted mt-0.5 tabular-nums">
                      {total === 0 ? '无任务' : `${done}/${total}`}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {tasksByDay?.[selectedDay]?.length === 0 ? (
                <div className="lg:col-span-3 rounded-xl glass border border-border-subtle p-8 text-center text-text-muted text-sm">
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
                            className="mt-0.5 text-text-tertiary hover:text-primary transition-colors focus-ring rounded-full"
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
                              <span className="text-xs font-medium text-text-tertiary">
                                {TASK_CATEGORY_LABELS[category]}
                              </span>
                              {alignment && (
                                <span className={`text-2xs px-1.5 py-0.5 rounded border ${getAlignmentColorClass(alignment)}`}>
                                  {TASK_ALIGNMENT_LABELS[alignment]}
                                </span>
                              )}
                              <span className="ml-auto text-2xs px-1.5 py-0.5 rounded bg-surface-elevated text-text-secondary">
                                {task.duration}
                              </span>
                            </div>
                            <p
                              className={`text-sm font-semibold mb-2 ${
                                isDone ? 'text-text-muted line-through' : 'text-text-secondary'
                              }`}
                            >
                              {task.focus}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {task.materials.map((m) => (
                                <span
                                  key={m}
                                  className="text-2xs px-1.5 py-0.5 rounded bg-surface-elevated text-text-tertiary border border-border-subtle"
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
                                className="w-full text-xs bg-surface-elevated border border-border-default rounded-lg px-2.5 py-1.5 text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-primary/50 resize-none"
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
          <WeeklyMatrix
            tasks={displayPlan.tasks}
            weekId={weekId}
            today={today}
            stats={stats}
            onToggleTask={handleToggleTask}
            onMoveTask={handleMoveTask}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reviewOpen && stats && displayPlan && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 lg:left-64 z-[110] flex items-center sm:justify-center sm:p-4 bg-black/70 backdrop-blur-sm"
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
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 id="review-title" className="text-xl font-bold font-display">本周复盘</h2>
                    <p className="text-xs text-text-tertiary">{formatWeekLabel(weekId)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setReviewOpen(false)}
                  className="p-2 rounded-lg hover:bg-surface-elevated text-text-tertiary focus-ring"
                  aria-label="关闭"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="rounded-xl bg-surface-elevated p-4 text-center">
                  <p className="text-2xl font-bold text-text-secondary">{stats.completionRate}%</p>
                  <p className="text-xs text-text-muted">完成率</p>
                </div>
                <div className="rounded-xl bg-surface-elevated p-4 text-center">
                  <p className="text-2xl font-bold text-text-secondary">{stats.done}</p>
                  <p className="text-xs text-text-muted">已完成</p>
                </div>
                <div className="rounded-xl bg-surface-elevated p-4 text-center">
                  <p className="text-2xl font-bold text-text-secondary">{stats.pending}</p>
                  <p className="text-xs text-text-muted">待补</p>
                </div>
              </div>

              <div className="rounded-xl bg-accent/[0.06] border border-accent/15 p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <p className="text-sm font-semibold text-text-secondary">AI 点评</p>
                </div>
                <p className="text-sm text-text-tertiary leading-relaxed">
                  {generateAiReview(displayPlan, currentChild.name)}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  家长评语
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="写下对孩子的鼓励、问题或下周调整..."
                  className="w-full bg-surface-elevated border border-border-default rounded-xl px-4 py-3 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none focus:border-accent/50 resize-none"
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setReviewOpen(false)}
                  className="px-4 py-2 rounded-xl text-text-tertiary hover:text-text-secondary transition-colors focus-ring"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveReview}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-accent text-white font-semibold transition-all focus-ring"
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
    </div>
  );
}

function WeeklyTasksSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-elevated" />
          <div className="space-y-2">
            <div className="h-5 w-32 rounded bg-surface-elevated" />
            <div className="h-3 w-48 rounded bg-surface-elevated" />
          </div>
        </div>
        <div className="h-8 w-28 rounded-lg bg-surface-elevated" />
      </div>
      <div className="h-10 rounded-xl bg-surface-elevated" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
