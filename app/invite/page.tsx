'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Users, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-card bg-surface border border-border-default shadow-card p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-module bg-primary-dim flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold font-display text-text-primary">家庭邀请</h1>
          <p className="text-sm text-text-muted mt-1">趣学伴 · 家庭学习规划</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8 text-text-muted">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            加载邀请信息...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-module bg-error/10 border border-error/20 p-4 text-center">
            <AlertCircle className="w-6 h-6 text-error mx-auto mb-2" />
            <p className="text-sm text-error">{error}</p>
            <Link
              href="/login"
              className="inline-block mt-4 text-sm text-primary hover:text-primary-glow"
            >
              返回登录
            </Link>
          </div>
        )}

        {!loading && invite && (
          <div className="space-y-5">
            <div className="rounded-module bg-surface border border-border-default p-4 text-center">
              <p className="text-sm text-text-secondary mb-1">你收到了来自家庭的邀请</p>
              <p className="text-lg font-bold text-text-primary">{invite.family.name}</p>
              <p className="text-xs text-text-muted mt-1">
                邀请身份：{roleLabel[invite.role] || invite.role}
              </p>
            </div>

            <div className="flex items-start gap-3 text-xs text-text-muted bg-success/10 border border-success/20 rounded-module p-3">
              <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <p>
                点击下方按钮登录或注册账号，接受邀请后即可共同管理孩子的学习。
                <br />
                链接有效期至 {new Date(invite.expiresAt).toLocaleString('zh-CN')}。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href={`/login?inviteToken=${token}`}
                className="inline-flex items-center justify-center px-4 py-2 rounded-module bg-surface-hover text-text-secondary text-sm hover:bg-surface-highlight transition-colors"
              >
                登录并加入
              </Link>
              <Link
                href={`/register?inviteToken=${token}`}
                className="inline-flex items-center justify-center px-4 py-2 rounded-module bg-primary text-text-primary text-sm hover:bg-primary/90 transition-colors"
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
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-card bg-surface border border-border-default shadow-card p-6 text-center">
          <Loader2 className="w-5 h-5 animate-spin mx-auto text-text-muted" />
          <p className="text-sm text-text-muted mt-2">加载中...</p>
        </div>
      </div>
    }>
      <InvitePageContent />
    </Suspense>
  );
}
