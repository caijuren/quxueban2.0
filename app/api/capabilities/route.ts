import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  capabilityCreateSchema,
  validateBody,
} from '@/lib/validation';
import type { Capability, CapabilityCategory } from '@/lib/generated/prisma';

function normalizeCapability(cap: Capability) {
  return {
    ...cap,
    category: cap.category.toLowerCase(),
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const capabilities = await prisma.capability.findMany({
    where: {
      OR: [{ isSystem: true }, { userId: session.user.id }],
    },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });

  return NextResponse.json(capabilities.map(normalizeCapability));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(req, capabilityCreateSchema);
  if (!validation.success) {
    return validation.response;
  }

  const body = validation.data;
  const category = body.category.toUpperCase() as CapabilityCategory;

  const capability = await prisma.capability.create({
    data: {
      userId: session.user.id,
      name: body.name,
      category,
      description: body.description,
    },
  });

  return NextResponse.json(normalizeCapability(capability), { status: 201 });
}
