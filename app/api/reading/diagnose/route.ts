import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canViewChild } from '@/lib/family';
import { getEnabledAiConfig } from '@/lib/aiConfig';
import {
  generateReadingDiagnosis,
  getFallbackReadingDiagnosis,
  type ReadingDiagnosisInput,
} from '@/lib/readingDiagnosis';

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
  if (!childId) {
    return NextResponse.json({ error: 'childId 必填' }, { status: 400 });
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
          status: true,
          literacyTags: true,
          readingLadderEnd: true,
        },
      }),
      prisma.readingRecord.findMany({
        where: { childId },
        orderBy: { readDate: 'desc' },
        take: 200,
        select: {
          readDate: true,
          durationMinutes: true,
          pages: true,
          effect: true,
          note: true,
          readingBook: { select: { title: true } },
        },
      }),
      prisma.readingEvidence.findMany({
        where: { childId, status: 'confirmed' },
        orderBy: { occurredAt: 'desc' },
        take: 50,
        select: {
          type: true,
          originalText: true,
          data: true,
          indicatorIds: true,
        },
      }),
    ]);

    const totalBooks = books.length;
    const readBooks = books.filter((b) => b.status === 'read').length;
    const readingBooks = books.filter((b) => b.status === 'reading').length;
    const totalMinutes = records.reduce((s, r) => s + (r.durationMinutes ?? 0), 0);
    const totalPages = records.reduce((s, r) => s + (r.pages ?? 0), 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cutoff = new Date(today);
    cutoff.setDate(today.getDate() - 29);
    const recentDays = new Set<string>();
    let recent30DaysMinutes = 0;
    records.forEach((r) => {
      const d = new Date(r.readDate);
      if (d >= cutoff) {
        recentDays.add(dateKey(d));
        recent30DaysMinutes += r.durationMinutes ?? 0;
      }
    });

    const ladderEvidence = books
      .filter((b) => b.status === 'read' && b.readingLadderEnd != null)
      .map((b) => b.readingLadderEnd as number);

    const bookLiteracyTags: string[] = [];
    books.forEach((b) => {
      if (Array.isArray(b.literacyTags)) {
        (b.literacyTags as string[]).forEach((t) => bookLiteracyTags.push(t));
      }
    });

    const input: ReadingDiagnosisInput = {
      childName: child.name,
      grade: child.grade,
      stats: {
        totalBooks,
        readBooks,
        readingBooks,
        totalMinutes,
        totalPages,
        recordCount: records.length,
        recent30DaysMinutes,
        recent30DaysDays: recentDays.size,
        avgDailyMinutes: Math.round(recent30DaysMinutes / 30),
      },
      records: records.slice(0, 50).map((r) => ({
        title: r.readingBook.title,
        date: dateKey(new Date(r.readDate)),
        minutes: r.durationMinutes ?? 0,
        pages: r.pages,
        effect: r.effect,
        note: r.note,
      })),
      evidences: evidences.map((e) => {
        const data = e.data as { summary?: string } | null;
        return {
          type: e.type,
          summary: data?.summary ?? e.originalText.slice(0, 60),
          indicatorIds: Array.isArray(e.indicatorIds)
            ? (e.indicatorIds as string[])
            : [],
        };
      }),
      bookLiteracyTags,
    };

    const config = await getEnabledAiConfig();
    if (!config) {
      return NextResponse.json({
        result: getFallbackReadingDiagnosis(input),
        source: 'local',
        reason: 'AI 未配置或未启用',
      });
    }

    try {
      const result = await generateReadingDiagnosis(input, config);
      return NextResponse.json({ result, source: 'ai' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json({
        result: getFallbackReadingDiagnosis(input),
        source: 'local',
        reason: message,
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
