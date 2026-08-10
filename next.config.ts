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
      // Legacy /d/ URL -> external. The download-route redirects that used to
      // live here hardcoded /k/, which the admin panel can now rotate; they
      // would have gone dead on the first rotation, so they were removed.
      {
        source: '/d/ads-manager-test-04/answer-key',
        destination: 'https://anzivota.com/d/ads-manager-test',
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;