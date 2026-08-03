'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import {
  User,
  Bell,
  Palette,
  Users,
  Shield,
  HelpCircle,
  Loader2,
  Settings,
  Target,
  Sparkles,
} from 'lucide-react';
import { UserWithSettings, applySettingsToDocument } from '@/lib/settings';
import { useUser, useUpdateUser } from '@/lib/hooks/useUser';
import AccountSection from '@/components/settings/AccountSection';
import NotificationSection from '@/components/settings/NotificationSection';
import AppearanceSection from '@/components/settings/AppearanceSection';
import ChildrenSection from '@/components/settings/ChildrenSection';
import DataPrivacySection from '@/components/settings/DataPrivacySection';
import HelpSection from '@/components/settings/HelpSection';
import CapabilitySection from '@/components/settings/CapabilitySection';
import AiConfigSection from '@/components/settings/AiConfigSection';

const ALL_CATEGORIES = [
  { id: 'account', label: '账号与安全', icon: Shield, adminOnly: false },
  { id: 'notifications', label: '消息通知', icon: Bell, adminOnly: false },
  { id: 'appearance', label: '界面偏好', icon: Palette, adminOnly: false },
  { id: 'children', label: '孩子管理', icon: Users, adminOnly: false },
  { id: 'capabilities', label: '能力模型', icon: Target, adminOnly: false },
  { id: 'ai', label: 'AI 配置', icon: Sparkles, adminOnly: true },
  { id: 'data', label: '数据与隐私', icon: User, adminOnly: false },
  { id: 'help', label: '帮助与关于', icon: HelpCircle, adminOnly: false },
];

function SettingsPageInner() {
  const shouldReduceMotion = useReducedMotion();
  const searchParams = useSearchParams();
  const { data: user, isLoading: loading, error: queryError } = useUser();
  const updateUser = useUpdateUser();
  const [activeCategory, setActiveCategory] = useState(() => {
    const tab = searchParams.get('tab');
    return ALL_CATEGORIES.some((c) => c.id === tab) ? tab! : 'account';
  });

  const categories = useMemo(() => {
    if (!user) return ALL_CATEGORIES;
    const isAdmin = user.role === 'ADMIN';
    return ALL_CATEGORIES.filter((c) => !c.adminOnly || isAdmin);
  }, [user]);

  useEffect(() => {
    if (user?.settings) {
      applySettingsToDocument(user.settings);
    }
  }, [user?.settings]);

  useEffect(() => {
    if (!user) return;
    const visibleIds = new Set(categories.map((c) => c.id));
    if (!visibleIds.has(activeCategory)) {
      setActiveCategory('account');
    }
  }, [categories, activeCategory, user]);

  const handleUpdate = async (updates: Partial<UserWithSettings>) => {
    const data = await updateUser.mutateAsync(updates);
    applySettingsToDocument(data.settings);
  };

  const handleSettingsUpdate = async (
    settingUpdates: Partial<UserWithSettings['settings']>
  ) => {
    return handleUpdate(settingUpdates as Partial<UserWithSettings>);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (queryError || !user) {
    return (
      <div className="rounded-2xl border border-error/20 bg-error/10 p-6 text-error">
        {queryError instanceof Error ? queryError.message : '加载失败'}
      </div>
    );
  }

  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-7rem)] lg:h-[calc(100vh-5rem)]">
      <motion.aside
        initial={shouldReduceMotion ? false : { opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="shrink-0 lg:w-52 xl:w-60"
      >
        <div className="flex items-center gap-2 mb-3 px-1">
          <Settings className="w-4 h-4 text-accent" />
          <h1 className="text-lg font-bold font-display">系统设置</h1>
        </div>
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text-tertiary hover:bg-surface-elevated hover:text-text-secondary'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                <span className="text-xs">{cat.label}</span>
              </button>
            );
          })}
        </nav>
      </motion.aside>

      <motion.main
        key={activeCategory}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex-1 min-w-0 overflow-y-auto pr-1 pb-8"
      >
        {activeCategory === 'account' && (
          <AccountSection user={user} onUpdate={handleUpdate} />
        )}
        {activeCategory === 'notifications' && user.settings && (
          <NotificationSection settings={user.settings} onUpdate={handleSettingsUpdate} />
        )}
        {activeCategory === 'appearance' && user.settings && (
          <AppearanceSection settings={user.settings} onUpdate={handleSettingsUpdate} />
        )}
        {activeCategory === 'children' && <ChildrenSection />}
        {activeCategory === 'capabilities' && <CapabilitySection />}
        {activeCategory === 'ai' && isAdmin && <AiConfigSection />}
        {activeCategory === 'data' && <DataPrivacySection />}
        {activeCategory === 'help' && <HelpSection />}
      </motion.main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SettingsPageInner />
    </Suspense>
  );
}
