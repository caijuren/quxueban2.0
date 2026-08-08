'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from '@/components/ui/icon';
import Card from './card';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  description?: string;
  onClose?: () => void;
}

const iconMap: Record<AlertProps['type'], IconName> = {
  success: 'CheckCircle',
  error: 'AlertCircle',
  warning: 'AlertTriangle',
  info: 'Info',
};

const variantMap = {
  success: 'border-success/20 text-success',
  error: 'border-error/20 text-error',
  warning: 'border-warning/20 text-warning',
  info: 'border-info/20 text-info',
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, type, title, description, onClose, children, ...props }, ref) => {
    const iconName = iconMap[type];

    return (
      <Card
        ref={ref}
        padding="md"
        radius="lg"
        className={cn('border', variantMap[type], className)}
        {...props}
      >
        <div className="flex items-start gap-3">
          <Icon name={iconName} size="md" className="mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            {title && <h4 className="text-sm font-semibold text-text-primary">{title}</h4>}
            {description && <p className="mt-0.5 text-sm text-text-secondary">{description}</p>}
            {children}
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 text-text-muted transition-colors hover:text-text-secondary"
              aria-label="关闭"
            >
              <Icon name="X" size="sm" />
            </button>
          )}
        </div>
      </Card>
    );
  }
);
Alert.displayName = 'Alert';

export default Alert;
