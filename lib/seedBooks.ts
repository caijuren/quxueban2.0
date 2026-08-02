import publishers from '../prisma/seed-data/publishers.json';
import contentTypes from '../prisma/seed-data/contentTypes.json';
import books from '../prisma/seed-data/books.json';
import type { PrismaClient } from './generated/prisma';

type PublisherSeed = (typeof publishers)[number];
type ContentTypeSeed = (typeof contentTypes)[number];
type BookSeed = (typeof books)[number];

async function upsertPublishers(prisma: PrismaClient) {
  const map = new Map<string, string>();
  for (const p of publishers as PublisherSeed[]) {
    const record = await prisma.publisher.upsert({
      where: { name: p.name },
      update: {
        shortName: p.shortName,
        website: p.website,
        strongSubjects: p.strongSubjects,
        series: p.series,
        contactEmail: p.contactEmail,
        note: p.note,
      },
      create: {
        name: p.name,
        shortName: p.shortName,
        website: p.website,
        strongSubjects: p.strongSubjects,
        series: p.series,
        contactEmail: p.contactEmail,
        note: p.note,
      },
    });
    map.set(record.name, record.id);
  }
  return map;
}

async function upsertContentTypes(prisma: PrismaClient) {
  const map = new Map<string, string>();
  for (const c of contentTypes as ContentTypeSeed[]) {
    const record = await prisma.contentType.upsert({
      where: { name: c.name },
      update: {
        description: c.description,
        typicalExamples: c.typicalExamples,
        usageScenario: c.usageScenario,
        difficultyRange: c.difficultyRange,
      },
      create: {
        name: c.name,
        description: c.description,
        typicalExamples: c.typicalExamples,
        usageScenario: c.usageScenario,
        difficultyRange: c.difficultyRange,
      },
    });
    map.set(record.name, record.id);
  }
  return map;
}

async function upsertBooks(
  prisma: PrismaClient,
  publisherMap: Map<string, string>,
  contentTypeMap: Map<string, string>
) {
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const b of books as BookSeed[]) {
    const publisherId = publisherMap.get(b.publisher);
    const contentTypeId = contentTypeMap.get(b.contentType);

    if (!publisherId) {
      console.warn(`跳过 ${b.bookId}：未找到出版社 ${b.publisher}`);
      skipped++;
      continue;
    }
    if (!contentTypeId) {
      console.warn(`跳过 ${b.bookId}：未找到内容类型 ${b.contentType}`);
      skipped++;
      continue;
    }

    const existing = await prisma.book.findUnique({
      where: { bookId: b.bookId },
    });

    const data = {
      title: b.title,
      isbn: b.isbn,
      author: b.author,
      editionDate: b.editionDate,
      editionNumber: b.editionNumber,
      price: b.price,
      subject: b.subject,
      grade: b.grade,
      textbookVersion: b.textbookVersion,
      isNewTextbook: b.isNewTextbook,
      difficulty: b.difficulty,
      targetAudience: b.targetAudience,
      sellingPoints: b.sellingPoints,
      structureDesc: b.structureDesc,
      companionSuggestion: b.companionSuggestion,
      coverImageUrl: b.coverImageUrl,
      jdUrl: b.jdUrl,
      dangdangUrl: b.dangdangUrl,
      officialUrl: b.officialUrl,
      status: b.status,
      lastVerifiedAt: b.lastVerifiedAt ? new Date(b.lastVerifiedAt) : null,
      note: b.note,
      publisherId,
      contentTypeId,
    };

    if (existing) {
      await prisma.book.update({
        where: { bookId: b.bookId },
        data,
      });
      updated++;
    } else {
      await prisma.book.create({
        data: { ...data, bookId: b.bookId },
      });
      created++;
    }
  }

  return { created, updated, skipped };
}

export async function seedBooks(prisma: PrismaClient): Promise<{ created: number; updated: number; skipped: number }> {
  console.log('开始导入出版社...');
  const publisherMap = await upsertPublishers(prisma);
  console.log(`出版社导入完成：${publisherMap.size} 条`);

  console.log('开始导入内容类型...');
  const contentTypeMap = await upsertContentTypes(prisma);
  console.log(`内容类型导入完成：${contentTypeMap.size} 条`);

  console.log('开始导入书目...');
  const stats = await upsertBooks(prisma, publisherMap, contentTypeMap);
  console.log(`书目导入完成：新建 ${stats.created} 条，更新 ${stats.updated} 条，跳过 ${stats.skipped} 条`);

  return stats;
}
