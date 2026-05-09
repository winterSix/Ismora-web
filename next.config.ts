import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '**.r2.dev' },
      { protocol: 'http', hostname: 'localhost', port: '5000' },
    ],
  },
};

export default nextConfig;
