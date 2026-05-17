"use client";

import { useState } from "react";
import { Loader2, AlertCircle, Sparkles, Copy, Check, BarChart3 } from "lucide-react";
import ToolShell from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  aiQuantifyBullet,
  loadAIConfig,
  QuantifyResult,
} from "@/lib/ai";

const CATEGORIES = [
  "engineering",
  "product",
  "design",
  "data / ML",
  "marketing",
  "sales",
  "ops / PM",
  "other",
];

const STYLE_PILL: Record<string, string> = {
  conservative: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
  bold: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
  "data-heavy": "bg-brand-100 text-brand-800 border-brand-200 dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-500/20",
};

export default function QuantifyPage() {
  const [bullet, setBullet] = useState("");
  const [context, setContext] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuantifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const run = async () => {
    setError(null);
    if (bullet.trim().length < 12) {
      setError("Paste a bullet you want to upgrade (at least a few words).");
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
      const r = await aiQuantifyBullet(bullet, context, category, config);
      setResult(r);
    } catch (e: any) {
      setError(e?.message || "Quantify failed. Try a different model.");
    } finally {
      setLoading(false);
    }
  };

  const copy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <ToolShell
      emoji="📊"
      title="Impact Quantifier"
      tagline="Turn vague bullets like 'built a dashboard' into 'shipped a dashboard used by 200+ engineers, cutting MTTR by 45%'."
    >
      <Card hover={false}>
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Paste your current bullet
            </label>
            <textarea
              value={bullet}
              onChange={e => setBullet(e.target.value)}
              rows={3}
              placeholder='e.g. "Built an internal dashboard for the platform team"'
              className="w-full p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Anything specific you know? <span className="font-normal text-gray-500 dark:text-gray-400">(optional but recommended)</span>
            </label>
            <textarea
              value={context}
              onChange={e => setContext(e.target.value)}
              rows={3}
              placeholder="Drop any numbers, scale, before/after data, team size, time invested, etc. AI uses these to ground its rewrites in reality."
              className="w-full p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Role category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end">
            <Button onClick={run} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Quantifying…
                </>
              ) : (
                <>
                  <BarChart3 size={16} className="mr-2" />
                  Generate 3 variants
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
          <div className="space-y-3">
            {result.variants.map((v, i) => (
              <Card hover={false} key={i}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STYLE_PILL[v.style] || STYLE_PILL.conservative}`}>
                      {v.style.replace("-", " ")}
                    </span>
                    <button
                      onClick={() => copy(v.text, i)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                    >
                      {copiedIdx === i ? <Check size={12} /> : <Copy size={12} />}
                      {copiedIdx === i ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="text-[15px] text-gray-900 dark:text-white leading-relaxed mb-2 font-medium">
                    {v.text}
                  </p>
                  <p className="text-[12px] text-gray-500 dark:text-gray-400 italic leading-relaxed">
                    {v.reasoning}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {result.metricsToGather.length > 0 && (
            <Card hover={false} className="border-brand-300 dark:border-brand-500/30 bg-brand-50/40 dark:bg-brand-500/[0.06]">
              <CardContent className="p-5">
                <h3 className="text-sm uppercase tracking-wider font-bold text-brand-700 dark:text-brand-300 mb-3 flex items-center gap-1.5">
                  <Sparkles size={14} />
                  Numbers worth digging up
                </h3>
                <ul className="space-y-2">
                  {result.metricsToGather.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-[14px] text-gray-700 dark:text-gray-300 leading-snug">
                      <span className="text-brand-500 mt-1 flex-shrink-0">→</span>
                      {m}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  Even rough ranges (&ldquo;weekly&rdquo;, &ldquo;dozens&rdquo;, &ldquo;reduced by ~40%&rdquo;) beat zero numbers.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </ToolShell>
  );
}
