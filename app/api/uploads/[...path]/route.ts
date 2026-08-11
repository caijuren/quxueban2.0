import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isUserOwnedUpload, isViewableTaskEvidence } from '@/lib/uploadSecurity';

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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadsDir, ...params.path);
    const resolvedPath = path.resolve(filePath);

    const [folder, filename] = params.path;
    if (!folder || !filename || folder === 'miniapp') {
      return new NextResponse('Forbidden', { status: 403 });
    }
    if (folder !== 'task-evidence' && !isUserOwnedUpload(folder, filename, session.user.id)) {
      return new NextResponse('Forbidden', { status: 403 });
    }
    if (folder === 'task-evidence') {
      const children = await prisma.child.findMany({
        where: {
          OR: [
            { userId: session.user.id },
            {
              family: {
                members: { some: { userId: session.user.id, status: 'ACTIVE' } },
              },
            },
          ],
        },
        select: { id: true },
      });
      if (!isViewableTaskEvidence(filename, children.map((child) => child.id))) {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }

    // 防止目录遍历攻击
    const uploadsRoot = path.resolve(uploadsDir);
    if (resolvedPath !== uploadsRoot && !resolvedPath.startsWith(`${uploadsRoot}${path.sep}`)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const data = await readFile(resolvedPath);
    const ext = path.extname(filePath).toLowerCase();

    return new NextResponse(data, {
      headers: {
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'X-Content-Type-Options': 'nosniff',
        'Content-Disposition': 'inline',
        'Cache-Control': 'private, no-store',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
