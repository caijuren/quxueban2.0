import { prisma } from '@/lib/prisma';

export async function getActiveFamilyIdsForUser(userId: string): Promise<string[]> {
  const memberships = await prisma.familyMember.findMany({
    where: { userId, status: 'ACTIVE' },
    select: { familyId: true },
  });
  return memberships.map((m) => m.familyId);
}

export async function getFamilyIdForUser(userId: string): Promise<string | null> {
  const membership = await prisma.familyMember.findFirst({
    where: { userId, status: 'ACTIVE' },
    select: { familyId: true },
  });
  return membership?.familyId ?? null;
}

export async function getViewableChildIdsForUser(userId: string): Promise<string[]> {
  const familyIds = await getActiveFamilyIdsForUser(userId);

  const children = await prisma.child.findMany({
    where: {
      OR: [{ userId }, ...(familyIds.length > 0 ? [{ familyId: { in: familyIds } }] : [])],
    },
    select: { id: true },
  });
  return children.map((c) => c.id);
}

export async function getManageableChildIdsForUser(userId: string): Promise<string[]> {
  const memberships = await prisma.familyMember.findMany({
    where: {
      userId,
      status: 'ACTIVE',
      role: { in: ['OWNER', 'ADMIN'] },
    },
    select: { familyId: true },
  });
  const familyIds = memberships.map((m) => m.familyId);

  const children = await prisma.child.findMany({
    where: {
      OR: [{ userId }, ...(familyIds.length > 0 ? [{ familyId: { in: familyIds } }] : [])],
    },
    select: { id: true },
  });
  return children.map((c) => c.id);
}

export async function canManageChild(
  userId: string,
  child: { userId: string; familyId: string | null }
): Promise<boolean> {
  if (child.userId === userId) return true;
  if (!child.familyId) return false;

  const membership = await prisma.familyMember.findFirst({
    where: {
      familyId: child.familyId,
      userId,
      status: 'ACTIVE',
      role: { in: ['OWNER', 'ADMIN'] },
    },
  });

  return Boolean(membership);
}

export async function canViewChild(
  userId: string,
  child: { userId: string; familyId: string | null }
): Promise<boolean> {
  if (child.userId === userId) return true;
  if (!child.familyId) return false;

  const membership = await prisma.familyMember.findFirst({
    where: {
      familyId: child.familyId,
      userId,
      status: 'ACTIVE',
    },
  });

  return Boolean(membership);
}
