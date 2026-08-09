'use client';
import { Icon } from '@/components/ui/icon';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

import { useState, Suspense } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
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
            开启升学
            <br />
            <span className="text-primary">规划中心</span>
          </h1>

          <p className="mb-10 max-w-md text-base leading-relaxed text-text-tertiary">
            一个账号即可规划多条升学路线，追踪孩子的学习进度，及时调整备考策略。
          </p>

          <div className="space-y-3">
            {['专属家庭升学档案', '多路线对比与进度追踪', 'AI 智能诊断与风险预警'].map(
              (item, index) => (
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
              )
            )}
          </div>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rounded-card border border-border-default bg-surface p-6 shadow-card sm:p-8">
            <div className="mb-8 text-center">
              <h2 className="mb-1.5 font-display text-xl font-bold text-text-primary">注册账号</h2>
              <p className="text-sm text-text-muted">创建你的趣学伴家庭账户</p>
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
                    minLength={3}
                    maxLength={20}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="3-20 位字符"
                    leftIcon={<Icon name="User" size="sm" />}
                    className="rounded-module py-2 pl-10 placeholder:text-text-tertiary"
                  />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-text-secondary"
                >
                  昵称（选填）
                </label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    maxLength={20}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="如何称呼您"
                    leftIcon={<Icon name="UserCircle" size="sm" />}
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
                    autoComplete="new-password"
                    required
                    minLength={6}
                    maxLength={50}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="至少 6 位"
                    leftIcon={<Icon name="Lock" size="sm" />}
                    className="rounded-module py-2 pl-10 placeholder:text-text-tertiary"
                  />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-sm font-medium text-text-secondary"
                >
                  确认密码
                </label>
                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="再次输入密码"
                    leftIcon={<Icon name="Lock" size="sm" />}
                    className="rounded-module py-2 pl-10 placeholder:text-text-tertiary"
                  />
              </div>

              {error && (
                <div className="bg-error/10 border-error/20 rounded-module border px-3 py-2 text-xs text-error">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={register.isPending}
                className="hover:bg-primary/90 inline-flex w-full items-center justify-center gap-2 rounded-module bg-primary px-4 py-2 text-sm font-medium text-inverse transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {register.isPending ? (
                  <Icon name="Loader2" size="sm" animate="spin" />
                ) : (
                  <>
                    注册 <Icon name="ArrowRight" size="sm" />
                  </>
                )}
              </Button>
            </form>

            {inviteToken && (
              <div className="mb-4 rounded-module border border-border-primary bg-primary-dim px-3 py-2 text-xs text-primary">
                你正在通过家庭邀请注册，注册并登录后将自动加入对应家庭。
              </div>
            )}

            <p className="mt-6 text-center text-xs text-text-muted">
              已有账号？{' '}
              <Link
                href={
                  inviteToken ? `/login?inviteToken=${encodeURIComponent(inviteToken)}` : '/login'
                }
                className="text-primary transition-colors hover:text-primary-glow"
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
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <Icon name="Loader2" size="md" animate="spin" className="text-text-muted" />
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
