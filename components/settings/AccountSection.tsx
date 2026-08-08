'use client';
import { Icon } from '@/components/ui/icon';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

import { UserWithSettings } from '@/lib/settings';
import { useChangePassword, useDeleteAccount } from '@/lib/hooks/useUser';
import SettingsSection from './SettingsSection';
import WechatBindModal from './WechatBindModal';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

interface AccountSectionProps {
  user: UserWithSettings;
  onUpdate: (updates: Partial<UserWithSettings>) => Promise<void>;
}

export default function AccountSection({ user, onUpdate }: AccountSectionProps) {
  const router = useRouter();
  const changePassword = useChangePassword();
  const deleteAccount = useDeleteAccount();
  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [email, setEmail] = useState(user.email || '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatarUrl);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [showWechatModal, setShowWechatModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const [expandedSecurity, setExpandedSecurity] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(user.name || '');
    setPhone(user.phone || '');
    setEmail(user.email || '');
    setAvatarUrl(user.avatarUrl);
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_AVATAR_SIZE) {
      setProfileMessage({ type: 'error', text: '头像图片不能超过 2MB' });
      return;
    }
    if (!file.type.startsWith('image/')) {
      setProfileMessage({ type: 'error', text: '请上传图片文件' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result as string);
      setProfileMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileMessage(null);
    try {
      await onUpdate({
        name: name.trim() || null,
        phone: phone.trim() || null,
        email: email.trim() || null,
        avatarUrl,
      });
      setProfileMessage({ type: 'success', text: '个人信息已保存' });
    } catch (err) {
      setProfileMessage({
        type: 'error',
        text: err instanceof Error ? err.message : '保存失败',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordMessage(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: 'error', text: '请填写所有密码字段' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: '新密码不能少于 6 位' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: '两次输入的新密码不一致' });
      return;
    }
    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });
      setPasswordMessage({ type: 'success', text: '密码修改成功' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMessage({
        type: 'error',
        text: err instanceof Error ? err.message : '修改失败',
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return;
    try {
      await deleteAccount.mutateAsync({ password: deletePassword });
      await signOut({ redirect: false });
      router.push('/');
    } catch (err) {
      alert(err instanceof Error ? err.message : '注销失败');
    }
  };

  const toggleSecurity = (id: string) => {
    setExpandedSecurity((prev) => (prev === id ? null : id));
  };

  const renderAvatar = () => {
    if (avatarUrl?.startsWith('data:image')) {
      return (
        <Image src={avatarUrl} alt="头像" fill sizes="80px" unoptimized className="object-cover" />
      );
    }
    if (avatarUrl) {
      return <span className="text-2xl">{avatarUrl}</span>;
    }
    if (name) {
      return (
        <span className="text-xl font-bold text-text-primary">
          {name.slice(0, 1).toUpperCase()}
        </span>
      );
    }
    return <Icon name="User" size="lg" className="text-text-primary/80" />;
  };

  return (
    <div className="space-y-4">
      <SettingsSection title="个人信息" description="管理头像、昵称和联系方式">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
          <div className="flex shrink-0 flex-col items-center gap-2">
            <div
              className="relative flex size-20 items-center justify-center overflow-hidden rounded-full ring-2 ring-border-default"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                boxShadow: '0 0 20px var(--shadow-primary)',
              }}
            >
              {renderAvatar()}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 rounded-md bg-surface-elevated px-2 py-1 text-xs text-text-secondary transition-colors hover:bg-surface-highlight"
              >
                <Icon name="Upload" size="xs" />
                上传
              </button>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl(null)}
                  className="inline-flex items-center gap-1 rounded-md bg-surface-elevated px-2 py-1 text-xs text-text-tertiary transition-colors hover:bg-surface-highlight"
                >
                  <Icon name="X" size="xs" />
                  清除
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-text-tertiary">用户名</label>
                <input
                  type="text"
                  value={user.username}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-muted"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-text-tertiary">显示名称</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如：宝妈"
                  className="w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary transition-all placeholder:text-text-tertiary focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-text-tertiary">手机号</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="接收短信提醒"
                  className="w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary transition-all placeholder:text-text-tertiary focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-text-tertiary">邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="接收邮件通知"
                  className="w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary transition-all placeholder:text-text-tertiary focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {profileMessage && (
              <div
                className={`mt-3 rounded-lg px-3 py-1.5 text-xs ${
                  profileMessage.type === 'success'
                    ? 'bg-success/10 border-success/20 border text-success'
                    : 'bg-error/10 border-error/20 border text-error'
                }`}
              >
                {profileMessage.text}
              </div>
            )}

            <div className="mt-3 flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-text-primary transition-all hover:opacity-90 disabled:opacity-70"
              >
                {savingProfile ? (
                  <Icon name="Loader2" size="xs" animate="spin" />
                ) : (
                  <Icon name="Save" size="xs" />
                )}
                保存
              </button>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="账号安全" description="绑定、密码与账号注销">
        <div className="space-y-2">
          <button
            onClick={() => toggleSecurity('wechat')}
            className="flex w-full items-center justify-between rounded-lg border border-border-subtle bg-surface-elevated p-3 text-left transition-colors hover:bg-surface-elevated"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-wechat/10">
                <Icon name="MessageCircle" size="sm" className="text-wechat" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary">微信绑定</p>
                <p className="text-xs text-text-muted">{user.wechatOpenId ? '已绑定' : '未绑定'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-tertiary">
                {user.wechatOpenId ? '管理' : '去绑定'}
              </span>
              {expandedSecurity === 'wechat' ? (
                <Icon name="ChevronUp" size="sm" className="text-text-muted" />
              ) : (
                <Icon name="ChevronDown" size="sm" className="text-text-muted" />
              )}
            </div>
          </button>

          {expandedSecurity === 'wechat' && (
            <div className="rounded-lg border border-border-subtle bg-surface-elevated p-3">
              <p className="mb-2 text-xs text-text-tertiary">
                绑定微信后可使用微信一键登录和接收微信提醒。
              </p>
              <button
                onClick={() => setShowWechatModal(true)}
                className="rounded-md bg-surface-elevated px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-surface-highlight"
              >
                {user.wechatOpenId ? '管理微信绑定' : '立即绑定微信'}
              </button>
            </div>
          )}

          <button
            onClick={() => toggleSecurity('password')}
            className="flex w-full items-center justify-between rounded-lg border border-border-subtle bg-surface-elevated p-3 text-left transition-colors hover:bg-surface-elevated"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex size-9 items-center justify-center rounded-lg">
                <Icon name="Lock" size="sm" className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary">修改密码</p>
                <p className="text-xs text-text-muted">定期更换更安全</p>
              </div>
            </div>
            {expandedSecurity === 'password' ? (
              <Icon name="ChevronUp" size="sm" className="text-text-muted" />
            ) : (
              <Icon name="ChevronDown" size="sm" className="text-text-muted" />
            )}
          </button>

          {expandedSecurity === 'password' && (
            <div className="space-y-3 rounded-lg border border-border-subtle bg-surface-elevated p-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="relative">
                  <label className="mb-1 block text-xs text-text-tertiary">当前密码</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary transition-all focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-[26px] text-text-muted hover:text-text-secondary"
                  >
                    {showPassword ? <Icon name="EyeOff" size="xs" /> : <Icon name="Eye" size="xs" />}
                  </button>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-tertiary">新密码</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary transition-all focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs text-text-tertiary">确认新密码</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary transition-all focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {passwordMessage && (
                <div
                  className={`rounded-lg px-3 py-1.5 text-xs ${
                    passwordMessage.type === 'success'
                      ? 'bg-success/10 border-success/20 border text-success'
                      : 'bg-error/10 border-error/20 border text-error'
                  }`}
                >
                  {passwordMessage.text}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleChangePassword}
                  disabled={changePassword.isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border-default bg-surface-elevated px-3 py-1.5 text-xs font-medium text-text-secondary transition-all hover:bg-surface-highlight disabled:opacity-70"
                >
                  {changePassword.isPending ? (
                    <Icon name="Loader2" size="xs" animate="spin" />
                  ) : (
                    <Icon name="Lock" size="xs" />
                  )}
                  修改密码
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => toggleSecurity('error')}
            className="bg-error/5 border-error/10 hover:bg-error/[0.07] flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-error/10 flex size-9 items-center justify-center rounded-lg">
                <Icon name="Trash2" size="sm" className="text-error" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary">注销账号</p>
                <p className="text-xs text-text-muted">删除后数据无法恢复</p>
              </div>
            </div>
            {expandedSecurity === 'error' ? (
              <Icon name="ChevronUp" size="sm" className="text-text-muted" />
            ) : (
              <Icon name="ChevronDown" size="sm" className="text-text-muted" />
            )}
          </button>

          {expandedSecurity === 'error' && (
            <div className="bg-error/5 border-error/10 space-y-3 rounded-lg border p-3">
              <p className="text-xs text-text-tertiary">
                注销后所有孩子、计划、任务数据将无法恢复，请谨慎操作。
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-error/10 hover:bg-error/20 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-error transition-colors"
                >
                  <Icon name="Trash2" size="xs" />
                  注销账号
                </button>
              </div>
            </div>
          )}
        </div>
      </SettingsSection>

      <WechatBindModal
        isOpen={showWechatModal}
        onClose={() => setShowWechatModal(false)}
        user={user}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-border-default bg-bg-secondary p-5 shadow-2xl">
            <div className="mb-3 flex items-center gap-3">
              <div className="bg-error/10 flex size-9 items-center justify-center rounded-full">
                <Icon name="AlertTriangle" size="sm" className="text-error" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-text-secondary">确认注销账号？</h4>
                <p className="text-xs text-text-muted">此操作不可恢复</p>
              </div>
            </div>
            <p className="mb-3 text-xs text-text-tertiary">
              请输入当前密码以确认注销账号，注销后所有数据将被清除。
            </p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="当前密码"
              className="mb-3 w-full rounded-lg border border-border-default bg-surface-elevated px-3 py-2 text-sm text-text-secondary transition-all placeholder:text-text-tertiary focus:border-error focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteAccount.isPending}
                className="rounded-lg bg-surface-elevated px-3 py-1.5 text-xs text-text-tertiary transition-colors hover:bg-surface-highlight disabled:opacity-50"
              >
                取消
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteAccount.isPending || !deletePassword}
                className="hover:bg-error/90 inline-flex items-center gap-1.5 rounded-lg bg-error px-3 py-1.5 text-xs font-medium text-text-primary transition-colors disabled:opacity-70"
              >
                {deleteAccount.isPending && <Icon name="Loader2" size="xs" animate="spin" />}
                确认注销
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
