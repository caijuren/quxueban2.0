'use client';

import { motion } from 'framer-motion';
import { Bell, Search, Menu, Check, LogOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import ChildAvatar from '@/components/dashboard/ChildAvatar';
import { gradeLabel, gradeToStage } from '@/lib/children';

interface Notification {
  id: string;
  title: string;
  content: string;
  readAt: string | null;
  createdAt: string;
}

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const { children, currentChild, currentChildId, setCurrentChildId } = useChildren();
  const [search, setSearch] = useState('');
  const [childDropdownOpen, setChildDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const childDropdownRef = useRef<HTMLDivElement>(null);
  const childListboxRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const childButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        childDropdownRef.current &&
        !childDropdownRef.current.contains(e.target as Node)
      ) {
        setChildDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setNotificationOpen(false);
      }
    };
    if (childDropdownOpen || notificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [childDropdownOpen, notificationOpen]);

  useEffect(() => {
    if (!childDropdownOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setChildDropdownOpen(false);
        return;
      }
      const activeIndex = children.findIndex((c) => c.id === currentChildId);
      const lastIndex = children.length - 1;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = activeIndex >= lastIndex ? 0 : activeIndex + 1;
        childButtonRefs.current[nextIndex]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = activeIndex <= 0 ? lastIndex : activeIndex - 1;
        childButtonRefs.current[prevIndex]?.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        childButtonRefs.current[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        childButtonRefs.current[lastIndex]?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Focus the current child when opening
    const activeIndex = children.findIndex((c) => c.id === currentChildId);
    setTimeout(() => childButtonRefs.current[activeIndex]?.focus(), 0);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [childDropdownOpen, children, currentChildId]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadingNotifications(true);
      try {
        const res = await fetch('/api/notifications');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setNotifications(data);
      } finally {
        if (!cancelled) setLoadingNotifications(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = search.trim();
      if (trimmed) {
        router.push(`/dashboard/plan?q=${encodeURIComponent(trimmed)}`);
      } else {
        router.push('/dashboard/plan');
      }
    }
  };

  const handleMarkRead = async (id: string) => {
    const res = await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
    if (!res.ok) return;
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
    );
  };

  const handleMarkAllRead = async () => {
    const res = await fetch('/api/notifications/read-all', { method: 'PATCH' });
    if (!res.ok) return;
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() }))
    );
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const currentStage = currentChild ? gradeToStage(currentChild.grade, currentChild.educationSystem) : null;

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 right-0 left-0 lg:left-64 h-16 glass border-b border-border-default z-30 px-3 sm:px-5 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 rounded-xl bg-surface border border-border-default flex items-center justify-center text-text-secondary hover:text-white hover:border-border-strong hover:bg-surface-light transition-all focus-ring"
          aria-label="打开菜单"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="搜索路线、任务、学校…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="pl-10 pr-4 py-2.5 w-56 lg:w-72 rounded-xl bg-surface border border-border-default text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/40 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setNotificationOpen((prev) => !prev)}
            className="relative w-10 h-10 rounded-xl bg-surface border border-border-default flex items-center justify-center text-text-secondary hover:text-white hover:border-border-strong hover:bg-surface-light transition-all focus-ring"
            aria-label="通知"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center tabular-nums shadow-glow-primary">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl glass border border-border-default overflow-hidden z-50 shadow-panel modal-scroll">
              <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
                <p className="text-sm font-semibold text-white">通知中心</p>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-primary hover:text-primary-glow transition-colors"
                  >
                    全部已读
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {loadingNotifications ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-8 text-center text-sm text-text-tertiary">
                    暂无通知
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleMarkRead(n.id)}
                      className={`w-full text-left border-b border-border-subtle px-4 py-3 transition-colors hover:bg-surface-light ${
                        n.readAt ? 'opacity-55' : ''
                      }`}
                    >
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-text-secondary">
                          {n.title}
                        </p>
                        {!n.readAt && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary shadow-glow-primary" />
                        )}
                      </div>
                      <p className="line-clamp-2 text-xs text-text-tertiary">
                        {n.content}
                      </p>
                      <p className="mt-1 text-[11px] text-text-muted tabular-nums">
                        {new Date(n.createdAt).toLocaleString('zh-CN')}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="hidden sm:flex w-10 h-10 rounded-xl bg-surface border border-border-default items-center justify-center text-text-secondary hover:text-danger hover:border-danger/30 hover:bg-danger/10 transition-all focus-ring"
          aria-label="退出登录"
        >
          <LogOut className="w-5 h-5" />
        </button>

        <div className="relative" ref={childDropdownRef}>
          <button
            onClick={() => setChildDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl bg-surface border border-border-default hover:border-border-strong hover:bg-surface-light text-left focus-ring transition-all"
            aria-label="切换孩子"
            aria-haspopup="listbox"
            aria-expanded={childDropdownOpen}
            aria-controls="child-listbox"
          >
            <ChildAvatar child={currentChild} size="md" shape="rounded" fallbackIcon />
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white leading-tight">
                {currentChild ? currentChild.name : '未选择孩子'}
              </p>
              <p className="text-[11px] text-text-tertiary">
                {currentChild && currentStage
                  ? `${gradeLabel(currentChild.grade, currentChild.educationSystem)} · ${currentStage}`
                  : '请选择孩子'}
              </p>
            </div>
            <svg
              className={`w-4 h-4 text-text-muted hidden sm:block transition-transform duration-200 ${
                childDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {childDropdownOpen && (
            <div
              id="child-listbox"
              ref={childListboxRef}
              role="listbox"
              aria-label="切换孩子"
              className="absolute right-0 top-full mt-2 w-64 rounded-2xl glass border border-border-default overflow-hidden z-50 shadow-panel"
            >
              <div className="px-4 py-2.5 border-b border-border-subtle">
                <p className="text-xs text-text-muted">切换孩子档案</p>
              </div>
              <div className="p-1.5">
                {children.map((child, index) => {
                  const isActive = currentChild?.id === child.id;
                  return (
                    <button
                      key={child.id}
                      ref={(el) => {
                        childButtonRefs.current[index] = el;
                      }}
                      role="option"
                      aria-selected={isActive}
                      onClick={() => {
                        setCurrentChildId(child.id);
                        setChildDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                        isActive ? 'bg-primary-dim border border-primary/20' : 'hover:bg-surface-light'
                      }`}
                    >
                      <ChildAvatar child={child} size="sm" shape="rounded" />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${isActive ? 'text-primary' : 'text-white'}`}>
                          {child.name}
                        </p>
                        <p className="text-xs text-text-tertiary">{gradeLabel(child.grade, child.educationSystem)}</p>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
