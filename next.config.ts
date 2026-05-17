import type { NextConfig } from "next";

// basePath is only needed when deploying to GitHub Pages (or another host
// that serves the site from a sub-path). Vercel / Netlify / Cloudflare Pages
// serve from the root and must NOT use a basePath — otherwise every
// `/_next/*` asset 404s and the page renders unstyled.
//
// Set BASE_PATH=/Hyred in the GitHub Actions workflow (already wired below).
// Leave BASE_PATH unset everywhere else.
const basePath = process.env.BASE_PATH || '';

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
