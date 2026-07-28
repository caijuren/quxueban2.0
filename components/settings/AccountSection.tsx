'use client';

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
} from 'lucide-react';
import { UserWithSettings } from '@/lib/settings';
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
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [showWechatModal, setShowWechatModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);

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
    setChangingPassword(true);
    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '修改失败');
      setPasswordMessage({ type: 'success', text: '密码修改成功' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMessage({
        type: 'error',
        text: err instanceof Error ? err.message : '修改失败',
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/user/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '注销失败');
      await signOut({ redirect: false });
      router.push('/');
    } catch (err) {
      setDeleting(false);
      alert(err instanceof Error ? err.message : '注销失败');
    }
  };

  const renderAvatar = () => {
    if (avatarUrl?.startsWith('data:image')) {
      return <img src={avatarUrl} alt="头像" className="w-full h-full object-cover" />;
    }
    if (avatarUrl) {
      return <span className="text-3xl">{avatarUrl}</span>;
    }
    if (name) {
      return (
        <span className="text-2xl font-bold text-white">
          {name.slice(0, 1).toUpperCase()}
        </span>
      );
    }
    return <User className="w-8 h-8 text-white/80" />;
  };

  return (
    <div className="space-y-5">
      <SettingsSection title="个人信息" description="管理你的头像、昵称和联系方式">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div
            className="relative w-24 h-24 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-white/5"
            style={{
              background: 'linear-gradient(135deg, #ff2d6a, #8b5cf6)',
              boxShadow: '0 0 30px rgba(255, 45, 106, 0.25)',
            }}
          >
            {renderAvatar()}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-xs hover:bg-white/10 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              上传头像
            </button>
            {avatarUrl && (
              <button
                type="button"
                onClick={() => setAvatarUrl(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-xs hover:bg-white/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">用户名</label>
            <input
              type="text"
              value={user.username}
              disabled
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">显示名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：宝妈"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">手机号</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="用于接收短信提醒"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="用于接收邮件通知"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>

        {profileMessage && (
          <div
            className={`mt-4 text-sm px-4 py-2 rounded-lg ${
              profileMessage.type === 'success'
                ? 'bg-success/10 text-success border border-success/20'
                : 'bg-danger/10 text-danger border border-danger/20'
            }`}
          >
            {profileMessage.text}
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium hover:shadow-glow-primary transition-all disabled:opacity-70"
          >
            {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            保存个人信息
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="账号绑定" description="绑定第三方账号，登录和提醒更方便">
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#07C160]/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-[#07C160]" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">微信</p>
              <p className="text-xs text-slate-500">
                {user.wechatOpenId ? '已绑定' : '未绑定'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowWechatModal(true)}
            className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-xs hover:bg-white/10 transition-colors"
          >
            {user.wechatOpenId ? '管理' : '去绑定'}
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="修改密码" description="定期更换密码可以保护账号安全">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-xs text-slate-400 mb-1.5">当前密码</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200 focus:outline-none focus:border-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-[30px] text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">新密码</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200 focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs text-slate-400 mb-1.5">确认新密码</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200 focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>

        {passwordMessage && (
          <div
            className={`mt-4 text-sm px-4 py-2 rounded-lg ${
              passwordMessage.type === 'success'
                ? 'bg-success/10 text-success border border-success/20'
                : 'bg-danger/10 text-danger border border-danger/20'
            }`}
          >
            {passwordMessage.text}
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            onClick={handleChangePassword}
            disabled={changingPassword}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-sm font-medium hover:bg-white/[0.08] transition-all disabled:opacity-70"
          >
            {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            修改密码
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="危险操作" description="以下操作不可逆，请谨慎">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-danger/5 border border-danger/10">
          <div>
            <p className="text-sm font-medium text-slate-200">注销账号</p>
            <p className="text-xs text-slate-500">删除后所有学员、计划、任务数据将无法恢复</p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-danger/10 text-danger text-sm font-medium hover:bg-danger/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            注销账号
          </button>
        </div>
      </SettingsSection>

      <WechatBindModal isOpen={showWechatModal} onClose={() => setShowWechatModal(false)} />

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-[#0f172a] border border-white/10 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-danger" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-200">确认注销账号？</h4>
                <p className="text-xs text-slate-500">此操作不可恢复</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              请输入当前密码以确认注销账号，注销后所有数据将被清除。
            </p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="当前密码"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-danger transition-all mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-white/5 text-slate-400 text-sm hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                取消
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || !deletePassword}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-danger text-white text-sm font-medium hover:bg-danger/90 transition-colors disabled:opacity-70"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                确认注销
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
