import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/lib/generated/prisma';

export const dynamic = 'force-dynamic';

const READING_SUBJECTS = ['语文', '英语'];

const GRADE_ORDER = [
  '一年级上',
  '一年级下',
  '二年级上',
  '二年级下',
  '三年级上',
  '三年级下',
  '四年级上',
  '四年级下',
  '五年级上',
  '五年级下',
  '跨年级通用',
];

function gradeIndex(grade: string) {
  const idx = GRADE_ORDER.indexOf(grade);
  return idx === -1 ? 99 : idx;
}

function estimateLexile(grade: string, difficulty: number): string {
  const baseMap: Record<string, number> = {
    一年级上: 150,
    一年级下: 200,
    二年级上: 250,
    二年级下: 300,
    三年级上: 350,
    三年级下: 400,
    四年级上: 450,
    四年级下: 500,
    五年级上: 550,
    五年级下: 600,
  };
  const base = baseMap[grade] ?? 400;
  const delta = (difficulty - 3) * 50;
  const min = Math.max(0, base + delta - 50);
  const max = base + delta + 50;
  return `${min}L-${max}L`;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const grade = searchParams.get('grade');
    const subject = searchParams.get('subject');
    const keyword = searchParams.get('keyword')?.trim();

    const where: Prisma.BookWhereInput = {
      status: '在售',
      subject: subject && READING_SUBJECTS.includes(subject) ? subject : { in: READING_SUBJECTS },
    };

    if (grade) {
      where.grade = grade;
    }
    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { author: { contains: keyword, mode: 'insensitive' } },
        { sellingPoints: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    const books = await prisma.book.findMany({
      where,
      include: {
        publisher: true,
        contentType: true,
      },
      orderBy: [{ subject: 'asc' }, { title: 'asc' }],
    });

    const sortedBooks = books.sort((a, b) => {
      const ga = gradeIndex(a.grade);
      const gb = gradeIndex(b.grade);
      if (ga !== gb) return ga - gb;
      return a.title.localeCompare(b.title, 'zh-CN');
    });

    return NextResponse.json({
      books: sortedBooks.map((book) => ({
        ...book,
        price: book.price ? Number(book.price) : null,
        difficulty: Number(book.difficulty),
        lexile: estimateLexile(book.grade, Number(book.difficulty)),
      })),
      total: sortedBooks.length,
      grades: GRADE_ORDER,
      subjects: READING_SUBJECTS,
    });
  } catch (err: unknown) {
    console.error('[toolbox reading-list GET]', err);
    const message = err instanceof Error ? err.message : '加载书单失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
