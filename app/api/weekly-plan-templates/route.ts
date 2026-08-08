import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { weeklyPlanTemplateCreateSchema, validateBody } from '@/lib/validation';
import { canManageChild, canViewChild, getViewableChildIdsForUser } from '@/lib/family';
import type { WeeklyTaskItem } from '@/lib/storage.types';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const childId = searchParams.get('childId');

  const viewableChildIds = await getViewableChildIdsForUser(session.user.id);
  if (childId && !viewableChildIds.includes(childId)) {
    return NextResponse.json([]);
  }

  const templates = await prisma.weeklyPlanTemplate.findMany({
    where: {
      userId: session.user.id,
      OR: [
        { childId: null },
        ...(childId ? [{ childId }] : [{ childId: { in: viewableChildIds } }]),
      ],
    },
    orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
  });

  return NextResponse.json(
    templates.map((tpl) => ({
      ...tpl,
      tasks: (tpl.tasks as unknown as WeeklyTaskItem[]) || [],
      goals: (tpl.goals as unknown as object[]) || [],
    }))
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(req, weeklyPlanTemplateCreateSchema);
  if (!validation.success) {
    return validation.response;
  }

  const body = validation.data;

  if (body.childId) {
    const child = await prisma.child.findUnique({
      where: { id: body.childId },
    });
    if (!child || !(await canViewChild(session.user.id, child))) {
      return NextResponse.json({ error: '孩子不存在或无权限' }, { status: 404 });
    }
    if (!(await canManageChild(session.user.id, child))) {
      return NextResponse.json({ error: '无权限管理该孩子' }, { status: 403 });
    }
  }

  const data = {
    userId: session.user.id,
    childId: body.childId || null,
    name: body.name,
    description: body.description || null,
    tasks: body.tasks as unknown as object[],
    goals: body.goals as unknown as object[],
    isDefault: body.isDefault ?? false,
  };

  const created = await prisma.weeklyPlanTemplate.create({ data });

  if (data.isDefault && data.childId) {
    await prisma.weeklyPlanTemplate.updateMany({
      where: {
        userId: session.user.id,
        childId: data.childId,
        id: { not: created.id },
      },
      data: { isDefault: false },
    });
  }

  return NextResponse.json(
    {
      ...created,
      tasks: (created.tasks as unknown as WeeklyTaskItem[]) || [],
      goals: (created.goals as unknown as object[]) || [],
    },
    { status: 201 }
  );
}
