'use client';

import {
  LayoutDashboard,
  Brain,
  Sparkles,
  Calendar,
  Bell,
  Target,
  Settings,
  Wrench,
  X,
  Library,
} from 'lucide-react';
import packageInfo from '@/package.json';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuGroups = [
  {
    title: '概览',
    items: [
      { name: '总览', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: '任务',
    items: [
      { name: '今日任务', href: '/dashboard/today', icon: Target },
      { name: '周计划', href: '/dashboard/weekly', icon: Calendar },
      { name: '任务库', href: '/dashboard/task-library', icon: Library },
      { name: '提醒中心', href: '/dashboard/alerts', icon: Bell },
    ],
  },
  {
    title: 'AI 助手',
    items: [{ name: 'AI 诊断', href: '/dashboard/ai', icon: Brain }],
  },
  {
    title: '规划工具',
    items: [{ name: '规划工具', href: '/dashboard/toolbox', icon: Wrench }],
  },
  {
    title: '设置',
    items: [{ name: '设置', href: '/dashboard/settings', icon: Settings }],
  },
];

interface SidebarProps {
  mobileMenuOpen?: boolean;
  onLinkClick?: () => void;
}

export default function Sidebar({ mobileMenuOpen, onLinkClick }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-full w-64 glass border-r border-border-default z-50 flex flex-col transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0 lg:translate-x-0' : '-translate-x-full lg:translate-x-0 lg:flex hidden'
      }`}
    >
      {/* Logo */}
      <div className="p-5 border-b border-border-default">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" onClick={onLinkClick}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow-primary">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black font-display gradient-text tracking-tight">趣学伴</span>
              <p className="text-[11px] text-text-muted leading-tight tracking-wide">升学规划中心</p>
            </div>
          </Link>
          <button
            onClick={onLinkClick}
            className="lg:hidden w-9 h-9 rounded-lg bg-surface border border-border-default flex items-center justify-center text-text-secondary hover:text-white hover:border-border-strong transition-colors"
            aria-label="关闭菜单"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="px-3 mb-2 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onLinkClick}
                    aria-current={isActive ? 'page' : undefined}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-dim text-white border border-primary/20'
                        : 'text-text-tertiary hover:text-white hover:bg-surface-light'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary shadow-glow-primary" />
                    )}
                    <item.icon className={`w-[18px] h-[18px] transition-colors ${isActive ? 'text-primary' : 'text-text-muted group-hover:text-text-secondary'}`} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Version */}
      <div className="p-4 border-t border-border-default">
        <p className="px-3 text-[11px] text-text-muted tabular-nums">
          趣学伴 v{packageInfo.version}
        </p>
      </div>
    </aside>
  );
}
