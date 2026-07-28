'use client';

import { useEffect } from 'react';
import { applySettingsToDocument, UserWithSettings } from '@/lib/settings';

export function SettingsApplier() {
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/api/user/me');
        if (!res.ok) return;
        const user: UserWithSettings = await res.json();
        if (!cancelled) {
          applySettingsToDocument(user.settings);
        }
      } catch {
        // Ignore transient failures; defaults are already in CSS.
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
