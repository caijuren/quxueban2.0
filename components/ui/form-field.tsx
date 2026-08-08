'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  helper?: string;
  children: React.ReactElement;
  className?: string;
}

export default function FormField({
  label,
  required = false,
  error,
  helper,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="text-sm font-medium text-text-secondary">
          {label}
          {required && <span className="ml-0.5 text-error">*</span>}
        </label>
      )}
      <div>{children}</div>
      {helper && !error && <p className="text-xs text-text-muted">{helper}</p>}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
