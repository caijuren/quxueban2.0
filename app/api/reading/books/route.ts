import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canManageChild, canViewChild } from '@/lib/family';
import { Prisma } from '@/lib/generated/prisma';

async function authenticate() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

async function verifyChildAccess(childId: string, userId: string, manage = false) {
  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child) return false;
  return manage ? canManageChild(userId, child) : canViewChild(userId, child);
}

export async function GET(req: Request) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const childId = searchParams.get('childId');
  const status = searchParams.get('status');
  const keyword = searchParams.get('keyword')?.trim();
  const textType = searchParams.get('textType')?.trim();
  const readingDifficulty = searchParams.get('readingDifficulty')?.trim();
  const literacyTag = searchParams.get('literacyTag')?.trim();
  const sort = searchParams.get('sort') ?? 'recent';

  if (!childId) {
    return NextResponse.json({ error: 'childId is required' }, { status: 400 });
  }

  const accessible = await verifyChildAccess(childId, userId);
  if (!accessible) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const where: Prisma.ReadingBookWhereInput = { childId };
    if (status && status !== 'all') where.status = status;
    if (textType && textType !== 'all') where.textType = textType;
    if (readingDifficulty && readingDifficulty !== 'all') {
      where.readingDifficulty = readingDifficulty;
    }
    if (literacyTag && literacyTag !== 'all') {
      where.literacyTags = { array_contains: [literacyTag] };
    }
    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { author: { contains: keyword, mode: 'insensitive' } },
        { isbn: { contains: keyword } },
      ];
    }

    const orderBy: Prisma.ReadingBookOrderByWithRelationInput[] =
      sort === 'title'
        ? [{ title: 'asc' }]
        : sort === 'rating'
          ? [{ rating: 'desc' }, { updatedAt: 'desc' }]
          : sort === 'minutes'
            ? [{ totalMinutes: 'desc' }, { updatedAt: 'desc' }]
            : sort === 'progress'
              ? [{ totalPagesRead: 'desc' }, { updatedAt: 'desc' }]
              : [{ updatedAt: 'desc' }];

    const books = await prisma.readingBook.findMany({
      where,
      orderBy,
      include: { _count: { select: { records: true } } },
    });

    return NextResponse.json({ books });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const childId = String(body.childId ?? '');
  const title = String(body.title ?? '').trim();
  if (!childId || !title) {
    return NextResponse.json({ error: 'childId 和 title 必填' }, { status: 400 });
  }

  const manageable = await verifyChildAccess(childId, userId, true);
  if (!manageable) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const book = await prisma.readingBook.create({
      data: {
        childId,
        bookId: body.bookId ? String(body.bookId) : null,
        title,
        author: body.author ? String(body.author) : null,
        isbn: body.isbn ? String(body.isbn) : null,
        coverImageUrl: body.coverImageUrl ? String(body.coverImageUrl) : null,
        publisher: body.publisher ? String(body.publisher) : null,
        description: body.description ? String(body.description) : null,
        totalPages: typeof body.totalPages === 'number' ? body.totalPages : null,
        wordCount: typeof body.wordCount === 'number' ? body.wordCount : null,
        textType: body.textType ? String(body.textType) : null,
        readingDifficulty: body.readingDifficulty ? String(body.readingDifficulty) : null,
        readingLadderStart:
          typeof body.readingLadderStart === 'number' ? body.readingLadderStart : null,
        readingLadderEnd: typeof body.readingLadderEnd === 'number' ? body.readingLadderEnd : null,
        literacyTags: Array.isArray(body.literacyTags) ? body.literacyTags : Prisma.JsonNull,
        status: body.status ? String(body.status) : 'unread',
        source: body.source ? String(body.source) : 'manual',
        rating: typeof body.rating === 'number' ? body.rating : null,
        notes: body.notes ? String(body.notes) : null,
      },
    });
    return NextResponse.json({ book }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
