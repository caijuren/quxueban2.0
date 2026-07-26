import { Child } from './children';

export interface AppData {
  version: number;
  children: Child[];
  currentChildId: string | null;
}

export interface MigrationContext {
  fromVersion: number;
  toVersion: number;
}

export type MigrationFn = (data: AppData, ctx: MigrationContext) => AppData;

export interface Migration {
  fromVersion: number;
  toVersion: number;
  description: string;
  migrate: MigrationFn;
}
