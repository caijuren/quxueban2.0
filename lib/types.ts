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

export interface Publisher {
  id: string;
  name: string;
  shortName: string | null;
  logoUrl: string | null;
  website: string | null;
  strongSubjects: string | null;
  series: string | null;
}

export interface ContentType {
  id: string;
  name: string;
  description: string | null;
}

export interface LearningGoal {
  id: string;
  childId: string;
  subject: 'chinese' | 'math' | 'english' | 'overall';
  goalType: 'reading_count' | 'ability_score' | 'habit' | 'custom';
  metricType: 'count' | 'score' | 'duration' | 'habit';
  title: string;
  target: string | null;
  period: string;
  source: 'parent' | 'ai' | 'system' | 'teacher';
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  bookId: string;
  title: string;
  isbn: string | null;
  author: string | null;
  editionDate: string | null;
  editionNumber: string | null;
  price: number | null;
  subject: string;
  grade: string;
  textbookVersion: string | null;
  isNewTextbook: string;
  difficulty: number;
  targetAudience: string | null;
  sellingPoints: string | null;
  structureDesc: string | null;
  companionSuggestion: string | null;
  coverImageUrl: string | null;
  jdUrl: string | null;
  dangdangUrl: string | null;
  officialUrl: string | null;
  status: string;
  publisher: Publisher;
  contentType: ContentType;
  createdAt: string;
  updatedAt: string;
}

export interface BookFilters {
  grades: string[];
  subjects: string[];
  publishers: Publisher[];
  contentTypes: ContentType[];
  difficulties: number[];
  isNewTextbookOptions: string[];
}

export interface BooksResponse {
  books: Book[];
  total: number;
}
