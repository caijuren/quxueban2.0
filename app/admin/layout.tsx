import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, LayoutDashboard, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: '管理后台 - 趣学伴',
  description: '趣学伴管理员后台',
};

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: '概览' },
  { href: '/admin/users', icon: Users, label: '用户' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-30 hidden h-full w-64 border-r border-white/10 bg-surface lg:block">
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold font-display">管理后台</span>
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-slate-100"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-surface/80 px-4 backdrop-blur lg:left-64 lg:px-8">
        <h1 className="text-lg font-semibold">趣学伴管理平台</h1>
        <Link
          href="/dashboard"
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          返回前台
        </Link>
      </header>

      <main className="min-h-screen pt-16 lg:pl-64">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
