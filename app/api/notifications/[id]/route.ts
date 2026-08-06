import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { classifyNotificationType } from '@/lib/notifications';

type Params = { params: { id: string } };

export async function PATCH(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const notification = await prisma.notification.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!notification) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const updated = await prisma.notification.update({
    where: { id: params.id },
    data: { readAt: new Date() },
  });

  return NextResponse.json({
    ...updated,
    type: classifyNotificationType(updated.title, updated.content),
  });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const notification = await prisma.notification.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!notification) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.notification.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
