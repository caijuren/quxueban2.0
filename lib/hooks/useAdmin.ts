'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/apiClient';

export interface AdminStats {
  userCount: number;
  childCount: number;
  planCount: number;
  weeklyPlanCount: number;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    children: number;
    plans: number;
    weeklyPlans: number;
  };
}

const statsQueryKey = ['admin', 'stats'];
const usersQueryKey = ['admin', 'users'];

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: statsQueryKey,
    queryFn: () => apiGet<AdminStats>('/api/admin/stats'),
    retry: false,
  });
}

export function useAdminUsers() {
  return useQuery<AdminUser[]>({
    queryKey: usersQueryKey,
    queryFn: () => apiGet<AdminUser[]>('/api/admin/users'),
    retry: false,
  });
}
