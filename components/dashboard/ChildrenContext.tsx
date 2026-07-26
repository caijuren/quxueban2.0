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

interface ChildrenContextValue {
  children: Child[];
  currentChild: Child | null;
  currentChildId: string | null;
  setCurrentChildId: (id: string) => void;
  addChild: (child: Omit<Child, 'id'>) => void;
  updateChild: (id: string, updates: Partial<Omit<Child, 'id'>>) => void;
  removeChild: (id: string) => void;
}

const ChildrenContext = createContext<ChildrenContextValue | undefined>(undefined);

function getDefaultState(): AppData {
  const defaults = getDefaultChildren();
  return {
    version: 1,
    children: defaults,
    currentChildId: defaults[0]?.id ?? null,
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
        setCurrentChildId,
        addChild,
        updateChild,
        removeChild,
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
