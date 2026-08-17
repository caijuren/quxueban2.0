'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: '1rem',
            fontFamily: 'system-ui, sans-serif',
            padding: '1.5rem',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>页面出错了</h2>
          <p style={{ color: '#666' }}>我们已记录该问题，请稍后重试。</p>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: '#2563eb',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            重试
          </button>
        </div>
      </body>
    </html>
  );
}
