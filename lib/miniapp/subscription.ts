import { prisma } from '@/lib/prisma';
import { sendSubscribeMessage, SubscribeMessageData } from './wechat';

export const SUBSCRIBE_TEMPLATES = {
  dailyReminder: process.env.WECHAT_MINIAPP_DAILY_REMINDER_TEMPLATE_ID || '',
  taskCompleted: process.env.WECHAT_MINIAPP_TASK_COMPLETED_TEMPLATE_ID || '',
  deadlineWarning: process.env.WECHAT_MINIAPP_DEADLINE_WARNING_TEMPLATE_ID || '',
};

export type SubscribeTemplateKey = keyof typeof SUBSCRIBE_TEMPLATES;

interface NotificationPrefs {
  miniappSubscriptions?: Record<string, 'subscribed' | 'rejected'>;
}

export function getTemplateId(key: SubscribeTemplateKey): string {
  return SUBSCRIBE_TEMPLATES[key];
}

export async function saveSubscriptionStatus(
  userId: string,
  results: Record<string, 'accept' | 'reject' | 'ban' | string>
) {
  const settings = await prisma.userSetting.findUnique({
    where: { userId },
    select: { notificationPrefs: true },
  });

  const prefs: NotificationPrefs = (settings?.notificationPrefs as NotificationPrefs) || {};
  const subscriptions = prefs.miniappSubscriptions || {};

  Object.entries(results).forEach(([templateId, status]) => {
    subscriptions[templateId] = status === 'accept' ? 'subscribed' : 'rejected';
  });

  prefs.miniappSubscriptions = subscriptions;

  await prisma.userSetting.upsert({
    where: { userId },
    update: { notificationPrefs: prefs as object },
    create: {
      userId,
      notificationPrefs: prefs as object,
    },
  });
}

export async function isSubscribed(userId: string, templateId: string): Promise<boolean> {
  const settings = await prisma.userSetting.findUnique({
    where: { userId },
    select: { notificationPrefs: true },
  });

  const prefs: NotificationPrefs = (settings?.notificationPrefs as NotificationPrefs) || {};
  return prefs.miniappSubscriptions?.[templateId] === 'subscribed';
}

export async function sendDailyReminder(
  userId: string,
  openId: string,
  childName: string,
  pendingCount: number,
  doneCount: number
) {
  const templateId = getTemplateId('dailyReminder');
  if (!templateId) return;

  if (!(await isSubscribed(userId, templateId))) return;

  const data: SubscribeMessageData = {
    thing1: { value: `${childName}今日学习任务` },
    thing2: { value: `待完成 ${pendingCount} 项，已完成 ${doneCount} 项` },
    time3: { value: new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' }) },
  };

  await sendSubscribeMessage(openId, templateId, data, '/pages/tasks/tasks');
}

export async function sendTaskCompletedReminder(
  userId: string,
  openId: string,
  childName: string,
  taskName: string,
  completedBy: 'parent' | 'child'
) {
  const templateId = getTemplateId('taskCompleted');
  if (!templateId) return;

  if (!(await isSubscribed(userId, templateId))) return;

  const data: SubscribeMessageData = {
    thing1: { value: childName },
    thing2: { value: taskName },
    thing3: { value: completedBy === 'parent' ? '家长代打卡' : '孩子自己完成' },
    time4: { value: new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' }) },
  };

  await sendSubscribeMessage(openId, templateId, data, '/pages/tasks/tasks');
}

export async function sendDeadlineWarning(
  userId: string,
  openId: string,
  childName: string,
  taskName: string,
  deadline: string
) {
  const templateId = getTemplateId('deadlineWarning');
  if (!templateId) return;

  if (!(await isSubscribed(userId, templateId))) return;

  const data: SubscribeMessageData = {
    thing1: { value: childName },
    thing2: { value: taskName },
    time3: { value: deadline },
  };

  await sendSubscribeMessage(openId, templateId, data, '/pages/tasks/tasks');
}
