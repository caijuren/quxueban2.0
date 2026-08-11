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

export default nextConfig;
