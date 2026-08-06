'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/apiClient';
import { ParentLogCreateInput, ParentLogUpdateInput } from '@/lib/validation';

export interface ParentLog {
  id: string;
  userId: string;
  childId: string;
  date: string;
  content: string;
  imageUrls: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

function buildKey(childId: string) {
  return ['parent-logs', childId];
}

export function useParentLogs(childId: string | undefined) {
  return useQuery<ParentLog[]>({
    queryKey: buildKey(childId ?? ''),
    queryFn: () => apiGet<ParentLog[]>(`/api/children/${childId}/parent-logs`),
    enabled: !!childId,
  });
}

export function useCreateParentLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ childId, data }: { childId: string; data: ParentLogCreateInput }) =>
      apiPost<ParentLog>(`/api/children/${childId}/parent-logs`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: buildKey(variables.childId) });
    },
  });
}

export function useUpdateParentLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      childId,
      logId,
      data,
    }: {
      childId: string;
      logId: string;
      data: ParentLogUpdateInput;
    }) => apiPatch<ParentLog>(`/api/children/${childId}/parent-logs/${logId}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: buildKey(variables.childId) });
    },
  });
}

export function useDeleteParentLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ childId, logId }: { childId: string; logId: string }) =>
      apiDelete<{ success: boolean }>(`/api/children/${childId}/parent-logs/${logId}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: buildKey(variables.childId) });
    },
  });
}
