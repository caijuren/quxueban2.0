'use client';
import { Icon } from '@/components/ui/icon';

import { useEffect } from 'react';
import Link from 'next/link';

import AppShell from '@/components/layout/app-shell';
import { getTheme, setTheme } from '@/lib/theme';

const navItems = [
  { href: '/admin', icon: 'LayoutDashboard', label: '概览' },
  { href: '/admin/users', icon: 'Users', label: '用户管理' },
  { href: '/admin/ai-config', icon: 'Sparkles', label: 'AI 配置' },
];

export default function AdminShellClient({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    return () => {
      const saved = getTheme();
      setTheme(saved);
    };
  }, []);

  return (
    <AppShell
      title="趣学伴管理平台"
      navItems={navItems}
      logo={
        <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
          <Icon name="Shield" size="md" className="text-text-primary" />
        </div>
      }
      userMenu={
        <Link
          href="/dashboard"
          className="text-sm text-text-muted transition-colors hover:text-text-secondary"
        >
          返回前台
        </Link>
      }
    >
      {children}
    </AppShell>
  );
}
