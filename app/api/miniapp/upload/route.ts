import { NextResponse } from 'next/server';
import { getMiniAppUser, unauthorizedResponse } from '@/lib/miniapp/auth';
import { writeFile, mkdir } from 'fs/promises';
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

function getFileExtension(type: string, name: string): string {
  const extFromName = path.extname(name);
  if (extFromName) return extFromName;

  const [main, sub] = type.split('/');
  if (main === 'audio' && sub === 'x-m4a') return '.m4a';
  if (sub) return `.${sub}`;
  return '.bin';
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

    const ext = getFileExtension(file.type, file.name);
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    const filename = `${timestamp}-${random}${ext}`;

    const actorId = auth.type === 'child' ? auth.childId : auth.userId;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'miniapp', actorId, fileType);
    await mkdir(uploadsDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    const baseUrl = getBaseUrl(req);
    const fileUrl = `${baseUrl}/uploads/miniapp/${actorId}/${fileType}/${filename}`;

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
