import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const VALID_THEMES = ['dark-tech', 'rose-pink'];
const VALID_FONT_SIZES = ['normal', 'large', 'xlarge'];
const VALID_DENSITIES = ['comfortable', 'compact'];
const VALID_LANDING_PAGES = ['dashboard', 'alerts', 'weekly'];
const VALID_CHILD_MODES = ['last', 'ask'];

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
    settings: user.settings
      ? {
          theme: user.settings.theme,
          fontSize: user.settings.fontSize,
          density: user.settings.density,
          reducedMotion: user.settings.reducedMotion,
          defaultLandingPage: user.settings.defaultLandingPage,
          defaultChildMode: user.settings.defaultChildMode,
          notificationPrefs:
            (user.settings.notificationPrefs as Record<string, boolean>) || {},
          reminderTime: user.settings.reminderTime,
          doNotDisturb: user.settings.doNotDisturb,
          doNotDisturbStart: user.settings.doNotDisturbStart,
          doNotDisturbEnd: user.settings.doNotDisturbEnd,
        }
      : null,
  });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const userData: Record<string, unknown> = {};
  if (body.name !== undefined) userData.name = body.name?.trim() || null;
  if (body.avatarUrl !== undefined) userData.avatarUrl = body.avatarUrl || null;
  if (body.phone !== undefined) userData.phone = body.phone?.trim() || null;
  if (body.email !== undefined) userData.email = body.email?.trim() || null;

  const settingData: Record<string, unknown> = {};
  if (body.theme !== undefined) {
    settingData.theme = VALID_THEMES.includes(body.theme)
      ? body.theme
      : 'dark-tech';
  }
  if (body.fontSize !== undefined) {
    settingData.fontSize = VALID_FONT_SIZES.includes(body.fontSize)
      ? body.fontSize
      : 'normal';
  }
  if (body.density !== undefined) {
    settingData.density = VALID_DENSITIES.includes(body.density)
      ? body.density
      : 'comfortable';
  }
  if (body.reducedMotion !== undefined) {
    settingData.reducedMotion = Boolean(body.reducedMotion);
  }
  if (body.defaultLandingPage !== undefined) {
    settingData.defaultLandingPage = VALID_LANDING_PAGES.includes(
      body.defaultLandingPage
    )
      ? body.defaultLandingPage
      : 'dashboard';
  }
  if (body.defaultChildMode !== undefined) {
    settingData.defaultChildMode = VALID_CHILD_MODES.includes(
      body.defaultChildMode
    )
      ? body.defaultChildMode
      : 'last';
  }
  if (body.reminderTime !== undefined) {
    settingData.reminderTime = body.reminderTime || '08:00';
  }
  if (body.doNotDisturb !== undefined) {
    settingData.doNotDisturb = Boolean(body.doNotDisturb);
  }
  if (body.doNotDisturbStart !== undefined) {
    settingData.doNotDisturbStart = body.doNotDisturbStart || null;
  }
  if (body.doNotDisturbEnd !== undefined) {
    settingData.doNotDisturbEnd = body.doNotDisturbEnd || null;
  }
  if (body.notificationPrefs !== undefined && typeof body.notificationPrefs === 'object') {
    settingData.notificationPrefs = body.notificationPrefs;
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...userData,
      settings: {
        upsert: {
          create: {
            theme: (settingData.theme as string) ?? 'dark-tech',
            fontSize: (settingData.fontSize as string) ?? 'normal',
            density: (settingData.density as string) ?? 'comfortable',
            reducedMotion: (settingData.reducedMotion as boolean) ?? false,
            defaultLandingPage:
              (settingData.defaultLandingPage as string) ?? 'dashboard',
            defaultChildMode: (settingData.defaultChildMode as string) ?? 'last',
            notificationPrefs:
              (settingData.notificationPrefs as object) ?? {},
            reminderTime: (settingData.reminderTime as string) ?? '08:00',
            doNotDisturb: (settingData.doNotDisturb as boolean) ?? false,
            doNotDisturbStart:
              (settingData.doNotDisturbStart as string | null) ?? null,
            doNotDisturbEnd:
              (settingData.doNotDisturbEnd as string | null) ?? null,
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
    settings: updated.settings
      ? {
          theme: updated.settings.theme,
          fontSize: updated.settings.fontSize,
          density: updated.settings.density,
          reducedMotion: updated.settings.reducedMotion,
          defaultLandingPage: updated.settings.defaultLandingPage,
          defaultChildMode: updated.settings.defaultChildMode,
          notificationPrefs:
            (updated.settings.notificationPrefs as Record<string, boolean>) ||
            {},
          reminderTime: updated.settings.reminderTime,
          doNotDisturb: updated.settings.doNotDisturb,
          doNotDisturbStart: updated.settings.doNotDisturbStart,
          doNotDisturbEnd: updated.settings.doNotDisturbEnd,
        }
      : null,
  });
}
