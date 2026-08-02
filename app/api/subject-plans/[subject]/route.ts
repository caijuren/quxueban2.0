import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { subjectIdSchema, subjectPlanUpdateSchema, validateBody } from '@/lib/validation';
import { SubjectPlanConfig } from '@/lib/subjects/subjectPlan';

type Params = { params: { subject: string } };

function normalizeConfig(config: {
  id: string;
  subject: string;
  tracks: any;
  timeAxis: any;
  nodes: any;
  keyAchievements: any;
  examTimeline: any;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}): SubjectPlanConfig {
  return {
    id: config.id,
    subject: config.subject as SubjectPlanConfig['subject'],
    tracks: config.tracks as SubjectPlanConfig['tracks'],
    timeAxis: config.timeAxis as SubjectPlanConfig['timeAxis'],
    nodes: config.nodes as SubjectPlanConfig['nodes'],
    keyAchievements: config.keyAchievements as SubjectPlanConfig['keyAchievements'],
    examTimeline: config.examTimeline as SubjectPlanConfig['examTimeline'],
    isSystem: config.isSystem,
    createdAt: config.createdAt.toISOString(),
    updatedAt: config.updatedAt.toISOString(),
  };
}

async function getConfig(subject: string, userId: string) {
  // Prefer user config, fall back to system config
  const userConfig = await prisma.subjectPlanConfig.findUnique({
    where: { subject_userId: { subject, userId } },
  });

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

export async function GET(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const subjectValidation = subjectIdSchema.safeParse(params.subject);
  if (!subjectValidation.success) {
    return NextResponse.json({ error: 'Invalid subject' }, { status: 400 });
  }

  const subject = subjectValidation.data;
  const config = await getConfig(subject, session.user.id);

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

  const subject = subjectValidation.data;

  const validation = await validateBody(req, subjectPlanUpdateSchema);
  if (!validation.success) {
    return validation.response;
  }

  const data = validation.data;

  const existing = await prisma.subjectPlanConfig.findUnique({
    where: { subject_userId: { subject, userId: session.user.id } },
  });

  let config;
  if (existing) {
    config = await prisma.subjectPlanConfig.update({
      where: { id: existing.id },
      data: {
        tracks: data.tracks as any,
        timeAxis: data.timeAxis as any,
        nodes: data.nodes as any,
        keyAchievements: data.keyAchievements as any,
        examTimeline: data.examTimeline as any,
      },
    });
  } else {
    config = await prisma.subjectPlanConfig.create({
      data: {
        userId: session.user.id,
        subject,
        tracks: data.tracks as any,
        timeAxis: data.timeAxis as any,
        nodes: data.nodes as any,
        keyAchievements: data.keyAchievements as any,
        examTimeline: data.examTimeline as any,
        isSystem: false,
      },
    });
  }

  return NextResponse.json(normalizeConfig(config));
}
