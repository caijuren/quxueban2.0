'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  X,
  Calendar,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Search,
  Filter,
  Send,
  BookOpen,
  Backpack,
  Dumbbell,
  Palette,
  GraduationCap,
  Trophy,
  Trash2,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import {
  type WeeklyPlan,
  type WeeklyTaskItem,
  type TaskTemplate,
  type TaskCategory,
  type DayOfWeek,
} from '@/lib/storage.types';
import { useTaskTemplates } from '@/lib/hooks/useTaskTemplates';
import {
  dayOrder,
  getCurrentWeekId,
  getISOWeek,
  getWeekRange,
  formatWeekLabel,
  parseDurationMinutes,
  generateWeeklyPlanFromSelectedTemplates,
  getScheduledDays,
} from '@/lib/weeklyTasks';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { getCategoryColorClass } from '@/lib/taskAlignment';

type Step = 'week' | 'tasks' | 'preview';

const categoryIcons: Record<TaskCategory, typeof BookOpen> = {
  school: Backpack,
  reading: BookOpen,
  sport: Dumbbell,
  interest: Palette,
  ability: Trophy,
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

const scheduleFilterOptions: { value: 'all' | TaskTemplate['weeklySchedule']; label: string }[] = [
  { value: 'all', label: '全部时间' },
  { value: 'daily', label: '每天' },
  { value: 'weekdays', label: '工作日' },
  { value: 'weekends', label: '周末' },
  { value: 'custom', label: '指定星期' },
  { value: 'auto', label: '自动分配' },
];

function weekIdOption(label: string, weekId: string) {
  return { label, weekId, range: formatWeekLabel(weekId) };
}

interface GeneratePlanModalProps {
  initialWeekId?: string;
  onClose: () => void;
  onPublish: (plan: WeeklyPlan) => void;
}

export default function GeneratePlanModal({
  initialWeekId,
  onClose,
  onPublish,
}: GeneratePlanModalProps) {
  const { currentChild } = useChildren();
  const shouldReduceMotion = useReducedMotion();

  const [step, setStep] = useState<Step>('week');
  const [weekId, setWeekId] = useState<string>(initialWeekId ?? getCurrentWeekId());
  const { data: templates = [], isLoading: loadingTemplates } = useTaskTemplates({ status: 'active' });
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'all'>('all');
  const [filterSchedule, setFilterSchedule] = useState<'all' | TaskTemplate['weeklySchedule']>('all');
  const [previewTasks, setPreviewTasks] = useState<WeeklyTaskItem[]>([]);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    setSelectedTemplateIds(new Set());
  }, []);

  const weekOptions = useMemo(() => {
    const current = getCurrentWeekId();
    return [
      weekIdOption('本周', current),
      weekIdOption('下周', shiftWeekId(current, 1)),
      weekIdOption('下下周', shiftWeekId(current, 2)),
    ];
  }, []);

  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      const matchesSearch =
        tpl.title.toLowerCase().includes(search.toLowerCase()) ||
        (tpl.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesCategory = filterCategory === 'all' || tpl.category === filterCategory;
      const matchesSchedule = filterSchedule === 'all' || tpl.weeklySchedule === filterSchedule;
      return matchesSearch && matchesCategory && matchesSchedule;
    });
  }, [templates, search, filterCategory, filterSchedule]);

  const selectedTemplates = useMemo(
    () => templates.filter((t) => selectedTemplateIds.has(t.id)),
    [templates, selectedTemplateIds]
  );

  const estimatedMinutes = useMemo(() => {
    return previewTasks.reduce((sum, t) => sum + parseDurationMinutes(t.duration), 0);
  }, [previewTasks]);

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
    previewTasks.forEach((t) => grouped[t.day].push(t));
    dayOrder.forEach((d) => grouped[d].sort((a, b) => a.category.localeCompare(b.category)));
    return grouped;
  }, [previewTasks]);

  const dailyMinutes = useMemo(() => {
    const stats: Record<DayOfWeek, number> = {
      周一: 0,
      周二: 0,
      周三: 0,
      周四: 0,
      周五: 0,
      周六: 0,
      周日: 0,
    };
    previewTasks.forEach((t) => {
      stats[t.day] += parseDurationMinutes(t.duration);
    });
    return stats;
  }, [previewTasks]);

  const toggleTemplate = (id: string) => {
    setSelectedTemplateIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleNext = () => {
    if (step === 'week') {
      setStep('tasks');
    } else if (step === 'tasks') {
      if (!currentChild) return;
      const plan = generateWeeklyPlanFromSelectedTemplates(
        currentChild,
        weekId,
        selectedTemplates
      );
      setPreviewTasks(plan.tasks);
      setStep('preview');
    }
  };

  const handleBack = () => {
    if (step === 'tasks') setStep('week');
    else if (step === 'preview') setStep('tasks');
  };

  const handlePublish = async () => {
    if (!currentChild) return;
    setPublishing(true);
    try {
      await onPublish({
        weekId,
        childId: currentChild.id,
        tasks: previewTasks,
      });
    } finally {
      setPublishing(false);
    }
  };

  const moveTaskDay = (taskId: string, day: DayOfWeek) => {
    setPreviewTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, day } : t))
    );
  };

  const removeTask = (taskId: string) => {
    setPreviewTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const canNext =
    (step === 'week' && !!weekId) ||
    (step === 'tasks' && selectedTemplateIds.size > 0) ||
    step === 'preview';

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
        aria-labelledby="generate-plan-title"
        className="w-full h-full sm:h-auto sm:max-w-5xl sm:max-h-[90vh] overflow-hidden rounded-none sm:rounded-3xl glass sm:border border-white/10 flex flex-col"
      >
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="generate-plan-title" className="text-xl font-bold font-display">
                生成本周计划
              </h2>
              <p className="text-xs text-slate-400">
                {step === 'week' && '第 1 步：选择要发布的周'}
                {step === 'tasks' && '第 2 步：从任务库选择任务'}
                {step === 'preview' && '第 3 步：预览并发布'}
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

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 modal-scroll">
          <AnimatePresence mode="wait">
            {step === 'week' && (
              <StepWeek
                key="week"
                weekId={weekId}
                setWeekId={setWeekId}
                options={weekOptions}
              />
            )}
            {step === 'tasks' && (
              <StepTasks
                key="tasks"
                templates={filteredTemplates}
                loading={loadingTemplates}
                selectedIds={selectedTemplateIds}
                toggleTemplate={toggleTemplate}
                search={search}
                setSearch={setSearch}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                filterSchedule={filterSchedule}
                setFilterSchedule={setFilterSchedule}
              />
            )}
            {step === 'preview' && (
              <StepPreview
                key="preview"
                tasksByDay={tasksByDay}
                dailyMinutes={dailyMinutes}
                estimatedMinutes={estimatedMinutes}
                onMoveTask={moveTaskDay}
                onRemoveTask={removeTask}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between p-5 sm:p-6 border-t border-white/[0.06]">
          <div className="text-xs text-slate-500">
            {step === 'tasks' && `已选 ${selectedTemplateIds.size} 项任务`}
            {step === 'preview' && `共 ${previewTasks.length} 个任务，约 ${estimatedMinutes} 分钟`}
          </div>
          <div className="flex items-center gap-3">
            {step !== 'week' && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-300 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                上一步
              </button>
            )}
            {step !== 'preview' ? (
              <button
                onClick={handleNext}
                disabled={!canNext}
                className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow-primary transition-all"
              >
                下一步
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={publishing || previewTasks.length === 0}
                className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow-primary transition-all"
              >
                {publishing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                发布
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function shiftWeekId(weekId: string, delta: number): string {
  const { start } = getWeekRange(weekId);
  const next = new Date(start);
  next.setDate(start.getDate() + delta * 7);
  return getISOWeek(next).weekId;
}

interface StepWeekProps {
  weekId: string;
  setWeekId: (id: string) => void;
  options: { label: string; weekId: string; range: string }[];
}

function StepWeek({ weekId, setWeekId, options }: StepWeekProps) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <p className="text-sm text-slate-400">选择要生成计划的周，支持补发本周或提前安排下周。</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((option) => {
          const selected = weekId === option.weekId;
          return (
            <button
              key={option.weekId}
              onClick={() => setWeekId(option.weekId)}
              className={`text-left rounded-xl border p-4 transition-all ${
                selected
                  ? 'bg-primary/10 border-primary/30'
                  : 'bg-white/5 border-white/[0.06] hover:bg-white/[0.07]'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selected ? 'border-primary bg-primary' : 'border-white/20'
                  }`}
                >
                  {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-sm font-bold text-slate-200">{option.label}</span>
              </div>
              <p className="text-xs text-slate-400 ml-6">{option.range}</p>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

interface StepTasksProps {
  templates: TaskTemplate[];
  loading: boolean;
  selectedIds: Set<string>;
  toggleTemplate: (id: string) => void;
  search: string;
  setSearch: (value: string) => void;
  filterCategory: TaskCategory | 'all';
  setFilterCategory: (value: TaskCategory | 'all') => void;
  filterSchedule: 'all' | TaskTemplate['weeklySchedule'];
  setFilterSchedule: (value: 'all' | TaskTemplate['weeklySchedule']) => void;
}

function StepTasks({
  templates,
  loading,
  selectedIds,
  toggleTemplate,
  search,
  setSearch,
  filterCategory,
  setFilterCategory,
  filterSchedule,
  setFilterSchedule,
}: StepTasksProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索任务名称"
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
            value={filterSchedule}
            onChange={(e) =>
              setFilterSchedule(e.target.value as 'all' | TaskTemplate['weeklySchedule'])
            }
            className="text-xs bg-white/5 border border-white/[0.08] rounded-lg px-2 py-2 text-slate-200 focus:outline-none focus:border-primary/50"
          >
            {scheduleFilterOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 text-sm">加载任务库...</div>
      ) : templates.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-sm">没有匹配的任务</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-1">
          {templates.map((tpl) => {
            const selected = selectedIds.has(tpl.id);
            const CategoryIcon = categoryIcons[tpl.category];
            const scheduleDays = getScheduledDays(tpl.weeklySchedule, tpl.customScheduleDays);
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
                  <div
                    className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center ${
                      selected ? 'bg-secondary border-secondary' : 'border-white/20'
                    }`}
                  >
                    {selected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <CategoryIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] text-slate-400">
                        {TASK_CATEGORY_LABELS[tpl.category]}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300 ml-auto">
                        {tpl.duration}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-200 mb-1 truncate">
                      {tpl.title}
                    </p>
                    {tpl.description && (
                      <p className="text-[10px] text-slate-500 line-clamp-2 mb-1">
                        {tpl.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {scheduleDays.length > 0 ? (
                        scheduleDays.map((d) => (
                          <span
                            key={d}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-info/10 text-info border border-info/20"
                          >
                            {d}
                          </span>
                        ))
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500">
                          自动分配
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

interface StepPreviewProps {
  tasksByDay: Record<DayOfWeek, WeeklyTaskItem[]>;
  dailyMinutes: Record<DayOfWeek, number>;
  estimatedMinutes: number;
  onMoveTask: (taskId: string, day: DayOfWeek) => void;
  onRemoveTask: (taskId: string) => void;
}

function StepPreview({
  tasksByDay,
  dailyMinutes,
  estimatedMinutes,
  onMoveTask,
  onRemoveTask,
}: StepPreviewProps) {
  const shouldReduceMotion = useReducedMotion();
  const overloadedDays = dayOrder.filter((d) => dailyMinutes[d] > 180);

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
      className="space-y-4"
    >
      {overloadedDays.length > 0 && (
        <div className="rounded-xl border border-warning/20 bg-warning/5 p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300">
            {overloadedDays.join('、')} 任务量超过 3 小时，建议适当减少或调整。
          </p>
        </div>
      )}

      <div className="hidden lg:block overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayOrder.map((day) => (
              <div key={day} className="text-center">
                <span className="text-xs font-bold text-slate-300">{day}</span>
                <span className="block text-[10px] text-slate-500">
                  {tasksByDay[day].length} 项 · {dailyMinutes[day]} 分钟
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {dayOrder.map((day) => (
              <div
                key={day}
                className="min-h-[200px] rounded-xl bg-white/[0.03] border border-white/[0.06] p-2 space-y-2"
              >
                {tasksByDay[day].map((task) => (
                  <PreviewTaskCard
                    key={task.id}
                    task={task}
                    onMove={onMoveTask}
                    onRemove={onRemoveTask}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:hidden space-y-4">
        {dayOrder.map((day) => (
          <div key={day} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-300">{day}</span>
              <span className="text-[10px] text-slate-500">
                {tasksByDay[day].length} 项 · {dailyMinutes[day]} 分钟
              </span>
            </div>
            <div className="space-y-2">
              {tasksByDay[day].length === 0 && (
                <p className="text-xs text-slate-600 py-2">当天无任务</p>
              )}
              {tasksByDay[day].map((task) => (
                <PreviewTaskCard
                  key={task.id}
                  task={task}
                  onMove={onMoveTask}
                  onRemove={onRemoveTask}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
        <span>总计约 {estimatedMinutes} 分钟</span>
        <span>可点击任务卡片调整日期或删除</span>
      </div>
    </motion.div>
  );
}

interface PreviewTaskCardProps {
  task: WeeklyTaskItem;
  onMove: (taskId: string, day: DayOfWeek) => void;
  onRemove: (taskId: string) => void;
}

function PreviewTaskCard({ task, onMove, onRemove }: PreviewTaskCardProps) {
  const CategoryIcon = categoryIcons[task.category];
  return (
    <div className="group rounded-lg bg-white/5 border border-white/5 p-2 hover:bg-white/[0.07] transition-colors">
      <div className="flex items-start gap-2">
        <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${getCategoryColorClass(task.category)}`}>
          <CategoryIcon className="w-3 h-3" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-200 truncate">{task.focus}</p>
          <p className="text-[10px] text-slate-500">{task.duration}</p>
        </div>
        <button
          onClick={() => onRemove(task.id)}
          className="p-1 rounded hover:bg-error/10 text-slate-500 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="删除"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <select
          value={task.day}
          onChange={(e) => onMove(task.id, e.target.value as DayOfWeek)}
          className="text-[10px] bg-white/5 border border-white/10 rounded px-1.5 py-1 text-slate-300 focus:outline-none focus:border-primary/50"
        >
          {dayOrder.map((d) => (
            <option key={d} value={d}>
              移到 {d}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
