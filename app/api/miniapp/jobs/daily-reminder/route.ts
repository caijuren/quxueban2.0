import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentWeekId, getTodayName } from '@/lib/weeklyTasks';
import { normalizeWeeklyTask } from '@/lib/taskAlignment';
import { sendDailyReminder, getTemplateId } from '@/lib/miniapp/subscription';
import type { WeeklyTaskItem } from '@/lib/storage.types';

export async function POST() {
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

  for (const user of users) {
    if (!user.wechatOpenId || user.children.length === 0) continue;

    const prefs = (user.settings?.notificationPrefs as Record<string, unknown>) || {};
    const subscriptions = (prefs.miniappSubscriptions as Record<string, string>) || {};
    if (subscriptions[templateId] !== 'subscribed') {
      skipped++;
      continue;
    }

    for (const child of user.children) {
      const plan = await prisma.weeklyPlan.findUnique({
        where: {
          childId_weekId: {
            childId: child.id,
            weekId,
          },
        },
      });

      if (!plan) continue;

      const rawTasks = (plan.tasks as unknown as Partial<WeeklyTaskItem>[]) || [];
      const tasks = rawTasks.map((task) => normalizeWeeklyTask(task as WeeklyTaskItem));
      const todayTasks = tasks.filter((task) => task.day === todayName);

      if (todayTasks.length === 0) continue;

      const doneCount = todayTasks.filter((t) => t.status === 'done').length;
      const pendingCount = todayTasks.length - doneCount;

      try {
        await sendDailyReminder(user.id, user.wechatOpenId, child.name, pendingCount, doneCount);
        sent++;
      } catch (err) {
        console.error(`[daily-reminder] send failed for user ${user.id}:`, err);
      }
    }
  }

  return NextResponse.json({ sent, skipped });
}
