'use client';

import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, ArrowRight, Chrome } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen animated-bg grid-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden lg:block"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold font-display gradient-text">趣学伴</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-extrabold font-display leading-tight mb-6">
            开启你的
            <br />
            <span className="gradient-text">上海升学战略规划</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-8">
            选择路线、拆解任务、追踪进度、AI 检视调整。
            <br />
            让每一步升学准备都心中有数。
          </p>

          <div className="space-y-4">
            {[
              '三公 / 摇号 / 直升 多路线对比',
              '年级 → 学期 → 月 → 周 任务拆解',
              'AI 智能诊断进度并预警风险',
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-3 text-slate-300"
              >
                <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-success" />
                </div>
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right side - Login form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="rounded-3xl glass p-8 sm:p-10 border border-white/10" style={{ boxShadow: '0 0 60px rgba(139, 92, 246, 0.1)' }}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold font-display mb-2">欢迎回来</h2>
              <p className="text-slate-400 text-sm">登录后继续规划孩子的升学路线</p>
            </div>

            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 font-medium hover:bg-white/10 transition-all duration-300 mb-6">
              <Chrome className="w-5 h-5 text-primary" />
              使用微信扫码登录
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#12121c] text-slate-500">或使用邮箱</span>
              </div>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">邮箱</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    placeholder="请输入邮箱"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">密码</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    placeholder="请输入密码"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-surface text-primary focus:ring-primary" />
                  记住我
                </label>
                <span className="text-primary hover:text-primary-glow cursor-pointer">忘记密码？</span>
              </div>

              <Link href="/dashboard">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] transition-all duration-300">
                  登录
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </form>

            <p className="text-center text-sm text-slate-400 mt-6">
              还没有账号？<span className="text-primary hover:text-primary-glow cursor-pointer">立即注册</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
