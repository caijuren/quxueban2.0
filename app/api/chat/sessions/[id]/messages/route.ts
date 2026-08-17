import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getEnabledAiConfig } from '@/lib/aiConfig';
import { aiFetch } from '@/lib/ai/fetchWithResilience';
import { chatMessageCreateSchema, validateBody } from '@/lib/validation';

type Params = { params: { id: string } };

const SYSTEM_PROMPT = `你是「趣学伴」AI 学习助手，一位熟悉上海升学规划的家庭教育顾问。

你的职责：
1. 回答家长关于孩子学习规划、学科提升、习惯养成、升学路径等方面的问题；
2. 结合孩子年级、目标和已选路线给出具体、可操作的建议；
3. 语气积极、有温度，像一位经验丰富的教育顾问；
4. 不编造孩子没有的信息，遇到不确定的情况会引导家长补充；
5. 每次回答控制在 300 字以内，条理清晰，便于家长快速理解。`;

interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callLLM(messages: LLMMessage[]): Promise<string | null> {
  const config = await getEnabledAiConfig();
  if (!config || !config.apiKey) {
    return null;
  }

  try {
    const res = await aiFetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    if (!res.ok) {
      console.error('[chat] LLM request failed:', res.status, await res.text().catch(() => ''));
      return null;
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.error('[chat] LLM error:', err);
    return null;
  }
}

function buildFallbackResponse(childName: string | null): string {
  return childName
    ? `抱歉，AI 服务暂时不可用。你可以先补充${childName}的最近学习情况，我会在服务恢复后给出更准确的建议。`
    : '抱歉，AI 服务暂时不可用。你可以先描述孩子的学习情况，我会在服务恢复后继续协助你。';
}

export async function GET(_req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const chatSession = await prisma.chatSession.findFirst({
    where: { id: params.id, userId: session.user.id },
  });
  if (!chatSession) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const messages = await prisma.chatMessage.findMany({
    where: { sessionId: params.id },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(messages);
}

export async function POST(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const validation = await validateBody(req, chatMessageCreateSchema);
  if (!validation.success) {
    return validation.response;
  }

  const chatSession = await prisma.chatSession.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      child: { select: { id: true, name: true, grade: true, routeId: true, targetSchool: true } },
    },
  });
  if (!chatSession) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { content } = validation.data;

  await prisma.chatMessage.create({
    data: {
      sessionId: params.id,
      role: 'user',
      content,
    },
  });

  const recentMessages = await prisma.chatMessage.findMany({
    where: { sessionId: params.id },
    orderBy: { createdAt: 'asc' },
    take: 20,
  });

  const child = chatSession.child;
  const childContext = child
    ? `孩子信息：${child.name}，年级：${child.grade}，路线：${child.routeId || '未设置'}，目标学校：${child.targetSchool || '未设置'}`
    : '';

  const messagesPayload: LLMMessage[] = [
    { role: 'system', content: `${SYSTEM_PROMPT}\n\n${childContext}` },
    ...recentMessages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  ];

  const llmResult = await callLLM(messagesPayload);
  const assistantContent = llmResult || buildFallbackResponse(child?.name ?? null);

  await prisma.chatSession.update({
    where: { id: params.id },
    data: { updatedAt: new Date() },
  });

  const assistantMessage = await prisma.chatMessage.create({
    data: {
      sessionId: params.id,
      role: 'assistant',
      content: assistantContent,
    },
  });

  return NextResponse.json(assistantMessage);
}
