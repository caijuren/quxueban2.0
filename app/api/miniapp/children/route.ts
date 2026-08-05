import { NextResponse } from 'next/server';
import { getMiniAppUser, unauthorizedResponse } from '@/lib/miniapp/auth';
import { prisma } from '@/lib/prisma';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const auth = await getMiniAppUser(req);
  if (!auth || auth.type !== 'parent') return unauthorizedResponse();

  const children = await prisma.child.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      grade: true,
      educationSystem: true,
      avatarColor: true,
      avatarUrl: true,
      targetSchool: true,
      currentSchool: true,
      birthday: true,
    },
  });

  return NextResponse.json({ children });
}
