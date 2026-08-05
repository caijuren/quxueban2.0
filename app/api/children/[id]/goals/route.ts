import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { learningGoalCreateSchema, validateBody } from '@/lib/validation';
import { canManageChild, canViewChild } from '@/lib/family';

async function authenticate() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

async function verifyChildAccess(childId: string, userId: string, manage = false) {
  const child = await prisma.child.findUnique({
    where: { id: childId },
  });
  if (!child) return false;
  return manage ? canManageChild(userId, child) : canViewChild(userId, child);
}

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accessible = await verifyChildAccess(params.id, userId);
  if (!accessible) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const goals = await prisma.learningGoal.findMany({
      where: { childId: params.id },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(goals);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: Params) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const manageable = await verifyChildAccess(params.id, userId, true);
  if (!manageable) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const validation = await validateBody(req, learningGoalCreateSchema);
  if (!validation.success) {
    return validation.response;
  }

  try {
    const goal = await prisma.learningGoal.create({
      data: {
        childId: params.id,
        ...validation.data,
      },
    });
    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
