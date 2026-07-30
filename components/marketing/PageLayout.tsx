'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MotionSection from '@/components/ui/MotionSection';

interface PageLayoutProps {
  children: React.ReactNode;
  ctaText?: string;
}

export default function PageLayout({ children, ctaText = '免费开始规划' }: PageLayoutProps) {
  return (
    <main className="min-h-screen">
      <Navbar />
      {children}

      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] -z-10" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <MotionSection direction="up" duration={0.7}>
            <h2 className="text-3xl sm:text-4xl font-bold font-display leading-tight mb-4">
              准备好开始规划了吗？
            </h2>
            <p className="text-text-tertiary text-base max-w-md mx-auto mb-8">
              注册登录后，即可进入后台使用完整功能，为孩子建立专属升学档案。
            </p>
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-text-primary font-semibold text-sm hover:shadow-[0_0_50px_rgba(255,45,106,0.35)] transition-all duration-300 focus-ring"
            >
              {ctaText}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </MotionSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
