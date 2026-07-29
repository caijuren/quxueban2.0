'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import { ChildrenProvider } from '@/components/dashboard/ChildrenContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <ChildrenProvider>
      <div className="min-h-screen bg-background relative overflow-x-hidden">
        {/* Command center ambient background */}
        <div className="fixed inset-0 pointer-events-none animated-bg grid-pattern opacity-60" />

        {/* Subtle top horizon line */}
        <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent pointer-events-none z-50" />

        <Sidebar
          mobileMenuOpen={mobileMenuOpen}
          onLinkClick={() => setMobileMenuOpen(false)}
        />
        <Topbar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Mobile sidebar overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <main className="pt-16 lg:pt-[70px] lg:pl-64 min-h-screen relative z-0">
          <div className="p-4 sm:p-6 lg:p-8 pb-28 lg:pb-8">{children}</div>
        </main>

        <MobileBottomNav />
      </div>
    </ChildrenProvider>
  );
}
