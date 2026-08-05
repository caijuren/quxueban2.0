'use client';

import ConsolePageShell from '@/components/console/core/ConsolePageShell';
import FamilySection from '@/components/settings/FamilySection';

export default function FamilyPage() {
  return (
    <ConsolePageShell title="家庭成员与权限" description="管理家庭成员，分配查看与编辑权限">
      <FamilySection />
    </ConsolePageShell>
  );
}
