'use client';

import { cn } from '@/lib/utils';
import Select from '@/components/ui/select';

interface FilterSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function FilterSelect({
  label,
  value,
  options,
  onChange,
  placeholder = '全部',
  className,
}: FilterSelectProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-xs font-medium text-text-tertiary">{label}</label>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        size="sm"
        className="min-w-28 bg-surface-elevated hover:border-border-strong"
        options={options}
      />
    </div>
  );
}
