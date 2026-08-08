'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiGet, apiPatch } from '@/lib/apiClient';
import { NotificationItem } from '@/lib/types';

const queryKey = ['notifications'];

interface PaginatedNotifications {
  notifications: NotificationItem[];
  unreadCount: number;
  total: number;
  page: number;
  limit: number;
}

export function useNotifications() {
  return useQuery<PaginatedNotifications>({
    queryKey,
    queryFn: () => apiGet<PaginatedNotifications>('/api/notifications'),
  });
}

export function useNotificationList(page = 1, limit = 20) {
  return useQuery<PaginatedNotifications>({
    queryKey: [...queryKey, page, limit],
    queryFn: () => apiGet<PaginatedNotifications>(`/api/notifications?page=${page}&limit=${limit}`),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiPatch<NotificationItem>(`/api/notifications/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiPatch<{ success: boolean }>('/api/notifications', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete<{ success: boolean }>(`/api/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
