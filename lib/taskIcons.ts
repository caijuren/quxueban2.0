import {
  BookOpen,
  Calculator,
  Languages,
  Backpack,
  Dumbbell,
  Palette,
  GraduationCap,
} from 'lucide-react';
import { TaskCategory } from './storage.types';

export const categoryIcons: Record<TaskCategory, typeof BookOpen> = {
  chinese: BookOpen,
  math: Calculator,
  english: Languages,
  school: Backpack,
  reading: BookOpen,
  sport: Dumbbell,
  interest: Palette,
  other: GraduationCap,
};

export const allCategories: TaskCategory[] = [
  'chinese',
  'math',
  'english',
  'school',
  'reading',
  'sport',
  'interest',
  'other',
];
