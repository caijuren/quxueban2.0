'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  Child,
  getDefaultChildren,
  generateChildId,
  AVATAR_COLORS,
} from '@/lib/children';
import { loadAppData, saveAppData, AppData } from '@/lib/storage';
import { type WeeklyPlan, type TaskStatus } from '@/lib/storage.types';
import { generateWeeklyPlan, getCurrentWeekId } from '@/lib/weeklyTasks';

interface ChildrenContextValue {
  children: Child[];
  currentChild: Child | null;
  currentChildId: string | null;
  weeklyPlans: WeeklyPlan[];
  setCurrentChildId: (id: string) => void;
  addChild: (child: Omit<Child, 'id'>) => void;
  updateChild: (id: string, updates: Partial<Omit<Child, 'id'>>) => void;
  removeChild: (id: string) => void;
  getWeeklyPlan: (weekId: string, childId: string) => WeeklyPlan | undefined;
  generateWeeklyPlanDraft: (child: Child, weekId?: string) => WeeklyPlan;
  publishWeeklyPlan: (plan: WeeklyPlan) => void;
  updateTaskStatus: (
    childId: string,
    weekId: string,
    taskId: string,
    status: TaskStatus,
    note?: string
  ) => void;
  reviewWeeklyPlan: (childId: string, weekId: string, comment: string) => void;
  deleteWeeklyPlan: (childId: string, weekId: string) => void;
}

const ChildrenContext = createContext<ChildrenContextValue | undefined>(undefined);

function getDefaultState(): AppData {
  const defaults = getDefaultChildren();
  return {
    version: 1,
    children: defaults,
    currentChildId: defaults[0]?.id ?? null,
    weeklyPlans: [],
  };
}

export function ChildrenProvider({ children: childNodes }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [appData, setAppData] = useState<AppData>(() => getDefaultState());

  useEffect(() => {
    const data = loadAppData();
    setAppData(data);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      saveAppData(appData);
    }
  }, [appData, mounted]);

  const setCurrentChildId = (id: string) => {
    setAppData((prev) => {
      if (!prev.children.some((c) => c.id === id)) return prev;
      return { ...prev, currentChildId: id };
    });
  };

  const addChild = (child: Omit<Child, 'id'>) => {
    setAppData((prev) => {
      const newChild: Child = {
        ...child,
        id: generateChildId(),
        avatarColor: child.avatarColor || AVATAR_COLORS[prev.children.length % AVATAR_COLORS.length],
      };
      return {
        ...prev,
        children: [...prev.children, newChild],
        currentChildId: newChild.id,
      };
    });
  };

  const updateChild = (id: string, updates: Partial<Omit<Child, 'id'>>) => {
    setAppData((prev) => ({
      ...prev,
      children: prev.children.map((child) =>
        child.id === id ? { ...child, ...updates } : child
      ),
    }));
  };

  const removeChild = (id: string) => {
    setAppData((prev) => {
      const filtered = prev.children.filter((child) => child.id !== id);
      const nextCurrentId =
        prev.currentChildId === id
          ? filtered[0]?.id ?? null
          : prev.currentChildId;
      return {
        ...prev,
        children: filtered,
        currentChildId: nextCurrentId,
      };
    });
  };

  const getWeeklyPlan = (weekId: string, childId: string) =>
    appData.weeklyPlans.find(
      (p) => p.weekId === weekId && p.childId === childId
    );

  const generateWeeklyPlanDraft = (child: Child, weekId?: string) =>
    generateWeeklyPlan(child, weekId ?? getCurrentWeekId());

  const publishWeeklyPlan = (plan: WeeklyPlan) => {
    setAppData((prev) => {
      const exists = prev.weeklyPlans.some(
        (p) => p.weekId === plan.weekId && p.childId === plan.childId
      );
      const now = new Date().toISOString();
      const planWithTimestamp = { ...plan, publishedAt: plan.publishedAt ?? now };
      if (exists) {
        return {
          ...prev,
          weeklyPlans: prev.weeklyPlans.map((p) =>
            p.weekId === plan.weekId && p.childId === plan.childId
              ? planWithTimestamp
              : p
          ),
        };
      }
      return {
        ...prev,
        weeklyPlans: [...prev.weeklyPlans, planWithTimestamp],
      };
    });
  };

  const updateTaskStatus = (
    childId: string,
    weekId: string,
    taskId: string,
    status: TaskStatus,
    note?: string
  ) => {
    setAppData((prev) => ({
      ...prev,
      weeklyPlans: prev.weeklyPlans.map((p) => {
        if (p.weekId !== weekId || p.childId !== childId) return p;
        return {
          ...p,
          tasks: p.tasks.map((t) => {
            if (t.id !== taskId) return t;
            return {
              ...t,
              status,
              completedAt: status === 'done' ? new Date().toISOString() : undefined,
              note: note !== undefined ? note : t.note,
            };
          }),
        };
      }),
    }));
  };

  const reviewWeeklyPlan = (childId: string, weekId: string, comment: string) => {
    setAppData((prev) => ({
      ...prev,
      weeklyPlans: prev.weeklyPlans.map((p) =>
        p.weekId === weekId && p.childId === childId
          ? {
              ...p,
              reviewComment: comment,
              reviewedAt: new Date().toISOString(),
            }
          : p
      ),
    }));
  };

  const deleteWeeklyPlan = (childId: string, weekId: string) => {
    setAppData((prev) => ({
      ...prev,
      weeklyPlans: prev.weeklyPlans.filter(
        (p) => !(p.weekId === weekId && p.childId === childId)
      ),
    }));
  };

  const currentChild =
    appData.children.find((c) => c.id === appData.currentChildId) ??
    appData.children[0] ??
    null;

  return (
    <ChildrenContext.Provider
      value={{
        children: appData.children,
        currentChild,
        currentChildId: appData.currentChildId,
        weeklyPlans: appData.weeklyPlans,
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
