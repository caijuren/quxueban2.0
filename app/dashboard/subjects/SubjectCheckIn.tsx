'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/ui/icon';

export interface CheckInTask {
  id: string;
  label: string;
  duration?: string;
}

interface SubjectCheckInProps {
  childId: string;
  subject: 'english' | 'math' | 'chinese';
  tasks: CheckInTask[];
  title?: string;
  subtitle?: string;
}

interface CheckInData {
  [childId: string]: {
    [subject: string]: {
      [date: string]: string[];
    };
  };
}

const STORAGE_KEY = 'subject-checkins';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function loadData(): CheckInData {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveData(data: CheckInData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getStreak(data: CheckInData, childId: string, subject: string): number {
  const subjectData = data[childId]?.[subject] || {};
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const completed = subjectData[dateStr] || [];
    if (completed.length > 0) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

export default function SubjectCheckIn({
  childId,
  subject,
  tasks,
  title = '今日打卡',
  subtitle = '完成任务后勾选，养成持续学习习惯',
}: SubjectCheckInProps) {
  const [data, setData] = useState<CheckInData>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setData(loadData());
    setMounted(true);
  }, []);

  const today = getTodayStr();
  const completed = useMemo(
    () => data[childId]?.[subject]?.[today] || [],
    [data, childId, subject, today]
  );
  const streak = useMemo(
    () => (mounted ? getStreak(data, childId, subject) : 0),
    [data, childId, subject, mounted]
  );

  const toggleTask = (taskId: string) => {
    const next = { ...data };
    if (!next[childId]) next[childId] = {};
    if (!next[childId][subject]) next[childId][subject] = {};
    if (!next[childId][subject][today]) next[childId][subject][today] = [];

    const list = next[childId][subject][today];
    if (list.includes(taskId)) {
      next[childId][subject][today] = list.filter((id) => id !== taskId);
    } else {
      next[childId][subject][today] = [...list, taskId];
    }

    setData(next);
    saveData(next);
  };

  const progress = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-2xl border border-border-subtle bg-surface-elevated p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-success to-accent">
            <Icon name="CheckCircle2" size="md" className="text-text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">{title}</h2>
            <p className="text-sm text-text-tertiary">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-text-muted">连续打卡</p>
            <p className="flex items-center justify-end gap-1 text-lg font-bold text-orange-400">
              <Icon name="Flame" size="sm" className="text-orange-400" />
              {streak} 天
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted">今日进度</p>
            <p className="text-lg font-bold text-success">{progress}%</p>
          </div>
        </div>
      </div>

      <div className="mb-5 h-2 overflow-hidden rounded-full bg-surface-highlight">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-full bg-gradient-to-r from-success to-accent"
        />
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {tasks.map((task) => {
            const isDone = completed.includes(task.id);
            return (
              <motion.button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                whileTap={{ scale: 0.98 }}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${
                  isDone
                    ? 'bg-success/10 border-success/30'
                    : 'border-border-subtle bg-surface-elevated hover:bg-surface-elevated'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isDone ? (
                    <Icon name="CheckCircle2" size="md" className="text-success" />
                  ) : (
                    <Icon name="Circle" size="md" className="text-text-muted" />
                  )}
                  <span
                    className={`text-sm ${isDone ? 'text-success line-through' : 'text-text-secondary'}`}
                  >
                    {task.label}
                  </span>
                </div>
                {task.duration && <span className="text-xs text-text-muted">{task.duration}</span>}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="from-success/20 border-success/20 mt-5 flex items-center gap-3 rounded-xl border bg-gradient-to-r to-accent/10 p-4"
        >
          <Icon name="Trophy" size="md" className="text-success" />
          <p className="text-sm text-success">今日任务全部完成！继续保持。</p>
        </motion.div>
      )}
    </motion.div>
  );
}
