'use client';

import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import ConsolePageShell from '@/components/console/core/ConsolePageShell';
import SettingsSection from '@/components/settings/SettingsSection';
import DataPrivacySection from '@/components/settings/DataPrivacySection';

export default function DataPage() {
  return (
    <ConsolePageShell title="数据与隐私" description="管理学习数据、成长档案与账号">
      <div className="space-y-4">
        <SettingsSection title="数据资产" description="查看成长档案或导出学习数据">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/dashboard/growth"
              className="hover:border-primary/30 group flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-elevated p-4 transition-all hover:bg-surface-hover"
            >
              <div className="bg-primary/10 flex size-10 items-center justify-center rounded-xl">
                <Icon name="Sprout" size="md" className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-secondary">成长档案</p>
                <p className="mt-0.5 text-[11px] text-text-muted">时间线、证据库与完成趋势</p>
              </div>
              <Icon
                name="ArrowRight"
                size="sm"
                className="text-text-muted transition-colors group-hover:text-primary"
              />
            </Link>

            <div className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-elevated p-4 opacity-70">
              <div className="bg-ai/10 flex size-10 items-center justify-center rounded-xl">
                <Icon name="FileDown" size="md" className="text-ai" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-secondary">数据导出</p>
                <p className="mt-0.5 text-[11px] text-text-muted">
                  PDF / Excel 等格式导出（即将上线）
                </p>
              </div>
              <span className="rounded-full border border-border-subtle bg-surface px-2 py-0.5 text-[10px] text-text-muted">
                敬请期待
              </span>
            </div>
          </div>
        </SettingsSection>

        <DataPrivacySection />
      </div>
    </ConsolePageShell>
  );
}
