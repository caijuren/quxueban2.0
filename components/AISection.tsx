'use client';

import { Target, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';
import CommandCard from '@/components/ui/CommandCard';
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
    variant: 'success' as const,
    description: '当前主路线与目标学校匹配良好，建议继续保持节奏',
  },
  {
    icon: AlertTriangle,
    title: '需关注：奥数尚未启动',
    status: '风险',
    variant: 'warning' as const,
    description: '建议根据三公路线要求，提前布局关键能力项',
  },
  {
    icon: TrendingUp,
    title: '本月重点任务',
    status: '建议',
    variant: 'accent' as const,
    description: '确定数学学习形式，建立每周稳定的学习节奏',
  },
];

const reportVariantStyles = {
  success: {
    border: 'border-success/20',
    bg: 'bg-success/[0.03]',
    text: 'text-success',
    pill: 'bg-success/20',
  },
  warning: {
    border: 'border-warning/20',
    bg: 'bg-warning/[0.03]',
    text: 'text-warning',
    pill: 'bg-warning/20',
  },
  accent: {
    border: 'border-accent/20',
    bg: 'bg-accent/[0.03]',
    text: 'text-accent',
    pill: 'bg-accent/20',
  },
};

export default function AISection() {
  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 border-y border-border-subtle">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <MotionSection
            direction="right"
            duration={0.7}
            className="order-2 lg:order-1"
          >
            <CommandCard corner className="p-1">
              <div className="rounded-xl bg-background p-5 space-y-3">
                <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-secondary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold font-display">AI 诊断报告</h3>
                      <p className="text-[11px] text-text-muted">基于当前进度生成</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-secondary">v2.4</span>
                </div>

                {reportItems.map((item) => {
                  const style = reportVariantStyles[item.variant];
                  return (
                    <div
                      key={item.title}
                      className={`p-4 rounded-lg border ${style.bg} ${style.border}`}
                    >
                      <div className="flex items-start gap-3">
                        <item.icon
                          className={`w-4 h-4 shrink-0 mt-0.5 ${style.text}`}
                          aria-hidden="true"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-semibold ${style.text}`}>
                              {item.title}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${style.pill} ${style.text}`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-xs text-text-tertiary leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-2">
                  <div className="h-px bg-border-subtle mb-3" />
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-muted">AI 建议 action</span>
                    <span className="font-mono text-primary">START MATH FOUNDATION</span>
                  </div>
                </div>
              </div>
            </CommandCard>
          </MotionSection>

          <MotionSection
            direction="left"
            duration={0.7}
            className="order-1 lg:order-2"
          >
            <span className="text-[11px] font-mono text-secondary uppercase tracking-widest mb-3 block">
              AI Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display leading-tight mb-4">
              不仅规划
              <br />
              <span className="text-text-muted">更会主动提醒调整</span>
            </h2>
            <p className="text-text-secondary text-base leading-relaxed mb-8">
              输入孩子当前进度，AI 帮你判断路线是否合理、哪些任务需要加强、是否需要启动备选方案。
            </p>

            <div className="space-y-4">
              {insights.map((insight, index) => (
                <MotionSection
                  key={insight.title}
                  direction="up"
                  delay={index * 0.1}
                  className="flex gap-4"
                >
                  <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <insight.icon className="w-4 h-4 text-secondary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-display mb-1">{insight.title}</h3>
                    <p className="text-xs text-text-tertiary leading-relaxed">{insight.description}</p>
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
