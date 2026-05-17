"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  FileText,
  Wand2,
  Rocket,
  Keyboard,
  MessageCircle,
  ChevronDown,
  Search,
  Upload,
  Download,
  Lock,
  Mail,
  HelpCircle,
} from "lucide-react";

const QUICKSTART = [
  {
    icon: Upload,
    n: "01",
    title: "Bring your resume in",
    body:
      "Drop a PDF, paste text, or import from GitHub on the Builder page. AI extracts roles, skills, and projects in ~30 seconds.",
    cta: { label: "Open the Builder", href: "/admin" },
  },
  {
    icon: Wand2,
    n: "02",
    title: "Polish with one click",
    body:
      "Hit ✨ on any field to rewrite with AI. Or jump into the toolkit — Roast My Resume, JD Matcher, Cover Letter, Mock Interview — to sharpen every piece.",
    cta: { label: "Browse all tools", href: "/tools" },
  },
  {
    icon: Rocket,
    n: "03",
    title: "Share or deploy",
    body:
      "Hit Preview to see your live portfolio. Share the link with recruiters, download a PDF, or one-click deploy to your own domain.",
    cta: { label: "View live example", href: "/preview" },
  },
];

const FAQS = [
  {
    q: "Do I need an account to use Hyred?",
    a:
      "No. Hyred runs entirely in your browser. There's no signup, no login, and no server holds your data. Everything you build is saved to local storage — you can export it as JSON any time.",
  },
  {
    q: "How does the AI work? Do I need an API key?",
    a:
      "You bring your own AI key (free tier on Groq and OpenRouter is plenty for most users), or unlock Pro for hosted AI with no setup. Open Settings in the Builder to paste your key. It's saved only to your browser's localStorage — we never see it.",
  },
  {
    q: "What's the difference between Free, Pro, and Lifetime?",
    a:
      "Free gives you every feature when you bring your own AI key. Pro ($9 one-time) includes hosted AI credits, custom domain deploy, and extra templates. Lifetime locks in everything forever, including future tools. No subscriptions.",
  },
  {
    q: "Is the PDF download really ATS-friendly?",
    a:
      "Yes. The export uses semantic, single-column layouts with selectable text — exactly what ATS parsers need. We test against the most common ATS systems (Greenhouse, Lever, Workday, Taleo).",
  },
  {
    q: "Can I deploy my portfolio to my own domain?",
    a:
      "Yes. On the Deploy page, you get a one-click flow for Vercel, Netlify, or static export to any host. The output is a self-contained Next.js site you fully own.",
  },
  {
    q: "How do I import from a PDF resume?",
    a:
      "On the Builder page, drag a PDF into the import zone or click 'Import resume'. The parser uses pdf.js and AI extraction together — it handles the vast majority of resume layouts.",
  },
  {
    q: "I'm a student — is there a discount?",
    a:
      "Yes — there's a permanent student price for anyone with a .edu email. See the Pricing page.",
  },
  {
    q: "What if I lose my data?",
    a:
      "Everything lives in your browser's localStorage, so as long as you don't clear browser data, it's safe. Use Export JSON in Quick Actions to download a backup any time. To restore on a new device, use Import JSON.",
  },
];

const SHORTCUTS = [
  { keys: ["⌘", "K"], description: "Open command palette (jump to any page or tool)" },
  { keys: ["⌘", "S"], description: "Save current section in the Builder" },
  { keys: ["⌘", "/"], description: "Open this help page" },
  { keys: ["Esc"], description: "Close any modal or sidebar" },
];

const TROUBLESHOOT = [
  {
    title: "AI rewrites aren't working",
    body:
      "Check that your API key is pasted in Settings (Builder → AI Settings). Free tiers on Groq and OpenRouter work out of the box. If you see a quota error, switch providers in Settings.",
  },
  {
    title: "My PDF import is missing fields",
    body:
      "Highly stylized resume layouts (graphics, columns, headers in images) can confuse the parser. Try pasting the text directly into the resume importer, or import section by section.",
  },
  {
    title: "Preview looks different from PDF",
    body:
      "Preview is for the web portfolio (recruiters click links). PDF is the ATS-optimized version (recruiters' filtering software reads it). They're built from the same data but styled separately on purpose.",
  },
  {
    title: "I see 'Cannot find module' errors in dev",
    body:
      "Run `npm run clean && npm run dev`. This happens when production and dev caches mix in .next/.",
  },
];

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-200/70 dark:border-gray-800/70 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="text-[15px] font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 transition">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function HelpPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [query, setQuery] = useState("");

  const filteredFaqs = FAQS.filter(
    f =>
      f.q.toLowerCase().includes(query.toLowerCase()) ||
      f.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-950 pt-16">
      {/* Header */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-950">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-16 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-2.5 py-1 rounded-full text-[11px] font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-950 border border-gray-200/80 dark:border-gray-800/80 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_1px_2px_rgba(0,0,0,0.04)]">
            <HelpCircle size={11} className="text-brand-600" />
            Help &amp; getting started
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-medium text-gray-900 dark:text-white tracking-tighter leading-[1.05] mb-4">
            Everything you need
            <br />
            <span className="text-gray-400 dark:text-gray-500">to ship in 7 minutes.</span>
          </h1>
          <p className="text-[15px] md:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
            A quick walkthrough, common questions, keyboard shortcuts, and fixes for the tricky parts. If something's still unclear, drop us a note.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search the help docs..."
              className="w-full pl-11 pr-4 py-3 rounded-full text-[14px] text-gray-900 dark:text-white bg-white dark:bg-gray-950 border border-gray-200/80 dark:border-gray-800/80 focus:border-gray-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Quickstart steps */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-gray-400 dark:text-gray-500 mb-3">
            Quickstart
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-gray-900 dark:text-white tracking-tight mb-10">
            Three steps from blank to recruiter-ready.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200/70 dark:bg-gray-800/70 rounded-2xl overflow-hidden border border-gray-200/70 dark:border-gray-800/70">
            {QUICKSTART.map(step => {
              const Icon = step.icon;
              return (
                <div key={step.n} className="bg-white dark:bg-gray-950 p-7 md:p-8">
                  <div className="flex items-center justify-between mb-5">
                    <div className="font-display text-sm font-medium text-brand-600 tracking-widest">
                      {step.n}
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200/70 dark:border-gray-800/70 flex items-center justify-center">
                      <Icon size={16} className="text-gray-700 dark:text-gray-300" />
                    </div>
                  </div>
                  <h3 className="font-display text-lg font-medium text-gray-900 dark:text-white mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{step.body}</p>
                  <Link
                    href={step.cta.href}
                    className="text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 inline-flex items-center gap-1.5 group"
                  >
                    {step.cta.label}
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-gray-50/70 dark:bg-gray-900/40 border-y border-gray-200/70 dark:border-gray-800/70">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-gray-400 dark:text-gray-500 mb-3">
            Common questions
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-medium text-gray-900 dark:text-white tracking-tight mb-8">
            Things people ask most.
          </h2>

          {filteredFaqs.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
              No matches for &ldquo;{query}&rdquo;. Try a shorter search term.
            </p>
          ) : (
            <div className="rounded-2xl bg-white dark:bg-gray-950 border border-gray-200/70 dark:border-gray-800/70 px-6">
              {filteredFaqs.map((f, i) => (
                <FaqItem
                  key={f.q}
                  q={f.q}
                  a={f.a}
                  open={openIdx === i}
                  onToggle={() => setOpenIdx(openIdx === i ? null : i)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Keyboard shortcuts + Troubleshooting */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-gray-400 dark:text-gray-500 mb-3">
              Power moves
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-medium text-gray-900 dark:text-white tracking-tight mb-6 inline-flex items-center gap-2">
              <Keyboard size={20} className="text-gray-400 dark:text-gray-500" />
              Keyboard shortcuts
            </h2>
            <div className="rounded-2xl bg-white dark:bg-gray-950 border border-gray-200/70 dark:border-gray-800/70 divide-y divide-gray-200/70 dark:divide-gray-800/70">
              {SHORTCUTS.map(s => (
                <div key={s.description} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <span className="text-[14px] text-gray-700 dark:text-gray-300 leading-snug">{s.description}</span>
                  <span className="flex items-center gap-1">
                    {s.keys.map(k => (
                      <kbd
                        key={k}
                        className="inline-flex items-center justify-center min-w-[1.75rem] h-7 px-1.5 rounded-md text-[12px] font-mono font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 border border-gray-200/70 dark:border-gray-800/70 shadow-[inset_0_-1px_0_rgba(0,0,0,0.04)]"
                      >
                        {k}
                      </kbd>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-gray-400 dark:text-gray-500 mb-3">
              Stuck?
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-medium text-gray-900 dark:text-white tracking-tight mb-6 inline-flex items-center gap-2">
              <Sparkles size={20} className="text-gray-400 dark:text-gray-500" />
              Quick fixes
            </h2>
            <div className="space-y-3">
              {TROUBLESHOOT.map(t => (
                <div key={t.title} className="p-5 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200/70 dark:border-gray-800/70">
                  <div className="font-semibold text-[14px] text-gray-900 dark:text-white mb-1.5">{t.title}</div>
                  <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">{t.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Privacy reassurance + contact */}
      <section className="py-16 md:py-20 bg-gray-50/70 dark:bg-gray-900/40 border-y border-gray-200/70 dark:border-gray-800/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200/70 dark:border-gray-800/70">
            <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center mb-4">
              <Lock size={16} className="text-brand-300" />
            </div>
            <h3 className="font-display text-lg font-medium text-gray-900 dark:text-white mb-2 tracking-tight">
              Your data, your browser.
            </h3>
            <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              Everything you build is stored in localStorage. No account, no server, no tracking. Use
              Export JSON in the Builder to back up any time.
            </p>
            <Link
              href="/admin"
              className="text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 inline-flex items-center gap-1.5 group"
            >
              <Download size={13} />
              Open Builder &middot; export backup
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200/70 dark:border-gray-800/70">
            <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center mb-4">
              <MessageCircle size={16} className="text-brand-300" />
            </div>
            <h3 className="font-display text-lg font-medium text-gray-900 dark:text-white mb-2 tracking-tight">
              Still stuck? Talk to us.
            </h3>
            <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              Real human, real reply — usually within a day. Tell us what you tried and where it broke.
            </p>
            <Link
              href="/contact"
              className="text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 inline-flex items-center gap-1.5 group"
            >
              <Mail size={13} />
              Send a note
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-24 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-medium text-gray-900 dark:text-white tracking-tighter leading-[1.05] mb-4">
            Ready when you are.
          </h2>
          <p className="text-[15px] text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
            Open the Builder and paste your resume. Seven minutes from now, you&rsquo;ll have a
            recruiter-ready portfolio.
          </p>
          <Link
            href="/admin"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[15px] font-semibold text-white bg-gray-900 hover:bg-black hover:-translate-y-0.5 transition-all duration-200 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)]"
          >
            <FileText size={15} className="text-brand-300" />
            Open the Builder
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
