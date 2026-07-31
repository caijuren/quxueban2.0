import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { seedSystemTaskTemplatesForUser } from '@/lib/seedTaskTemplates';
import { seedSystemCapabilities } from '@/lib/seedCapabilities';
import { TaskCategory } from '@/lib/storage.types';

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

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') as TaskCategory | null;
  const status = searchParams.get('status') as 'active' | 'archived' | 'all' | null;

  // Auto-seed system presets for existing users on first load
  await seedSystemTaskTemplatesForUser(prisma, session.user.id);
  await seedSystemCapabilities(prisma);

  const where: Record<string, unknown> = {
    userId: session.user.id,
  };

  if (status === 'active' || !status) {
    where.isActive = true;
    where.archivedAt = null;
  } else if (status === 'archived') {
    where.archivedAt = { not: null };
  }
  // status === 'all' 不附加过滤条件

  if (category) {
    where.category = category.toUpperCase();
  }

  const templates = await prisma.taskTemplate.findMany({
    where,
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
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const {
    title,
    category,
    duration,
    difficulty,
    materials,
    description,
    routeTags,
    milestoneTag,
    semesterTag,
    tags,
    taskType,
    frequency,
    customFrequency,
    assessmentCriteria,
    capabilityLinks,
  } = body;

  if (!title || !category) {
    return NextResponse.json({ error: 'Title and category are required' }, { status: 400 });
  }

  const template = await prisma.taskTemplate.create({
    data: {
      userId: session.user.id,
      title,
      category: (category as string).toUpperCase() as any,
      duration: duration ?? '30分钟',
      difficulty: difficulty ?? 'medium',
      materials: materials ?? [],
      description,
      routeTags: routeTags ?? [],
      milestoneTag,
      semesterTag,
      tags: tags ?? [],
      source: 'USER',
      isActive: true,
      taskType: ((taskType as string)?.toUpperCase() ?? 'DAILY') as any,
      frequency: ((frequency as string)?.toUpperCase() ?? 'ONCE') as any,
      customFrequency: customFrequency ?? null,
      assessmentCriteria: assessmentCriteria ?? [],
      capabilityLinks: {
        create: (capabilityLinks ?? [])
          .filter((link: any) => link.capabilityId)
          .map((link: any) => ({
            capabilityId: link.capabilityId,
            weight: Number(link.weight ?? 1),
            expectedProgress: Number(link.expectedProgress ?? 0),
          })),
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

  return NextResponse.json(normalizeTemplate(template), { status: 201 });
}
