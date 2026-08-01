import { PrismaClient } from './generated/prisma';
import { SYSTEM_TASK_TEMPLATES } from './taskTemplates';

export async function seedSystemTaskTemplatesForUser(
  prisma: PrismaClient,
  userId: string
): Promise<number> {
  const existingCount = await prisma.taskTemplate.count({
    where: { userId, source: 'SYSTEM' },
  });

  let createdCount = 0;

  if (existingCount === 0) {
    const data = SYSTEM_TASK_TEMPLATES.map((tpl) => ({
      userId,
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
  await seedSystemTemplateCapabilityLinks(prisma, userId);

  // 同步更新已存在系统模板的路线标签（修正路线 ID 与最新定义保持一致）
  await syncSystemTemplateRouteTags(prisma, userId);

  // 同步更新已存在系统模板的时间属性
  await syncSystemTemplateWeeklySchedule(prisma, userId);

  return createdCount;
}

async function syncSystemTemplateRouteTags(
  prisma: PrismaClient,
  userId: string
): Promise<void> {
  const systemTemplates = await prisma.taskTemplate.findMany({
    where: { userId, source: 'SYSTEM' },
  });

  for (const dbTpl of systemTemplates) {
    const latest = SYSTEM_TASK_TEMPLATES.find((t) => t.title === dbTpl.title);
    if (!latest) continue;

    const latestTags = latest.routeTags ?? [];
    const currentTags = dbTpl.routeTags ?? [];
    const needsUpdate =
      latestTags.length !== currentTags.length ||
      latestTags.some((tag) => !currentTags.includes(tag)) ||
      currentTags.some((tag) => !latestTags.includes(tag));

    if (needsUpdate) {
      await prisma.taskTemplate.update({
        where: { id: dbTpl.id },
        data: { routeTags: latestTags },
      });
    }
  }
}

async function syncSystemTemplateWeeklySchedule(
  prisma: PrismaClient,
  userId: string
): Promise<void> {
  const systemTemplates = await prisma.taskTemplate.findMany({
    where: { userId, source: 'SYSTEM' },
  });

  for (const dbTpl of systemTemplates) {
    const latest = SYSTEM_TASK_TEMPLATES.find((t) => t.title === dbTpl.title);
    if (!latest) continue;

    const latestScheduleRaw = latest.weeklySchedule;
    if (!latestScheduleRaw) continue;
    const latestSchedule = latestScheduleRaw.toUpperCase();
    const latestDays = latest.customScheduleDays ?? [];
    const currentSchedule = dbTpl.weeklySchedule ?? 'AUTO';
    const currentDays = dbTpl.customScheduleDays ?? [];

    const latestDayStrings = latestDays as string[];
    const daysChanged =
      latestDayStrings.length !== currentDays.length ||
      latestDayStrings.some((d) => !currentDays.includes(d)) ||
      currentDays.some((d) => !latestDayStrings.includes(d));

    if (latestSchedule !== currentSchedule || daysChanged) {
      await prisma.taskTemplate.update({
        where: { id: dbTpl.id },
        data: {
          weeklySchedule: latestSchedule as any,
          customScheduleDays: latestDays,
        },
      });
    }
  }
}

async function seedSystemTemplateCapabilityLinks(
  prisma: PrismaClient,
  userId: string
): Promise<void> {
  const systemCapabilities = await prisma.capability.findMany({
    where: { isSystem: true },
  });
  if (systemCapabilities.length === 0) return;

  const capabilityMap = new Map(systemCapabilities.map((c) => [c.name, c.id]));

  const createdTemplates = await prisma.taskTemplate.findMany({
    where: { userId, source: 'SYSTEM' },
  });
  const templateMap = new Map(createdTemplates.map((t) => [t.title, t.id]));

  const links: { taskTemplateId: string; capabilityId: string; weight: number; expectedProgress: number }[] = [];

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
