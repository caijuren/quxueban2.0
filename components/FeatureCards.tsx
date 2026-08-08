'use client';

import { Icon } from '@/components/ui/icon';
import CommandCard from '@/components/ui/CommandCard';
import MotionSection from '@/components/ui/MotionSection';

const features = [
  {
    icon: 'Route',
    title: '多路线并行规划',
    description: '三公、摇号、对口、直升同步评估，主路线失败自动切换到备选方案',
  },
  {
    icon: 'ListChecks',
    title: '任务拆解到每周',
    description: '从年级目标拆到学期、月度、周计划，知道这周该做什么、做到什么程度',
  },
  {
    icon: 'LineChart',
    title: '进度一目了然',
    description: '可视化总览实时掌握各科准备度，哪里超前、哪里落后，一眼看清',
  },
  {
    icon: 'Bot',
    title: 'AI 主动预警',
    description: '智能诊断路线匹配度，关键任务逾期、概率下降时主动提醒调整',
  },
] as const;

export default function FeatureCards() {
  return (
    <section className="border-y border-border-subtle px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <MotionSection direction="up" duration={0.6} className="mb-12">
          <span className="mb-3 block font-mono text-[11px] uppercase tracking-widest text-primary">
            Capabilities
          </span>
          <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
            不只是记录工具
            <br />
            <span className="text-text-muted">更是一套升学战略系统</span>
          </h2>
        </MotionSection>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {features.map((feature, index) => (
            <MotionSection key={feature.title} direction="up" delay={index * 0.08}>
              <CommandCard className="group h-full p-5" corner={index === 0}>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 group-hover:bg-primary/20 flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200">
                    <Icon
                      name={feature.icon}
                      size="md"
                      className="text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h3 className="mb-1.5 font-display text-base font-bold text-text-primary transition-colors duration-200 group-hover:text-primary">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-text-tertiary">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CommandCard>
            </MotionSection>
          ))}
        </div>
      </div>
    </section>
  );
}
