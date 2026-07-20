import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '**.r2.dev' },
      { protocol: 'http', hostname: 'localhost', port: '5000' },
      // ismora.api file uploads — local storage (dev) and S3 (prod)
      { protocol: 'http', hostname: 'localhost', port: '8000' },
      { protocol: 'https', hostname: '**.s3.**.amazonaws.com' },
    ],
  },
};

export default nextConfig;
