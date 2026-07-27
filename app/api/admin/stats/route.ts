import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const [userCount, childCount, planCount, weeklyPlanCount] = await Promise.all([
    prisma.user.count(),
    prisma.child.count(),
    prisma.plan.count(),
    prisma.weeklyPlan.count(),
  ]);

  return NextResponse.json({
    userCount,
    childCount,
    planCount,
    weeklyPlanCount,
  });
}
