import { PrismaClient } from './generated/prisma';
import { SYSTEM_TASK_TEMPLATES } from './taskTemplates';

export async function seedSystemTaskTemplatesForUser(
  prisma: PrismaClient,
  userId: string
): Promise<number> {
  const existingCount = await prisma.taskTemplate.count({
    where: { userId, source: 'SYSTEM' },
  });

  if (existingCount > 0) {
    return 0;
  }

  const data = SYSTEM_TASK_TEMPLATES.map((tpl) => ({
    userId,
    title: tpl.title,
    category: tpl.category.toUpperCase() as any,
    gradeMin: tpl.gradeMin,
    gradeMax: tpl.gradeMax,
    duration: tpl.duration,
    materials: tpl.materials,
    description: tpl.description,
    routeTags: tpl.routeTags,
    milestoneTag: tpl.milestoneTag,
    source: 'SYSTEM' as const,
    isActive: tpl.isActive,
  }));

  await prisma.taskTemplate.createMany({
    data,
    skipDuplicates: false,
  });

  return data.length;
}
