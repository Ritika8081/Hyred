"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { aiRewrite, loadAIConfig } from "@/lib/ai";

type RewriteMode = "professional" | "impact" | "concise" | "ats" | "casual";

interface AIRewriteButtonProps {
  value: string;
  onResult: (newValue: string) => void;
  context: string; // explains what the text is for (e.g. "Bio for portfolio hero")
  size?: "sm" | "md";
  modes?: RewriteMode[];
  label?: string;
}

const MODE_LABELS: Record<RewriteMode, { label: string; emoji: string; desc: string }> = {
  professional: { label: "Professional", emoji: "💼", desc: "Polished, recruiter-friendly" },
  impact: { label: "Impact-focused", emoji: "⚡", desc: "Lead with outcomes & metrics" },
  ats: { label: "ATS-optimize", emoji: "🎯", desc: "Strong keywords, scannable" },
  concise: { label: "Make concise", emoji: "✂️", desc: "30-50% shorter" },
  casual: { label: "Warm tone", emoji: "🤝", desc: "Human, still professional" },
};

export default function AIRewriteButton({
  value,
  onResult,
  context,
  size = "sm",
  modes = ["professional", "impact", "ats", "concise"],
  label,
}: AIRewriteButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<RewriteMode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const run = async (mode: RewriteMode) => {
    setError(null);
    const config = loadAIConfig();
    if (!config?.apiKey) {
      setError("Set up AI Settings first (top of admin).");
      return;
    }
    if (!value || value.trim().length < 3) {
      setError("Write something first, then AI can rewrite it.");
      return;
    }
    setLoading(mode);
    try {
      const result = await aiRewrite(value, mode, context, config);
      onResult(result.trim());
      setOpen(false);
    } catch (e: any) {
      setError(e?.message || "AI request failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => { setError(null); setOpen(o => !o); }}
        className={`inline-flex items-center gap-1.5 rounded-md font-medium transition shadow-sm bg-gradient-to-r from-brand-600 to-coral-600 text-white hover:shadow-md ${
          size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
        }`}
        aria-label="AI rewrite"
      >
        <Sparkles size={size === "sm" ? 12 : 14} />
        {label || "AI"}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 z-30 p-2">
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Rewrite with AI
          </div>
          {modes.map(mode => {
            const m = MODE_LABELS[mode];
            return (
              <button
                key={mode}
                type="button"
                onClick={() => run(mode)}
                disabled={loading !== null}
                className="w-full flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-lg leading-none mt-0.5">{m.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                    {m.label}
                    {loading === mode && <Loader2 size={12} className="animate-spin" />}
                  </div>
                  <div className="text-xs text-gray-500">{m.desc}</div>
                </div>
              </button>
            );
          })}
          {error && (
            <div className="m-2 p-2 rounded bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-1.5">
              <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
