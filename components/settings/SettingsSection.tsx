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
  compact = true,
}: SettingsSectionProps) {
  return (
    <CommandCard className={compact ? 'p-3 sm:p-4' : 'p-4 sm:p-5'}>
      <div className={compact ? 'mb-2' : 'mb-3'}>
        <h2 className="text-sm font-bold font-display text-text-primary">
          {title}
        </h2>
        {description && (
          <p className="text-[11px] text-text-muted mt-0.5 leading-tight">{description}</p>
        )}
      </div>
      {children}
    </CommandCard>
  );
}
