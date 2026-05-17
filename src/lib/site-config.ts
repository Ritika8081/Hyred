// Single config for non-money site bits. Hyred is fully free + open source —
// everything that used to be Pro is now available to everyone.

export const SITE = {
  // Address used by the in-app feedback widget (`mailto:` target)
  feedbackEmail: "hello@hyred.app",
  // Same address, kept under a separate key for places that semantically
  // want a "support" address (footer, deploy docs, etc.)
  supportEmail: "hello@hyred.app",

  // Tweet share copy for the Roast card
  roastTweetTemplate:
    "My resume just got roasted by @hyred 🔥 Try the brutal honest AI critique →",

  // Social-proof numbers — leave at 0 until you have REAL data.
  // Components that render these will hide themselves when values are 0/empty.
  stats: {
    portfoliosBuilt: 0,
    avgAtsLift: "",
    avgBuildMinutes: 0,
    ratingValue: 0,
    ratingCount: 0,
  },
} as const;
