'use client';

import { useMemo, useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  CheckCircle2,
  BookOpen,
  Backpack,
  Dumbbell,
  Palette,
  GraduationCap,
  Trophy,
  GripVertical,
} from 'lucide-react';
import {
  type WeeklyTaskItem,
  type TaskCategory,
  type DayOfWeek,
} from '@/lib/storage.types';
import { type PlanStats, dayOrder, getCurrentWeekId } from '@/lib/weeklyTasks';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { getCategoryColorClass } from '@/lib/taskAlignment';

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
        grouped[cat][day].sort((a, b) => a.focus.localeCompare(b.focus));
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
      className="rounded-2xl glass p-5"
    >
      {/* Desktop matrix */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="text-xs text-slate-500 font-medium px-3 py-2">分类</div>
            {dayOrder.map((day) => {
              const isToday = isCurrentWeek && day === today;
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

          {activeCategories.map((category) => {
            const CategoryIcon = categoryIcons[category];
            return (
              <div key={category} className="grid grid-cols-8 gap-2 mb-2">
                <div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-white/5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${getCategoryColorClass(
                      category
                    )}`}
                  >
                    <CategoryIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">
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
                      className={`relative min-h-[80px] rounded-xl border transition-all p-2 space-y-2 ${
                        isOver
                          ? 'bg-secondary/10 border-secondary/40'
                          : 'bg-white/[0.03] border-white/[0.06]'
                      }`}
                    >
                      {cellTasks.length === 0 ? (
                        <div className="h-full min-h-[64px] flex items-center justify-center">
                          <span className="text-[10px] text-slate-600">拖放到此处</span>
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
        <div className="flex gap-1.5 overflow-x-auto pb-2">
          {dayOrder.map((day) => {
            const isToday = isCurrentWeek && day === today;
            const isSelected = day === matrixDay;
            const ds = stats?.byDay[day];
            return (
              <button
                key={day}
                onClick={() => setMatrixDay(day)}
                aria-pressed={isSelected}
                className={`flex-shrink-0 relative px-3 py-2 rounded-lg text-left min-w-[68px] transition-all border focus-ring ${
                  isSelected
                    ? 'bg-white/[0.08] border-primary/30'
                    : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
                }`}
              >
                {isToday && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary shadow-glow-primary" />
                )}
                <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {day}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5 tabular-nums">
                  {ds && ds.total > 0 ? `${ds.done}/${ds.total}` : '无任务'}
                </p>
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          {activeCategories.map((category) => {
            const CategoryIcon = categoryIcons[category];
            const dayTasks = tasksByCategoryDay[category][matrixDay];
            return (
              <div
                key={category}
                className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${getCategoryColorClass(
                      category
                    )}`}
                  >
                    <CategoryIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">
                    {TASK_CATEGORY_LABELS[category]}
                  </span>
                </div>
                <div className="space-y-2">
                  {dayTasks.length === 0 ? (
                    <p className="text-xs text-slate-600 py-1">当天无安排</p>
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
      className={`group relative flex items-start gap-1.5 px-2 py-1.5 rounded-lg border cursor-pointer transition-all ${
        done
          ? 'bg-success/10 border-success/20 opacity-70'
          : 'bg-white/5 border-white/5 hover:bg-white/[0.07]'
      } ${isDragging ? 'opacity-40' : ''}`}
    >
      <GripVertical className="w-3 h-3 text-slate-600 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className="text-[10px] text-slate-500">{task.duration}</span>
          {done && <CheckCircle2 className="w-3 h-3 text-success shrink-0" />}
        </div>
        <p
          className={`text-xs font-medium truncate ${
            done ? 'text-slate-500 line-through' : 'text-slate-200'
          }`}
        >
          {task.focus}
        </p>
      </div>
    </div>
  );
}

interface MobileTaskRowProps {
  task: WeeklyTaskItem;
  onToggle: () => void;
}

function MobileTaskRow({ task, onToggle }: MobileTaskRowProps) {
  const done = task.status === 'done';
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left ${
        done
          ? 'bg-success/10 border-success/20 active:scale-[0.99]'
          : 'bg-white/5 border-white/5 active:scale-[0.99]'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p
            className={`text-xs font-medium ${
              done ? 'text-slate-500 line-through' : 'text-slate-200'
            }`}
          >
            {task.focus}
          </p>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-300 shrink-0 ml-2">
            {task.duration}
          </span>
        </div>
        {task.materials.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {task.materials.slice(0, 3).map((m) => (
              <span
                key={m}
                className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500"
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
