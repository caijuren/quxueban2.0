'use client';

import { cn } from '@/lib/utils';

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
      <label className="text-xs text-text-tertiary font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 px-3 rounded-xl bg-surface-elevated border border-border-default text-sm text-text-secondary
          focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
          transition-all appearance-none cursor-pointer hover:border-border-strong min-w-[7rem]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.5rem center',
          paddingRight: '2rem',
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
