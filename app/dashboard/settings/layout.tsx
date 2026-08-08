'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  Users,
  Target,
  Sparkles,
  Database,
  UserCog,
  Bell,
  Palette,
  HelpCircle,
  Settings,
  ChevronLeft,
  BookHeart,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '@/lib/hooks/useUser';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const settingsNav: NavGroup[] = [
  {
    title: '我的账户',
    items: [{ name: '账户与安全', href: '/dashboard/settings/account', icon: User }],
  },
  {
    title: '孩子管理',
    items: [{ name: '我的孩子', href: '/dashboard/settings/children', icon: Users }],
  },
  {
    title: '学习系统',
    items: [{ name: '能力模型', href: '/dashboard/settings/capabilities', icon: Target }],
  },
  {
    title: 'AI 能力',
    items: [{ name: 'AI 配置', href: '/dashboard/settings/ai', icon: Sparkles }],
  },
  {
    title: '数据资产',
    items: [
      { name: '数据与隐私', href: '/dashboard/settings/data', icon: Database },
      { name: '家长日志', href: '/dashboard/settings/parent-log', icon: BookHeart },
    ],
  },
  {
    title: '家庭协作',
    items: [{ name: '家庭成员', href: '/dashboard/settings/family', icon: UserCog }],
  },
  {
    title: '系统偏好',
    items: [
      { name: '消息通知', href: '/dashboard/settings/notifications', icon: Bell },
      { name: '外观与体验', href: '/dashboard/settings/appearance', icon: Palette },
      { name: '帮助中心', href: '/dashboard/settings/help', icon: HelpCircle },
    ],
  },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { data: user } = useUser();
  const isAdmin = user?.role === 'ADMIN';

  const visibleNav = settingsNav.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.adminOnly || isAdmin),
  }));

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col gap-4 lg:flex-row">
      <motion.aside
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className={`shrink-0 transition-all duration-300 ${collapsed ? 'lg:w-16' : 'lg:w-56'}`}
      >
        <div className="mb-3 flex items-center gap-2 px-1">
          <Settings className="size-4 text-primary" />
          {!collapsed && (
            <h1 className="font-display text-base font-bold text-text-primary">设置</h1>
          )}
        </div>

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
                      className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-left transition-colors ${
                        isActive
                          ? 'bg-primary/[0.08] font-medium text-primary'
                          : 'text-text-tertiary hover:bg-surface-hover hover:text-text-secondary'
                      }`}
                      title={collapsed ? item.name : undefined}
                    >
                      <item.icon className="size-4 shrink-0" />
                      {!collapsed && <span className="text-xs">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-4 hidden size-8 items-center justify-center rounded-lg bg-surface-hover text-text-muted transition-colors hover:text-text-secondary lg:flex"
          title={collapsed ? '展开' : '收起'}
        >
          <ChevronLeft className={`size-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </motion.aside>

      <main className="min-w-0 flex-1 overflow-y-auto pb-8">{children}</main>
    </div>
  );
}
