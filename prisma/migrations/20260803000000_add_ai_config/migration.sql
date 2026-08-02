-- CreateTable
CREATE TABLE "AiConfig" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'deepseek',
    "apiKey" TEXT NOT NULL,
    "apiUrl" TEXT NOT NULL DEFAULT 'https://api.deepseek.com/v1/chat/completions',
    "model" TEXT NOT NULL DEFAULT 'deepseek-chat',
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiConfig_provider_idx" ON "AiConfig"("provider");
