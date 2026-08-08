import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { userSettingsUpdateSchema, validateBody } from '@/lib/validation';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { settings: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  if (!user.settings) {
    await prisma.userSetting.create({
      data: { userId: session.user.id },
    });
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { settings: true },
    });
  }

  if (!user || !user.settings) {
    return NextResponse.json({ error: 'Settings init failed' }, { status: 500 });
  }

  return NextResponse.json({
    id: user.id,
    username: user.username,
    name: user.name,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    email: user.email,
    wechatOpenId: user.wechatOpenId,
    role: user.role,
    settings: {
      theme: user.settings.theme,
      appearance: user.settings.appearance ?? (user.settings.theme === 'light' ? 'light' : 'dark'),
      fontSize: user.settings.fontSize,
      density: user.settings.density,
      reducedMotion: user.settings.reducedMotion,
      defaultLandingPage: user.settings.defaultLandingPage,
      defaultChildMode: user.settings.defaultChildMode,
      notificationPrefs: (user.settings.notificationPrefs as Record<string, boolean>) || {},
      reminderTime: user.settings.reminderTime,
      doNotDisturb: user.settings.doNotDisturb,
      doNotDisturbStart: user.settings.doNotDisturbStart,
      doNotDisturbEnd: user.settings.doNotDisturbEnd,
    },
  });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(req, userSettingsUpdateSchema);
  if (!validation.success) {
    return validation.response;
  }

  const body = validation.data;

  const userData: Record<string, unknown> = {};
  if (body.name !== undefined) userData.name = body.name;
  if (body.avatarUrl !== undefined) userData.avatarUrl = body.avatarUrl;
  if (body.phone !== undefined) userData.phone = body.phone;
  if (body.email !== undefined) userData.email = body.email;

  const settingData: Record<string, unknown> = {};
  if (body.theme !== undefined) settingData.theme = body.theme;
  if (body.appearance !== undefined) settingData.appearance = body.appearance;
  // Backwards compatibility: legacy clients that send theme='light' without appearance.
  if (body.appearance === undefined && body.theme === 'light') {
    settingData.appearance = 'light';
  }
  if (body.fontSize !== undefined) settingData.fontSize = body.fontSize;
  if (body.density !== undefined) settingData.density = body.density;
  if (body.reducedMotion !== undefined) settingData.reducedMotion = body.reducedMotion;
  if (body.defaultLandingPage !== undefined)
    settingData.defaultLandingPage = body.defaultLandingPage;
  if (body.defaultChildMode !== undefined) settingData.defaultChildMode = body.defaultChildMode;
  if (body.reminderTime !== undefined) settingData.reminderTime = body.reminderTime;
  if (body.doNotDisturb !== undefined) settingData.doNotDisturb = body.doNotDisturb;
  if (body.doNotDisturbStart !== undefined) settingData.doNotDisturbStart = body.doNotDisturbStart;
  if (body.doNotDisturbEnd !== undefined) settingData.doNotDisturbEnd = body.doNotDisturbEnd;
  if (body.notificationPrefs !== undefined) settingData.notificationPrefs = body.notificationPrefs;

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...userData,
      settings: {
        upsert: {
          create: {
            theme: (settingData.theme as string) ?? 'dark-tech',
            appearance: (settingData.appearance as string) ?? 'dark',
            fontSize: (settingData.fontSize as string) ?? 'normal',
            density: (settingData.density as string) ?? 'comfortable',
            reducedMotion: (settingData.reducedMotion as boolean) ?? false,
            defaultLandingPage: (settingData.defaultLandingPage as string) ?? 'alerts',
            defaultChildMode: (settingData.defaultChildMode as string) ?? 'last',
            notificationPrefs: (settingData.notificationPrefs as object) ?? {},
            reminderTime: (settingData.reminderTime as string) ?? '08:00',
            doNotDisturb: (settingData.doNotDisturb as boolean) ?? false,
            doNotDisturbStart: (settingData.doNotDisturbStart as string | null) ?? null,
            doNotDisturbEnd: (settingData.doNotDisturbEnd as string | null) ?? null,
          },
          update: settingData,
        },
      },
    },
    include: { settings: true },
  });

  return NextResponse.json({
    id: updated.id,
    username: updated.username,
    name: updated.name,
    avatarUrl: updated.avatarUrl,
    phone: updated.phone,
    email: updated.email,
    wechatOpenId: updated.wechatOpenId,
    role: updated.role,
    settings: updated.settings
      ? {
          theme: updated.settings.theme,
          appearance:
            updated.settings.appearance ?? (updated.settings.theme === 'light' ? 'light' : 'dark'),
          fontSize: updated.settings.fontSize,
          density: updated.settings.density,
          reducedMotion: updated.settings.reducedMotion,
          defaultLandingPage: updated.settings.defaultLandingPage,
          defaultChildMode: updated.settings.defaultChildMode,
          notificationPrefs: (updated.settings.notificationPrefs as Record<string, boolean>) || {},
          reminderTime: updated.settings.reminderTime,
          doNotDisturb: updated.settings.doNotDisturb,
          doNotDisturbStart: updated.settings.doNotDisturbStart,
          doNotDisturbEnd: updated.settings.doNotDisturbEnd,
        }
      : null,
  });
}
