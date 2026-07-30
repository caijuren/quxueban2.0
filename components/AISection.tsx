'use client';

import { Target, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';
import MotionSection from '@/components/ui/MotionSection';

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

const reportItems = [
  {
    icon: Target,
    title: '路线匹配度 78%',
    status: '良好',
    variant: 'primary',
    description: '当前主路线与目标学校匹配良好，建议继续保持节奏',
    color: '#e11d48',
  },
  {
    icon: AlertTriangle,
    title: '需关注：奥数尚未启动',
    status: '风险',
    variant: 'secondary',
    description: '建议根据三公路线要求，提前布局关键能力项',
    color: '#7c3aed',
  },
  {
    icon: TrendingUp,
    title: '本月重点任务',
    status: '建议',
    variant: 'default',
    description: '确定数学学习形式，建立每周稳定的学习节奏',
    color: '#64748b',
  },
];

export default function AISection() {
  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 border-y border-border-default/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <MotionSection
            direction="right"
            duration={0.7}
            className="order-2 lg:order-1"
          >
            <div className="hud-panel corner-accent p-1">
              <div className="rounded-xl bg-background p-5 space-y-3">
                <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-secondary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-h4 font-display">AI 检视报告</h3>
                      <p className="text-micro text-text-muted">基于当前进度生成</p>
                    </div>
                  </div>
                  <span className="text-micro font-mono text-secondary">v2.4</span>
                </div>

                {reportItems.map((item) => (
                  <div
                    key={item.title}
                    className="p-4 rounded-xl border"
                    style={{
                      backgroundColor: `${item.color}08`,
                      borderColor: `${item.color}20`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <item.icon
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: item.color }}
                        aria-hidden="true"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-caption font-semibold" style={{ color: item.color }}>
                            {item.title}
                          </span>
                          <span
                            className="text-micro px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: `${item.color}20`, color: item.color }}
                          >
                            {item.status}
                          </span>
                        </div>
                        <p className="text-small text-text-tertiary leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-2">
                  <div className="neon-line mb-3 opacity-60" />
                  <div className="flex items-center justify-between">
                    <span className="text-micro text-text-muted">AI 建议 action</span>
                    <span className="text-micro font-mono text-primary">START MATH FOUNDATION</span>
                  </div>
                </div>
              </div>
            </div>
          </MotionSection>

          <MotionSection
            direction="left"
            duration={0.7}
            className="order-1 lg:order-2"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="indicator-dot" style={{ background: '#7c3aed', boxShadow: '0 0 8px rgba(124, 58, 237, 0.35)' }} />
              <span className="text-micro font-mono text-secondary uppercase tracking-widest">
                AI Intelligence
              </span>
            </div>
            <h2 className="text-h2 font-display mb-4">
              不仅规划
              <br />
              <span className="text-text-muted">更会主动提醒调整</span>
            </h2>
            <p className="text-body text-text-tertiary leading-relaxed mb-8">
              输入孩子当前进度，AI 帮你判断路线是否合理、哪些任务需要加强、是否需要启动备选方案。
            </p>

            <div className="space-y-3">
              {insights.map((insight, index) => (
                <MotionSection
                  key={insight.title}
                  direction="up"
                  delay={index * 0.1}
                >
                  <div className="hud-panel hud-panel-hover flex gap-4 p-4">
                    <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <insight.icon className="w-4 h-4 text-secondary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-caption font-bold font-display mb-1">{insight.title}</h3>
                      <p className="text-small text-text-tertiary leading-relaxed">{insight.description}</p>
                    </div>
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
