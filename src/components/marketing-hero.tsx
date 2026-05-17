"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Check, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";

const COMPANIES = [
  "Google", "Stripe", "Vercel", "Linear", "Shopify",
  "Anthropic", "Notion", "OpenAI", "Figma", "Airbnb",
];

// Generic demo persona shown in the hero preview card.
// Intentionally not tied to real user data — purely illustrative.
const DEMO = {
  name: "Alex Rivera",
  handle: "alex",
  title: "Full-Stack Engineer",
  openToWork: true,
  yearsOfExperience: 4,
  projects: 12,
  skills: 18,
  topSkills: ["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL", "AWS"],
  featured: {
    title: "Realtime collab editor",
    description:
      "Built a Figma-style multiplayer canvas with CRDT sync, presence, and offline-first storage.",
  },
};

export default function MarketingHero() {
  const initial = DEMO.name.charAt(0).toUpperCase();

  return (
    <section className="relative overflow-x-clip bg-white dark:bg-gray-950">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-12 sm:pb-20 md:pt-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 sm:gap-12 lg:gap-16 items-center">
          {/* LEFT — Copy */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-7 px-2.5 py-1 rounded-full text-[11px] font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/10"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500"></span>
              </span>
              Now in public beta — free forever
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.6 }}
              className="font-display text-[34px] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[84px] font-medium text-gray-900 dark:text-white mb-6 tracking-tightest leading-[0.95] break-words"
            >
              The fastest way to get{" "}
              <span className="relative inline-block italic font-normal">
                <span className="gradient-text">hired.</span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-xl mx-auto lg:mx-0 mb-9 leading-relaxed"
            >
              Paste your resume. Ship a recruiter-ready portfolio, ATS-tuned PDF,
              and tailored cover letters in 7 minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 mb-6"
            >
              <Link
                href="/admin"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[15px] font-semibold text-white bg-gray-900 hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] hover:shadow-[0_14px_32px_-10px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 transition-all duration-200"
              >
                <Sparkles size={15} className="text-brand-300 dark:text-brand-600" />
                Start building free
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/preview"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[15px] font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition"
              >
                View live example
                <ArrowRight size={14} className="opacity-50" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-[12px] text-gray-500 dark:text-gray-400"
            >
              <span className="inline-flex items-center gap-1.5">
                <Check size={12} className="text-brand-600" /> Free forever
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={12} className="text-brand-600" /> No credit card
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={12} className="text-brand-600" /> Your data, your browser
              </span>
            </motion.div>
          </div>

          {/* RIGHT — Floating live portfolio preview card */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            {/* Aurora halo behind the card */}
            <div
              className="absolute -inset-6 -z-10 opacity-60 blur-3xl rounded-[40px] pointer-events-none"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(closest-side at 30% 30%, rgba(13,148,136,0.35), transparent 70%), radial-gradient(closest-side at 70% 70%, rgba(132,204,22,0.28), transparent 70%)",
              }}
            />

            <div
              className="relative rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 overflow-hidden"
              style={{
                boxShadow:
                  "0 1px 1px rgba(0,0,0,0.04), 0 4px 12px -2px rgba(13,148,136,0.10), 0 24px 60px -20px rgba(0,0,0,0.20)",
                animation: "card-float 9s ease-in-out infinite",
              }}
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-200/70 dark:border-gray-800 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80"></span>
                <div className="ml-3 flex-1 h-5 rounded-md bg-gray-100/80 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-700/60 px-2 flex items-center text-[10px] font-mono text-gray-400 dark:text-gray-500">
                  hyred.app/{DEMO.handle}
                </div>
              </div>

              {/* Card content — mock portfolio header */}
              <div className="px-5 py-6">
                <div className="flex items-start gap-3 mb-5">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base"
                    style={{
                      background:
                        "linear-gradient(135deg, #0d9488 0%, #84cc16 100%)",
                    }}
                  >
                    {initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-base font-semibold text-gray-900 dark:text-white tracking-tight truncate">
                      {DEMO.name}
                    </div>
                    <div className="text-[12px] text-gray-500 dark:text-gray-400 truncate">
                      {DEMO.title}
                    </div>
                    {DEMO.openToWork && (
                      <span className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-100 dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-500/20">
                        <span className="w-1 h-1 rounded-full bg-brand-500"></span>
                        Open to work
                      </span>
                    )}
                  </div>
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-px bg-gray-200/60 dark:bg-gray-800/60 rounded-lg overflow-hidden border border-gray-200/60 dark:border-gray-800 mb-5">
                  <div className="bg-white dark:bg-gray-900 py-2.5 text-center">
                    <div className="font-display text-lg font-medium text-gray-900 dark:text-white">{DEMO.projects}</div>
                    <div className="text-[9px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Projects</div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 py-2.5 text-center">
                    <div className="font-display text-lg font-medium text-gray-900 dark:text-white">{DEMO.skills}</div>
                    <div className="text-[9px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Skills</div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 py-2.5 text-center">
                    <div className="font-display text-lg font-medium text-gray-900 dark:text-white">
                      {DEMO.yearsOfExperience}y
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-gray-500 dark:text-gray-400">Exp</div>
                  </div>
                </div>

                {/* Skill chips */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {DEMO.topSkills.map(s => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium text-gray-700 bg-gray-50 border border-gray-200/70 dark:text-gray-300 dark:bg-white/[0.04] dark:border-gray-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Featured project preview */}
                <div className="rounded-lg border border-gray-200/70 dark:border-gray-800 p-3 bg-gradient-to-br from-gray-50/60 to-white dark:from-gray-900 dark:to-gray-900">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Star size={10} className="text-amber-500 fill-amber-500" />
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">
                      Featured
                    </span>
                  </div>
                  <div className="text-[12px] font-semibold text-gray-900 dark:text-white truncate">
                    {DEMO.featured.title}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug mt-0.5">
                    {DEMO.featured.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating tool badges around the card — only visible on wide screens
                so they have room without clipping. */}
            <div
              className="hidden xl:flex absolute -left-4 top-12 items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-lg text-[11px] font-medium text-gray-700 dark:text-gray-200"
              style={{ animation: "card-float 9s ease-in-out infinite", animationDelay: "-3s" }}
            >
              <Zap size={11} className="text-amber-500 fill-amber-500" />
              ATS-tuned PDF
            </div>
            <div
              className="hidden xl:flex absolute -right-4 bottom-16 items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-lg text-[11px] font-medium text-gray-700 dark:text-gray-200"
              style={{ animation: "card-float 9s ease-in-out infinite", animationDelay: "-6s" }}
            >
              <Sparkles size={11} className="text-brand-600" />
              AI cover letter
            </div>
          </motion.div>
        </div>

        {/* Logo marquee — "designed for engineers at..." */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-14 sm:mt-16 md:mt-20"
        >
          <p className="text-center text-[11px] uppercase tracking-[0.3em] font-semibold text-gray-400 dark:text-gray-500 mb-5">
            Designed for engineers applying to
          </p>
          <div className="relative overflow-hidden">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 z-10 bg-gradient-to-r from-white dark:from-gray-950 to-transparent"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 z-10 bg-gradient-to-l from-white dark:from-gray-950 to-transparent"
              aria-hidden="true"
            />
            <div className="flex gap-8 sm:gap-10 marquee-track">
              {[...COMPANIES, ...COMPANIES].map((name, i) => (
                <span
                  key={i}
                  className="flex-shrink-0 font-display text-base sm:text-xl md:text-2xl font-medium text-gray-400 dark:text-gray-500 tracking-tight whitespace-nowrap"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
