"use client";

import Link from "next/link";
import { Check, Sparkles, ArrowRight, Star, Shield, Zap, Infinity, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection, FadeIn } from "@/components/ui/animated-section";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { MONETIZATION, openCheckout } from "@/lib/monetization";

interface Tier {
  id: "free" | "pro" | "lifetime";
  name: string;
  tagline: string;
  price: string;
  priceNote: string;
  oldPrice?: string;
  badge?: string;
  highlight?: boolean;
  cta: string;
  ctaAction: () => void;
  features: string[];
}

const COMPARE_HEADERS = ["Feature", "Free", "Pro", "Lifetime"] as const;

const COMPARE_ROWS: Array<{ label: string; free: boolean | string; pro: boolean | string; lifetime: boolean | string; hint?: string }> = [
  { label: "Portfolio site builder", free: true, pro: true, lifetime: true },
  { label: "Printable ATS-clean PDF resume", free: true, pro: true, lifetime: true, hint: "Resume.io charges $16 for this" },
  { label: "ATS Health Score (17 checks)", free: true, pro: true, lifetime: true },
  { label: "All 6 brand themes", free: true, pro: true, lifetime: true },
  { label: "Shareable portfolio URL", free: true, pro: true, lifetime: true },
  { label: "PDF resume parser → auto-fill", free: true, pro: true, lifetime: true },
  { label: "GitHub auto-import", free: true, pro: true, lifetime: true },
  { label: "All AI tools (Roast, Match, Cover Letter, Interview, README, LinkedIn, Apply)", free: "BYO key", pro: "Hosted AI", lifetime: "Hosted AI" },
  { label: "Daily AI calls", free: `${MONETIZATION.freeAICallsPerDay}`, pro: "Unlimited", lifetime: "Unlimited" },
  { label: "Application Tracker (job pipeline)", free: false, pro: true, lifetime: true },
  { label: "AI Career Coach chat", free: false, pro: true, lifetime: true },
  { label: "One-click deploy + custom domain guide", free: false, pro: true, lifetime: true },
  { label: "Remove “Built with Hyred” footer", free: false, pro: true, lifetime: true },
  { label: "Priority email support", free: false, pro: true, lifetime: true },
  { label: "Lifetime updates + new features", free: "Free updates", pro: false, lifetime: true },
  { label: "Founder Discord access", free: false, pro: false, lifetime: true },
  { label: "Beta access to new tools", free: false, pro: false, lifetime: true },
];

export default function PricingPage() {
  const { data } = usePortfolioData();
  const gradFrom = data.personalInfo.brand?.gradientFrom || "#2563eb";
  const gradTo = data.personalInfo.brand?.gradientTo || "#0d9488";

  const tiers: Tier[] = [
    {
      id: "free",
      name: "Free",
      tagline: "Everything to land a job.",
      price: "$0",
      priceNote: "forever",
      cta: "Start building",
      ctaAction: () => {
        if (typeof window !== "undefined") window.location.href = "/admin";
      },
      features: [
        "Full portfolio builder",
        "ATS health score + all 17 checks",
        "All AI tools (use free Groq / OpenRouter key)",
        "Roast, JD Match, Cover Letter, Interview, more",
        "Printable PDF resume",
        "All 6 themes + 6 layouts",
        "GitHub auto-import",
        "Shareable portfolio URL",
        `${MONETIZATION.freeAICallsPerDay} AI calls / day`,
      ],
    },
    {
      id: "pro",
      name: "Pro",
      tagline: "When you're job-hunting seriously.",
      price: MONETIZATION.proPriceUSD,
      priceNote: "one-time",
      oldPrice: MONETIZATION.proRegularPriceUSD,
      badge: "Recommended",
      highlight: true,
      cta: "Upgrade to Pro",
      ctaAction: () => openCheckout("pro"),
      features: [
        "Everything in Free",
        "Hosted AI — no API key needed",
        "Application Tracker (job pipeline)",
        "AI Career Coach chat",
        "Unlimited AI calls (no daily cap)",
        "One-click deploy + domain guide",
        "Remove “Built with Hyred” badge",
        "Priority email support",
      ],
    },
    {
      id: "lifetime",
      name: "Lifetime",
      tagline: "Build resumes forever.",
      price: MONETIZATION.lifetimePriceUSD,
      priceNote: "once",
      oldPrice: MONETIZATION.lifetimeRegularPriceUSD,
      badge: "Best value",
      cta: "Buy Lifetime",
      ctaAction: () => openCheckout("lifetime"),
      features: [
        "Everything in Pro",
        "Lifetime updates — every new feature, free",
        "Founder Discord access",
        "Beta access to new tools",
        "Pay once, never think about it again",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section
        className="py-16 md:py-20"
        style={{
          background: `linear-gradient(135deg, ${gradFrom}0a 0%, #ffffff 50%, ${gradTo}0a 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div
              className="inline-flex items-center gap-1 mb-4 px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}
            >
              <Sparkles size={12} />
              Free forever · Pro pays for itself in 1 saved hour
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-gray-900 mb-3 tracking-tightest leading-[1.05]">
              Simple pricing. <span className="gradient-text italic font-normal">No subscriptions</span> ever.
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              While Resume.io charges <strong>$16/month</strong> just to download your own resume, we charge once. Or never.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12 -mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {tiers.map((t, i) => (
              <FadeIn key={t.id} delay={i * 0.1}>
                <Card
                  hover={false}
                  className={`h-full relative ${
                    t.highlight ? "ring-2 ring-brand-400 md:scale-105" : ""
                  }`}
                >
                  {t.badge && (
                    <div
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white shadow ${
                        t.highlight ? "bg-gradient-to-r from-brand-600 to-coral-600" : "bg-amber-500"
                      }`}
                    >
                      {t.id === "pro" ? <Star size={11} fill="currentColor" /> : <Crown size={11} fill="currentColor" />}
                      {t.badge}
                    </div>
                  )}

                  {t.id === "pro" && MONETIZATION.seatsLeft > 0 && MONETIZATION.seatsLeft < 100 && (
                    <div className="absolute -top-3 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-red-500 shadow animate-pulse">
                      <Zap size={10} fill="currentColor" />
                      {MONETIZATION.seatsLeft} left
                    </div>
                  )}

                  <CardContent className="p-7">
                    <div className="mb-5">
                      <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                        {t.id === "lifetime" && <Infinity size={18} className="text-amber-500" />}
                        {t.name}
                      </h2>
                      <p className="text-sm text-gray-500">{t.tagline}</p>
                    </div>

                    <div className="mb-5 flex items-baseline gap-2">
                      <span className="text-4xl font-black text-gray-900">{t.price}</span>
                      <span className="text-sm text-gray-500">{t.priceNote}</span>
                      {t.oldPrice && (
                        <span className="text-sm text-gray-400 line-through">{t.oldPrice}</span>
                      )}
                    </div>

                    <Button
                      onClick={t.ctaAction}
                      size="lg"
                      className={`w-full mb-6 ${
                        t.highlight
                          ? "text-white"
                          : t.id === "lifetime"
                          ? "bg-amber-500 hover:bg-amber-600 text-white"
                          : ""
                      }`}
                      style={
                        t.highlight
                          ? { background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }
                          : undefined
                      }
                      variant={t.id === "free" ? "outline" : undefined}
                    >
                      {t.cta}
                      <ArrowRight size={16} className="ml-2" />
                    </Button>

                    <ul className="space-y-2">
                      {t.features.map(f => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <Check size={15} className="flex-shrink-0 mt-0.5 text-emerald-600" />
                          <span className="text-gray-700">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>

          {/* Trust signals */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <Card hover={false} className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-4 flex items-center gap-3">
                <Shield className="text-emerald-600 flex-shrink-0" size={20} />
                <span className="text-emerald-900">
                  <strong>{MONETIZATION.moneyBackDays}-day refund</strong> — no questions asked
                </span>
              </CardContent>
            </Card>
            <Card hover={false} className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 flex items-center gap-3">
                <Sparkles className="text-blue-600 flex-shrink-0" size={20} />
                <span className="text-blue-900">
                  <strong>One-time payment</strong> — no subscription ever
                </span>
              </CardContent>
            </Card>
            <Card hover={false} className="bg-amber-50 border-amber-200">
              <CardContent className="p-4 flex items-center gap-3">
                <Crown className="text-amber-600 flex-shrink-0" size={20} />
                <span className="text-amber-900">
                  <strong>{MONETIZATION.studentPriceUSD} for students</strong> with .edu email
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Student CTA */}
          <div className="mt-6 p-5 rounded-2xl border border-dashed border-gray-300 bg-white text-center">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">
              🎓 Student discount
            </p>
            <p className="text-gray-700 mb-3">
              <strong>50% off Pro</strong> with a valid <code className="bg-gray-100 px-1 rounded">.edu</code> email. Just {MONETIZATION.studentPriceUSD} once for life.
            </p>
            <Button onClick={() => openCheckout("student")} variant="outline" size="sm">
              Get student pricing
              <ArrowRight size={14} className="ml-1.5" />
            </Button>
          </div>

          {/* Feature comparison table */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
              Compare every feature
            </h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                <thead>
                  <tr className="border-b border-gray-200">
                    {COMPARE_HEADERS.map((h, i) => (
                      <th
                        key={h}
                        className={`p-3 text-sm font-bold text-center ${
                          i === 0 ? "text-left bg-gray-50" : i === 2 ? "bg-brand-50 text-brand-900" : i === 3 ? "bg-amber-50 text-amber-900" : "bg-gray-50"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((r, idx) => (
                    <tr key={r.label} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"}>
                      <td className="p-3 text-sm">
                        <div className="font-medium text-gray-900">{r.label}</div>
                        {r.hint && <div className="text-xs text-emerald-700 mt-0.5">{r.hint}</div>}
                      </td>
                      <td className="p-3 text-center"><Cell value={r.free} /></td>
                      <td className="p-3 text-center bg-brand-50/30"><Cell value={r.pro} /></td>
                      <td className="p-3 text-center bg-amber-50/30"><Cell value={r.lifetime} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Existing customer license entry */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600">
              Already paid?{" "}
              <Link href="/unlock" className="font-semibold text-brand-700 underline">
                Activate your license →
              </Link>
            </p>
          </div>

          {/* FAQ */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">FAQ</h2>
            <div className="space-y-3 max-w-3xl mx-auto">
              {[
                {
                  q: "Why is the free tier so generous?",
                  a: "Because we believe students shouldn't pay to apply for jobs. Free has every feature working — Pro adds convenience (hosted AI, no caps), retention features (tracker, coach), and signals you're supporting the project. If you only need a resume once, free is enough.",
                },
                {
                  q: "What does 'bring your own AI key' mean?",
                  a: "Free uses your API key from OpenAI, Groq (free tier), or OpenRouter (free Gemini models). Set it once in Admin → AI Setup, takes 30 seconds. The key stays in your browser — we never see it. Pro skips this step by routing through our hosted AI.",
                },
                {
                  q: "Is Pro really one-time, no recurring charges?",
                  a: "Yes. Pay $9 once → use Pro forever on this browser. We hate subscriptions too. Lifetime ($49) is the same but includes all future updates + Discord access.",
                },
                {
                  q: "What if I'm broke?",
                  a: `Free works fully. We're not gating necessities. If you're a student with a .edu email, Pro is ${MONETIZATION.studentPriceUSD}. If you still can't afford it, email ${MONETIZATION.supportEmail} — we send free Pro keys to anyone who genuinely can't pay. No proof required.`,
                },
                {
                  q: "Can I get a refund?",
                  a: `Within ${MONETIZATION.moneyBackDays} days, yes — email ${MONETIZATION.supportEmail}, we refund without asking why.`,
                },
                {
                  q: "Do I own my data?",
                  a: "Completely. Everything lives in your browser's localStorage. Export as JSON anytime. Even if Hyred shuts down tomorrow, your data and deployed portfolio keep working.",
                },
                {
                  q: "Why should I trust this over Rezi or Resume.io?",
                  a: "You don't have to — try every feature free first. We're betting that once you try it, the pricing model (no subscriptions, students free, refund anytime) earns trust on its own.",
                },
              ].map(item => (
                <details key={item.q} className="group bg-white rounded-lg border border-gray-200 p-4">
                  <summary className="cursor-pointer font-semibold text-gray-900 list-none flex items-center justify-between">
                    {item.q}
                    <span className="text-gray-400 group-open:rotate-180 transition">▾</span>
                  </summary>
                  <p className="mt-3 text-gray-600 leading-relaxed text-sm">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Cell({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100">
        <Check size={14} className="text-emerald-700" />
      </span>
    );
  }
  if (value === false) {
    return <span className="text-gray-300 text-lg">·</span>;
  }
  return <span className="text-xs text-gray-700 font-medium">{value}</span>;
}
