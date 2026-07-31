import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function normalizeCapability(cap: any) {
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
      OR: [
        { isSystem: true },
        { userId: session.user.id },
      ],
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

  const body = await req.json();
  const { name, category, description } = body;

  if (!name || !category) {
    return NextResponse.json({ error: 'Name and category are required' }, { status: 400 });
  }

  const capability = await prisma.capability.create({
    data: {
      userId: session.user.id,
      name,
      category: (category as string).toUpperCase() as any,
      description,
    },
  });

  return NextResponse.json(normalizeCapability(capability), { status: 201 });
}
