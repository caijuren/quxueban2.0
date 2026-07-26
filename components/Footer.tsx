'use client';

import { Brain } from 'lucide-react';
import Link from 'next/link';

const footerLinks = [
  { name: '首页', href: '/' },
  { name: '路线方案', href: '/plan' },
  { name: '里程碑', href: '/milestones' },
  { name: '进度追踪', href: '/progress' },
  { name: 'AI 检视', href: '/ai' },
];

export default function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold font-display text-white">趣学伴</span>
          </Link>
          <p className="text-sm text-slate-500">
            上海升学战略执行系统 · 为家长把复杂政策变成清晰计划
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
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
        </div>
      </div>
    </footer>
  );
}
