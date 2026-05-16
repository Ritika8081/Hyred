"use client";

import { useRef, useState } from "react";
import { Flame, Loader2, Twitter, Linkedin, Download, RefreshCw, AlertCircle } from "lucide-react";
import ToolShell from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { aiRoastResume, buildResumeText, loadAIConfig, RoastResult } from "@/lib/ai";

export default function RoastPage() {
  const { data } = usePortfolioData();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const gradFrom = data.personalInfo.brand?.gradientFrom || "#f97316";
  const gradTo = data.personalInfo.brand?.gradientTo || "#84cc16";

  const handleRoast = async () => {
    setError(null);
    const config = loadAIConfig();
    if (!config?.apiKey) {
      setError("Set up your AI key in Admin → AI Setup first.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const text = buildResumeText(data);
      const roast = await aiRoastResume(text, config);
      setResult(roast);
    } catch (e: any) {
      setError(e?.message || "Failed to roast. Try a different model.");
    } finally {
      setLoading(false);
    }
  };

  const shareText = result
    ? `My resume just got roasted by Hyred AI: "${result.vibe}" — Score: ${result.score}/100 🔥\n\nGet your resume roasted free at`
    : "";
  const shareUrl = typeof window !== "undefined" ? window.location.origin + "/tools/roast" : "";

  const printCard = () => {
    if (!cardRef.current) return;
    window.print();
  };

  return (
    <ToolShell
      emoji="🔥"
      title="Roast My Resume"
      tagline="Brutally honest AI critique. The truth recruiters won't tell you."
    >
      <Card className="mb-6" hover={false}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                We&apos;ll roast: {data.personalInfo.name}&apos;s resume
              </h3>
              <p className="text-sm text-gray-600">
                Uses the data from your portfolio. The AI will not be kind — but it will be specific. Share the result if you dare. 😈
              </p>
            </div>
            <Button onClick={handleRoast} disabled={loading} size="lg">
              {loading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Roasting…
                </>
              ) : result ? (
                <>
                  <RefreshCw size={18} className="mr-2" />
                  Roast again
                </>
              ) : (
                <>
                  <Flame size={18} className="mr-2" />
                  Roast me
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded bg-red-50 border border-red-200 text-sm text-red-800 flex items-start gap-2">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <>
          {/* The shareable card */}
          <div
            ref={cardRef}
            id="roast-card"
            className="relative rounded-2xl overflow-hidden shadow-2xl mb-6"
            style={{
              background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
            }}
          >
            <div className="p-8 md:p-10 text-white">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-widest opacity-90 font-semibold">
                    Resume Roast · Hyred
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold mt-1">
                    {data.personalInfo.name}
                  </h2>
                </div>
                <div className="text-right">
                  <div className="text-5xl md:text-6xl font-black leading-none">
                    {result.score}
                  </div>
                  <div className="text-xs opacity-90 tracking-wider">/ 100</div>
                </div>
              </div>

              <p className="text-xl md:text-2xl font-semibold italic mb-6 leading-snug">
                &ldquo;{result.vibe}&rdquo;
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/15 backdrop-blur rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wider font-bold mb-2 opacity-90">
                    ✅ Working
                  </p>
                  <ul className="space-y-1.5 text-sm">
                    {result.wins.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-black/20 backdrop-blur rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wider font-bold mb-2 opacity-90">
                    🔥 Roasted
                  </p>
                  <ul className="space-y-1.5 text-sm">
                    {result.fails.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-white/30 pt-4">
                <p className="text-xs uppercase tracking-wider font-bold mb-1 opacity-90">
                  💡 Top fix
                </p>
                <p className="text-base font-medium">{result.fix}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/30 flex items-center justify-between text-xs opacity-90">
                <span>hyred · AI-powered resume builder</span>
                <span>hyred.io/tools/roast</span>
              </div>
            </div>
          </div>

          {/* Share actions */}
          <Card hover={false}>
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-3">Share the roast</h3>
              <p className="text-sm text-gray-600 mb-4">
                Screenshot the card above and post it. The whole point of a roast is bragging about surviving it. 😏
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <Twitter size={16} className="mr-1.5" />
                    Tweet it
                  </Button>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <Linkedin size={16} className="mr-1.5" />
                    LinkedIn
                  </Button>
                </a>
                <Button onClick={printCard} variant="outline" size="sm">
                  <Download size={16} className="mr-1.5" />
                  Print / Save as PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #roast-card, #roast-card * { visibility: visible; }
          #roast-card { position: absolute; top: 0; left: 0; width: 100%; }
        }
      `}</style>
    </ToolShell>
  );
}
