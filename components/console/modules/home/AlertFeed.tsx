'use client';

import { AlertTriangle, TrendingDown, Lightbulb } from 'lucide-react';
import Section from '@/components/console/core/Section';
import SettingRow from '@/components/console/core/SettingRow';

const alerts = [
  {
    id: '1',
    icon: AlertTriangle,
    label: '数学连续 2 天未完成任务',
    value: '查看详情',
    variant: 'warning' as const,
  },
  {
    id: '2',
    icon: TrendingDown,
    label: '阅读时间较上周下降 20%',
    value: '查看详情',
    variant: 'warning' as const,
  },
  {
    id: '3',
    icon: Lightbulb,
    label: 'AI 发现英语听力提升机会',
    value: '查看详情',
    variant: 'default' as const,
  },
];

export default function AlertFeed() {
  return (
    <Section title="需要关注" description="AI 识别出的风险与机会">
      <div className="p-2 space-y-1">
        {alerts.map((alert) => (
          <SettingRow
            key={alert.id}
            icon={alert.icon}
            label={alert.label}
            value={alert.value}
            variant={alert.variant}
            onClick={() => {}}
          />
        ))}
      </div>
    </Section>
  );
}
