import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentWeekId, getTodayName } from '@/lib/weeklyTasks';
import { normalizeWeeklyTask } from '@/lib/taskAlignment';
import { sendDailyReminder, getTemplateId } from '@/lib/miniapp/subscription';
import type { WeeklyTaskItem } from '@/lib/storage.types';

export async function POST(req: Request) {
  const configuredSecret = process.env.CRON_SECRET;
  const providedSecret = req.headers.get('x-cron-secret');
  if (!configuredSecret || providedSecret !== configuredSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const templateId = getTemplateId('dailyReminder');
  if (!templateId) {
    return NextResponse.json({ error: '未配置每日提醒模板 ID' }, { status: 400 });
  }

  const weekId = getCurrentWeekId();
  const todayName = getTodayName();

  const users = await prisma.user.findMany({
    where: { wechatOpenId: { not: null } },
    include: {
      children: true,
      settings: true,
    },
  });

  let sent = 0;
  let skipped = 0;

  const subscribedUsers = users.filter((user) => {
    if (!user.wechatOpenId || user.children.length === 0) return false;
    const prefs = (user.settings?.notificationPrefs as Record<string, unknown>) || {};
    const subscriptions = (prefs.miniappSubscriptions as Record<string, string>) || {};
    return subscriptions[templateId] === 'subscribed';
  });
  skipped = users.length - subscribedUsers.length;

  const childIds = subscribedUsers.flatMap((user) => user.children.map((c) => c.id));
  const plans = childIds.length
    ? await prisma.weeklyPlan.findMany({
        where: { childId: { in: childIds }, weekId },
      })
    : [];
  const planByChildId = new Map(plans.map((plan) => [plan.childId, plan]));

  for (const user of subscribedUsers) {
    for (const child of user.children) {
      const plan = planByChildId.get(child.id);
      if (!plan) continue;

      const rawTasks = (plan.tasks as unknown as Partial<WeeklyTaskItem>[]) || [];
      const tasks = rawTasks.map((task) => normalizeWeeklyTask(task as WeeklyTaskItem));
      const todayTasks = tasks.filter((task) => task.day === todayName);

      if (todayTasks.length === 0) continue;

      const doneCount = todayTasks.filter((t) => t.status === 'done').length;
      const pendingCount = todayTasks.length - doneCount;

      try {
        await sendDailyReminder(user.id, user.wechatOpenId!, child.name, pendingCount, doneCount);
        sent++;
      } catch (err) {
        console.error(`[daily-reminder] send failed for user ${user.id}:`, err);
      }
    }
  }

  return NextResponse.json({ sent, skipped });
}
