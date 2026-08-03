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
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="bg-surface-elevated/95 backdrop-blur-md border-t border-border-subtle px-2 pb-safe">
        <div className="flex items-center justify-around h-[60px]">
          {navItems.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative flex flex-col items-center justify-center flex-1 h-full focus-ring rounded-xl"
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-bottom-active"
                    className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-primary' : 'text-text-muted'
                  }`}
                />
                <span
                  className={`text-2xs mt-1 font-medium transition-colors ${
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
