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

export async function GET(req: Request, { params }: Params) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const book = await prisma.readingBook.findUnique({
    where: { id: params.id },
    include: { child: true },
  });
  if (!book || !canViewChild(userId, book.child)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(200, parseInt(searchParams.get('limit') ?? '50', 10));

  try {
    const records = await prisma.readingRecord.findMany({
      where: { readingBookId: params.id },
      orderBy: { readDate: 'desc' },
      take: limit,
    });
    return NextResponse.json({ records });
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

  const book = await prisma.readingBook.findUnique({
    where: { id: params.id },
    include: { child: true },
  });
  if (!book || !canManageChild(userId, book.child)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const readDate = body.readDate ? new Date(String(body.readDate)) : new Date();
  const durationMinutes = typeof body.durationMinutes === 'number' ? body.durationMinutes : 0;

  try {
    const record = await prisma.readingRecord.create({
      data: {
        childId: book.childId,
        readingBookId: params.id,
        readDate,
        durationMinutes,
        pages: typeof body.pages === 'number' ? body.pages : null,
        note: body.note ? String(body.note) : null,
      },
    });

    // Update book aggregate
    const agg = await prisma.readingRecord.aggregate({
      where: { readingBookId: params.id },
      _count: true,
      _sum: { durationMinutes: true },
    });
    await prisma.readingBook.update({
      where: { id: params.id },
      data: {
        readCount: agg._count,
        totalMinutes: agg._sum.durationMinutes ?? 0,
        lastReadAt: new Date(),
        status: 'read',
      },
    });

    return NextResponse.json({ record }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}