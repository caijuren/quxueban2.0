'use client';

import { motion } from 'framer-motion';
import { Check, Route, Calendar, LineChart, Brain } from 'lucide-react';

const steps = [
  { icon: Route, text: '选定主路线 + 备选路线' },
  { icon: Calendar, text: '按时间节点拆解任务' },
  { icon: LineChart, text: '持续追踪执行进度' },
  { icon: Brain, text: 'AI 诊断并动态调整' },
];

export default function SolutionShowcase() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Product mockup */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            <div className="rounded-2xl border border-white/10 bg-surface/50 p-1 corner-accent">
              <div className="rounded-xl bg-background p-5 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-xs font-mono text-slate-500">趣学伴 · 仪表盘</span>
                  </div>
                  <span className="text-xs font-mono text-primary">LIVE</span>
                </div>

                <div className="p-4 rounded-lg bg-surface border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-300">当前主路线</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">执行中</span>
                  </div>
                  <div className="text-lg font-bold font-display">三公冲刺路线</div>
                  <div className="mt-3 h-1.5 rounded-full bg-surface-light overflow-hidden">
                    <div className="h-full w-[68%] rounded-full bg-primary" />
                  </div>
                  <div className="mt-2 text-xs font-mono text-slate-500">OVERALL 68%</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-lg bg-surface border border-white/5">
                    <div className="text-xs text-slate-500 mb-1">本月任务</div>
                    <div className="text-2xl font-bold font-display text-white">12</div>
                    <div className="text-xs text-success mt-1">已完成 8</div>
                  </div>
                  <div className="p-4 rounded-lg bg-surface border border-white/5">
                    <div className="text-xs text-slate-500 mb-1">风险提醒</div>
                    <div className="text-2xl font-bold font-display text-warning">2</div>
                    <div className="text-xs text-slate-500 mt-1">需关注</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-surface border border-white/5">
                  <div className="text-xs text-slate-500 mb-2">AI 检视摘要</div>
                  <p className="text-sm text-slate-300">英语进度良好，奥数需加强，建议本月完成机构试听。</p>
                </div>
              </div>
            </div>

            {/* Decorative glow */}
            <div className="absolute -inset-4 bg-primary/5 blur-3xl -z-10 rounded-full" />
          </motion.div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8 order-1 lg:order-2"
          >
            <div>
              <span className="text-xs font-mono text-primary uppercase tracking-widest mb-4 block">
                How it works
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold font-display leading-tight mb-6">
                把复杂路线
                <br />
                <span className="text-slate-500">变成每日行动</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                不再被海量信息淹没，你只需要跟着系统一步步走。
              </p>
            </div>

            <div className="space-y-5">
              {steps.map((step, index) => (
                <motion.div
                  key={step.text}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-surface/30 hover:border-primary/20 transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold font-display">{step.text}</h3>
                  </div>
                  <Check className="w-5 h-5 text-slate-600" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
