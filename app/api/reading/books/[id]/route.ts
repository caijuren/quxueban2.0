import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/lib/generated/prisma';
import { canManageChild, canViewChild } from '@/lib/family';

async function authenticate() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

type Params = { params: { id: string } };

async function findBook(id: string) {
  return prisma.readingBook.findUnique({ where: { id }, include: { child: true } });
}

export async function PATCH(req: Request, { params }: Params) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const book = await findBook(params.id);
  if (!book || !canManageChild(userId, book.child)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    const updated = await prisma.readingBook.update({
      where: { id: params.id },
      data: {
        title: body.title !== undefined ? String(body.title) : undefined,
        author: body.author !== undefined ? (body.author ? String(body.author) : null) : undefined,
        isbn: body.isbn !== undefined ? (body.isbn ? String(body.isbn) : null) : undefined,
        coverImageUrl:
          body.coverImageUrl !== undefined
            ? (body.coverImageUrl ? String(body.coverImageUrl) : null)
            : undefined,
        publisher:
          body.publisher !== undefined ? (body.publisher ? String(body.publisher) : null) : undefined,
        description:
          body.description !== undefined ? (body.description ? String(body.description) : null) : undefined,
        totalPages:
          body.totalPages !== undefined ? (body.totalPages ? Number(body.totalPages) : null) : undefined,
        wordCount:
          body.wordCount !== undefined ? (body.wordCount ? Number(body.wordCount) : null) : undefined,
        textType:
          body.textType !== undefined ? (body.textType ? String(body.textType) : null) : undefined,
        readingDifficulty:
          body.readingDifficulty !== undefined
            ? (body.readingDifficulty ? String(body.readingDifficulty) : null)
            : undefined,
        readingLadderStart:
          body.readingLadderStart !== undefined
            ? (body.readingLadderStart ? Number(body.readingLadderStart) : null)
            : undefined,
        readingLadderEnd:
          body.readingLadderEnd !== undefined
            ? (body.readingLadderEnd ? Number(body.readingLadderEnd) : null)
            : undefined,
        literacyTags:
          body.literacyTags !== undefined
            ? (Array.isArray(body.literacyTags) ? body.literacyTags : Prisma.JsonNull)
            : undefined,
        status: body.status !== undefined ? String(body.status) : undefined,
        rating: body.rating !== undefined ? (body.rating ? Number(body.rating) : null) : undefined,
        notes: body.notes !== undefined ? (body.notes ? String(body.notes) : null) : undefined,
      },
    });
    return NextResponse.json({ book: updated });
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

  const book = await findBook(params.id);
  if (!book || !canManageChild(userId, book.child)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    await prisma.readingBook.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
