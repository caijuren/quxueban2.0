-- CreateEnum
CREATE TYPE "TaskWeeklySchedule" AS ENUM ('AUTO', 'DAILY', 'WEEKDAYS', 'WEEKENDS', 'CUSTOM');

-- AlterTable
ALTER TABLE "TaskTemplate" ADD COLUMN     "weeklySchedule" "TaskWeeklySchedule" NOT NULL DEFAULT 'AUTO',
ADD COLUMN     "customScheduleDays" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "TaskTemplate_weeklySchedule_idx" ON "TaskTemplate"("weeklySchedule");
