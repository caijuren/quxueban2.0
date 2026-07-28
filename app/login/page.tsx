'use client';

import { useState, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, Lock, ArrowRight, Loader2, X, QrCode } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

const REMEMBER_USERNAME_KEY = 'quxueban_remember_username';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const justRegistered = searchParams.get('registered') === '1';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showWechatModal, setShowWechatModal] = useState(false);

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
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleWechatLogin = () => {
    setShowWechatModal(true);
  };

  return (
    <div className="min-h-screen animated-bg grid-pattern flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative orbs */}
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
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold font-display gradient-text">趣学伴</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold font-display leading-tight mb-5 text-balance">
            升学作战
            <br />
            <span className="gradient-text">指挥中心</span>
          </h1>

          <p className="text-base text-slate-400 leading-relaxed mb-10 max-w-md">
            选择路线、拆解任务、追踪进度、AI 检视调整。让每一步升学准备都心中有数。
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
                className="flex items-center gap-3 text-sm text-slate-300"
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
              <h2 className="text-xl font-bold font-display mb-1.5">欢迎回来</h2>
              <p className="text-sm text-slate-500">登录后继续规划孩子的升学路线</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1.5">
                  用户名
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入用户名"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface border border-white/[0.08] text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface border border-white/[0.08] text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/10 bg-surface text-primary focus:ring-primary/50"
                  />
                  记住我
                </label>
                <Link href="/forgot-password" className="text-slate-400 hover:text-primary transition-colors">
                  忘记密码？
                </Link>
              </div>

              {justRegistered && (
                <div className="rounded-lg bg-success/10 border border-success/20 px-3 py-2 text-xs text-success">
                  注册成功，请使用新账号登录
                </div>
              )}

              {error && (
                <div className="rounded-lg bg-error/10 border border-error/20 px-3 py-2 text-xs text-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:shadow-glow-primary transition-all duration-200 disabled:opacity-60 focus-ring"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    登录 <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.06]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-[#0f0f16] text-[10px] text-slate-500 uppercase tracking-wider">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleWechatLogin}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#07C160] text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(7,193,96,0.15)] transition-all duration-200 focus-ring"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
                </svg>
                微信一键登录
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              还没有账号？{' '}
              <Link href="/register" className="text-primary hover:text-primary-glow transition-colors">
                注册账号
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showWechatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowWechatModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-sm rounded-xl command-panel corner-accent p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowWechatModal(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-slate-200 transition-colors focus-ring"
                aria-label="关闭"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#07C160]/10 flex items-center justify-center mx-auto mb-3 border border-[#07C160]/20">
                  <QrCode className="w-6 h-6 text-[#07C160]" />
                </div>
                <h3 className="text-lg font-bold font-display mb-1">微信登录即将上线</h3>
                <p className="text-xs text-slate-500">
                  正式版将支持微信扫码一键登录，当前请先使用账号密码登录。
                </p>
              </div>

              <div className="aspect-square max-w-[180px] mx-auto rounded-lg bg-white/5 border border-white/[0.06] flex items-center justify-center mb-5">
                <div className="text-center p-4">
                  <QrCode className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <span className="text-[10px] text-slate-600">微信扫码入口占位</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowWechatModal(false)}
                className="w-full py-2 rounded-lg bg-white/5 text-sm text-slate-300 hover:bg-white/10 transition-colors focus-ring"
              >
                知道了
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
