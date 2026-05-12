"use client";

import Link from "next/link";
import { Check, X, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { MONETIZATION, openCheckout } from "@/lib/monetization";

interface Row {
  feature: string;
  hyred: string | boolean;
  rezi: string | boolean;
  enhancv: string | boolean;
  resumeIo: string | boolean;
  notion: string | boolean;
  hint?: string;
}

const ROWS: Row[] = [
  { feature: "Free forever tier", hyred: true, rezi: "Limited (14-day trial)", enhancv: "Limited", resumeIo: "Limited", notion: true },
  { feature: "Live portfolio site (not just PDF)", hyred: true, rezi: false, enhancv: false, resumeIo: false, notion: "Manual" },
  { feature: "Video showreel attached to roles", hyred: true, rezi: false, enhancv: false, resumeIo: false, notion: false, hint: "Embedded walkthroughs make you 10× more memorable" },
  { feature: "Paste-resume → portfolio in 30s", hyred: true, rezi: "Manual", enhancv: "Manual", resumeIo: "Manual", notion: "Manual" },
  { feature: "AI rewrites every field", hyred: true, rezi: "Pro only", enhancv: "Pro only", resumeIo: "Pro only", notion: false },
  { feature: "Roast My Resume (AI critique)", hyred: true, rezi: false, enhancv: false, resumeIo: false, notion: false },
  { feature: "JD Matcher (paste JD → match %)", hyred: true, rezi: "Pro only", enhancv: "Pro only", resumeIo: false, notion: false },
  { feature: "AI Mock Interview", hyred: true, rezi: false, enhancv: false, resumeIo: false, notion: false },
  { feature: "Cover letter generator", hyred: true, rezi: "Pro only", enhancv: "Pro only", resumeIo: "Pro only", notion: false },
  { feature: "GitHub auto-import", hyred: true, rezi: false, enhancv: false, resumeIo: false, notion: false },
  { feature: "ATS health score (live, 17 checks)", hyred: true, rezi: true, enhancv: true, resumeIo: false, notion: false },
  { feature: "Printable ATS-clean PDF", hyred: true, rezi: true, enhancv: true, resumeIo: true, notion: false },
  { feature: "Your data stays in your browser", hyred: true, rezi: false, enhancv: false, resumeIo: false, notion: "You control" },
  { feature: "No account / signup needed", hyred: true, rezi: false, enhancv: false, resumeIo: false, notion: false },
  { feature: "Shareable link (no hosting needed)", hyred: true, rezi: false, enhancv: false, resumeIo: false, notion: false },
  { feature: "Price", hyred: `${MONETIZATION.proPriceUSD} one-time`, rezi: "$29/mo", enhancv: "$24.99/mo", resumeIo: "$15.99/mo", notion: "Free" },
];

const COLS = ["Hyred", "Rezi", "Enhancv", "Resume.io", "Notion"] as const;

function Cell({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100">
        <Check size={14} className="text-emerald-700" />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
        <X size={14} className="text-gray-400" />
      </span>
    );
  }
  return <span className="text-xs text-gray-600">{value}</span>;
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white">
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full text-xs font-semibold text-purple-700 bg-purple-100">
              <Sparkles size={12} />
              Honest comparison
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-gray-900 mb-3 tracking-tightest leading-[1.05]">
              <span className="italic">Hyred</span> vs. the rest
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;ll be honest: other tools are good too. Here&apos;s exactly where we win — and where we don&apos;t.
            </p>
          </AnimatedSection>

          {/* Table */}
          <div className="overflow-x-auto -mx-4 sm:mx-0 mb-12">
            <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 text-sm font-bold text-gray-700 bg-gray-50">Feature</th>
                  {COLS.map((c, i) => (
                    <th
                      key={c}
                      className={`p-4 text-sm font-bold text-center ${
                        i === 0
                          ? "bg-gradient-to-br from-purple-100 to-pink-100 text-purple-900"
                          : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, idx) => (
                  <tr key={r.feature} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="p-4 text-sm">
                      <div className="font-medium text-gray-900">{r.feature}</div>
                      {r.hint && <div className="text-xs text-gray-500 mt-0.5">{r.hint}</div>}
                    </td>
                    <td className="p-4 text-center bg-purple-50/50"><Cell value={r.hyred} /></td>
                    <td className="p-4 text-center"><Cell value={r.rezi} /></td>
                    <td className="p-4 text-center"><Cell value={r.enhancv} /></td>
                    <td className="p-4 text-center"><Cell value={r.resumeIo} /></td>
                    <td className="p-4 text-center"><Cell value={r.notion} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Where we lose - honesty section */}
          <Card hover={false} className="mb-12 bg-gray-50">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-3">Where the others win</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>· <strong>Rezi</strong> has been around longer — more polished templates if you want a classic, conservative resume.</li>
                <li>· <strong>Enhancv</strong> has the deepest section variety for non-tech roles (marketing, sales).</li>
                <li>· <strong>Resume.io</strong> is fastest for a strictly traditional 1-page PDF resume with no AI.</li>
                <li>· <strong>Notion</strong> wins if you already live in Notion and don&apos;t need video/AI.</li>
              </ul>
              <p className="text-xs text-gray-500 mt-4">
                We&apos;re built for students and early-career engineers who want a <strong>portfolio site + resume + AI tools</strong> in one place, for the price of a coffee.
              </p>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <Card hover={false} className="inline-block">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Try it free — buy if you love it
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Every feature works on the free tier with your own AI key. Pro unlocks hosted AI, premium templates, and removes the badge.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/admin">
                    <Button size="lg">
                      Start free
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" onClick={() => openCheckout(false)}>
                    Buy Pro — {MONETIZATION.proPriceUSD}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
