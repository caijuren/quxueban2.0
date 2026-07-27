/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output is intended for Docker/deployment. Local QA should run
  // `node .next/standalone/server.js` after building, because `next start`
  // has Edge-runtime issues with the auth middleware in this project.
  output: 'standalone',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
