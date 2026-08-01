'use client';

import { useMutation } from '@tanstack/react-query';
import { apiPost } from '@/lib/apiClient';
import {
  AssessmentTaskInput,
  AssessmentContext,
  TaskRationalityAssessment,
} from '@/lib/ai/taskAssessment';

interface AssessTasksInput {
  childId: string;
  tasks: AssessmentTaskInput[];
  context: AssessmentContext;
}

export function useAssessTasks() {
  return useMutation<TaskRationalityAssessment[], Error, AssessTasksInput>({
    mutationFn: async ({ childId, tasks, context }) => {
      const results = await Promise.all(
        tasks.map((task) =>
          apiPost<TaskRationalityAssessment>('/api/ai/task-assessment', {
            childId,
            task,
            context,
          })
        )
      );
      return results;
    },
  });
}
