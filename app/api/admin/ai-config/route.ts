import { NextRequest, NextResponse } from 'next/server';
import { getServerSession, type Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getAiConfig,
  upsertAiConfig,
  toSafeConfig,
  type SafeAiConfigData,
} from '@/lib/aiConfig';

function isAdmin(session: Session | null): boolean {
  return session?.user?.role === 'ADMIN';
}

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    if (!isAdmin(session)) {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const config = await getAiConfig();
    const response: SafeAiConfigData | null = config ? toSafeConfig(config) : null;

    return NextResponse.json(response);
  } catch (error) {
    console.error('Get AI config error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取配置失败' },
      { status: 500 }
    );
  }
}

const ALLOWED_PROVIDERS = ['deepseek', 'openai'];
const DEFAULT_MODELS: Record<string, string> = {
  deepseek: 'deepseek-chat',
  openai: 'gpt-4o-mini',
};
const DEFAULT_URLS: Record<string, string> = {
  deepseek: 'https://api.deepseek.com/v1/chat/completions',
  openai: 'https://api.openai.com/v1/chat/completions',
};

export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    if (!isAdmin(session)) {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const body = (await req.json()) as {
      provider?: string;
      apiKey?: string;
      apiUrl?: string;
      model?: string;
      isEnabled?: boolean;
    };

    const provider = body.provider?.trim().toLowerCase() || 'deepseek';
    if (!ALLOWED_PROVIDERS.includes(provider)) {
      return NextResponse.json({ error: '不支持的 AI 提供商' }, { status: 400 });
    }

    const apiKey = body.apiKey?.trim();
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key 不能为空' }, { status: 400 });
    }

    // 如果前端传的是脱敏后的 key（包含 *），则保留原 key
    const existing = await getAiConfig();
    let finalApiKey = apiKey;
    if (apiKey.includes('*') && existing) {
      finalApiKey = existing.apiKey;
    }

    const apiUrl = body.apiUrl?.trim() || DEFAULT_URLS[provider];
    const model = body.model?.trim() || DEFAULT_MODELS[provider];

    const config = await upsertAiConfig({
      provider,
      apiKey: finalApiKey,
      apiUrl,
      model,
      isEnabled: body.isEnabled ?? true,
    });

    return NextResponse.json(toSafeConfig(config));
  } catch (error) {
    console.error('Save AI config error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '保存配置失败' },
      { status: 500 }
    );
  }
}
