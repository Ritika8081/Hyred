"use client";

// Lightweight client-side referral tracking.
// Real attribution needs a backend later — this captures intent + builds the loop.

const CODE_KEY = "hyredReferralCode";
const ATTRIB_KEY = "hyredReferredBy"; // who referred ME (if I came in via a ref)
const COUNT_KEY = "hyredReferralCount"; // count of times my code was seen

function makeCode(): string {
  // short readable code (8 chars)
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let c = "";
  for (let i = 0; i < 8; i++) {
    c += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return c;
}

export function getMyReferralCode(): string {
  if (typeof window === "undefined") return "";
  let code = localStorage.getItem(CODE_KEY);
  if (!code) {
    code = makeCode();
    localStorage.setItem(CODE_KEY, code);
  }
  return code;
}

export function getMyReferralUrl(): string {
  if (typeof window === "undefined") return "";
  const code = getMyReferralCode();
  const origin = window.location.origin;
  const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/^\/+|\/+$/g, "");
  const path = base ? `/${base}/` : "/";
  return `${origin}${path}?ref=${code}`;
}

/** Call on every page load. If URL has ?ref=XXX, store it. */
export function captureReferralFromUrl(): void {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    const ref = url.searchParams.get("ref");
    if (ref && !localStorage.getItem(ATTRIB_KEY)) {
      localStorage.setItem(ATTRIB_KEY, ref);
    }
  } catch {}
}

export function getReferredBy(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ATTRIB_KEY);
}

/**
 * Local-only tally. Increments when someone visits MY portfolio (share URL with their own ref param).
 * This is intentionally informational — real referral attribution requires a server.
 * The UI displays this as "estimated invites" so users understand it's local.
 */
export function bumpReferralCount(): void {
  if (typeof window === "undefined") return;
  const n = Number(localStorage.getItem(COUNT_KEY) || "0") + 1;
  localStorage.setItem(COUNT_KEY, String(n));
}

export function getReferralCount(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(COUNT_KEY) || "0");
}
