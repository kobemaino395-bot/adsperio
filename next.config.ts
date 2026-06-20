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
        source: '/d/ads-manager-04-06/assignment',
        destination: '/api/downloads/take-home',
        permanent: false,
      },
      // Short link for the remote work policy PDF
      {
        source: '/d/policy/remote',
        destination: '/api/downloads/remote-policy',
        permanent: false,
      },
      // Answer key lives on the Anzivota project; redirect to it
      {
        source: '/d/ads-manager-test-04/answer-key',
        destination: 'https://anzivota.com/api/downloads/ads-manager-test',
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;