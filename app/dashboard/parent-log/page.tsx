'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ParentLogRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/settings/parent-log');
  }, [router]);

  return null;
}
