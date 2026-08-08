'use client';

import { Icon } from '@/components/ui/icon';
import CommandCard from '@/components/ui/CommandCard';
import MotionSection from '@/components/ui/MotionSection';

const stats = [
  { value: '10+', label: '升学路线模板' },
  { value: '50+', label: '目标学校库' },
  { value: '100+', label: '种子家庭使用' },
];

const testimonials = [
  {
    content: '以前总觉得三公离我们很远，用了趣学伴后才发现，原来每个年级都有明确的准备节点。',
    author: '嘉定区 · 二年级家长',
  },
  {
    content: '终于不用在群里翻聊天记录找政策了，所有时间点和任务都清清楚楚。',
    author: '浦东新区 · 四年级家长',
  },
];

export default function TrustProof() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <MotionSection direction="up" duration={0.6} className="mb-12">
          <span className="mb-3 block font-mono text-[11px] uppercase tracking-widest text-primary">
            Trust
          </span>
          <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
            已有家长把焦虑
            <br />
            <span className="text-text-muted">变成行动力</span>
          </h2>
        </MotionSection>

        <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <MotionSection key={stat.label} direction="up" delay={index * 0.08}>
              <CommandCard className="h-full p-5">
                <div className="mb-1 font-display text-3xl font-bold tabular-nums text-text-primary sm:text-4xl">
                  {stat.value}
                </div>
                <div className="text-xs text-text-muted">{stat.label}</div>
              </CommandCard>
            </MotionSection>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {testimonials.map((item, index) => (
            <MotionSection key={index} direction="up" delay={index * 0.1}>
              <CommandCard className="relative h-full p-5">
                <Icon
                  name="Quote"
                  size="md"
                  className="text-primary/20 absolute right-5 top-5"
                  aria-hidden="true"
                />
                <p className="mb-4 pr-6 text-sm leading-relaxed text-text-secondary">
                  &ldquo;{item.content}&rdquo;
                </p>
                <p className="font-mono text-[11px] text-text-muted">{item.author}</p>
              </CommandCard>
            </MotionSection>
          ))}
        </div>
      </div>
    </section>
  );
}
