import type { NextConfig } from "next";

// SECURITY: Security headers for all routes
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; frame-src https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; connect-src 'self' https://*.supabase.co https://api.stripe.com; font-src 'self' data:;"
  }
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  images: {
    // SECURITY: Removed dangerouslyAllowSVG to prevent XSS via SVG uploads
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
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
