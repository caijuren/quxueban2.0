'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/ui/icon';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/textarea';
import EmptyState from '@/components/ui/EmptyState';
import {
  type WeeklyPlan,
  type WeeklyTaskItem,
  type WeeklyGoal,
  type TaskStatus,
  type DayOfWeek,
  type TaskCategory,
  type TimeSlot,
} from '@/lib/storage.types';
import { dayOrder, parseDurationMinutes, getTimeSlotLabel, timeSlotOrder } from '@/lib/weeklyTasks';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import { categoryIcons, allCategories } from './weeklyConstants';
import { UnsavedPrompt } from './UnsavedPrompt';

const durationPresets = ['15分钟', '20分钟', '30分钟', '45分钟', '60分钟'];

interface EditPlanModalProps {
  plan: WeeklyPlan;
  onClose: () => void;
  onSave: (tasks: WeeklyTaskItem[], goals: WeeklyGoal[]) => void;
}

export function EditPlanModal({ plan, onClose, onSave }: EditPlanModalProps) {
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
              className={`flex-1 ${
                activeTab === 'tasks'
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
              className={`flex-1 ${
                activeTab === 'goals'
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
                <Button variant="secondary" size="sm" onClick={addGoal}>
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
                        <Input
                          type="text"
                          value={goal.title}
                          onChange={(e) => updateGoal(goal.id, { title: e.target.value })}
                          placeholder="例如：阅读精读"
                          size="sm"
                          className="bg-surface"
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
                        <Input
                          type="number"
                          min={0}
                          value={goal.quantityTarget ?? 0}
                          onChange={(e) =>
                            updateGoal(goal.id, {
                              quantityTarget: parseInt(e.target.value || '0', 10),
                            })
                          }
                          size="sm"
                          className="bg-surface"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="mb-1 block text-2xs text-text-muted">单位</label>
                        <Input
                          type="text"
                          value={goal.quantityUnit ?? ''}
                          onChange={(e) => updateGoal(goal.id, { quantityUnit: e.target.value })}
                          placeholder="篇/首"
                          size="sm"
                          className="bg-surface"
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
                            <Input
                              type="text"
                              value={item.text}
                              onChange={(e) =>
                                updateGoalChecklistItem(goal.id, item.id, e.target.value)
                              }
                              placeholder="例如：《朝花夕拾》精读第二章"
                              size="sm"
                              className="flex-1 bg-surface"
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
          <Input
            type="text"
            value={task.focus}
            onChange={(e) => onUpdate(task.id, { focus: e.target.value })}
            placeholder="例如：古诗新学"
            size="sm"
            className="bg-surface"
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
          <Input
            type="text"
            value={task.duration}
            onChange={(e) => onUpdate(task.id, { duration: e.target.value })}
            placeholder="30分钟"
            size="sm"
            className="bg-surface"
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

        <div className="col-span-4 flex items-end justify-end gap-2 sm:col-span-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={onToggleCopy}
            className={`rounded-lg px-2 ${
              isCopying
                ? 'bg-primary/[0.08] text-primary'
                : 'text-text-muted hover:bg-surface-highlight hover:text-text-secondary'
            }`}
            leftIcon={<Icon name="Copy" size="xs" />}
          >
            复制
          </Button>
          <Button
            variant="danger"
            size="xs"
            onClick={() => onDelete(task.id)}
            className="rounded-lg px-2"
            leftIcon={<Icon name="Trash2" size="xs" />}
          >
            删除
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
