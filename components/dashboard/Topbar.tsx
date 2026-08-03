'use client';

import { motion } from 'framer-motion';
import { Bell, Search, Menu, Check, LogOut, Settings, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import ChildAvatar from '@/components/dashboard/ChildAvatar';
import { gradeLabel, gradeToStage } from '@/lib/children';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/lib/hooks/useNotifications';

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { children, currentChild, currentChildId, setCurrentChildId } = useChildren();
  const { data: notifications = [], isLoading: loadingNotifications } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const [search, setSearch] = useState('');
  const [childDropdownOpen, setChildDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const childDropdownRef = useRef<HTMLDivElement>(null);
  const childListboxRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const childButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const unreadCount = notifications.filter((n) => !n.readAt).length;
  const currentUser = session?.user;
  const userAvatarUrl = currentUser?.avatarUrl;

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
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    if (childDropdownOpen || notificationOpen || userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [childDropdownOpen, notificationOpen, userMenuOpen]);

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

  const handleMarkRead = (id: string) => {
    markRead.mutate(id);
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const handleGoToSettings = () => {
    setUserMenuOpen(false);
    router.push('/dashboard/settings');
  };

  const currentStage = currentChild ? gradeToStage(currentChild.grade, currentChild.educationSystem) : null;

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 right-0 left-0 lg:left-56 h-16 bg-surface-elevated/80 backdrop-blur-md border-b border-border-subtle z-30 px-3 sm:px-5 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 rounded-xl bg-surface-elevated/60 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-highlight transition-all focus-ring"
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
            className="pl-10 pr-4 py-2.5 w-56 lg:w-72 rounded-xl bg-surface-elevated/60 border border-border-subtle text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40 focus:bg-surface-elevated transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setNotificationOpen((prev) => !prev)}
            className="relative w-10 h-10 rounded-xl bg-surface-elevated/60 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-highlight transition-all focus-ring"
            aria-label="通知"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 rounded-full bg-primary text-2xs font-bold text-text-primary flex items-center justify-center tabular-nums">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-surface-elevated/95 backdrop-blur-md border border-border-default overflow-hidden z-50 shadow-panel modal-scroll">
              <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
                <p className="text-sm font-semibold text-text-primary">通知中心</p>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    disabled={markAllRead.isPending}
                    className="text-xs text-primary hover:text-primary-glow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {markAllRead.isPending ? '标记中...' : '全部已读'}
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
                  notifications.map((n) => {
                    const marking = markRead.isPending && markRead.variables === n.id;
                    return (
                    <button
                      key={n.id}
                      onClick={() => handleMarkRead(n.id)}
                      disabled={marking}
                      className={`w-full text-left border-b border-border-subtle px-4 py-3 transition-colors hover:bg-surface-elevated disabled:opacity-50 ${
                        n.readAt ? 'opacity-55' : ''
                      }`}
                    >
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-text-secondary">
                          {n.title}
                        </p>
                        {!n.readAt && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="line-clamp-2 text-xs text-text-tertiary">
                        {n.content}
                      </p>
                      <p className="mt-1 text-2xs text-text-muted tabular-nums">
                        {new Date(n.createdAt).toLocaleString('zh-CN')}
                      </p>
                    </button>
                  );
                })
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-elevated/60 border border-border-subtle hover:border-border-default hover:bg-surface-elevated text-text-primary text-left focus-ring transition-all overflow-hidden"
            aria-label="用户菜单"
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
          >
            {userAvatarUrl ? (
              <img
                src={userAvatarUrl}
                alt={currentUser?.name || '用户头像'}
                className="w-full h-full object-cover"
              />
            ) : currentUser?.name ? (
              <span className="text-sm font-bold text-text-primary">
                {currentUser.name.slice(0, 1).toUpperCase()}
              </span>
            ) : (
              <User className="w-5 h-5 text-text-secondary" />
            )}
          </button>

          {userMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 w-44 rounded-2xl bg-surface-elevated border border-border-default overflow-hidden z-50 shadow-2xl"
            >
              <div className="p-1.5">
                <div className="px-3 py-2 border-b border-border-subtle mb-1">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {currentUser?.name || currentUser?.username || '用户'}
                  </p>
                  <p className="text-xs text-text-tertiary truncate">
                    {currentUser?.username || ''}
                  </p>
                </div>
                <button
                  role="menuitem"
                  onClick={handleGoToSettings}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-sm text-text-secondary hover:bg-surface-elevated transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  系统设置
                </button>
                <button
                  role="menuitem"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm text-error hover:bg-error/[0.08] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={childDropdownRef}>
          <button
            onClick={() => setChildDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl bg-surface-elevated/60 border border-border-subtle hover:border-border-default hover:bg-surface-elevated text-left focus-ring transition-all"
            aria-label="切换孩子"
            aria-haspopup="listbox"
            aria-expanded={childDropdownOpen}
            aria-controls="child-listbox"
          >
            <ChildAvatar child={currentChild} size="md" shape="rounded" fallbackIcon />
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-text-primary leading-tight">
                {currentChild ? currentChild.name : '未选择孩子'}
              </p>
              <p className="text-2xs text-text-tertiary">
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
              className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-surface-elevated border border-border-default overflow-hidden z-50 shadow-2xl"
            >
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
                        isActive ? 'bg-primary/[0.08]' : 'hover:bg-surface-elevated'
                      }`}
                    >
                      <ChildAvatar child={child} size="sm" shape="rounded" />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${isActive ? 'text-primary' : 'text-text-primary'}`}>
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
