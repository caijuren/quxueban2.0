import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { normalizeWeeklyTask } from '@/lib/taskAlignment';
import { taskCompletionInputSchema, validateBody } from '@/lib/validation';
import { canManageChild, canViewChild } from '@/lib/family';
import {
  getGamificationContext,
  checkAndAwardBadges,
} from '@/lib/gamification';
import type { WeeklyTaskItem, TaskCompletionRecord } from '@/lib/storage.types';

type Params = { params: { id: string; taskId: string } };

async function authenticate() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export async function POST(req: Request, { params }: Params) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(req, taskCompletionInputSchema);
  if (!validation.success) {
    return validation.response;
  }

  const existing = await prisma.weeklyPlan.findUnique({
    where: { id: params.id },
    include: { child: true },
  });
  if (!existing || !(await canViewChild(userId, existing.child))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (!(await canManageChild(userId, existing.child))) {
    return NextResponse.json({ error: '无权限编辑' }, { status: 403 });
  }

  const rawTasks = (existing.tasks as unknown as Partial<WeeklyTaskItem>[]) || [];
  const tasks = rawTasks.map((task) => normalizeWeeklyTask(task as WeeklyTaskItem));
  const taskIndex = tasks.findIndex((t) => t.id === params.taskId);
  if (taskIndex === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  const body = validation.data;
  const now = new Date().toISOString();
  const date = body.date || getTodayStr();

  const record: TaskCompletionRecord = {
    id: generateId(),
    date,
    status: body.status,
    progress: body.progress,
    actualDurationMinutes: body.actualDurationMinutes,
    quality: body.quality ?? null,
    note: body.note,
    imageUrls: body.imageUrls,
    audioUrls: body.audioUrls,
    audioTranscript: body.audioTranscript,
    capabilityProgress: body.capabilityProgress,
    quantityIncrement: body.quantityIncrement,
    checklistProgress: body.checklistProgress,
    createdAt: now,
    updatedAt: now,
  };

  const existingRecords = tasks[taskIndex].completionRecords || [];
  const sameDayIndex = existingRecords.findIndex((r) => r.date === date);

  let completionRecords: TaskCompletionRecord[];
  if (sameDayIndex >= 0) {
    completionRecords = existingRecords.map((r, idx) =>
      idx === sameDayIndex ? { ...record, id: r.id, createdAt: r.createdAt } : r
    );
  } else {
    completionRecords = [...existingRecords, record];
  }

  const isDone = body.status === 'done';
  const isSkipped = body.status === 'skipped';

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    status: body.status,
    completedAt: isDone ? now : isSkipped ? tasks[taskIndex].completedAt : undefined,
    note: body.note || undefined,
    completionRecords,
  };

  const updated = await prisma.weeklyPlan.update({
    where: { id: params.id },
    data: {
      tasks: tasks as unknown as object[],
    },
  });

  const normalizedTasks = ((updated.tasks as unknown as Partial<WeeklyTaskItem>[]) || []).map(
    (task) => normalizeWeeklyTask(task as WeeklyTaskItem)
  );

  if (isDone && existing.child) {
    try {
      const gamificationContext = await getGamificationContext(
        existing.child.id,
        userId
      );
      await checkAndAwardBadges(existing.child.id, gamificationContext);
    } catch (err) {
      console.error('[complete] gamification failed:', err);
    }
  }

  return NextResponse.json({ ...updated, tasks: normalizedTasks });
}
