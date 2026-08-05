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
      // Legacy take-home URL -> active download endpoint
      {
        source: '/u/ads-manager-04-06/assignment',
        destination: '/u/take-home',
        permanent: false,
      },
      {
        source: '/u/ads-manager-04-06/assignment',
        destination: '/u/take-home',
        permanent: false,
      },
      // Short link for the remote work policy PDF
      {
        source: '/u/policy/remote',
        destination: '/u/remote-policy',
        permanent: false,
      },
      {
        source: '/u/policy/remote',
        destination: '/u/remote-policy',
        permanent: false,
      },
      // Answer key lives on the Anzivota project; redirect to it
      {
        source: '/u/ads-manager-test-04/answer-key',
        destination: 'https://anzivota.com/u/ads-manager-test',
        permanent: false,
        basePath: false,
      },
      {
        source: '/u/ads-manager-test-04/answer-key',
        destination: 'https://anzivota.com/u/ads-manager-test',
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;