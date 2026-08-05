-- AlterTable
ALTER TABLE "Child" ADD COLUMN     "wechatOpenId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Child_wechatOpenId_key" ON "Child"("wechatOpenId");

-- AlterTable
ALTER TABLE "Child" ADD COLUMN     "bindCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Child_bindCode_key" ON "Child"("bindCode");

-- AlterTable
ALTER TABLE "Child" ADD COLUMN     "bindCodeExpiresAt" TIMESTAMP(3);
