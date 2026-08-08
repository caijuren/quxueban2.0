'use client';

import { Icon } from '@/components/ui/icon';
import Link from 'next/link';

const footerLinks = [
  { name: '首页', href: '/' },
  { name: '路线方案', href: '/plan' },
  { name: '里程碑', href: '/milestones' },
  { name: '进度追踪', href: '/progress' },
  { name: 'AI 诊断', href: '/ai' },
  { name: '隐私协议', href: '/privacy' },
  { name: '用户协议', href: '/terms' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <Link href="/" className="group flex items-center gap-2" aria-label="趣学伴首页">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary">
              <Icon name="Brain" size="xs" className="text-text-primary" aria-hidden="true" />
            </div>
            <span className="font-display text-base font-bold text-text-primary">趣学伴</span>
          </Link>
          <p className="text-center text-xs text-text-muted">
            上海升学战略执行系统 · 为家长把复杂政策变成清晰计划
          </p>
          <nav aria-label="页脚导航">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-text-tertiary">
              {footerLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="transition-colors hover:text-primary"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
}
