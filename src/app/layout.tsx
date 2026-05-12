import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import AdminAccess from "@/components/admin-access";
import FirstTimeSetup from "@/components/first-time-setup";
import DynamicHead from "@/components/dynamic-head";
import ScrollProgress from "@/components/scroll-progress";
import StickyHireMe from "@/components/sticky-hire-me";
import JsonLd from "@/components/json-ld";
import { ToastProvider } from "@/components/ui/toast";
import { UpgradeProvider } from "@/components/upgrade-modal";
import FeedbackWidget from "@/components/feedback-widget";
import ReferralCapture from "@/components/referral-capture";
import LaunchBanner from "@/components/launch-banner";
import CommandPalette from "@/components/command-palette";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const SITE_URL = "https://hyred.io";
const SITE_TITLE = "Hyred — AI resume + portfolio builder for students";
const SITE_DESC = "Get Hyred in 7 minutes flat. Paste your resume, get a live portfolio site, ATS-optimized PDF, AI cover letters, mock interviews, and a job tracker. Free forever with your own AI key. Pro $9 once — no subscriptions.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · Hyred",
  },
  description: SITE_DESC,
  keywords: [
    "AI resume builder",
    "portfolio builder",
    "ATS resume",
    "free resume builder",
    "AI cover letter",
    "mock interview AI",
    "GitHub README generator",
    "LinkedIn optimizer",
    "students resume",
    "developer portfolio",
    "Resume.io alternative",
    "Rezi alternative",
    "Enhancv alternative",
  ],
  applicationName: "Hyred",
  authors: [{ name: "Hyred" }],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESC,
    type: "website",
    url: SITE_URL,
    siteName: "Hyred",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    creator: "@hyred",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  alternates: { canonical: SITE_URL },
  category: "productivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <JsonLd />
      </head>
      <body className="antialiased font-sans bg-white text-gray-900">
        <ToastProvider>
          <UpgradeProvider>
            <ReferralCapture />
            <DynamicHead />
            <ScrollProgress />
            <LaunchBanner />
            <Navigation />
            <main className="pt-16 min-h-screen">
              {children}
            </main>
            <Footer />
            <FeedbackWidget />
            <StickyHireMe />
            <CommandPalette />
            <AdminAccess />
            <FirstTimeSetup />
          </UpgradeProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
