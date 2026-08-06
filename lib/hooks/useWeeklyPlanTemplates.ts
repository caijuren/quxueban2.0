'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
} from '@/lib/apiClient';
import { WeeklyPlanTemplate } from '@/lib/storage.types';
import {
  WeeklyPlanTemplateCreateInput,
  WeeklyPlanTemplateUpdateInput,
} from '@/lib/validation';

function buildKey(childId?: string) {
  return ['weekly-plan-templates', childId ?? 'all'];
}

export function useWeeklyPlanTemplates(childId?: string) {
  return useQuery<WeeklyPlanTemplate[]>({
    queryKey: buildKey(childId),
    queryFn: async () => {
      const qs = childId ? `?childId=${encodeURIComponent(childId)}` : '';
      return apiGet<WeeklyPlanTemplate[]>(`/api/weekly-plan-templates${qs}`);
    },
    enabled: !childId || childId.length > 0,
  });
}

export function useCreateWeeklyPlanTemplate(childId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<WeeklyPlanTemplateCreateInput, 'childId'>) =>
      apiPost<WeeklyPlanTemplate>('/api/weekly-plan-templates', {
        ...data,
        childId,
      } as WeeklyPlanTemplateCreateInput),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: buildKey(childId),
      });
      queryClient.invalidateQueries({ queryKey: ['weekly-plan-templates'] });
    },
  });
}

export function useUpdateWeeklyPlanTemplate(childId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: WeeklyPlanTemplateUpdateInput;
    }) => apiPatch<WeeklyPlanTemplate>(`/api/weekly-plan-templates/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: buildKey(childId),
      });
      queryClient.invalidateQueries({ queryKey: ['weekly-plan-templates'] });
    },
  });
}

export function useDeleteWeeklyPlanTemplate(childId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiDelete<{ success: boolean }>(`/api/weekly-plan-templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: buildKey(childId),
      });
      queryClient.invalidateQueries({ queryKey: ['weekly-plan-templates'] });
    },
  });
}
