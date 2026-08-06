'use client';

import { Calendar, School, Target, FileText } from 'lucide-react';
import { Child, educationSystemLabel, gradeLabel, gradeToStage } from '@/lib/children';
import Section from '@/components/console/core/Section';
import ChildAvatar from '@/components/dashboard/ChildAvatar';

interface ProfileInfoCardProps {
  child: Child | null;
}

export default function ProfileInfoCard({ child }: ProfileInfoCardProps) {
  if (!child) {
    return (
      <Section title="基本信息">
        <div className="p-8 text-center text-sm text-text-muted">请先选择或添加孩子</div>
      </Section>
    );
  }

  const stage = gradeToStage(child.grade, child.educationSystem);

  const infoItems = [
    {
      icon: School,
      label: '当前学段',
      value: gradeLabel(child.grade, child.educationSystem),
    },
    {
      icon: Calendar,
      label: '学制',
      value: educationSystemLabel(child.educationSystem),
    },
    {
      icon: Target,
      label: '目标学校',
      value: child.targetSchool || '未设置',
    },
    {
      icon: School,
      label: '当前学校',
      value: child.currentSchool || '未设置',
    },
    {
      icon: Calendar,
      label: '生日',
      value: child.birthday || '未设置',
    },
    {
      icon: FileText,
      label: '备注',
      value: child.notes || '无',
    },
  ];

  return (
    <Section
      title="基本信息"
      description="孩子的核心档案信息"
      action={{ label: '编辑资料', onClick: () => {} }}
    >
      <div className="p-4 flex items-center gap-4 border-b border-border-subtle">
        <ChildAvatar child={child} size="2xl" shape="rounded" />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-text-primary">{child.name}</h3>
            <span className="px-2 py-0.5 rounded-full bg-primary/[0.10] text-primary text-2xs font-medium">
              {stage}
            </span>
          </div>
          <p className="text-sm text-text-muted mt-0.5">
            {gradeLabel(child.grade, child.educationSystem)} · {educationSystemLabel(child.educationSystem)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-2">
        {infoItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.02] transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-surface-hover flex items-center justify-center shrink-0">
              <item.icon className="w-4 h-4 text-text-tertiary" />
            </div>
            <div className="min-w-0">
              <p className="text-2xs text-text-muted">{item.label}</p>
              <p className="text-sm font-medium text-text-secondary truncate">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
