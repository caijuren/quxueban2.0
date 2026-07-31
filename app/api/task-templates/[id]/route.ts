import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type Params = { params: { id: string } };

async function authenticate() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

function normalizeTemplate(tpl: any) {
  return {
    ...tpl,
    category: tpl.category.toLowerCase(),
    source: tpl.source.toLowerCase(),
    taskType: tpl.taskType.toLowerCase(),
    frequency: tpl.frequency.toLowerCase(),
    capabilityLinks: tpl.capabilityLinks?.map((link: any) => ({
      ...link,
      weight: Number(link.weight),
      expectedProgress: Number(link.expectedProgress),
      capability: link.capability
        ? {
            ...link.capability,
            category: link.capability.category.toLowerCase(),
          }
        : undefined,
    })),
  };
}

export async function PATCH(req: Request, { params }: Params) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existing = await prisma.taskTemplate.findFirst({
    where: { id: params.id, userId },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await req.json();
  const data: Record<string, unknown> = {};

  const stringFields = ['title', 'duration', 'description', 'milestoneTag', 'semesterTag', 'difficulty'] as const;
  stringFields.forEach((field) => {
    if (body[field] !== undefined) data[field] = body[field];
  });

  if (body.category !== undefined) {
    data.category = (body.category as string).toUpperCase() as any;
  }
  if (body.materials !== undefined) data.materials = body.materials;
  if (body.routeTags !== undefined) data.routeTags = body.routeTags;
  if (body.tags !== undefined) data.tags = body.tags;
  if (body.isActive !== undefined) data.isActive = body.isActive;
  if (body.taskType !== undefined) data.taskType = (body.taskType as string).toUpperCase();
  if (body.frequency !== undefined) data.frequency = (body.frequency as string).toUpperCase();
  if (body.customFrequency !== undefined) data.customFrequency = body.customFrequency;
  if (body.assessmentCriteria !== undefined) data.assessmentCriteria = body.assessmentCriteria;

  // archivedAt 支持两种写法：显式传 null 恢复，或 body.archive=true/false 切换
  if (body.archivedAt !== undefined) {
    data.archivedAt = body.archivedAt;
  } else if (body.archive === true) {
    data.archivedAt = new Date();
  } else if (body.archive === false) {
    data.archivedAt = null;
  }

  const updated = await prisma.$transaction(async (tx) => {
    if (body.capabilityLinks !== undefined) {
      await tx.taskCapabilityLink.deleteMany({
        where: { taskTemplateId: params.id },
      });
      await tx.taskCapabilityLink.createMany({
        data: (body.capabilityLinks as any[])
          .filter((link) => link.capabilityId)
          .map((link) => ({
            taskTemplateId: params.id,
            capabilityId: link.capabilityId,
            weight: Number(link.weight ?? 1),
            expectedProgress: Number(link.expectedProgress ?? 0),
          })),
      });
    }

    return tx.taskTemplate.update({
      where: { id: params.id },
      data,
      include: {
        capabilityLinks: {
          include: {
            capability: true,
          },
        },
      },
    });
  });

  return NextResponse.json(normalizeTemplate(updated));
}

export async function DELETE(_req: Request, { params }: Params) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existing = await prisma.taskTemplate.findFirst({
    where: { id: params.id, userId },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.taskTemplate.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
