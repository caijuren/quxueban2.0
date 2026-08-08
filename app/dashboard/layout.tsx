'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import { ChildrenProvider } from '@/components/dashboard/ChildrenContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
      <div className="relative min-h-screen overflow-x-hidden bg-background">
        {/* Command center ambient background */}
        <div className="animated-bg grid-pattern pointer-events-none fixed inset-0 opacity-60" />

        {/* Subtle top horizon line */}
        <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />

        <Sidebar mobileMenuOpen={mobileMenuOpen} onLinkClick={() => setMobileMenuOpen(false)} />
        <Topbar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Mobile sidebar overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <main className="relative z-0 min-h-screen pt-16 lg:pl-56">
          <div className="p-4 pb-28 sm:p-6 lg:p-8">{children}</div>
        </main>

        <MobileBottomNav />
      </div>
    </ChildrenProvider>
  );
}
