import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canViewChild } from '@/lib/family';
import { GrowthTimelineItem } from '@/lib/growth';
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

  const [weeklyPlans, milestones, parentLogs, badges, pointLogs] = await Promise.all([
    prisma.weeklyPlan.findMany({
      where: { childId: params.id },
      select: { weekId: true, tasks: true },
    }),
    prisma.milestone.findMany({
      where: { childId: params.id, status: 'completed' },
      select: { id: true, title: true, description: true, completedAt: true },
    }),
    prisma.parentLog.findMany({
      where: { childId: params.id },
      select: { id: true, date: true, content: true, tags: true, imageUrls: true },
    }),
    prisma.badge.findMany({
      where: { childId: params.id },
      select: { id: true, key: true, name: true, description: true, icon: true, color: true, level: true, unlockedAt: true },
    }),
    prisma.pointLog.findMany({
      where: { childId: params.id },
      select: { id: true, points: true, total: true, reason: true, source: true, createdAt: true },
    }),
  ]);

  const items: GrowthTimelineItem[] = [];

  for (const plan of weeklyPlans) {
    const tasks = (plan.tasks as unknown as WeeklyTaskItem[]) ?? [];
    for (const task of tasks) {
      const records = task.completionRecords ?? [];
      for (const record of records) {
        items.push({
          type: 'task',
          id: record.id,
          date: record.createdAt ?? record.date ?? new Date().toISOString(),
          title: task.focus || '周任务',
          subject: task.subjectId,
          status: record.status,
          note: record.note,
        });
      }
    }
  }

  for (const milestone of milestones) {
    if (!milestone.completedAt) continue;
    items.push({
      type: 'milestone',
      id: milestone.id,
      date: milestone.completedAt.toISOString(),
      title: milestone.title,
      description: milestone.description,
    });
  }

  for (const log of parentLogs) {
    items.push({
      type: 'parentLog',
      id: log.id,
      date: new Date(log.date).toISOString(),
      title: log.content.slice(0, 40) + (log.content.length > 40 ? '…' : ''),
      content: log.content,
      tags: log.tags,
      imageUrls: log.imageUrls,
    });
  }

  for (const badge of badges) {
    items.push({
      type: 'badge',
      id: badge.id,
      date: badge.unlockedAt.toISOString(),
      title: badge.name,
      description: badge.description,
      icon: badge.icon,
      color: badge.color,
      level: badge.level,
    });
  }

  for (const point of pointLogs) {
    items.push({
      type: 'pointLog',
      id: point.id,
      date: point.createdAt.toISOString(),
      title: point.reason,
      points: point.points,
      total: point.total,
      reason: point.reason,
      source: point.source,
    });
  }

  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json({ items });
}
