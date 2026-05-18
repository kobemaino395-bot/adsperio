import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  allowedDevOrigins: ['127.0.0.1', '103.82.23.180'],
};

export default nextConfig;