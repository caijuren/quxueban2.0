'use client';

import * as React from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
}

const sizeMap = {
  xs: 'size-6 text-xs',
  sm: 'size-8 text-sm',
  md: 'size-10 text-base',
  lg: 'size-12 text-lg',
  xl: 'size-16 text-xl',
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, name, size = 'md', shape = 'circle', ...props }, ref) => {
    const initial = name?.trim().charAt(0) || '';
    const hasImage = !!src;

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden bg-surface-hover font-medium text-text-secondary',
          shape === 'circle' ? 'rounded-full' : 'rounded-lg',
          sizeMap[size],
          className
        )}
        {...props}
      >
        {hasImage ? (
          <img
            src={src}
            alt={name || 'Avatar'}
            className="absolute inset-0 size-full object-cover"
          />
        ) : initial ? (
          <span>{initial}</span>
        ) : (
          <User className="size-1/2" />
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';

export default Avatar;
