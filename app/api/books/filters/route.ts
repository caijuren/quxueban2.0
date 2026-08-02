import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const GRADE_ORDER = [
  '一年级上', '一年级下',
  '二年级上', '二年级下',
  '三年级上', '三年级下',
  '四年级上', '四年级下',
  '五年级上', '五年级下',
  '跨年级通用',
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [publishers, contentTypes, gradeRows, subjectRows] = await Promise.all([
      prisma.publisher.findMany({
        where: { books: { some: { status: '在售' } } },
        orderBy: { name: 'asc' },
        select: { id: true, name: true, shortName: true },
      }),
      prisma.contentType.findMany({
        where: { books: { some: { status: '在售' } } },
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
      }),
      prisma.book.groupBy({ by: ['grade'], where: { status: '在售' } }),
      prisma.book.groupBy({ by: ['subject'], where: { status: '在售' } }),
    ]);

    const grades = gradeRows
      .map((g) => g.grade)
      .sort((a, b) => {
        const ia = GRADE_ORDER.indexOf(a);
        const ib = GRADE_ORDER.indexOf(b);
        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      });

    const subjects = subjectRows.map((s) => s.subject).sort((a, b) => a.localeCompare(b, 'zh-CN'));

    return NextResponse.json({
      grades,
      subjects,
      publishers,
      contentTypes,
      difficulties: [1, 2, 3, 4, 5],
      isNewTextbookOptions: ['是', '否', '部分适配'],
    });
  } catch (err: unknown) {
    console.error('[books/filters GET]', err);
    const message = err instanceof Error ? err.message : '加载筛选项失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
