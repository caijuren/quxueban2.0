'use client';

import { motion } from 'framer-motion';
import { Home, Route, CalendarCheck, BarChart3, Brain } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: '首页', href: '/', icon: Home },
  { name: '路线方案', href: '/plan', icon: Route },
  { name: '里程碑', href: '/milestones', icon: CalendarCheck },
  { name: '进度追踪', href: '/progress', icon: BarChart3 },
  { name: 'AI 检视', href: '/ai', icon: Brain },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center glow-primary">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-white">
              趣学伴
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <span
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          <Link href="/login">
            <button className="px-5 py-2 rounded-full bg-white text-background text-sm font-semibold hover:bg-slate-200 transition-all duration-300">
              登录 / 注册
            </button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
