'use client';

import { useState } from 'react';
import { Palette, Type, Layout, Eye, Home, Users, Save, Loader2 } from 'lucide-react';
import { UserSettings, applySettingsToDocument } from '@/lib/settings';
import SettingsSection from './SettingsSection';

interface AppearanceSectionProps {
  settings: UserSettings;
  onUpdate: (updates: Partial<UserSettings>) => Promise<void>;
}

const THEMES = [
  {
    id: 'dark-tech',
    label: '暗黑科技',
    primary: '#ff2d6a',
    secondary: '#8b5cf6',
  },
  {
    id: 'rose-pink',
    label: '玫瑰粉',
    primary: '#ec4899',
    secondary: '#f43f5e',
  },
];

const FONT_SIZES = [
  { id: 'normal', label: '标准' },
  { id: 'large', label: '大' },
  { id: 'xlarge', label: '超大' },
];

const DENSITIES = [
  { id: 'comfortable', label: '舒适' },
  { id: 'compact', label: '紧凑' },
];

const LANDING_PAGES = [
  { id: 'dashboard', label: '作战指挥中心', icon: Home },
  { id: 'weekly', label: '周任务', icon: Layout },
  { id: 'alerts', label: '预警提醒', icon: Eye },
];

const CHILD_MODES = [
  { id: 'last', label: '自动选中上次孩子' },
  { id: 'ask', label: '每次手动选择' },
];

export default function AppearanceSection({
  settings,
  onUpdate,
}: AppearanceSectionProps) {
  const [theme, setTheme] = useState(settings.theme);
  const [fontSize, setFontSize] = useState(settings.fontSize);
  const [density, setDensity] = useState(settings.density);
  const [reducedMotion, setReducedMotion] = useState(settings.reducedMotion);
  const [defaultLandingPage, setDefaultLandingPage] = useState(settings.defaultLandingPage);
  const [defaultChildMode, setDefaultChildMode] = useState(settings.defaultChildMode);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const updates = {
      theme,
      fontSize,
      density,
      reducedMotion,
      defaultLandingPage,
      defaultChildMode,
    };
    try {
      await onUpdate(updates);
      applySettingsToDocument({ ...settings, ...updates });
      setMessage({ type: 'success', text: '界面偏好已保存' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : '保存失败',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <SettingsSection title="界面偏好" description="主题、显示与默认行为">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-3.5 h-3.5 text-primary" />
              <p className="text-xs font-medium text-slate-200">主题风格</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as typeof theme)}
                  className={`relative flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${
                    theme === t.id
                      ? 'bg-white/[0.06] border-primary/40'
                      : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-md shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${t.primary} 0%, ${t.secondary} 100%)`,
                    }}
                  />
                  <p className="text-xs font-medium text-slate-200">{t.label}</p>
                  {theme === t.id && (
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-white/[0.06]" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Type className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs font-medium text-slate-200">字体大小</p>
              </div>
              <div className="flex gap-1.5">
                {FONT_SIZES.map((fs) => (
                  <button
                    key={fs.id}
                    onClick={() => setFontSize(fs.id as typeof fontSize)}
                    className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      fontSize === fs.id
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'bg-white/5 text-slate-400 border border-white/[0.06] hover:bg-white/[0.08]'
                    }`}
                  >
                    {fs.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Layout className="w-3.5 h-3.5 text-secondary" />
                <p className="text-xs font-medium text-slate-200">信息密度</p>
              </div>
              <div className="flex gap-1.5">
                {DENSITIES.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDensity(d.id as typeof density)}
                    className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      density === d.id
                        ? 'bg-secondary/10 text-secondary border border-secondary/20'
                        : 'bg-white/5 text-slate-400 border border-white/[0.06] hover:bg-white/[0.08]'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-accent" />
              <p className="text-xs font-medium text-slate-200">减少动效</p>
            </div>
            <button
              onClick={() => setReducedMotion((v) => !v)}
              className={`relative w-9 h-5 rounded-full transition-colors ${
                reducedMotion ? 'bg-primary' : 'bg-white/10'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  reducedMotion ? 'translate-x-4' : ''
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-white/[0.06]" />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Home className="w-3.5 h-3.5 text-primary" />
              <p className="text-xs font-medium text-slate-200">登录后默认进入</p>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {LANDING_PAGES.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setDefaultLandingPage(page.id as typeof defaultLandingPage)}
                  className={`flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs transition-colors ${
                    defaultLandingPage === page.id
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-white/5 text-slate-400 border border-white/[0.06] hover:bg-white/[0.08]'
                  }`}
                >
                  <page.icon className="w-3.5 h-3.5" />
                  <span className="truncate">{page.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-3.5 h-3.5 text-secondary" />
              <p className="text-sm font-medium text-slate-200">默认孩子选择</p>
            </div>
            <div className="flex gap-1.5">
              {CHILD_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setDefaultChildMode(mode.id as typeof defaultChildMode)}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    defaultChildMode === mode.id
                      ? 'bg-secondary/10 text-secondary border border-secondary/20'
                      : 'bg-white/5 text-slate-400 border border-white/[0.06] hover:bg-white/[0.08]'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SettingsSection>

      {message && (
        <div
          className={`text-xs px-3 py-1.5 rounded-lg ${
            message.type === 'success'
              ? 'bg-success/10 text-success border border-success/20'
              : 'bg-danger/10 text-danger border border-danger/20'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-xs font-medium hover:shadow-glow-primary transition-all disabled:opacity-70"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          保存界面偏好
        </button>
      </div>
    </div>
  );
}
