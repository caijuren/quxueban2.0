import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { seedSystemTaskTemplatesForChild } from '@/lib/seedTaskTemplates';
import { seedSystemCapabilities } from '@/lib/seedCapabilities';
import {
  taskCategorySchema,
  taskTemplateCreateSchema,
  validateBody,
} from '@/lib/validation';
import type {
  TaskTemplate,
  TaskCapabilityLink,
  Capability,
} from '@/lib/generated/prisma';

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

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') as 'active' | 'archived' | 'all' | null;
    const childId = searchParams.get('childId');

    if (!childId) {
      return NextResponse.json(
        { error: '缺少 childId 参数' },
        { status: 400 }
      );
    }

    // 验证当前用户确实拥有该孩子
    const child = await prisma.child.findFirst({
      where: { id: childId, userId: session.user.id },
    });
    if (!child) {
      return NextResponse.json(
        { error: '孩子不存在或无权限' },
        { status: 404 }
      );
    }

    // 同步系统预设（按孩子维度）
    await seedSystemTaskTemplatesForChild(prisma, session.user.id, childId);
    await seedSystemCapabilities(prisma);

    const where: Record<string, unknown> = {
      userId: session.user.id,
      childId,
    };

    if (status === 'active' || !status) {
      where.isActive = true;
      where.archivedAt = null;
    } else if (status === 'archived') {
      where.archivedAt = { not: null };
    }
    // status === 'all' 不附加过滤条件

    if (category) {
      const parsed = taskCategorySchema.safeParse(category);
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Invalid category' },
          { status: 400 }
        );
      }
      where.category = parsed.data.toUpperCase();
    }

    const templates = await prisma.taskTemplate.findMany({
      where: where as any,
      orderBy: [{ source: 'asc' }, { category: 'asc' }, { createdAt: 'desc' }],
      include: {
        capabilityLinks: {
          include: {
            capability: true,
          },
        },
      },
    });

    return NextResponse.json(templates.map(normalizeTemplate));
  } catch (err: unknown) {
    console.error('[task-templates GET]', err);
    const message = err instanceof Error ? err.message : '加载任务库失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(req, taskTemplateCreateSchema);
  if (!validation.success) {
    return validation.response;
  }

  const body = validation.data;

  // 验证当前用户确实拥有该孩子
  const child = await prisma.child.findFirst({
    where: { id: body.childId, userId: session.user.id },
  });
  if (!child) {
    return NextResponse.json(
      { error: '孩子不存在或无权限' },
      { status: 404 }
    );
  }

  const template = await prisma.taskTemplate.create({
    data: {
      userId: session.user.id,
      childId: body.childId,
      title: body.title,
      category: body.category.toUpperCase() as TaskTemplateWithLinks['category'],
      duration: body.duration,
      difficulty: body.difficulty,
      materials: body.materials,
      description: body.description,
      routeTags: body.routeTags,
      milestoneTag: body.milestoneTag,
      semesterTag: body.semesterTag,
      tags: body.tags,
      source: 'USER',
      isActive: true,
      taskType: body.taskType.toUpperCase() as TaskTemplateWithLinks['taskType'],
      frequency: body.frequency.toUpperCase() as TaskTemplateWithLinks['frequency'],
      customFrequency: body.customFrequency ?? undefined,
      weeklySchedule: body.weeklySchedule.toUpperCase() as TaskTemplateWithLinks['weeklySchedule'],
      customScheduleDays: body.customScheduleDays,
      assessmentCriteria: body.assessmentCriteria,
      capabilityLinks: {
        create: body.capabilityLinks
          .filter((link) => link.capabilityId)
          .map((link) => ({
            capabilityId: link.capabilityId,
            weight: link.weight,
            expectedProgress: link.expectedProgress,
          })),
      },
    } as any,
    include: {
      capabilityLinks: {
        include: {
          capability: true,
        },
      },
    },
  });

  return NextResponse.json(normalizeTemplate(template), { status: 201 });
}
