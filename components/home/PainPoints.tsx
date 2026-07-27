'use client';

import MotionSection from '@/components/ui/MotionSection';

const pains = [
  {
    number: '01',
    title: '关键节点总怕错过',
    description: '三公报名、民办摇号、名额分配、自招……每个窗口期都很短，一不留神就错过最佳准备时机。',
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
    <section className="py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <MotionSection direction="up" duration={0.6}>
            <span className="text-[11px] font-mono text-primary uppercase tracking-widest mb-3 block">
              The Problem
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display leading-tight mb-4">
              上海升学
              <br />
              <span className="text-slate-500">不是信息不够</span>
              <br />
              是信息太杂
            </h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
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
                className="group flex gap-5 pb-6 border-b border-white/5 last:border-0 last:pb-0"
              >
                <span className="text-2xl font-mono text-slate-700 font-bold group-hover:text-primary transition-colors duration-300">
                  {pain.number}
                </span>
                <div>
                  <h3 className="text-lg font-bold font-display mb-1.5 text-white group-hover:text-primary transition-colors duration-300">
                    {pain.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{pain.description}</p>
                </div>
              </MotionSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
