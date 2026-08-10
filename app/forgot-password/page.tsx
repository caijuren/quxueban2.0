'use client';
import { Icon } from '@/components/ui/icon';

import { motion, useReducedMotion } from 'framer-motion';

import Link from 'next/link';

export default function ForgotPasswordPage() {
  const shouldReduceMotion = useReducedMotion();

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
              <p className="text-sm text-text-muted">通过管理员协助恢复账户访问</p>
            </div>

            <div className="space-y-4">
              <div className="rounded-module border border-warning/20 bg-warning/10 px-4 py-3 text-sm leading-relaxed text-warning">
                密码重置邮件服务暂未开放。请联系管理员处理账号密码问题。
              </div>
              <p className="text-center text-xs text-text-muted">
                想起密码了？{' '}
                <Link href="/login" className="text-primary transition-colors hover:text-primary-glow">
                  返回登录
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
