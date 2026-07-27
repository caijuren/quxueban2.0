'use client';

import { motion } from 'framer-motion';
import { Bell, Search, Menu, Plus, Check, User, Pencil } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import { Child, gradeLabel, gradeToStage, getInitials } from '@/lib/children';
import ChildModal from '@/components/dashboard/ChildModal';

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
  const pathname = usePathname();
  const { children, currentChild, currentChildId, setCurrentChildId } = useChildren();
  const [search, setSearch] = useState('');
  const [childDropdownOpen, setChildDropdownOpen] = useState(false);
  const [showChildModal, setShowChildModal] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
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

  const currentStage = currentChild ? gradeToStage(currentChild.grade) : null;

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 right-0 left-0 lg:left-64 h-16 glass border-b border-white/[0.06] z-30 px-4 sm:px-6 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 hover:bg-white/10 transition-colors focus-ring"
          aria-label="打开菜单"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="搜索路线、任务、学校…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="pl-9 pr-4 py-2 w-56 lg:w-72 rounded-lg bg-surface border border-white/[0.08] text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setNotificationOpen((prev) => !prev)}
            className="relative w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/[0.08] hover:text-slate-200 transition-colors focus-ring"
            aria-label="通知"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[14px] h-3.5 px-1 rounded-full bg-primary text-[9px] font-bold text-white flex items-center justify-center tabular-nums">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-xl glass border border-white/[0.08] overflow-hidden z-50 shadow-2xl modal-scroll">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
                <p className="text-sm font-semibold text-slate-200">通知</p>
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
                  <div className="py-8 text-center text-sm text-slate-500">
                    暂无通知
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleMarkRead(n.id)}
                      className={`w-full text-left border-b border-white/[0.04] px-4 py-3 transition-colors hover:bg-white/5 ${
                        n.readAt ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-slate-200">
                          {n.title}
                        </p>
                        {!n.readAt && (
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="line-clamp-2 text-xs text-slate-400">
                        {n.content}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-600 tabular-nums">
                        {new Date(n.createdAt).toLocaleString('zh-CN')}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={childDropdownRef}>
          <button
            onClick={() => setChildDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 pl-3 border-l border-white/[0.08] text-left focus-ring rounded-lg"
            aria-label="切换学员"
            aria-haspopup="listbox"
            aria-expanded={childDropdownOpen}
            aria-controls="child-listbox"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-200">
                {currentChild ? currentChild.name : '未选择学员'}
              </p>
              <p className="text-[10px] text-slate-500">
                {currentChild && currentStage
                  ? `${gradeLabel(currentChild.grade)} · ${currentStage}`
                  : '请选择或添加学员'}
              </p>
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{
                background: currentChild
                  ? `linear-gradient(135deg, ${currentChild.avatarColor}, ${currentChild.avatarColor}88)`
                  : 'linear-gradient(135deg, #475569, #64748b)',
              }}
            >
              {currentChild ? getInitials(currentChild.name) : <User className="w-4 h-4" />}
            </div>
            <svg
              className={`w-3.5 h-3.5 text-slate-500 hidden sm:block transition-transform duration-200 ${
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
              aria-label="切换学员"
              className="absolute right-0 top-full mt-2 w-56 rounded-xl glass border border-white/[0.08] overflow-hidden z-50 shadow-2xl"
            >
              <div className="px-3 py-2 border-b border-white/[0.06]">
                <p className="text-xs text-slate-500">切换学员</p>
              </div>
              <div className="p-1">
                {children.map((child, index) => {
                  const isActive = currentChild?.id === child.id;
                  return (
                    <div
                      key={child.id}
                      role="option"
                      aria-selected={isActive}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-lg transition-colors ${
                        isActive ? 'bg-primary/10' : 'hover:bg-white/5'
                      }`}
                    >
                      <button
                        ref={(el) => {
                          childButtonRefs.current[index] = el;
                        }}
                        onClick={() => {
                          setCurrentChildId(child.id);
                          setChildDropdownOpen(false);
                        }}
                        className="flex-1 flex items-center gap-2.5 text-left min-w-0 focus-ring rounded-md"
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${child.avatarColor}, ${child.avatarColor}88)`,
                          }}
                        >
                          {getInitials(child.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isActive ? 'text-primary' : 'text-slate-200'}`}>
                            {child.name}
                          </p>
                          <p className="text-[10px] text-slate-500">{gradeLabel(child.grade)}</p>
                        </div>
                        {isActive && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                      </button>
                      <button
                        onClick={() => {
                          setEditingChild(child);
                          setChildDropdownOpen(false);
                        }}
                        className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/10 transition-colors shrink-0"
                        aria-label="编辑学员"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-white/[0.06] p-1">
                <button
                  onClick={() => {
                    setChildDropdownOpen(false);
                    setShowChildModal(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-sm text-slate-300 hover:bg-white/5 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  添加学员
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ChildModal
        isOpen={showChildModal}
        onClose={() => setShowChildModal(false)}
      />
      <ChildModal
        isOpen={Boolean(editingChild)}
        onClose={() => setEditingChild(null)}
        child={editingChild}
      />
    </motion.header>
  );
}
