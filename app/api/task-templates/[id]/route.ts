import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type Params = { params: { id: string } };

async function authenticate() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
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

  const stringFields = ['title', 'duration', 'description', 'milestoneTag'] as const;
  stringFields.forEach((field) => {
    if (body[field] !== undefined) data[field] = body[field];
  });

  if (body.category !== undefined) {
    data.category = (body.category as string).toUpperCase() as any;
  }
  if (body.gradeMin !== undefined) data.gradeMin = body.gradeMin;
  if (body.gradeMax !== undefined) data.gradeMax = body.gradeMax;
  if (body.materials !== undefined) data.materials = body.materials;
  if (body.routeTags !== undefined) data.routeTags = body.routeTags;
  if (body.isActive !== undefined) data.isActive = body.isActive;

  const updated = await prisma.taskTemplate.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json({
    ...updated,
    category: updated.category.toLowerCase(),
    source: updated.source.toLowerCase(),
  });
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
