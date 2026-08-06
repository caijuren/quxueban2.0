import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canManageChild } from '@/lib/family';
import { Prisma } from '@/lib/generated/prisma';
import { SYSTEM_TASK_TEMPLATES } from '@/lib/taskTemplates';
import { seedSystemCapabilities } from '@/lib/seedCapabilities';
import type {
  TaskTemplate,
  TaskCapabilityLink,
  Capability,
} from '@/lib/generated/prisma';

const importSchema = {
  parse: (body: unknown) => {
    if (
      typeof body !== 'object' ||
      body === null ||
      !('childId' in body) ||
      typeof (body as Record<string, unknown>).childId !== 'string' ||
      !('templateIds' in body) ||
      !Array.isArray((body as Record<string, unknown>).templateIds)
    ) {
      throw new Error('请求参数不正确');
    }
    return {
      childId: (body as Record<string, string>).childId,
      templateIds: (body as Record<string, string[]>).templateIds,
    };
  },
};

type TaskTemplateWithLinks = TaskTemplate & {
  capabilityLinks: (TaskCapabilityLink & { capability: Capability | null })[];
};

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

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  let parsed: { childId: string; templateIds: string[] };
  try {
    parsed = importSchema.parse(body);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '请求参数不正确' },
      { status: 400 }
    );
  }

  const { childId, templateIds } = parsed;

  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child || !(await canManageChild(session.user.id, child))) {
    return NextResponse.json(
      { error: '孩子不存在或无权限' },
      { status: 404 }
    );
  }

  await seedSystemCapabilities(prisma);

  const systemCapabilities = await prisma.capability.findMany({
    where: { isSystem: true },
  });
  const capabilityMap = new Map(systemCapabilities.map((c) => [c.name, c.id]));

  const createdTemplates: TaskTemplateWithLinks[] = [];

  for (const templateId of templateIds) {
    const systemTpl = SYSTEM_TASK_TEMPLATES.find((t) => t.id === templateId);
    if (!systemTpl) continue;

    const existing = await prisma.taskTemplate.findFirst({
      where: {
        userId: session.user.id,
        childId,
        title: systemTpl.title,
      },
    });
    if (existing) continue;

    const created = await prisma.taskTemplate.create({
      data: {
        userId: session.user.id,
        childId,
        title: systemTpl.title,
        category: systemTpl.category.toUpperCase() as any,
        duration: systemTpl.duration,
        difficulty: systemTpl.difficulty,
        materials: systemTpl.materials,
        description: systemTpl.description,
        routeTags: systemTpl.routeTags,
        milestoneTag: systemTpl.milestoneTag,
        semesterTag: systemTpl.semesterTag,
        tags: systemTpl.tags,
        source: 'USER',
        isActive: true,
        taskType: (systemTpl.taskType ?? 'daily').toUpperCase() as any,
        frequency: (systemTpl.frequency ?? 'once').toUpperCase() as any,
        weeklySchedule: (systemTpl.weeklySchedule ?? 'auto').toUpperCase() as any,
        customScheduleDays: systemTpl.customScheduleDays ?? [],
        assessmentCriteria: (systemTpl.assessmentCriteria ?? []) as unknown as Prisma.InputJsonValue,
        capabilityLinks: {
          create: (systemTpl.capabilityLinks
            ?.map((link) => {
              const capabilityId = capabilityMap.get(link.capabilityName);
              if (!capabilityId) return null;
              return {
                capabilityId,
                weight: link.weight,
                expectedProgress: link.expectedProgress,
              };
            })
            .filter((link): link is NonNullable<typeof link> => link !== null) ?? []) as unknown as Prisma.TaskCapabilityLinkCreateWithoutTaskTemplateInput[],
        },
      },
      include: {
        capabilityLinks: {
          include: {
            capability: true,
          },
        },
      },
    });

    createdTemplates.push(created);
  }

  return NextResponse.json(
    {
      createdCount: createdTemplates.length,
      templates: createdTemplates.map(normalizeTemplate),
    },
    { status: 201 }
  );
}
