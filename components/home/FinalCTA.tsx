'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import MotionSection from '@/components/ui/MotionSection';

export default function FinalCTA() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/10 rounded-full blur-[140px] -z-10" />

      <MotionSection
        direction="up"
        duration={0.7}
        className="max-w-3xl mx-auto text-center relative z-10"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display leading-tight mb-5">
          现在就为孩子绘制
          <br />
          <span className="text-slate-500">第一张升学作战图</span>
        </h2>

        <p className="text-base text-slate-400 max-w-lg mx-auto mb-8">
          不需要复杂设置，5 分钟建立孩子档案，立刻看到当前阶段的关键任务和路线建议。
        </p>

        <Link
          href="/login"
          className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-white font-semibold text-sm hover:shadow-[0_0_50px_rgba(255,45,106,0.35)] transition-all duration-300 focus-ring"
        >
          免费开始规划
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </MotionSection>
    </section>
  );
}
