"use client";

import { useState } from "react";
import { Loader2, AlertCircle, Send, Copy, Check, Mail } from "lucide-react";
import ToolShell from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import {
  aiGenerateRecruiterReply,
  buildResumeText,
  loadAIConfig,
  ReplyDraft,
  ReplyIntent,
} from "@/lib/ai";

const INTENTS: Array<{ id: ReplyIntent; label: string; description: string }> = [
  { id: "interested",  label: "I'm interested",        description: "Express interest, ask 1-2 clarifying questions" },
  { id: "more-info",   label: "Tell me more first",    description: "Non-committal — get details before saying yes" },
  { id: "not-now",     label: "Not right now",         description: "Polite no, but keep door open for future roles" },
  { id: "decline",     label: "Politely decline",      description: "Close the loop respectfully, no future outreach" },
];

const TONE_PILL: Record<string, string> = {
  warm: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
  professional: "bg-brand-100 text-brand-800 border-brand-200 dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-500/20",
  brief: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700",
};

export default function RecruiterReplyPage() {
  const { data } = usePortfolioData();
  const [message, setMessage] = useState("");
  const [intent, setIntent] = useState<ReplyIntent>("interested");
  const [loading, setLoading] = useState(false);
  const [drafts, setDrafts] = useState<ReplyDraft[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedTone, setCopiedTone] = useState<string | null>(null);

  const run = async () => {
    setError(null);
    if (message.trim().length < 40) {
      setError("Paste the recruiter's full message so AI can match their tone.");
      return;
    }
    const config = loadAIConfig();
    if (!config?.apiKey) {
      setError("Set up your AI key in Admin → AI Setup first.");
      return;
    }
    setLoading(true);
    setDrafts(null);
    try {
      const resumeText = buildResumeText(data);
      const out = await aiGenerateRecruiterReply(message, intent, resumeText, config);
      setDrafts(out);
    } catch (e: any) {
      setError(e?.message || "Reply generation failed. Try a different model.");
    } finally {
      setLoading(false);
    }
  };

  const copy = (text: string, tone: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTone(tone);
    setTimeout(() => setCopiedTone(null), 1500);
  };

  return (
    <ToolShell
      emoji="✉️"
      title="Recruiter Reply Generator"
      tagline="Paste a recruiter's message → get 3 polished reply drafts in different tones. Stop freezing on LinkedIn."
    >
      <Card hover={false}>
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              The recruiter&apos;s message
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={7}
              placeholder='Paste the full LinkedIn DM or email here. Include any role details, company name, comp signal, etc.'
              className="w-full p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              How do you want to respond?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {INTENTS.map(i => {
                const active = intent === i.id;
                return (
                  <button
                    key={i.id}
                    onClick={() => setIntent(i.id)}
                    className={`text-left px-4 py-3 rounded-lg border-2 transition ${
                      active
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                        : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                    }`}
                  >
                    <div className={`text-sm font-semibold ${active ? "text-brand-700 dark:text-brand-300" : "text-gray-900 dark:text-white"}`}>
                      {i.label}
                    </div>
                    <div className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {i.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Button onClick={run} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Writing…
                </>
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  Generate 3 drafts
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

      {drafts && drafts.length > 0 && (
        <div className="mt-6 space-y-3">
          {drafts.map(d => (
            <Card hover={false} key={d.tone}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${TONE_PILL[d.tone] || TONE_PILL.professional}`}>
                    <Mail size={10} />
                    {d.tone}
                  </span>
                  <button
                    onClick={() => copy(d.body, d.tone)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                  >
                    {copiedTone === d.tone ? <Check size={12} /> : <Copy size={12} />}
                    {copiedTone === d.tone ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="text-[14px] text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {d.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ToolShell>
  );
}
