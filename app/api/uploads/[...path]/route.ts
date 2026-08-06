import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.m4a': 'audio/x-m4a',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
};

export async function GET(_req: Request, { params }: { params: { path: string[] } }) {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadsDir, ...params.path);
    const resolvedPath = path.resolve(filePath);

    // 防止目录遍历攻击
    if (!resolvedPath.startsWith(path.resolve(uploadsDir))) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const data = await readFile(resolvedPath);
    const ext = path.extname(filePath).toLowerCase();

    return new NextResponse(data, {
      headers: {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
