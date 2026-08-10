'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon, type IconName } from '@/components/ui/icon';
import Button from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useChildren } from '@/components/dashboard/ChildrenContext';
import ChildAvatar from '@/components/dashboard/ChildAvatar';
import { gradeLabel, gradeToStage } from '@/lib/children';
import { generateAlerts, type Alert, type AlertLevel, type AlertType } from '@/lib/alerts';
import { NotificationItem } from '@/lib/types';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '@/lib/hooks/useNotifications';

interface TopbarProps {
  onMenuClick?: () => void;
}

const alertLevelMeta: Record<AlertLevel, { label: string; dotColor: string; textColor: string; bgColor: string }> = {
  urgent: { label: '紧急', dotColor: 'bg-error', textColor: 'text-error', bgColor: 'bg-error/10' },
  warning: { label: '提醒', dotColor: 'bg-warning', textColor: 'text-warning', bgColor: 'bg-warning/10' },
  info: { label: '提示', dotColor: 'bg-secondary', textColor: 'text-secondary', bgColor: 'bg-secondary/10' },
};

const alertTypeMeta: Record<AlertType, { label: string; icon: IconName }> = {
  today_pending: { label: '今日任务', icon: 'Clock' },
  missed_yesterday: { label: '昨日遗漏', icon: 'Calendar' },
  category_gap: { label: '节奏断层', icon: 'Target' },
  low_completion: { label: '完成偏低', icon: 'TrendingDown' },
  milestone_deadline: { label: '节点临近', icon: 'Target' },
};

export default function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { children, currentChild, currentChildId, setCurrentChildId, weeklyPlans } = useChildren();
  const { data: notificationsData, isLoading: loadingNotifications } = useNotifications();
  const notifications = useMemo(
    () => notificationsData?.notifications ?? [],
    [notificationsData?.notifications]
  );
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

  const alerts = useMemo(
    () => generateAlerts({ children, weeklyPlans }),
    [children, weeklyPlans]
  );

  type FeedItem =
    | { kind: 'notification'; data: NotificationItem }
    | { kind: 'alert'; data: Alert };

  const { feedItems, unreadCount, alertBadgeCount } = useMemo(() => {
    const levelWeight: Record<AlertLevel, number> = { urgent: 0, warning: 1, info: 2 };
    const notificationItems: FeedItem[] = notifications.map((n) => ({
      kind: 'notification' as const,
      data: n,
    }));
    const alertItems: FeedItem[] = alerts.map((a) => ({ kind: 'alert' as const, data: a }));
    const feed = [...notificationItems, ...alertItems].sort((a, b) => {
      const aPriority = a.kind === 'alert' ? levelWeight[a.data.level] : 3;
      const bPriority = b.kind === 'alert' ? levelWeight[b.data.level] : 3;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return (
        new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime()
      );
    });
    return {
      feedItems: feed,
      unreadCount: notifications.filter((n) => !n.readAt).length,
      alertBadgeCount: alerts.filter((a) => a.level === 'urgent' || a.level === 'warning').length,
    };
  }, [notifications, alerts]);

  const totalBadgeCount = unreadCount + alertBadgeCount;

  const currentUser = session?.user;
  const userAvatarUrl = currentUser?.avatarUrl;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (childDropdownRef.current && !childDropdownRef.current.contains(e.target as Node)) {
        setChildDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
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

  const currentStage = currentChild
    ? gradeToStage(currentChild.grade, currentChild.educationSystem)
    : null;

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="bg-surface-elevated/80 fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border-default px-3 backdrop-blur-md sm:px-5 lg:left-56"
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="md"
          onClick={onMenuClick}
          className="focus-ring lg:hidden"
          aria-label="打开菜单"
        >
          <Icon name="Menu" size="md" />
        </Button>

        <div className="relative hidden sm:block">
          <Icon
            name="Search"
            size="sm"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="搜索路线、任务、学校…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="focus:border-primary/50 focus:ring-primary/10 w-56 rounded-[14px] border border-border-default bg-surface-header py-2.5 pl-10 pr-4 text-sm text-text-secondary transition-all placeholder:text-text-muted focus:outline-none focus:ring-2 lg:w-72"
          />
        </div>
      </div>

      <div className="min-w-0 flex items-center gap-1.5 sm:gap-3 lg:gap-4">
        <div className="relative" ref={notificationRef}>
          <Button
            variant="ghost"
            size="md"
            onClick={() => setNotificationOpen((prev) => !prev)}
            className="relative shrink-0"
            aria-label="通知"
          >
            <Icon name="Bell" size="md" />
            {totalBadgeCount > 0 && (
              <span className="absolute right-2 top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-2xs font-bold tabular-nums text-text-primary">
                {totalBadgeCount > 9 ? '9+' : totalBadgeCount}
              </span>
            )}
          </Button>

          {notificationOpen && (
            <div className="bg-surface-elevated modal-scroll absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-card border border-border-default shadow-card">
              <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
                <p className="text-sm font-semibold text-text-primary">通知与提醒</p>
                {unreadCount > 0 && (
                  <Button
                    variant="link"
                    size="xs"
                    onClick={handleMarkAllRead}
                    disabled={markAllRead.isPending}
                    className="disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {markAllRead.isPending ? '标记中...' : '全部已读'}
                  </Button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {loadingNotifications ? (
                  <div className="flex items-center justify-center py-8">
                    <Icon name="Loader2" size="sm" animate="spin" className="text-primary" />
                  </div>
                ) : feedItems.length === 0 ? (
                  <div className="py-8 text-center text-sm text-text-tertiary">
                    暂无通知与提醒
                  </div>
                ) : (
                  <div>
                    {feedItems.map((item) => {
                      if (item.kind === 'alert') {
                        const alert = item.data;
                        const level = alertLevelMeta[alert.level];
                        const type = alertTypeMeta[alert.type];
                        return (
                          <div
                            key={`alert-${alert.id}`}
                            className="border-b border-border-default px-4 py-3 transition-colors hover:bg-surface-elevated"
                          >
                            <div className="mb-1.5 flex flex-wrap items-center gap-2">
                              <span
                                className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${level.bgColor} ${level.textColor}`}
                              >
                                <span className={`size-1.5 rounded-full ${level.dotColor}`} />
                                {level.label}
                              </span>
                              <span className="flex items-center gap-1 rounded-full bg-surface-hover px-1.5 py-0.5 text-[10px] text-text-tertiary">
                                <Icon name={type.icon} size="xs" />
                                {type.label}
                              </span>
                            </div>
                            <p className="mb-1 text-sm font-medium text-text-secondary">
                              {alert.title}
                            </p>
                            <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-text-tertiary">
                              {alert.content}
                            </p>
                            {alert.action && (
                              <Button
                                variant="link"
                                size="xs"
                                onClick={() => {
                                  setNotificationOpen(false);
                                  router.push(alert.action!.href);
                                }}
                                className="h-auto p-0"
                              >
                                {alert.action.label}
                                <Icon name="ArrowRight" size="xs" />
                              </Button>
                            )}
                          </div>
                        );
                      }

                      const n = item.data;
                      const marking = markRead.isPending && markRead.variables === n.id;
                      return (
                        <Button
                          key={`notification-${n.id}`}
                          variant="ghost"
                          size="md"
                          onClick={() => handleMarkRead(n.id)}
                          disabled={marking}
                          className={`w-full border-b border-border-default px-4 py-3 text-left transition-colors hover:bg-surface-elevated disabled:opacity-50 ${
                            n.readAt ? 'opacity-55' : ''
                          }`}
                        >
                          <div className="mb-1 flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-text-secondary">{n.title}</p>
                            {!n.readAt && (
                              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="line-clamp-2 text-xs text-text-tertiary">{n.content}</p>
                          <p className="mt-1 text-2xs tabular-nums text-text-muted">
                            {new Date(n.createdAt).toLocaleString('zh-CN')}
                          </p>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={userMenuRef}>
          <Button
            variant="ghost"
            size="md"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-module border border-border-default text-left text-text-primary transition-all hover:border-border-strong hover:bg-surface-elevated sm:size-11"
            aria-label="用户菜单"
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
          >
            {userAvatarUrl ? (
              <Image
                src={userAvatarUrl}
                alt={currentUser?.name || '用户头像'}
                fill
                sizes="40px"
                unoptimized
                className="object-cover"
              />
            ) : currentUser?.name ? (
              <span className="text-sm font-bold text-text-primary">
                {currentUser.name.slice(0, 1).toUpperCase()}
              </span>
            ) : (
              <Icon name="User" size="md" className="text-text-secondary" />
            )}
          </Button>

          {userMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-card border border-border-default bg-surface-elevated shadow-card"
            >
              <div className="p-1.5">
                <div className="mb-1 border-b border-border-default px-3 py-2">
                  <p className="truncate text-sm font-semibold text-text-primary">
                    {currentUser?.name || currentUser?.username || '用户'}
                  </p>
                  <p className="truncate text-xs text-text-tertiary">
                    {currentUser?.username || ''}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  role="menuitem"
                  onClick={handleGoToSettings}
                  className="flex w-full items-center gap-2.5 rounded-module px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-surface-elevated"
                >
                  <Icon name="Settings" size="sm" />
                  设置
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-module px-3 py-2 text-left text-sm transition-colors"
                >
                  <Icon name="LogOut" size="sm" />
                  退出登录
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={childDropdownRef}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setChildDropdownOpen((prev) => !prev)}
            className="flex h-10 min-w-0 max-w-[min(48vw,220px)] items-center gap-2 rounded-module border border-border-default py-1.5 pl-1.5 pr-2 text-left transition-all hover:border-border-strong hover:bg-surface-elevated sm:max-w-[240px] sm:gap-3 sm:pr-3"
            aria-label="切换孩子"
            aria-haspopup="listbox"
            aria-expanded={childDropdownOpen}
            aria-controls="child-listbox"
          >
            <div className="shrink-0">
              <ChildAvatar child={currentChild} size="md" shape="rounded" fallbackIcon />
            </div>
            <div className="hidden min-w-0 text-right sm:block">
              <p className="truncate text-sm font-semibold leading-tight text-text-primary">
                {currentChild ? currentChild.name : '未选择孩子'}
              </p>
              <p className="truncate text-2xs text-text-tertiary">
                {currentChild && currentStage
                  ? `${gradeLabel(currentChild.grade, currentChild.educationSystem)} · ${currentStage}`
                  : '请选择孩子'}
              </p>
            </div>
            <Icon
              name="ChevronDown"
              size="sm"
              className={`hidden text-text-muted transition-transform duration-200 sm:block ${
                childDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </Button>

          {childDropdownOpen && (
            <div
              id="child-listbox"
              ref={childListboxRef}
              role="listbox"
              aria-label="切换孩子"
              className="absolute right-0 top-full z-50 mt-2 w-[min(16rem,calc(100vw-1.5rem))] overflow-hidden rounded-card border border-border-default bg-surface-elevated shadow-card"
            >
              <div className="p-2.5">
                {children.map((child, index) => {
                  const isActive = currentChild?.id === child.id;
                  return (
                    <Button
                      key={child.id}
                      variant="ghost"
                      size="sm"
                      ref={(el) => {
                        childButtonRefs.current[index] = el;
                      }}
                      role="option"
                      aria-selected={isActive}
                      onClick={() => {
                        setCurrentChildId(child.id);
                        setChildDropdownOpen(false);
                      }}
                      className={`flex h-auto min-h-[62px] w-full items-center gap-3 rounded-module p-3 text-left transition-all sm:gap-4 sm:p-3.5 ${
                        isActive ? 'bg-primary/[0.08]' : 'hover:bg-surface-elevated'
                      }`}
                    >
                      <ChildAvatar child={child} size="md" shape="rounded" />
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-sm font-semibold ${isActive ? 'text-primary' : 'text-text-primary'}`}
                        >
                          {child.name}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          {gradeLabel(child.grade, child.educationSystem)}
                        </p>
                      </div>
                      {isActive && (
                        <Icon name="Check" size="sm" className="shrink-0 text-primary" />
                      )}
                    </Button>
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
