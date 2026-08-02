import { prisma } from './prisma';

export interface AiConfigData {
  id: string;
  provider: string;
  apiKey: string;
  apiUrl: string;
  model: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeAiConfigData {
  id: string;
  provider: string;
  apiKeyMasked: string;
  apiUrl: string;
  model: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length <= 8) {
    return apiKey ? '*'.repeat(apiKey.length) : '';
  }
  const start = apiKey.slice(0, 4);
  const end = apiKey.slice(-4);
  return `${start}${'*'.repeat(apiKey.length - 8)}${end}`;
}

export function toSafeConfig(config: AiConfigData): SafeAiConfigData {
  return {
    id: config.id,
    provider: config.provider,
    apiKeyMasked: maskApiKey(config.apiKey),
    apiUrl: config.apiUrl,
    model: config.model,
    isEnabled: config.isEnabled,
    createdAt: config.createdAt,
    updatedAt: config.updatedAt,
  };
}

export async function getAiConfig(): Promise<AiConfigData | null> {
  const config = await prisma.aiConfig.findFirst({
    orderBy: { updatedAt: 'desc' },
  });
  return config;
}

export async function getEnabledAiConfig(): Promise<AiConfigData | null> {
  const config = await prisma.aiConfig.findFirst({
    where: { isEnabled: true },
    orderBy: { updatedAt: 'desc' },
  });
  return config;
}

export async function upsertAiConfig(data: {
  provider: string;
  apiKey: string;
  apiUrl: string;
  model: string;
  isEnabled: boolean;
}): Promise<AiConfigData> {
  const existing = await prisma.aiConfig.findFirst({
    orderBy: { updatedAt: 'desc' },
  });

  if (existing) {
    return prisma.aiConfig.update({
      where: { id: existing.id },
      data: {
        provider: data.provider,
        apiKey: data.apiKey,
        apiUrl: data.apiUrl,
        model: data.model,
        isEnabled: data.isEnabled,
      },
    });
  }

  return prisma.aiConfig.create({
    data: {
      provider: data.provider,
      apiKey: data.apiKey,
      apiUrl: data.apiUrl,
      model: data.model,
      isEnabled: data.isEnabled,
    },
  });
}
