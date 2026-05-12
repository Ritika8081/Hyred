"use client";

// Centralized localStorage keys + one-time migration from legacy "foliaro*" keys.

export const STORAGE_KEYS = {
  aiConfig: "hyredAIConfig",
  proLicense: "hyredProLicense",
  feedbackHistory: "hyredFeedbackHistory",
} as const;

const LEGACY_KEYS: Record<keyof typeof STORAGE_KEYS, string> = {
  aiConfig: "foliaroAIConfig",
  proLicense: "foliaroProLicense",
  feedbackHistory: "foliaroFeedbackHistory",
};

let migrated = false;

/**
 * Idempotent. Reads any legacy "foliaro*" keys still in localStorage and
 * copies their values to the new "hyred*" keys, then deletes the old ones.
 * Safe to call on every page load — the work happens once per browser.
 */
export function migrateLegacyKeys(): void {
  if (typeof window === "undefined" || migrated) return;
  migrated = true;
  try {
    for (const k of Object.keys(STORAGE_KEYS) as Array<keyof typeof STORAGE_KEYS>) {
      const newKey = STORAGE_KEYS[k];
      const legacyKey = LEGACY_KEYS[k];
      if (!localStorage.getItem(newKey) && localStorage.getItem(legacyKey)) {
        localStorage.setItem(newKey, localStorage.getItem(legacyKey)!);
      }
      if (localStorage.getItem(legacyKey)) {
        localStorage.removeItem(legacyKey);
      }
    }
  } catch {
    // localStorage might be unavailable (private mode) — fine to swallow.
  }
}
