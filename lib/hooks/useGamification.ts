'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/apiClient';

export interface GamificationData {
  badges: {
    id: string;
    userId: string;
    childId: string | null;
    key: string;
    name: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    level: number;
    unlockedAt: string;
    points: number;
  }[];
  points: number;
  streaks: {
    currentStreak: number;
    longestStreak: number;
  };
}

export function useGamification(childId: string | undefined) {
  return useQuery<GamificationData>({
    queryKey: ['gamification', childId ?? ''],
    queryFn: () => apiGet<GamificationData>(`/api/children/${childId}/gamification`),
    enabled: !!childId,
  });
}
