export interface Child {
  id: string;
  name: string;
  avatarColor: string;
  grade: number;
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

export function gradeToStage(grade: number): '小升初' | '中考' | '高考' {
  if (grade >= 1 && grade <= 5) return '小升初';
  if (grade >= 6 && grade <= 9) return '中考';
  return '高考';
}

export function gradeLabel(grade: number): string {
  if (grade <= 6) return `小学${grade}年级`;
  if (grade <= 9) return `初中${grade - 6}年级`;
  return `高中${grade - 9}年级`;
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
    },
    {
      id: 'child_xiaobao',
      name: '小宝',
      avatarColor: '#06b6d4',
      grade: 1,
    },
  ];
}
