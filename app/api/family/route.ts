import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { familyCreateSchema, validateBody } from '@/lib/validation';

function serializeFamily(family: {
  id: string;
  name: string;
  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
  members: {
    id: string;
    role: string;
    status: string;
    invitedAt: Date;
    joinedAt: Date | null;
    user: { id: string; username: string; name: string | null; avatarUrl: string | null };
  }[];
}) {
  return {
    id: family.id,
    name: family.name,
    createdByUserId: family.createdByUserId,
    createdAt: family.createdAt.toISOString(),
    updatedAt: family.updatedAt.toISOString(),
    members: family.members.map((m) => ({
      id: m.id,
      role: m.role,
      status: m.status,
      invitedAt: m.invitedAt.toISOString(),
      joinedAt: m.joinedAt ? m.joinedAt.toISOString() : null,
      user: m.user,
    })),
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const membership = await prisma.familyMember.findFirst({
    where: { userId: session.user.id, status: { not: 'DISABLED' } },
    include: {
      family: {
        include: {
          members: {
            include: {
              user: { select: { id: true, username: true, name: true, avatarUrl: true } },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      },
    },
  });

  if (!membership) {
    return NextResponse.json({ family: null, role: null });
  }

  return NextResponse.json({
    family: serializeFamily(membership.family),
    role: membership.role,
    currentUserId: session.user.id,
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(req, familyCreateSchema);
  if (!validation.success) {
    return validation.response;
  }

  const existing = await prisma.familyMember.findFirst({
    where: { userId: session.user.id, status: { not: 'DISABLED' } },
  });
  if (existing) {
    return NextResponse.json({ error: '你已属于一个家庭' }, { status: 400 });
  }

  try {
    const family = await prisma.family.create({
      data: {
        name: validation.data.name,
        createdByUserId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: 'OWNER',
            status: 'ACTIVE',
            joinedAt: new Date(),
          },
        },
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, username: true, name: true, avatarUrl: true } },
          },
        },
      },
    });

    return NextResponse.json(
      { family: serializeFamily(family), role: 'OWNER', currentUserId: session.user.id },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : '创建家庭失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const membership = await prisma.familyMember.findFirst({
    where: { userId: session.user.id, status: 'ACTIVE', role: 'OWNER' },
    include: { family: true },
  });
  if (!membership) {
    return NextResponse.json({ error: '只有家庭创建者可以解散家庭' }, { status: 403 });
  }

  try {
    await prisma.family.delete({ where: { id: membership.familyId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : '解散家庭失败';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
