'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
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

const fallbackIconSizeMap = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'md',
  xl: 'lg',
  '2xl': 'xl',
} as const;

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
    'inline-flex shrink-0 items-center justify-center overflow-hidden font-bold text-text-primary ring-1 ring-border-default',
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
        {fallbackIcon ? <Icon name="User" size={fallbackIconSizeMap[size]} /> : <span>?</span>}
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
