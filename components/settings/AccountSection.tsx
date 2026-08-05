'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import {
  User,
  Upload,
  X,
  Save,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  MessageCircle,
  Trash2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
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
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
        <Image
          src={avatarUrl}
          alt="头像"
          fill
          sizes="80px"
          unoptimized
          className="object-cover"
        />
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
    return <User className="w-7 h-7 text-text-primary/80" />;
  };

  return (
    <div className="space-y-4">
      <SettingsSection title="个人信息" description="管理头像、昵称和联系方式">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-border-default"
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
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-elevated text-text-secondary text-xs hover:bg-surface-highlight transition-colors"
              >
                <Upload className="w-3 h-3" />
                上传
              </button>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl(null)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-elevated text-text-tertiary text-xs hover:bg-surface-highlight transition-colors"
                >
                  <X className="w-3 h-3" />
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

          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-text-tertiary mb-1">用户名</label>
                <input
                  type="text"
                  value={user.username}
                  disabled
                  className="w-full px-3 py-2 rounded-lg bg-surface-elevated border border-border-default text-sm text-text-muted cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs text-text-tertiary mb-1">显示名称</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如：宝妈"
                  className="w-full px-3 py-2 rounded-lg bg-surface-elevated border border-border-default text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-text-tertiary mb-1">手机号</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="接收短信提醒"
                  className="w-full px-3 py-2 rounded-lg bg-surface-elevated border border-border-default text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-text-tertiary mb-1">邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="接收邮件通知"
                  className="w-full px-3 py-2 rounded-lg bg-surface-elevated border border-border-default text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            {profileMessage && (
              <div
                className={`mt-3 text-xs px-3 py-1.5 rounded-lg ${
                  profileMessage.type === 'success'
                    ? 'bg-success/10 text-success border border-success/20'
                    : 'bg-error/10 text-error border border-error/20'
                }`}
              >
                {profileMessage.text}
              </div>
            )}

            <div className="mt-3 flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-text-primary text-xs font-medium hover:opacity-90 transition-all disabled:opacity-70"
              >
                {savingProfile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
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
            className="w-full flex items-center justify-between p-3 rounded-lg bg-surface-elevated border border-border-subtle hover:bg-surface-elevated transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#07C160]/10 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-[#07C160]" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary">微信绑定</p>
                <p className="text-xs text-text-muted">
                  {user.wechatOpenId ? '已绑定' : '未绑定'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-tertiary">
                {user.wechatOpenId ? '管理' : '去绑定'}
              </span>
              {expandedSecurity === 'wechat' ? (
                <ChevronUp className="w-4 h-4 text-text-muted" />
              ) : (
                <ChevronDown className="w-4 h-4 text-text-muted" />
              )}
            </div>
          </button>

          {expandedSecurity === 'wechat' && (
            <div className="p-3 rounded-lg bg-surface-elevated border border-border-subtle">
              <p className="text-xs text-text-tertiary mb-2">
                绑定微信后可使用微信一键登录和接收微信提醒。
              </p>
              <button
                onClick={() => setShowWechatModal(true)}
                className="px-3 py-1.5 rounded-md bg-surface-elevated text-text-secondary text-xs hover:bg-surface-highlight transition-colors"
              >
                {user.wechatOpenId ? '管理微信绑定' : '立即绑定微信'}
              </button>
            </div>
          )}

          <button
            onClick={() => toggleSecurity('password')}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-surface-elevated border border-border-subtle hover:bg-surface-elevated transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary">修改密码</p>
                <p className="text-xs text-text-muted">定期更换更安全</p>
              </div>
            </div>
            {expandedSecurity === 'password' ? (
              <ChevronUp className="w-4 h-4 text-text-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-muted" />
            )}
          </button>

          {expandedSecurity === 'password' && (
            <div className="p-3 rounded-lg bg-surface-elevated border border-border-subtle space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <label className="block text-xs text-text-tertiary mb-1">当前密码</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-elevated border border-border-default text-sm text-text-secondary focus:outline-none focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-[26px] text-text-muted hover:text-text-secondary"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div>
                  <label className="block text-xs text-text-tertiary mb-1">新密码</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-elevated border border-border-default text-sm text-text-secondary focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-text-tertiary mb-1">确认新密码</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-elevated border border-border-default text-sm text-text-secondary focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              {passwordMessage && (
                <div
                  className={`text-xs px-3 py-1.5 rounded-lg ${
                    passwordMessage.type === 'success'
                      ? 'bg-success/10 text-success border border-success/20'
                      : 'bg-error/10 text-error border border-error/20'
                  }`}
                >
                  {passwordMessage.text}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleChangePassword}
                  disabled={changePassword.isPending}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated border border-border-default text-text-secondary text-xs font-medium hover:bg-surface-highlight transition-all disabled:opacity-70"
                >
                  {changePassword.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                  修改密码
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => toggleSecurity('error')}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-error/5 border border-error/10 hover:bg-error/[0.07] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-error/10 flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-error" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary">注销账号</p>
                <p className="text-xs text-text-muted">删除后数据无法恢复</p>
              </div>
            </div>
            {expandedSecurity === 'error' ? (
              <ChevronUp className="w-4 h-4 text-text-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-muted" />
            )}
          </button>

          {expandedSecurity === 'error' && (
            <div className="p-3 rounded-lg bg-error/5 border border-error/10 space-y-3">
              <p className="text-xs text-text-tertiary">
                注销后所有孩子、计划、任务数据将无法恢复，请谨慎操作。
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-error/10 text-error text-xs font-medium hover:bg-error/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  注销账号
                </button>
              </div>
            </div>
          )}
        </div>
      </SettingsSection>

      <WechatBindModal isOpen={showWechatModal} onClose={() => setShowWechatModal(false)} user={user} />

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-[#0f172a] border border-border-default p-5 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-error/10 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-error" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-text-secondary">确认注销账号？</h4>
                <p className="text-xs text-text-muted">此操作不可恢复</p>
              </div>
            </div>
            <p className="text-xs text-text-tertiary mb-3">
              请输入当前密码以确认注销账号，注销后所有数据将被清除。
            </p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="当前密码"
              className="w-full px-3 py-2 rounded-lg bg-surface-elevated border border-border-default text-sm text-text-secondary placeholder:text-text-tertiary focus:outline-none focus:border-error transition-all mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteAccount.isPending}
                className="px-3 py-1.5 rounded-lg bg-surface-elevated text-text-tertiary text-xs hover:bg-surface-highlight transition-colors disabled:opacity-50"
              >
                取消
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteAccount.isPending || !deletePassword}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-error text-text-primary text-xs font-medium hover:bg-error/90 transition-colors disabled:opacity-70"
              >
                {deleteAccount.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                确认注销
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
