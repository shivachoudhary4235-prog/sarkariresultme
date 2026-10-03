import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Preserve existing Sarkari Result behavior
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(process.cwd(), '../../'),

  // Images from Supabase Storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // All environment variables that go to browser are NEXT_PUBLIC_
  // SERVER-ONLY vars (SUPABASE_SECRET_KEY, GEMINI_API_KEY) are never exposed
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
  },
};

export default nextConfig;
