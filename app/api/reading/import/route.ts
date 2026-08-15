import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canManageChild } from '@/lib/family';

async function authenticate() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

interface ImportRow {
  title?: string;
  author?: string;
  isbn?: string;
  readDate?: string;
  durationMinutes?: number;
  pages?: number;
  note?: string;
}

export async function POST(req: Request) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { childId?: string; rows?: ImportRow[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const childId = body.childId;
  const rows = body.rows;
  if (!childId || !Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: 'childId 和 rows 必填' }, { status: 400 });
  }

  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child || !(await canManageChild(userId, child))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const result = { imported: 0, matched: 0, skipped: 0, errors: 0, messages: [] as string[] };

  try {
    // Preload existing books for the child to dedupe by isbn/title
    const existing = await prisma.readingBook.findMany({
      where: { childId },
      select: { id: true, title: true, isbn: true },
    });
    const byIsbn = new Map<string, string>();
    const byTitle = new Map<string, string>();
    existing.forEach((b) => {
      if (b.isbn) byIsbn.set(b.isbn.replace(/-/g, ''), b.id);
      byTitle.set(b.title.trim(), b.id);
    });

    for (const row of rows) {
      const title = (row.title ?? '').trim();
      if (!title) {
        result.skipped++;
        continue;
      }
      const isbn = (row.isbn ?? '').replace(/-/g, '').trim();

      try {
        let bookId = isbn ? byIsbn.get(isbn) : undefined;
        if (!bookId) bookId = byTitle.get(title);

        if (!bookId) {
          // Try to link to built-in book library by isbn
          let builtinBookId: string | null = null;
          if (isbn) {
            const builtin = await prisma.book.findFirst({
              where: { isbn: { contains: isbn } },
              select: { bookId: true, coverImageUrl: true },
            });
            if (builtin) {
              builtinBookId = builtin.bookId;
            }
          }

          const created = await prisma.readingBook.create({
            data: {
              childId,
              bookId: builtinBookId,
              title,
              author: row.author ? row.author.trim() : null,
              isbn: isbn || null,
              coverImageUrl: null,
              source: 'import',
              status: row.readDate ? 'read' : 'unread',
            },
          });
          bookId = created.id;
          byIsbn.set(isbn, created.id);
          byTitle.set(title, created.id);
          result.matched++;
        }

        if (row.readDate) {
          const date = new Date(row.readDate);
          if (!Number.isNaN(date.getTime())) {
            await prisma.readingRecord.create({
              data: {
                childId,
                readingBookId: bookId,
                readDate: date,
                durationMinutes: row.durationMinutes ?? 0,
                pages: row.pages ?? null,
                note: row.note ? row.note.trim() : null,
              },
            });
          }
        }

        result.imported++;
      } catch (err) {
        result.errors++;
        result.messages.push(`${title}: ${err instanceof Error ? err.message : '导入失败'}`);
      }
    }

    // Refresh aggregates for affected books
    const affectedIds = [...new Set(
      (await prisma.readingRecord.findMany({
        where: { childId },
        select: { readingBookId: true },
      })).map((r) => r.readingBookId)
    )];
    for (const id of affectedIds) {
      const agg = await prisma.readingRecord.aggregate({
        where: { readingBookId: id },
        _count: true,
        _sum: { durationMinutes: true },
      });
      await prisma.readingBook.update({
        where: { id },
        data: {
          readCount: agg._count,
          totalMinutes: agg._sum.durationMinutes ?? 0,
          status: agg._count > 0 ? 'read' : 'unread',
        },
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
