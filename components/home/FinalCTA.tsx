'use client';

import { Icon } from '@/components/ui/icon';
import Link from 'next/link';
import MotionSection from '@/components/ui/MotionSection';

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      <div className="via-primary/5 absolute inset-0 bg-gradient-to-b from-transparent to-transparent" />
      <div className="bg-primary/10 absolute left-1/2 top-1/2 -z-10 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]" />

      <MotionSection
        direction="up"
        duration={0.7}
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        <h2 className="mb-5 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          现在就为孩子绘制
          <br />
          <span className="text-text-muted">第一张升学规划图</span>
        </h2>

        <p className="mx-auto mb-8 max-w-lg text-base text-text-tertiary">
          不需要复杂设置，5 分钟建立孩子档案，立刻看到当前阶段的关键任务和路线建议。
        </p>

        <Link
          href="/login"
          className="hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-text-primary transition-colors"
        >
          免费开始规划
          <Icon name="ArrowRight" size="sm" />
        </Link>
      </MotionSection>
    </section>
  );
}
