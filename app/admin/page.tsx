'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  Baby,
  Map,
  CalendarCheck,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { useAdminStats, useAdminUsers } from '@/lib/hooks/useAdmin';

const statCards = [
  { key: 'userCount', label: '注册用户', icon: Users, color: 'from-blue-500 to-cyan-500' },
  { key: 'childCount', label: '孩子档案', icon: Baby, color: 'from-pink-500 to-rose-500' },
  { key: 'planCount', label: '升学计划', icon: Map, color: 'from-violet-500 to-purple-500' },
  { key: 'weeklyPlanCount', label: '周计划', icon: CalendarCheck, color: 'from-emerald-500 to-teal-500' },
] as const;

export default function AdminPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useAdminStats();
  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useAdminUsers();

  const loading = statsLoading || usersLoading;
  const error = statsError || usersError;
  const recentUsers = users.slice(0, 10);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-error/20 bg-error/10 p-6 text-error">
        {error instanceof Error ? error.message : '加载失败'}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-display">数据概览</h1>
        <p className="text-text-tertiary">平台核心指标一览</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const value = stats?.[card.key] ?? 0;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-border-subtle bg-surface-elevated p-6"
            >
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br shadow-lg ${card.color}`}>
                <Icon className="h-5 w-5 text-text-primary" />
              </div>
              <div className="text-3xl font-bold font-display">{value}</div>
              <div className="text-sm text-text-tertiary">{card.label}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">最近用户</h2>
          <Link
            href="/admin/users"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            查看全部 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-text-muted">
                <th className="pb-3 font-medium">用户名</th>
                <th className="pb-3 font-medium">角色</th>
                <th className="pb-3 font-medium">孩子</th>
                <th className="pb-3 font-medium">计划</th>
                <th className="pb-3 font-medium">周计划</th>
                <th className="pb-3 font-medium">注册时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {recentUsers.map((user) => (
                <tr key={user.id} className="text-text-secondary">
                  <td className="py-3 font-medium text-text-primary">
                    {user.name || user.username}
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        user.role === 'ADMIN'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-surface-hover text-text-tertiary'
                      }`}
                    >
                      {user.role === 'ADMIN' ? '管理员' : '家长'}
                    </span>
                  </td>
                  <td className="py-3">{user._count.children}</td>
                  <td className="py-3">{user._count.plans}</td>
                  <td className="py-3">{user._count.weeklyPlans}</td>
                  <td className="py-3 text-text-muted">
                    {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
