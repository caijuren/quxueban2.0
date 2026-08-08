'use client';
import { Icon } from '@/components/ui/icon';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface InviteInfo {
  family: { id: string; name: string };
  role: string;
  expiresAt: string;
}

function InvitePageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invite, setInvite] = useState<InviteInfo | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError('邀请链接不完整');
      return;
    }

    fetch(`/api/family/invites/${token}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || '邀请链接已失效');
        }
        return res.json();
      })
      .then((data) => {
        setInvite(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  const roleLabel: Record<string, string> = {
    ADMIN: '管理员',
    MEMBER: '成员',
    VIEWER: '仅查看',
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-card border border-border-default bg-surface p-6 shadow-card sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-module bg-primary-dim">
            <Icon name="Users" size="lg" className="text-primary" />
          </div>
          <h1 className="font-display text-xl font-bold text-text-primary">家庭邀请</h1>
          <p className="mt-1 text-sm text-text-muted">趣学伴 · 家庭学习规划</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8 text-text-muted">
            <Icon name="Loader2" size="md" animate="spin" className="mr-2" />
            加载邀请信息...
          </div>
        )}

        {!loading && error && (
          <div className="bg-error/10 border-error/20 rounded-module border p-4 text-center">
            <Icon name="AlertCircle" size="lg" className="mx-auto mb-2 text-error" />
            <p className="text-sm text-error">{error}</p>
            <Link
              href="/login"
              className="mt-4 inline-block text-sm text-primary hover:text-primary-glow"
            >
              返回登录
            </Link>
          </div>
        )}

        {!loading && invite && (
          <div className="space-y-5">
            <div className="rounded-module border border-border-default bg-surface p-4 text-center">
              <p className="mb-1 text-sm text-text-secondary">你收到了来自家庭的邀请</p>
              <p className="text-lg font-bold text-text-primary">{invite.family.name}</p>
              <p className="mt-1 text-xs text-text-muted">
                邀请身份：{roleLabel[invite.role] || invite.role}
              </p>
            </div>

            <div className="bg-success/10 border-success/20 flex items-start gap-3 rounded-module border p-3 text-xs text-text-muted">
              <Icon name="CheckCircle" size="sm" className="mt-0.5 shrink-0 text-success" />
              <p>
                点击下方按钮登录或注册账号，接受邀请后即可共同管理孩子的学习。
                <br />
                链接有效期至 {new Date(invite.expiresAt).toLocaleString('zh-CN')}。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href={`/login?inviteToken=${token}`}
                className="inline-flex items-center justify-center rounded-module bg-surface-hover px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-highlight"
              >
                登录并加入
              </Link>
              <Link
                href={`/register?inviteToken=${token}`}
                className="hover:bg-primary/90 inline-flex items-center justify-center rounded-module bg-primary px-4 py-2 text-sm text-text-primary transition-colors"
              >
                注册并加入
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="w-full max-w-md rounded-card border border-border-default bg-surface p-6 text-center shadow-card">
            <Icon name="Loader2" size="md" animate="spin" className="mx-auto text-text-muted" />
            <p className="mt-2 text-sm text-text-muted">加载中...</p>
          </div>
        </div>
      }
    >
      <InvitePageContent />
    </Suspense>
  );
}
