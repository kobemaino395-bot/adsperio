import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  allowedDevOrigins: ['127.0.0.1', '103.82.23.180'],
  experimental: {
    proxyClientMaxBodySize: '30mb',
  },
  async redirects() {
    return [
      // Legacy /d/ URLs -> /k/
      {
        source: '/d/ads-manager-04-06/assignment',
        destination: '/k/take-home',
        permanent: false,
      },
      {
        source: '/d/policy/remote',
        destination: '/k/remote-policy',
        permanent: false,
      },
      {
        source: '/d/ads-manager-test-04/answer-key',
        destination: 'https://anzivota.com/d/ads-manager-test',
        permanent: false,
        basePath: false,
      },
      // Legacy /u/ URLs -> /k/
      {
        source: '/u/:slug*',
        destination: '/k/:slug*',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;