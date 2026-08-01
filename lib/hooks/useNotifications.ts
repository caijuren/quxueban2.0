'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPatch } from '@/lib/apiClient';
import { NotificationItem } from '@/lib/types';

const queryKey = ['notifications'];

export function useNotifications() {
  return useQuery<NotificationItem[]>({
    queryKey,
    queryFn: () => apiGet<NotificationItem[]>('/api/notifications'),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiPatch<NotificationItem>(`/api/notifications/${id}`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiPatch<{ success: boolean }>('/api/notifications/read-all', {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}
