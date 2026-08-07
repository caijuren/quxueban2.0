import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getEnabledAiConfig } from '@/lib/aiConfig';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const config = await getEnabledAiConfig();
    if (!config) {
      return NextResponse.json({ error: 'AI 未配置或已禁用' }, { status: 400 });
    }

    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: 'hi' }],
        max_tokens: 5,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: `AI API 返回错误: ${response.status}`, detail: text },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: '连接成功' });
  } catch (error) {
    console.error('AI config test error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '测试失败' },
      { status: 500 }
    );
  }
}
