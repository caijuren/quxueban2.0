import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

  try {
    const body = await req.json();
    const {
      name,
      grade,
      educationSystem,
      avatarColor,
      avatarUrl,
      targetSchool,
      currentSchool,
      birthday,
      notes,
      routeId,
    } = body;

    if (!name || typeof grade !== 'number') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const child = await prisma.child.create({
      data: {
        userId: session.user.id,
        name,
        grade,
        educationSystem: educationSystem === 'five-four' ? 'five-four' : 'six-three',
        avatarColor: avatarColor || '#f43f5e',
        avatarUrl: avatarUrl || null,
        targetSchool: targetSchool || null,
        currentSchool: currentSchool || null,
        birthday: birthday ? new Date(birthday) : null,
        notes: notes || null,
        routeId: routeId || null,
      },
    });

    return NextResponse.json(child, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
