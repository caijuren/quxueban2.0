import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  assessTaskRationality,
  AssessmentTaskInput,
  AssessmentContext,
} from '@/lib/ai/taskAssessment';
import { Child, type EducationSystem } from '@/lib/children';
import { WeeklyTaskItem, TaskTemplate, Capability } from '@/lib/storage.types';
import { aiTaskAssessmentSchema, validateBody } from '@/lib/validation';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(req, aiTaskAssessmentSchema);
  if (!validation.success) {
    return validation.response;
  }

  const { childId, task, context = {} } = validation.data;
  const userId = session.user.id;

  const child = await prisma.child.findFirst({
    where: { id: childId, userId },
  });
  if (!child) {
    return NextResponse.json({ error: 'Child not found' }, { status: 404 });
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

  // 若前端未传上下文，从数据库补齐当前周计划与任务模板
  let existingTasks: WeeklyTaskItem[] = context.existingTasks ?? [];
  let existingTemplates: TaskTemplate[] =
    (context.existingTemplates as TaskTemplate[] | undefined) ?? [];

  if (existingTasks.length === 0) {
    const currentWeekPlan = await prisma.weeklyPlan.findFirst({
      where: { childId, userId },
      orderBy: { weekId: 'desc' },
    });
    if (currentWeekPlan) {
      existingTasks = (currentWeekPlan.tasks as unknown as WeeklyTaskItem[]) ?? [];
    }
  }

  if (existingTemplates.length === 0) {
    const rawTemplates = await prisma.taskTemplate.findMany({
      where: {
        userId,
        isActive: true,
        archivedAt: null,
      },
      include: {
        capabilityLinks: {
          include: { capability: true },
        },
      },
    });
    existingTemplates = rawTemplates as unknown as TaskTemplate[];
  }

  const assessmentContext: AssessmentContext = {
    existingTasks,
    existingTemplates,
    capabilities: (context.capabilities as Capability[] | undefined) ?? undefined,
    selectedDay: context.selectedDay,
  };

  const assessment = assessTaskRationality(
    childData,
    task as AssessmentTaskInput,
    assessmentContext
  );

  return NextResponse.json(assessment);
}
