import { Child, getDefaultChildren } from './children';
import { AppData } from './storage.types';
import { migrations } from './migrations';

// 当前数据 schema 版本号
// 每次修改 AppData 结构时递增，并在 migrations.ts 添加迁移函数
export const CURRENT_DATA_VERSION = 1;

export const STORAGE_KEYS = {
  appData: 'quxueban_app_data',
  // 兼容旧版数据，后续可移除
  legacyChildren: 'quxueban_children',
  legacyCurrentChildId: 'quxueban_current_child_id',
} as const;

export type { AppData } from './storage.types';

function createDefaultAppData(): AppData {
  const defaults = getDefaultChildren();
  return {
    version: CURRENT_DATA_VERSION,
    children: defaults,
    currentChildId: defaults[0]?.id ?? null,
  };
}

function isValidAppData(value: unknown): value is AppData {
  if (typeof value !== 'object' || value === null) return false;
  const data = value as Record<string, unknown>;
  return (
    typeof data.version === 'number' &&
    Array.isArray(data.children) &&
    (typeof data.currentChildId === 'string' || data.currentChildId === null)
  );
}

function migrateToLatest(raw: unknown): AppData {
  // 识别旧版无 version 的数据结构：只有 children 数组
  const legacyV0 = raw as { children?: unknown[]; currentChildId?: string | null } | null | undefined;
  const hasOldShape = legacyV0 && Array.isArray(legacyV0.children);

  let current: AppData | null = hasOldShape
    ? {
        version: 0,
        children: (legacyV0.children ?? []) as Child[],
        currentChildId: legacyV0.currentChildId ?? null,
      }
    : isValidAppData(raw)
      ? raw
      : null;

  const startVersion = current?.version ?? 0;

  for (const migration of migrations) {
    const { fromVersion, toVersion } = migration;

    if (startVersion < fromVersion) continue;
    if ((current?.version ?? 0) >= toVersion) continue;

    current = migration.migrate(current ?? createDefaultAppData(), {
      fromVersion,
      toVersion,
    });
  }

  // 兜底：如果迁移后仍不合法，返回默认值
  if (!isValidAppData(current)) {
    return createDefaultAppData();
  }

  return current;
}

export function loadAppData(): AppData {
  if (typeof window === 'undefined') {
    return createDefaultAppData();
  }

  try {
    // 优先读取新版统一存储
    const rawAppData = localStorage.getItem(STORAGE_KEYS.appData);
    if (rawAppData) {
      const parsed = JSON.parse(rawAppData);
      return migrateToLatest(parsed);
    }

    // 兼容旧版分离存储
    const rawChildren = localStorage.getItem(STORAGE_KEYS.legacyChildren);
    const rawCurrent = localStorage.getItem(STORAGE_KEYS.legacyCurrentChildId);

    if (rawChildren) {
      const parsedChildren = JSON.parse(rawChildren);
      return migrateToLatest({
        version: 0,
        children: parsedChildren,
        currentChildId: rawCurrent,
      });
    }

    return createDefaultAppData();
  } catch (error) {
    console.error('[quxueban] Failed to load app data:', error);
    return createDefaultAppData();
  }
}

export function saveAppData(data: AppData): void {
  if (typeof window === 'undefined') return;

  try {
    const normalized: AppData = {
      ...data,
      version: CURRENT_DATA_VERSION,
    };
    localStorage.setItem(STORAGE_KEYS.appData, JSON.stringify(normalized));
  } catch (error) {
    console.error('[quxueban] Failed to save app data:', error);
  }
}

export function exportAppData(): string {
  const data = loadAppData();
  return JSON.stringify(data, null, 2);
}

export function importAppData(json: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const parsed = JSON.parse(json);
    const migrated = migrateToLatest(parsed);
    saveAppData(migrated);
    return true;
  } catch (error) {
    console.error('[quxueban] Failed to import app data:', error);
    return false;
  }
}

export function resetAppData(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(STORAGE_KEYS.appData);
  localStorage.removeItem(STORAGE_KEYS.legacyChildren);
  localStorage.removeItem(STORAGE_KEYS.legacyCurrentChildId);
}
