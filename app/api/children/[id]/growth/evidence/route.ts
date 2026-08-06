import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canViewChild } from '@/lib/family';
import { GrowthEvidenceItem } from '@/lib/growth';
import { WeeklyTaskItem } from '@/lib/storage.types';

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const child = await prisma.child.findUnique({
    where: { id: params.id },
  });

  if (!child || !(await canViewChild(session.user.id, child))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const weeklyPlans = await prisma.weeklyPlan.findMany({
    where: { childId: params.id },
    select: { weekId: true, tasks: true },
  });

  const items: GrowthEvidenceItem[] = [];

  for (const plan of weeklyPlans) {
    const tasks = (plan.tasks as unknown as WeeklyTaskItem[]) ?? [];
    for (const task of tasks) {
      const records = task.completionRecords ?? [];
      for (const record of records) {
        const hasMedia = record.imageUrls.length > 0 || record.audioUrls.length > 0;
        if (!hasMedia) continue;

        items.push({
          id: record.id,
          date: record.createdAt ?? record.date ?? new Date().toISOString(),
          taskId: task.id,
          taskTitle: task.focus || '周任务',
          weekId: plan.weekId,
          note: record.note,
          imageUrls: record.imageUrls,
          audioUrls: record.audioUrls,
          audioTranscript: record.audioTranscript,
        });
      }
    }
  }

  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json({ items });
}
