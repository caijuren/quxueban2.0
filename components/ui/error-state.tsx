'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from '@/components/ui/icon';
import Card from './card';
import Button from './button';

export type ErrorType = '403' | '404' | '500' | 'network' | 'generic';

interface ErrorScene {
  icon: IconName;
  title: string;
  description: string;
}

const errorScenes: Record<ErrorType, ErrorScene> = {
  '403': {
    icon: 'ShieldOff',
    title: '无权访问',
    description: '你没有权限查看此页面，请联系管理员。',
  },
  '404': {
    icon: 'SearchX',
    title: '页面未找到',
    description: '你访问的页面不存在或已被移除。',
  },
  '500': {
    icon: 'ServerCrash',
    title: '服务器错误',
    description: '服务器遇到了一些问题，请稍后重试。',
  },
  network: {
    icon: 'WifiOff',
    title: '网络连接失败',
    description: '请检查网络连接后重试。',
  },
  generic: {
    icon: 'TriangleAlert',
    title: '出了点问题',
    description: '请稍后重试，如果问题持续存在请联系技术支持。',
  },
};

export interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  type = 'generic',
  title,
  description,
  onRetry,
  className,
}: ErrorStateProps) {
  const scene = errorScenes[type];

  return (
    <Card padding="lg" className={cn('text-center', className)}>
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-error/10">
        <Icon name={scene.icon} size="xl" className="text-error" />
      </div>
      <p className="mb-1 font-medium text-text-secondary">{title ?? scene.title}</p>
      <p className="mb-5 text-sm text-text-muted">{description ?? scene.description}</p>
      {onRetry && (
        <Button variant="primary" size="sm" onClick={onRetry}>
          重试
        </Button>
      )}
    </Card>
  );
}