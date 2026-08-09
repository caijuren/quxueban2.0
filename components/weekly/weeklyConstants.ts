'use client';

import { type IconName } from '@/components/ui/icon';
import { type TaskCategory } from '@/lib/storage.types';

export const categoryIcons: Record<TaskCategory, IconName> = {
  school: 'Backpack',
  reading: 'BookOpen',
  sport: 'Dumbbell',
  interest: 'Palette',
  ability: 'Trophy',
  other: 'GraduationCap',
};

export const allCategories: TaskCategory[] = [
  'school',
  'reading',
  'sport',
  'interest',
  'ability',
  'other',
];

export const DIFFICULTY_LABELS: Record<string, string> = {
  easy: '基础',
  medium: '巩固',
  hard: '拓展',
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'bg-success/10 text-success border-success/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  hard: 'bg-error/10 text-error border-error/20',
};

export const SEMESTER_LABELS: Record<string, string> = {
  semester: '开学期',
  vacation: '寒暑假',
  exam: '考前冲刺',
};
