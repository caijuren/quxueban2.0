import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FamilyCreateInput,
  FamilyInviteInput,
  FamilyInviteCreateInput,
  FamilyMemberUpdateInput,
} from '@/lib/validation';

export interface FamilyMember {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  status: 'INVITED' | 'ACTIVE' | 'DISABLED';
  invitedAt: string;
  joinedAt: string | null;
  user: {
    id: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
  };
}

export interface Family {
  id: string;
  name: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  members: FamilyMember[];
}

async function fetchFamily(): Promise<{
  family: Family | null;
  role: FamilyMember['role'] | null;
  currentUserId: string | null;
}> {
  const res = await fetch('/api/family');
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || '获取家庭信息失败');
  }
  return res.json();
}

async function createFamily(
  input: FamilyCreateInput
): Promise<{ family: Family; role: FamilyMember['role']; currentUserId: string }> {
  const res = await fetch('/api/family', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || '创建家庭失败');
  return data;
}

async function inviteMember(input: FamilyInviteInput): Promise<{ member: FamilyMember }> {
  const res = await fetch('/api/family/members', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || '邀请失败');
  return data;
}

async function updateMember(
  id: string,
  input: FamilyMemberUpdateInput
): Promise<{ member: FamilyMember }> {
  const res = await fetch(`/api/family/members/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || '更新失败');
  return data;
}

async function removeMember(id: string): Promise<void> {
  const res = await fetch(`/api/family/members/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || '移除失败');
  }
}

async function inviteUnregistered(input: FamilyInviteCreateInput): Promise<{
  invite: { token: string; email: string | null; phone: string | null; expiresAt: string };
  message: string;
}> {
  const res = await fetch('/api/family/invites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || '创建邀请失败');
  return data;
}

async function transferOwner(id: string): Promise<void> {
  const res = await fetch(`/api/family/members/${id}/transfer-owner`, { method: 'POST' });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || '转让失败');
  }
}

async function deleteFamily(): Promise<void> {
  const res = await fetch('/api/family', { method: 'DELETE' });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || '解散家庭失败');
  }
}

export function useFamily() {
  return useQuery({
    queryKey: ['family'],
    queryFn: fetchFamily,
    staleTime: 1000 * 30,
  });
}

export function useCreateFamily() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFamily,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['family'] }),
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inviteMember,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['family'] }),
  });
}

export function useUpdateFamilyMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: FamilyMemberUpdateInput }) =>
      updateMember(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['family'] }),
  });
}

export function useRemoveFamilyMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeMember,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['family'] }),
  });
}

export function useInviteUnregistered() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: inviteUnregistered,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['family'] }),
  });
}

export function useTransferFamilyOwner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transferOwner,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['family'] }),
  });
}

export function useDeleteFamily() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFamily,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['family'] }),
  });
}
