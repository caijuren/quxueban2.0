import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canViewChild } from '@/lib/family';
import {
  READING_ABILITIES,
  getPhaseByLadder,
  getReadingLadderByGrade,
  type ReadingAbilityId,
} from '@/lib/subjects/readingLiteracy';

async function authenticate() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const WEEKDAY_LABELS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export async function GET(req: Request) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const childId = searchParams.get('childId');
  if (!childId) {
    return NextResponse.json({ error: 'childId is required' }, { status: 400 });
  }

  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child || !(await canViewChild(userId, child))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const [books, records, evidences] = await Promise.all([
      prisma.readingBook.findMany({
        where: { childId },
        select: {
          id: true,
          title: true,
          author: true,
          coverImageUrl: true,
          status: true,
          totalPages: true,
          totalPagesRead: true,
          totalMinutes: true,
          lastReadAt: true,
          readingLadderStart: true,
          readingLadderEnd: true,
          literacyTags: true,
        },
      }),
      prisma.readingRecord.findMany({
        where: { childId },
        orderBy: { readDate: 'desc' },
        take: 200,
        select: {
          id: true,
          readDate: true,
          durationMinutes: true,
          pages: true,
          note: true,
          readingBook: { select: { id: true, title: true } },
        },
      }),
      prisma.readingEvidence.findMany({
        where: { childId, status: 'confirmed' },
        select: { indicatorIds: true },
      }),
    ]);

    // 4 指标
    const readingCount = books.filter((b) => b.status === 'reading').length;
    const readCount = books.filter((b) => b.status === 'read').length;
    const totalPages = books.reduce((s, b) => s + (b.totalPagesRead ?? 0), 0);
    const totalMinutes = books.reduce((s, b) => s + (b.totalMinutes ?? 0), 0);

    // 近 7 天阅读
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const byDay = new Map<string, { minutes: number; count: number }>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      byDay.set(dateKey(d), { minutes: 0, count: 0 });
    }
    records.forEach((r) => {
      const key = dateKey(new Date(r.readDate));
      const cell = byDay.get(key);
      if (cell) {
        cell.minutes += r.durationMinutes ?? 0;
        cell.count += 1;
      }
    });
    const weekActivity = Array.from(byDay.entries()).map(([key, cell]) => {
      const d = new Date(`${key}T00:00:00`);
      return {
        date: key,
        label: WEEKDAY_LABELS[d.getDay()],
        minutes: cell.minutes,
        count: cell.count,
      };
    });

    // 最近在读（优先在读中，其次最近更新）
    const recentBooks = books
      .filter((b) => b.status !== 'unread')
      .sort((a, b) => {
        const aTime = a.lastReadAt?.getTime() ?? 0;
        const bTime = b.lastReadAt?.getTime() ?? 0;
        return bTime - aTime;
      })
      .slice(0, 4)
      .map((b) => ({
        id: b.id,
        title: b.title,
        author: b.author,
        coverImageUrl: b.coverImageUrl,
        status: b.status,
        totalPages: b.totalPages,
        totalPagesRead: b.totalPagesRead,
        totalMinutes: b.totalMinutes,
        lastReadAt: b.lastReadAt,
      }));

    const recentRecords = records.slice(0, 5).map((r) => ({
      id: r.id,
      readDate: r.readDate,
      durationMinutes: r.durationMinutes,
      pages: r.pages,
      note: r.note,
      book: r.readingBook,
    }));

    // 阅读梯级：证据优先（已读书籍的最高梯级），否则按年级基线
    const ladderEvidence = books
      .filter((b) => b.status === 'read' && b.readingLadderEnd != null)
      .map((b) => b.readingLadderEnd as number);
    const anyLadder = books.some((b) => b.readingLadderStart != null || b.readingLadderEnd != null);
    const gradeLadder = getReadingLadderByGrade(child.grade);
    const current = ladderEvidence.length > 0 ? Math.max(...ladderEvidence) : gradeLadder;

    let comparison: 'ahead' | 'match' | 'behind' | 'insufficient';
    if (!anyLadder && ladderEvidence.length === 0) {
      comparison = 'insufficient';
    } else if (current > gradeLadder) {
      comparison = 'ahead';
    } else if (current < gradeLadder) {
      comparison = 'behind';
    } else {
      comparison = 'match';
    }

    // 6 维度证据计数（书籍素养标签 + 已确认证据）
    const dimCount = new Map<ReadingAbilityId, number>();
    READING_ABILITIES.forEach((a) => dimCount.set(a.id, 0));
    books.forEach((b) => {
      const tags = Array.isArray(b.literacyTags) ? (b.literacyTags as string[]) : [];
      tags.forEach((t) => {
        if (dimCount.has(t as ReadingAbilityId)) {
          dimCount.set(t as ReadingAbilityId, (dimCount.get(t as ReadingAbilityId) ?? 0) + 1);
        }
      });
    });
    evidences.forEach((e) => {
      const ids = Array.isArray(e.indicatorIds) ? (e.indicatorIds as string[]) : [];
      ids.forEach((t) => {
        if (dimCount.has(t as ReadingAbilityId)) {
          dimCount.set(t as ReadingAbilityId, (dimCount.get(t as ReadingAbilityId) ?? 0) + 1);
        }
      });
    });
    const totalEvidence = Array.from(dimCount.values()).reduce((s, v) => s + v, 0);
    const dimensions = READING_ABILITIES.map((a) => ({
      id: a.id,
      name: a.name,
      score: totalEvidence === 0 ? 0 : Math.min(100, (dimCount.get(a.id) ?? 0) * 20),
    }));

    return NextResponse.json({
      stats: { readingCount, readCount, totalPages, totalMinutes },
      weekActivity,
      recentBooks,
      recentRecords,
      ladder: {
        current,
        phase: getPhaseByLadder(current),
        gradeLadder,
        comparison,
        dimensions,
        hasEvidence: totalEvidence > 0,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
