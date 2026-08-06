/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output is intended for Docker/deployment. Local QA should run
  // `node .next/standalone/server.js` after building, because `next start`
  // has Edge-runtime issues with the auth middleware in this project.
  output: 'standalone',
  images: {
    unoptimized: true,
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
