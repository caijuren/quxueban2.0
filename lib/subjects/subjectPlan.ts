export type SubjectId = 'chinese' | 'math' | 'english';

export interface SubjectPlanTrack {
  id: string;
  name: string;
  color: string;
  description?: string | null;
}

export interface SubjectPlanTimeAxisItem {
  label: string;
  position: number;
}

export interface SubjectPlanNode {
  id: string;
  trackId: string;
  label: string;
  position: number;
  time: string;
  detail?: string | null;
}

export interface SubjectPlanYearlyTarget {
  grade: string;
  period?: string | null;
  keyword: string;
  detail?: string | null;
  milestones?: string[];
}

export interface SubjectPlanExamEvent {
  id: string;
  name: string;
  target?: string | null;
  date?: string | null;
  month?: string | null;
  registerBefore?: string | null;
  notes?: string | null;
}

export interface SubjectPlanConfigData {
  tracks: SubjectPlanTrack[];
  timeAxis: SubjectPlanTimeAxisItem[];
  nodes: SubjectPlanNode[];
  yearlyTargets: Record<string, SubjectPlanYearlyTarget[]>;
  examTimeline: SubjectPlanExamEvent[];
}

export interface SubjectPlanConfig {
  id: string;
  subject: SubjectId;
  tracks: SubjectPlanTrack[];
  timeAxis: SubjectPlanTimeAxisItem[];
  nodes: SubjectPlanNode[];
  yearlyTargets: Record<string, SubjectPlanYearlyTarget[]>;
  examTimeline: SubjectPlanExamEvent[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}
