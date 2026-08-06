'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiGet, apiPost } from '@/lib/apiClient';
import { WeeklyPlan } from '@/lib/storage.types';
import { WeeklyPlanCreateInput, TaskCompletionInput } from '@/lib/validation';

function buildKey(childId?: string) {
  return ['weekly-plans', childId ?? 'all'];
}

function normalizeWeeklyPlan(
  plan: WeeklyPlan & { parentComment?: string | null }
): WeeklyPlan {
  return {
    ...plan,
    reviewComment: plan.reviewComment ?? plan.parentComment ?? undefined,
  };
}

export function useWeeklyPlans(childId?: string) {
  return useQuery<WeeklyPlan[]>({
    queryKey: buildKey(childId),
    queryFn: async () => {
      const qs = childId ? `?childId=${encodeURIComponent(childId)}` : '';
      const data = await apiGet<(WeeklyPlan & { parentComment?: string | null })[]>(
        `/api/weekly-plans${qs}`
      );
      return data.map(normalizeWeeklyPlan);
    },
    enabled: !childId || childId.length > 0,
  });
}

export function useSaveWeeklyPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WeeklyPlanCreateInput) =>
      apiPost<WeeklyPlan>('/api/weekly-plans', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: buildKey(variables.childId),
      });
      queryClient.invalidateQueries({ queryKey: ['weekly-plans'] });
    },
  });
}

export function useDeleteWeeklyPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiDelete<{ success: boolean }>(`/api/weekly-plans/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['weekly-plans'] }),
  });
}


export function useCompleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      planId: string;
      taskId: string;
      input: TaskCompletionInput;
    }) =>
      apiPost<WeeklyPlan>("/api/weekly-plans/" + data.planId + "/tasks/" + data.taskId + "/complete", data.input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weekly-plans"] });
    },
  });
}

export function useCopyWeeklyPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      childId: string;
      targetWeekId: string;
      sourceWeekId: string;
    }) =>
      apiPost<WeeklyPlan>(
        `/api/children/${data.childId}/weekly-plans/${data.targetWeekId}/copy`,
        {
          sourceWeekId: data.sourceWeekId,
          targetWeekId: data.targetWeekId,
        }
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: buildKey(variables.childId),
      });
      queryClient.invalidateQueries({ queryKey: ['weekly-plans'] });
    },
  });
}
