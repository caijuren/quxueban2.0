'use client';

import { useUser, useUpdateUser } from '@/lib/hooks/useUser';
import { UserWithSettings, applySettingsToDocument } from '@/lib/settings';

export function useConsoleSettings() {
  const { data: user, isLoading, error } = useUser();
  const updateUser = useUpdateUser();

  const handleUpdate = async (updates: Partial<UserWithSettings>) => {
    const data = await updateUser.mutateAsync(updates);
    applySettingsToDocument(data.settings);
  };

  return {
    user,
    isLoading,
    error,
    handleUpdate,
  };
}
