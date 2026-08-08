'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import PageContainer from './page-container';

export interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

export interface AppShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  logo?: React.ReactNode;
  title?: string;
  userMenu?: React.ReactNode;
}

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
      )}
    >
      <item.icon className="size-5 shrink-0" />
      {item.label}
    </Link>
  );
}

export default function AppShell({ children, navItems, logo, title, userMenu }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - desktop */}
      <aside className="fixed left-0 top-0 z-sidebar hidden h-full w-64 border-r border-border-subtle bg-bg-secondary lg:block">
        <div className="flex h-16 items-center gap-3 border-b border-border-subtle px-6">
          {logo}
          {title && <span className="text-lg font-bold text-text-primary">{title}</span>}
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>
      </aside>

      {/* Header */}
      <header className="bg-bg-header/80 fixed inset-x-0 top-0 z-header flex h-16 items-center justify-between border-b border-border-subtle px-4 backdrop-blur lg:left-64 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover lg:hidden"
            aria-label="打开菜单"
          >
            <Menu className="size-5" />
          </button>
          {!title && logo}
        </div>
        <div className="flex items-center gap-4">{userMenu}</div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="z-drawer bg-background/80 fixed inset-0 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="z-drawer fixed left-0 top-0 h-full w-64 border-r border-border-subtle bg-bg-secondary lg:hidden">
            <div className="flex h-16 items-center justify-between border-b border-border-subtle px-4">
              <div className="flex items-center gap-3">
                {logo}
                {title && <span className="text-lg font-bold text-text-primary">{title}</span>}
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-text-secondary hover:bg-surface-hover"
                aria-label="关闭菜单"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="space-y-1 p-4">
              {navItems.map((item) => (
                <NavLink key={item.href} item={item} onClick={() => setMobileOpen(false)} />
              ))}
            </nav>
          </aside>
        </>
      )}

      {/* Main */}
      <main className="min-h-screen pt-16 lg:pl-64">
        <PageContainer>{children}</PageContainer>
      </main>
    </div>
  );
}
