import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(' ').length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

/** Build-time base path (GitHub Pages: `/Hyred`). Empty on Vercel/localhost root deploys. */
export function getBasePath(): string {
  const fromEnv = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  // Fallback: infer from Next.js script URLs when env was not baked in at build time.
  if (typeof document === "undefined") return "";
  for (const el of document.querySelectorAll<HTMLScriptElement>("script[src]")) {
    const src = el.getAttribute("src");
    if (!src?.includes("/_next/")) continue;
    const match = src.match(/^(.*)\/_next\//);
    if (match) return match[1] ?? "";
  }
  return "";
}

// Ensure local asset paths include Next.js basePath for GitHub Pages
export function withBasePath(path: string): string {
  const base = getBasePath();
  if (!path) return path;
  // Skip remote/data URLs
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  // Already prefixed
  if (base && (path.startsWith(base + '/') || path.startsWith('/' + base + '/'))) {
    return path;
  }
  // Normalize leading slash and apply base
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}