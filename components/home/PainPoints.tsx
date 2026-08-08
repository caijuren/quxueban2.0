'use client';

import MotionSection from '@/components/ui/MotionSection';

const pains = [
  {
    number: '01',
    title: '关键节点总怕错过',
    description:
      '三公报名、民办摇号、名额分配、自招……每个窗口期都很短，一不留神就错过最佳准备时机。',
  },
  {
    number: '02',
    title: '路线太多不知道选哪条',
    description: '对口、摇号、三公、直升、中考、国际路线并行，主路线和备选方案怎么搭配才最稳？',
  },
  {
    number: '03',
    title: '学了但不知道离目标多远',
    description: '报了很多班、做了很多题，但没有一套清晰的标准来衡量孩子离目标学校还有多远。',
  },
];

export default function PainPoints() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <MotionSection direction="up" duration={0.6}>
            <span className="mb-3 block font-mono text-[11px] uppercase tracking-widest text-primary">
              The Problem
            </span>
            <h2 className="mb-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
              上海升学
              <br />
              <span className="text-text-muted">不是信息不够</span>
              <br />
              是信息太杂
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-text-tertiary">
              政策每年微调、学校要求各不相同、时间节点密集。家长最缺的不是资源，而是一张清晰的执行地图。
            </p>
          </MotionSection>

          <div className="space-y-6">
            {pains.map((pain, index) => (
              <MotionSection
                key={pain.number}
                direction="left"
                delay={index * 0.1}
                duration={0.5}
                className="group flex gap-5 border-b border-border-subtle pb-6 last:border-0 last:pb-0"
              >
                <span className="font-mono text-2xl font-bold text-text-muted transition-colors duration-300 group-hover:text-primary">
                  {pain.number}
                </span>
                <div>
                  <h3 className="mb-1.5 font-display text-lg font-bold text-text-primary transition-colors duration-300 group-hover:text-primary">
                    {pain.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-tertiary">{pain.description}</p>
                </div>
              </MotionSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
