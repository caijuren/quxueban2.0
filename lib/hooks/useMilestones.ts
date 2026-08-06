'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface Milestone {
  id: string;
  childId: string;
  title: string;
  description: string | null;
  targetGrade: number | null;
  targetPeriod: string | null;
  routeId: string | null;
  source: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string | null;
  completedAt: string | null;
  certificateUrls: string[];
  score: string | null;
  notes: string | null;
  learningGoalId: string | null;
  planId: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useMilestones(childId: string | undefined) {
  return useQuery<Milestone[]>({
    queryKey: ['milestones', childId],
    queryFn: async () => {
      if (!childId) return [];
      const res = await fetch(`/api/children/${childId}/milestones`);
      if (!res.ok) throw new Error('加载里程碑失败');
      return res.json();
    },
    enabled: !!childId,
  });
}

export function useCreateMilestone(childId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description?: string;
      targetGrade?: number;
      targetPeriod?: string;
      status?: string;
      dueDate?: string;
    }) => {
      if (!childId) throw new Error('未选择孩子');
      const res = await fetch(`/api/children/${childId}/milestones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('创建失败');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', childId] });
    },
  });
}

export function useUpdateMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Milestone, 'status'>> & { status?: 'pending' | 'in_progress' | 'completed' };
    }) => {
      const res = await fetch(`/api/milestones/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('更新失败');
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
    },
  });
}

export function useDeleteMilestone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/milestones/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('删除失败');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
    },
  });
}
