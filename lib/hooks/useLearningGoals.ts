'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/apiClient';
import { LearningGoal } from '@/lib/types';
import { LearningGoalCreateInput, LearningGoalUpdateInput } from '@/lib/validation';

const queryKey = (childId: string) => ['learning-goals', childId];

export function useLearningGoals(childId: string | null) {
  return useQuery<LearningGoal[]>({
    queryKey: queryKey(childId ?? ''),
    queryFn: () => apiGet<LearningGoal[]>(`/api/children/${childId}/goals`),
    enabled: !!childId,
  });
}

export function useCreateLearningGoal(childId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LearningGoalCreateInput) =>
      apiPost<LearningGoal>(`/api/children/${childId}/goals`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey(childId ?? '') });
    },
  });
}

export function useUpdateLearningGoal(childId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, data }: { goalId: string; data: LearningGoalUpdateInput }) =>
      apiPatch<LearningGoal>(`/api/children/${childId}/goals/${goalId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey(childId ?? '') });
    },
  });
}

export function useDeleteLearningGoal(childId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (goalId: string) =>
      apiDelete<{ success: boolean }>(`/api/children/${childId}/goals/${goalId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey(childId ?? '') });
    },
  });
}
