'use client';

import { cn } from '@/lib/utils';
import Card from './card';
import Button from './button';
import { Icon, type IconName } from './icon';

export type EmptyScene = 'no-data' | 'no-children' | 'no-tasks' | 'no-plans' | 'search-empty';

interface SceneConfig {
  icon: IconName;
  title: string;
  description: string;
}

const sceneMap: Record<EmptyScene, SceneConfig> = {
  'no-data': {
    icon: 'Inbox',
    title: '暂无数据',
    description: '当前没有可显示的数据',
  },
  'no-children': {
    icon: 'UserPlus',
    title: '还没有孩子档案',
    description: '添加孩子后，系统会根据年级展示对应的内容',
  },
  'no-tasks': {
    icon: 'CheckCheck',
    title: '暂无任务',
    description: '今天还没有安排任务，去看看周计划吧',
  },
  'no-plans': {
    icon: 'CalendarPlus',
    title: '暂无计划',
    description: '还没有制定学习计划，开始规划吧',
  },
  'search-empty': {
    icon: 'Search',
    title: '未找到结果',
    description: '尝试调整搜索条件或关键词',
  },
};

export interface EmptyStateProps {
  icon?: IconName;
  scene?: EmptyScene;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  size?: 'sm' | 'md' | 'lg';
  compact?: boolean;
  className?: string;
}

const iconSizes = { sm: 'md', md: 'lg', lg: 'xl' } as const;
const wrapperSizes = { sm: 'size-10', md: 'size-12', lg: 'size-14' } as const;

export default function EmptyState({
  icon,
  scene,
  title,
  description,
  action,
  size = 'md',
  compact = false,
  className,
}: EmptyStateProps) {
  const resolvedScene = scene ? sceneMap[scene] : null;
  const resolvedIcon: IconName | undefined = icon ?? resolvedScene?.icon;
  const resolvedTitle = title ?? resolvedScene?.title ?? '暂无数据';
  const resolvedDescription = description ?? resolvedScene?.description ?? '';

  const iconNode = resolvedIcon ? (
    <Icon
      name={resolvedIcon}
      size={iconSizes[size]}
      className="text-text-tertiary"
    />
  ) : null;

  if (compact) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-8 text-center', className)}>
        {iconNode && (
          <div className={cn('rounded-full bg-surface-hover p-2.5 text-text-tertiary', wrapperSizes[size])}>
            {iconNode}
          </div>
        )}
        <p className="mt-3 text-sm font-medium text-text-secondary">{resolvedTitle}</p>
        {resolvedDescription && <p className="mt-1 text-xs text-text-muted">{resolvedDescription}</p>}
        {action && (
          <Button variant="primary" size="sm" className="mt-3" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card padding="lg" className={cn('text-center', className)}>
      {iconNode && (
        <div
          className={cn(
            'mx-auto mb-4 flex items-center justify-center rounded-full bg-surface-hover',
            wrapperSizes[size]
          )}
        >
          {iconNode}
        </div>
      )}
      <p className="mb-1 font-medium text-text-secondary">{resolvedTitle}</p>
      {resolvedDescription && <p className="mb-4 text-sm text-text-muted">{resolvedDescription}</p>}
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Card>
  );
}