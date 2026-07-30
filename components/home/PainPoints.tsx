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
            <div className="flex items-center gap-2 mb-3">
              <span className="indicator-dot" />
              <span className="text-micro font-mono text-primary uppercase tracking-widest">
                The Problem
              </span>
            </div>
            <h2 className="text-h2 font-display mb-4">
              上海升学
              <br />
              <span className="text-text-muted">不是信息不够</span>
              <br />
              是信息太杂
            </h2>
            <p className="text-body text-text-tertiary leading-relaxed max-w-sm">
              政策每年微调、学校要求各不相同、时间节点密集。家长最缺的不是资源，而是一张清晰的执行地图。
            </p>
          </MotionSection>

          <div className="space-y-4">
            {pains.map((pain, index) => (
              <MotionSection
                key={pain.number}
                direction="left"
                delay={index * 0.1}
                duration={0.5}
              >
                <div className="hud-panel hud-panel-hover p-4 sm:p-5 group">
                  <div className="flex gap-4">
                    <span className="data-value text-h3 text-text-muted group-hover:text-primary transition-colors duration-300">
                      {pain.number}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-h4 font-display mb-1.5 text-text-primary group-hover:text-primary transition-colors duration-300">
                        {pain.title}
                      </h3>
                      <p className="text-caption text-text-tertiary leading-relaxed">
                        {pain.description}
                      </p>
                    </div>
                  </div>
                  <div className="neon-line mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </MotionSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
