'use client';

import { Route, ListChecks, LineChart, Bot } from 'lucide-react';
import MotionSection from '@/components/ui/MotionSection';

const features = [
  {
    icon: Route,
    title: '多路线并行规划',
    description: '三公、摇号、对口、直升同步评估，主路线失败自动切换到备选方案',
  },
  {
    icon: ListChecks,
    title: '任务拆解到每周',
    description: '从年级目标拆到学期、月度、周计划，知道这周该做什么、做到什么程度',
  },
  {
    icon: LineChart,
    title: '进度一目了然',
    description: '可视化仪表盘实时掌握各科准备度，哪里超前、哪里落后，一眼看清',
  },
  {
    icon: Bot,
    title: 'AI 主动预警',
    description: '智能诊断路线匹配度，关键任务逾期、概率下降时主动提醒调整',
  },
];

export default function FeatureCards() {
  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 border-y border-border-default/50">
      <div className="max-w-6xl mx-auto">
        <MotionSection direction="up" duration={0.6} className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="indicator-dot" />
            <span className="text-micro font-mono text-primary uppercase tracking-widest">
              Capabilities
            </span>
          </div>
          <h2 className="text-h2 font-display">
            不只是记录工具
            <br />
            <span className="text-text-muted">更是一套升学战略系统</span>
          </h2>
        </MotionSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <MotionSection
              key={feature.title}
              direction="up"
              delay={index * 0.08}
            >
              <div className={`hud-panel hud-panel-hover h-full p-5 group ${index === 0 ? 'corner-accent' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors duration-200">
                    <feature.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-h4 font-display mb-1.5 text-text-primary group-hover:text-primary transition-colors duration-200">
                      {feature.title}
                    </h3>
                    <p className="text-caption text-text-tertiary leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </MotionSection>
          ))}
        </div>
      </div>
    </section>
  );
}
