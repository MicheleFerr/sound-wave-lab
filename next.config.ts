import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    localPatterns: [
      {
        pathname: '/api/placeholder/**',
        search: '',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'fcfzxgvttqsslhijwjoy.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
