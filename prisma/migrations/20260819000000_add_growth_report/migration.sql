-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('GENERATING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "GrowthReport" (
    "id" UUID NOT NULL,
    "childId" UUID NOT NULL,
    "type" "ReportType" NOT NULL,
    "periodStart" DATE NOT NULL,
    "periodEnd" DATE NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "highlights" JSONB NOT NULL DEFAULT '[]',
    "concerns" JSONB NOT NULL DEFAULT '[]',
    "abilityInsights" JSONB NOT NULL DEFAULT '{}',
    "nextWeekPlan" JSONB NOT NULL DEFAULT '[]',
    "chartsData" JSONB NOT NULL DEFAULT '{}',
    "rawAiResponse" JSONB,
    "status" "ReportStatus" NOT NULL DEFAULT 'GENERATING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrowthReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GrowthReport_childId_type_periodStart_key" ON "GrowthReport"("childId", "type", "periodStart");

-- CreateIndex
CREATE INDEX "GrowthReport_childId_type_createdAt_idx" ON "GrowthReport"("childId", "type", "createdAt");

-- AddForeignKey
ALTER TABLE "GrowthReport" ADD CONSTRAINT "GrowthReport_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;
