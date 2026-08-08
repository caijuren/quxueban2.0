import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/lib/generated/prisma';

export const dynamic = 'force-dynamic';

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

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const grade = searchParams.get('grade');
    const subject = searchParams.get('subject');
    const publisher = searchParams.get('publisher');
    const contentType = searchParams.get('contentType');
    const isNewTextbook = searchParams.get('isNewTextbook');
    const difficulty = searchParams.get('difficulty');
    const keyword = searchParams.get('keyword')?.trim();

    const where: Prisma.BookWhereInput = {
      status: '在售',
    };

    if (grade) {
      where.grade = grade;
    }
    if (subject) {
      where.subject = subject;
    }
    if (publisher) {
      where.publisher = { name: publisher };
    }
    if (contentType) {
      where.contentType = { name: contentType };
    }
    if (isNewTextbook && ['是', '否', '部分适配'].includes(isNewTextbook)) {
      where.isNewTextbook = isNewTextbook;
    }
    if (difficulty) {
      const d = parseInt(difficulty, 10);
      if (!isNaN(d) && d >= 1 && d <= 5) {
        where.difficulty = d;
      }
    }
    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { isbn: { contains: keyword, mode: 'insensitive' } },
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

    // 在内存中按年级顺序二次排序（PostgreSQL 无法直接识别中文年级顺序）
    const sortedBooks = books.sort((a, b) => {
      const ga = gradeIndex(a.grade);
      const gb = gradeIndex(b.grade);
      if (ga !== gb) return ga - gb;
      if (a.subject !== b.subject) return a.subject.localeCompare(b.subject, 'zh-CN');
      return a.title.localeCompare(b.title, 'zh-CN');
    });

    return NextResponse.json({
      books: sortedBooks.map((book) => ({
        ...book,
        price: book.price ? Number(book.price) : null,
        difficulty: Number(book.difficulty),
      })),
      total: sortedBooks.length,
    });
  } catch (err: unknown) {
    console.error('[books GET]', err);
    const message = err instanceof Error ? err.message : '加载教辅列表失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
