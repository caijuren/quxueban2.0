import {
  BookOpen,
  Backpack,
  Dumbbell,
  Palette,
  GraduationCap,
  Zap,
} from 'lucide-react';
import { TaskCategory } from './storage.types';

export const categoryIcons: Record<TaskCategory, typeof BookOpen> = {
  school: Backpack,
  reading: BookOpen,
  sport: Dumbbell,
  interest: Palette,
  ability: Zap,
  other: GraduationCap,
};

export const allCategories: TaskCategory[] = [
  'school',
  'reading',
  'sport',
  'interest',
  'ability',
  'other',
];
