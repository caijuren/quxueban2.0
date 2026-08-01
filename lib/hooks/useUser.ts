'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiGet, apiPatch } from '@/lib/apiClient';
import { UserWithSettings } from '@/lib/settings';
import {
  AccountDeleteInput,
  PasswordChangeInput,
} from '@/lib/validation';

const queryKey = ['user'];

export function useUser() {
  return useQuery<UserWithSettings>({
    queryKey,
    queryFn: () => apiGet<UserWithSettings>('/api/user/me'),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<UserWithSettings>) =>
      apiPatch<UserWithSettings>('/api/user/me', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useExportUserData() {
  return useMutation<unknown, Error, void>({
    mutationFn: () => apiGet<unknown>('/api/user/export'),
  });
}

export function useChangePassword() {
  return useMutation<unknown, Error, PasswordChangeInput>({
    mutationFn: (data) => apiPatch<unknown>('/api/user/password', data),
  });
}

export function useDeleteAccount() {
  return useMutation<unknown, Error, AccountDeleteInput>({
    mutationFn: (data) => apiDelete<unknown>('/api/user/account', data),
  });
}
