'use client';
import { Icon } from '@/components/ui/icon';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { apiGet } from '@/lib/apiClient';
import { UserWithSettings } from '@/lib/settings';

const REMEMBER_USERNAME_KEY = 'quxueban_remember_username';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const justRegistered = searchParams.get('registered') === '1';
  const inviteToken = searchParams.get('inviteToken');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedUsername = localStorage.getItem(REMEMBER_USERNAME_KEY);
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    try {
      result = await signIn('credentials', {
        username,
        password,
        redirect: false,
        callbackUrl,
      });
    } catch (err) {
      console.error('[login] signIn error:', err);
      setLoading(false);
      setError('登录请求失败，请检查网络或稍后重试');
      return;
    }

    setLoading(false);

    if (result?.error) {
      setError('用户名或密码错误');
    } else if (result?.ok) {
      if (typeof window !== 'undefined') {
        if (rememberMe) {
          localStorage.setItem(REMEMBER_USERNAME_KEY, username);
        } else {
          localStorage.removeItem(REMEMBER_USERNAME_KEY);
        }
      }

      // 如果携带邀请 token，先接受邀请
      if (inviteToken) {
        try {
          await fetch(`/api/family/invites/${inviteToken}`, { method: 'POST' });
        } catch {
          // 接受失败不影响登录流程
        }
      }

      // Apply user's default landing page only when no specific callback is requested
      if (callbackUrl === '/dashboard' || callbackUrl === '/dashboard/') {
        try {
          const user = await apiGet<UserWithSettings>('/api/user/me');
          const landing = user?.settings?.defaultLandingPage;
          const target =
            landing === 'weekly'
              ? '/dashboard/weekly'
              : landing === 'alerts'
                ? '/dashboard/alerts'
                : '/dashboard';
          router.push(target);
        } catch {
          router.push('/dashboard');
        }
      } else {
        router.push(callbackUrl);
      }
      router.refresh();
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Decorative orbs */}
      <div className="bg-primary/5 pointer-events-none absolute -left-32 top-1/4 size-64 rounded-full blur-3xl" />
      <div className="bg-primary/5 pointer-events-none absolute -right-32 bottom-1/4 size-64 rounded-full blur-3xl" />

      <div className="relative z-10 grid w-full max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block"
        >
          <div className="mb-10 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-module bg-primary">
              <Icon name="Sparkles" size="md" className="text-text-primary" />
            </div>
            <span className="font-display text-2xl font-bold text-primary">趣学伴</span>
          </div>

          <h1 className="mb-5 text-balance font-display text-4xl font-bold leading-tight text-text-primary xl:text-5xl">
            升学规划
            <br />
            <span className="text-primary">中心</span>
          </h1>

          <p className="mb-10 max-w-md text-base leading-relaxed text-text-tertiary">
            选择路线、拆解任务、追踪进度、AI 诊断调整。让每一步升学准备都心中有数。
          </p>

          <div className="space-y-3">
            {[
              '三公 / 摇号 / 直升 多路线对比',
              '年级 → 学期 → 月 → 周 任务拆解',
              'AI 智能诊断进度并预警风险',
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={shouldReduceMotion ? false : { opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 text-sm text-text-secondary"
              >
                <div className="bg-success/10 border-success/20 flex size-5 items-center justify-center rounded-full border">
                  <div className="size-1.5 rounded-full bg-success" />
                </div>
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rounded-card border border-border-default bg-surface p-6 shadow-card sm:p-8">
            <div className="mb-8 text-center">
              <h2 className="mb-1.5 font-display text-xl font-bold text-text-primary">欢迎回来</h2>
              <p className="text-sm text-text-muted">登录后继续规划孩子的升学路线</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="mb-1.5 block text-sm font-medium text-text-secondary"
                >
                  用户名
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  leftIcon={<Icon name="User" size="sm" />}
                  className="rounded-module py-2 pl-10 placeholder:text-text-tertiary"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-text-secondary"
                >
                  密码
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  leftIcon={<Icon name="Lock" size="sm" />}
                  className="rounded-module py-2 pl-10 placeholder:text-text-tertiary"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex cursor-pointer items-center gap-2 text-text-muted">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="focus:ring-primary/50 rounded border-border-default bg-surface text-primary"
                  />
                  记住我
                </label>
                <Link
                  href="/forgot-password"
                  className="text-text-tertiary transition-colors hover:text-primary"
                >
                  忘记密码？
                </Link>
              </div>

              {justRegistered && (
                <div className="bg-success/10 border-success/20 rounded-module border px-3 py-2 text-xs text-success">
                  注册成功，请使用新账号登录
                </div>
              )}

              {error && (
                <div className="bg-error/10 border-error/20 rounded-module border px-3 py-2 text-xs text-error">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                className="hover:bg-primary/90 inline-flex w-full items-center justify-center gap-2 rounded-module bg-primary px-4 py-2 text-sm font-medium text-inverse transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <Icon name="Loader2" size="sm" animate="spin" />
                ) : (
                  <>
                    登录 <Icon name="ArrowRight" size="sm" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-text-muted">
              还没有账号？{' '}
              <Link
                href="/register"
                className="text-primary transition-colors hover:text-primary-glow"
              >
                注册账号
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
