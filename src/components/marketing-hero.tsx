"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Flame, Target, Mic, Github, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MONETIZATION, openCheckout } from "@/lib/monetization";

const FEATURE_PILLS = [
  { icon: Flame, label: "Roast Resume", href: "/tools/roast", from: "#ef4444", to: "#f97316" },
  { icon: Target, label: "JD Matcher", href: "/tools/match", from: "#3b82f6", to: "#06b6d4" },
  { icon: Mic, label: "Mock Interview", href: "/tools/interview", from: "#a855f7", to: "#ec4899" },
  { icon: Github, label: "GitHub Import", href: "/admin", from: "#374151", to: "#111827" },
  { icon: Wand2, label: "AI Rewrites", href: "/tools", from: "#10b981", to: "#0ea5e9" },
];

export default function MarketingHero() {
  // Only show stats that have real values (zero or empty = hide).
  const hasRealStats =
    MONETIZATION.stats.resumesBuilt > 0 ||
    MONETIZATION.stats.avgBuildMinutes > 0 ||
    !!MONETIZATION.stats.avgAtsLift;

  const stats = [
    MONETIZATION.stats.resumesBuilt > 0 && {
      value: `${MONETIZATION.stats.resumesBuilt.toLocaleString()}+`,
      label: "resumes built",
    },
    MONETIZATION.stats.avgAtsLift && {
      value: MONETIZATION.stats.avgAtsLift,
      label: "avg ATS lift",
    },
    MONETIZATION.stats.avgBuildMinutes > 0 && {
      value: `${MONETIZATION.stats.avgBuildMinutes}m`,
      label: "to launch",
    },
    MONETIZATION.stats.ratingCount > 0 && {
      value: `${MONETIZATION.stats.ratingValue}★`,
      label: "rating",
    },
  ].filter(Boolean) as Array<{ value: string; label: string }>;

  return (
    <section className="relative overflow-hidden">
      {/* Mesh background */}
      <div className="absolute inset-0 bg-mesh pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="text-center">
          {/* Badge — honest version */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-7 px-3 py-1 rounded-full text-xs font-medium bg-white/80 backdrop-blur border border-gray-200 shadow-sm"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-gray-700">
              Free forever · No credit card · Your data stays in your browser
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.6 }}
            className="font-display text-5xl md:text-7xl lg:text-[88px] font-semibold text-gray-900 mb-6 tracking-tightest leading-[0.95]"
          >
            Get{" "}
            <span className="gradient-text italic font-normal">Hyred</span>
            <br />
            <span className="text-gray-900">in 7 minutes flat.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Paste your old resume. AI builds a recruiter-ready{" "}
            <span className="text-gray-900 font-medium">portfolio site</span>,{" "}
            <span className="text-gray-900 font-medium">ATS-optimized PDF</span>,{" "}
            <span className="text-gray-900 font-medium">cover letters</span>, and{" "}
            <span className="text-gray-900 font-medium">interview prep</span> — all from one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
          >
            <Link href="/admin">
              <Button size="lg" className="text-base px-7 py-3.5 shadow-[0_8px_24px_rgba(124,58,237,0.3)]">
                <Sparkles size={16} className="mr-2" />
                Start building free
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
            <button
              onClick={() => openCheckout("pro")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-base font-semibold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition"
            >
              See Pro · {MONETIZATION.proPriceUSD}
              <Zap size={14} className="text-amber-500 fill-amber-500" />
            </button>
          </motion.div>

          {/* Stats — only renders if we have REAL numbers */}
          {hasRealStats && stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="grid gap-px bg-gray-100 rounded-2xl overflow-hidden max-w-3xl mx-auto mb-14 border border-gray-200/60 shadow-premium"
              style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0, 1fr))` }}
            >
              {stats.map(s => (
                <div key={s.label} className="bg-white py-5 px-3 text-center">
                  <div className="font-display text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1 font-medium">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className={hasRealStats ? "" : "mt-4"}
          >
            <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-gray-500 mb-4">
              The toolkit · free with your own AI key
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {FEATURE_PILLS.map(f => {
                const Icon = f.icon;
                return (
                  <Link
                    key={f.label}
                    href={f.href}
                    className="group inline-flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full bg-white border border-gray-200/80 hover:border-gray-300 shadow-sm hover:shadow-md transition text-sm font-medium text-gray-700"
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${f.from}, ${f.to})` }}
                    >
                      <Icon size={12} className="text-white" />
                    </span>
                    {f.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
