'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/apiClient';
import {
  GrowthTimelineItem,
  GrowthEvidenceItem,
  GrowthTimelineResponse,
  GrowthEvidenceResponse,
} from '@/lib/growth';

export type {
  TaskTimelineItem,
  MilestoneTimelineItem,
  ParentLogTimelineItem,
  BadgeTimelineItem,
  PointLogTimelineItem,
  GrowthTimelineItem,
  GrowthEvidenceItem,
  GrowthTimelineResponse,
  GrowthEvidenceResponse,
} from '@/lib/growth';

export function getGrowthTimelineQueryKey(childId: string | undefined) {
  return ['growth-timeline', childId ?? 'null'];
}

export function getGrowthEvidenceQueryKey(childId: string | undefined) {
  return ['growth-evidence', childId ?? 'null'];
}

export function useGrowthTimeline(childId: string | undefined) {
  return useQuery<GrowthTimelineResponse>({
    queryKey: getGrowthTimelineQueryKey(childId),
    queryFn: () =>
      apiGet<GrowthTimelineResponse>(
        `/api/children/${encodeURIComponent(childId!)}/growth/timeline`
      ),
    enabled: !!childId,
  });
}

export function useGrowthEvidence(childId: string | undefined) {
  return useQuery<GrowthEvidenceResponse>({
    queryKey: getGrowthEvidenceQueryKey(childId),
    queryFn: () =>
      apiGet<GrowthEvidenceResponse>(
        `/api/children/${encodeURIComponent(childId!)}/growth/evidence`
      ),
    enabled: !!childId,
  });
}
