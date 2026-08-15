-- CreateTable
CREATE TABLE "ReadingBook" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "bookId" TEXT,
    "title" TEXT NOT NULL,
    "author" TEXT,
    "isbn" TEXT,
    "coverImageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'unread',
    "source" TEXT NOT NULL DEFAULT 'manual',
    "rating" INTEGER,
    "notes" TEXT,
    "readCount" INTEGER NOT NULL DEFAULT 0,
    "totalMinutes" INTEGER NOT NULL DEFAULT 0,
    "lastReadAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadingBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadingRecord" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "readingBookId" TEXT NOT NULL,
    "readDate" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 0,
    "pages" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReadingBook_childId_idx" ON "ReadingBook"("childId");

-- CreateIndex
CREATE INDEX "ReadingBook_status_idx" ON "ReadingBook"("status");

-- CreateIndex
CREATE INDEX "ReadingBook_isbn_idx" ON "ReadingBook"("isbn");

-- CreateIndex
CREATE INDEX "ReadingRecord_childId_idx" ON "ReadingRecord"("childId");

-- CreateIndex
CREATE INDEX "ReadingRecord_readingBookId_idx" ON "ReadingRecord"("readingBookId");

-- CreateIndex
CREATE INDEX "ReadingRecord_readDate_idx" ON "ReadingRecord"("readDate");

-- AddForeignKey
ALTER TABLE "ReadingBook" ADD CONSTRAINT "ReadingBook_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingRecord" ADD CONSTRAINT "ReadingRecord_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingRecord" ADD CONSTRAINT "ReadingRecord_readingBookId_fkey" FOREIGN KEY ("readingBookId") REFERENCES "ReadingBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
