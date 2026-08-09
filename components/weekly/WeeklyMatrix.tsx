'use client';

import { useMemo, useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import Button from '@/components/ui/button';

import {
  type WeeklyTaskItem,
  type TaskCategory,
  type DayOfWeek,
  type TimeSlot,
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

const allCategories: TaskCategory[] = ['school', 'reading', 'sport', 'interest', 'ability', 'other'];

interface WeeklyMatrixProps {
  tasks: WeeklyTaskItem[];
  weekId: string;
  today: DayOfWeek;
  stats: PlanStats | null;
  onToggleTask: (task: WeeklyTaskItem) => void;
  onMoveTask: (
    taskId: string,
    targetDay: DayOfWeek,
    targetCategory: TaskCategory,
    targetTimeSlot?: TimeSlot
  ) => void;
  batchMode?: boolean;
  selectedIds?: string[];
  onToggleSelection?: (taskId: string) => void;
}

export default function WeeklyMatrix({
  tasks,
  weekId,
  today,
  stats,
  onToggleTask,
  onMoveTask,
  batchMode = false,
  selectedIds = [],
  onToggleSelection,
}: WeeklyMatrixProps) {
  const shouldReduceMotion = useReducedMotion();
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [matrixDay, setMatrixDay] = useState<DayOfWeek>(today);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const dragSourceRef = useRef<{ taskId: string; day: DayOfWeek; category: TaskCategory } | null>(
    null
  );
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

  const tasksByDaySlot = useMemo(() => {
    const grouped: Record<DayOfWeek, Record<TimeSlot, WeeklyTaskItem[]>> = {} as Record<
      DayOfWeek,
      Record<TimeSlot, WeeklyTaskItem[]>
    >;
    dayOrder.forEach((day) => {
      grouped[day] = {} as Record<TimeSlot, WeeklyTaskItem[]>;
      timeSlotOrder.forEach((slot) => {
        grouped[day][slot] = [];
      });
    });
    tasks.forEach((task) => {
      const slot = task.timeSlot || getCategoryDefaultTimeSlot(task.category);
      if (!grouped[task.day][slot]) grouped[task.day][slot] = [];
      grouped[task.day][slot].push(task);
    });
    dayOrder.forEach((day) => {
      timeSlotOrder.forEach((slot) => {
        grouped[day][slot].sort((a, b) => {
          if (a.category !== b.category) return a.category.localeCompare(b.category);
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

  const visibleSlots = timeSlotOrder;

  const handleDragStart = (e: React.DragEvent, task: WeeklyTaskItem) => {
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
    clickIgnoreRef.current = true;
    window.setTimeout(() => {
      clickIgnoreRef.current = false;
    }, 50);
  };

  const handleDragOver = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverKey(key);
  };

  const handleDragLeave = () => {
    setDragOverKey(null);
  };

  const resetDragState = () => {
    setDragOverKey(null);
    setDraggingTaskId(null);
    dragSourceRef.current = null;
  };

  const handleCellDrop = (e: React.DragEvent, category: TaskCategory, day: DayOfWeek) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || dragSourceRef.current?.taskId;
    if (!taskId) return;
    const source = dragSourceRef.current;
    if (source && source.taskId === taskId && source.day === day && source.category === category) {
      resetDragState();
      return;
    }
    onMoveTask(taskId, day, category);
    resetDragState();
  };

  const handleTimeSlotDrop = (e: React.DragEvent, day: DayOfWeek, slot: TimeSlot) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || dragSourceRef.current?.taskId;
    const source = dragSourceRef.current;
    if (!taskId || !source) return;
    onMoveTask(taskId, day, source.category, slot);
    resetDragState();
  };

  const handleDayButtonDrop = (e: React.DragEvent, day: DayOfWeek) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || dragSourceRef.current?.taskId;
    const source = dragSourceRef.current;
    if (!taskId || !source) return;
    if (source.day === day) {
      resetDragState();
      return;
    }
    onMoveTask(taskId, day, source.category);
    resetDragState();
  };

  const handleTaskClick = (task: WeeklyTaskItem) => {
    if (clickIgnoreRef.current) return;
    if (batchMode) {
      onToggleSelection?.(task.id);
      return;
    }
    onToggleTask(task);
  };

  const cellKey = (category: TaskCategory, day: DayOfWeek) => `${category}-${day}`;
  const slotKey = (slot: TimeSlot) => `slot-${slot}`;
  const dayButtonKey = (day: DayOfWeek) => `day-${day}`;

  const isSelected = (taskId: string) => selectedIds.includes(taskId);

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
      className="rounded-2xl border border-border-subtle bg-surface-elevated p-5"
    >
      {/* View toggle */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex items-center gap-1 rounded-xl border border-border-subtle bg-surface p-1">
          <Button
            type="button"
            variant={viewMode === 'week' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('week')}
            className={`rounded-lg px-3 py-1.5 text-xs ${
              viewMode === 'week' ? 'text-text-primary' : 'text-text-tertiary'
            }`}
          >
            <Icon name="Grid3X3" size="xs" className="mr-1" />
            周视图
          </Button>
          <Button
            type="button"
            variant={viewMode === 'day' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('day')}
            className={`rounded-lg px-3 py-1.5 text-xs ${
              viewMode === 'day' ? 'text-text-primary' : 'text-text-tertiary'
            }`}
          >
            <Icon name="Clock" size="xs" className="mr-1" />
            日视图
          </Button>
        </div>
        <p className="text-xs text-text-muted">
          {viewMode === 'week'
            ? '拖拽任务可快速调整日期和分类'
            : '拖拽任务到不同时段或日期，安排当天节奏'}
        </p>
      </div>

      {viewMode === 'week' ? (
        <>
          {/* Desktop matrix */}
          <div className="hidden overflow-x-auto lg:block">
            <div className="min-w-[900px]">
              <div className="mb-3 grid grid-cols-8 gap-3">
                <div className="flex items-end px-3 pb-2 text-xs font-semibold text-text-muted">
                  分类
                </div>
                {dayOrder.map((day, i) => {
                  const isToday = isCurrentWeek && day === today;
                  const ds = stats?.byDay[day];
                  return (
                    <div
                      key={day}
                      className={`rounded-xl border px-2 py-2.5 text-center transition-colors ${
                        isToday
                          ? 'border-primary/20 bg-primary/[0.08] text-primary'
                          : 'border-border-subtle bg-surface-elevated text-text-tertiary'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-xs font-bold">{day}</span>
                        {isToday && <span className="size-1.5 rounded-full bg-primary" />}
                      </div>
                      <div className="mt-1 text-2xs tabular-nums text-text-muted">{dayDates[i]}</div>
                      {ds && ds.total > 0 && (
                        <div className="mt-0.5 text-2xs tabular-nums text-text-tertiary">
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
                  <div key={category} className="group/row mb-3 grid grid-cols-8 gap-3">
                    <div className="flex items-center gap-2.5 rounded-xl border border-border-subtle bg-surface-elevated p-3">
                      <div
                        className={`flex size-8 items-center justify-center rounded-lg ${getCategoryColorClass(
                          category
                        )}`}
                      >
                        <CategoryIcon className="size-4" />
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
                          onDragOver={(e) => handleDragOver(e, key)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleCellDrop(e, category, day)}
                          className={`relative min-h-[96px] space-y-2 rounded-xl border p-2.5 transition-colors duration-200 ${
                            isOver
                              ? 'border-primary/30 bg-primary/[0.08] ring-1 ring-primary/20'
                              : 'border-border-subtle bg-surface-elevated hover:border-border-strong hover:bg-surface-hover/30'
                          }`}
                        >
                          {cellTasks.length === 0 ? (
                            <div className="flex h-full min-h-[72px] items-center justify-center opacity-0 transition-opacity group-hover/row:opacity-100">
                              <span className="text-2xs text-text-tertiary/60">拖放到此处</span>
                            </div>
                          ) : (
                            cellTasks.map((task) => (
                              <MatrixTaskCard
                                key={task.id}
                                task={task}
                                category={category}
                                isDragging={draggingTaskId === task.id}
                                batchMode={batchMode}
                                selected={isSelected(task.id)}
                                onToggleSelection={onToggleSelection}
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
          <div className="space-y-4 lg:hidden">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {dayOrder.map((day, i) => {
                const isToday = isCurrentWeek && day === today;
                const isSelected = day === matrixDay;
                const ds = stats?.byDay[day];
                const key = dayButtonKey(day);
                const isOver = dragOverKey === key;
                return (
                  <div
                    key={day}
                    role="button"
                    tabIndex={0}
                    onClick={() => setMatrixDay(day)}
                    onDragOver={(e) => handleDragOver(e, key)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDayButtonDrop(e, day)}
                    className={`relative min-w-[72px] flex-shrink-0 cursor-pointer rounded-xl border px-3 py-2 text-left transition-colors ${
                      isSelected
                        ? 'border-primary/30 bg-surface-highlight'
                        : isOver
                          ? 'border-primary/30 bg-primary/[0.08]'
                          : 'border-border-subtle bg-surface-elevated hover:border-border-default'
                    }`}
                  >
                    {isToday && (
                      <span className="absolute -right-1 -top-1 size-2 rounded-full bg-primary ring-2 ring-background" />
                    )}
                    <p
                      className={`text-xs font-bold ${
                        isSelected ? 'text-text-primary' : 'text-text-secondary'
                      }`}
                    >
                      {day}
                    </p>
                    <p className="mt-0.5 text-2xs tabular-nums text-text-muted">{dayDates[i]}</p>
                    <p className="mt-0.5 text-2xs tabular-nums text-text-tertiary">
                      {ds && ds.total > 0 ? `${ds.done}/${ds.total}` : '无任务'}
                    </p>
                  </div>
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
                    className="rounded-2xl border border-border-subtle bg-surface-elevated p-3.5"
                  >
                    <div className="mb-3 flex items-center gap-2.5">
                      <div
                        className={`flex size-8 items-center justify-center rounded-lg ${getCategoryColorClass(
                          category
                        )}`}
                      >
                        <CategoryIcon className="size-4" />
                      </div>
                      <span className="text-sm font-semibold text-text-secondary">
                        {TASK_CATEGORY_LABELS[category]}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {dayTasks.length === 0 ? (
                        <p className="py-2 text-center text-xs text-text-muted">当天无安排</p>
                      ) : batchMode ? (
                        dayTasks.map((task) => (
                          <MatrixTaskCard
                            key={task.id}
                            task={task}
                            category={category}
                            isDragging={draggingTaskId === task.id}
                            batchMode={batchMode}
                            selected={isSelected(task.id)}
                            onToggleSelection={onToggleSelection}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onClick={handleTaskClick}
                          />
                        ))
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
        </>
      ) : (
        /* Day view */
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {dayOrder.map((day, i) => {
              const isToday = isCurrentWeek && day === today;
              const isSelected = day === matrixDay;
              const ds = stats?.byDay[day];
              const key = dayButtonKey(day);
              const isOver = dragOverKey === key;
              return (
                <div
                  key={day}
                  role="button"
                  tabIndex={0}
                  onClick={() => setMatrixDay(day)}
                  onDragOver={(e) => handleDragOver(e, key)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDayButtonDrop(e, day)}
                  className={`relative min-w-[72px] flex-shrink-0 cursor-pointer rounded-xl border px-3 py-2 text-left transition-colors ${
                    isSelected
                      ? 'border-primary/30 bg-surface-highlight'
                      : isOver
                        ? 'border-primary/30 bg-primary/[0.08]'
                        : 'border-border-subtle bg-surface-elevated hover:border-border-default'
                  }`}
                >
                  {isToday && (
                    <span className="absolute -right-1 -top-1 size-2 rounded-full bg-primary ring-2 ring-background" />
                  )}
                  <p
                    className={`text-xs font-bold ${
                      isSelected ? 'text-text-primary' : 'text-text-secondary'
                    }`}
                  >
                    {day}
                  </p>
                  <p className="mt-0.5 text-2xs tabular-nums text-text-muted">{dayDates[i]}</p>
                  <p className="mt-0.5 text-2xs tabular-nums text-text-tertiary">
                    {ds && ds.total > 0 ? `${ds.done}/${ds.total}` : '无任务'}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            {visibleSlots.map((slot) => {
              const slotTasks = tasksByDaySlot[matrixDay][slot];
              const key = slotKey(slot);
              const isOver = dragOverKey === key;
              return (
                <div
                  key={slot}
                  className="grid grid-cols-[88px_1fr] gap-3 sm:grid-cols-[120px_1fr]"
                >
                  <div className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-surface-elevated py-3 text-center">
                    <span className="text-xs font-semibold text-text-secondary">
                      {getTimeSlotLabel(slot)}
                    </span>
                    <span className="mt-0.5 text-2xs text-text-muted">
                      {slotTasks.length} 项
                    </span>
                  </div>
                  <div
                    onDragOver={(e) => handleDragOver(e, key)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleTimeSlotDrop(e, matrixDay, slot)}
                    className={`min-h-[80px] space-y-2 rounded-xl border p-2.5 transition-colors duration-200 ${
                      isOver
                        ? 'border-primary/30 bg-primary/[0.08] ring-1 ring-primary/20'
                        : 'border-border-subtle bg-surface-elevated hover:border-border-strong hover:bg-surface-hover/30'
                    }`}
                  >
                    {slotTasks.length === 0 ? (
                      <div className="flex h-full min-h-[56px] items-center justify-center">
                        <span className="text-2xs text-text-tertiary/60">拖放到此处</span>
                      </div>
                    ) : (
                      slotTasks.map((task) => (
                        <MatrixTaskCard
                          key={task.id}
                          task={task}
                          category={task.category}
                          isDragging={draggingTaskId === task.id}
                          showTimeSlot={false}
                          batchMode={batchMode}
                          selected={isSelected(task.id)}
                          onToggleSelection={onToggleSelection}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          onClick={handleTaskClick}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

interface MatrixTaskCardProps {
  task: WeeklyTaskItem;
  category: TaskCategory;
  isDragging: boolean;
  showTimeSlot?: boolean;
  batchMode?: boolean;
  selected?: boolean;
  onToggleSelection?: (taskId: string) => void;
  onDragStart: (e: React.DragEvent, task: WeeklyTaskItem) => void;
  onDragEnd: () => void;
  onClick: (task: WeeklyTaskItem) => void;
}

function MatrixTaskCard({
  task,
  category,
  isDragging,
  showTimeSlot = true,
  batchMode = false,
  selected = false,
  onToggleSelection,
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
      className={`group relative flex cursor-grab items-start gap-2 rounded-xl border p-2 transition-colors duration-200 active:cursor-grabbing ${
        done
          ? 'border-success/20 bg-success/[0.08] opacity-80'
          : 'border-border-subtle bg-surface-hover/40 hover:border-border-strong'
      } ${isDragging ? 'scale-[0.98] opacity-40' : ''}`}
    >
      {batchMode && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelection?.(task.id);
          }}
          className="mt-0.5 flex shrink-0 items-center"
        >
          <div
            className={`flex size-4 items-center justify-center rounded border transition-colors ${
              selected
                ? 'border-primary bg-primary'
                : 'border-text-tertiary bg-surface hover:border-primary/50'
            }`}
          >
            {selected && <Icon name="Check" size="xs" className="text-text-primary" />}
          </div>
        </div>
      )}
      <div
        className={`flex size-5 shrink-0 items-center justify-center rounded-lg ${getCategoryColorClass(
          category
        )}`}
      >
        <CategoryIcon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-1">
          <div className="flex min-w-0 items-center gap-1">
            {showTimeSlot && (
              <span
                className={`shrink-0 whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] tabular-nums ${
                  done ? 'bg-surface-elevated text-text-muted' : 'bg-primary/10 text-primary'
                }`}
              >
                {timeSlotLabel}
              </span>
            )}
            <span className={`shrink-0 text-2xs ${done ? 'text-text-muted' : 'text-text-tertiary'}`}>
              {task.duration}
            </span>
          </div>
          {done && <Icon name="CheckCircle2" size="xs" className="shrink-0 text-success" />}
        </div>
        <p
          className={`truncate text-xs font-medium ${
            done ? 'text-text-muted line-through' : 'text-text-secondary'
          }`}
          title={task.focus}
        >
          {task.focus}
        </p>
        {task.materials.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {task.materials.slice(0, 3).map((m) => (
              <span
                key={m}
                className="max-w-[80px] truncate rounded bg-surface-elevated px-1.5 py-0.5 text-[9px] text-text-muted"
                title={m}
              >
                {m}
              </span>
            ))}
            {task.materials.length > 3 && (
              <span className="rounded bg-surface-elevated px-1.5 py-0.5 text-[9px] text-text-muted">
                +{task.materials.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
      {!batchMode && (
        <Icon
          name="GripVertical"
          size="sm"
          className="mt-0.5 shrink-0 text-text-tertiary/40 opacity-0 transition-opacity group-hover:opacity-100"
        />
      )}
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
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
        done
          ? 'border-success/20 bg-success/[0.08]'
          : 'border-border-subtle bg-surface-hover/40 hover:border-border-strong'
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between">
          <p
            className={`truncate text-xs font-medium ${
              done ? 'text-text-muted line-through' : 'text-text-secondary'
            }`}
            title={task.focus}
          >
            {task.focus}
          </p>
          <div className="ml-2 flex shrink-0 items-center gap-1">
            <span
              className={`whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] tabular-nums ${
                done ? 'bg-surface-elevated text-text-muted' : 'bg-primary/10 text-primary'
              }`}
            >
              {timeSlotLabel}
            </span>
            <span className="whitespace-nowrap rounded bg-surface-elevated px-1.5 py-0.5 text-2xs text-text-tertiary">
              {task.duration}
            </span>
          </div>
        </div>
        {task.materials.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {task.materials.slice(0, 3).map((m) => (
              <span
                key={m}
                className="rounded bg-surface-elevated px-1.5 py-0.5 text-2xs text-text-muted"
              >
                {m}
              </span>
            ))}
          </div>
        )}
      </div>
      {done && <Icon name="CheckCircle2" size="md" className="shrink-0 text-success" />}
    </Button>
  );
}
