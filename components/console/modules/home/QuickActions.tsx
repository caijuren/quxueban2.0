'use client';

import { Target, Clock, Brain, FileText, Users, Palette } from 'lucide-react';
import Section from '@/components/console/core/Section';
import SettingRow from '@/components/console/core/SettingRow';

const actions = [
  { icon: Target, label: '学习目标', value: '3 个目标', href: '/dashboard/console/child/goals' },
  { icon: Clock, label: '学习节奏', value: '每日 90 分钟', href: '/dashboard/console/child/rhythm' },
  { icon: Brain, label: 'AI 助手', value: '陪伴型导师', href: '/dashboard/console/ai/planning' },
  { icon: FileText, label: '学习报告', value: '查看本周', href: '/dashboard/console/data/report' },
  { icon: Users, label: '家庭成员', value: '2 位成员', href: '/dashboard/console/family/members' },
  { icon: Palette, label: '外观设置', value: '深色模式', href: '/dashboard/console/account/preferences' },
];

export default function QuickActions() {
  return (
    <Section title="快捷操作" description="常用设置入口">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-2">
        {actions.map((action) => (
          <SettingRow
            key={action.label}
            icon={action.icon}
            label={action.label}
            value={action.value}
            href={action.href}
          />
        ))}
      </div>
    </Section>
  );
}
