'use client';

import { Icon } from '@/components/ui/icon';
import CommandCard from '@/components/ui/CommandCard';
import MotionSection from '@/components/ui/MotionSection';

const steps = [
  { icon: 'Route', text: '选定主路线 + 备选路线' },
  { icon: 'Calendar', text: '按时间节点拆解任务' },
  { icon: 'LineChart', text: '持续追踪执行进度' },
  { icon: 'Brain', text: 'AI 诊断并动态调整' },
] as const;

export default function SolutionShowcase() {
  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
      <div className="bg-primary/5 absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <MotionSection direction="right" duration={0.7} className="relative order-2 lg:order-1">
            <CommandCard corner className="p-1">
              <div className="space-y-4 rounded-xl bg-background p-5">
                <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-primary" />
                    <span className="font-mono text-[11px] text-text-muted">趣学伴 · 总览</span>
                  </div>
                  <span className="font-mono text-[11px] text-primary">LIVE</span>
                </div>

                <div className="rounded-lg border border-border-subtle bg-surface p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-text-secondary">当前主路线</span>
                    <span className="bg-primary/10 border-primary/20 rounded-md border px-2 py-0.5 text-[10px] text-primary">
                      执行中
                    </span>
                  </div>
                  <div className="font-display text-base font-bold text-text-primary">
                    三公冲刺路线
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-hover">
                    <div className="h-full w-[68%] rounded-full bg-primary" />
                  </div>
                  <div className="mt-2 font-mono text-[10px] text-text-muted">OVERALL 68%</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border-subtle bg-surface p-4">
                    <div className="mb-1 text-[11px] text-text-muted">本月任务</div>
                    <div className="font-display text-xl font-bold text-text-primary">12</div>
                    <div className="mt-1 text-[11px] text-success">已完成 8</div>
                  </div>
                  <div className="rounded-lg border border-border-subtle bg-surface p-4">
                    <div className="mb-1 text-[11px] text-text-muted">风险提醒</div>
                    <div className="font-display text-xl font-bold text-warning">2</div>
                    <div className="mt-1 text-[11px] text-text-muted">需关注</div>
                  </div>
                </div>

                <div className="rounded-lg border border-border-subtle bg-surface p-4">
                  <div className="mb-2 text-[11px] text-text-muted">AI 诊断摘要</div>
                  <p className="text-sm text-text-secondary">
                    英语进度良好，奥数需加强，建议本月完成机构试听。
                  </p>
                </div>
              </div>
            </CommandCard>
          </MotionSection>

          <MotionSection direction="left" duration={0.7} className="order-1 space-y-6 lg:order-2">
            <div>
              <span className="mb-3 block font-mono text-[11px] uppercase tracking-widest text-primary">
                How it works
              </span>
              <h2 className="mb-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
                把复杂路线
                <br />
                <span className="text-text-muted">变成每日行动</span>
              </h2>
              <p className="text-base leading-relaxed text-text-tertiary">
                不再被海量信息淹没，你只需要跟着系统一步步走。
              </p>
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => (
                <MotionSection
                  key={step.text}
                  direction="up"
                  delay={index * 0.1}
                  className="hover:border-primary/20 flex items-center gap-4 rounded-xl border border-border-subtle bg-surface p-4 transition-all duration-200 hover:bg-surface-hover"
                >
                  <div className="bg-primary/10 flex size-9 shrink-0 items-center justify-center rounded-lg">
                    <Icon name={step.icon} size="sm" className="text-primary" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-sm font-bold text-text-primary">
                      {step.text}
                    </h3>
                  </div>
                  <Icon name="Check" size="sm" className="text-text-muted" aria-hidden="true" />
                </MotionSection>
              ))}
            </div>
          </MotionSection>
        </div>
      </div>
    </section>
  );
}
