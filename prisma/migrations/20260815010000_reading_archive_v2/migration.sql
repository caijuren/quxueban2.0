-- AlterTable
ALTER TABLE "ReadingBook" ADD COLUMN "publisher" TEXT,
ADD COLUMN "description" TEXT,
ADD COLUMN "totalPages" INTEGER,
ADD COLUMN "wordCount" INTEGER,
ADD COLUMN "textType" TEXT,
ADD COLUMN "readingDifficulty" TEXT,
ADD COLUMN "readingLadderStart" INTEGER,
ADD COLUMN "readingLadderEnd" INTEGER,
ADD COLUMN "literacyTags" JSONB,
ADD COLUMN "totalPagesRead" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ReadingRecord" ADD COLUMN "startPage" INTEGER,
ADD COLUMN "endPage" INTEGER,
ADD COLUMN "effect" TEXT,
ADD COLUMN "performance" TEXT,
ADD COLUMN "tags" JSONB;

-- CreateTable
CREATE TABLE "ReadingEvidence" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "originalText" TEXT NOT NULL,
    "data" JSONB,
    "indicatorIds" JSONB,
    "sourceType" TEXT NOT NULL DEFAULT 'manual',
    "attachmentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadingEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReadingEvidence_childId_idx" ON "ReadingEvidence"("childId");

-- CreateIndex
CREATE INDEX "ReadingEvidence_status_idx" ON "ReadingEvidence"("status");

-- CreateIndex
CREATE INDEX "ReadingEvidence_type_idx" ON "ReadingEvidence"("type");

-- AddForeignKey
ALTER TABLE "ReadingEvidence" ADD CONSTRAINT "ReadingEvidence_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;
