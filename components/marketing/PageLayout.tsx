'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  ctaText?: string;
}

export default function PageLayout({ children, ctaText = '免费开始规划' }: PageLayoutProps) {
  return (
    <main className="min-h-screen">
      <Navbar />
      {children}

      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold font-display leading-tight mb-6">
              准备好开始规划了吗？
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
              注册登录后，即可进入后台使用完整功能，为孩子建立专属升学档案。
            </p>
            <Link href="/login">
              <button className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-primary text-white font-semibold text-lg hover:shadow-[0_0_50px_rgba(255,45,106,0.4)] transition-all duration-300">
                {ctaText}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
