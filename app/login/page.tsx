'use client';

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, User, Lock, ArrowRight, Loader2 } from 'lucide-react';
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

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
      callbackUrl,
    });

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-module bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-text-primary" />
            </div>
            <span className="text-2xl font-bold font-display text-primary">趣学伴</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold font-display leading-tight mb-5 text-balance text-text-primary">
            升学规划
            <br />
            <span className="text-primary">中心</span>
          </h1>

          <p className="text-base text-text-tertiary leading-relaxed mb-10 max-w-md">
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
                <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center border border-success/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-success" />
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
          <div className="rounded-card bg-surface border border-border-default shadow-card p-6 sm:p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold font-display mb-1.5 text-text-primary">欢迎回来</h2>
              <p className="text-sm text-text-muted">登录后继续规划孩子的升学路线</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1.5">
                  用户名
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入用户名"
                    className="w-full pl-10 pr-4 py-2 rounded-module border border-border-default bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="w-full pl-10 pr-4 py-2 rounded-module border border-border-default bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-border-default bg-surface text-primary focus:ring-primary/50"
                  />
                  记住我
                </label>
                <Link href="/forgot-password" className="text-text-tertiary hover:text-primary transition-colors">
                  忘记密码？
                </Link>
              </div>

              {justRegistered && (
                <div className="rounded-module bg-success/10 border border-success/20 px-3 py-2 text-xs text-success">
                  注册成功，请使用新账号登录
                </div>
              )}

              {error && (
                <div className="rounded-module bg-error/10 border border-error/20 px-3 py-2 text-xs text-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-module bg-primary text-text-primary text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    登录 <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            <p className="mt-6 text-center text-xs text-text-muted">
              还没有账号？{' '}
              <Link href="/register" className="text-primary hover:text-primary-glow transition-colors">
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
