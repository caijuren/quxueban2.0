import { prisma } from '@/lib/prisma';
import { FamilyMemberRole } from '@/lib/generated/prisma';
import { randomBytes } from 'node:crypto';

export function generateInviteToken(): string {
  return randomBytes(32).toString('base64url');
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
  const member = await prisma.$transaction(async (tx) => {
    const now = new Date();
    const invite = await tx.familyInvite.findUnique({ where: { token } });
    if (!invite || invite.usedAt || now > invite.expiresAt) return null;

    const claimed = await tx.familyInvite.updateMany({
      where: { id: invite.id, usedAt: null, expiresAt: { gte: now } },
      data: { usedAt: now, usedByUserId: userId },
    });
    if (claimed.count !== 1) return null;

    const existingMember = await tx.familyMember.findUnique({
      where: { familyId_userId: { familyId: invite.familyId, userId } },
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
