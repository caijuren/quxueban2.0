'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Target, Calendar, Bell, Wrench, Settings } from 'lucide-react';

const navItems = [
  { name: '今日任务', href: '/dashboard/today', icon: Target },
  { name: '周计划', href: '/dashboard/weekly', icon: Calendar },
  { name: '提醒中心', href: '/dashboard/alerts', icon: Bell },
  { name: '规划工具', href: '/dashboard/toolbox', icon: Wrench },
  { name: '设置', href: '/dashboard/settings', icon: Settings },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
      <div className="bg-surface-elevated/95 pb-safe border-t border-border-subtle px-2 backdrop-blur-md">
        <div className="flex h-[60px] items-center justify-around">
          {navItems.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className="focus-ring relative flex h-full flex-1 flex-col items-center justify-center rounded-xl"
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-bottom-active"
                    className="absolute left-1/2 top-1 h-1 w-6 -translate-x-1/2 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon
                  className={`size-5 transition-colors ${
                    isActive ? 'text-primary' : 'text-text-muted'
                  }`}
                />
                <span
                  className={`mt-1 text-2xs font-medium transition-colors ${
                    isActive ? 'text-text-primary' : 'text-text-muted'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
