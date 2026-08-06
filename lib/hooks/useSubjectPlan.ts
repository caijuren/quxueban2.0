'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPatch } from '@/lib/apiClient';
import { SubjectId, SubjectPlanConfig } from '@/lib/subjects/subjectPlan';
import { SubjectPlanUpdateInput } from '@/lib/validation';

export function getSubjectPlanQueryKey(subject: SubjectId, childId?: string | null) {
  return ['subject-plan', subject, childId ?? 'null'];
}

function buildUrl(subject: SubjectId, childId?: string | null) {
  const url = `/api/subject-plans/${subject}`;
  if (!childId) return url;
  return `${url}?childId=${encodeURIComponent(childId)}`;
}

export function useSubjectPlan(subject: SubjectId, childId?: string | null) {
  return useQuery<SubjectPlanConfig>({
    queryKey: getSubjectPlanQueryKey(subject, childId),
    queryFn: () => apiGet<SubjectPlanConfig>(buildUrl(subject, childId)),
  });
}

export function useUpdateSubjectPlan(subject: SubjectId, childId?: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SubjectPlanUpdateInput) =>
      apiPatch<SubjectPlanConfig>(buildUrl(subject, childId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getSubjectPlanQueryKey(subject, childId) });
    },
  });
}
