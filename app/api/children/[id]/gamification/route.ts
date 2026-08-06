import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canViewChild } from '@/lib/family';
import {
  getGamificationContext,
  calculateStreak,
  BADGE_DEFINITIONS,
} from '@/lib/gamification';

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const childId = params.id;
  const userId = session.user.id;

  const child = await prisma.child.findUnique({
    where: { id: childId },
    select: { userId: true, familyId: true },
  });
  if (!child) {
    return NextResponse.json({ error: 'Child not found' }, { status: 404 });
  }

  const hasAccess = await canViewChild(userId, child);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const [badges, latestPointLog, context] = await Promise.all([
    prisma.badge.findMany({
      where: { userId, childId },
      orderBy: { unlockedAt: 'desc' },
    }),
    prisma.pointLog.findFirst({
      where: { userId, childId },
      orderBy: { createdAt: 'desc' },
    }),
    getGamificationContext(childId, userId),
  ]);

  const streaks = calculateStreak(childId, context.completionRecords ?? []);
  const badgeDetails = badges.map((b) => {
    const definition = BADGE_DEFINITIONS.find((d) => d.key === b.key);
    return {
      ...b,
      points: definition?.points ?? 0,
    };
  });

  return NextResponse.json({
    badges: badgeDetails,
    points: latestPointLog?.total ?? 0,
    streaks,
  });
}
