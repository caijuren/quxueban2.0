'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  User,
  Bell,
  Palette,
  Users,
  Shield,
  HelpCircle,
  ChevronDown,
  Loader2,
  Library,
} from 'lucide-react';
import { UserWithSettings, applySettingsToDocument } from '@/lib/settings';
import AccountSection from '@/components/settings/AccountSection';
import NotificationSection from '@/components/settings/NotificationSection';
import AppearanceSection from '@/components/settings/AppearanceSection';
import ChildrenSection from '@/components/settings/ChildrenSection';
import DataPrivacySection from '@/components/settings/DataPrivacySection';
import HelpSection from '@/components/settings/HelpSection';
import TaskLibrarySection from '@/components/settings/TaskLibrarySection';

const CATEGORIES = [
  { id: 'account', label: '账号与安全', icon: Shield },
  { id: 'notifications', label: '消息通知', icon: Bell },
  { id: 'appearance', label: '界面偏好', icon: Palette },
  { id: 'children', label: '孩子管理', icon: Users },
  { id: 'library', label: '任务库', icon: Library },
  { id: 'data', label: '数据与隐私', icon: User },
  { id: 'help', label: '帮助与关于', icon: HelpCircle },
];

async function fetchUser() {
  const res = await fetch('/api/user/me');
  if (!res.ok) throw new Error('加载失败');
  return res.json() as Promise<UserWithSettings>;
}

export default function SettingsPage() {
  const shouldReduceMotion = useReducedMotion();
  const [user, setUser] = useState<UserWithSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('account');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchUser()
      .then((data) => {
        if (cancelled) return;
        setUser(data);
        applySettingsToDocument(data.settings);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : '加载失败');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleUpdate = async (updates: Partial<UserWithSettings>) => {
    const res = await fetch('/api/user/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || '保存失败');
    setUser(data);
    applySettingsToDocument(data.settings);
    return data;
  };

  const handleSettingsUpdate = async (
    settingUpdates: Partial<UserWithSettings['settings']>
  ) => {
    return handleUpdate(settingUpdates as Partial<UserWithSettings>);
  };

  const activeCategoryInfo =
    CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="rounded-2xl border border-error/20 bg-error/10 p-6 text-error">
        {error || '加载失败'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display mb-1">
            系统设置
          </h1>
          <p className="text-sm text-slate-600">管理账号、通知和界面偏好</p>
        </div>

        <div ref={dropdownRef} className="relative">
          <button
            id="settings-category-dropdown"
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg glass border border-black/[0.10] text-sm font-medium text-slate-800 hover:bg-black/[0.04] transition-colors focus-ring"
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            <activeCategoryInfo.icon className="w-4 h-4 text-primary" />
            <span className="gradient-text font-semibold">
              {activeCategoryInfo.label}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-600 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl glass border border-black/[0.10] overflow-hidden z-50 shadow-2xl">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-slate-700 hover:bg-black/5'
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>

      <div key={activeCategory} className="space-y-4">
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
        {activeCategory === 'library' && <TaskLibrarySection />}
        {activeCategory === 'data' && <DataPrivacySection />}
        {activeCategory === 'help' && <HelpSection />}
      </div>
    </div>
  );
}
