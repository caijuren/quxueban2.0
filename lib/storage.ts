import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
  originalName?: string;
}

export interface StorageProvider {
  upload(file: UploadedFile, directory: string): Promise<string>;
}

function getExtFromMime(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'audio/x-m4a': '.m4a',
    'audio/mpeg': '.mp3',
    'audio/mp4': '.m4a',
    'audio/wav': '.wav',
    'audio/aac': '.aac',
    'audio/ogg': '.ogg',
    'video/mp4': '.mp4',
    'video/quicktime': '.mov',
    'video/webm': '.webm',
  };
  return map[mime.toLowerCase()] || '';
}

class LocalStorageProvider implements StorageProvider {
  private root: string;
  private baseUrl: string;

  constructor(root: string, baseUrl: string) {
    this.root = root;
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async upload(file: UploadedFile, directory: string): Promise<string> {
    const ext = path.extname(file.originalName || '') || getExtFromMime(file.mimetype);
    const filename = `${randomUUID()}${ext}`;
    const relativeDir = path.posix.join(directory, filename);
    const absolutePath = path.join(this.root, directory, filename);

    await fs.mkdir(path.dirname(absolutePath), { recursive: true });
    await fs.writeFile(absolutePath, file.buffer);

    return `${this.baseUrl}/${relativeDir}`;
  }
}

export function createStorageProvider(baseUrl: string): StorageProvider {
  const root = process.env.UPLOAD_LOCAL_ROOT || path.join(process.cwd(), 'public', 'uploads');
  return new LocalStorageProvider(root, baseUrl);
}
