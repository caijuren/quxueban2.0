'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  Users,
  Plus,
  Loader2,
  UserPlus,
  Shield,
  User,
  Eye,
  X,
  Check,
  Crown,
  AlertCircle,
  LogOut,
  Trash2,
} from 'lucide-react';
import SettingsSection from './SettingsSection';
import {
  useFamily,
  useCreateFamily,
  useInviteMember,
  useInviteUnregistered,
  useUpdateFamilyMember,
  useRemoveFamilyMember,
  useTransferFamilyOwner,
  useDeleteFamily,
  FamilyMember,
} from '@/lib/hooks/useFamily';
import { FamilyMemberRole, FamilyMemberStatus } from '@/lib/generated/prisma';

const ROLE_LABELS: Record<FamilyMemberRole, string> = {
  OWNER: '创建者',
  ADMIN: '管理员',
  MEMBER: '成员',
  VIEWER: '仅查看',
};

const ROLE_ICONS: Record<FamilyMemberRole, typeof User> = {
  OWNER: Crown,
  ADMIN: Shield,
  MEMBER: User,
  VIEWER: Eye,
};

const ROLE_OPTIONS: { value: Exclude<FamilyMemberRole, 'OWNER'>; label: string; description: string }[] = [
  { value: 'ADMIN', label: '管理员', description: '可管理成员、编辑孩子档案' },
  { value: 'MEMBER', label: '成员', description: '可查看和编辑孩子学习数据' },
  { value: 'VIEWER', label: '仅查看', description: '只能查看，不能修改' },
];

const STATUS_LABELS: Record<FamilyMemberStatus, string> = {
  INVITED: '待接受',
  ACTIVE: '已加入',
  DISABLED: '已禁用',
};

function MemberAvatar({ member }: { member: FamilyMember }) {
  const url = member.user.avatarUrl;
  const initial = (member.user.name || member.user.username || '?').slice(0, 1);
  return (
    <div className="relative w-10 h-10 rounded-full bg-surface-elevated border border-border-subtle flex items-center justify-center overflow-hidden shrink-0">
      {url && url.startsWith('http') ? (
        <Image
          src={url}
          alt={member.user.name || ''}
          fill
          sizes="40px"
          unoptimized
          className="object-cover"
        />
      ) : (
        <span className="text-sm font-bold text-text-secondary">{initial}</span>
      )}
    </div>
  );
}

export default function FamilySection() {
  const { data, isLoading, error } = useFamily();
  const createFamily = useCreateFamily();
  const inviteMember = useInviteMember();
  const inviteUnregistered = useInviteUnregistered();
  const updateMember = useUpdateFamilyMember();
  const removeMember = useRemoveFamilyMember();
  const transferOwner = useTransferFamilyOwner();
  const deleteFamily = useDeleteFamily();

  const [newFamilyName, setNewFamilyName] = useState('');
  const [inviteUsername, setInviteUsername] = useState('');
  const [inviteRole, setInviteRole] = useState<Exclude<FamilyMemberRole, 'OWNER'>>('MEMBER');
  const [showInvite, setShowInvite] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // 未注册用户邀请
  const [inviteMode, setInviteMode] = useState<'username' | 'email' | 'phone'>('username');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  const family = data?.family;
  const myRole = data?.role;
  const isManager = myRole === 'OWNER' || myRole === 'ADMIN';
  const isOwner = myRole === 'OWNER';

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    try {
      await createFamily.mutateAsync({ name: newFamilyName.trim() });
      setNewFamilyName('');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : '创建失败');
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setInviteSuccess(null);

    try {
      if (inviteMode === 'username') {
        if (!inviteUsername.trim()) return;
        await inviteMember.mutateAsync({ username: inviteUsername.trim(), role: inviteRole });
        setInviteUsername('');
      } else if (inviteMode === 'email') {
        if (!inviteEmail.trim()) return;
        const result = await inviteUnregistered.mutateAsync({
          role: inviteRole,
          email: inviteEmail.trim(),
        });
        setInviteSuccess(result.message || '邀请链接已生成');
        setInviteEmail('');
      } else if (inviteMode === 'phone') {
        if (!invitePhone.trim()) return;
        const result = await inviteUnregistered.mutateAsync({
          role: inviteRole,
          phone: invitePhone.trim(),
        });
        setInviteSuccess(result.message || '邀请链接已生成');
        setInvitePhone('');
      }
      if (inviteMode === 'username') {
        setShowInvite(false);
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : '邀请失败');
    }
  };

  const handleAccept = async (id: string) => {
    setActionError(null);
    try {
      await updateMember.mutateAsync({ id, input: { status: 'ACTIVE' } });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : '接受失败');
    }
  };

  const handleRoleChange = async (id: string, role: Exclude<FamilyMemberRole, 'OWNER'>) => {
    setActionError(null);
    try {
      await updateMember.mutateAsync({ id, input: { role } });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : '修改失败');
    }
  };

  const handleRemove = async (id: string) => {
    setActionError(null);
    try {
      await removeMember.mutateAsync(id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : '移除失败');
    }
  };

  const handleTransferOwner = async (id: string) => {
    setActionError(null);
    try {
      await transferOwner.mutateAsync(id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : '转让失败');
    }
  };

  const handleDeleteFamily = async () => {
    setActionError(null);
    if (!confirm('确定要解散家庭吗？所有成员关系和共享数据将一并删除，此操作不可撤销。')) {
      return;
    }
    try {
      await deleteFamily.mutateAsync();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : '解散失败');
    }
  };

  const handleLeaveFamily = async (memberId: string) => {
    setActionError(null);
    if (!confirm('确定要退出家庭吗？')) {
      return;
    }
    try {
      await removeMember.mutateAsync(memberId);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : '退出失败');
    }
  };

  if (isLoading) {
    return (
      <SettingsSection title="家庭成员与权限" description="管理家庭成员和访问权限">
        <div className="flex items-center justify-center py-12 text-text-muted">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          加载中...
        </div>
      </SettingsSection>
    );
  }

  if (error && !family) {
    return (
      <SettingsSection title="家庭成员与权限" description="管理家庭成员和访问权限">
        <div className="flex items-center gap-2 text-sm text-danger">
          <AlertCircle className="w-4 h-4" />
          {error.message}
        </div>
      </SettingsSection>
    );
  }

  if (!family) {
    return (
      <SettingsSection title="创建家庭" description="创建家庭后即可邀请其他成员加入">
        <form onSubmit={handleCreateFamily} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs text-text-secondary mb-1.5">家庭名称</label>
            <input
              type="text"
              value={newFamilyName}
              onChange={(e) => setNewFamilyName(e.target.value)}
              placeholder="例如：小明家"
              className="w-full px-3 py-2 rounded-lg bg-surface-elevated border border-border-subtle text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40"
            />
          </div>
          {actionError && (
            <div className="flex items-center gap-2 text-xs text-danger">
              <AlertCircle className="w-3.5 h-3.5" />
              {actionError}
            </div>
          )}
          <button
            type="submit"
            disabled={!newFamilyName.trim() || createFamily.isPending}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-text-primary text-xs font-medium hover:opacity-90 transition-all disabled:opacity-50"
          >
            {createFamily.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Users className="w-3.5 h-3.5" />
            )}
            创建家庭
          </button>
        </form>
      </SettingsSection>
    );
  }

  const currentUserId = data?.currentUserId;

  return (
    <div className="space-y-4">
      <SettingsSection title="家庭信息" description="当前所在的家庭">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">{family.name}</h3>
              <p className="text-xs text-text-muted">
                {family.members.length} 位成员 · 你的身份：{ROLE_LABELS[myRole || 'MEMBER']}
              </p>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={handleDeleteFamily}
              disabled={deleteFamily.isPending}
              title="解散家庭"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-danger/10 text-danger text-xs hover:bg-danger/20 transition-colors disabled:opacity-50"
            >
              {deleteFamily.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              解散家庭
            </button>
          )}
        </div>
      </SettingsSection>

      <SettingsSection
        title="成员列表"
        description="邀请家人共同管理孩子的学习"
      >
        <div className="space-y-3">
          {actionError && (
            <div className="flex items-center gap-2 text-xs text-danger bg-danger/5 border border-danger/10 rounded-lg px-3 py-2">
              <AlertCircle className="w-3.5 h-3.5" />
              {actionError}
            </div>
          )}

          <div className="space-y-2">
            {family.members.map((member) => {
              const RoleIcon = ROLE_ICONS[member.role];
              const isMe = member.user.id === currentUserId;
              const canManage = isManager && member.role !== 'OWNER' && !isMe;
              const canRemove = isOwner
                ? member.role !== 'OWNER'
                : isManager && member.role !== 'OWNER' && !isMe;
              const canTransferOwner = isOwner && member.role !== 'OWNER' && member.status === 'ACTIVE';

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-border-subtle"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <MemberAvatar member={member} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-text-primary truncate">
                          {member.user.name || member.user.username}
                        </span>
                        {member.status === 'INVITED' && (
                          <span className="text-2xs px-1.5 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/20">
                            {STATUS_LABELS[member.status]}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <RoleIcon className="w-3 h-3" />
                        {ROLE_LABELS[member.role]}
                        <span className="text-text-tertiary">·</span>
                        <span className="truncate">{member.user.username}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {member.status === 'INVITED' && isMe && (
                      <button
                        onClick={() => handleAccept(member.id)}
                        disabled={updateMember.isPending}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-success/10 text-success text-xs hover:bg-success/20 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        接受
                      </button>
                    )}

                    {canTransferOwner && (
                      <button
                        onClick={() => handleTransferOwner(member.id)}
                        disabled={transferOwner.isPending}
                        title="转让创建者身份"
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-warning/10 text-warning text-xs hover:bg-warning/20 transition-colors"
                      >
                        <Crown className="w-3.5 h-3.5" />
                        转让
                      </button>
                    )}

                    {canManage ? (
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value as Exclude<FamilyMemberRole, 'OWNER'>)}
                        disabled={updateMember.isPending}
                        className="px-2 py-1.5 rounded-lg bg-surface-hover border border-border-subtle text-xs text-text-secondary focus:outline-none focus:border-primary/40"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : null}

                    {canRemove && (
                      <button
                        onClick={() => handleRemove(member.id)}
                        disabled={removeMember.isPending}
                        className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                        title="移除成员"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    {isMe && member.role !== 'OWNER' && (
                      <button
                        onClick={() => handleLeaveFamily(member.id)}
                        disabled={removeMember.isPending}
                        title="退出家庭"
                        className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {isManager && (
            <div className="pt-2">
              {!showInvite ? (
                <button
                  onClick={() => setShowInvite(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-hover text-text-secondary text-xs hover:bg-surface-highlight transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  邀请成员
                </button>
              ) : (
                <form onSubmit={handleInvite} className="p-3 rounded-xl bg-surface-elevated border border-border-subtle space-y-3">
                  <div className="flex items-center gap-2">
                    {[
                      { value: 'username', label: '用户名' },
                      { value: 'email', label: '邮箱' },
                      { value: 'phone', label: '手机' },
                    ].map((mode) => (
                      <button
                        key={mode.value}
                        type="button"
                        onClick={() => {
                          setInviteMode(mode.value as typeof inviteMode);
                          setActionError(null);
                          setInviteSuccess(null);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                          inviteMode === mode.value
                            ? 'bg-primary/10 text-primary'
                            : 'bg-surface-hover text-text-tertiary hover:text-text-secondary'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-text-secondary mb-1.5">
                        {inviteMode === 'username' && '用户名'}
                        {inviteMode === 'email' && '邮箱'}
                        {inviteMode === 'phone' && '手机号'}
                      </label>
                      {inviteMode === 'username' ? (
                        <input
                          type="text"
                          value={inviteUsername}
                          onChange={(e) => setInviteUsername(e.target.value)}
                          placeholder="输入对方的登录用户名"
                          className="w-full px-3 py-2 rounded-lg bg-surface-hover border border-border-subtle text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40"
                        />
                      ) : inviteMode === 'email' ? (
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="对方的邮箱地址"
                          className="w-full px-3 py-2 rounded-lg bg-surface-hover border border-border-subtle text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40"
                        />
                      ) : (
                        <input
                          type="tel"
                          value={invitePhone}
                          onChange={(e) => setInvitePhone(e.target.value)}
                          placeholder="对方的手机号码"
                          className="w-full px-3 py-2 rounded-lg bg-surface-hover border border-border-subtle text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-text-secondary mb-1.5">权限</label>
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as Exclude<FamilyMemberRole, 'OWNER'>)}
                        className="w-full px-3 py-2 rounded-lg bg-surface-hover border border-border-subtle text-sm text-text-primary focus:outline-none focus:border-primary/40"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <p className="text-2xs text-text-muted">{ROLE_OPTIONS.find((o) => o.value === inviteRole)?.description}</p>

                  {inviteSuccess && (
                    <div className="text-xs text-success bg-success/5 border border-success/10 rounded-lg px-3 py-2">
                      {inviteSuccess}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={
                        (inviteMode === 'username' && !inviteUsername.trim()) ||
                        (inviteMode === 'email' && !inviteEmail.trim()) ||
                        (inviteMode === 'phone' && !invitePhone.trim()) ||
                        inviteMember.isPending ||
                        inviteUnregistered.isPending
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-text-primary text-xs font-medium hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      {inviteMember.isPending || inviteUnregistered.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                      发送邀请
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowInvite(false);
                        setInviteUsername('');
                        setInviteEmail('');
                        setInvitePhone('');
                        setActionError(null);
                        setInviteSuccess(null);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </SettingsSection>
    </div>
  );
}
