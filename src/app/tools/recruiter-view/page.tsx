"use client";

import { useState } from "react";
import {
  Loader2,
  AlertCircle,
  Sparkles,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Hand,
  Wrench,
  Flame,
} from "lucide-react";
import ToolShell from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import {
  aiRecruiterView,
  buildResumeText,
  loadAIConfig,
  RecruiterViewResult,
} from "@/lib/ai";

const VERDICT_STYLES: Record<RecruiterViewResult["snapVerdict"], {
  label: string;
  pill: string;
  ring: string;
  icon: typeof ThumbsUp;
}> = {
  interview: {
    label: "Worth interviewing",
    pill: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
    ring: "ring-emerald-200 dark:ring-emerald-500/30",
    icon: ThumbsUp,
  },
  maybe: {
    label: "On the fence",
    pill: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
    ring: "ring-amber-200 dark:ring-amber-500/30",
    icon: Hand,
  },
  pass: {
    label: "Pass",
    pill: "bg-red-100 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20",
    ring: "ring-red-200 dark:ring-red-500/30",
    icon: ThumbsDown,
  },
};

export default function RecruiterViewPage() {
  const { data } = usePortfolioData();
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecruiterViewResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const simulate = async () => {
    setError(null);
    if (jd.trim().length < 80) {
      setError("Paste a fuller job description (at least a paragraph).");
      return;
    }
    const config = loadAIConfig();
    if (!config?.apiKey) {
      setError("Set up your AI key in Admin → AI Setup first.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const resumeText = buildResumeText(data);
      const r = await aiRecruiterView(resumeText, jd, config);
      setResult(r);
    } catch (e: any) {
      setError(e?.message || "Simulation failed. Try a different model.");
    } finally {
      setLoading(false);
    }
  };

  const verdict = result ? VERDICT_STYLES[result.snapVerdict] : null;
  const VerdictIcon = verdict?.icon;

  return (
    <ToolShell
      emoji="👀"
      title="Recruiter View Simulator"
      tagline="Paste a JD. AI plays a senior recruiter — gives you the 30-second snap reaction and the 2-minute deep read."
    >
      <Card hover={false}>
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Paste the job description
            </label>
            <textarea
              value={jd}
              onChange={e => setJd(e.target.value)}
              rows={8}
              placeholder="Paste the full JD — responsibilities, requirements, nice-to-haves. The more context, the sharper the simulation."
              className="w-full p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Runs against your saved portfolio data ({data.personalInfo.name || "set your name in /admin"}).
            </p>
            <Button onClick={simulate} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Simulating…
                </>
              ) : (
                <>
                  <Eye size={16} className="mr-2" />
                  Run the simulation
                </>
              )}
            </Button>
          </div>
          {error && (
            <div className="p-3 rounded bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-800 dark:text-red-300 flex items-start gap-2">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {result && verdict && VerdictIcon && (
        <div className="mt-6 space-y-4">
          {/* Verdict + odds */}
          <Card hover={false} className={`ring-2 ${verdict.ring}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${verdict.pill}`}
                  >
                    <VerdictIcon size={12} />
                    Snap verdict — {verdict.label}
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mt-2 tracking-tight">
                    {result.callbackOdds}%{" "}
                    <span className="text-gray-500 dark:text-gray-400 font-normal">callback odds</span>
                  </h2>
                </div>
                <div className="w-full sm:w-64">
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${result.callbackOdds}%`,
                        background:
                          "linear-gradient(90deg, #0d9488 0%, #84cc16 50%, #f97316 100%)",
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest font-semibold text-gray-400 dark:text-gray-500 mt-1.5">
                    <span>cold</span>
                    <span>warm</span>
                    <span>hot</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 30s + 2min impressions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card hover={false}>
              <CardContent className="p-6">
                <div className="text-[11px] uppercase tracking-widest font-semibold text-brand-700 dark:text-brand-300 mb-2">
                  30-second skim
                </div>
                <p className="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  &ldquo;{result.thirtySecondImpression}&rdquo;
                </p>
              </CardContent>
            </Card>
            <Card hover={false}>
              <CardContent className="p-6">
                <div className="text-[11px] uppercase tracking-widest font-semibold text-brand-700 dark:text-brand-300 mb-2">
                  2-minute deep read
                </div>
                <p className="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  &ldquo;{result.twoMinuteImpression}&rdquo;
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Hooks + red flags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.hooks.length > 0 && (
              <Card hover={false}>
                <CardContent className="p-6">
                  <h3 className="text-sm uppercase tracking-wider font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                    <Flame size={14} />
                    What hooked them
                  </h3>
                  <ul className="space-y-2">
                    {result.hooks.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-[14px] text-gray-700 dark:text-gray-300 leading-snug">
                        <span className="text-emerald-500 mt-1 flex-shrink-0">✓</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {result.redFlags.length > 0 && (
              <Card hover={false}>
                <CardContent className="p-6">
                  <h3 className="text-sm uppercase tracking-wider font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-1.5">
                    <AlertCircle size={14} />
                    What made them hesitate
                  </h3>
                  <ul className="space-y-2">
                    {result.redFlags.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-[14px] text-gray-700 dark:text-gray-300 leading-snug">
                        <span className="text-red-500 mt-1 flex-shrink-0">✕</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Fixes to flip */}
          {result.fixesThatWouldFlip.length > 0 && (
            <Card hover={false} className="border-brand-300 dark:border-brand-500/30 bg-brand-50/40 dark:bg-brand-500/[0.06]">
              <CardContent className="p-6">
                <h3 className="text-sm uppercase tracking-wider font-bold text-brand-700 dark:text-brand-300 mb-3 flex items-center gap-1.5">
                  <Wrench size={14} />
                  Fixes that would flip this to an interview
                </h3>
                <ul className="space-y-2">
                  {result.fixesThatWouldFlip.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-lg bg-white/70 dark:bg-white/[0.04] border border-brand-100 dark:border-brand-500/20 text-[14px] text-gray-800 dark:text-gray-200 leading-snug"
                    >
                      <span className="flex-shrink-0 mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-md text-[11px] font-bold text-white bg-gradient-to-br from-brand-600 to-lime-500">
                        {i + 1}
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5">
                  <Sparkles size={11} className="flex-shrink-0 mt-0.5 text-brand-500" />
                  Edit your portfolio in <a href="/admin" className="underline font-semibold">Admin</a>, then re-run to see the new odds.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </ToolShell>
  );
}
