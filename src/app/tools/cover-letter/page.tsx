"use client";

import { useState } from "react";
import { FileText, Loader2, Download, AlertCircle } from "lucide-react";
import ToolShell from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CopyButton from "@/components/ui/copy-button";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { aiGenerateCoverLetter, buildResumeText, loadAIConfig } from "@/lib/ai";

type Tone = "professional" | "warm" | "confident" | "concise";

const TONES: { id: Tone; label: string; emoji: string; desc: string }[] = [
  { id: "professional", label: "Professional", emoji: "💼", desc: "Polished, formal" },
  { id: "warm", label: "Warm", emoji: "🤝", desc: "Human, friendly" },
  { id: "confident", label: "Confident", emoji: "⚡", desc: "Direct, outcome-led" },
  { id: "concise", label: "Concise", emoji: "✂️", desc: "Under 200 words" },
];

export default function CoverLetterPage() {
  const { data } = usePortfolioData();
  const [jd, setJd] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setError(null);
    if (jd.trim().length < 80) {
      setError("Paste a fuller job description.");
      return;
    }
    const config = loadAIConfig();
    if (!config?.apiKey) {
      setError("Set up your AI key in Admin → AI Setup.");
      return;
    }
    setLoading(true);
    setLetter("");
    try {
      const resumeText = buildResumeText(data);
      const out = await aiGenerateCoverLetter(resumeText, jd, tone, config);
      setLetter(out.trim());
    } catch (e: any) {
      setError(e?.message || "Failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!letter) return;
    const blob = new Blob([letter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${data.personalInfo.name?.replace(/\s+/g, "-").toLowerCase() || "you"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolShell
      emoji="📝"
      title="Cover Letter Generator"
      tagline="Paste the JD, pick a tone, get a tailored letter in seconds."
    >
      <Card className="mb-6" hover={false}>
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Job description
            </label>
            <textarea
              value={jd}
              onChange={e => setJd(e.target.value)}
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm"
              placeholder="Paste the full JD here…"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Tone</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TONES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`p-3 rounded-lg border-2 text-left transition ${
                    tone === t.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="text-2xl mb-1">{t.emoji}</div>
                  <div className="text-sm font-bold text-gray-900">{t.label}</div>
                  <div className="text-xs text-gray-500">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{jd.length} chars</span>
            <Button onClick={generate} disabled={loading} size="lg">
              {loading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Writing…
                </>
              ) : (
                <>
                  <FileText size={18} className="mr-2" />
                  Generate cover letter
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="p-3 rounded bg-red-50 border border-red-200 text-sm text-red-800 flex items-start gap-2">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {letter && (
        <Card hover={false}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Your cover letter</h3>
              <div className="flex gap-2">
                <CopyButton value={letter} label="copy" />
                <Button onClick={download} variant="outline" size="sm">
                  <Download size={14} className="mr-1.5" />
                  .txt
                </Button>
              </div>
            </div>
            <div className="whitespace-pre-wrap bg-gray-50 border border-gray-200 rounded-lg p-6 text-gray-800 leading-relaxed font-serif">
              {letter}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              💡 Always re-read and personalize before sending. AI is a draft, not a final.
            </p>
          </CardContent>
        </Card>
      )}
    </ToolShell>
  );
}
