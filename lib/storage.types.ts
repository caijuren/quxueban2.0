import { Child } from './children';

export type TaskStatus = 'pending' | 'done' | 'skipped';

export type DayOfWeek = '周一' | '周二' | '周三' | '周四' | '周五' | '周六' | '周日';

export type SubjectId = 'chinese' | 'math' | 'english';

export interface WeeklyTaskItem {
  id: string;
  subjectId: SubjectId;
  day: DayOfWeek;
  focus: string;
  duration: string;
  materials: string[];
  status: TaskStatus;
  completedAt?: string;
  note?: string;
}

export interface WeeklyPlan {
  weekId: string;
  childId: string;
  publishedAt?: string;
  reviewedAt?: string;
  reviewComment?: string;
  tasks: WeeklyTaskItem[];
}

export interface AppData {
  version: number;
  children: Child[];
  currentChildId: string | null;
  weeklyPlans: WeeklyPlan[];
}

export interface MigrationContext {
  fromVersion: number;
  toVersion: number;
}

export type MigrationFn = (data: AppData, ctx: MigrationContext) => AppData;

export interface Migration {
  fromVersion: number;
  toVersion: number;
  description: string;
  migrate: MigrationFn;
}
