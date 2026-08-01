import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { capabilityUpdateSchema, validateBody } from '@/lib/validation';
import type { Capability, CapabilityCategory } from '@/lib/generated/prisma';

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

  const validation = await validateBody(req, capabilityUpdateSchema);
  if (!validation.success) {
    return validation.response;
  }

  const existing = await prisma.capability.findFirst({
    where: { id: params.id, userId },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = validation.data;
  const data: Record<string, unknown> = {};

  if (body.name !== undefined) data.name = body.name;
  if (body.description !== undefined) data.description = body.description;
  if (body.category !== undefined) {
    data.category = body.category.toUpperCase() as CapabilityCategory;
  }

  const updated = await prisma.capability.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json({
    ...updated,
    category: updated.category.toLowerCase(),
  });
}

export async function DELETE(_req: Request, { params }: Params) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existing = await prisma.capability.findFirst({
    where: { id: params.id, userId },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.capability.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
