'use client';

import { BookOpen, Calculator, Languages, Sparkles } from 'lucide-react';
import Section from '@/components/console/core/Section';

interface CapabilityScore {
  subject: string;
  label: string;
  score: number;
  trend: string;
  icon: typeof BookOpen;
  color: string;
}

const mockScores: CapabilityScore[] = [
  { subject: 'chinese', label: '语文阅读', score: 82, trend: '+12%', icon: BookOpen, color: 'bg-success' },
  { subject: 'math', label: '数学思维', score: 76, trend: '+8%', icon: Calculator, color: 'bg-primary' },
  { subject: 'english', label: '英语能力', score: 90, trend: '持平', icon: Languages, color: 'bg-ai' },
];

export default function CapabilityScoreCard() {
  return (
    <Section title="能力评估" description="基于当前学习数据的综合能力分数">
      <div className="p-2 space-y-3">
        {mockScores.map((item) => (
          <div
            key={item.subject}
            className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center shrink-0">
              <item.icon className="w-5 h-5 text-text-tertiary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-text-secondary">{item.label}</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-text-primary">{item.score}</span>
                  <span className="text-2xs text-text-muted">{item.trend}</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-start gap-3 p-3 rounded-xl bg-ai/[0.05] border border-ai/[0.10]">
          <Sparkles className="w-4 h-4 text-ai shrink-0 mt-0.5" />
          <p className="text-xs text-text-muted">
            AI 诊断：数学思维有提升空间，建议增加每周 2 次逻辑训练。当前能力模型为 V1.0 演示数据，后续将接入真实评估。
          </p>
        </div>
      </div>
    </Section>
  );
}
