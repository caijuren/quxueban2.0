import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { childCreateSchema, validateBody } from '@/lib/validation';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const children = await prisma.child.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(children);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(req, childCreateSchema);
  if (!validation.success) {
    return validation.response;
  }

  const body = validation.data;

  try {
    const child = await prisma.child.create({
      data: {
        userId: session.user.id,
        name: body.name,
        grade: body.grade,
        educationSystem: body.educationSystem,
        avatarColor: body.avatarColor || '#f43f5e',
        avatarUrl: body.avatarUrl ?? null,
        targetSchool: body.targetSchool ?? null,
        currentSchool: body.currentSchool ?? null,
        birthday: body.birthday ? new Date(body.birthday) : null,
        notes: body.notes ?? null,
        routeId: body.routeId ?? null,
      },
    });

    return NextResponse.json(child, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
