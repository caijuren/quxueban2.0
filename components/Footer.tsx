'use client';

import { Brain } from 'lucide-react';
import Link from 'next/link';

const footerLinks = [
  { name: '首页', href: '/' },
  { name: '路线方案', href: '/plan' },
  { name: '里程碑', href: '/milestones' },
  { name: '进度追踪', href: '/progress' },
  { name: 'AI 检视', href: '/ai' },
  { name: '隐私协议', href: '/privacy' },
  { name: '用户协议', href: '/terms' },
];

export default function Footer() {
  return (
    <footer className="py-10 px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-2 group" aria-label="趣学伴首页">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-white" aria-hidden="true" />
            </div>
            <span className="text-base font-bold font-display text-white">趣学伴</span>
          </Link>
          <p className="text-xs text-slate-500 text-center">
            上海升学战略执行系统 · 为家长把复杂政策变成清晰计划
          </p>
          <nav aria-label="页脚导航">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-400">
              {footerLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-primary transition-colors"
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
