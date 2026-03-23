/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@manlydude/shared'],

  // Required for Vercel monorepo deployments with pnpm
  outputFileTracingRoot: require('path').join(__dirname, '../../'),

  // Security headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
