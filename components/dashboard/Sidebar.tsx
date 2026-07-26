'use client';

import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Route,
  CalendarCheck,
  School,
  BarChart3,
  Brain,
  Sparkles,
  Settings,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuGroups = [
  {
    title: '核心规划',
    items: [
      { name: '仪表盘', href: '/dashboard', icon: LayoutDashboard },
      { name: '路线方案', href: '/dashboard/plan', icon: Route },
      { name: '里程碑任务', href: '/dashboard/milestones', icon: CalendarCheck },
    ],
  },
  {
    title: '数据跟踪',
    items: [
      { name: '目标学校', href: '/dashboard/schools', icon: School },
      { name: '进度追踪', href: '/dashboard/progress', icon: BarChart3 },
    ],
  },
  {
    title: '智能工具',
    items: [{ name: 'AI 检视', href: '/dashboard/ai', icon: Brain }],
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
      className={`fixed left-0 top-0 h-full w-64 glass border-r border-white/5 z-50 flex flex-col transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0 lg:translate-x-0' : '-translate-x-full lg:translate-x-0 lg:flex hidden'
      }`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold font-display gradient-text">趣学伴</span>
            <p className="text-xs text-slate-500">上海升学战略系统</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-5 overflow-y-auto">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="px-4 mb-2 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link key={item.name} href={item.href} onClick={onLinkClick}>
                    <div
                      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/20'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                      )}
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300"
          aria-label="设置"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">设置</span>
        </button>
        <Link href="/" onClick={onLinkClick}>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-danger hover:bg-danger/10 transition-all duration-300">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">退出登录</span>
          </button>
        </Link>
      </div>
    </aside>
  );
}
