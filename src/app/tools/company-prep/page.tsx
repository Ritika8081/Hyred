"use client";

import { useState } from "react";
import {
  Loader2,
  AlertCircle,
  Building2,
  MessageSquareQuote,
  Lightbulb,
  ShieldAlert,
  Copy,
  Check,
} from "lucide-react";
import ToolShell from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import {
  aiCompanyPrep,
  buildResumeText,
  CompanyPrepResult,
  loadAIConfig,
} from "@/lib/ai";

export default function CompanyPrepPage() {
  const { data } = usePortfolioData();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState(data.personalInfo.title || "");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompanyPrepResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const run = async () => {
    setError(null);
    if (company.trim().length < 2 || role.trim().length < 2) {
      setError("Company name and role are required.");
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
      const r = await aiCompanyPrep(company, role, notes, resumeText, config);
      setResult(r);
    } catch (e: any) {
      setError(e?.message || "Prep failed. Try a different model.");
    } finally {
      setLoading(false);
    }
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <ToolShell
      emoji="🏢"
      title="Company Interview Prep"
      tagline="Interview tomorrow? Paste a company name + role. AI builds you a one-page brief in 30 seconds."
    >
      <Card hover={false}>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Company name
              </label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Stripe"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Role you&apos;re interviewing for
              </label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Anything you&apos;ve already pulled? <span className="font-normal text-gray-500 dark:text-gray-400">(optional — JD, About page, recent news, interviewer LinkedIn)</span>
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={6}
              placeholder="Paste anything here — JD, About page text, recent press release, interviewer's LinkedIn bio, anything. AI will use it to make the prep sharper."
              className="w-full p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center justify-end">
            <Button onClick={run} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Building your brief…
                </>
              ) : (
                <>
                  <Building2 size={16} className="mr-2" />
                  Build prep brief
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

      {result && (
        <div className="mt-6 space-y-4">
          {/* Snapshot */}
          <Card hover={false}>
            <CardContent className="p-6">
              <div className="text-[11px] uppercase tracking-widest font-semibold text-brand-700 dark:text-brand-300 mb-2">
                Company snapshot
              </div>
              <p className="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed">
                {result.snapshot}
              </p>
            </CardContent>
          </Card>

          {/* Interview style */}
          <Card hover={false}>
            <CardContent className="p-6">
              <div className="text-[11px] uppercase tracking-widest font-semibold text-brand-700 dark:text-brand-300 mb-2">
                Likely interview style
              </div>
              <p className="text-[14px] text-gray-700 dark:text-gray-300 leading-relaxed">
                {result.interviewStyle}
              </p>
            </CardContent>
          </Card>

          {/* Smart questions */}
          {result.smartQuestions.length > 0 && (
            <Card hover={false}>
              <CardContent className="p-6">
                <h3 className="text-sm uppercase tracking-wider font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-1.5">
                  <MessageSquareQuote size={14} className="text-brand-600" />
                  Smart questions to ask them
                </h3>
                <ol className="space-y-3">
                  {result.smartQuestions.map((q, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <span className="flex-shrink-0 mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-bold text-white bg-gradient-to-br from-brand-600 to-lime-500">
                        {i + 1}
                      </span>
                      <p className="flex-1 text-[14px] text-gray-700 dark:text-gray-300 leading-snug">{q}</p>
                      <button
                        onClick={() => copy(q, `q-${i}`)}
                        className="opacity-0 group-hover:opacity-100 transition text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white inline-flex items-center gap-1"
                      >
                        {copiedKey === `q-${i}` ? <Check size={11} /> : <Copy size={11} />}
                      </button>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          {/* Talking points */}
          {result.talkingPoints.length > 0 && (
            <Card hover={false} className="border-brand-300 dark:border-brand-500/30 bg-brand-50/40 dark:bg-brand-500/[0.06]">
              <CardContent className="p-6">
                <h3 className="text-sm uppercase tracking-wider font-bold text-brand-700 dark:text-brand-300 mb-4 flex items-center gap-1.5">
                  <Lightbulb size={14} />
                  Talking points (show you did the research)
                </h3>
                <ul className="space-y-2">
                  {result.talkingPoints.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-[14px] text-gray-700 dark:text-gray-300 leading-snug">
                      <span className="text-brand-500 mt-1 flex-shrink-0">→</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Red flags */}
          {result.redFlagsToWatch.length > 0 && (
            <Card hover={false}>
              <CardContent className="p-6">
                <h3 className="text-sm uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400 mb-4 flex items-center gap-1.5">
                  <ShieldAlert size={14} />
                  Subtle red flags to watch in the interview
                </h3>
                <ul className="space-y-2">
                  {result.redFlagsToWatch.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-[14px] text-gray-700 dark:text-gray-300 leading-snug">
                      <span className="text-amber-500 mt-1 flex-shrink-0">!</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </ToolShell>
  );
}
