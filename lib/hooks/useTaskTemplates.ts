'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/apiClient';
import { TaskCategory, TaskTemplate } from '@/lib/storage.types';
import {
  TaskTemplateCreateInput,
  TaskTemplateUpdateInput,
} from '@/lib/validation';

function buildKey(
  childId: string | undefined,
  filters?: { category?: TaskCategory; status?: 'active' | 'archived' | 'all' }
) {
  return ['task-templates', childId, filters ?? {}];
}

export function useTaskTemplates(
  childId: string | undefined,
  filters?: {
    category?: TaskCategory;
    status?: 'active' | 'archived' | 'all';
  }
) {
  return useQuery<TaskTemplate[]>({
    queryKey: buildKey(childId, filters),
    queryFn: () => {
      const params = new URLSearchParams();
      if (childId) params.set('childId', childId);
      if (filters?.category) params.set('category', filters.category);
      if (filters?.status) params.set('status', filters.status);
      const qs = params.toString();
      return apiGet<TaskTemplate[]>(`/api/task-templates${qs ? `?${qs}` : ''}`);
    },
    enabled: !!childId,
  });
}

export function useCreateTaskTemplate(childId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<TaskTemplateCreateInput, 'childId'>) =>
      apiPost<TaskTemplate>('/api/task-templates', {
        ...data,
        childId,
      } as TaskTemplateCreateInput),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['task-templates', childId] }),
  });
}

export function useUpdateTaskTemplate(childId: string | undefined) {
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
      queryClient.invalidateQueries({ queryKey: ['task-templates', childId] }),
  });
}

export function useDeleteTaskTemplate(childId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiDelete<{ success: boolean }>(`/api/task-templates/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['task-templates', childId] }),
  });
}

export function useToggleTaskTemplateFavorite(childId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
      apiPatch<TaskTemplate>(`/api/task-templates/${id}`, { isFavorite }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['task-templates', childId] }),
  });
}

export function useImportSystemTaskTemplates(childId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (templateIds: string[]) =>
      apiPost<{ createdCount: number; templates: TaskTemplate[] }>(
        '/api/task-templates/import-system',
        { childId, templateIds }
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['task-templates', childId] }),
  });
}
