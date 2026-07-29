'use client';

import {
  LayoutDashboard,
  Route,
  Brain,
  Sparkles,
  Languages,
  Calculator,
  BookText,
  Calendar,
  Bell,
  Target,
  Settings,
  X,
} from 'lucide-react';
import packageInfo from '@/package.json';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuGroups = [
  {
    title: '核心规划',
    items: [
      { name: '仪表盘', href: '/dashboard', icon: LayoutDashboard },
      { name: '路线方案', href: '/dashboard/plan', icon: Route },
    ],
  },
  {
    title: '学科作战室',
    items: [
      { name: '英语学科', href: '/dashboard/subjects/english', icon: Languages },
      { name: '数学学科', href: '/dashboard/subjects/math', icon: Calculator },
      { name: '语文学科', href: '/dashboard/subjects/chinese', icon: BookText },
    ],
  },
  {
    title: '执行跟踪',
    items: [
      { name: '今日作战', href: '/dashboard/today', icon: Target },
      { name: '周任务', href: '/dashboard/weekly', icon: Calendar },
      { name: '作战室', href: '/dashboard/alerts', icon: Bell },
    ],
  },
  {
    title: '智能参谋',
    items: [{ name: 'AI 检视', href: '/dashboard/ai', icon: Brain }],
  },
  {
    title: '系统',
    items: [{ name: '系统设置', href: '/dashboard/settings', icon: Settings }],
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
              <p className="text-[11px] text-text-muted leading-tight tracking-wide">升学作战指挥中心</p>
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
