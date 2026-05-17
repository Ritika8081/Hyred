// Server component — emits JSON-LD structured data for Google rich results.

const SITE_URL = "https://hyred.io";

// IMPORTANT: never add aggregateRating here unless you have REAL collected reviews.
// Google penalizes fake ratings (and they're easy to spot). Add it only after you've
// gathered genuine reviews via the feedback widget.
const SOFTWARE_APP = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Hyred",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "Open-source AI resume + portfolio builder. Free forever, MIT-licensed, runs entirely in your browser. Includes 10 AI tools for the job hunt.",
  url: SITE_URL,
  offers: [
    { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
  ],
  license: "https://opensource.org/licenses/MIT",
  codeRepository: "https://github.com/Ritika8081/Hyred",
  featureList: [
    "AI resume rewrites",
    "ATS health score",
    "Roast My Resume",
    "JD Matcher",
    "Cover Letter Generator",
    "AI Mock Interview",
    "GitHub README Generator",
    "LinkedIn Optimizer",
    "Application Tracker",
    "AI Career Coach",
    "Printable PDF resume",
    "One-click deploy",
  ],
};

const ORG = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Hyred",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
};

const FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Hyred free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The free tier includes the full portfolio builder, ATS score, printable PDF, all AI tools (with your own free Groq or OpenRouter key), GitHub auto-import, and a shareable portfolio URL.",
      },
    },
    {
      "@type": "Question",
      name: "Is Hyred a subscription?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No — Hyred is free and open source (MIT-licensed). The only cost is the AI key you bring (Groq and OpenRouter both offer free tiers).",
      },
    },
    {
      "@type": "Question",
      name: "How is Hyred different from Resume.io or Rezi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hyred builds both a portfolio website AND a printable resume from the same data. AI knows your full context, not generic prompts. Free tier is fully functional — competitors paywall basic features like PDF download.",
      },
    },
    {
      "@type": "Question",
      name: "Do I own my data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Completely. Everything lives in your browser's localStorage. Export as JSON anytime. Even if Hyred shuts down, your data and deployed portfolio keep working.",
      },
    },
  ],
};

export default function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_APP) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ) }}
      />
    </>
  );
}
