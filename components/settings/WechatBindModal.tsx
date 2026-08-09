'use client';

import { useState, useEffect, useCallback } from 'react';
import { Icon } from '@/components/ui/icon';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/Modal';
import { UserWithSettings } from '@/lib/settings';
import { apiPost } from '@/lib/apiClient';

interface WechatBindModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserWithSettings;
}

interface BindCodeResponse {
  bindCode: string;
  expiresAt: string;
}

function maskOpenId(openId: string | null): string {
  if (!openId) return '';
  if (openId.length <= 8) return openId;
  return `${openId.slice(0, 4)}****${openId.slice(-4)}`;
}

function formatCountdown(target: Date): string {
  const diff = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
  const m = Math.floor(diff / 60);
  const s = diff % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function WechatBindModal({ isOpen, onClose, user }: WechatBindModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bindCode, setBindCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState('00:00');

  const generateCode = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiPost<BindCodeResponse>('/api/user/bind-code', {});
      setBindCode(res.bindCode);
      const expiry = new Date(res.expiresAt);
      setExpiresAt(expiry);
      setCountdown(formatCountdown(expiry));
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成绑定码失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setBindCode(null);
      setExpiresAt(null);
      setError(null);
      return;
    }

    if (!user.wechatOpenId && !bindCode) {
      generateCode();
    }
  }, [isOpen, user.wechatOpenId, bindCode, generateCode]);

  useEffect(() => {
    if (!expiresAt) return;

    const timer = setInterval(() => {
      const remaining = formatCountdown(expiresAt);
      setCountdown(remaining);
      if (remaining === '00:00') {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  const codeDigits = bindCode ? bindCode.split('') : ['', '', '', '', '', ''];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="微信绑定"
      subtitle="绑定后可在小程序使用微信一键登录"
      icon="MessageCircle"
      iconClassName="bg-wechat/20 text-wechat"
      size="sm"
      colorScheme="green"
    >
      <div className="space-y-4">
        {user.wechatOpenId && (
          <div className="bg-success/10 border-success/20 rounded-lg border px-3 py-2 text-xs text-success">
            已绑定微信：{maskOpenId(user.wechatOpenId)}
          </div>
        )}

        <p className="text-sm text-text-tertiary">
          打开趣学伴小程序，在登录页选择「绑定家长账号」，输入下方 6 位绑定码即可。
        </p>

        {error && (
          <div className="bg-error/10 border-error/20 rounded-lg border px-3 py-2 text-xs text-error">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-2">
          {codeDigits.map((digit, index) => (
            <div
              key={index}
              className="flex h-12 w-10 items-center justify-center rounded-lg border border-border-subtle bg-surface-elevated text-lg font-bold text-text-primary"
            >
              {digit}
            </div>
          ))}
        </div>

        <div className="text-center">
          {expiresAt ? (
            <p className="text-xs text-text-muted">
              绑定码有效期：<span className="font-mono text-text-secondary">{countdown}</span>
            </p>
          ) : (
            <p className="text-xs text-text-muted">点击下方按钮生成绑定码</p>
          )}
        </div>

        <Button
          onClick={generateCode}
          disabled={loading}
          variant="secondary"
          size="md"
          className="inline-flex w-full items-center justify-center gap-2 bg-wechat py-2.5 text-sm font-semibold text-text-primary disabled:opacity-70"
        >
          {loading ? (
            <Icon name="Loader2" size="sm" animate="spin" />
          ) : (
            <Icon name="RefreshCw" size="sm" />
          )}
          {bindCode ? '重新生成绑定码' : '生成绑定码'}
        </Button>
      </div>
    </Modal>
  );
}
