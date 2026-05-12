"use client";

import LZString from "lz-string";
import { Portfolio } from "@/types/portfolio";

// Encodes the whole portfolio into a URL-safe compressed string,
// suitable for the URL hash so anyone visiting the link sees the user's data.
//
// Note: this is read-only sharing — the recipient sees a snapshot.
// Edits in their admin go to their own localStorage.

const HASH_PREFIX = "p=";

export function encodePortfolio(p: Portfolio): string {
  const json = JSON.stringify(p);
  return LZString.compressToEncodedURIComponent(json);
}

export function decodePortfolio(encoded: string): Portfolio | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    return JSON.parse(json) as Portfolio;
  } catch {
    return null;
  }
}

export function buildShareUrl(p: Portfolio): string {
  if (typeof window === "undefined") return "";
  const enc = encodePortfolio(p);
  const origin = window.location.origin;
  const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/^\/+|\/+$/g, "");
  const path = base ? `/${base}/` : "/";
  return `${origin}${path}#${HASH_PREFIX}${enc}`;
}

export function readPortfolioFromHash(): Portfolio | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash;
  if (!hash || !hash.includes(HASH_PREFIX)) return null;
  const enc = hash.slice(hash.indexOf(HASH_PREFIX) + HASH_PREFIX.length);
  return decodePortfolio(enc);
}
