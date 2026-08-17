import { prisma } from './prisma';
import { encryptSecret, decryptSecret } from './crypto';

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
  if (!config) return null;
  return { ...config, apiKey: decryptSecret(config.apiKey) };
}

export async function getEnabledAiConfig(): Promise<AiConfigData | null> {
  const config = await prisma.aiConfig.findFirst({
    where: { isEnabled: true },
    orderBy: { updatedAt: 'desc' },
  });
  if (!config) return null;
  return { ...config, apiKey: decryptSecret(config.apiKey) };
}

export async function upsertAiConfig(data: {
  provider: string;
  apiKey: string;
  apiUrl: string;
  model: string;
  isEnabled: boolean;
}): Promise<AiConfigData> {
  const encryptedKey = encryptSecret(data.apiKey);

  const existing = await prisma.aiConfig.findFirst({
    orderBy: { updatedAt: 'desc' },
  });

  if (existing) {
    const updated = await prisma.aiConfig.update({
      where: { id: existing.id },
      data: {
        provider: data.provider,
        apiKey: encryptedKey,
        apiUrl: data.apiUrl,
        model: data.model,
        isEnabled: data.isEnabled,
      },
    });
    return { ...updated, apiKey: data.apiKey };
  }

  const created = await prisma.aiConfig.create({
    data: {
      provider: data.provider,
      apiKey: encryptedKey,
      apiUrl: data.apiUrl,
      model: data.model,
      isEnabled: data.isEnabled,
    },
  });
  return { ...created, apiKey: data.apiKey };
}
