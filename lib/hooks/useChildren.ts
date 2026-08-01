'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/apiClient';
import { Child } from '@/lib/children';
import { ChildCreateInput, ChildUpdateInput } from '@/lib/validation';

const queryKey = ['children'];

export function useChildren() {
  return useQuery<Child[]>({
    queryKey,
    queryFn: () => apiGet<Child[]>('/api/children'),
  });
}

export function useCreateChild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ChildCreateInput) =>
      apiPost<Child>('/api/children', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useUpdateChild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChildUpdateInput }) =>
      apiPatch<Child>(`/api/children/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useDeleteChild() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete<{ success: boolean }>(`/api/children/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}
