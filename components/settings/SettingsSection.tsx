'use client';

import CommandCard from '@/components/ui/CommandCard';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  compact?: boolean;
}

export default function SettingsSection({
  title,
  description,
  children,
  compact = false,
}: SettingsSectionProps) {
  return (
    <CommandCard className={compact ? 'p-3 sm:p-4' : 'p-4 sm:p-5'}>
      <div className={compact ? 'mb-2.5' : 'mb-3'}>
        <h2 className="text-base font-bold font-display text-slate-900">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-slate-600 mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </CommandCard>
  );
}
