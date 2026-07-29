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
      className={`fixed left-0 top-0 h-full w-64 glass border-r border-white/[0.06] z-50 flex flex-col transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0 lg:translate-x-0' : '-translate-x-full lg:translate-x-0 lg:flex hidden'
      }`}
    >
      {/* Logo */}
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" onClick={onLinkClick}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold font-display gradient-text">趣学伴</span>
              <p className="text-[10px] text-slate-500 leading-tight">升学作战指挥中心</p>
            </div>
          </Link>
          <button
            onClick={onLinkClick}
            className="lg:hidden w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="关闭菜单"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="px-3 mb-1.5 text-xs font-medium text-slate-500">
              {group.title}
            </p>
            <div className="space-y-0.5">
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
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-white/[0.06] text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-primary shadow-glow-primary" />
                    )}
                    <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Version */}
      <div className="p-3 border-t border-white/[0.06]">
        <p className="px-3 text-[10px] text-slate-600">
          趣学伴 v{packageInfo.version}
        </p>
      </div>
    </aside>
  );
}
