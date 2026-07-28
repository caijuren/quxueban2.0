import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [user, children, plans, weeklyPlans, notifications] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        phone: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.child.findMany({ where: { userId: session.user.id } }),
    prisma.plan.findMany({ where: { userId: session.user.id } }),
    prisma.weeklyPlan.findMany({ where: { userId: session.user.id } }),
    prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const data = {
    exportedAt: new Date().toISOString(),
    user,
    children,
    plans,
    weeklyPlans,
    notifications,
  };

  return NextResponse.json(data);
}
