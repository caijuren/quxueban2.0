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
  AVATAR_COLORS,
} from '@/lib/children';
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

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error');
    throw new Error(`Request failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<T>;
}

function formatWeeklyPlan(plan: WeeklyPlan & { id?: string; parentComment?: string | null }): WeeklyPlan {
  return {
    id: plan.id,
    weekId: plan.weekId,
    childId: plan.childId,
    tasks: plan.tasks,
    publishedAt: plan.publishedAt,
    reviewedAt: plan.reviewedAt,
    reviewComment: plan.reviewComment ?? plan.parentComment ?? undefined,
  };
}

export function ChildrenProvider({ children: childNodes }: { children: ReactNode }) {
  const [children, setChildren] = useState<Child[]>([]);
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);
  const [currentChildId, setCurrentChildIdState] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

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

  // Initial load from API
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [fetchedChildren, fetchedPlans] = await Promise.all([
          fetchJson<Child[]>('/api/children'),
          fetchJson<(WeeklyPlan & { id: string })[]>('/api/weekly-plans'),
        ]);
        if (cancelled) return;

        if (fetchedChildren.length > 0) {
          setChildren(fetchedChildren);
        } else {
          // No children in DB yet; seed defaults so users can edit them right away.
          const defaults = getDefaultChildren();
          try {
            const created = await Promise.all(
              defaults.map((c) =>
                fetchJson<Child>('/api/children', {
                  method: 'POST',
                  body: JSON.stringify(c),
                })
              )
            );
            if (!cancelled) setChildren(created);
          } catch (seedError) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('[ChildrenContext] Failed to seed default children:', seedError);
            }
            if (!cancelled) setChildren(defaults);
          }
        }
        setWeeklyPlans(fetchedPlans.map(formatWeeklyPlan));
      } catch (error) {
        // Transient network/auth failures should not crash the UI;
        // fall back to default children so the dashboard remains usable.
        if (process.env.NODE_ENV === 'development') {
          console.warn('[ChildrenContext] Failed to load data, using defaults:', error);
        }
        setChildren(getDefaultChildren());
        setWeeklyPlans([]);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrentChildId = (id: string) => {
    if (!children.some((c) => c.id === id)) return;
    setCurrentChildIdState(id);
  };

  const addChild = async (child: Omit<Child, 'id'>) => {
    const newChild = await fetchJson<Child>('/api/children', {
      method: 'POST',
      body: JSON.stringify(child),
    });
    setChildren((prev) => {
      const next = [...prev.filter((c) => !c.id.startsWith('child_')), newChild];
      return next.length > 0 ? next : [newChild];
    });
    setCurrentChildIdState(newChild.id);
  };

  const updateChild = async (id: string, updates: Partial<Omit<Child, 'id'>>) => {
    const updated = await fetchJson<Child>(`/api/children/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    setChildren((prev) => prev.map((child) => (child.id === id ? updated : child)));
  };

  const removeChild = async (id: string) => {
    await fetchJson(`/api/children/${id}`, { method: 'DELETE' });
    setChildren((prev) => {
      const filtered = prev.filter((child) => child.id !== id);
      if (currentChildId === id) {
        setCurrentChildIdState(filtered[0]?.id ?? null);
      }
      return filtered;
    });
  };

  const getWeeklyPlan = (weekId: string, childId: string) =>
    weeklyPlans.find((p) => p.weekId === weekId && p.childId === childId);

  const generateWeeklyPlanDraft = (child: Child, weekId?: string) =>
    generateWeeklyPlan(child, weekId ?? getCurrentWeekId());

  const publishWeeklyPlan = async (plan: WeeklyPlan) => {
    const saved = await fetchJson<WeeklyPlan & { id: string }>('/api/weekly-plans', {
      method: 'POST',
      body: JSON.stringify({
        childId: plan.childId,
        weekId: plan.weekId,
        tasks: plan.tasks,
        publishedAt: plan.publishedAt ?? new Date().toISOString(),
        reviewedAt: plan.reviewedAt,
        parentComment: plan.reviewComment,
      }),
    });

    setWeeklyPlans((prev) => {
      const exists = prev.some(
        (p) => p.weekId === saved.weekId && p.childId === saved.childId
      );
      if (exists) {
        return prev.map((p) =>
          p.weekId === saved.weekId && p.childId === saved.childId ? formatWeeklyPlan(saved) : p
        );
      }
      return [...prev, formatWeeklyPlan(saved)];
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
    if (!plan.id) throw new Error('Weekly plan has no server id');

    const updatedTasks = plan.tasks.map((t) => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        status,
        completedAt: status === 'done' ? new Date().toISOString() : undefined,
        note: note !== undefined ? note : t.note,
      };
    });

    const saved = await fetchJson<WeeklyPlan & { id: string }>(`/api/weekly-plans/${plan.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ tasks: updatedTasks }),
    });

    setWeeklyPlans((prev) =>
      prev.map((p) =>
        p.weekId === saved.weekId && p.childId === saved.childId ? formatWeeklyPlan(saved) : p
      )
    );
  };

  const reviewWeeklyPlan = async (childId: string, weekId: string, comment: string) => {
    const plan = weeklyPlans.find((p) => p.weekId === weekId && p.childId === childId);
    if (!plan) throw new Error('Weekly plan not found');
    if (!plan.id) throw new Error('Weekly plan has no server id');

    const saved = await fetchJson<WeeklyPlan & { id: string }>(`/api/weekly-plans/${plan.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        reviewedAt: new Date().toISOString(),
        parentComment: comment,
      }),
    });

    setWeeklyPlans((prev) =>
      prev.map((p) =>
        p.weekId === saved.weekId && p.childId === saved.childId ? formatWeeklyPlan(saved) : p
      )
    );
  };

  const deleteWeeklyPlan = async (childId: string, weekId: string) => {
    const plan = weeklyPlans.find((p) => p.weekId === weekId && p.childId === childId);
    if (!plan?.id) return;

    await fetchJson(`/api/weekly-plans/${plan.id}`, { method: 'DELETE' });
    setWeeklyPlans((prev) =>
      prev.filter((p) => !(p.weekId === weekId && p.childId === childId))
    );
  };

  const currentChild =
    children.find((c) => c.id === currentChildId) ?? children[0] ?? null;

  // Ensure currentChildId points to an existing child after data loads
  useEffect(() => {
    if (!loaded) return;
    if (children.length === 0) {
      setCurrentChildIdState(null);
      return;
    }
    if (!children.some((c) => c.id === currentChildId)) {
      setCurrentChildIdState(children[0].id);
    }
  }, [loaded, children, currentChildId]);

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
