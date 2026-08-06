'use client';

import ConsolePageShell from '@/components/console/core/ConsolePageShell';
import ChildrenSection from '@/components/settings/ChildrenSection';

export default function ChildrenPage() {
  return (
    <ConsolePageShell title="我的孩子" description="管理孩子的学习档案与默认选中">
      <ChildrenSection />
    </ConsolePageShell>
  );
}
