'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { ChildrenProvider } from '@/components/dashboard/ChildrenContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ChildrenProvider>
      <div className="min-h-screen bg-background">
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

        <main className="pt-16 lg:pl-64 min-h-screen">
          <div className="p-6 sm:p-8">{children}</div>
        </main>
      </div>
    </ChildrenProvider>
  );
}
