'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TaskLibrarySettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/task-library');
  }, [router]);

  return null;
}
