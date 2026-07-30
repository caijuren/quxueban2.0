'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Route, CalendarCheck, BarChart3, Brain, Menu, X } from 'lucide-react';
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass shadow-panel border-b border-border-default"
      aria-label="主导航"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group" aria-label="趣学伴首页">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-glow-primary">
              <Brain className="w-4 h-4 text-text-primary" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold font-display tracking-tight text-text-primary">
              趣学伴
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.name} href={item.href} aria-current={active ? 'page' : undefined}>
                  <span
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'text-primary bg-primary/10 shadow-glow-sm'
                        : 'text-text-tertiary hover:text-text-primary hover:bg-black/5'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" aria-hidden="true" />
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:block">
              <span className="px-4 py-1.5 rounded-full bg-primary text-text-primary hover:shadow-neon text-sm font-semibold hover:bg-primary-glow transition-all duration-200">
                登录 / 注册
              </span>
            </Link>
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-black/5 transition-colors focus-ring"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border-default bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'text-primary bg-primary/10'
                        : 'text-text-tertiary hover:text-text-primary hover:bg-black/5'
                    }`}
                  >
                    <item.icon className="w-4 h-4" aria-hidden="true" />
                    {item.name}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-white/5 mt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-text-primary hover:shadow-neon text-sm font-semibold hover:bg-primary-glow transition-colors"
                >
                  登录 / 注册
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
