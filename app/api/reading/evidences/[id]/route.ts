import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canViewChild } from '@/lib/family';

async function authenticate() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

type Params = { params: { id: string } };

export async function PATCH(
  req: Request,
  { params }: Params
) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const status = String(body.status ?? '');
  if (!['confirmed', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'status(confirmed/rejected) 必填' }, { status: 400 });
  }

  const existing = await prisma.readingEvidence.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const child = await prisma.child.findUnique({ where: { id: existing.childId } });
  if (!child || !(await canViewChild(userId, child))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const evidence = await prisma.readingEvidence.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ evidence });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: Params
) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const existing = await prisma.readingEvidence.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const child = await prisma.child.findUnique({ where: { id: existing.childId } });
  if (!child || !(await canViewChild(userId, child))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    await prisma.readingEvidence.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}