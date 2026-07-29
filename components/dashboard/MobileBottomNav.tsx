'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Target, Calendar, Bell, Route, User } from 'lucide-react';

const navItems = [
  { name: '今日作战', href: '/dashboard/today', icon: Target },
  { name: '周任务', href: '/dashboard/weekly', icon: Calendar },
  { name: '作战室', href: '/dashboard/alerts', icon: Bell },
  { name: '路线方案', href: '/dashboard/plan', icon: Route },
  { name: '我的', href: '/dashboard/settings', icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="glass border-t border-border-default px-2 pb-safe">
        <div className="flex items-center justify-around h-[64px]">
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
                    className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary shadow-glow-primary"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon
                  className={`w-[22px] h-[22px] transition-colors ${
                    isActive ? 'text-primary' : 'text-text-muted'
                  }`}
                />
                <span
                  className={`text-[11px] mt-1 font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-text-muted'
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
