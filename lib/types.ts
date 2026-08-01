// 这里只放 storage.types 未覆盖的 API 类型，避免重复定义。

export interface UserProfile {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  phone: string | null;
  email: string | null;
  wechatOpenId: string | null;
  settings: UserSettings;
}

export interface UserSettings {
  theme: 'dark-tech' | 'rose-pink';
  fontSize: 'normal' | 'large' | 'xlarge';
  density: 'comfortable' | 'compact';
  reducedMotion: boolean;
  defaultLandingPage: 'dashboard' | 'alerts' | 'weekly';
  defaultChildMode: 'last' | 'ask';
  notificationPrefs: Record<string, boolean>;
  reminderTime: string | null;
  doNotDisturb: boolean;
  doNotDisturbStart: string | null;
  doNotDisturbEnd: string | null;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  readAt: string | null;
  createdAt: string;
}
