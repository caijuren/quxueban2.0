import { AppData, Migration } from './storage.types';

export const migrations: Migration[] = [
  {
    fromVersion: 0,
    toVersion: 1,
    description: '统一 localStorage 数据结构，合并 children 和 currentChildId 到 appData',
    migrate: (data) => {
      return {
        version: 1,
        children: data.children ?? [],
        currentChildId: data.currentChildId ?? (data.children?.[0]?.id ?? null),
        weeklyPlans: [],
      };
    },
  },
  {
    fromVersion: 1,
    toVersion: 2,
    description: '新增每周任务计划数据 weeklyPlans',
    migrate: (data) => ({
      ...data,
      version: 2,
      weeklyPlans: (data as AppData).weeklyPlans ?? [],
    }),
  },
];
