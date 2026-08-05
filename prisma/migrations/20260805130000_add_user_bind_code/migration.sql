-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bindCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_bindCode_key" ON "User"("bindCode");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bindCodeExpiresAt" TIMESTAMP(3);
