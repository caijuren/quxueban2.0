import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma, type SubjectPlanConfig as PrismaSubjectPlanConfig } from '@/lib/generated/prisma';
import { subjectIdSchema, subjectPlanUpdateSchema, validateBody } from '@/lib/validation';
import { SubjectPlanConfig } from '@/lib/subjects/subjectPlan';

type Params = { params: { subject: string } };

function normalizeConfig(config: PrismaSubjectPlanConfig): SubjectPlanConfig {
  return {
    id: config.id,
    subject: config.subject as SubjectPlanConfig['subject'],
    tracks: config.tracks as unknown as SubjectPlanConfig['tracks'],
    timeAxis: config.timeAxis as unknown as SubjectPlanConfig['timeAxis'],
    nodes: config.nodes as unknown as SubjectPlanConfig['nodes'],
    keyAchievements: config.keyAchievements as unknown as SubjectPlanConfig['keyAchievements'],
    examTimeline: config.examTimeline as unknown as SubjectPlanConfig['examTimeline'],
    isSystem: config.isSystem,
    createdAt: config.createdAt.toISOString(),
    updatedAt: config.updatedAt.toISOString(),
  };
}

async function findUserConfig(subject: string, userId: string, childId: string | null) {
  if (childId) {
    return prisma.subjectPlanConfig.findUnique({
      where: { subject_userId_childId: { subject, userId, childId } },
    });
  }
  return prisma.subjectPlanConfig.findFirst({
    where: { subject, userId, childId: null },
  });
}

async function getConfig(subject: string, userId: string, childId: string | null) {
  // Prefer child-specific config, then user-level legacy config, then system config
  const userConfig = await findUserConfig(subject, userId, childId);

  if (userConfig) {
    return normalizeConfig(userConfig);
  }

  const systemConfig = await prisma.subjectPlanConfig.findFirst({
    where: { subject, isSystem: true },
  });

  if (!systemConfig) {
    return null;
  }

  return normalizeConfig(systemConfig);
}

export async function GET(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const subjectValidation = subjectIdSchema.safeParse(params.subject);
  if (!subjectValidation.success) {
    return NextResponse.json({ error: 'Invalid subject' }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const childId = searchParams.get('childId');

  const subject = subjectValidation.data;
  const config = await getConfig(subject, session.user.id, childId);

  if (!config) {
    return NextResponse.json({ error: 'Subject plan config not found' }, { status: 404 });
  }

  return NextResponse.json(config);
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const subjectValidation = subjectIdSchema.safeParse(params.subject);
  if (!subjectValidation.success) {
    return NextResponse.json({ error: 'Invalid subject' }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const childId = searchParams.get('childId');

  const subject = subjectValidation.data;

  const validation = await validateBody(req, subjectPlanUpdateSchema);
  if (!validation.success) {
    return validation.response;
  }

  const data = validation.data;

  const existing = await findUserConfig(subject, session.user.id, childId);

  let config;
  if (existing) {
    config = await prisma.subjectPlanConfig.update({
      where: { id: existing.id },
      data: {
        tracks: data.tracks as Prisma.InputJsonValue,
        timeAxis: data.timeAxis as Prisma.InputJsonValue,
        nodes: data.nodes as Prisma.InputJsonValue,
        keyAchievements: data.keyAchievements as Prisma.InputJsonValue,
        examTimeline: data.examTimeline as Prisma.InputJsonValue,
      },
    });
  } else {
    config = await prisma.subjectPlanConfig.create({
      data: {
        userId: session.user.id,
        childId,
        subject,
        tracks: data.tracks as Prisma.InputJsonValue,
        timeAxis: data.timeAxis as Prisma.InputJsonValue,
        nodes: data.nodes as Prisma.InputJsonValue,
        keyAchievements: data.keyAchievements as Prisma.InputJsonValue,
        examTimeline: data.examTimeline as Prisma.InputJsonValue,
        isSystem: false,
      },
    });
  }

  return NextResponse.json(normalizeConfig(config));
}
