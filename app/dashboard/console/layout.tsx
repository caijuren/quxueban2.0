'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  Bell,
  Users,
  UserCog,
  Sparkles,
  Database,
  Palette,
  HelpCircle,
  ChevronLeft,
  Settings,
} from 'lucide-react';
import { motion } from 'framer-motion';

const consoleNav = [
  {
    title: '账户',
    items: [
      { name: '我的账户', href: '/dashboard/console/account', icon: User },
      { name: '消息通知', href: '/dashboard/console/notifications', icon: Bell },
    ],
  },
  {
    title: '家庭',
    items: [
      { name: '我的孩子', href: '/dashboard/console/children', icon: Users },
      { name: '家庭成员与权限', href: '/dashboard/console/family', icon: UserCog },
    ],
  },
  {
    title: 'AI 助手',
    items: [{ name: 'AI 配置', href: '/dashboard/console/ai', icon: Sparkles }],
  },
  {
    title: '数据资产',
    items: [{ name: '数据与隐私', href: '/dashboard/console/data', icon: Database }],
  },
  {
    title: '系统',
    items: [
      { name: '外观与体验', href: '/dashboard/console/appearance', icon: Palette },
      { name: '帮助中心', href: '/dashboard/console/help', icon: HelpCircle },
    ],
  },
];

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row gap-4 min-h-[calc(100vh-8rem)]">
      {/* Left navigation */}
      <motion.aside
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className={`shrink-0 transition-all duration-300 ${
          collapsed ? 'lg:w-16' : 'lg:w-56'
        }`}
      >
        <div className="flex items-center gap-2 mb-3 px-1">
          <Settings className="w-4 h-4 text-primary" />
          {!collapsed && (
            <h1 className="text-base font-bold font-display text-text-primary">设置</h1>
          )}
        </div>

        <nav className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {consoleNav.map((group) => (
            <div key={group.title} className={collapsed ? 'hidden lg:block' : ''}>
              {!collapsed && (
                <p className="px-3 mb-1.5 text-2xs font-semibold text-text-muted uppercase tracking-wider">
                  {group.title}
                </p>
              )}
              <div className="flex lg:flex-col gap-0.5">
                {group.items.map((item) => {
                  const isActive =
                    item.href === '/dashboard/console'
                      ? pathname === '/dashboard/console'
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-primary/[0.08] text-primary font-medium'
                          : 'text-text-tertiary hover:bg-white/[0.04] hover:text-text-secondary'
                      }`}
                      title={collapsed ? item.name : undefined}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
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
          className="hidden lg:flex items-center justify-center w-8 h-8 mt-4 rounded-lg bg-white/[0.04] text-text-muted hover:text-text-secondary transition-colors"
          title={collapsed ? '展开' : '收起'}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-y-auto pb-8">
        {children}
      </main>
    </div>
  );
}
