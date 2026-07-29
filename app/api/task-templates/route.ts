import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { seedSystemTaskTemplatesForUser } from '@/lib/seedTaskTemplates';
import { TaskCategory } from '@/lib/storage.types';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') as TaskCategory | null;

  // Auto-seed system presets for existing users on first load
  await seedSystemTaskTemplatesForUser(prisma, session.user.id);

  const templates = await prisma.taskTemplate.findMany({
    where: {
      userId: session.user.id,
      isActive: true,
      ...(category ? { category: category.toUpperCase() as any } : {}),
    },
    orderBy: [{ source: 'asc' }, { category: 'asc' }, { createdAt: 'desc' }],
  });

  // Normalize Prisma enum (uppercase) to frontend convention (lowercase)
  const normalized = templates.map((tpl) => ({
    ...tpl,
    category: tpl.category.toLowerCase(),
    source: tpl.source.toLowerCase(),
  }));

  return NextResponse.json(normalized);
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
    gradeMin,
    gradeMax,
    duration,
    materials,
    description,
    routeTags,
    milestoneTag,
  } = body;

  if (!title || !category) {
    return NextResponse.json({ error: 'Title and category are required' }, { status: 400 });
  }

  const template = await prisma.taskTemplate.create({
    data: {
      userId: session.user.id,
      title,
      category: (category as string).toUpperCase() as any,
      gradeMin: gradeMin ?? 1,
      gradeMax: gradeMax ?? 12,
      duration: duration ?? '30分钟',
      materials: materials ?? [],
      description,
      routeTags: routeTags ?? [],
      milestoneTag,
      source: 'USER',
      isActive: true,
    },
  });

  return NextResponse.json(
    {
      ...template,
      category: template.category.toLowerCase(),
      source: template.source.toLowerCase(),
    },
    { status: 201 }
  );
}
