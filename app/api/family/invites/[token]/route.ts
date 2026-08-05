import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getValidInvite, acceptFamilyInvite } from '@/lib/invite';

interface RouteContext {
  params: { token: string };
}

export async function GET(_req: Request, { params }: RouteContext) {
  const invite = await getValidInvite(params.token);
  if (!invite) {
    return NextResponse.json({ error: '邀请链接已失效或不存在' }, { status: 404 });
  }

  return NextResponse.json({
    family: {
      id: invite.family.id,
      name: invite.family.name,
    },
    role: invite.role,
    expiresAt: invite.expiresAt.toISOString(),
  });
}

export async function POST(req: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const invite = await getValidInvite(params.token);
  if (!invite) {
    return NextResponse.json({ error: '邀请链接已失效或不存在' }, { status: 404 });
  }

  const member = await acceptFamilyInvite(params.token, session.user.id);
  if (!member) {
    return NextResponse.json({ error: '接受邀请失败' }, { status: 500 });
  }

  return NextResponse.json({
    member: {
      id: member.id,
      role: member.role,
      status: member.status,
      invitedAt: member.invitedAt.toISOString(),
      joinedAt: member.joinedAt ? member.joinedAt.toISOString() : null,
      user: member.user,
    },
  });
}
