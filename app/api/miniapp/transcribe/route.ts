import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getMiniAppUser, unauthorizedResponse } from '@/lib/miniapp/auth';
import type { NextRequest } from 'next/server';

const ASR_PROVIDER = process.env.ASR_PROVIDER || 'baidu';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const BAIDU_ASR_APP_ID = process.env.BAIDU_ASR_APP_ID;
const BAIDU_ASR_API_KEY = process.env.BAIDU_ASR_API_KEY;
const BAIDU_ASR_SECRET_KEY = process.env.BAIDU_ASR_SECRET_KEY;

interface BaiduTokenCache {
  token: string;
  expiresAt: number;
}

let baiduTokenCache: BaiduTokenCache | null = null;

function resolveAudioPath(audioUrl: string): string | null {
  if (!audioUrl || typeof audioUrl !== 'string') return null;
  try {
    const url = new URL(audioUrl, 'http://localhost');
    const pathname = url.pathname;
    if (!pathname.startsWith('/uploads/')) return null;
    return path.join(process.cwd(), 'public', pathname);
  } catch {
    return null;
  }
}

async function getBaiduToken(): Promise<string | null> {
  if (baiduTokenCache && baiduTokenCache.expiresAt > Date.now() + 60 * 1000) {
    return baiduTokenCache.token;
  }

  if (!BAIDU_ASR_API_KEY || !BAIDU_ASR_SECRET_KEY) return null;

  const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${encodeURIComponent(
    BAIDU_ASR_API_KEY
  )}&client_secret=${encodeURIComponent(BAIDU_ASR_SECRET_KEY)}`;

  try {
    const res = await fetch(url, { method: 'POST' });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      access_token?: string;
      expires_in?: number;
      error?: string;
      error_description?: string;
    };

    if (!data.access_token) {
      console.error('[transcribe] baidu token error:', data.error, data.error_description);
      return null;
    }

    baiduTokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in || 2592000) * 1000,
    };

    return data.access_token;
  } catch (err) {
    console.error('[transcribe] baidu token fetch error:', err);
    return null;
  }
}

async function transcribeWithBaidu(audioUrl: string, filePath: string) {
  const token = await getBaiduToken();
  if (!token) {
    return NextResponse.json({ error: '百度语音识别未配置', transcript: '' }, { status: 503 });
  }

  try {
    const buffer = await readFile(filePath);
    const base64 = buffer.toString('base64');

    const body = {
      format: 'm4a',
      rate: 16000,
      channel: 1,
      cuid: BAIDU_ASR_APP_ID || 'quxueban',
      token,
      dev_pid: 1537,
      speech: base64,
      len: buffer.length,
    };

    const res = await fetch('https://vop.baidu.com/server_api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = (await res.json()) as {
      err_no?: number;
      err_msg?: string;
      result?: string[];
    };

    if (data.err_no !== 0) {
      console.error('[transcribe] baidu asr error:', data.err_no, data.err_msg);
      return NextResponse.json(
        { error: data.err_msg || '百度语音识别失败', transcript: '' },
        { status: 502 }
      );
    }

    const transcript = Array.isArray(data.result) ? data.result.join('') : '';
    return NextResponse.json({ transcript });
  } catch (err) {
    console.error('[transcribe] baidu asr process error:', err);
    return NextResponse.json({ error: '百度语音识别处理失败', transcript: '' }, { status: 500 });
  }
}

async function transcribeWithOpenAI(audioUrl: string, filePath: string) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI 语音识别未配置', transcript: '' }, { status: 503 });
  }

  try {
    const buffer = await readFile(filePath);
    const file = new File([buffer], 'audio.m4a', { type: 'audio/mp4' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', 'whisper-1');
    formData.append('language', 'zh');

    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[transcribe] OpenAI error:', res.status, text);
      return NextResponse.json({ error: 'OpenAI 语音识别失败', transcript: '' }, { status: 502 });
    }

    const data = (await res.json()) as { text?: string };
    return NextResponse.json({ transcript: data.text || '' });
  } catch (err) {
    console.error('[transcribe] OpenAI process error:', err);
    return NextResponse.json({ error: 'OpenAI 语音识别处理失败', transcript: '' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await getMiniAppUser(req);
  if (!auth) return unauthorizedResponse();

  let body: { audioUrl?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '请求体格式错误' }, { status: 400 });
  }

  const audioUrl = body.audioUrl;
  if (!audioUrl) {
    return NextResponse.json({ error: '缺少 audioUrl' }, { status: 400 });
  }

  const filePath = resolveAudioPath(audioUrl);
  if (!filePath) {
    return NextResponse.json({ error: '音频地址无效' }, { status: 400 });
  }

  if (ASR_PROVIDER === 'baidu') {
    return transcribeWithBaidu(audioUrl, filePath);
  }

  return transcribeWithOpenAI(audioUrl, filePath);
}
