'use client';

import { Icon } from '@/components/ui/icon';
import packageInfo from '@/package.json';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuGroups = [
  {
    title: '概览',
    items: [{ name: '总览', href: '/dashboard', icon: 'LayoutDashboard' }],
  },
  {
    title: '任务',
    items: [
      { name: '今日任务', href: '/dashboard/today', icon: 'Target' },
      { name: '周计划', href: '/dashboard/weekly', icon: 'Calendar' },
      { name: '任务库', href: '/dashboard/task-library', icon: 'Library' },
      { name: '提醒中心', href: '/dashboard/alerts', icon: 'Bell' },
    ],
  },
  {
    title: '报告',
    items: [{ name: '成长报告', href: '/dashboard/reports', icon: 'BarChart3' }],
  },
  {
    title: 'AI 助手',
    items: [
      { name: 'AI 诊断', href: '/dashboard/ai', icon: 'Brain' },
      { name: 'AI 学习助手', href: '/dashboard/ai-assistant', icon: 'MessageSquare' },
    ],
  },
  {
    title: '规划工具',
    items: [{ name: '规划工具', href: '/dashboard/toolbox', icon: 'Wrench' }],
  },
  {
    title: '系统',
    items: [{ name: '设置', href: '/dashboard/settings', icon: 'Settings' }],
  },
] as const;

interface SidebarProps {
  mobileMenuOpen?: boolean;
  onLinkClick?: () => void;
}

export default function Sidebar({ mobileMenuOpen, onLinkClick }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`bg-surface-elevated/95 fixed left-0 top-0 z-50 flex h-full w-56 flex-col border-r border-border-default backdrop-blur-md transition-transform duration-300 ${
        mobileMenuOpen
          ? 'translate-x-0 lg:translate-x-0'
          : 'hidden -translate-x-full lg:flex lg:translate-x-0'
      }`}
    >
      {/* Logo */}
      <div className="border-b border-border-default p-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" onClick={onLinkClick}>
            <div className="flex size-10 items-center justify-center rounded-module border border-border-default bg-surface">
              <Icon name="Sparkles" size="md" className="text-primary" />
            </div>
            <div>
              <span className="font-display text-xl font-black tracking-tight text-text-primary">
                趣学伴
              </span>
              <p className="text-2xs leading-tight tracking-wide text-text-muted">升学规划中心</p>
            </div>
          </Link>
          <button
            onClick={onLinkClick}
            className="flex size-9 items-center justify-center rounded-module bg-surface text-text-secondary transition-colors hover:bg-surface-highlight hover:text-text-primary lg:hidden"
            aria-label="关闭菜单"
          >
            <Icon name="X" size="md" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-5 overflow-y-auto p-3">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-3 text-2xs font-semibold uppercase tracking-wider text-text-muted">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onLinkClick}
                    aria-current={isActive ? 'page' : undefined}
                    className={`group relative flex items-center gap-3 rounded-module px-3 py-2.5 transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/[0.08] text-text-primary'
                        : 'text-text-tertiary hover:bg-surface-elevated hover:text-text-primary'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
                    )}
                    <Icon
                      name={item.icon}
                      size="md"
                      className={`transition-colors ${isActive ? 'text-primary' : 'text-text-muted group-hover:text-text-secondary'}`}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Version */}
      <div className="border-t border-border-default p-4">
        <p className="px-3 text-2xs tabular-nums text-text-muted">趣学伴 v{packageInfo.version}</p>
      </div>
    </aside>
  );
}
