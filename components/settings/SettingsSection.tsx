'use client';

import CommandCard from '@/components/ui/CommandCard';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <CommandCard className="p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold font-display text-slate-100">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        )}
      </div>
      {children}
    </CommandCard>
  );
}
