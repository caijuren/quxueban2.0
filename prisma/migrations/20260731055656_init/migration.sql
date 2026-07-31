-- AlterTable
ALTER TABLE "TaskTemplate" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "difficulty" TEXT DEFAULT 'medium',
ADD COLUMN     "lastUsedAt" TIMESTAMP(3),
ADD COLUMN     "semesterTag" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "useCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "TaskTemplate_archivedAt_idx" ON "TaskTemplate"("archivedAt");

-- CreateIndex
CREATE INDEX "TaskTemplate_isActive_idx" ON "TaskTemplate"("isActive");
