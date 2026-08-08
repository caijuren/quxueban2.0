'use client';

import * as React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const variantMap = {
  success: 'border-success/20',
  error: 'border-error/20',
  warning: 'border-warning/20',
  info: 'border-info/20',
};

const iconColorMap = {
  success: 'text-success',
  error: 'text-error',
  warning: 'text-warning',
  info: 'text-info',
};

export default function Toast({
  id,
  type,
  title,
  description,
  duration = 3000,
  onClose,
}: ToastProps) {
  const Icon = iconMap[type];

  React.useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div
      className={cn(
        'fixed right-4 top-4 z-toast flex w-80 items-start gap-3 rounded-lg border bg-surface-elevated p-4 shadow-lg',
        'transition-all duration-300',
        variantMap[type]
      )}
      role="alert"
    >
      <Icon className={cn('mt-0.5 size-5 shrink-0', iconColorMap[type])} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        {description && <p className="mt-0.5 text-xs text-text-secondary">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onClose(id)}
        className="shrink-0 text-text-muted transition-colors hover:text-text-secondary"
        aria-label="关闭"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
