'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, User, Lock, ArrowRight, Loader2, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '注册失败');
      } else {
        router.push('/login?registered=1');
      }
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg grid-pattern flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary">
              <Sparkles className="w-5 h-5 text-text-primary" />
            </div>
            <span className="text-2xl font-bold font-display gradient-text">趣学伴</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold font-display leading-tight mb-5 text-balance">
            开启升学
            <br />
            <span className="gradient-text">作战指挥</span>
          </h1>

          <p className="text-base text-slate-600 leading-relaxed mb-10 max-w-md">
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
                className="flex items-center gap-3 text-sm text-slate-700"
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
          <div className="rounded-xl command-panel corner-accent p-6 sm:p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold font-display mb-1.5">注册账号</h2>
              <p className="text-sm text-slate-600">创建你的趣学伴家庭账户</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
                  用户名
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface border border-black/[0.10] text-sm text-slate-900 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                  昵称（选填）
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    maxLength={20}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="如何称呼您"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface border border-black/[0.10] text-sm text-slate-900 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface border border-black/[0.10] text-sm text-slate-900 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                  确认密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface border border-black/[0.10] text-sm text-slate-900 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-error/10 border border-error/20 px-3 py-2 text-xs text-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-text-primary text-sm font-semibold hover:shadow-glow-primary transition-all duration-200 disabled:opacity-60 focus-ring"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    注册 <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-600">
              已有账号？{' '}
              <Link href="/login" className="text-primary hover:text-primary-glow transition-colors">
                直接登录
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
