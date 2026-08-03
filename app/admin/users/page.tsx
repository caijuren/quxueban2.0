'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Loader2, Search } from 'lucide-react';
import { useAdminUsers } from '@/lib/hooks/useAdmin';

export default function AdminUsersPage() {
  const { data: users = [], isLoading: loading, error: queryError } = useAdminUsers();
  const [query, setQuery] = useState('');

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(query.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="rounded-2xl border border-error/20 bg-error/10 p-6 text-error">
        {queryError instanceof Error ? queryError.message : '加载失败'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">用户管理</h1>
        <p className="text-text-tertiary">查看平台注册用户及其数据</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索用户名或姓名"
          className="w-full rounded-lg border border-border-default bg-surface py-3 pl-11 pr-4 text-text-primary placeholder:text-text-tertiary focus:border-primary focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-elevated">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-highlight">
            <tr className="text-text-muted">
              <th className="px-6 py-3 font-medium">用户名</th>
              <th className="px-6 py-3 font-medium">角色</th>
              <th className="px-6 py-3 font-medium">孩子</th>
              <th className="px-6 py-3 font-medium">计划</th>
              <th className="px-6 py-3 font-medium">周计划</th>
              <th className="px-6 py-3 font-medium">注册时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {filtered.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="text-text-secondary"
              >
                <td className="px-6 py-4 font-medium text-text-primary">
                  {user.name || user.username}
                  <div className="text-xs text-text-muted">{user.username}</div>
                </td>
                <td className="px-6 py-4">
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
                <td className="px-6 py-4">{user._count.children}</td>
                <td className="px-6 py-4">{user._count.plans}</td>
                <td className="px-6 py-4">{user._count.weeklyPlans}</td>
                <td className="px-6 py-4 text-text-muted">
                  {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-text-muted">没有找到用户</div>
        )}
      </div>
    </div>
  );
}
