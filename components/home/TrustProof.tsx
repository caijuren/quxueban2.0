'use client';

import { Quote } from 'lucide-react';
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
    <section className="py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <MotionSection direction="up" duration={0.6} className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="indicator-dot" />
            <span className="text-micro font-mono text-primary uppercase tracking-widest">
              Trust
            </span>
          </div>
          <h2 className="text-h2 font-display">
            已有家长把焦虑
            <br />
            <span className="text-text-muted">变成行动力</span>
          </h2>
        </MotionSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <MotionSection
              key={stat.label}
              direction="up"
              delay={index * 0.08}
            >
              <div className="hud-panel hud-panel-hover p-5 h-full">
                <div className="data-value text-h2 text-text-primary mb-1">{stat.value}</div>
                <div className="text-micro text-text-muted">{stat.label}</div>
              </div>
            </MotionSection>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((item, index) => (
            <MotionSection
              key={index}
              direction="up"
              delay={index * 0.1}
            >
              <div className="hud-panel hud-panel-hover p-5 h-full relative">
                <Quote className="absolute top-5 right-5 w-5 h-5 text-primary/20" aria-hidden="true" />
                <p className="text-caption text-text-secondary leading-relaxed mb-4 pr-6">
                  &ldquo;{item.content}&rdquo;
                </p>
                <p className="text-micro text-text-muted font-mono">{item.author}</p>
              </div>
            </MotionSection>
          ))}
        </div>
      </div>
    </section>
  );
}
