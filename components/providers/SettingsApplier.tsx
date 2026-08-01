'use client';

import { useEffect } from 'react';
import { applySettingsToDocument } from '@/lib/settings';
import { useUser } from '@/lib/hooks/useUser';

export function SettingsApplier() {
  const { data: user } = useUser();

  useEffect(() => {
    if (user?.settings) {
      applySettingsToDocument(user.settings);
    }
  }, [user?.settings]);

  return null;
}
