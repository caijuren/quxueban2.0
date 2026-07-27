'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
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
      <div className="min-h-screen bg-background relative">
        {/* Subtle command center background */}
        <div className="fixed inset-0 pointer-events-none animated-bg grid-pattern opacity-40" />
        <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none z-50" />

        <Sidebar
          mobileMenuOpen={mobileMenuOpen}
          onLinkClick={() => setMobileMenuOpen(false)}
        />
        <Topbar onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Mobile sidebar overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <main className="pt-16 lg:pl-64 min-h-screen relative z-0">
          <div className="p-5 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </ChildrenProvider>
  );
}
