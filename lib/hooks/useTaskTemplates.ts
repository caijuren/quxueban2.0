'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/apiClient';
import { TaskCategory, TaskTemplate } from '@/lib/storage.types';
import {
  TaskTemplateCreateInput,
  TaskTemplateUpdateInput,
} from '@/lib/validation';

function buildKey(filters?: { category?: TaskCategory; status?: 'active' | 'archived' | 'all' }) {
  return ['task-templates', filters ?? {}];
}

export function useTaskTemplates(filters?: {
  category?: TaskCategory;
  status?: 'active' | 'archived' | 'all';
}) {
  return useQuery<TaskTemplate[]>({
    queryKey: buildKey(filters),
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters?.category) params.set('category', filters.category);
      if (filters?.status) params.set('status', filters.status);
      const qs = params.toString();
      return apiGet<TaskTemplate[]>(`/api/task-templates${qs ? `?${qs}` : ''}`);
    },
  });
}

export function useCreateTaskTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TaskTemplateCreateInput) =>
      apiPost<TaskTemplate>('/api/task-templates', data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['task-templates'] }),
  });
}

export function useUpdateTaskTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: TaskTemplateUpdateInput;
    }) => apiPatch<TaskTemplate>(`/api/task-templates/${id}`, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['task-templates'] }),
  });
}

export function useDeleteTaskTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiDelete<{ success: boolean }>(`/api/task-templates/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['task-templates'] }),
  });
}
