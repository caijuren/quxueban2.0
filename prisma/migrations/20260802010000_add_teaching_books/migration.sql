-- CreateTable
CREATE TABLE "Publisher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "logoUrl" TEXT,
    "website" TEXT,
    "strongSubjects" TEXT,
    "series" TEXT,
    "contactEmail" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publisher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "typicalExamples" TEXT,
    "usageScenario" TEXT,
    "difficultyRange" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isbn" TEXT,
    "author" TEXT,
    "editionDate" TEXT,
    "editionNumber" TEXT,
    "price" DOUBLE PRECISION,
    "subject" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "textbookVersion" TEXT,
    "isNewTextbook" TEXT NOT NULL DEFAULT '否',
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "targetAudience" TEXT,
    "sellingPoints" TEXT,
    "structureDesc" TEXT,
    "companionSuggestion" TEXT,
    "coverImageUrl" TEXT,
    "jdUrl" TEXT,
    "dangdangUrl" TEXT,
    "officialUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT '在售',
    "lastVerifiedAt" TIMESTAMP(3),
    "note" TEXT,
    "publisherId" TEXT NOT NULL,
    "contentTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Publisher_name_key" ON "Publisher"("name");

-- CreateIndex
CREATE INDEX "Publisher_name_idx" ON "Publisher"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ContentType_name_key" ON "ContentType"("name");

-- CreateIndex
CREATE INDEX "ContentType_name_idx" ON "ContentType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Book_bookId_key" ON "Book"("bookId");

-- CreateIndex
CREATE INDEX "Book_subject_idx" ON "Book"("subject");

-- CreateIndex
CREATE INDEX "Book_grade_idx" ON "Book"("grade");

-- CreateIndex
CREATE INDEX "Book_status_idx" ON "Book"("status");

-- CreateIndex
CREATE INDEX "Book_difficulty_idx" ON "Book"("difficulty");

-- CreateIndex
CREATE INDEX "Book_publisherId_idx" ON "Book"("publisherId");

-- CreateIndex
CREATE INDEX "Book_contentTypeId_idx" ON "Book"("contentTypeId");

-- CreateIndex
CREATE INDEX "Book_isNewTextbook_idx" ON "Book"("isNewTextbook");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_contentTypeId_fkey" FOREIGN KEY ("contentTypeId") REFERENCES "ContentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
