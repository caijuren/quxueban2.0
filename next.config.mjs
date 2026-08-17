import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output is intended for Docker/deployment. Local QA should run
  // `node .next/standalone/server.js` after building, because `next start`
  // has Edge-runtime issues with the auth middleware in this project.
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), geolocation=(), payment=(), usb=()',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Legacy console routes now live under /dashboard/settings
      {
        source: '/dashboard/console',
        destination: '/dashboard/settings/account',
        permanent: true,
      },
      {
        source: '/dashboard/console/:path*',
        destination: '/dashboard/settings/account',
        permanent: true,
      },
    ];
  },
};

// 仅在提供了 Sentry 组织/项目/令牌时才启用（含构建期 sourcemap 上传）；
// 未配置时 withSentryConfig 不做任何上传，运行时零副作用。
const sentryBuildOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  // 隐藏 sourcemap 中的源码路径，避免泄露服务器目录结构
  hideSourceMaps: true,
  // 关闭 Sentry 的遥测上报
  telemetry: false,
};

const shouldEnableSentry = Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);

export default shouldEnableSentry
  ? withSentryConfig(nextConfig, sentryBuildOptions)
  : nextConfig;
