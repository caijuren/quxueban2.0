import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  taskTemplateUpdateSchema,
  validateBody,
} from '@/lib/validation';
import type {
  TaskTemplate,
  TaskCapabilityLink,
  Capability,
} from '@/lib/generated/prisma';

type Params = { params: { id: string } };

type TaskTemplateWithLinks = TaskTemplate & {
  capabilityLinks: (TaskCapabilityLink & { capability: Capability | null })[];
};

async function authenticate() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

function normalizeTemplate(tpl: TaskTemplateWithLinks) {
  return {
    ...tpl,
    category: tpl.category.toLowerCase(),
    source: tpl.source.toLowerCase(),
    taskType: tpl.taskType.toLowerCase(),
    frequency: tpl.frequency.toLowerCase(),
    weeklySchedule: tpl.weeklySchedule.toLowerCase(),
    capabilityLinks: tpl.capabilityLinks.map((link) => ({
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

function toPrismaUpdateData(body: ReturnType<typeof taskTemplateUpdateSchema.parse>) {
  const data: Record<string, unknown> = {};

  const stringFields = [
    'title',
    'duration',
    'description',
    'milestoneTag',
    'semesterTag',
    'difficulty',
  ] as const;
  stringFields.forEach((field) => {
    if (body[field] !== undefined) data[field] = body[field];
  });

  if (body.category !== undefined) {
    data.category = body.category.toUpperCase();
  }
  if (body.materials !== undefined) data.materials = body.materials;
  if (body.routeTags !== undefined) data.routeTags = body.routeTags;
  if (body.tags !== undefined) data.tags = body.tags;
  if (body.taskType !== undefined) data.taskType = body.taskType.toUpperCase();
  if (body.frequency !== undefined) data.frequency = body.frequency.toUpperCase();
  if (body.customFrequency !== undefined) data.customFrequency = body.customFrequency;
  if (body.assessmentCriteria !== undefined) data.assessmentCriteria = body.assessmentCriteria;
  if (body.weeklySchedule !== undefined) data.weeklySchedule = body.weeklySchedule.toUpperCase();
  if (body.customScheduleDays !== undefined) data.customScheduleDays = body.customScheduleDays;

  if (body.archive === true) {
    data.archivedAt = new Date();
  } else if (body.archive === false) {
    data.archivedAt = null;
  }

  return data;
}

export async function PATCH(req: Request, { params }: Params) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(req, taskTemplateUpdateSchema);
  if (!validation.success) {
    return validation.response;
  }

  const existing = await prisma.taskTemplate.findFirst({
    where: { id: params.id, userId },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = validation.data;
  const data = toPrismaUpdateData(body);

  const updated = await prisma.$transaction(async (tx) => {
    if (body.capabilityLinks !== undefined) {
      await tx.taskCapabilityLink.deleteMany({
        where: { taskTemplateId: params.id },
      });
      await tx.taskCapabilityLink.createMany({
        data: body.capabilityLinks
          .filter((link) => link.capabilityId)
          .map((link) => ({
            taskTemplateId: params.id,
            capabilityId: link.capabilityId,
            weight: link.weight,
            expectedProgress: link.expectedProgress,
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
