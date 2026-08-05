import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    templateIds: {
      dailyReminder: process.env.WECHAT_MINIAPP_DAILY_REMINDER_TEMPLATE_ID || '',
      taskCompleted: process.env.WECHAT_MINIAPP_TASK_COMPLETED_TEMPLATE_ID || '',
      deadlineWarning: process.env.WECHAT_MINIAPP_DEADLINE_WARNING_TEMPLATE_ID || '',
    },
  });
}
