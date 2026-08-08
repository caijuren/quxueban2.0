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

      <section className="relative overflow-hidden border-t border-border-subtle px-4 py-20 sm:px-6 lg:px-8">
        <div className="bg-primary/10 absolute left-1/2 top-1/2 -z-10 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <MotionSection direction="up" duration={0.7}>
            <h2 className="mb-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
              准备好开始规划了吗？
            </h2>
            <p className="mx-auto mb-8 max-w-md text-base text-text-tertiary">
              注册登录后，即可进入后台使用完整功能，为孩子建立专属升学档案。
            </p>
            <Link
              href="/login"
              className="hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-text-primary transition-colors"
            >
              {ctaText}
              <ArrowRight className="size-4" />
            </Link>
          </MotionSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
