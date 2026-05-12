"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Wand2,
  Target,
  Mic,
  Flame,
  Github,
  Linkedin as LinkedinIcon,
  FileText,
  Briefcase,
  TrendingUp,
  DollarSign,
  Lightbulb,
  Bot,
  ListTodo,
  Eye,
  Shield,
  Zap,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MarketingHero from "@/components/marketing-hero";
import TrustBand from "@/components/trust-band";
import { AnimatedSection, FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { MONETIZATION, openCheckout } from "@/lib/monetization";

const STEPS = [
  {
    n: 1,
    title: "Paste your resume",
    body: "Drag a PDF or paste text. AI extracts roles, skills, and projects in 30 seconds.",
    emoji: "📄",
  },
  {
    n: 2,
    title: "Polish with AI",
    body: "Click ✨ on any field to rewrite. Use the toolkit: Roast, JD Match, Cover Letter, Interview prep.",
    emoji: "✨",
  },
  {
    n: 3,
    title: "Share or deploy",
    body: "Copy your portfolio link and send to recruiters. Or one-click deploy to your own domain.",
    emoji: "🚀",
  },
];

const TOOLS = [
  { emoji: "🔥", title: "Roast My Resume", body: "Brutal AI critique on a shareable card.", href: "/tools/roast", color: "from-red-500 to-orange-500" },
  { emoji: "🎯", title: "Application Pack", body: "Cover letter + cold email + LinkedIn DM + thank-you. One JD, one click.", href: "/tools/apply", color: "from-blue-500 to-cyan-500" },
  { emoji: "🧲", title: "JD Matcher", body: "Paste any job description. See match %. AI tailors your bio to it.", href: "/tools/match", color: "from-purple-500 to-pink-500" },
  { emoji: "🎤", title: "Mock Interview", body: "Real questions based on YOUR resume. AI grades your answers.", href: "/tools/interview", color: "from-violet-500 to-purple-700" },
  { emoji: "💼", title: "LinkedIn Optimizer", body: "Recruiter-magnet headline + About + bullets. Paste into LinkedIn.", href: "/tools/linkedin", color: "from-sky-600 to-blue-700" },
  { emoji: "🐙", title: "GitHub README", body: "Beautiful profile README from your portfolio. Recruiters check first.", href: "/tools/readme", color: "from-gray-700 to-gray-900" },
  { emoji: "📈", title: "Skill Gap Analyzer", body: "Target a role. AI shows exactly what to learn + build to land it.", href: "/tools/skills", color: "from-emerald-500 to-teal-600" },
  { emoji: "💰", title: "Salary Negotiator", body: "Paste your offer. Get a script + market data to push for more.", href: "/tools/salary", color: "from-amber-500 to-orange-600" },
  { emoji: "💡", title: "Project Idea Generator", body: "Stop building TODO apps. Get ideas matched to your gaps.", href: "/tools/projects", color: "from-fuchsia-500 to-pink-600" },
];

const PAIN_BOXES = [
  {
    pain: "Resume.io makes you pay $16/mo just to download YOUR resume.",
    fix: "PDF download always free.",
  },
  {
    pain: "Rezi's AI gives generic advice — it doesn't know YOUR experience.",
    fix: "Our AI reads your full portfolio. Every suggestion is yours.",
  },
  {
    pain: "ChatGPT can rewrite, but it can't build a portfolio site for you.",
    fix: "Both. From the same data.",
  },
  {
    pain: "Subscriptions stack up while you're job hunting.",
    fix: "$9 once. Or $0 forever with your own API key.",
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      <MarketingHero />
      <TrustBand />

      {/* How it works — 3 steps */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-500 mb-3">
              How it works
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-gray-900 tracking-tighter">
              Three steps. Zero learning curve.
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map(s => (
              <StaggerItem key={s.n}>
                <Card className="h-full text-center" hover={false}>
                  <CardContent className="p-8">
                    <div className="text-5xl mb-4">{s.emoji}</div>
                    <div className="font-display text-sm font-bold text-brand-600 mb-2 uppercase tracking-wider">
                      Step {s.n}
                    </div>
                    <h3 className="font-display text-xl font-semibold text-gray-900 mb-2 tracking-tight">
                      {s.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="text-center mt-10">
            <Link href="/build">
              <Button size="lg">
                <Sparkles size={16} className="mr-2" />
                Start building — free
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
            <p className="text-xs text-gray-500 mt-3">No credit card · No signup · Your data stays in your browser</p>
          </div>
        </div>
      </section>

      {/* Pain → Fix grid (anti-competitor positioning) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-500 mb-3">
              Why Hyred
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-gray-900 tracking-tighter">
              Built differently. <span className="gradient-text italic font-normal">On purpose.</span>
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {PAIN_BOXES.map(p => (
              <StaggerItem key={p.pain}>
                <Card className="h-full" hover={false}>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-500 line-through mb-3 leading-relaxed">
                      {p.pain}
                    </p>
                    <p className="text-base font-semibold text-gray-900 flex items-start gap-2">
                      <span className="text-emerald-600 mt-1 flex-shrink-0">→</span>
                      {p.fix}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="text-center mt-8">
            <Link href="/compare" className="text-sm font-semibold text-brand-700 hover:text-brand-900 inline-flex items-center gap-1">
              Full comparison vs. Rezi, Enhancv, Resume.io →
            </Link>
          </div>
        </div>
      </section>

      {/* AI Tools grid */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-500 mb-3">
              The toolkit
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-gray-900 tracking-tighter mb-3">
              9 AI tools you can&apos;t get anywhere else.
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Each one solves a real job-hunt pain. Free with your own AI key.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map(t => (
              <StaggerItem key={t.title}>
                <Link href={t.href} className="block h-full group">
                  <Card className="h-full" hover={false}>
                    <CardContent className="p-6 flex items-start gap-3">
                      <span
                        className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-lg shadow-sm`}
                      >
                        {t.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
                          {t.title}
                          <ArrowRight
                            size={14}
                            className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition text-gray-400"
                          />
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{t.body}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="text-center mt-10">
            <Link href="/tools">
              <Button variant="outline" size="lg">
                See all tools
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <p className="text-xs uppercase tracking-[0.25em] font-semibold text-gray-500 mb-3">
              Pricing
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-gray-900 tracking-tighter mb-3">
              Free forever. <span className="gradient-text italic font-normal">Pay only if you love it.</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
              Every feature works on Free with your own AI key. Pro is one-time {MONETIZATION.proPriceUSD} for hosted AI + extras. No subscriptions. Ever.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8">
              {[
                { name: "Free", price: "$0", note: "forever", cta: "Start" },
                { name: "Pro", price: MONETIZATION.proPriceUSD, note: "once", cta: "Buy", highlight: true },
                { name: "Lifetime", price: MONETIZATION.lifetimePriceUSD, note: "once", cta: "Buy" },
              ].map(t => (
                <Card key={t.name} hover={false} className={t.highlight ? "ring-2 ring-brand-400" : ""}>
                  <CardContent className="p-5 text-center">
                    <p className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-1">{t.name}</p>
                    <div className="font-display text-3xl font-semibold text-gray-900">{t.price}</div>
                    <div className="text-xs text-gray-500 mb-3">{t.note}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/pricing">
                <Button size="lg">
                  See full pricing
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link href="/build">
                <Button variant="outline" size="lg">
                  Start free
                </Button>
              </Link>
            </div>

            <p className="text-xs text-gray-500 mt-4 inline-flex items-center gap-1.5">
              <Shield size={11} />
              {MONETIZATION.moneyBackDays}-day refund · {MONETIZATION.studentPriceUSD} for students with .edu
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* See a live example */}
      <section className="py-16 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Eye size={32} className="mx-auto mb-4 opacity-80" />
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-3 tracking-tight">
            See a portfolio built with Hyred.
          </h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            A real live portfolio rendered from Hyred data. Mobile-clean, ATS-friendly, recruiter-tested.
          </p>
          <Link href="/preview">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-100 transition">
              View live example
              <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="py-24"
        style={{
          background: `linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)`,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tightest">
              Stop building TODO apps.
              <br />
              <span className="italic font-normal opacity-90">Start landing interviews.</span>
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              7 minutes from blank page to recruiter-ready portfolio. Free forever to try.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/build">
                <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-white text-brand-700 font-bold shadow-xl hover:scale-105 transition">
                  <Sparkles size={16} />
                  Build mine free
                  <ArrowRight size={16} />
                </button>
              </Link>
              <button
                onClick={() => openCheckout("pro")}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-white/10 text-white border border-white/30 backdrop-blur font-semibold hover:bg-white/20 transition"
              >
                <Zap size={16} className="fill-white" />
                Unlock Pro · {MONETIZATION.proPriceUSD}
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
