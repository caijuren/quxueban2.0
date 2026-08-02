-- CreateTable
CREATE TABLE "SubjectPlanConfig" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "subject" TEXT NOT NULL,
    "tracks" JSONB NOT NULL,
    "timeAxis" JSONB NOT NULL,
    "nodes" JSONB NOT NULL,
    "yearlyTargets" JSONB NOT NULL,
    "examTimeline" JSONB NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubjectPlanConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubjectPlanConfig_subject_idx" ON "SubjectPlanConfig"("subject");

-- CreateIndex
CREATE INDEX "SubjectPlanConfig_userId_idx" ON "SubjectPlanConfig"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectPlanConfig_subject_userId_key" ON "SubjectPlanConfig"("subject", "userId");

-- AddForeignKey
ALTER TABLE "SubjectPlanConfig" ADD CONSTRAINT "SubjectPlanConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
