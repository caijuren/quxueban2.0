import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canViewChild } from '@/lib/family';

async function canManageMilestone(userId: string, milestoneId: string) {
  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    select: {
      child: { select: { userId: true, familyId: true } },
    },
  });
  if (!milestone) return { ok: false, status: 404 };
  const hasAccess = await canViewChild(userId, milestone.child);
  if (!hasAccess) return { ok: false, status: 403 };
  return { ok: true, milestone };
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await canManageMilestone(session.user.id, params.id);
  if (!result.ok) {
    return NextResponse.json({ error: 'Forbidden' }, { status: result.status });
  }

  try {
    const body = await req.json();
    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.targetGrade !== undefined) updateData.targetGrade = body.targetGrade;
    if (body.targetPeriod !== undefined) updateData.targetPeriod = body.targetPeriod;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.score !== undefined) updateData.score = body.score;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.certificateUrls !== undefined) updateData.certificateUrls = body.certificateUrls;
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;

    if (body.status === 'completed') {
      updateData.completedAt = new Date();
    } else if (body.status === 'pending' || body.status === 'in_progress') {
      updateData.completedAt = null;
    }

    const milestone = await prisma.milestone.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(milestone);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await canManageMilestone(session.user.id, params.id);
  if (!result.ok) {
    return NextResponse.json({ error: 'Forbidden' }, { status: result.status });
  }

  try {
    await prisma.milestone.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
