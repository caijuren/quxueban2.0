import { prisma } from '@/lib/prisma';
import { FamilyMemberRole } from '@/lib/generated/prisma';

export function generateInviteToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export function getInviteExpiresAt(): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 天有效
  return expiresAt;
}

export interface SendInviteResult {
  success: boolean;
  message: string;
}

// 占位实现：邮件/短信发送能力尚未接入真实服务商
// 实际部署时替换为 sendgrid / resend / 阿里云短信等 SDK
export async function sendInviteEmail(
  email: string,
  inviteUrl: string,
  familyName: string
): Promise<SendInviteResult> {
  console.log(`[FamilyInvite] 发送邮件邀请至 ${email}，链接：${inviteUrl}，家庭：${familyName}`);
  return { success: true, message: '邮件邀请已发送（演示模式：未接入真实邮件服务）' };
}

export async function sendInviteSms(
  phone: string,
  inviteUrl: string,
  familyName: string
): Promise<SendInviteResult> {
  console.log(`[FamilyInvite] 发送短信邀请至 ${phone}，链接：${inviteUrl}，家庭：${familyName}`);
  return { success: true, message: '短信邀请已发送（演示模式：未接入真实短信服务）' };
}

export async function createFamilyInvite(
  familyId: string,
  role: FamilyMemberRole,
  invitedBy: string,
  contact?: { email?: string; phone?: string }
) {
  const token = generateInviteToken();
  const expiresAt = getInviteExpiresAt();

  const invite = await prisma.familyInvite.create({
    data: {
      familyId,
      token,
      role,
      invitedBy,
      email: contact?.email ?? null,
      phone: contact?.phone ?? null,
      expiresAt,
    },
  });

  return invite;
}

export async function getValidInvite(token: string) {
  const invite = await prisma.familyInvite.findUnique({
    where: { token },
    include: { family: true },
  });
  if (!invite) return null;
  if (invite.usedAt) return null;
  if (new Date() > invite.expiresAt) return null;
  return invite;
}

export async function acceptFamilyInvite(token: string, userId: string) {
  const invite = await getValidInvite(token);
  if (!invite) return null;

  const existingMember = await prisma.familyMember.findUnique({
    where: { familyId_userId: { familyId: invite.familyId, userId } },
  });

  const member = await prisma.$transaction(async (tx) => {
    await tx.familyInvite.update({
      where: { id: invite.id },
      data: { usedAt: new Date(), usedByUserId: userId },
    });

    if (existingMember) {
      return tx.familyMember.update({
        where: { id: existingMember.id },
        data: {
          role: invite.role,
          status: 'ACTIVE',
          joinedAt: new Date(),
        },
        include: {
          user: { select: { id: true, username: true, name: true, avatarUrl: true } },
        },
      });
    }

    return tx.familyMember.create({
      data: {
        familyId: invite.familyId,
        userId,
        role: invite.role,
        status: 'ACTIVE',
        joinedAt: new Date(),
      },
      include: {
        user: { select: { id: true, username: true, name: true, avatarUrl: true } },
      },
    });
  });

  return member;
}
