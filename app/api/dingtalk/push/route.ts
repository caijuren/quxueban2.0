import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendDingTalkMarkdown, isDingTalkConfigured } from '@/lib/dingtalk';
import { normalizeWeeklyTask } from '@/lib/taskAlignment';
import { dingTalkPushSchema, validateBody } from '@/lib/validation';
import { getISOWeek } from '@/lib/weeklyTasks';
import { TASK_CATEGORY_LABELS } from '@/lib/taskTemplates';
import type { WeeklyTaskItem } from '@/lib/storage.types';

async function authenticate() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: '未开始',
    in_progress: '进行中',
    partially_done: '部分完成',
    done: '已完成',
    skipped: '跳过',
    rescheduled: '改期',
  };
  return map[status] || status;
}

function getQualityLabel(quality: string | null): string {
  if (!quality) return '';
  const map: Record<string, string> = {
    excellent: '优秀',
    good: '良好',
    average: '一般',
    needs_work: '需努力',
  };
  return map[quality] || quality;
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function getDayName(dateStr: string): string {
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return dayNames[new Date(dateStr).getDay()];
}

export async function POST(req: Request) {
  const userId = await authenticate();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(req, dingTalkPushSchema);
  if (!validation.success) {
    return validation.response;
  }

  const body = validation.data;
  const date = body.date || getTodayStr();
  const weekId = getISOWeek(new Date()).weekId;

  const child = await prisma.child.findFirst({
    where: { id: body.childId, userId },
  });
  if (!child) {
    return NextResponse.json({ error: 'Child not found' }, { status: 404 });
  }

  const dingTalkConfig = child.dingTalkWebhook
    ? { webhook: child.dingTalkWebhook, secret: child.dingTalkSecret }
    : undefined;

  if (!isDingTalkConfigured(dingTalkConfig)) {
    return NextResponse.json(
      { error: '该孩子未配置钉钉机器人，请先在编辑孩子中设置' },
      { status: 400 }
    );
  }

  const plan = await prisma.weeklyPlan.findFirst({
    where: { childId: body.childId, weekId, userId },
  });
  if (!plan) {
    return NextResponse.json({ error: 'Weekly plan not found' }, { status: 404 });
  }

  const rawTasks = (plan.tasks as unknown as Partial<WeeklyTaskItem>[]) || [];
  const tasks = rawTasks.map((task) => normalizeWeeklyTask(task as WeeklyTaskItem));

  const todayName = getDayName(date);
  const todayTasks = tasks.filter((t) => {
    if (body.taskIds && body.taskIds.length > 0) {
      return body.taskIds.includes(t.id);
    }
    return t.day === todayName;
  });

  if (todayTasks.length === 0) {
    return NextResponse.json({ error: 'No tasks to push' }, { status: 400 });
  }

  const doneCount = todayTasks.filter((t) => t.status === 'done').length;
  const partialCount = todayTasks.filter((t) => t.status === 'partially_done').length;
  const pendingCount = todayTasks.filter((t) => t.status === 'pending' || t.status === 'in_progress').length;
  const skippedCount = todayTasks.filter((t) => t.status === 'skipped' || t.status === 'rescheduled').length;

  const lines: string[] = [
    `## 📋 ${child.name} ${date} 学习任务日报`,
    '',
    `**完成统计**：已完成 ${doneCount} 项，部分完成 ${partialCount} 项，未开始/进行中 ${pendingCount} 项，跳过/改期 ${skippedCount} 项。`,
    '',
    '---',
    '',
  ];

  todayTasks.forEach((task) => {
    const record = task.completionRecords?.find((r) => r.date === date);
    const category = TASK_CATEGORY_LABELS[task.category] || '其他';
    lines.push(`### ${category} · ${task.focus}`);
    lines.push(`- **状态**：${getStatusLabel(task.status)}`);
    if (record) {
      if (record.progress > 0) {
        lines.push(`- **进度**：${record.progress}%`);
      }
      if (record.actualDurationMinutes > 0) {
        lines.push(`- **实际耗时**：${record.actualDurationMinutes} 分钟`);
      }
      if (record.quality) {
        lines.push(`- **质量**：${getQualityLabel(record.quality)}`);
      }
      if (record.note) {
        lines.push(`- **备注**：${record.note}`);
      }
    }
    lines.push('');
  });

  lines.push('---');
  lines.push('');
  lines.push('来自 趣学伴 学习任务管理系统');

  const result = await sendDingTalkMarkdown(
    {
      title: `${child.name} ${date} 学习任务日报`,
      text: lines.join('\n'),
    },
    dingTalkConfig
  );

  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  const pushedAt = new Date().toISOString();
  const updatedTasks = tasks.map((task) => {
    if (body.taskIds && body.taskIds.length > 0 && !body.taskIds.includes(task.id)) {
      return task;
    }
    const records = task.completionRecords || [];
    return {
      ...task,
      completionRecords: records.map((r) =>
        r.date === date ? { ...r, dingtalkPushedAt: pushedAt } : r
      ),
    };
  });

  await prisma.weeklyPlan.update({
    where: { id: plan.id },
    data: { tasks: updatedTasks as unknown as object[] },
  });

  return NextResponse.json({ success: true, message: result.message });
}
