'use client';

import { useState } from 'react';
import { useAdminUsers } from '@/lib/hooks/useAdmin';
import PageHeader from '@/components/layout/page-header';
import Section from '@/components/layout/section';
import DataTable from '@/components/ui/data-table';
import SearchInput from '@/components/ui/search-input';
import Spinner from '@/components/ui/spinner';
import Alert from '@/components/ui/alert';
import Badge from '@/components/ui/badge';

export default function AdminUsersPage() {
  const { data: users = [], isLoading, error } = useAdminUsers();
  const [query, setQuery] = useState('');

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(query.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert type="error" title="加载失败">
        {error instanceof Error ? error.message : '加载失败'}
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="用户管理" description="查看平台注册用户及其数据" />

      <Section
        title="用户列表"
        description={`共 ${filtered.length} 位用户`}
        actions={
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            placeholder="搜索用户名或姓名"
            className="w-full sm:w-64"
          />
        }
      >
        <DataTable
          columns={[
            {
              key: 'name',
              title: '用户名',
              render: (user) => (
                <div>
                  <p className="font-medium text-text-primary">{user.name || user.username}</p>
                  {user.name && <p className="text-xs text-text-muted">{user.username}</p>}
                </div>
              ),
            },
            {
              key: 'role',
              title: '角色',
              render: (user) => (
                <Badge variant={user.role === 'ADMIN' ? 'primary' : 'default'}>
                  {user.role === 'ADMIN' ? '管理员' : '家长'}
                </Badge>
              ),
            },
            { key: 'children', title: '孩子', render: (user) => user._count.children },
            { key: 'plans', title: '计划', render: (user) => user._count.plans },
            {
              key: 'weeklyPlans',
              title: '周计划',
              render: (user) => user._count.weeklyPlans,
            },
            {
              key: 'createdAt',
              title: '注册时间',
              render: (user) => (
                <span className="text-text-muted">
                  {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                </span>
              ),
            },
          ]}
          data={filtered}
          rowKey="id"
          emptyText="没有找到用户"
        />
      </Section>
    </div>
  );
}
