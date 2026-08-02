import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateDailySummary } from '@/lib/ai/dailySummary';
import { buildDailySummaryInput } from '@/lib/ai/dailySummaryInput';
import { Child, type EducationSystem } from '@/lib/children';
import { WeeklyTaskItem } from '@/lib/storage.types';
import { getISOWeek } from '@/lib/weeklyTasks';
import { dailySummarySchema, validateBody } from '@/lib/validation';

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function getDayName(dateStr: string): string {
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return dayNames[new Date(dateStr).getDay()];
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  const validation = await validateBody(req, dailySummarySchema);
  if (!validation.success) {
    return validation.response;
  }

  const body = validation.data;
  const date = body.date || getTodayStr();
  const dayName = getDayName(date);
  const weekId = getISOWeek(new Date(date)).weekId;

  const child = await prisma.child.findFirst({
    where: { id: body.childId, userId },
  });
  if (!child) {
    return NextResponse.json({ error: 'Child not found' }, { status: 404 });
  }

  const plan = await prisma.weeklyPlan.findFirst({
    where: { childId: body.childId, weekId, userId },
  });
  if (!plan) {
    return NextResponse.json({ error: 'Weekly plan not found' }, { status: 404 });
  }

  const childData: Child = {
    id: child.id,
    name: child.name,
    grade: child.grade,
    educationSystem: child.educationSystem as EducationSystem,
    avatarColor: child.avatarColor,
    avatarUrl: child.avatarUrl,
    targetSchool: child.targetSchool,
    currentSchool: child.currentSchool,
    birthday: child.birthday?.toISOString() ?? null,
    notes: child.notes,
    routeId: child.routeId,
  };

  const rawTasks = (plan.tasks as unknown as Partial<WeeklyTaskItem>[]) || [];

  const buildResult = buildDailySummaryInput(
    childData,
    date,
    dayName,
    rawTasks,
    body.taskIds ? { taskIds: body.taskIds } : undefined
  );

  if (!buildResult) {
    return NextResponse.json({ error: 'No tasks to summarize' }, { status: 400 });
  }

  const { summary, source } = await generateDailySummary(buildResult.input);

  return NextResponse.json({
    summary,
    source,
    date,
    dayName,
    childName: child.name,
  });
}
