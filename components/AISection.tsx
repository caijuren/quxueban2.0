'use client';

import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';

const insights = [
  {
    icon: Target,
    title: '路线适配度分析',
    description: '基于孩子当前年级、能力、目标学校，评估三公 / 摇号 / 直升等路线的匹配程度',
  },
  {
    icon: TrendingUp,
    title: '进度健康度诊断',
    description: '对比同龄孩子平均准备节奏，识别超前、正常或落后的能力项',
  },
  {
    icon: AlertTriangle,
    title: '风险预警与调整',
    description: '当关键任务逾期或路线概率下降时，主动提醒并建议切换到备选方案',
  },
];

export default function AISection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* AI Report mockup */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <div className="rounded-2xl border border-white/10 bg-surface/50 p-1 corner-accent">
              <div className="rounded-xl bg-background p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-bold font-display">AI 检视报告</h3>
                      <p className="text-xs text-slate-500">基于当前进度生成</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-secondary">v2.4</span>
                </div>

                <div className="p-4 rounded-lg bg-success/5 border border-success/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-success" />
                    <span className="text-sm font-semibold text-success">路线匹配度 78%</span>
                  </div>
                  <p className="text-sm text-slate-400">当前主路线与目标学校匹配良好，建议继续保持节奏</p>
                </div>

                <div className="p-4 rounded-lg bg-warning/5 border border-warning/10">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <span className="text-sm font-semibold text-warning">需关注：奥数尚未启动</span>
                  </div>
                  <p className="text-sm text-slate-400">建议根据三公路线要求，提前布局关键能力项</p>
                </div>

                <div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold text-accent">本月重点任务</span>
                  </div>
                  <p className="text-sm text-slate-400">确定数学学习形式，建立每周稳定的学习节奏</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <span className="text-xs font-mono text-secondary uppercase tracking-widest mb-4 block">
              AI Intelligence
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold font-display leading-tight mb-6">
              不仅规划
              <br />
              <span className="text-slate-500">更会主动提醒调整</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              输入孩子当前进度，AI 帮你判断路线是否合理、哪些任务需要加强、是否需要启动备选方案。
            </p>

            <div className="space-y-6">
              {insights.map((insight, index) => (
                <motion.div
                  key={insight.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <insight.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display mb-1">{insight.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{insight.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
