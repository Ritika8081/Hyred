"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { usePortfolioData } from "@/hooks/usePortfolioData";

const TOOLS = [
  {
    href: "/tools/recruiter-view",
    emoji: "👀",
    title: "Recruiter View Simulator",
    tagline: "Paste a JD. AI plays a senior recruiter — gives you the snap verdict and what would flip a pass to an interview.",
    badge: "New",
  },
  {
    href: "/tools/quantify",
    emoji: "📊",
    title: "Impact Quantifier",
    tagline: "Vague bullet → measurable impact in 3 styles. Stops your resume sounding generic.",
    badge: "New",
  },
  {
    href: "/tools/recruiter-reply",
    emoji: "✉️",
    title: "Recruiter Reply",
    tagline: "Paste a recruiter's DM. Get 3 polished reply drafts (interested / more info / not now / decline).",
    badge: "New",
  },
  {
    href: "/tools/company-prep",
    emoji: "🏢",
    title: "Company Interview Prep",
    tagline: "Interview tomorrow? AI builds a one-page brief: positioning, interview style, smart questions, red flags.",
    badge: "New",
  },
  {
    href: "/tools/roast",
    emoji: "🔥",
    title: "Roast My Resume",
    tagline: "Brutally honest AI critique. Shareable card. Survive it and brag.",
    badge: "Shareable",
  },
  {
    href: "/tools/apply",
    emoji: "🎯",
    title: "Application Pack",
    tagline: "One JD → cover letter + cold email + LinkedIn DM + thank-you. 4 outputs, one click.",
  },
  {
    href: "/tools/match",
    emoji: "🧲",
    title: "JD Matcher",
    tagline: "Paste any job description. See your match score. AI tailors your bio.",
  },
  {
    href: "/tools/linkedin",
    emoji: "💼",
    title: "LinkedIn Optimizer",
    tagline: "Recruiter-magnet headline + About + experience bullets. Paste straight into LinkedIn.",
    badge: "New",
  },
  {
    href: "/tools/readme",
    emoji: "🐙",
    title: "GitHub README Builder",
    tagline: "Beautiful profile README from your portfolio. Recruiters Google your GitHub first.",
    badge: "Devs love it",
  },
  {
    href: "/tools/cover-letter",
    emoji: "📝",
    title: "Cover Letter Generator",
    tagline: "Tailored cover letter in 4 tones, ready in 10 seconds.",
  },
  {
    href: "/tools/interview",
    emoji: "🎤",
    title: "AI Mock Interview",
    tagline: "Real questions based on your resume. Practice. Get scored. Win.",
  },
  {
    href: "/tools/skills",
    emoji: "📈",
    title: "Skill Gap Analyzer",
    tagline: "Tell us your target role. AI shows exactly what to learn and what to build to get there.",
    badge: "New",
  },
  {
    href: "/tools/salary",
    emoji: "💰",
    title: "Salary Negotiator",
    tagline: "Paste your offer. AI gives you the script + market data to push for more. Worth $1000s.",
    badge: "New",
  },
  {
    href: "/tools/projects",
    emoji: "💡",
    title: "Project Idea Generator",
    tagline: "Stop building TODO apps. 4 portfolio-worthy ideas matched to your gaps + target role.",
    badge: "New",
  },
  {
    href: "/tools/tracker",
    emoji: "📋",
    title: "Application Tracker",
    tagline: "Kanban board for your job hunt. Track every application from Saved → Offer.",
    badge: "Free",
  },
  {
    href: "/tools/coach",
    emoji: "🧭",
    title: "AI Career Coach",
    tagline: "Senior tech mentor that has read your resume. Ask anything.",
    badge: "Free",
  },
  {
    href: "/admin",
    emoji: "🐙",
    title: "GitHub Auto-Import",
    tagline: "Paste your GitHub username. Projects fill themselves in.",
  },
  {
    href: "/admin",
    emoji: "✨",
    title: "AI Rewrites Everywhere",
    tagline: "Click the ✨ on any text field. Polish bios, achievements, descriptions.",
  },
  {
    href: "/admin",
    emoji: "🎯",
    title: "ATS Health Score",
    tagline: "Live 0-100 score with 17 specific checks. Climbs as you fix things.",
  },
  {
    href: "/resume",
    emoji: "🖨️",
    title: "Printable Resume",
    tagline: "One-click PDF export. ATS-clean layout. From the same data.",
  },
];

export default function ToolsHubPage() {
  const { data } = usePortfolioData();
  const gradFrom = data.personalInfo.brand?.gradientFrom || "#2563eb";
  const gradTo = data.personalInfo.brand?.gradientTo || "#0d9488";

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-white">
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <div
              className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}
            >
              <Sparkles size={12} />
              AI tools for job seekers
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-gray-900 mb-3 tracking-tightest leading-[1.05]">
              Every tool you need to <span className="gradient-text italic font-normal">land the interview.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for students and early-career engineers. Free forever. Bring your own AI key.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map(t => (
              <StaggerItem key={t.title}>
                <Link href={t.href} className="block h-full">
                  <Card className="h-full group" hover={false}>
                    <CardContent className="p-6 relative">
                      {t.badge && (
                        <span
                          className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold text-white shadow"
                          style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}
                        >
                          {t.badge}
                        </span>
                      )}
                      <div className="text-4xl mb-3">{t.emoji}</div>
                      <h2 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-1.5">
                        {t.title}
                        <ArrowRight
                          size={16}
                          className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition"
                        />
                      </h2>
                      <p className="text-sm text-gray-600 leading-relaxed">{t.tagline}</p>
                    </CardContent>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-4">
              All tools run in your browser with your own AI key. Your data never leaves your device.
            </p>
            <Link href="/admin">
              <button
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition"
                style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}
              >
                <Sparkles size={16} />
                Set up AI (free) → start using
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
