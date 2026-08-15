import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canViewChild } from '@/lib/family';

async function authenticate() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export async function GET(req: Request) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const childId = searchParams.get('childId');
  const bookId = searchParams.get('bookId');
  const limit = Math.min(500, parseInt(searchParams.get('limit') ?? '200', 10));

  if (!childId) {
    return NextResponse.json({ error: 'childId is required' }, { status: 400 });
  }

  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child || !(await canViewChild(userId, child))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const records = await prisma.readingRecord.findMany({
      where: { childId, ...(bookId ? { readingBookId: bookId } : {}) },
      orderBy: { readDate: 'desc' },
      take: limit,
      include: { readingBook: { select: { id: true, title: true, author: true } } },
    });
    return NextResponse.json({ records });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
