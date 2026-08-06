export type NotificationType = 'task' | 'warning' | 'system';

const TYPE_RULES: { type: NotificationType; keywords: string[] }[] = [
  {
    type: 'warning',
    keywords: ['预警', '警告', '逾期', '到期', '截止', '风险', 'alert', 'warning'],
  },
  {
    type: 'task',
    keywords: ['任务', '打卡', '完成', '周计划', '每日', '学习', 'task'],
  },
  {
    type: 'system',
    keywords: ['系统', '公告', '更新', '维护', '账号', 'system'],
  },
];

export function classifyNotificationType(
  title: string,
  content: string
): NotificationType {
  const text = `${title} ${content}`.toLowerCase();
  for (const rule of TYPE_RULES) {
    if (rule.keywords.some((keyword) => text.includes(keyword.toLowerCase()))) {
      return rule.type;
    }
  }
  return 'system';
}

export function getNotificationTypeLabel(type: NotificationType): string {
  switch (type) {
    case 'task':
      return '任务';
    case 'warning':
      return '预警';
    case 'system':
      return '系统';
    default:
      return '系统';
  }
}

export function getNotificationTypeColor(type: NotificationType): string {
  switch (type) {
    case 'task':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'warning':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'system':
      return 'bg-secondary/10 text-secondary border-secondary/20';
    default:
      return 'bg-text-muted/10 text-text-muted border-text-muted/20';
  }
}
