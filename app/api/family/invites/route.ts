import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { familyInviteCreateSchema, validateBody } from '@/lib/validation';
import {
  createFamilyInvite,
  sendInviteEmail,
  sendInviteSms,
} from '@/lib/invite';

const MANAGER_ROLES = new Set(['OWNER', 'ADMIN']);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const validation = await validateBody(req, familyInviteCreateSchema);
    if (!validation.success) {
      return validation.response;
    }

    let { email, phone, role } = validation.data;

    // 统一手机号格式，方便查询和存储
    if (phone) {
      phone = phone.replace(/[\s-]/g, '').replace(/^\+?86/, '');
    }

    const myMembership = await prisma.familyMember.findFirst({
      where: { userId: session.user.id, status: 'ACTIVE' },
      include: { family: true },
    });
    if (!myMembership || !MANAGER_ROLES.has(myMembership.role)) {
      return NextResponse.json({ error: '无权限邀请成员' }, { status: 403 });
    }

    // 如果目标联系人已注册且属于同一家庭，直接处理为成员邀请
    const existingUser = email
      ? await prisma.user.findFirst({ where: { email } })
      : phone
        ? await prisma.user.findFirst({ where: { phone } })
        : null;

    if (existingUser) {
      const existingMember = await prisma.familyMember.findUnique({
        where: { familyId_userId: { familyId: myMembership.familyId, userId: existingUser.id } },
      });
      if (existingMember && existingMember.status !== 'DISABLED') {
        return NextResponse.json(
          { error: '该用户已是家庭成员或已收到邀请' },
          { status: 400 }
        );
      }

      const member = await prisma.familyMember.upsert({
        where: {
          familyId_userId: { familyId: myMembership.familyId, userId: existingUser.id },
        },
        update: {
          role,
          status: 'INVITED',
          invitedBy: session.user.id,
          invitedAt: new Date(),
          joinedAt: null,
        },
        create: {
          familyId: myMembership.familyId,
          userId: existingUser.id,
          role,
          status: 'INVITED',
          invitedBy: session.user.id,
        },
        include: {
          user: { select: { id: true, username: true, name: true, avatarUrl: true } },
        },
      });

      return NextResponse.json(
        {
          member: {
            id: member.id,
            role: member.role,
            status: member.status,
            invitedAt: member.invitedAt.toISOString(),
            joinedAt: null,
            user: member.user,
          },
          sentTo: { email, phone },
        },
        { status: 201 }
      );
    }

    // 未注册用户：创建 FamilyInvite token
    const invite = await createFamilyInvite(
      myMembership.familyId,
      role,
      session.user.id,
      { email: email ?? undefined, phone: phone ?? undefined }
    );

    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const inviteUrl = `${origin}/invite?token=${invite.token}`;

    let sendResult;
    if (email) {
      sendResult = await sendInviteEmail(email, inviteUrl, myMembership.family.name);
    } else if (phone) {
      sendResult = await sendInviteSms(phone, inviteUrl, myMembership.family.name);
    } else {
      return NextResponse.json({ error: '请提供邮箱或手机号' }, { status: 400 });
    }

    return NextResponse.json(
      {
        invite: {
          id: invite.id,
          token: invite.token,
          role: invite.role,
          email: invite.email,
          phone: invite.phone,
          expiresAt: invite.expiresAt.toISOString(),
        },
        sentTo: { email, phone },
        message: sendResult.message,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[family/invites] POST error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : '创建邀请失败，请稍后重试',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const myMembership = await prisma.familyMember.findFirst({
      where: { userId: session.user.id, status: 'ACTIVE' },
      select: { familyId: true, role: true },
    });
    if (!myMembership || !MANAGER_ROLES.has(myMembership.role)) {
      return NextResponse.json({ error: '无权限查看邀请' }, { status: 403 });
    }

    const invites = await prisma.familyInvite.findMany({
      where: {
        familyId: myMembership.familyId,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(
      invites.map((invite) => ({
        id: invite.id,
        token: invite.token,
        role: invite.role,
        email: invite.email,
        phone: invite.phone,
        invitedAt: invite.invitedAt.toISOString(),
        expiresAt: invite.expiresAt.toISOString(),
      }))
    );
  } catch (error) {
    console.error('[family/invites] GET error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取邀请失败' },
      { status: 500 }
    );
  }
}
