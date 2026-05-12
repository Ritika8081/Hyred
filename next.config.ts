import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
// GitHub Pages basePath. Must match your repo name exactly.
// After renaming the GitHub repo from "Foliaro" to "Hyred", this stays correct.
const basePath = isProd ? '/Hyred' : '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  eslint: {
    // Temporarily disable ESLint during builds due to flatCache compatibility issue
    ignoreDuringBuilds: true,
  },
  images: {
    // GitHub Pages does not support the Next.js image optimizer
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      }
    ],
  },
};

export default nextConfig;
