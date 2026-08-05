-- CreateTable
CREATE TABLE "LearningGoal" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "goalType" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "target" TEXT,
    "period" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'parent',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningGoal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LearningGoal_childId_idx" ON "LearningGoal"("childId");

-- CreateIndex
CREATE INDEX "LearningGoal_status_idx" ON "LearningGoal"("status");

-- AddForeignKey
ALTER TABLE "LearningGoal" ADD CONSTRAINT "LearningGoal_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;
