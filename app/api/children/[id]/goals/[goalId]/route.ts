import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { learningGoalUpdateSchema, validateBody } from '@/lib/validation';
import { canManageChild, canViewChild } from '@/lib/family';

async function authenticate() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

async function verifyGoalAccess(childId: string, goalId: string, userId: string, manage = false) {
  const goal = await prisma.learningGoal.findFirst({
    where: { id: goalId, childId },
    include: { child: true },
  });
  if (!goal) return null;
  const allowed = manage
    ? await canManageChild(userId, goal.child)
    : await canViewChild(userId, goal.child);
  return allowed ? goal : null;
}

type Params = { params: { id: string; goalId: string } };

export async function PATCH(req: Request, { params }: Params) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existing = await verifyGoalAccess(params.id, params.goalId, userId, true);
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const validation = await validateBody(req, learningGoalUpdateSchema);
  if (!validation.success) {
    return validation.response;
  }

  try {
    const updated = await prisma.learningGoal.update({
      where: { id: params.goalId },
      data: validation.data,
    });
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existing = await verifyGoalAccess(params.id, params.goalId, userId, true);
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    await prisma.learningGoal.delete({ where: { id: params.goalId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
