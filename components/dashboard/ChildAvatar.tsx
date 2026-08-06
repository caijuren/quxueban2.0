'use client';

import Image from 'next/image';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Child, getInitials } from '@/lib/children';

interface ChildAvatarProps {
  child?: Child | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'rounded';
  className?: string;
  fallbackIcon?: boolean;
}

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-10 h-10 text-sm',
  xl: 'w-12 h-12 text-lg',
  '2xl': 'w-14 h-14 text-xl',
};

export default function ChildAvatar({
  child,
  size = 'md',
  shape = 'rounded',
  className,
  fallbackIcon = false,
}: ChildAvatarProps) {
  const avatarUrl = child?.avatarUrl;
  const isImage =
    typeof avatarUrl === 'string' &&
    (avatarUrl.startsWith('data:image') ||
      avatarUrl.startsWith('/uploads/avatars/') ||
      avatarUrl.startsWith('/api/uploads/avatars/') ||
      /^https?:\/\//.test(avatarUrl));
  const isEmoji = typeof avatarUrl === 'string' && !isImage;

  const containerClass = cn(
    'inline-flex items-center justify-center font-bold text-text-primary shrink-0 overflow-hidden ring-1 ring-border-default',
    shape === 'circle' ? 'rounded-full' : 'rounded-lg',
    sizeMap[size],
    className
  );

  const style: React.CSSProperties = child
    ? {
        background: `linear-gradient(135deg, ${child.avatarColor}, ${child.avatarColor}88)`,
      }
    : {};

  if (!child) {
    return (
      <div className={cn(containerClass, 'bg-surface-elevated')} style={style}>
        {fallbackIcon ? <User className="w-1/2 h-1/2" /> : <span>?</span>}
      </div>
    );
  }

  if (isImage) {
    return (
      <div className={cn(containerClass, 'relative')} style={style}>
        <Image
          src={avatarUrl}
          alt={child.name}
          fill
          sizes="64px"
          unoptimized
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className={containerClass} style={style}>
      {isEmoji ? (
        <span className={size === 'xs' || size === 'sm' ? 'text-base' : 'text-xl'}>
          {avatarUrl}
        </span>
      ) : (
        <span>{getInitials(child.name)}</span>
      )}
    </div>
  );
}
