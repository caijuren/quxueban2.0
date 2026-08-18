'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/apiClient';

export interface GrowthReportSummary {
  id: string;
  type: 'WEEKLY' | 'MONTHLY';
  periodStart: string;
  periodEnd: string;
  title: string;
  summary: string;
  status: 'GENERATING' | 'READY' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}

export interface GrowthReportDetail extends GrowthReportSummary {
  highlights: Array<{ type: string; title: string; content: string }>;
  concerns: Array<{ type: string; title: string; content: string }>;
  abilityInsights: { strength: string; weakness: string; suggestion: string };
  nextWeekPlan: string[];
  chartsData: {
    taskCompletionRate?: number;
    readingMinutes?: number;
    readingTargetMinutes?: number;
    evidenceCount?: number;
    earnedPoints?: number;
  };
}

export interface ReportListResponse {
  reports: GrowthReportSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ReportDetailResponse {
  report: GrowthReportDetail;
  child: { id: string; name: string; grade: number };
}

export function getReportsQueryKey(childId: string | undefined, type?: 'WEEKLY' | 'MONTHLY') {
  return ['growth-reports', childId ?? 'null', type ?? 'all'];
}

export function getReportDetailQueryKey(reportId: string | undefined) {
  return ['growth-report', reportId ?? 'null'];
}

export function useReports(
  childId: string | undefined,
  type?: 'WEEKLY' | 'MONTHLY',
  page: number = 1,
  limit: number = 10
) {
  return useQuery<ReportListResponse>({
    queryKey: [...getReportsQueryKey(childId, type), page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('childId', childId!);
      if (type) params.set('type', type);
      params.set('page', String(page));
      params.set('limit', String(limit));
      return apiGet<ReportListResponse>(`/api/reports/list?${params.toString()}`);
    },
    enabled: !!childId,
  });
}

export function useReportDetail(reportId: string | undefined) {
  return useQuery<ReportDetailResponse>({
    queryKey: getReportDetailQueryKey(reportId),
    queryFn: () => apiGet<ReportDetailResponse>(`/api/reports/${reportId!}`),
    enabled: !!reportId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.report.status === 'GENERATING') return 3000;
      return false;
    },
  });
}

export function useGenerateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      childId: string;
      type: 'WEEKLY' | 'MONTHLY';
      periodStart?: string;
      periodEnd?: string;
      force?: boolean;
    }) => apiPost<{ reportId: string; status: string }>('/api/reports/generate', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: getReportsQueryKey(variables.childId, variables.type) });
    },
  });
}

export function useRegenerateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reportId: string) =>
      apiPost<{ reportId: string; status: string }>(`/api/reports/${reportId}/regenerate`, {}),
    onSuccess: (_, reportId) => {
      queryClient.invalidateQueries({ queryKey: getReportDetailQueryKey(reportId) });
    },
  });
}
