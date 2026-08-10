import { PrismaClient } from './generated/prisma';
import { SYSTEM_TASK_TEMPLATES } from './taskTemplates';

export async function seedSystemTaskTemplatesForChild(
  prisma: PrismaClient,
  userId: string,
  childId: string
): Promise<number> {
  const existingCount = await prisma.taskTemplate.count({
    where: { userId, childId, source: 'SYSTEM' } as any,
  });

  let createdCount = 0;

  if (existingCount === 0) {
    const data = SYSTEM_TASK_TEMPLATES.map((tpl) => ({
      userId,
      childId,
      title: tpl.title,
      category: tpl.category.toUpperCase() as any,
      duration: tpl.duration,
      difficulty: tpl.difficulty,
      materials: tpl.materials,
      description: tpl.description,
      routeTags: tpl.routeTags,
      milestoneTag: tpl.milestoneTag,
      semesterTag: tpl.semesterTag,
      tags: tpl.tags,
      source: 'SYSTEM' as const,
      isActive: tpl.isActive,
      taskType: (tpl.taskType ?? 'daily').toUpperCase() as any,
      frequency: (tpl.frequency ?? 'once').toUpperCase() as any,
      customFrequency: tpl.customFrequency ?? undefined,
      weeklySchedule: (tpl.weeklySchedule ?? 'auto').toUpperCase() as any,
      customScheduleDays: tpl.customScheduleDays ?? [],
      assessmentCriteria: tpl.assessmentCriteria ?? [],
    }));

    await prisma.taskTemplate.createMany({
      data: data as any[],
      skipDuplicates: false,
    });

    createdCount = data.length;
  }

  // 同步创建系统模板的能力关联（已存在模板时也会补全缺失的关联）
  await seedSystemTemplateCapabilityLinks(prisma, userId, childId);

  return createdCount;
}

async function seedSystemTemplateCapabilityLinks(
  prisma: PrismaClient,
  userId: string,
  childId: string
): Promise<void> {
  const systemCapabilities = await prisma.capability.findMany({
    where: { isSystem: true },
  });
  if (systemCapabilities.length === 0) return;

  const capabilityMap = new Map(systemCapabilities.map((c) => [c.name, c.id]));

  const createdTemplates = await prisma.taskTemplate.findMany({
    where: { userId, childId, source: 'SYSTEM' } as any,
  });
  const templateMap = new Map(createdTemplates.map((t) => [t.title, t.id]));

  const links: {
    taskTemplateId: string;
    capabilityId: string;
    weight: number;
    expectedProgress: number;
  }[] = [];

  for (const tpl of SYSTEM_TASK_TEMPLATES) {
    const taskTemplateId = templateMap.get(tpl.title);
    if (!taskTemplateId || !tpl.capabilityLinks?.length) continue;

    for (const link of tpl.capabilityLinks) {
      const capabilityId = capabilityMap.get(link.capabilityName);
      if (!capabilityId) continue;
      links.push({
        taskTemplateId,
        capabilityId,
        weight: Number(link.weight ?? 1),
        expectedProgress: Number(link.expectedProgress ?? 0),
      });
    }
  }

  if (links.length === 0) return;

  await prisma.taskCapabilityLink.createMany({
    data: links as any[],
    skipDuplicates: true,
  });
}
