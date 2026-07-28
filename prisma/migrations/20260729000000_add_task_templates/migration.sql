-- CreateEnum
CREATE TYPE "TaskCategory" AS ENUM ('CHINESE', 'MATH', 'ENGLISH', 'SCHOOL', 'READING', 'SPORT', 'INTEREST', 'OTHER');

-- CreateEnum
CREATE TYPE "TaskTemplateSource" AS ENUM ('SYSTEM', 'USER');

-- CreateTable
CREATE TABLE "TaskTemplate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "TaskCategory" NOT NULL,
    "gradeMin" INTEGER NOT NULL DEFAULT 1,
    "gradeMax" INTEGER NOT NULL DEFAULT 12,
    "duration" TEXT NOT NULL DEFAULT '30分钟',
    "materials" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "routeTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "milestoneTag" TEXT,
    "source" "TaskTemplateSource" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaskTemplate_userId_idx" ON "TaskTemplate"("userId");

-- CreateIndex
CREATE INDEX "TaskTemplate_category_idx" ON "TaskTemplate"("category");

-- CreateIndex
CREATE INDEX "TaskTemplate_source_idx" ON "TaskTemplate"("source");

-- AddForeignKey
ALTER TABLE "TaskTemplate" ADD CONSTRAINT "TaskTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

