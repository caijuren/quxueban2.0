export type EducationSystem = 'six-three' | 'five-four';

export interface Child {
  id: string;
  name: string;
  avatarColor: string;
  avatarUrl?: string | null;
  grade: number;
  educationSystem: EducationSystem;
  targetSchool?: string | null;
  currentSchool?: string | null;
  birthday?: string | null;
  notes?: string | null;
  routeId?: string | null;
  dingTalkWebhook?: string | null;
  dingTalkSecret?: string | null;
}

export interface ChildData {
  plans: unknown[];
  progress: unknown;
  milestones: unknown[];
  schools: unknown[];
}

export const AVATAR_COLORS = [
  '#f43f5e',
  '#8b5cf6',
  '#06b6d4',
  '#f59e0b',
  '#10b981',
  '#ec4899',
  '#6366f1',
];

export const AVATAR_PRESETS = [
  { id: 'boy-1', emoji: '👦', bg: '#f43f5e' },
  { id: 'girl-1', emoji: '👧', bg: '#8b5cf6' },
  { id: 'boy-2', emoji: '🧒', bg: '#06b6d4' },
  { id: 'girl-2', emoji: '👶', bg: '#f59e0b' },
  { id: 'rocket', emoji: '🚀', bg: '#10b981' },
  { id: 'star', emoji: '⭐', bg: '#ec4899' },
  { id: 'book', emoji: '📚', bg: '#6366f1' },
  { id: 'trophy', emoji: '🏆', bg: '#f97316' },
];

export function gradeToStage(
  grade: number,
  educationSystem: EducationSystem = 'six-three'
): '小升初' | '中考' | '高考' {
  const primaryEnd = educationSystem === 'five-four' ? 5 : 6;
  if (grade >= 1 && grade <= primaryEnd) return '小升初';
  if (grade >= primaryEnd + 1 && grade <= primaryEnd + 3) return '中考';
  return '高考';
}

export function gradeLabel(
  grade: number,
  educationSystem: EducationSystem = 'six-three'
): string {
  const primaryEnd = educationSystem === 'five-four' ? 5 : 6;
  if (grade <= primaryEnd) return `小学${grade}年级`;
  if (grade <= primaryEnd + 3) return `初中${grade}年级`;
  return `高中${grade}年级`;
}

export function educationSystemLabel(system: EducationSystem): string {
  return system === 'five-four' ? '五四制' : '六三制';
}

export function getInitials(name: string): string {
  return name.slice(0, 1).toUpperCase();
}

export function generateChildId(): string {
  return `child_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getDefaultChildren(): Child[] {
  return [
    {
      id: 'child_dabao',
      name: '大宝',
      avatarColor: '#f43f5e',
      grade: 6,
      educationSystem: 'five-four',
    },
    {
      id: 'child_xiaobao',
      name: '小宝',
      avatarColor: '#06b6d4',
      grade: 1,
      educationSystem: 'six-three',
    },
  ];
}
