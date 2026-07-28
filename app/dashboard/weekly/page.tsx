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

const subjectIcons: Record<SubjectId, typeof BookOpen> = {
  chinese: BookOpen,
  math: Calculator,
  english: Languages,
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

function EditPlanModal({ plan, onClose, onSave }: EditPlanModalProps) {
  const [tasks, setTasks] = useState<WeeklyTaskItem[]>(() =>
    [...plan.tasks].sort((a, b) => {
      const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      return a.subjectId.localeCompare(b.subjectId);
    })
  );

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

  const addTask = () => {
    setTasks((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        subjectId: 'chinese',
        day: '周一',
        focus: '',
        duration: '30分钟',
        materials: [],
        status: 'pending',
      },
    ]);
  };

  const handleSave = () => {
    const validTasks = tasks.filter((t) => t.focus.trim() !== '');
    onSave(validTasks);
    onClose();
  };

  const shouldReduceMotion = useReducedMotion();

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
                增删改任务后保存即可生效
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

        <div className="space-y-3 mb-6">
          {tasks.map((task, index) => {
            const SubjectIcon = subjectIcons[task.subjectId];
            return (
              <div
                key={task.id}
                className="grid grid-cols-12 gap-2 items-start rounded-xl bg-white/5 border border-white/5 p-3"
              >
                <div className="col-span-12 sm:col-span-2">
                  <label className="block text-[10px] text-slate-500 mb-1">
                    学科
                  </label>
                  <select
                    value={task.subjectId}
                    onChange={(e) =>
                      updateTask(task.id, {
                        subjectId: e.target.value as SubjectId,
                      })
                    }
                    className="w-full text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 focus:outline-none focus:border-accent/50"
                  >
                    {(['chinese', 'math', 'english'] as SubjectId[]).map((s) => (
                      <option key={s} value={s}>
                        {subjectMeta[s].name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-1">
                  <label className="block text-[10px] text-slate-500 mb-1">
                    星期
                  </label>
                  <select
                    value={task.day}
                    onChange={(e) =>
                      updateTask(task.id, { day: e.target.value as DayOfWeek })
                    }
                    className="w-full text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 focus:outline-none focus:border-accent/50"
                  >
                    {dayOrder.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <label className="block text-[10px] text-slate-500 mb-1">
                    任务内容
                  </label>
                  <input
                    type="text"
                    value={task.focus}
                    onChange={(e) =>
                      updateTask(task.id, { focus: e.target.value })
                    }
                    placeholder="例如：古诗新学"
                    className="w-full text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-accent/50"
                  />
                </div>

                <div className="col-span-6 sm:col-span-2">
                  <label className="block text-[10px] text-slate-500 mb-1">
                    时长
                  </label>
                  <input
                    type="text"
                    value={task.duration}
                    onChange={(e) =>
                      updateTask(task.id, { duration: e.target.value })
                    }
                    placeholder="30分钟"
                    className="w-full text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-accent/50"
                  />
                </div>

                <div className="col-span-5 sm:col-span-2">
                  <label className="block text-[10px] text-slate-500 mb-1">
                    材料/关键词
                  </label>
                  <input
                    type="text"
                    value={task.materials.join('，')}
                    onChange={(e) =>
                      updateTask(task.id, {
                        materials: e.target.value
                          .split(/[,，]/)
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="用逗号分隔"
                    className="w-full text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-accent/50"
                  />
                </div>

                <div className="col-span-1 flex justify-end pt-5">
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-lg hover:bg-error/10 text-slate-500 hover:text-error transition-colors focus-ring"
                    aria-label="删除任务"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={addTask}
          className="w-full py-2.5 mb-6 rounded-xl border border-dashed border-white/15 text-slate-400 hover:text-slate-200 hover:border-white/30 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm focus-ring"
        >
          <Plus className="w-4 h-4" />
          添加任务
        </button>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
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
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-colors focus-ring"
            >
              <Pencil className="w-3.5 h-3.5" />
              {isDraft ? '编辑任务' : '调整任务'}
            </button>
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
              <p className="text-xs text-slate-500">学科完成</p>
            </div>
            <div className="space-y-1">
              {(['chinese', 'math', 'english'] as SubjectId[]).map((subjectId) => {
                const s = stats.bySubject[subjectId];
                return (
                  <div key={subjectId} className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{subjectMeta[subjectId].name}</span>
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
                  const SubjectIcon = subjectIcons[task.subjectId];
                  const meta = subjectMeta[task.subjectId];
                  const isDone = task.status === 'done';
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
                                className={`w-6 h-6 rounded-md bg-gradient-to-br ${meta.gradient} flex items-center justify-center`}
                              >
                                <SubjectIcon className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-[11px] font-medium text-slate-400">
                                {meta.name}
                              </span>
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
                <div className="text-xs text-slate-500 font-medium px-3 py-2">学科</div>
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

              {(['chinese', 'math', 'english'] as SubjectId[]).map((subjectId) => {
                const meta = subjectMeta[subjectId];
                const SubjectIcon = subjectIcons[subjectId];
                return (
                  <div key={subjectId} className="grid grid-cols-8 gap-2 mb-2">
                    <div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-white/5">
                      <div
                        className={`w-7 h-7 rounded-lg bg-gradient-to-br ${meta.gradient} flex items-center justify-center`}
                      >
                        <SubjectIcon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">{meta.name}</span>
                    </div>
                    {dayOrder.map((day) => {
                      const task = tasksByDay?.[day].find((t) => t.subjectId === subjectId);
                      const taskDone = task?.status === 'done';
                      return (
                        <button
                          key={day}
                          type="button"
                          disabled={!task}
                          onClick={() => task && handleToggleTask(task)}
                          aria-label={
                            task
                              ? `${meta.name} ${day}：${task.focus}，${task.duration}，点击${taskDone ? '取消完成' : '标记完成'}`
                              : `${meta.name} ${day}：无任务`
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
                                  {meta.name} · {task.duration}
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
