#!/usr/bin/env tsx
/**
 * 旧版趣学班阅读数据迁移脚本
 *
 * 数据源（旧系统 /Users/grubby/Desktop/quxueban 的两种 JSON 导出，自动检测）：
 *  1. 图书馆导出（buildLibraryExport 输出）：
 *     { exportedAt, familyId, childId, total, books: [{ id, name, author, isbn, publisher,
 *       type, totalPages, wordCount, coverUrl, characterTag, description, readCount,
 *       readState: {status, finishedAt}|null, totalReadPages, totalReadMinutes,
 *       readLogCount, lastReadDate, createdAt, updatedAt }] }
 *  2. 完整家庭备份（settings-backup-restore 输出）：
 *     { exportInfo, family, children, books: [...], readingLogs: [{ id, childId, bookId,
 *       pages, minutes, readDate, effect, performance, note, readStage, focusRating,
 *       tags, startPage, endPage, createdAt }] }
 *
 * 用法：
 *  pnpm tsx scripts/migrate-old-library.ts --file /path/to/export.json --childId <新系统孩子id> [--dry-run]
 *
 * 可选参数：
 *  --childMap "旧childId:新childId,旧childId:新childId"  完整备份中按旧孩子映射到不同新孩子
 *  --dry-run  只统计不写入
 */

import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

interface OldBook {
  id: number;
  name: string;
  author?: string;
  isbn?: string;
  publisher?: string;
  type?: string;
  totalPages?: number;
  wordCount?: number | null;
  coverUrl?: string;
  characterTag?: string;
  description?: string;
  readCount?: number;
  readState?: { status?: string; finishedAt?: string | null } | null;
  totalReadPages?: number;
  totalReadMinutes?: number;
  readLogCount?: number;
  lastReadDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface OldReadingLog {
  id: number;
  childId?: number | null;
  bookId: number;
  pages?: number;
  minutes?: number;
  readDate: string;
  effect?: string;
  performance?: string;
  note?: string;
  readStage?: string;
  focusRating?: number;
  tags?: unknown;
  startPage?: number;
  endPage?: number;
  createdAt?: string;
}

interface LibraryExport {
  exportedAt?: string;
  familyId?: number;
  childId?: number;
  total?: number;
  books?: OldBook[];
}

interface FamilyBackup {
  exportInfo?: unknown;
  family?: { familyCode?: string };
  children?: Array<{ id: number; name?: string }>;
  books?: OldBook[];
  readingLogs?: OldReadingLog[];
}

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = argv[i + 1];
      if (value !== undefined && !value.startsWith('--')) {
        args[key] = value;
        i++;
      } else {
        args[key] = 'true';
      }
    }
  }
  return args;
}

function normalizeInt(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : fallback;
}

function normalizeStr(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function parseDate(value: unknown): Date | null {
  if (!value) return null;
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}

function mapTextType(type: string): string {
  const t = type.trim().toLowerCase();
  const map: Record<string, string> = {
    children: 'story',
    fiction: 'story',
    story: 'story',
    tradition: 'traditional_culture',
    traditional: 'traditional_culture',
    science: 'nonfiction',
    nonfiction: 'nonfiction',
    poetry: 'poetry',
    picture_book: 'picture_book',
    picture: 'picture_book',
  };
  return map[t] || 'other';
}

function mapStatus(status: string | undefined): string {
  const s = (status || '').trim().toLowerCase();
  if (['finished', 'read', 'done', 'completed', '已读', '已读完'].includes(s)) return 'read';
  if (['reading', 'in_progress', '在读'].includes(s)) return 'reading';
  return 'unread';
}

function detectFormat(payload: unknown): 'library' | 'backup' | 'unknown' {
  if (!payload || typeof payload !== 'object') return 'unknown';
  const p = payload as Record<string, unknown>;
  if (Array.isArray(p.books) && p.books.length > 0) {
    const first = p.books[0] as Record<string, unknown>;
    if ('readState' in first || 'readLogCount' in first || 'totalReadMinutes' in first) {
      return 'library';
    }
  }
  if (typeof p.family === 'object' && p.family !== null) return 'backup';
  if (Array.isArray(p.books) && Array.isArray(p.readingLogs)) return 'backup';
  return 'unknown';
}

function buildBookData(book: OldBook) {
  return {
    title: normalizeStr(book.name),
    author: normalizeStr(book.author) || null,
    isbn: normalizeStr(book.isbn) || null,
    publisher: normalizeStr(book.publisher) || null,
    coverImageUrl: normalizeStr(book.coverUrl) || null,
    description: normalizeStr(book.description) || null,
    totalPages: book.totalPages ? normalizeInt(book.totalPages) : null,
    wordCount: book.wordCount ? normalizeInt(book.wordCount) : null,
    textType: mapTextType(normalizeStr(book.type, 'other')),
    status: mapStatus(book.readState?.status),
    source: 'import',
    readCount: normalizeInt(book.readCount),
    totalMinutes: normalizeInt(book.totalReadMinutes),
    totalPagesRead: normalizeInt(book.totalReadPages),
    lastReadAt: parseDate(book.lastReadDate || book.updatedAt || book.createdAt),
    createdAt: parseDate(book.createdAt) ?? new Date(),
  };
}

async function findExistingBook(childId: string, book: OldBook) {
  const isbn = normalizeStr(book.isbn);
  if (isbn) {
    const byIsbn = await prisma.readingBook.findFirst({
      where: { childId, isbn },
    });
    if (byIsbn) return byIsbn;
  }
  const title = normalizeStr(book.name);
  const author = normalizeStr(book.author);
  if (title) {
    return prisma.readingBook.findFirst({
      where: {
        childId,
        title,
        ...(author ? { author } : {}),
      },
    });
  }
  return null;
}

async function importBooks(
  childId: string,
  books: OldBook[],
  dryRun: boolean
) {
  let created = 0;
  let updated = 0;
  let skipped = 0;
  const bookIdMap = new Map<number, string>();

  for (const book of books) {
    if (!normalizeStr(book.name)) {
      skipped++;
      continue;
    }

    const data = buildBookData(book);
    const existing = await findExistingBook(childId, book);

    if (existing) {
      if (!dryRun) {
        await prisma.readingBook.update({
          where: { id: existing.id },
          data: {
            status: data.status,
            readCount: data.readCount,
            totalMinutes: data.totalMinutes,
            totalPagesRead: data.totalPagesRead,
            lastReadAt: data.lastReadAt,
            ...(existing.isbn ? {} : { isbn: data.isbn }),
            ...(existing.publisher ? {} : { publisher: data.publisher }),
          },
        });
      }
      bookIdMap.set(book.id, existing.id);
      updated++;
    } else {
      if (dryRun) {
        bookIdMap.set(book.id, `dry-run-book-${book.id}`);
      } else {
        const createdBook = await prisma.readingBook.create({
          data: { ...data, childId },
        });
        bookIdMap.set(book.id, createdBook.id);
      }
      created++;
    }
  }

  return { created, updated, skipped, bookIdMap };
}

async function importReadingLogs(
  childMap: Map<number, string>,
  defaultChildId: string,
  logs: OldReadingLog[],
  bookIdMap: Map<number, string>,
  dryRun: boolean
) {
  let created = 0;
  let skipped = 0;

  for (const log of logs) {
    const newBookId = bookIdMap.get(log.bookId);
    if (!newBookId) {
      skipped++;
      continue;
    }
    const childId = log.childId != null && childMap.has(log.childId)
      ? childMap.get(log.childId)!
      : defaultChildId;

    const readDate = parseDate(log.readDate);
    if (!readDate) {
      skipped++;
      continue;
    }

    const dayStart = new Date(readDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const existing = await prisma.readingRecord.findFirst({
      where: {
        childId,
        readingBookId: newBookId,
        readDate: { gte: dayStart, lt: dayEnd },
      },
      select: { id: true },
    });
    if (existing) {
      skipped++;
      continue;
    }

    if (!dryRun) {
      await prisma.readingRecord.create({
        data: {
          childId,
          readingBookId: newBookId,
          readDate,
          durationMinutes: normalizeInt(log.minutes),
          pages: log.pages ? normalizeInt(log.pages) : null,
          startPage: log.startPage ? normalizeInt(log.startPage) : null,
          endPage: log.endPage ? normalizeInt(log.endPage) : null,
          effect: normalizeStr(log.effect) || null,
          performance: normalizeStr(log.performance) || null,
          note: normalizeStr(log.note) || null,
        },
      });
    }
    created++;
  }

  return { created, skipped };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const filePath = args.file;
  const childId = args.childId;
  const dryRun = args['dry-run'] === 'true';

  if (!filePath || !childId) {
    console.error('用法: pnpm tsx scripts/migrate-old-library.ts --file <json> --childId <新孩子id> [--dry-run]');
    process.exit(1);
  }

  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child) {
    console.error(`未找到新系统孩子: ${childId}`);
    process.exit(1);
  }

  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`文件不存在: ${absolutePath}`);
    process.exit(1);
  }

  const payload = JSON.parse(fs.readFileSync(absolutePath, 'utf8')) as
    | LibraryExport
    | FamilyBackup;
  const format = detectFormat(payload);
  if (format === 'unknown') {
    console.error('无法识别的 JSON 格式（需要旧系统图书馆导出或完整家庭备份）');
    process.exit(1);
  }
  console.log(`检测到格式: ${format === 'library' ? '图书馆导出' : '完整家庭备份'}`);
  console.log(`目标孩子: ${child.name} (${childId})${dryRun ? ' [DRY RUN]' : ''}`);

  const childMap = new Map<number, string>();
  if (args.childMap) {
    for (const pair of args.childMap.split(',')) {
      const [oldId, newId] = pair.split(':').map((s) => s.trim());
      if (oldId && newId) childMap.set(Number(oldId), newId);
    }
  }

  const books = (payload.books || []) as OldBook[];
  const { created, updated, skipped, bookIdMap } = await importBooks(childId, books, dryRun);
  console.log(`书籍: 新建 ${created}，更新 ${updated}，跳过 ${skipped}`);

  if (format === 'backup') {
    const backup = payload as FamilyBackup;
    const logs = backup.readingLogs || [];

    const logStats = await importReadingLogs(childMap, childId, logs, bookIdMap, dryRun);
    console.log(`阅读记录: 新建 ${logStats.created}，跳过 ${logStats.skipped}`);
  } else {
    // 图书馆导出：无逐条记录，聚合数据已写入书籍字段
    const withData = books.filter(
      (b) => normalizeInt(b.totalReadMinutes) > 0 || normalizeInt(b.totalReadPages) > 0
    );
    console.log(`图书馆导出：聚合数据已同步到 ${withData.length} 本书（阅读时长/页数/次数/状态）`);
  }

  console.log(dryRun ? '（预览完成，未写入任何数据）' : '迁移完成');
}

main()
  .catch((error) => {
    console.error('迁移失败:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
