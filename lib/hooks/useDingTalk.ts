'use client';

import { useMutation } from '@tanstack/react-query';
import { apiPost } from '@/lib/apiClient';
import { DingTalkPushInput } from '@/lib/validation';

export function useDingTalkPush() {
  return useMutation({
    mutationFn: (input: DingTalkPushInput) =>
      apiPost<{ success: boolean; message: string }>('/api/dingtalk/push', input),
  });
}
