'use client';

import { useQuery } from '@tanstack/react-query';
import { apiPost } from '@/lib/apiClient';
import { DiagnosisResult } from '@/lib/aiDiagnosis';

export function useAiDiagnosis(childId?: string) {
  return useQuery<DiagnosisResult, Error>({
    queryKey: ['ai-diagnosis', childId],
    queryFn: async () => {
      if (!childId) throw new Error('缺少 childId');
      return apiPost<DiagnosisResult>('/api/ai/diagnosis', { childId });
    },
    enabled: !!childId,
    staleTime: 5 * 60 * 1000,
  });
}
