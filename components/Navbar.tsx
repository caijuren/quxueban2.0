'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: '首页', href: '/', icon: 'House' },
  { name: '路线方案', href: '/plan', icon: 'Route' },
  { name: '里程碑', href: '/milestones', icon: 'CalendarCheck' },
  { name: '进度追踪', href: '/progress', icon: 'BarChart3' },
  { name: 'AI 诊断', href: '/ai', icon: 'Brain' },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-surface-elevated/80 fixed inset-x-0 top-0 z-50 border-b border-border-subtle backdrop-blur-xl"
      aria-label="主导航"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="group flex items-center gap-2" aria-label="趣学伴首页">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Icon name="Brain" size="sm" className="text-text-primary" aria-hidden="true" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-text-primary">
              趣学伴
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.name} href={item.href} aria-current={active ? 'page' : undefined}>
                  <span
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-tertiary hover:bg-surface-hover hover:text-text-primary'
                    }`}
                  >
                    <Icon name={item.icon as IconName} size="xs" aria-hidden="true" />
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:block">
              <span className="hover:bg-primary/90 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-inverse transition-all duration-200">
                登录 / 注册
              </span>
            </Link>
            <Button
              variant="ghost"
              size="md"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="md:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
            >
              {mobileOpen ? <Icon name="X" size="md" /> : <Icon name="Menu" size="md" />}
            </Button>
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
            className="bg-background/95 border-t border-border-subtle backdrop-blur-xl md:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-tertiary hover:bg-surface-hover hover:text-text-primary'
                    }`}
                  >
                    <Icon name={item.icon as IconName} size="sm" aria-hidden="true" />
                    {item.name}
                  </Link>
                );
              })}
              <div className="mt-2 border-t border-border-subtle pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="hover:bg-primary/90 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-inverse transition-colors"
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
