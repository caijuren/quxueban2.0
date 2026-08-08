import { NextResponse } from 'next/server';
import { getMiniAppUser, unauthorizedResponse } from '@/lib/miniapp/auth';
import { prisma } from '@/lib/prisma';
import { normalizeWeeklyTask } from '@/lib/taskAlignment';
import { taskCompletionInputSchema, validateBody } from '@/lib/validation';
import { sendTaskCompletedReminder } from '@/lib/miniapp/subscription';
import { getManageableChildIdsForUser } from '@/lib/family';
import { getGamificationContext, checkAndAwardBadges } from '@/lib/gamification';
import type { NextRequest } from 'next/server';
import type { WeeklyTaskItem, TaskCompletionRecord } from '@/lib/storage.types';

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export async function POST(req: NextRequest, { params }: { params: { taskId: string } }) {
  const auth = await getMiniAppUser(req);
  if (!auth) return unauthorizedResponse();

  const validation = await validateBody(req, taskCompletionInputSchema);
  if (!validation.success) {
    return validation.response;
  }

  const body = validation.data;
  const taskId = params.taskId;

  const activeRole = auth.type === 'child' ? 'child' : req.headers.get('x-active-role') || 'parent';

  // 查找包含该任务的周计划（家长包含自己创建及家庭可管理的孩子）
  let planWhere;
  if (auth.type === 'child') {
    planWhere = { childId: auth.childId };
  } else {
    const manageableChildIds = await getManageableChildIdsForUser(auth.userId);
    planWhere = {
      OR: [
        { userId: auth.userId },
        ...(manageableChildIds.length > 0 ? [{ childId: { in: manageableChildIds } }] : []),
      ],
    };
  }

  console.log('[miniapp complete] planWhere:', JSON.stringify(planWhere), 'taskId:', taskId);

  const plans = await prisma.weeklyPlan.findMany({
    where: planWhere,
    include: { child: true },
    orderBy: { weekId: 'desc' },
  });

  let targetPlan: (typeof plans)[0] | null = null;
  let taskIndex = -1;

  for (const plan of plans) {
    const rawTasks = (plan.tasks as unknown as Partial<WeeklyTaskItem>[]) || [];
    const tasks = rawTasks.map((task) => normalizeWeeklyTask(task as WeeklyTaskItem));
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index !== -1) {
      targetPlan = plan;
      taskIndex = index;
      break;
    }
  }

  if (!targetPlan || taskIndex === -1) {
    console.error('[miniapp complete] task not found, searched plans:', plans.length);
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  console.log('[miniapp complete] found plan:', targetPlan.id, 'child:', targetPlan.childId);

  const rawTasks = (targetPlan.tasks as unknown as Partial<WeeklyTaskItem>[]) || [];
  const tasks = rawTasks.map((task) => normalizeWeeklyTask(task as WeeklyTaskItem));

  const now = new Date().toISOString();
  const date = body.date || getTodayStr();

  const record: TaskCompletionRecord = {
    id: generateId(),
    date,
    status: body.status,
    progress: body.progress,
    actualDurationMinutes: body.actualDurationMinutes,
    quality: body.quality ?? null,
    note: body.note || (activeRole === 'parent' ? '家长代打卡' : '孩子自己打卡'),
    imageUrls: body.imageUrls || [],
    audioUrls: body.audioUrls || [],
    audioTranscript: body.audioTranscript,
    capabilityProgress: body.capabilityProgress || [],
    quantityIncrement: body.quantityIncrement || 0,
    checklistProgress: body.checklistProgress || [],
    metadata: body.metadata,
    createdAt: now,
    updatedAt: now,
  };

  const existingRecords = tasks[taskIndex].completionRecords || [];
  const sameDayIndex = existingRecords.findIndex((r) => r.date === date);

  let completionRecords: TaskCompletionRecord[];
  if (sameDayIndex >= 0) {
    completionRecords = existingRecords.map((r, idx) =>
      idx === sameDayIndex ? { ...record, id: r.id, createdAt: r.createdAt } : r
    );
  } else {
    completionRecords = [...existingRecords, record];
  }

  const isDone = body.status === 'done';

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    status: body.status,
    completedAt: isDone ? now : tasks[taskIndex].completedAt,
    note: body.note || undefined,
    completionRecords,
  };

  const updated = await prisma.weeklyPlan.update({
    where: { id: targetPlan.id },
    data: {
      tasks: tasks as unknown as object[],
    },
  });

  console.log(
    '[miniapp complete] updated plan:',
    updated.id,
    'task status:',
    tasks[taskIndex].status
  );

  // 打卡成功后触发徽章/积分/连续打卡
  if (isDone && targetPlan.child) {
    try {
      const gamificationContext = await getGamificationContext(
        targetPlan.child.id,
        targetPlan.child.userId
      );
      await checkAndAwardBadges(targetPlan.child.id, gamificationContext);
    } catch (err) {
      console.error('[miniapp complete] gamification failed:', err);
    }
  }

  // 打卡成功后异步通知孩子的实际家长
  if (isDone && targetPlan.child) {
    const parentUserId = targetPlan.child.userId;

    const user = await prisma.user.findUnique({
      where: { id: parentUserId },
      select: { wechatOpenId: true },
    });

    if (user?.wechatOpenId) {
      sendTaskCompletedReminder(
        parentUserId,
        user.wechatOpenId,
        targetPlan.child.name,
        tasks[taskIndex].focus,
        activeRole === 'parent' ? 'parent' : 'child'
      ).catch((err) => {
        console.error('[miniapp complete] send notification failed:', err);
      });
    }
  }

  return NextResponse.json({ success: true, planId: updated.id });
}
