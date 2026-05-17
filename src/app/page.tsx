"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Target,
  Mic,
  Flame,
  Github,
  Briefcase,
  TrendingUp,
  DollarSign,
  Lightbulb,
  Linkedin as LinkedinIcon,
  Check,
  Shield,
} from "lucide-react";
import MarketingHero from "@/components/marketing-hero";
import TrustBand from "@/components/trust-band";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/animated-section";
import { MONETIZATION, openCheckout } from "@/lib/monetization";

const STEPS = [
  {
    n: "01",
    title: "Paste your resume",
    body: "Drag a PDF or paste text. AI extracts roles, skills, and projects in 30 seconds.",
  },
  {
    n: "02",
    title: "Polish with AI",
    body: "Click ✨ on any field to rewrite. Use the toolkit: Roast, JD Match, Cover Letter, Interview prep.",
  },
  {
    n: "03",
    title: "Share or deploy",
    body: "Copy your portfolio link and send to recruiters. Or one-click deploy to your own domain.",
  },
];

// 9 tools — 3x3 clean grid on md+, 2-col on sm, 1-col on phones
const TOOLS = [
  { icon: Flame,       title: "Roast My Resume",     body: "Brutal AI critique on a shareable card.",                        href: "/tools/roast" },
  { icon: Target,      title: "JD Matcher",          body: "Paste any job description. See match %. AI tailors your bio.",    href: "/tools/match" },
  { icon: Briefcase,   title: "Application Pack",    body: "Cover letter + cold email + LinkedIn DM + thank-you. One click.", href: "/tools/apply" },
  { icon: Mic,         title: "Mock Interview",      body: "Real questions from YOUR resume. AI grades your answers.",         href: "/tools/interview" },
  { icon: LinkedinIcon,title: "LinkedIn Optimizer",  body: "Recruiter-magnet headline + About + bullets.",                    href: "/tools/linkedin" },
  { icon: Github,      title: "GitHub README",       body: "Beautiful profile README from your portfolio.",                    href: "/tools/readme" },
  { icon: TrendingUp,  title: "Skill Gap Analyzer",  body: "Target a role. AI shows what to learn + build.",                  href: "/tools/skills" },
  { icon: DollarSign,  title: "Salary Negotiator",   body: "Paste your offer. Get a script + market data.",                   href: "/tools/salary" },
  { icon: Lightbulb,   title: "Project Ideas",       body: "Stop building TODO apps. Ideas matched to your gaps.",            href: "/tools/projects" },
];

const COMPARE = [
  { you: "Pay $16/mo just to download YOUR resume",     us: "PDF download — always free" },
  { you: "Generic AI advice that doesn't know your work", us: "AI reads your full portfolio — every suggestion is yours" },
  { you: "ChatGPT can rewrite, but can't build a site",  us: "Site + PDF + cover letters, from one source" },
  { you: "Subscriptions stack up while you job hunt",    us: "$9 once — or free with your own API key" },
];

export default function Home() {
  return (
    <div className="overflow-hidden bg-white dark:bg-gray-950">
      <MarketingHero />
      <TrustBand />

      {/* Steps — minimal, numbered */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-gray-400 dark:text-gray-500 mb-4">
              How it works
            </p>
            <h2 className="font-display text-[32px] sm:text-4xl md:text-6xl font-medium text-gray-900 dark:text-white tracking-tighter leading-[1.06] md:leading-[1.05] break-words">
              Three steps.
              <br />
              <span className="text-gray-400 dark:text-gray-500">Zero learning curve.</span>
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200/70 dark:bg-gray-800/70 rounded-2xl overflow-hidden border border-gray-200/70 dark:border-gray-800/70">
            {STEPS.map(s => (
              <StaggerItem key={s.n}>
                <div className="h-full bg-white dark:bg-gray-950 p-8 md:p-10">
                  <div className="font-display text-sm font-medium text-brand-600 mb-6 tracking-widest">
                    {s.n}
                  </div>
                  <h3 className="font-display text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-3 tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed">{s.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="text-center mt-14">
            <Link
              href="/admin"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[15px] font-semibold text-white bg-gray-900 hover:bg-black hover:-translate-y-0.5 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] hover:shadow-[0_14px_32px_-10px_rgba(0,0,0,0.45)] transition-all duration-200"
            >
              <Sparkles size={15} className="text-brand-300" />
              Start building — free
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Compare strip — clean two-column, no boxes */}
      <section className="py-24 md:py-32 bg-gray-50/70 dark:bg-gray-900/40 border-y border-gray-200/70 dark:border-gray-800/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-gray-400 dark:text-gray-500 mb-4">
              Why Hyred
            </p>
            <h2 className="font-display text-[32px] sm:text-4xl md:text-6xl font-medium text-gray-900 dark:text-white tracking-tighter leading-[1.06] md:leading-[1.05] break-words">
              Built differently.
              <br />
              <span className="italic font-normal text-gray-400 dark:text-gray-500">On purpose.</span>
            </h2>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto divide-y divide-gray-200/80 dark:divide-gray-800/80">
            {COMPARE.map((c, i) => (
              <AnimatedSection key={i}>
                <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-4 md:gap-8 py-6">
                  <p className="text-[15px] text-gray-400 dark:text-gray-500 line-through leading-relaxed">
                    {c.you}
                  </p>
                  <ArrowRight size={16} className="hidden md:block text-gray-300 justify-self-center" />
                  <p className="text-[15px] font-medium text-gray-900 dark:text-white leading-relaxed inline-flex items-start gap-2">
                    <Check size={16} className="text-brand-600 mt-1 flex-shrink-0" />
                    {c.us}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/compare"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-white inline-flex items-center gap-1.5 group"
            >
              Full comparison vs. Rezi, Enhancv, Resume.io
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bento tools grid — premium asymmetric layout */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-gray-400 dark:text-gray-500 mb-4">
              The toolkit
            </p>
            <h2 className="font-display text-[32px] sm:text-4xl md:text-6xl font-medium text-gray-900 dark:text-white tracking-tighter leading-[1.06] md:leading-[1.05] break-words mb-4">
              Nine AI tools.
              <br />
              <span className="text-gray-400 dark:text-gray-500">One workflow.</span>
            </h2>
            <p className="text-[15px] text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Each one solves a real job-hunt pain. Free with your own AI key.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {TOOLS.map(t => {
              const Icon = t.icon;
              return (
                <StaggerItem key={t.title}>
                  <Link
                    href={t.href}
                    className="group relative block h-full p-6 md:p-7 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200/70 dark:border-gray-800/70 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_-12px_rgba(0,0,0,0.12)]"
                  >
                    <div className="flex flex-col h-full min-h-[140px]">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200/70 dark:border-gray-800/70 flex items-center justify-center mb-5 group-hover:bg-gray-900 group-hover:border-gray-900 transition-colors duration-300">
                        <Icon size={18} className="text-gray-700 dark:text-gray-300 group-hover:text-brand-300 transition-colors duration-300" />
                      </div>
                      <h3 className="font-display text-lg font-medium text-gray-900 dark:text-white mb-1.5 tracking-tight">
                        {t.title}
                      </h3>
                      <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed">{t.body}</p>
                      <ArrowRight
                        size={15}
                        className="absolute top-6 right-6 text-gray-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                      />
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          <div className="text-center mt-12">
            <Link
              href="/tools"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-white inline-flex items-center gap-1.5 group"
            >
              Browse all tools
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing teaser — minimal three-up, single signature highlight */}
      <section className="py-24 md:py-32 bg-gray-50/70 dark:bg-gray-900/40 border-y border-gray-200/70 dark:border-gray-800/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-gray-400 dark:text-gray-500 mb-4">
              Pricing
            </p>
            <h2 className="font-display text-[32px] sm:text-4xl md:text-6xl font-medium text-gray-900 dark:text-white tracking-tighter leading-[1.06] md:leading-[1.05] break-words mb-4">
              Free forever.
              <br />
              <span className="italic font-normal text-gray-400 dark:text-gray-500">Pay if you love it.</span>
            </h2>
            <p className="text-[15px] text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-14">
              Every feature works on Free with your own AI key. Pro is one-time {MONETIZATION.proPriceUSD} for hosted AI + extras. No subscriptions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-10">
              {[
                { name: "Free", price: "$0", note: "forever" },
                { name: "Pro", price: MONETIZATION.proPriceUSD, note: "one-time", highlight: true },
                { name: "Lifetime", price: MONETIZATION.lifetimePriceUSD, note: "one-time" },
              ].map(t =>
                t.highlight ? (
                  <div
                    key={t.name}
                    className="relative p-6 rounded-2xl text-center"
                    style={{
                      background:
                        "linear-gradient(#ffffff,#ffffff) padding-box, linear-gradient(135deg, #0d9488 0%, #84cc16 100%) border-box",
                      border: "1.5px solid transparent",
                      boxShadow:
                        "0 1px 2px rgba(13,148,136,0.06), 0 12px 28px -12px rgba(13,148,136,0.18)",
                    }}
                  >
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-brand-600 to-lime-500 shadow-sm">
                      Most popular
                    </span>
                    <p className="text-[11px] uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400 mb-2">
                      {t.name}
                    </p>
                    <div className="font-display text-3xl md:text-4xl font-medium text-gray-900 dark:text-white">
                      {t.price}
                    </div>
                    <div className="text-[12px] text-gray-500 dark:text-gray-400 mt-1">{t.note}</div>
                  </div>
                ) : (
                  <div
                    key={t.name}
                    className="p-6 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200/70 dark:border-gray-800/70 text-center"
                  >
                    <p className="text-[11px] uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400 mb-2">
                      {t.name}
                    </p>
                    <div className="font-display text-3xl md:text-4xl font-medium text-gray-900 dark:text-white">
                      {t.price}
                    </div>
                    <div className="text-[12px] text-gray-500 dark:text-gray-400 mt-1">{t.note}</div>
                  </div>
                )
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-[14px] font-semibold text-white bg-gray-900 hover:bg-black hover:-translate-y-0.5 transition-all duration-200 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)]"
              >
                See full pricing
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-[14px] font-medium text-gray-700 hover:text-gray-900 border border-gray-200 bg-white dark:bg-gray-950 hover:border-gray-300 dark:hover:border-gray-700 transition"
              >
                Start free
              </Link>
            </div>

            <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-6 inline-flex items-center gap-1.5">
              <Shield size={11} />
              {MONETIZATION.moneyBackDays}-day refund · {MONETIZATION.studentPriceUSD} for students with .edu
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Live example — premium dark band */}
      <section className="py-20 md:py-28 bg-gray-950 text-white relative overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(132,204,22,0.4), rgba(13,148,136,0.5), transparent)",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-grain opacity-[0.07]" aria-hidden="true" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-gray-500 dark:text-gray-400 mb-5">
            Live example
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight mb-4 leading-tight">
            See what a Hyred portfolio
            <br />
            <span className="text-gray-500 dark:text-gray-400">actually looks like.</span>
          </h2>
          <p className="text-[15px] text-gray-400 dark:text-gray-500 mb-8 max-w-md mx-auto">
            A real live portfolio rendered from Hyred data. Mobile-clean, ATS-friendly, recruiter-tested.
          </p>
          <Link
            href="/preview"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-semibold text-gray-900 bg-white dark:bg-gray-950 hover:bg-gray-100 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)]"
          >
            View live example
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Final CTA — luxurious near-black with single signature line */}
      <section className="py-28 md:py-36 bg-gray-950 text-white relative overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(13,148,136,0.5), rgba(132,204,22,0.5), transparent)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(800px 400px at 50% 100%, rgba(13,148,136,0.15), transparent 60%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-display text-[32px] sm:text-4xl md:text-6xl lg:text-7xl font-medium tracking-tightest mb-6 leading-[1.02] md:leading-[0.95] break-words">
              Stop building
              <br />
              <span className="text-gray-500 dark:text-gray-400">TODO apps.</span>
              <br />
              Start landing interviews.
            </h2>
            <p className="text-lg text-gray-400 dark:text-gray-500 mb-10 max-w-md mx-auto">
              7 minutes from blank page to recruiter-ready. Free forever to try.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/admin"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-[15px] font-semibold text-gray-900 bg-white dark:bg-gray-950 hover:bg-gray-100 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_8px_24px_-8px_rgba(255,255,255,0.2)]"
              >
                <Sparkles size={15} className="text-brand-600" />
                Build mine free
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <button
                onClick={() => openCheckout("pro")}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full text-[15px] font-medium text-white bg-white/[0.06] border border-white/15 hover:bg-white/10 hover:border-white/25 hover:-translate-y-0.5 transition-all duration-200 backdrop-blur"
              >
                Unlock Pro · {MONETIZATION.proPriceUSD}
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
