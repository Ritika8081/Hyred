// Single config for everything money-related.
// Replace these URLs with your real Stripe Payment Link, Gumroad product, or Lemon Squeezy URL.

export const MONETIZATION = {
  // 👉 Paste your Stripe Payment Link / Gumroad / Lemon Squeezy URL here
  checkoutUrl: "https://buy.stripe.com/test_REPLACE_ME",

  // Student .edu discount link (separate Stripe link with 50% off coupon baked in)
  studentCheckoutUrl: "https://buy.stripe.com/test_STUDENT_REPLACE_ME",

  // Feedback / support
  feedbackEmail: "feedback@hyred.io",
  supportEmail: "support@hyred.io",

  // Tweet share copy for the Roast card
  roastTweetTemplate: "My resume just got roasted by @hyred 🔥 Try the brutal honest AI critique →",

  // Pricing display
  proPrice: 9,
  proPriceUSD: "$9",
  proRegularPriceUSD: "$29",
  studentPrice: 4.5,
  studentPriceUSD: "$4.50",
  lifetimePrice: 49,
  lifetimePriceUSD: "$49",
  lifetimeRegularPriceUSD: "$149",
  launchPriceEndsAt: "2026-06-30", // YYYY-MM-DD — auto-renders countdown banner until this date. Set to past date or "" to disable.
  moneyBackDays: 7,
  seatsLeft: 0, // Set to a real remaining count (e.g. 47) only if you're running a true limited launch. 0 hides the banner.

  // Free tier daily limits — encourages Pro upgrade
  freeAICallsPerDay: 10,

  // Stripe Payment Link for lifetime tier
  lifetimeCheckoutUrl: "https://buy.stripe.com/test_LIFETIME_REPLACE_ME",

  // Social-proof numbers — leave at 0 until you have REAL data.
  // Components that render these will hide themselves when values are 0/empty.
  // Update them as you grow.
  stats: {
    resumesBuilt: 0,
    avgAtsLift: "",       // e.g. "+38%" once you measure it
    avgBuildMinutes: 0,   // e.g. 7 once you have analytics
    ratingValue: 0,       // e.g. 4.9 once you have real reviews
    ratingCount: 0,       // total real review count
  },
};

export type CheckoutTier = "pro" | "student" | "lifetime";

export function openCheckout(tier: CheckoutTier | boolean = "pro") {
  // backward compat: openCheckout(true) means student
  if (typeof tier === "boolean") tier = tier ? "student" : "pro";
  const url =
    tier === "student"
      ? MONETIZATION.studentCheckoutUrl
      : tier === "lifetime"
      ? MONETIZATION.lifetimeCheckoutUrl
      : MONETIZATION.checkoutUrl;
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

import { STORAGE_KEYS, migrateLegacyKeys } from "@/lib/storage-keys";

// Pro license tracking — license key entered after Stripe success
export function hasPro(): boolean {
  if (typeof window === "undefined") return false;
  migrateLegacyKeys();
  return !!localStorage.getItem(STORAGE_KEYS.proLicense);
}

export function setPro(licenseKey: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.proLicense, licenseKey);
}

export function clearPro() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.proLicense);
}
