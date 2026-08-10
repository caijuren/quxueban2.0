import { Child } from './children';

export type TaskStatus =
  'pending' | 'in_progress' | 'partially_done' | 'done' | 'skipped' | 'rescheduled';

export type TaskCompletionQuality = 'excellent' | 'good' | 'average' | 'needs_work';

export interface TaskCapabilityProgress {
  capabilityId: string;
  name: string;
  progressDelta: number;
}

export type DayOfWeek = '周一' | '周二' | '周三' | '周四' | '周五' | '周六' | '周日';

export type SubjectId = 'chinese' | 'math' | 'english';

export type TaskCategory = 'school' | 'reading' | 'sport' | 'interest' | 'ability' | 'other';

export type TaskSource = 'auto' | 'library' | 'manual';

export type TaskAlignment = 'ahead' | 'ontrack' | 'behind' | 'optional' | 'unrelated';

export interface TaskCompletionMetadata {
  bookTitle?: string;
  pageStart?: number;
  pageEnd?: number;
  workbookTitle?: string;
  problemRange?: string;
  wrongCount?: number;
  quantityIncrement?: number;
  quantityUnit?: string;
}

export interface TaskCompletionRecord {
  id: string;
  date: string;
  status: TaskStatus;
  progress: number;
  actualDurationMinutes: number;
  quality: TaskCompletionQuality | null;
  note: string;
  imageUrls: string[];
  audioUrls: string[];
  audioTranscript?: string;
  capabilityProgress: TaskCapabilityProgress[];
  quantityIncrement: number;
  checklistProgress: string[];
  metadata?: TaskCompletionMetadata;
  dingtalkPushedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type TimeSlot =
  | 'morning'
  | 'beforeNoon'
  | 'noon'
  | 'afternoon'
  | 'afterSchool'
  | 'evening'
  | 'night'
  | 'flexible';

export interface WeeklyGoalChecklistItem {
  id: string;
  title: string;
  text: string;
  done: boolean;
}

export interface WeeklyGoal {
  id: string;
  title: string;
  category: TaskCategory;
  subjectId?: 'chinese' | 'math' | 'english' | 'ability' | 'other';
  quantityTarget?: number;
  quantityDone?: number;
  quantityUnit?: string;
  checklist?: WeeklyGoalChecklistItem[];
}

export interface WeeklyTaskItem {
  id: string;
  category: TaskCategory;
  subjectId?: SubjectId;
  source: TaskSource;
  templateId?: string;
  alignment?: TaskAlignment;
  day: DayOfWeek;
  timeSlot?: TimeSlot;
  focus: string;
  duration: string;
  materials: string[];
  status: TaskStatus;
  completedAt?: string;
  note?: string;
  goalId?: string;
  completionRecords?: TaskCompletionRecord[];
}

export interface WeeklyPlan {
  id?: string;
  weekId: string;
  childId: string;
  publishedAt?: string;
  reviewedAt?: string;
  reviewComment?: string;
  aiSummary?: string;
  aiSummaryGeneratedAt?: string;
  tasks: WeeklyTaskItem[];
  goals?: WeeklyGoal[];
}

export type TaskType = 'daily' | 'milestone' | 'remedial' | 'sprint' | 'diagnostic';

export type TaskFrequency = 'once' | 'daily' | 'weekly' | 'custom';

export type TaskWeeklySchedule = 'auto' | 'daily' | 'weekdays' | 'weekends' | 'custom';

export interface TaskCapabilityLink {
  id: string;
  taskTemplateId: string;
  capabilityId: string;
  weight: number;
  expectedProgress: number;
  capability?: Capability;
}

export interface Capability {
  id: string;
  userId?: string | null;
  name: string;
  category: 'chinese' | 'math' | 'english' | 'general' | 'exam' | 'admission';
  description?: string | null;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentCriterion {
  metric: string;
  target: string;
  selfReport: boolean;
}

export interface TaskTemplate {
  id: string;
  userId: string;
  childId?: string | null;
  title: string;
  category: TaskCategory;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  materials: string[];
  description?: string | null;
  routeTags: string[];
  milestoneTag?: string | null;
  semesterTag?: string | null;
  tags: string[];
  source: 'system' | 'user';
  isActive: boolean;
  isFavorite?: boolean;
  archivedAt?: string | null;
  useCount: number;
  lastUsedAt?: string | null;
  taskType: TaskType;
  frequency: TaskFrequency;
  customFrequency?: { times: number; period: 'day' | 'week' | 'month' } | null;
  weeklySchedule: TaskWeeklySchedule;
  customScheduleDays: DayOfWeek[];
  assessmentCriteria: AssessmentCriterion[];
  capabilityLinks: TaskCapabilityLink[];
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyPlanTemplate {
  id: string;
  userId: string;
  childId?: string | null;
  name: string;
  description?: string | null;
  tasks: WeeklyTaskItem[];
  goals?: WeeklyGoal[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
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
