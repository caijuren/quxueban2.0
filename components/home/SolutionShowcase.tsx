'use client';

import { Check, Route, Calendar, LineChart, Brain } from 'lucide-react';
import CommandCard from '@/components/ui/CommandCard';
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
            <CommandCard corner className="p-1">
              <div className="rounded-xl bg-background p-5 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[11px] font-mono text-slate-500">趣学伴 · 总览</span>
                  </div>
                  <span className="text-[11px] font-mono text-primary">LIVE</span>
                </div>

                <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-300">当前主路线</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">执行中</span>
                  </div>
                  <div className="text-base font-bold font-display">三公冲刺路线</div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full w-[68%] rounded-full bg-primary" />
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-slate-500">OVERALL 68%</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[11px] text-slate-500 mb-1">本月任务</div>
                    <div className="text-xl font-bold font-display text-white">12</div>
                    <div className="text-[11px] text-success mt-1">已完成 8</div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[11px] text-slate-500 mb-1">风险提醒</div>
                    <div className="text-xl font-bold font-display text-warning">2</div>
                    <div className="text-[11px] text-slate-500 mt-1">需关注</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-[11px] text-slate-500 mb-2">AI 诊断摘要</div>
                  <p className="text-sm text-slate-300">英语进度良好，奥数需加强，建议本月完成机构试听。</p>
                </div>
              </div>
            </CommandCard>
          </MotionSection>

          <MotionSection
            direction="left"
            duration={0.7}
            className="space-y-6 order-1 lg:order-2"
          >
            <div>
              <span className="text-[11px] font-mono text-primary uppercase tracking-widest mb-3 block">
                How it works
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display leading-tight mb-4">
                把复杂路线
                <br />
                <span className="text-slate-500">变成每日行动</span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed">
                不再被海量信息淹没，你只需要跟着系统一步步走。
              </p>
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => (
                <MotionSection
                  key={step.text}
                  direction="up"
                  delay={index * 0.1}
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <step.icon className="w-4 h-4 text-primary" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold font-display">{step.text}</h3>
                  </div>
                  <Check className="w-4 h-4 text-slate-600" aria-hidden="true" />
                </MotionSection>
              ))}
            </div>
          </MotionSection>
        </div>
      </div>
    </section>
  );
}
