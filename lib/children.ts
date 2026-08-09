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
  'var(--color-primary)',
  'var(--color-secondary)',
  'var(--accent)',
  'var(--warning)',
  'var(--success)',
  '#ec4899',
  'var(--color-secondary-glow)',
];

export const AVATAR_PRESETS = [
  { id: 'boy-1', emoji: '👦', bg: 'var(--color-primary)' },
  { id: 'girl-1', emoji: '👧', bg: 'var(--color-secondary)' },
  { id: 'boy-2', emoji: '🧒', bg: 'var(--accent)' },
  { id: 'girl-2', emoji: '👶', bg: 'var(--warning)' },
  { id: 'rocket', emoji: '🚀', bg: 'var(--success)' },
  { id: 'star', emoji: '⭐', bg: '#ec4899' },
  { id: 'book', emoji: '📚', bg: 'var(--color-secondary-glow)' },
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

export function gradeLabel(grade: number, educationSystem: EducationSystem = 'six-three'): string {
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
      avatarColor: 'var(--color-primary)',
      grade: 6,
      educationSystem: 'five-four',
    },
    {
      id: 'child_xiaobao',
      name: '小宝',
      avatarColor: 'var(--accent)',
      grade: 1,
      educationSystem: 'six-three',
    },
  ];
}
