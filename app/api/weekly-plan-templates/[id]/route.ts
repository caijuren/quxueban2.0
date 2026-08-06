import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  weeklyPlanTemplateUpdateSchema,
  validateBody,
} from '@/lib/validation';
import { canManageChild, canViewChild } from '@/lib/family';
import type { WeeklyTaskItem } from '@/lib/storage.types';

type Params = { params: { id: string } };

async function authenticate() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export async function GET(_req: Request, { params }: Params) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const template = await prisma.weeklyPlanTemplate.findUnique({
    where: { id: params.id },
    include: { child: true },
  });

  if (!template || template.userId !== userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (template.child && !(await canViewChild(userId, template.child))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    ...template,
    tasks: (template.tasks as unknown as WeeklyTaskItem[]) || [],
    goals: (template.goals as unknown as object[]) || [],
  });
}

export async function PATCH(req: Request, { params }: Params) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(req, weeklyPlanTemplateUpdateSchema);
  if (!validation.success) {
    return validation.response;
  }

  const existing = await prisma.weeklyPlanTemplate.findUnique({
    where: { id: params.id },
    include: { child: true },
  });

  if (!existing || existing.userId !== userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (existing.child && !(await canManageChild(userId, existing.child))) {
    return NextResponse.json({ error: '无权限编辑' }, { status: 403 });
  }

  const body = validation.data;
  const data: Record<string, unknown> = {};

  if (body.name !== undefined) data.name = body.name;
  if (body.description !== undefined) data.description = body.description;
  if (body.tasks !== undefined) {
    data.tasks = body.tasks as unknown as object[];
  }
  if (body.goals !== undefined) {
    data.goals = body.goals as unknown as object[];
  }
  if (body.isDefault !== undefined) data.isDefault = body.isDefault;

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.weeklyPlanTemplate.update({
      where: { id: params.id },
      data,
    });

    if (body.isDefault && existing.childId) {
      await tx.weeklyPlanTemplate.updateMany({
        where: {
          userId,
          childId: existing.childId,
          id: { not: params.id },
        },
        data: { isDefault: false },
      });
    }

    return result;
  });

  return NextResponse.json({
    ...updated,
    tasks: (updated.tasks as unknown as WeeklyTaskItem[]) || [],
    goals: (updated.goals as unknown as object[]) || [],
  });
}

export async function DELETE(_req: Request, { params }: Params) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existing = await prisma.weeklyPlanTemplate.findUnique({
    where: { id: params.id },
    include: { child: true },
  });

  if (!existing || existing.userId !== userId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (existing.child && !(await canManageChild(userId, existing.child))) {
    return NextResponse.json({ error: '无权限删除' }, { status: 403 });
  }

  await prisma.weeklyPlanTemplate.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
