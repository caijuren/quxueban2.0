export interface TaskTimelineItem {
  type: 'task';
  id: string;
  date: string;
  title: string;
  subject?: string;
  status: string;
  note?: string;
}

export interface MilestoneTimelineItem {
  type: 'milestone';
  id: string;
  date: string;
  title: string;
  description?: string | null;
}

export interface ParentLogTimelineItem {
  type: 'parentLog';
  id: string;
  date: string;
  title: string;
  content: string;
  tags: string[];
  imageUrls: string[];
}

export interface BadgeTimelineItem {
  type: 'badge';
  id: string;
  date: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  level: number;
}

export interface PointLogTimelineItem {
  type: 'pointLog';
  id: string;
  date: string;
  title: string;
  points: number;
  total: number;
  reason: string;
  source: string;
}

export type GrowthTimelineItem =
  | TaskTimelineItem
  | MilestoneTimelineItem
  | ParentLogTimelineItem
  | BadgeTimelineItem
  | PointLogTimelineItem;

export interface GrowthEvidenceItem {
  id: string;
  date: string;
  taskId: string;
  taskTitle: string;
  weekId: string;
  note?: string;
  imageUrls: string[];
  audioUrls: string[];
  audioTranscript?: string;
}

export interface GrowthTimelineResponse {
  items: GrowthTimelineItem[];
}

export interface GrowthEvidenceResponse {
  items: GrowthEvidenceItem[];
}
