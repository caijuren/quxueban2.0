'use client';

import { useEffect, useState } from 'react';
import { Type, Layout, Eye, Home, Users, Save, Sun, Moon, Monitor } from 'lucide-react';
import { UserSettings, applySettingsToDocument, THEME_COLORS } from '@/lib/settings';
import type { Theme } from '@/lib/theme';
import SettingsSection from './SettingsSection';
import Switch from '@/components/ui/switch';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';
import FormField from '@/components/ui/form-field';

interface AppearanceSectionProps {
  settings: UserSettings;
  onUpdate: (updates: Partial<UserSettings>) => Promise<void>;
}

type Variant = Exclude<UserSettings['theme'], 'light'>;

const APPEARANCES: { id: Theme; label: string; icon: typeof Sun }[] = [
  { id: 'light', label: '浅色', icon: Sun },
  { id: 'dark', label: '深色', icon: Moon },
  { id: 'system', label: '跟随系统', icon: Monitor },
];

const VARIANTS = Object.entries(THEME_COLORS).map(([id, colors]) => ({
  id: id as Variant,
  label: id === 'dark-tech' ? '暗黑科技' : '玫瑰粉',
  primary: colors['--color-primary'],
  secondary: colors['--color-secondary'],
}));

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
  { id: 'dashboard', label: '升学规划中心', icon: Home },
  { id: 'weekly', label: '周计划', icon: Layout },
  { id: 'alerts', label: '提醒中心', icon: Eye },
];

const CHILD_MODES = [
  { id: 'last', label: '自动选中上次孩子' },
  { id: 'ask', label: '每次手动选择' },
];

export default function AppearanceSection({ settings, onUpdate }: AppearanceSectionProps) {
  const initialAppearance: Theme =
    settings.appearance ?? (settings.theme === 'light' ? 'light' : 'dark');
  const initialVariant: Variant =
    settings.theme === 'dark-tech' || settings.theme === 'rose-pink' ? settings.theme : 'dark-tech';

  const [appearance, setAppearance] = useState<Theme>(initialAppearance);
  const [variant, setVariant] = useState<Variant>(initialVariant);
  const [fontSize, setFontSize] = useState(settings.fontSize);
  const [density, setDensity] = useState(settings.density);
  const [reducedMotion, setReducedMotion] = useState(settings.reducedMotion);
  const [defaultLandingPage, setDefaultLandingPage] = useState(settings.defaultLandingPage);
  const [defaultChildMode, setDefaultChildMode] = useState(settings.defaultChildMode);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Live preview while the user is choosing theme options.
  useEffect(() => {
    applySettingsToDocument({ ...settings, appearance, theme: variant });
  }, [appearance, variant, settings]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const updates = {
      appearance,
      theme: variant,
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
    <div className="space-y-3">
      <SettingsSection title="界面偏好" description="主题、显示与默认行为">
        <div className="space-y-4">
          <FormField label="外观主题">
            <div className="grid grid-cols-3 gap-2">
              {APPEARANCES.map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  size="sm"
                  variant={appearance === id ? 'primary' : 'secondary'}
                  onClick={() => setAppearance(id)}
                  leftIcon={<Icon className="size-4" />}
                >
                  {label}
                </Button>
              ))}
            </div>
          </FormField>

          {appearance !== 'light' && (
            <FormField label="深色风格">
              <div className="grid grid-cols-2 gap-2">
                {VARIANTS.map((v) => (
                  <Button
                    key={v.id}
                    size="sm"
                    variant={variant === v.id ? 'primary' : 'secondary'}
                    onClick={() => setVariant(v.id)}
                    leftIcon={
                      <div
                        className="size-4 rounded-sm"
                        style={{
                          background: `linear-gradient(135deg, ${v.primary} 0%, ${v.secondary} 100%)`,
                        }}
                      />
                    }
                  >
                    {v.label}
                  </Button>
                ))}
              </div>
            </FormField>
          )}

          <div className="h-px bg-border-subtle" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Type className="size-3.5 text-primary" />
                <p className="text-xs font-medium text-text-secondary">字体大小</p>
              </div>
              <div className="flex gap-1.5">
                {FONT_SIZES.map((fs) => (
                  <button
                    key={fs.id}
                    onClick={() => setFontSize(fs.id as typeof fontSize)}
                    className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
                      fontSize === fs.id
                        ? 'border-primary/20 bg-primary/[0.08] border text-primary'
                        : 'border border-border-subtle bg-surface-elevated text-text-tertiary hover:bg-surface-highlight'
                    }`}
                  >
                    {fs.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <Layout className="size-3.5 text-secondary" />
                <p className="text-xs font-medium text-text-secondary">信息密度</p>
              </div>
              <div className="flex gap-1.5">
                {DENSITIES.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDensity(d.id as typeof density)}
                    className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
                      density === d.id
                        ? 'border-secondary/20 bg-secondary/10 border text-secondary'
                        : 'border border-border-subtle bg-surface-elevated text-text-tertiary hover:bg-surface-highlight'
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
              <Eye className="size-3.5 text-accent" />
              <p className="text-xs font-medium text-text-secondary">减少动效</p>
            </div>
            <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} size="sm" />
          </div>

          <div className="h-px bg-border-subtle" />

          <div>
            <div className="mb-2 flex items-center gap-2">
              <Home className="size-3.5 text-primary" />
              <p className="text-xs font-medium text-text-secondary">登录后默认进入</p>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {LANDING_PAGES.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setDefaultLandingPage(page.id as typeof defaultLandingPage)}
                  className={`flex items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs transition-colors ${
                    defaultLandingPage === page.id
                      ? 'border-primary/20 bg-primary/[0.08] border text-primary'
                      : 'border border-border-subtle bg-surface-elevated text-text-tertiary hover:bg-surface-highlight'
                  }`}
                >
                  <page.icon className="size-3.5" />
                  <span className="truncate">{page.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <Users className="size-3.5 text-secondary" />
              <p className="text-xs font-medium text-text-secondary">默认孩子选择</p>
            </div>
            <div className="flex gap-1.5">
              {CHILD_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setDefaultChildMode(mode.id as typeof defaultChildMode)}
                  className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
                    defaultChildMode === mode.id
                      ? 'border-secondary/20 bg-secondary/10 border text-secondary'
                      : 'border border-border-subtle bg-surface-elevated text-text-tertiary hover:bg-surface-highlight'
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
        <Alert type={message.type} title={message.type === 'success' ? '保存成功' : '保存失败'}>
          {message.text}
        </Alert>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          isLoading={saving}
          size="sm"
          leftIcon={<Save className="size-4" />}
        >
          保存界面偏好
        </Button>
      </div>
    </div>
  );
}
