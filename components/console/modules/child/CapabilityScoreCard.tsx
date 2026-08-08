'use client';

import { Icon, type IconName } from '@/components/ui/icon';
import Section from '@/components/console/core/Section';

interface CapabilityScore {
  subject: string;
  label: string;
  score: number;
  trend: string;
  icon: IconName;
  color: string;
}

const mockScores: CapabilityScore[] = [
  {
    subject: 'chinese',
    label: '语文阅读',
    score: 82,
    trend: '+12%',
    icon: 'BookOpen',
    color: 'bg-success',
  },
  {
    subject: 'math',
    label: '数学思维',
    score: 76,
    trend: '+8%',
    icon: 'Calculator',
    color: 'bg-primary',
  },
  {
    subject: 'english',
    label: '英语能力',
    score: 90,
    trend: '持平',
    icon: 'Languages',
    color: 'bg-ai',
  },
];

export default function CapabilityScoreCard() {
  return (
    <Section title="能力评估" description="基于当前学习数据的综合能力分数">
      <div className="space-y-3 p-2">
        {mockScores.map((item) => (
          <div
            key={item.subject}
            className="flex items-center gap-4 rounded-xl bg-surface-hover p-3 transition-colors hover:bg-surface-hover"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-hover">
              <Icon name={item.icon} size="md" className="text-text-tertiary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-text-secondary">{item.label}</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-text-primary">{item.score}</span>
                  <span className="text-2xs text-text-muted">{item.trend}</span>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-hover">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="bg-ai/[0.05] border-ai/[0.10] flex items-start gap-3 rounded-xl border p-3">
          <Icon name="Sparkles" size="sm" animate="pulse" className="mt-0.5 shrink-0 text-ai" />
          <p className="text-xs text-text-muted">
            AI 诊断：数学思维有提升空间，建议增加每周 2 次逻辑训练。当前能力模型为 V1.0
            演示数据，后续将接入真实评估。
          </p>
        </div>
      </div>
    </Section>
  );
}
