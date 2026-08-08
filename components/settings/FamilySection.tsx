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
  Copy,
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

const ROLE_OPTIONS: {
  value: Exclude<FamilyMemberRole, 'OWNER'>;
  label: string;
  description: string;
}[] = [
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
    <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-subtle bg-surface-elevated">
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
  const [generatedInvite, setGeneratedInvite] = useState<{
    token: string;
    url: string;
    expiresAt: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

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
    setGeneratedInvite(null);
    setCopied(false);

    try {
      if (inviteMode === 'username') {
        if (!inviteUsername.trim()) return;
        await inviteMember.mutateAsync({ username: inviteUsername.trim(), role: inviteRole });
        setInviteUsername('');
        setShowInvite(false);
      } else if (inviteMode === 'email') {
        if (!inviteEmail.trim()) return;
        const result = await inviteUnregistered.mutateAsync({
          role: inviteRole,
          email: inviteEmail.trim(),
        });
        const url = `${window.location.origin}/invite?token=${result.invite.token}`;
        setInviteSuccess(result.message || '邀请链接已生成');
        setGeneratedInvite({ token: result.invite.token, url, expiresAt: result.invite.expiresAt });
        setInviteEmail('');
      } else if (inviteMode === 'phone') {
        if (!invitePhone.trim()) return;
        const result = await inviteUnregistered.mutateAsync({
          role: inviteRole,
          phone: invitePhone.trim(),
        });
        const url = `${window.location.origin}/invite?token=${result.invite.token}`;
        setInviteSuccess(result.message || '邀请链接已生成');
        setGeneratedInvite({ token: result.invite.token, url, expiresAt: result.invite.expiresAt });
        setInvitePhone('');
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
          <Loader2 className="mr-2 size-5 animate-spin" />
          加载中...
        </div>
      </SettingsSection>
    );
  }

  if (error && !family) {
    return (
      <SettingsSection title="家庭成员与权限" description="管理家庭成员和访问权限">
        <div className="flex items-center gap-2 text-sm text-error">
          <AlertCircle className="size-4" />
          {error.message}
        </div>
      </SettingsSection>
    );
  }

  if (!family) {
    return (
      <SettingsSection title="创建家庭" description="创建家庭后即可邀请其他成员加入">
        <form onSubmit={handleCreateFamily} className="max-w-md space-y-4">
          <div>
            <label className="mb-1.5 block text-xs text-text-secondary">家庭名称</label>
            <input
              type="text"
              value={newFamilyName}
              onChange={(e) => setNewFamilyName(e.target.value)}
              placeholder="例如：小明家"
              className="focus:border-primary/40 w-full rounded-lg border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
            />
          </div>
          {actionError && (
            <div className="flex items-center gap-2 text-xs text-error">
              <AlertCircle className="size-3.5" />
              {actionError}
            </div>
          )}
          <button
            type="submit"
            disabled={!newFamilyName.trim() || createFamily.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-text-primary transition-all hover:opacity-90 disabled:opacity-50"
          >
            {createFamily.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Users className="size-3.5" />
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
            <div className="bg-primary/10 flex size-10 items-center justify-center rounded-xl">
              <Users className="size-5 text-primary" />
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
              className="bg-error/10 hover:bg-error/20 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-error transition-colors disabled:opacity-50"
            >
              {deleteFamily.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Trash2 className="size-3.5" />
              )}
              解散家庭
            </button>
          )}
        </div>
      </SettingsSection>

      <SettingsSection title="成员列表" description="邀请家人共同管理孩子的学习">
        <div className="space-y-3">
          {actionError && (
            <div className="bg-error/5 border-error/10 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs text-error">
              <AlertCircle className="size-3.5" />
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
              const canTransferOwner =
                isOwner && member.role !== 'OWNER' && member.status === 'ACTIVE';

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-elevated p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <MemberAvatar member={member} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-bold text-text-primary">
                          {member.user.name || member.user.username}
                        </span>
                        {member.status === 'INVITED' && (
                          <span className="bg-warning/10 border-warning/20 rounded-full border px-1.5 py-0.5 text-2xs text-warning">
                            {STATUS_LABELS[member.status]}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <RoleIcon className="size-3" />
                        {ROLE_LABELS[member.role]}
                        <span className="text-text-tertiary">·</span>
                        <span className="truncate">{member.user.username}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {member.status === 'INVITED' && isMe && (
                      <button
                        onClick={() => handleAccept(member.id)}
                        disabled={updateMember.isPending}
                        className="bg-success/10 hover:bg-success/20 flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-success transition-colors"
                      >
                        <Check className="size-3.5" />
                        接受
                      </button>
                    )}

                    {canTransferOwner && (
                      <button
                        onClick={() => handleTransferOwner(member.id)}
                        disabled={transferOwner.isPending}
                        title="转让创建者身份"
                        className="bg-warning/10 hover:bg-warning/20 flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-warning transition-colors"
                      >
                        <Crown className="size-3.5" />
                        转让
                      </button>
                    )}

                    {canManage ? (
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleRoleChange(
                            member.id,
                            e.target.value as Exclude<FamilyMemberRole, 'OWNER'>
                          )
                        }
                        disabled={updateMember.isPending}
                        className="focus:border-primary/40 rounded-lg border border-border-subtle bg-surface-hover px-2 py-1.5 text-xs text-text-secondary focus:outline-none"
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
                        className="hover:bg-error/10 rounded-lg p-1.5 text-text-muted transition-colors hover:text-error"
                        title="移除成员"
                      >
                        <X className="size-4" />
                      </button>
                    )}

                    {isMe && member.role !== 'OWNER' && (
                      <button
                        onClick={() => handleLeaveFamily(member.id)}
                        disabled={removeMember.isPending}
                        title="退出家庭"
                        className="hover:bg-error/10 rounded-lg p-1.5 text-text-muted transition-colors hover:text-error"
                      >
                        <LogOut className="size-4" />
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
                  className="inline-flex items-center gap-1.5 rounded-lg bg-surface-hover px-3 py-2 text-xs text-text-secondary transition-colors hover:bg-surface-highlight"
                >
                  <UserPlus className="size-3.5" />
                  邀请成员
                </button>
              ) : (
                <form
                  onSubmit={handleInvite}
                  className="space-y-3 rounded-xl border border-border-subtle bg-surface-elevated p-3"
                >
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
                          setGeneratedInvite(null);
                          setCopied(false);
                        }}
                        className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${
                          inviteMode === mode.value
                            ? 'bg-primary/10 text-primary'
                            : 'bg-surface-hover text-text-tertiary hover:text-text-secondary'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-xs text-text-secondary">
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
                          className="focus:border-primary/40 w-full rounded-lg border border-border-subtle bg-surface-hover px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                        />
                      ) : inviteMode === 'email' ? (
                        <input
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="对方的邮箱地址"
                          className="focus:border-primary/40 w-full rounded-lg border border-border-subtle bg-surface-hover px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                        />
                      ) : (
                        <input
                          type="tel"
                          value={invitePhone}
                          onChange={(e) => setInvitePhone(e.target.value)}
                          placeholder="对方的手机号码"
                          className="focus:border-primary/40 w-full rounded-lg border border-border-subtle bg-surface-hover px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                        />
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs text-text-secondary">权限</label>
                      <select
                        value={inviteRole}
                        onChange={(e) =>
                          setInviteRole(e.target.value as Exclude<FamilyMemberRole, 'OWNER'>)
                        }
                        className="focus:border-primary/40 w-full rounded-lg border border-border-subtle bg-surface-hover px-3 py-2 text-sm text-text-primary focus:outline-none"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <p className="text-2xs text-text-muted">
                    {ROLE_OPTIONS.find((o) => o.value === inviteRole)?.description}
                  </p>

                  {inviteSuccess && (
                    <div className="bg-success/5 border-success/10 rounded-lg border px-3 py-2 text-xs text-success">
                      {inviteSuccess}
                    </div>
                  )}

                  {generatedInvite && (
                    <div className="space-y-2 rounded-lg border border-border-subtle bg-surface-hover p-3">
                      <p className="text-xs text-text-secondary">
                        邀请链接已生成，请复制或打开下方链接发送给对方：
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={generatedInvite.url}
                          className="min-w-0 flex-1 rounded-md border border-border-subtle bg-surface-elevated px-2.5 py-1.5 text-xs text-text-secondary focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(generatedInvite.url);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            } catch {
                              // ignore
                            }
                          }}
                          className="bg-primary/10 hover:bg-primary/20 inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs text-primary transition-colors"
                        >
                          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                          {copied ? '已复制' : '复制'}
                        </button>
                        <a
                          href={generatedInvite.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md border border-border-subtle bg-surface-elevated px-2.5 py-1.5 text-xs text-text-secondary transition-colors hover:bg-surface-highlight"
                        >
                          打开链接
                        </a>
                      </div>
                      <p className="text-2xs text-text-muted">
                        链接有效期至 {new Date(generatedInvite.expiresAt).toLocaleString('zh-CN')}
                      </p>
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
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-text-primary transition-all hover:opacity-90 disabled:opacity-50"
                    >
                      {inviteMember.isPending || inviteUnregistered.isPending ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Plus className="size-3.5" />
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
                        setGeneratedInvite(null);
                        setCopied(false);
                      }}
                      className="rounded-lg px-3 py-1.5 text-xs text-text-secondary transition-colors hover:text-text-primary"
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
