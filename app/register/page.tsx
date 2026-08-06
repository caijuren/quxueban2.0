'use client';

import { useState, Suspense } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, User, Lock, ArrowRight, Loader2, UserCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRegister } from '@/lib/hooks/useAuth';

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get('inviteToken');
  const shouldReduceMotion = useReducedMotion();

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const register = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (password.length < 6) {
      setError('密码长度至少为 6 位');
      return;
    }

    try {
      await register.mutateAsync({ username, password, name, inviteToken: inviteToken ?? null });
      const loginUrl = inviteToken
        ? `/login?registered=1&inviteToken=${encodeURIComponent(inviteToken)}`
        : '/login?registered=1';
      router.push(loginUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
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
            开启升学
            <br />
            <span className="text-primary">规划中心</span>
          </h1>

          <p className="text-base text-text-tertiary leading-relaxed mb-10 max-w-md">
            一个账号即可规划多条升学路线，追踪孩子的学习进度，及时调整备考策略。
          </p>

          <div className="space-y-3">
            {[
              '专属家庭升学档案',
              '多路线对比与进度追踪',
              'AI 智能诊断与风险预警',
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
              <h2 className="text-xl font-bold font-display mb-1.5 text-text-primary">注册账号</h2>
              <p className="text-sm text-text-muted">创建你的趣学伴家庭账户</p>
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
                    minLength={3}
                    maxLength={20}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="3-20 位字符"
                    className="w-full pl-10 pr-4 py-2 rounded-module border border-border-default bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1.5">
                  昵称（选填）
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    maxLength={20}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="如何称呼您"
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
                    autoComplete="new-password"
                    required
                    minLength={6}
                    maxLength={50}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="至少 6 位"
                    className="w-full pl-10 pr-4 py-2 rounded-module border border-border-default bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-1.5">
                  确认密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="再次输入密码"
                    className="w-full pl-10 pr-4 py-2 rounded-module border border-border-default bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-module bg-error/10 border border-error/20 px-3 py-2 text-xs text-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={register.isPending}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-module bg-primary text-text-primary text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-not-allowed"
              >
                {register.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    注册 <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {inviteToken && (
              <div className="mb-4 rounded-module bg-primary-dim border border-border-primary px-3 py-2 text-xs text-primary">
                你正在通过家庭邀请注册，注册并登录后将自动加入对应家庭。
              </div>
            )}

            <p className="mt-6 text-center text-xs text-text-muted">
              已有账号？{' '}
              <Link
                href={inviteToken ? `/login?inviteToken=${encodeURIComponent(inviteToken)}` : '/login'}
                className="text-primary hover:text-primary-glow transition-colors"
              >
                直接登录
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Loader2 className="w-5 h-5 animate-spin text-text-muted" />
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
