import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateAiReview } from '@/lib/weeklyTasks';
import { normalizeWeeklyTask } from '@/lib/taskAlignment';
import { canViewChild, canManageChild } from '@/lib/family';
import type { WeeklyTaskItem } from '@/lib/storage.types';

type Params = { params: { id: string } };

export async function POST(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const plan = await prisma.weeklyPlan.findUnique({
    where: { id: params.id },
    include: { child: true },
  });

  if (!plan || !(await canViewChild(session.user.id, plan.child))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (!(await canManageChild(session.user.id, plan.child))) {
    return NextResponse.json({ error: '无权限编辑' }, { status: 403 });
  }

  const rawTasks = (plan.tasks as unknown as Partial<WeeklyTaskItem>[]) || [];
  const tasks = rawTasks.map((task) =>
    normalizeWeeklyTask(task as WeeklyTaskItem)
  );

  const summary = generateAiReview(
    { weekId: plan.weekId, childId: plan.childId, tasks },
    plan.child.name
  );

  const updated = await prisma.weeklyPlan.update({
    where: { id: params.id },
    data: {
      aiSummary: summary,
      aiSummaryGeneratedAt: new Date(),
    },
  });

  return NextResponse.json({
    aiSummary: updated.aiSummary,
    aiSummaryGeneratedAt: updated.aiSummaryGeneratedAt?.toISOString(),
  });
}
