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
      };
    },
  },

  // 示例：未来新增字段时，添加类似迁移
  // {
  //   fromVersion: 1,
  //   toVersion: 2,
  //   description: '新增用户设置和计划数据',
  //   migrate: (data) => ({
  //     ...data,
  //     version: 2,
  //     settings: (data as any).settings ?? { theme: 'dark', notifications: true },
  //     plans: (data as any).plans ?? {},
  //   }),
  // },
];
