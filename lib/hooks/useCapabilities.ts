'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/apiClient';
import { Capability } from '@/lib/storage.types';
import { CapabilityCreateInput, CapabilityUpdateInput } from '@/lib/validation';

const queryKey = ['capabilities'];

export function useCapabilities() {
  return useQuery<Capability[]>({
    queryKey,
    queryFn: () => apiGet<Capability[]>('/api/capabilities'),
  });
}

export function useCreateCapability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CapabilityCreateInput) => apiPost<Capability>('/api/capabilities', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useUpdateCapability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CapabilityUpdateInput }) =>
      apiPatch<Capability>(`/api/capabilities/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useDeleteCapability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete<{ success: boolean }>(`/api/capabilities/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}
