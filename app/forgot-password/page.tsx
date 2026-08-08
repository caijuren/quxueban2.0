'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const shouldReduceMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Placeholder: real implementation would call a password reset API
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitted(true);
    setLoading(false);
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
              <Sparkles className="size-5 text-text-primary" />
            </div>
            <span className="font-display text-2xl font-bold text-primary">趣学伴</span>
          </div>

          <h1 className="mb-5 text-balance font-display text-4xl font-bold leading-tight text-text-primary xl:text-5xl">
            忘记密码
            <br />
            <span className="text-primary">找回账户</span>
          </h1>

          <p className="mb-10 max-w-md text-base leading-relaxed text-text-tertiary">
            输入注册时使用的邮箱，我们会发送密码重置链接。如果暂未绑定邮箱，请联系管理员处理。
          </p>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rounded-card border border-border-default bg-surface p-6 shadow-card sm:p-8">
            <div className="mb-8 text-center">
              <h2 className="mb-1.5 font-display text-xl font-bold text-text-primary">重置密码</h2>
              <p className="text-sm text-text-muted">我们将发送重置链接到你的邮箱</p>
            </div>

            {submitted ? (
              <div className="space-y-4 text-center">
                <div className="bg-success/10 border-success/20 mx-auto flex size-12 items-center justify-center rounded-module border">
                  <CheckCircle2 className="size-6 text-success" />
                </div>
                <p className="text-sm text-text-secondary">如果该邮箱已注册，重置链接已发送。</p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-primary transition-colors hover:text-primary-glow"
                >
                  <ArrowLeft className="size-4" /> 返回登录
                </Link>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-text-secondary"
                  >
                    邮箱
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="请输入注册邮箱"
                      className="w-full rounded-module border border-border-default bg-surface py-2 pl-10 pr-4 text-sm text-text-primary transition-colors placeholder:text-text-tertiary focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-module bg-primary px-4 py-2 text-sm font-medium text-inverse transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? '发送中...' : '发送重置链接'}
                </button>

                <p className="text-center text-xs text-text-muted">
                  想起密码了？{' '}
                  <Link
                    href="/login"
                    className="text-primary transition-colors hover:text-primary-glow"
                  >
                    返回登录
                  </Link>
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
