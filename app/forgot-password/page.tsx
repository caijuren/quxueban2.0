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
            忘记密码
            <br />
            <span className="text-primary">找回账户</span>
          </h1>

          <p className="text-base text-text-tertiary leading-relaxed mb-10 max-w-md">
            输入注册时使用的邮箱，我们会发送密码重置链接。如果暂未绑定邮箱，请联系管理员处理。
          </p>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1 ]}}
        >
          <div className="rounded-card bg-surface border border-border-default shadow-card p-6 sm:p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold font-display mb-1.5 text-text-primary">重置密码</h2>
              <p className="text-sm text-text-muted">我们将发送重置链接到你的邮箱</p>
            </div>

            {submitted ? (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-module bg-success/10 flex items-center justify-center mx-auto border border-success/20">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <p className="text-sm text-text-secondary">如果该邮箱已注册，重置链接已发送。</p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-glow transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> 返回登录
                </Link>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
                    邮箱
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="请输入注册邮箱"
                      className="w-full pl-10 pr-4 py-2 rounded-module border border-border-default bg-surface text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-module bg-primary text-text-primary text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-not-allowed"
                >
                  {loading ? '发送中...' : '发送重置链接'}
                </button>

                <p className="text-center text-xs text-text-muted">
                  想起密码了？{' '}
                  <Link href="/login" className="text-primary hover:text-primary-glow transition-colors">
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
