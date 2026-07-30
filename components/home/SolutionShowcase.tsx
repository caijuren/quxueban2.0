'use client';

import { Check, Route, Calendar, LineChart, Brain } from 'lucide-react';
import MotionSection from '@/components/ui/MotionSection';

const steps = [
  { icon: Route, text: '选定主路线 + 备选路线' },
  { icon: Calendar, text: '按时间节点拆解任务' },
  { icon: LineChart, text: '持续追踪执行进度' },
  { icon: Brain, text: 'AI 诊断并动态调整' },
];

export default function SolutionShowcase() {
  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <MotionSection
            direction="right"
            duration={0.7}
            className="relative order-2 lg:order-1"
          >
            <div className="hud-panel corner-accent p-1">
              <div className="rounded-xl bg-background p-5 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="indicator-dot animate-pulse" />
                    <span className="text-micro font-mono text-text-muted">趣学伴 · 仪表盘</span>
                  </div>
                  <span className="text-micro font-mono text-primary">LIVE</span>
                </div>

                <div className="p-4 rounded-xl bg-surface-light border border-border-default">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-caption font-medium text-text-secondary">当前主路线</span>
                    <span className="text-micro px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                      执行中
                    </span>
                  </div>
                  <div className="text-h4 font-display">三公冲刺路线</div>
                  <div className="mt-3 h-1.5 rounded-full bg-black/5 overflow-hidden">
                    <div className="h-full w-[68%] rounded-full bg-primary" />
                  </div>
                  <div className="mt-2 text-micro font-mono text-text-muted">OVERALL 68%</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-surface-light border border-border-default">
                    <div className="text-micro text-text-muted mb-1">本月任务</div>
                    <div className="data-value text-h3 text-text-primary">12</div>
                    <div className="text-micro text-primary mt-1">已完成 8</div>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-light border border-border-default">
                    <div className="text-micro text-text-muted mb-1">风险提醒</div>
                    <div className="data-value text-h3 text-secondary">2</div>
                    <div className="text-micro text-text-muted mt-1">需关注</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-light border border-border-default">
                  <div className="text-micro text-text-muted mb-2">AI 检视摘要</div>
                  <p className="text-caption text-text-secondary">英语进度良好，奥数需加强，建议本月完成机构试听。</p>
                </div>
              </div>
            </div>
          </MotionSection>

          <MotionSection
            direction="left"
            duration={0.7}
            className="space-y-6 order-1 lg:order-2"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="indicator-dot" />
                <span className="text-micro font-mono text-primary uppercase tracking-widest">
                  How it works
                </span>
              </div>
              <h2 className="text-h2 font-display mb-4">
                把复杂路线
                <br />
                <span className="text-text-muted">变成每日行动</span>
              </h2>
              <p className="text-body text-text-tertiary leading-relaxed">
                不再被海量信息淹没，你只需要跟着系统一步步走。
              </p>
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => (
                <MotionSection
                  key={step.text}
                  direction="up"
                  delay={index * 0.1}
                >
                  <div className="hud-panel hud-panel-hover flex items-center gap-4 p-4">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <step.icon className="w-4 h-4 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-caption font-bold font-display">{step.text}</h3>
                    </div>
                    <Check className="w-4 h-4 text-text-muted" aria-hidden="true" />
                  </div>
                </MotionSection>
              ))}
            </div>
          </MotionSection>
        </div>
      </div>
    </section>
  );
}
