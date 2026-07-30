'use client';

import { useState } from 'react';
import { Bell, Clock, Moon, Save, Loader2 } from 'lucide-react';
import { UserSettings, NOTIFICATION_OPTIONS, mergeNotificationPrefs } from '@/lib/settings';
import SettingsSection from './SettingsSection';

interface NotificationSectionProps {
  settings: UserSettings;
  onUpdate: (updates: Partial<UserSettings>) => Promise<void>;
}

export default function NotificationSection({
  settings,
  onUpdate,
}: NotificationSectionProps) {
  const prefs = mergeNotificationPrefs(settings.notificationPrefs);
  const [localPrefs, setLocalPrefs] = useState(prefs);
  const [reminderTime, setReminderTime] = useState(settings.reminderTime);
  const [doNotDisturb, setDoNotDisturb] = useState(settings.doNotDisturb);
  const [doNotDisturbStart, setDoNotDisturbStart] = useState(
    settings.doNotDisturbStart || '22:00'
  );
  const [doNotDisturbEnd, setDoNotDisturbEnd] = useState(
    settings.doNotDisturbEnd || '07:00'
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const togglePref = (key: string) => {
    setLocalPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await onUpdate({
        notificationPrefs: localPrefs,
        reminderTime,
        doNotDisturb,
        doNotDisturbStart: doNotDisturb ? doNotDisturbStart : null,
        doNotDisturbEnd: doNotDisturb ? doNotDisturbEnd : null,
      });
      setMessage({ type: 'success', text: '通知设置已保存' });
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
      <SettingsSection title="通知类型" description="选择你关心的提醒">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {NOTIFICATION_OPTIONS.map((option) => (
            <button
              key={option.key}
              onClick={() => togglePref(option.key)}
              className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-colors ${
                localPrefs[option.key]
                  ? 'bg-primary/10 border-primary/30'
                  : 'bg-surface-light border border-border-subtle hover:bg-surface'
              }`}
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  localPrefs[option.key]
                    ? 'bg-primary border-primary'
                    : 'border-border-default'
                }`}
              >
                {localPrefs[option.key] && (
                  <svg className="w-2.5 h-2.5 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-text-primary">{option.label}</p>
                <p className="text-[11px] text-text-tertiary leading-tight">{option.description}</p>
              </div>
            </button>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="提醒偏好" description="设置提醒时间和免打扰">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">每日提醒时间</p>
              <p className="text-xs text-text-tertiary">每天在这个时间推送当天任务</p>
            </div>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="px-3 py-2 rounded-lg bg-surface-light border border-border-subtle text-sm text-text-primary focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Moon className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">免打扰模式</p>
              <p className="text-xs text-text-tertiary">开启后在设定时段内不发送提醒</p>
            </div>
            <button
              onClick={() => setDoNotDisturb((v) => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                doNotDisturb ? 'bg-primary' : 'bg-border-default'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  doNotDisturb ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>

          {doNotDisturb && (
            <div className="grid grid-cols-2 gap-4 pl-14">
              <div>
                <label className="block text-xs text-text-tertiary mb-1.5">开始时间</label>
                <input
                  type="time"
                  value={doNotDisturbStart}
                  onChange={(e) => setDoNotDisturbStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-light border border-border-subtle text-sm text-text-primary focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-text-tertiary mb-1.5">结束时间</label>
                <input
                  type="time"
                  value={doNotDisturbEnd}
                  onChange={(e) => setDoNotDisturbEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-light border border-border-subtle text-sm text-text-primary focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          )}
        </div>
      </SettingsSection>

      {message && (
        <div
          className={`text-sm px-4 py-2 rounded-lg ${
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-text-primary text-sm font-medium hover:shadow-glow-primary transition-all disabled:opacity-70"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          保存通知设置
        </button>
      </div>
    </div>
  );
}
