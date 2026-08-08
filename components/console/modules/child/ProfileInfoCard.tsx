'use client';

import { Icon, type IconName } from '@/components/ui/icon';
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

  const infoItems: { icon: IconName; label: string; value: string }[] = [
    {
      icon: 'School',
      label: '当前学段',
      value: gradeLabel(child.grade, child.educationSystem),
    },
    {
      icon: 'Calendar',
      label: '学制',
      value: educationSystemLabel(child.educationSystem),
    },
    {
      icon: 'Target',
      label: '目标学校',
      value: child.targetSchool || '未设置',
    },
    {
      icon: 'School',
      label: '当前学校',
      value: child.currentSchool || '未设置',
    },
    {
      icon: 'Calendar',
      label: '生日',
      value: child.birthday || '未设置',
    },
    {
      icon: 'FileText',
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
      <div className="flex items-center gap-4 border-b border-border-subtle p-4">
        <ChildAvatar child={child} size="2xl" shape="rounded" />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-text-primary">{child.name}</h3>
            <span className="bg-primary/[0.10] rounded-full px-2 py-0.5 text-2xs font-medium text-primary">
              {stage}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-text-muted">
            {gradeLabel(child.grade, child.educationSystem)} ·{' '}
            {educationSystemLabel(child.educationSystem)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-2">
        {infoItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-white/[0.02]"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-hover">
              <Icon name={item.icon} size="sm" className="text-text-tertiary" />
            </div>
            <div className="min-w-0">
              <p className="text-2xs text-text-muted">{item.label}</p>
              <p className="truncate text-sm font-medium text-text-secondary">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
