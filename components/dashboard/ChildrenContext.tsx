'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { Child, getDefaultChildren, AVATAR_COLORS } from '@/lib/children';
import { type WeeklyPlan, type TaskStatus, type WeeklyGoal } from '@/lib/storage.types';
import { generateWeeklyPlan, getCurrentWeekId } from '@/lib/weeklyTasks';
import {
  useChildren as useChildrenQuery,
  useCreateChild,
  useUpdateChild,
  useDeleteChild,
} from '@/lib/hooks/useChildren';
import { useWeeklyPlans, useSaveWeeklyPlan, useDeleteWeeklyPlan } from '@/lib/hooks/useWeeklyPlans';

interface ChildrenContextValue {
  children: Child[];
  currentChild: Child | null;
  currentChildId: string | null;
  weeklyPlans: WeeklyPlan[];
  setCurrentChildId: (id: string) => void;
  addChild: (child: Omit<Child, 'id'>) => Promise<void>;
  updateChild: (id: string, updates: Partial<Omit<Child, 'id'>>) => Promise<void>;
  removeChild: (id: string) => Promise<void>;
  getWeeklyPlan: (weekId: string, childId: string) => WeeklyPlan | undefined;
  generateWeeklyPlanDraft: (child: Child, weekId?: string) => WeeklyPlan;
  publishWeeklyPlan: (plan: WeeklyPlan) => Promise<void>;
  updateTaskStatus: (
    childId: string,
    weekId: string,
    taskId: string,
    status: TaskStatus,
    note?: string
  ) => Promise<void>;
  reviewWeeklyPlan: (childId: string, weekId: string, comment: string) => Promise<void>;
  deleteWeeklyPlan: (childId: string, weekId: string) => Promise<void>;
}

const ChildrenContext = createContext<ChildrenContextValue | undefined>(undefined);

const CURRENT_CHILD_ID_KEY = 'quxueban_current_child_id';

export function ChildrenProvider({ children: childNodes }: { children: ReactNode }) {
  const { data: children = [], isLoading } = useChildrenQuery();
  const { data: weeklyPlansData = [] } = useWeeklyPlans();
  const createChild = useCreateChild();
  const updateChildMutation = useUpdateChild();
  const deleteChildMutation = useDeleteChild();
  const savePlan = useSaveWeeklyPlan();
  const deletePlan = useDeleteWeeklyPlan();

  const [currentChildId, setCurrentChildIdState] = useState<string | null>(null);
  const seedAttempted = useRef(false);

  // Load currentChildId from localStorage (UI preference)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(CURRENT_CHILD_ID_KEY);
    if (saved) setCurrentChildIdState(saved);
  }, []);

  // Persist currentChildId to localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || currentChildId === null) return;
    localStorage.setItem(CURRENT_CHILD_ID_KEY, currentChildId);
  }, [currentChildId]);

  // Seed default children for brand-new users
  useEffect(() => {
    if (isLoading || children.length > 0 || seedAttempted.current) return;
    seedAttempted.current = true;

    const defaults = getDefaultChildren();
    (async () => {
      for (const child of defaults) {
        try {
          await createChild.mutateAsync(child);
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[ChildrenProvider] Failed to seed default child:', err);
          }
        }
      }
    })();
  }, [isLoading, children.length, createChild]);

  // Ensure currentChildId points to an existing child after data loads
  useEffect(() => {
    if (isLoading) return;
    if (children.length === 0) {
      setCurrentChildIdState(null);
      return;
    }
    if (!children.some((c) => c.id === currentChildId)) {
      setCurrentChildIdState(children[0].id);
    }
  }, [isLoading, children, currentChildId]);

  const setCurrentChildId = (id: string) => {
    if (!children.some((c) => c.id === id)) return;
    setCurrentChildIdState(id);
  };

  const addChild = async (child: Omit<Child, 'id'>) => {
    const newChild = await createChild.mutateAsync(child);
    setCurrentChildIdState(newChild.id);
  };

  const updateChild = async (id: string, updates: Partial<Omit<Child, 'id'>>) => {
    await updateChildMutation.mutateAsync({ id, data: updates });
  };

  const removeChild = async (id: string) => {
    await deleteChildMutation.mutateAsync(id);
    if (currentChildId === id) {
      const remaining = children.filter((c) => c.id !== id);
      setCurrentChildIdState(remaining[0]?.id ?? null);
    }
  };

  const weeklyPlans = weeklyPlansData;

  const getWeeklyPlan = (weekId: string, childId: string) =>
    weeklyPlans.find((p) => p.weekId === weekId && p.childId === childId);

  const generateWeeklyPlanDraft = (child: Child, weekId?: string) =>
    generateWeeklyPlan(child, weekId ?? getCurrentWeekId());

  const publishWeeklyPlan = async (plan: WeeklyPlan) => {
    await savePlan.mutateAsync({
      childId: plan.childId,
      weekId: plan.weekId,
      tasks: plan.tasks,
      goals: plan.goals ?? [],
      publishedAt: plan.publishedAt ?? new Date().toISOString(),
      reviewedAt: plan.reviewedAt,
      parentComment: plan.reviewComment,
      aiSummary: plan.aiSummary,
      aiSummaryGeneratedAt: plan.aiSummaryGeneratedAt,
    });
  };

  const updateTaskStatus = async (
    childId: string,
    weekId: string,
    taskId: string,
    status: TaskStatus,
    note?: string
  ) => {
    const plan = weeklyPlans.find((p) => p.weekId === weekId && p.childId === childId);
    if (!plan) throw new Error('Weekly plan not found');

    const task = plan.tasks.find((t) => t.id === taskId);
    const wasDone = task?.status === 'done';
    const isDone = status === 'done';

    const updatedTasks = plan.tasks.map((t) => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        status,
        completedAt: status === 'done' ? new Date().toISOString() : undefined,
        note: note !== undefined ? note : t.note,
      };
    });

    let updatedGoals = plan.goals ?? [];
    if (task?.goalId && wasDone !== isDone) {
      updatedGoals = updatedGoals.map((g: WeeklyGoal) => {
        if (g.id !== task.goalId) return g;
        const current = g.quantityDone ?? 0;
        return { ...g, quantityDone: isDone ? current + 1 : Math.max(0, current - 1) };
      });
    }

    await savePlan.mutateAsync({
      childId,
      weekId,
      tasks: updatedTasks,
      goals: updatedGoals,
      publishedAt: plan.publishedAt,
      reviewedAt: plan.reviewedAt,
      parentComment: plan.reviewComment,
      aiSummary: plan.aiSummary,
      aiSummaryGeneratedAt: plan.aiSummaryGeneratedAt,
    });
  };

  const reviewWeeklyPlan = async (childId: string, weekId: string, comment: string) => {
    const plan = weeklyPlans.find((p) => p.weekId === weekId && p.childId === childId);
    if (!plan) throw new Error('Weekly plan not found');

    await savePlan.mutateAsync({
      childId,
      weekId,
      tasks: plan.tasks,
      goals: plan.goals ?? [],
      publishedAt: plan.publishedAt,
      reviewedAt: new Date().toISOString(),
      parentComment: comment,
      aiSummary: plan.aiSummary,
      aiSummaryGeneratedAt: plan.aiSummaryGeneratedAt,
    });
  };

  const deleteWeeklyPlan = async (childId: string, weekId: string) => {
    const plan = weeklyPlans.find((p) => p.weekId === weekId && p.childId === childId);
    if (!plan?.id) return;
    await deletePlan.mutateAsync(plan.id);
  };

  const currentChild = children.find((c) => c.id === currentChildId) ?? children[0] ?? null;

  return (
    <ChildrenContext.Provider
      value={{
        children,
        currentChild,
        currentChildId,
        weeklyPlans,
        setCurrentChildId,
        addChild,
        updateChild,
        removeChild,
        getWeeklyPlan,
        generateWeeklyPlanDraft,
        publishWeeklyPlan,
        updateTaskStatus,
        reviewWeeklyPlan,
        deleteWeeklyPlan,
      }}
    >
      {childNodes}
    </ChildrenContext.Provider>
  );
}

export function useChildren() {
  const context = useContext(ChildrenContext);
  if (!context) {
    throw new Error('useChildren must be used within ChildrenProvider');
  }
  return context;
}
