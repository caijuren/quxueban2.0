'use client';

import { useMutation } from '@tanstack/react-query';
import { apiPost } from '@/lib/apiClient';

interface DailySummaryResult {
  summary: string;
  source: 'llm' | 'rule';
  date: string;
  dayName: string;
  childName: string;
}

interface DailySummaryVariables {
  childId: string;
  date?: string;
  taskIds?: string[];
}

export function useDailySummary() {
  return useMutation<DailySummaryResult, Error, DailySummaryVariables>({
    mutationFn: (variables) =>
      apiPost<DailySummaryResult>('/api/ai/daily-summary', variables),
  });
}
