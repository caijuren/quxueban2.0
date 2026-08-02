'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPatch } from '@/lib/apiClient';
import { SubjectId, SubjectPlanConfig } from '@/lib/subjects/subjectPlan';
import { SubjectPlanUpdateInput } from '@/lib/validation';

export function getSubjectPlanQueryKey(subject: SubjectId) {
  return ['subject-plan', subject];
}

export function useSubjectPlan(subject: SubjectId) {
  return useQuery<SubjectPlanConfig>({
    queryKey: getSubjectPlanQueryKey(subject),
    queryFn: () => apiGet<SubjectPlanConfig>(`/api/subject-plans/${subject}`),
  });
}

export function useUpdateSubjectPlan(subject: SubjectId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SubjectPlanUpdateInput) =>
      apiPatch<SubjectPlanConfig>(`/api/subject-plans/${subject}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getSubjectPlanQueryKey(subject) });
    },
  });
}
