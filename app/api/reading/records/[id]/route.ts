import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canManageChild, canViewChild } from '@/lib/family';

async function authenticate() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

type Params = { params: { id: string } };

async function findRecord(id: string) {
  return prisma.readingRecord.findUnique({
    where: { id },
    include: { child: true },
  });
}

export async function PATCH(req: Request, { params }: Params) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const record = await findRecord(params.id);
  if (!record || !canManageChild(userId, record.child)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    const updated = await prisma.readingRecord.update({
      where: { id: params.id },
      data: {
        readDate: body.readDate !== undefined ? new Date(String(body.readDate)) : undefined,
        durationMinutes:
          body.durationMinutes !== undefined ? Number(body.durationMinutes) : undefined,
        pages: body.pages !== undefined ? (body.pages ? Number(body.pages) : null) : undefined,
        note: body.note !== undefined ? (body.note ? String(body.note) : null) : undefined,
      },
    });

    // Refresh book aggregate
    const agg = await prisma.readingRecord.aggregate({
      where: { readingBookId: record.readingBookId },
      _count: true,
      _sum: { durationMinutes: true },
    });
    await prisma.readingBook.update({
      where: { id: record.readingBookId },
      data: {
        readCount: agg._count,
        totalMinutes: agg._sum.durationMinutes ?? 0,
      },
    });

    return NextResponse.json({ record: updated });
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

  const record = await findRecord(params.id);
  if (!record || !canManageChild(userId, record.child)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    await prisma.readingRecord.delete({ where: { id: params.id } });

    const agg = await prisma.readingRecord.aggregate({
      where: { readingBookId: record.readingBookId },
      _count: true,
      _sum: { durationMinutes: true },
    });
    await prisma.readingBook.update({
      where: { id: record.readingBookId },
      data: {
        readCount: agg._count,
        totalMinutes: agg._sum.durationMinutes ?? 0,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
