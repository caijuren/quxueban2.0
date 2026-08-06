import { NextResponse } from 'next/server';
import { getMiniAppUser, unauthorizedResponse } from '@/lib/miniapp/auth';
import { createStorageProvider } from '@/lib/storage';
import path from 'path';
import type { NextRequest } from 'next/server';

const MAX_SIZES = {
  image: 5 * 1024 * 1024,
  video: 50 * 1024 * 1024,
  audio: 10 * 1024 * 1024,
};

function getBaseUrl(req: NextRequest): string {
  const forwardedProto = req.headers.get('x-forwarded-proto');
  const forwardedHost = req.headers.get('x-forwarded-host');
  const host = req.headers.get('host');
  const protocol = forwardedProto || 'http';
  const hostname = forwardedHost || host || 'localhost';
  return `${protocol}://${hostname}`;
}

const ALLOWED_TYPES: Record<string, string[]> = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video: ['video/mp4', 'video/quicktime', 'video/webm'],
  audio: ['audio/mp4', 'audio/x-m4a', 'audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg'],
};

function getFileType(type: string): 'image' | 'video' | 'audio' | null {
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('video/')) return 'video';
  if (type.startsWith('audio/')) return 'audio';
  return null;
}

export async function POST(req: NextRequest) {
  const auth = await getMiniAppUser(req);
  if (!auth) return unauthorizedResponse();

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const typeHint = formData.get('type') as string | null;

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: '请上传文件' }, { status: 400 });
    }

    const fileType = getFileType(file.type) || (typeHint as 'image' | 'video' | 'audio' | null);
    if (!fileType) {
      return NextResponse.json({ error: '不支持的文件类型' }, { status: 400 });
    }

    if (!ALLOWED_TYPES[fileType].includes(file.type)) {
      return NextResponse.json(
        { error: `不支持的 ${fileType} 格式: ${file.type}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZES[fileType]) {
      return NextResponse.json(
        { error: `${fileType} 文件大小不能超过 ${MAX_SIZES[fileType] / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    const actorId = auth.type === 'child' ? auth.childId : auth.userId;
    const directory = path.posix.join('miniapp', actorId, fileType);

    const buffer = Buffer.from(await file.arrayBuffer());
    const storage = createStorageProvider(getBaseUrl(req));
    const fileUrl = await storage.upload(
      {
        buffer,
        mimetype: file.type,
        originalName: file.name,
      },
      directory
    );

    return NextResponse.json({
      url: fileUrl,
      type: fileType,
      name: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error('[miniapp upload] error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '上传失败' },
      { status: 500 }
    );
  }
}
