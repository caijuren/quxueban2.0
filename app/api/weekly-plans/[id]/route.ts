import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { normalizeWeeklyTask, alignTaskFromTemplate } from '@/lib/taskAlignment';
import { weeklyPlanUpdateSchema, validateBody } from '@/lib/validation';
import { canManageChild, canViewChild } from '@/lib/family';
import type { WeeklyTaskItem } from '@/lib/storage.types';

type Params = { params: { id: string } };

async function authenticate() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export async function PATCH(req: Request, { params }: Params) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(req, weeklyPlanUpdateSchema);
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

  const body = validation.data;
  const data: Record<string, unknown> = {};

  if (body.tasks !== undefined) {
    const normalizedTasks = body.tasks.map((task) => {
      const normalized = normalizeWeeklyTask(task as WeeklyTaskItem);
      return alignTaskFromTemplate(normalized, {
        grade: existing.child.grade,
        routeId: existing.child.routeId,
      });
    });
    data.tasks = normalizedTasks;
  }
  if (body.goals !== undefined) {
    data.goals = body.goals as unknown as object[];
  }
  if (body.publishedAt !== undefined) {
    data.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
  }
  if (body.reviewedAt !== undefined) {
    data.reviewedAt = body.reviewedAt ? new Date(body.reviewedAt) : null;
  }
  if (body.parentComment !== undefined) data.parentComment = body.parentComment;
  if (body.aiSummary !== undefined) data.aiSummary = body.aiSummary;
  if (body.aiSummaryGeneratedAt !== undefined) {
    data.aiSummaryGeneratedAt = body.aiSummaryGeneratedAt
      ? new Date(body.aiSummaryGeneratedAt)
      : null;
  }

  const updated = await prisma.weeklyPlan.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: Params) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existing = await prisma.weeklyPlan.findUnique({
    where: { id: params.id },
    include: { child: true },
  });
  if (!existing || !(await canViewChild(userId, existing.child))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (!(await canManageChild(userId, existing.child))) {
    return NextResponse.json({ error: '无权限删除' }, { status: 403 });
  }

  await prisma.weeklyPlan.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
