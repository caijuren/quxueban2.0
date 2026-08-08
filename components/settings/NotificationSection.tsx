'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { UserSettings, NOTIFICATION_OPTIONS, mergeNotificationPrefs } from '@/lib/settings';
import SettingsSection from './SettingsSection';
import Switch from '@/components/ui/switch';
import Alert from '@/components/ui/alert';
import Button from '@/components/ui/button';

interface NotificationSectionProps {
  settings: UserSettings;
  onUpdate: (updates: Partial<UserSettings>) => Promise<void>;
}

export default function NotificationSection({ settings, onUpdate }: NotificationSectionProps) {
  const prefs = mergeNotificationPrefs(settings.notificationPrefs);
  const [localPrefs, setLocalPrefs] = useState(prefs);
  const [reminderTime, setReminderTime] = useState(settings.reminderTime);
  const [doNotDisturb, setDoNotDisturb] = useState(settings.doNotDisturb);
  const [doNotDisturbStart, setDoNotDisturbStart] = useState(settings.doNotDisturbStart || '22:00');
  const [doNotDisturbEnd, setDoNotDisturbEnd] = useState(settings.doNotDisturbEnd || '07:00');
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
    <div className="space-y-3">
      <SettingsSection title="通知类型" description="选择你关心的提醒">
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {NOTIFICATION_OPTIONS.map((option) => (
            <button
              key={option.key}
              onClick={() => togglePref(option.key)}
              className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-left transition-colors ${
                localPrefs[option.key]
                  ? 'bg-primary/10 border-primary/30'
                  : 'border-border-subtle bg-surface-elevated hover:bg-surface-elevated'
              }`}
            >
              <div
                className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                  localPrefs[option.key] ? 'border-primary bg-primary' : 'border-border-default'
                }`}
              >
                {localPrefs[option.key] && (
                  <svg
                    className="size-2.5 text-text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-text-secondary">{option.label}</p>
                <p className="text-[11px] leading-tight text-text-muted">{option.description}</p>
              </div>
            </button>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="提醒偏好" description="设置提醒时间和免打扰">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 flex size-8 items-center justify-center rounded-lg">
              <Icon name="Clock" size="sm" className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-text-secondary">每日提醒时间</p>
              <p className="text-[11px] text-text-muted">每天在这个时间推送当天学习任务</p>
            </div>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="rounded-lg border border-border-default bg-surface-elevated px-2.5 py-1.5 text-xs text-text-secondary focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <div className="bg-secondary/10 flex size-8 items-center justify-center rounded-lg">
              <Icon name="Moon" size="sm" className="text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-text-secondary">免打扰模式</p>
              <p className="text-[11px] text-text-muted">开启后在设定时段内不发送提醒</p>
            </div>
            <Switch checked={doNotDisturb} onCheckedChange={setDoNotDisturb} size="sm" />
          </div>

          {doNotDisturb && (
            <div className="grid grid-cols-2 gap-3 pl-11">
              <div>
                <label className="mb-1 block text-[11px] text-text-tertiary">开始时间</label>
                <input
                  type="time"
                  value={doNotDisturbStart}
                  onChange={(e) => setDoNotDisturbStart(e.target.value)}
                  className="w-full rounded-lg border border-border-default bg-surface-elevated px-2.5 py-1.5 text-xs text-text-secondary focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-text-tertiary">结束时间</label>
                <input
                  type="time"
                  value={doNotDisturbEnd}
                  onChange={(e) => setDoNotDisturbEnd(e.target.value)}
                  className="w-full rounded-lg border border-border-default bg-surface-elevated px-2.5 py-1.5 text-xs text-text-secondary focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          )}
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
          leftIcon={<Icon name="Save" size="sm" />}
        >
          保存通知设置
        </Button>
      </div>
    </div>
  );
}
