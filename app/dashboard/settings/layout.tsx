'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from '@/components/ui/icon';
import { motion } from 'framer-motion';
import { useUser } from '@/lib/hooks/useUser';
import Button from '@/components/ui/button';
import GlassCard from '@/components/ui/glass-card';

interface NavItem {
  name: string;
  href: string;
  icon: IconName;
  adminOnly?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const settingsNav: NavGroup[] = [
  {
    title: '我的账户',
    items: [{ name: '账户与安全', href: '/dashboard/settings/account', icon: 'User' }],
  },
  {
    title: '孩子管理',
    items: [{ name: '我的孩子', href: '/dashboard/settings/children', icon: 'Users' }],
  },
  {
    title: '学习系统',
    items: [{ name: '能力模型', href: '/dashboard/settings/capabilities', icon: 'Target' }],
  },
  {
    title: 'AI 能力',
    items: [{ name: 'AI 配置', href: '/dashboard/settings/ai', icon: 'Sparkles' }],
  },
  {
    title: '数据资产',
    items: [
      { name: '数据与隐私', href: '/dashboard/settings/data', icon: 'Database' },
      { name: '家长日志', href: '/dashboard/settings/parent-log', icon: 'BookHeart' },
    ],
  },
  {
    title: '家庭协作',
    items: [{ name: '家庭成员', href: '/dashboard/settings/family', icon: 'UserCog' }],
  },
  {
    title: '系统偏好',
    items: [
      { name: '消息通知', href: '/dashboard/settings/notifications', icon: 'Bell' },
      { name: '外观与体验', href: '/dashboard/settings/appearance', icon: 'Palette' },
      { name: '帮助中心', href: '/dashboard/settings/help', icon: 'HelpCircle' },
    ],
  },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { data: user } = useUser();
  const isAdmin = user?.role === 'ADMIN';

  const visibleNav = settingsNav.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.adminOnly || isAdmin),
  }));

  const navContent = (
    <nav className="flex gap-4 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
      {visibleNav.map((group) => (
        <div key={group.title} className={collapsed ? 'hidden lg:block' : ''}>
          {!collapsed && (
            <p className="mb-1.5 px-3 text-2xs font-semibold uppercase tracking-wider text-text-muted">
              {group.title}
            </p>
          )}
          <div className="flex gap-0.5 lg:flex-col">
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`relative flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-left transition-colors ${
                    isActive
                      ? 'glass-subtle font-medium text-primary'
                      : 'text-text-tertiary hover:bg-surface-hover hover:text-text-secondary'
                  }`}
                  title={collapsed ? item.name : undefined}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
                  )}
                  <Icon name={item.icon} className="shrink-0" size="sm" />
                  {!collapsed && <span className="text-xs">{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col gap-4 lg:flex-row">
      {/* Mobile menu button */}
      <div className="flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-2">
          <Icon name="Settings" size="sm" className="text-primary" />
          <h1 className="font-display text-base font-bold text-text-primary">设置</h1>
        </div>
        <Button
          variant="secondary"
          onClick={() => setMobileNavOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-hover"
        >
          <Icon name="Menu" size="sm" />
          菜单
        </Button>
      </div>

      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          {/* Drawer panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-surface p-4 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Settings" size="sm" className="text-primary" />
                <h2 className="font-display text-base font-bold text-text-primary">设置</h2>
              </div>
              <Button
                variant="ghost"
                onClick={() => setMobileNavOpen(false)}
                className="flex size-8 items-center justify-center rounded-lg text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
              >
                <Icon name="X" size="sm" />
              </Button>
            </div>
            <div className="space-y-4">
              {visibleNav.map((group) => (
                <div key={group.title}>
                  <p className="mb-1.5 px-3 text-2xs font-semibold uppercase tracking-wider text-text-muted">
                    {group.title}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileNavOpen(false)}
                          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                            isActive
                              ? 'glass-subtle font-medium text-primary'
                              : 'text-text-tertiary hover:bg-surface-hover hover:text-text-secondary'
                          }`}
                        >
                          <Icon name={item.icon} className="shrink-0" size="sm" />
                          <span className="text-sm">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      <motion.aside
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className={`shrink-0 transition-all duration-300 ${collapsed ? 'lg:w-16' : 'lg:w-56'}`}
      >
        <div className="mb-3 flex items-center gap-2 px-1">
          <Icon name="Settings" size="sm" className="text-primary" />
          {!collapsed && (
            <h1 className="font-display text-base font-bold text-text-primary">设置</h1>
          )}
        </div>

        <GlassCard strength="subtle" className="hidden p-2 lg:block">
          {navContent}
        </GlassCard>

        <Button
          variant="secondary"
          onClick={() => setCollapsed(!collapsed)}
          className="mt-4 hidden size-8 items-center justify-center rounded-lg bg-surface-hover text-text-muted transition-colors hover:text-text-secondary lg:flex"
          title={collapsed ? '展开' : '收起'}
        >
          <Icon
            name="ChevronLeft"
            size="sm"
            className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}
          />
        </Button>
      </motion.aside>

      <main className="min-w-0 flex-1 overflow-y-auto pb-8">{children}</main>
    </div>
  );
}
