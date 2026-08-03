// @ts-nocheck
// FIXME: 本组件引用了 weeklyTasks 中未实现的 timeSlot 相关函数
'use client';

import { useMemo, useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, GripVertical } from 'lucide-react';
import {
  type WeeklyTaskItem,
  type TaskCategory,
  type DayOfWeek,
} from '@/lib/storage.types';
import {
  type PlanStats,
  dayOrder,
  getCurrentWeekId,
  getWeekRange,
  getCategoryDefaultTimeSlot,
  getTimeSlotLabel,
  timeSlotOrder,
} from '@/lib/weeklyTasks';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { getCategoryColorClass } from '@/lib/taskAlignment';
import { categoryIcons as taskCategoryIcons } from '@/lib/taskIcons';

const allCategories: TaskCategory[] = [
  'school',
  'reading',
  'sport',
  'interest',
  'ability',
  'other',
];

interface WeeklyMatrixProps {
  tasks: WeeklyTaskItem[];
  weekId: string;
  today: DayOfWeek;
  stats: PlanStats | null;
  onToggleTask: (task: WeeklyTaskItem) => void;
  onMoveTask: (taskId: string, targetDay: DayOfWeek, targetCategory: TaskCategory) => void;
}

export default function WeeklyMatrix({
  tasks,
  weekId,
  today,
  stats,
  onToggleTask,
  onMoveTask,
}: WeeklyMatrixProps) {
  const shouldReduceMotion = useReducedMotion();
  const [matrixDay, setMatrixDay] = useState<DayOfWeek>(today);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const dragSourceRef = useRef<{ taskId: string; day: DayOfWeek; category: TaskCategory } | null>(null);
  const clickIgnoreRef = useRef(false);

  const isCurrentWeek = weekId === getCurrentWeekId();

  const dayDates = useMemo(() => {
    const start = getWeekRange(weekId).start;
    return dayOrder.map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });
  }, [weekId]);

  const tasksByCategoryDay = useMemo(() => {
    const grouped: Record<TaskCategory, Record<DayOfWeek, WeeklyTaskItem[]>> = {
      school: { 周一: [], 周二: [], 周三: [], 周四: [], 周五: [], 周六: [], 周日: [] },
      reading: { 周一: [], 周二: [], 周三: [], 周四: [], 周五: [], 周六: [], 周日: [] },
      sport: { 周一: [], 周二: [], 周三: [], 周四: [], 周五: [], 周六: [], 周日: [] },
      interest: { 周一: [], 周二: [], 周三: [], 周四: [], 周五: [], 周六: [], 周日: [] },
      ability: { 周一: [], 周二: [], 周三: [], 周四: [], 周五: [], 周六: [], 周日: [] },
      other: { 周一: [], 周二: [], 周三: [], 周四: [], 周五: [], 周六: [], 周日: [] },
    };
    tasks.forEach((task) => {
      const category = task.category || 'other';
      grouped[category][task.day].push(task);
    });
    dayOrder.forEach((day) => {
      allCategories.forEach((cat) => {
        grouped[cat][day].sort((a, b) => {
          const slotA = timeSlotOrder.indexOf(a.timeSlot || getCategoryDefaultTimeSlot(a.category));
          const slotB = timeSlotOrder.indexOf(b.timeSlot || getCategoryDefaultTimeSlot(b.category));
          if (slotA !== slotB) return slotA - slotB;
          return a.focus.localeCompare(b.focus);
        });
      });
    });
    return grouped;
  }, [tasks]);

  const activeCategories = useMemo(
    () => allCategories.filter((cat) => tasks.some((t) => (t.category || 'other') === cat)),
    [tasks]
  );

  const handleDragStart = (
    e: React.DragEvent,
    task: WeeklyTaskItem
  ) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    setDraggingTaskId(task.id);
    dragSourceRef.current = {
      taskId: task.id,
      day: task.day,
      category: task.category || 'other',
    };
    clickIgnoreRef.current = false;
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setDragOverKey(null);
    dragSourceRef.current = null;
    // Ignore the immediate click after a drag
    clickIgnoreRef.current = true;
    window.setTimeout(() => {
      clickIgnoreRef.current = false;
    }, 50);
  };

  const handleCellDragOver = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverKey(key);
  };

  const handleCellDragLeave = () => {
    setDragOverKey(null);
  };

  const handleCellDrop = (
    e: React.DragEvent,
    category: TaskCategory,
    day: DayOfWeek
  ) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || dragSourceRef.current?.taskId;
    if (!taskId) return;
    const source = dragSourceRef.current;
    if (source && source.taskId === taskId && source.day === day && source.category === category) {
      setDragOverKey(null);
      setDraggingTaskId(null);
      dragSourceRef.current = null;
      return;
    }
    onMoveTask(taskId, day, category);
    setDragOverKey(null);
    setDraggingTaskId(null);
    dragSourceRef.current = null;
  };

  const handleTaskClick = (task: WeeklyTaskItem) => {
    if (clickIgnoreRef.current) return;
    onToggleTask(task);
  };

  const cellKey = (category: TaskCategory, day: DayOfWeek) => `${category}-${day}`;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
      className="rounded-2xl bg-surface-elevated border border-border-subtle p-5"
    >
      {/* Desktop matrix */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-8 gap-3 mb-3">
            <div className="flex items-end px-3 pb-2 text-xs font-semibold text-text-muted">
              分类
            </div>
            {dayOrder.map((day, i) => {
              const isToday = isCurrentWeek && day === today;
              const ds = stats?.byDay[day];
              return (
                <div
                  key={day}
                  className={`text-center px-2 py-2.5 rounded-xl border transition-colors ${
                    isToday
                      ? 'bg-primary/[0.08] border-primary/20 text-primary'
                      : 'bg-surface-elevated border-border-subtle text-text-tertiary'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-xs font-bold">{day}</span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="text-2xs text-text-muted mt-1 tabular-nums">{dayDates[i]}</div>
                  {ds && ds.total > 0 && (
                    <div className="text-2xs text-text-tertiary mt-0.5 tabular-nums">
                      {ds.done}/{ds.total}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {activeCategories.map((category) => {
            const CategoryIcon = taskCategoryIcons[category];
            return (
              <div key={category} className="grid grid-cols-8 gap-3 mb-3 group/row">
                <div className="flex items-center gap-2.5 px-3 py-3 rounded-xl bg-surface-elevated border border-border-subtle">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCategoryColorClass(
                      category
                    )}`}
                  >
                    <CategoryIcon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-text-secondary">
                    {TASK_CATEGORY_LABELS[category]}
                  </span>
                </div>
                {dayOrder.map((day) => {
                  const cellTasks = tasksByCategoryDay[category][day];
                  const key = cellKey(category, day);
                  const isOver = dragOverKey === key;
                  return (
                    <div
                      key={day}
                      onDragOver={(e) => handleCellDragOver(e, key)}
                      onDragLeave={handleCellDragLeave}
                      onDrop={(e) => handleCellDrop(e, category, day)}
                      className={`relative min-h-[96px] rounded-xl border transition-colors duration-200 p-2.5 space-y-2 ${
                        isOver
                          ? 'bg-primary/[0.08] border-primary/30 ring-1 ring-primary/20'
                          : 'bg-surface-elevated border-border-subtle hover:border-border-strong hover:bg-surface-hover/30'
                      }`}
                    >
                      {cellTasks.length === 0 ? (
                        <div className="h-full min-h-[72px] flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity">
                          <span className="text-2xs text-text-tertiary/60">拖放到此处</span>
                        </div>
                      ) : (
                        cellTasks.map((task) => (
                          <MatrixTaskCard
                            key={task.id}
                            task={task}
                            category={category}
                            isDragging={draggingTaskId === task.id}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onClick={handleTaskClick}
                          />
                        ))
                      )}
                    </div>
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
          {dayOrder.map((day, i) => {
            const isToday = isCurrentWeek && day === today;
            const isSelected = day === matrixDay;
            const ds = stats?.byDay[day];
            return (
              <button
                key={day}
                onClick={() => setMatrixDay(day)}
                aria-pressed={isSelected}
                className={`flex-shrink-0 relative px-3 py-2 rounded-xl text-left min-w-[72px] transition-colors border focus-ring ${
                  isSelected
                    ? 'bg-surface-highlight border-primary/30'
                    : 'bg-surface-elevated border-border-subtle hover:border-border-default'
                }`}
              >
                {isToday && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
                )}
                <p className={`text-xs font-bold ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {day}
                </p>
                <p className="text-2xs text-text-muted mt-0.5 tabular-nums">{dayDates[i]}</p>
                <p className="text-2xs text-text-tertiary mt-0.5 tabular-nums">
                  {ds && ds.total > 0 ? `${ds.done}/${ds.total}` : '无任务'}
                </p>
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {activeCategories.map((category) => {
            const CategoryIcon = taskCategoryIcons[category];
            const dayTasks = tasksByCategoryDay[category][matrixDay];
            return (
              <div
                key={category}
                className="rounded-2xl bg-surface-elevated border border-border-subtle p-3.5"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCategoryColorClass(
                      category
                    )}`}
                  >
                    <CategoryIcon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-text-secondary">
                    {TASK_CATEGORY_LABELS[category]}
                  </span>
                </div>
                <div className="space-y-2">
                  {dayTasks.length === 0 ? (
                    <p className="text-xs text-text-muted py-2 text-center">当天无安排</p>
                  ) : (
                    dayTasks.map((task) => (
                      <MobileTaskRow
                        key={task.id}
                        task={task}
                        onToggle={() => onToggleTask(task)}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

interface MatrixTaskCardProps {
  task: WeeklyTaskItem;
  category: TaskCategory;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, task: WeeklyTaskItem) => void;
  onDragEnd: () => void;
  onClick: (task: WeeklyTaskItem) => void;
}

function MatrixTaskCard({
  task,
  category,
  isDragging,
  onDragStart,
  onDragEnd,
  onClick,
}: MatrixTaskCardProps) {
  const done = task.status === 'done';
  const CategoryIcon = taskCategoryIcons[category];
  const timeSlotLabel = getTimeSlotLabel(
    task.timeSlot || getCategoryDefaultTimeSlot(task.category)
  );

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      onClick={() => onClick(task)}
      role="button"
      aria-label={`${TASK_CATEGORY_LABELS[category]} ${task.day}：${task.focus}，${task.duration}，点击${
        done ? '取消完成' : '标记完成'
      }`}
      className={`group relative flex items-start gap-2 px-2 py-2 rounded-xl border cursor-grab active:cursor-grabbing transition-colors duration-200 ${
        done
          ? 'bg-success/[0.08] border-success/20 opacity-80'
          : 'bg-surface-hover/40 border-border-subtle hover:border-border-strong'
      } ${isDragging ? 'opacity-40 scale-[0.98]' : ''}`}
    >
      <div
        className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${getCategoryColorClass(
          category
        )}`}
      >
        <CategoryIcon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center gap-1 min-w-0">
            <span className={`shrink-0 text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap ${done ? 'bg-surface-elevated text-text-muted' : 'bg-primary/10 text-primary'} tabular-nums`}>
              {timeSlotLabel}
            </span>
            <span className={`shrink-0 text-2xs ${done ? 'text-text-muted' : 'text-text-tertiary'}`}>
              {task.duration}
            </span>
          </div>
          {done && <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />}
        </div>
        <p
          className={`text-xs font-medium truncate ${
            done ? 'text-text-muted line-through' : 'text-text-secondary'
          }`}
          title={task.focus}
        >
          {task.focus}
        </p>
        {task.materials.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {task.materials.slice(0, 3).map((m) => (
              <span
                key={m}
                className="text-[9px] px-1.5 py-0.5 rounded bg-surface-elevated text-text-muted truncate max-w-[80px]"
                title={m}
              >
                {m}
              </span>
            ))}
            {task.materials.length > 3 && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface-elevated text-text-muted">
                +{task.materials.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
      <GripVertical className="w-4 h-4 text-text-tertiary/40 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

interface MobileTaskRowProps {
  task: WeeklyTaskItem;
  onToggle: () => void;
}

function MobileTaskRow({ task, onToggle }: MobileTaskRowProps) {
  const done = task.status === 'done';
  const timeSlotLabel = getTimeSlotLabel(
    task.timeSlot || getCategoryDefaultTimeSlot(task.category)
  );
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors text-left ${
        done
          ? 'bg-success/[0.08] border-success/20'
          : 'bg-surface-hover/40 border-border-subtle hover:border-border-strong'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p
            className={`text-xs font-medium truncate ${
              done ? 'text-text-muted line-through' : 'text-text-secondary'
            }`}
            title={task.focus}
          >
            {task.focus}
          </p>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <span className={`text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap ${done ? 'bg-surface-elevated text-text-muted' : 'bg-primary/10 text-primary'} tabular-nums`}>
              {timeSlotLabel}
            </span>
            <span className="text-2xs px-1.5 py-0.5 rounded bg-surface-elevated text-text-tertiary whitespace-nowrap">
              {task.duration}
            </span>
          </div>
        </div>
        {task.materials.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {task.materials.slice(0, 3).map((m) => (
              <span
                key={m}
                className="text-2xs px-1.5 py-0.5 rounded bg-surface-elevated text-text-muted"
              >
                {m}
              </span>
            ))}
          </div>
        )}
      </div>
      {done && <CheckCircle2 className="w-5 h-5 text-success shrink-0" />}
    </button>
  );
}
