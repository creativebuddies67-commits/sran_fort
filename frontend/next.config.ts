import type { NextConfig } from 'next';

function getStrapiImagePattern() {
  const url = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!url) return null;

  try {
    const parsed = new URL(url);
    return {
      protocol: parsed.protocol.replace(':', '') as 'http' | 'https',
      hostname: parsed.hostname,
      ...(parsed.port ? { port: parsed.port } : {}),
      pathname: '/uploads/**',
    };
  } catch {
    return null;
  }
}

const strapiImagePattern = getStrapiImagePattern();

const nextConfig: NextConfig = {
  // Allow LAN/mobile access during development (e.g. http://192.168.x.x:3000)
  allowedDevOrigins: [
    '192.168.11.196',
    'localhost',
    '127.0.0.1',
    'sranfortpalace.com',
    'www.sranfortpalace.com',
  ],
  images: {
    // Next.js 16 blocks localhost/private IPs by default (SSRF protection).
    // Required when Strapi runs on localhost:1337 during development.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.11.196',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.sranfortpalace.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      ...(strapiImagePattern ? [strapiImagePattern] : []),
    ],
  },
};

export default nextConfig;
