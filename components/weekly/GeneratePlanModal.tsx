'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
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
import Modal from '@/components/ui/Modal';
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

  const [step, setStep] = useState<Step>('week');
  const [weekId, setWeekId] = useState<string>(initialWeekId ?? getCurrentWeekId());
  const { data: templates = [], isLoading: loadingTemplates } = useTaskTemplates(currentChild?.id, {
    status: 'active',
  });
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<TaskCategory | 'all'>('all');
  const [filterSchedule, setFilterSchedule] = useState<'all' | TaskTemplate['weeklySchedule']>(
    'all'
  );
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

  const allFilteredSelected = useMemo(
    () =>
      filteredTemplates.length > 0 && filteredTemplates.every((t) => selectedTemplateIds.has(t.id)),
    [filteredTemplates, selectedTemplateIds]
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

  const handleNext = () => {
    if (step === 'week') {
      setStep('tasks');
    } else if (step === 'tasks') {
      if (!currentChild) return;
      const plan = generateWeeklyPlanFromSelectedTemplates(currentChild, weekId, selectedTemplates);
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
    setPreviewTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, day } : t)));
  };

  const removeTask = (taskId: string) => {
    setPreviewTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const canNext =
    (step === 'week' && !!weekId) ||
    (step === 'tasks' && selectedTemplateIds.size > 0) ||
    step === 'preview';

  const subtitle =
    step === 'week'
      ? '第 1 步：选择要发布的周'
      : step === 'tasks'
        ? '第 2 步：从任务库选择任务'
        : '第 3 步：预览并发布';

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="生成本周计划"
      subtitle={subtitle}
      icon={Calendar}
      iconClassName="bg-primary"
      size="xl"
      footer={
        <div className="flex w-full items-center justify-between">
          <div className="text-xs text-text-muted">
            {step === 'tasks' && `已选 ${selectedTemplateIds.size} 项任务`}
            {step === 'preview' && `共 ${previewTasks.length} 个任务，约 ${estimatedMinutes} 分钟`}
          </div>
          <div className="flex items-center gap-3">
            {step !== 'week' && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-secondary"
              >
                <ChevronLeft className="size-5" />
                上一步
              </button>
            )}
            {step !== 'preview' ? (
              <button
                onClick={handleNext}
                disabled={!canNext}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-6 py-2 font-medium text-inverse transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                下一步
                <ChevronRight className="size-5" />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={publishing || previewTasks.length === 0}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-6 py-2 font-medium text-inverse transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {publishing ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Send className="size-5" />
                )}
                发布
              </button>
            )}
          </div>
        </div>
      }
    >
      <AnimatePresence mode="wait">
        {step === 'week' && (
          <StepWeek key="week" weekId={weekId} setWeekId={setWeekId} options={weekOptions} />
        )}
        {step === 'tasks' && (
          <StepTasks
            key="tasks"
            templates={filteredTemplates}
            loading={loadingTemplates}
            selectedIds={selectedTemplateIds}
            toggleTemplate={toggleTemplate}
            allFilteredSelected={allFilteredSelected}
            toggleAllFiltered={toggleAllFiltered}
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
    </Modal>
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
      <p className="text-sm text-text-muted">选择要生成计划的周，支持补发本周或提前安排下周。</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const selected = weekId === option.weekId;
          return (
            <button
              key={option.weekId}
              onClick={() => setWeekId(option.weekId)}
              className={`rounded-2xl border p-4 text-left transition-colors ${
                selected
                  ? 'border-primary/30 bg-surface-highlight'
                  : 'border-border-subtle bg-surface-elevated hover:bg-surface-hover'
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <div
                  className={`flex size-4 items-center justify-center rounded-full border ${
                    selected ? 'border-primary bg-primary' : 'border-border-default'
                  }`}
                >
                  {selected && <div className="size-1.5 rounded-full bg-text-primary" />}
                </div>
                <span className="text-sm font-bold text-text-secondary">{option.label}</span>
              </div>
              <p className="ml-6 text-xs text-text-muted">{option.range}</p>
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
  allFilteredSelected: boolean;
  toggleAllFiltered: () => void;
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
  allFilteredSelected,
  toggleAllFiltered,
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
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索任务名称"
            className="w-full rounded-lg border border-border-default bg-surface py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="size-4 text-text-muted" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as TaskCategory | 'all')}
            className="rounded-lg border border-border-default bg-surface p-2 text-xs text-text-primary focus:border-primary focus:outline-none"
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
            className="rounded-lg border border-border-default bg-surface p-2 text-xs text-text-primary focus:border-primary focus:outline-none"
          >
            {scheduleFilterOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            onClick={toggleAllFiltered}
            disabled={templates.length === 0}
            className="flex items-center gap-1.5 text-xs text-text-tertiary transition-colors hover:text-text-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <div
              className={`flex size-4 items-center justify-center rounded border ${
                allFilteredSelected ? 'border-primary bg-primary' : 'border-border-default'
              }`}
            >
              {allFilteredSelected && <CheckCircle2 className="size-3 text-text-primary" />}
            </div>
            全选
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-text-muted">加载任务库...</div>
      ) : templates.length === 0 ? (
        <div className="py-12 text-center text-sm text-text-muted">没有匹配的任务</div>
      ) : (
        <div className="grid max-h-[50vh] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((tpl) => {
            const selected = selectedIds.has(tpl.id);
            const CategoryIcon = categoryIcons[tpl.category];
            const scheduleDays = getScheduledDays(tpl.weeklySchedule, tpl.customScheduleDays);
            return (
              <button
                key={tpl.id}
                onClick={() => toggleTemplate(tpl.id)}
                className={`rounded-2xl border p-3 text-left transition-colors ${
                  selected
                    ? 'border-primary/30 bg-surface-highlight'
                    : 'border-border-subtle bg-surface-elevated hover:bg-surface-hover'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex size-5 items-center justify-center rounded border ${
                      selected ? 'border-primary bg-primary' : 'border-border-default'
                    }`}
                  >
                    {selected && <CheckCircle2 className="size-3.5 text-text-primary" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-1.5">
                      <CategoryIcon className="size-4 text-text-tertiary" />
                      <span className="text-[10px] text-text-muted">
                        {TASK_CATEGORY_LABELS[tpl.category]}
                      </span>
                      <span className="ml-auto rounded bg-surface px-1.5 py-0.5 text-[10px] text-text-secondary">
                        {tpl.duration}
                      </span>
                    </div>
                    <p className="mb-1 truncate text-sm font-semibold text-text-secondary">
                      {tpl.title}
                    </p>
                    {tpl.description && (
                      <p className="mb-1 line-clamp-2 text-[10px] text-text-muted">
                        {tpl.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {scheduleDays.length > 0 ? (
                        scheduleDays.map((d) => (
                          <span
                            key={d}
                            className="bg-primary/10 border-primary/20 rounded border px-1.5 py-0.5 text-[9px] text-primary"
                          >
                            {d}
                          </span>
                        ))
                      ) : (
                        <span className="rounded bg-surface px-1.5 py-0.5 text-[9px] text-text-muted">
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
        <div className="border-warning/20 bg-warning/5 flex items-start gap-2 rounded-2xl border p-3">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
          <p className="text-xs text-text-secondary">
            {overloadedDays.join('、')} 任务量超过 3 小时，建议适当减少或调整。
          </p>
        </div>
      )}

      <div className="hidden overflow-x-auto lg:block">
        <div className="min-w-[900px]">
          <div className="mb-2 grid grid-cols-7 gap-2">
            {dayOrder.map((day) => (
              <div key={day} className="text-center">
                <span className="text-xs font-bold text-text-secondary">{day}</span>
                <span className="block text-[10px] text-text-muted">
                  {tasksByDay[day].length} 项 · {dailyMinutes[day]} 分钟
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {dayOrder.map((day) => (
              <div
                key={day}
                className="min-h-[200px] space-y-2 rounded-2xl border border-border-subtle bg-surface-elevated p-2"
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

      <div className="space-y-4 lg:hidden">
        {dayOrder.map((day) => (
          <div
            key={day}
            className="rounded-2xl border border-border-subtle bg-surface-elevated p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-text-secondary">{day}</span>
              <span className="text-[10px] text-text-muted">
                {tasksByDay[day].length} 项 · {dailyMinutes[day]} 分钟
              </span>
            </div>
            <div className="space-y-2">
              {tasksByDay[day].length === 0 && (
                <p className="py-2 text-xs text-text-muted">当天无任务</p>
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

      <div className="flex items-center justify-between pt-2 text-xs text-text-muted">
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
    <div className="bg-surface-hover/40 group rounded-lg border border-border-subtle p-2 transition-colors hover:bg-surface-hover">
      <div className="flex items-start gap-2">
        <div
          className={`flex size-6 shrink-0 items-center justify-center rounded-lg ${getCategoryColorClass(task.category)}`}
        >
          <CategoryIcon className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-text-secondary">{task.focus}</p>
          <p className="text-[10px] text-text-muted">{task.duration}</p>
        </div>
        <button
          onClick={() => onRemove(task.id)}
          className="hover:bg-error/10 rounded-lg p-1 text-text-tertiary opacity-0 transition-opacity hover:text-error group-hover:opacity-100"
          aria-label="删除"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <select
          value={task.day}
          onChange={(e) => onMove(task.id, e.target.value as DayOfWeek)}
          className="rounded-lg border border-border-default bg-surface px-1.5 py-1 text-[10px] text-text-secondary focus:border-primary focus:outline-none"
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
