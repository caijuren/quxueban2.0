'use client';

import ConsolePageShell from '@/components/console/core/ConsolePageShell';
import DataPrivacySection from '@/components/settings/DataPrivacySection';

export default function DataPage() {
  return (
    <ConsolePageShell title="数据与隐私" description="导出学习数据或管理账号">
      <DataPrivacySection />
    </ConsolePageShell>
  );
}
