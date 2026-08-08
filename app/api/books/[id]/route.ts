import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        publisher: true,
        contentType: true,
      },
    });

    if (!book) {
      return NextResponse.json({ error: '教辅未找到' }, { status: 404 });
    }

    return NextResponse.json({
      ...book,
      price: book.price ? Number(book.price) : null,
      difficulty: Number(book.difficulty),
    });
  } catch (err: unknown) {
    console.error('[books/[id] GET]', err);
    const message = err instanceof Error ? err.message : '加载教辅详情失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
