-- AlterTable
ALTER TABLE "TaskTemplate" ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "TaskTemplate_isFavorite_idx" ON "TaskTemplate"("isFavorite");
