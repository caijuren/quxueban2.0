-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('DAILY', 'MILESTONE', 'REMEDIAL', 'SPRINT', 'DIAGNOSTIC');

-- CreateEnum
CREATE TYPE "TaskFrequency" AS ENUM ('ONCE', 'DAILY', 'WEEKLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "CapabilityCategory" AS ENUM ('CHINESE', 'MATH', 'ENGLISH', 'GENERAL', 'EXAM', 'ADMISSION');

-- AlterTable
ALTER TABLE "TaskTemplate" ADD COLUMN     "assessmentCriteria" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "customFrequency" JSONB,
ADD COLUMN     "frequency" "TaskFrequency" NOT NULL DEFAULT 'ONCE',
ADD COLUMN     "taskType" "TaskType" NOT NULL DEFAULT 'DAILY';

-- CreateTable
CREATE TABLE "Capability" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "category" "CapabilityCategory" NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Capability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskCapabilityLink" (
    "id" TEXT NOT NULL,
    "taskTemplateId" TEXT NOT NULL,
    "capabilityId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "expectedProgress" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "TaskCapabilityLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Capability_userId_idx" ON "Capability"("userId");

-- CreateIndex
CREATE INDEX "Capability_category_idx" ON "Capability"("category");

-- CreateIndex
CREATE INDEX "Capability_isSystem_idx" ON "Capability"("isSystem");

-- CreateIndex
CREATE INDEX "TaskCapabilityLink_taskTemplateId_idx" ON "TaskCapabilityLink"("taskTemplateId");

-- CreateIndex
CREATE INDEX "TaskCapabilityLink_capabilityId_idx" ON "TaskCapabilityLink"("capabilityId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskCapabilityLink_taskTemplateId_capabilityId_key" ON "TaskCapabilityLink"("taskTemplateId", "capabilityId");

-- CreateIndex
CREATE INDEX "TaskTemplate_taskType_idx" ON "TaskTemplate"("taskType");

-- CreateIndex
CREATE INDEX "TaskTemplate_frequency_idx" ON "TaskTemplate"("frequency");

-- AddForeignKey
ALTER TABLE "Capability" ADD CONSTRAINT "Capability_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskCapabilityLink" ADD CONSTRAINT "TaskCapabilityLink_taskTemplateId_fkey" FOREIGN KEY ("taskTemplateId") REFERENCES "TaskTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskCapabilityLink" ADD CONSTRAINT "TaskCapabilityLink_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "Capability"("id") ON DELETE CASCADE ON UPDATE CASCADE;
