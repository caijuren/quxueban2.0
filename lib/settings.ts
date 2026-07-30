export interface UserProfile {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  phone: string | null;
  email: string | null;
  wechatOpenId: string | null;
}

export interface UserSettings {
  theme: 'light' | 'dark-tech' | 'rose-pink';
  fontSize: 'normal' | 'large' | 'xlarge';
  density: 'comfortable' | 'compact';
  reducedMotion: boolean;
  defaultLandingPage: 'dashboard' | 'alerts' | 'weekly';
  defaultChildMode: 'last' | 'ask';
  notificationPrefs: Record<string, boolean>;
  reminderTime: string;
  doNotDisturb: boolean;
  doNotDisturbStart: string | null;
  doNotDisturbEnd: string | null;
}

export interface UserWithSettings extends UserProfile {
  settings: UserSettings | null;
}

export const DEFAULT_NOTIFICATION_PREFS: Record<string, boolean> = {
  weeklyPlanPublished: true,
  dailyTaskReminder: true,
  taskDeadlineWarning: true,
  milestoneReminder: true,
  aiReviewReady: true,
  systemAnnouncement: true,
};

export const NOTIFICATION_OPTIONS: {
  key: string;
  label: string;
  description?: string;
}[] = [
  {
    key: 'weeklyPlanPublished',
    label: '周计划发布提醒',
    description: '当周计划发布或更新时通知我',
  },
  {
    key: 'dailyTaskReminder',
    label: '每日任务提醒',
    description: '按设定时间推送当天学习任务',
  },
  {
    key: 'taskDeadlineWarning',
    label: '任务截止预警',
    description: '任务即将到期时提醒我',
  },
  {
    key: 'milestoneReminder',
    label: '关键里程碑提醒',
    description: '升学路线中的重要节点提前提醒',
  },
  {
    key: 'aiReviewReady',
    label: 'AI 检视报告',
    description: 'AI 诊断报告生成后通知我',
  },
  {
    key: 'systemAnnouncement',
    label: '系统公告',
    description: '平台功能更新与维护通知',
  },
];

export function mergeNotificationPrefs(
  prefs: Record<string, boolean> | null | undefined
): Record<string, boolean> {
  return { ...DEFAULT_NOTIFICATION_PREFS, ...prefs };
}

export const THEME_COLORS: Record<
  UserSettings['theme'],
  {
    '--color-primary': string;
    '--color-primary-glow': string;
    '--color-secondary': string;
    '--color-secondary-glow': string;
    '--shadow-primary': string;
    '--shadow-secondary': string;
  }
> = {
  light: {
    '--color-primary': '#e11d48',
    '--color-primary-glow': '#f43f5e',
    '--color-secondary': '#7c3aed',
    '--color-secondary-glow': '#8b5cf6',
    '--shadow-primary': 'rgba(225, 29, 72, 0.12)',
    '--shadow-secondary': 'rgba(124, 58, 237, 0.12)',
  },
  'dark-tech': {
    '--color-primary': '#ff2d6a',
    '--color-primary-glow': '#ff5c8a',
    '--color-secondary': '#8b5cf6',
    '--color-secondary-glow': '#a78bfa',
    '--shadow-primary': 'rgba(255, 45, 106, 0.15)',
    '--shadow-secondary': 'rgba(139, 92, 246, 0.15)',
  },
  'rose-pink': {
    '--color-primary': '#ec4899',
    '--color-primary-glow': '#f472b6',
    '--color-secondary': '#f43f5e',
    '--color-secondary-glow': '#fb7185',
    '--shadow-primary': 'rgba(236, 72, 153, 0.15)',
    '--shadow-secondary': 'rgba(244, 63, 94, 0.15)',
  },
};

export function applySettingsToDocument(settings: UserSettings | null) {
  if (typeof document === 'undefined') return;

  const fontSize = settings?.fontSize ?? 'normal';
  document.documentElement.setAttribute('data-font-size', fontSize);

  const reducedMotion = settings?.reducedMotion ?? false;
  document.documentElement.setAttribute(
    'data-reduced-motion',
    String(reducedMotion)
  );

  const theme = settings?.theme ?? 'light';
  const colors = THEME_COLORS[theme] ?? THEME_COLORS['light'];
  Object.entries(colors).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}
