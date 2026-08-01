'use client';

import { useMutation } from '@tanstack/react-query';
import { apiPost } from '@/lib/apiClient';
import { UserRegisterInput } from '@/lib/validation';

export function useRegister() {
  return useMutation<unknown, Error, UserRegisterInput>({
    mutationFn: (data) => apiPost<unknown>('/api/register', data),
  });
}
