-- CreateIndex
CREATE INDEX IF NOT EXISTS "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "PointLog_childId_createdAt_idx" ON "PointLog"("childId", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ChatSession_userId_childId_updatedAt_idx" ON "ChatSession"("userId", "childId", "updatedAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ChatMessage_sessionId_createdAt_idx" ON "ChatMessage"("sessionId", "createdAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ReadingRecord_childId_readDate_idx" ON "ReadingRecord"("childId", "readDate");
