'use client';

import { useRouter } from 'next/navigation';
import { Users, Baby, Map, CalendarCheck, ArrowRight } from 'lucide-react';
import { useAdminStats, useAdminUsers } from '@/lib/hooks/useAdmin';
import PageHeader from '@/components/layout/page-header';
import ContentGrid from '@/components/layout/content-grid';
import Section from '@/components/layout/section';
import StatCard from '@/components/ui/stat-card';
import DataTable from '@/components/ui/data-table';
import Spinner from '@/components/ui/spinner';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';

const statCards = [
  { key: 'userCount' as const, label: '注册用户', icon: Users, color: 'primary' as const },
  { key: 'childCount' as const, label: '孩子档案', icon: Baby, color: 'secondary' as const },
  { key: 'planCount' as const, label: '升学计划', icon: Map, color: 'info' as const },
  {
    key: 'weeklyPlanCount' as const,
    label: '周计划',
    icon: CalendarCheck,
    color: 'success' as const,
  },
];

export default function AdminPage() {
  const router = useRouter();
  const { data: stats, isLoading: statsLoading, error: statsError } = useAdminStats();
  const { data: users = [], isLoading: usersLoading, error: usersError } = useAdminUsers();

  const loading = statsLoading || usersLoading;
  const error = statsError || usersError;
  const recentUsers = users.slice(0, 10);

  if (loading) {
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
    <div className="space-y-8">
      <PageHeader
        title="数据概览"
        description="平台核心指标一览"
        actions={
          <Button variant="secondary" size="sm">
            导出报告
          </Button>
        }
      />

      <ContentGrid columns={4} gap="md">
        {statCards.map((card) => (
          <StatCard
            key={card.key}
            title={card.label}
            value={stats?.[card.key] ?? 0}
            icon={card.icon}
          />
        ))}
      </ContentGrid>

      <Section
        title="最近用户"
        actions={
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ArrowRight className="size-4" />}
            onClick={() => router.push('/admin/users')}
          >
            查看全部
          </Button>
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
            { key: 'weeklyPlans', title: '周计划', render: (user) => user._count.weeklyPlans },
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
          data={recentUsers}
          rowKey="id"
          emptyText="暂无用户"
        />
      </Section>
    </div>
  );
}
