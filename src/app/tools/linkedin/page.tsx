"use client";

import { useState } from "react";
import { Linkedin, Loader2, AlertCircle, Wand2 } from "lucide-react";
import ToolShell from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CopyButton from "@/components/ui/copy-button";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { aiOptimizeLinkedIn, buildResumeText, LinkedInOptimization, loadAIConfig } from "@/lib/ai";

export default function LinkedInPage() {
  const { data } = usePortfolioData();
  const [result, setResult] = useState<LinkedInOptimization | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setError(null);
    const config = loadAIConfig();
    if (!config?.apiKey) {
      setError("Set up your AI key in Admin → AI Setup.");
      return;
    }
    setLoading(true);
    try {
      const resumeText = buildResumeText(data);
      const out = await aiOptimizeLinkedIn(resumeText, config);
      setResult(out);
    } catch (e: any) {
      setError(e?.message || "Failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell
      emoji="💼"
      title="LinkedIn Profile Optimizer"
      tagline="Recruiter-magnet headline + About + experience bullets. Copy into LinkedIn in 5 minutes."
    >
      <Card className="mb-6" hover={false}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Linkedin className="text-[#0a66c2] flex-shrink-0 mt-1" size={28} />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                We&apos;ll rewrite: headline · About · experience bullets
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Based on your portfolio data. Then you paste each into LinkedIn manually — takes 5 minutes total.
              </p>
              <Button onClick={generate} disabled={loading} size="lg">
                {loading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Optimizing…
                  </>
                ) : (
                  <>
                    <Wand2 size={16} className="mr-2" />
                    Optimize my LinkedIn
                  </>
                )}
              </Button>
            </div>
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
        <div className="space-y-6">
          {/* Headline */}
          <Card hover={false}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm uppercase tracking-wider font-bold text-gray-900">
                  Headline
                </h3>
                <CopyButton value={result.headline} label="Copy" />
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-gray-900 font-medium">{result.headline}</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">{result.headline.length} / 220 characters</p>
            </CardContent>
          </Card>

          {/* About */}
          <Card hover={false}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm uppercase tracking-wider font-bold text-gray-900">
                  About section
                </h3>
                <CopyButton value={result.about} label="Copy" />
              </div>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg whitespace-pre-wrap text-gray-800 leading-relaxed">
                {result.about}
              </div>
              <p className="text-xs text-gray-500 mt-2">{result.about.length} / 2,600 characters</p>
            </CardContent>
          </Card>

          {/* Experience */}
          {result.experienceBullets.length > 0 && (
            <Card hover={false}>
              <CardContent className="p-6">
                <h3 className="text-sm uppercase tracking-wider font-bold text-gray-900 mb-4">
                  Experience bullets
                </h3>
                <div className="space-y-5">
                  {result.experienceBullets.map((exp, i) => {
                    const bulletText = exp.bullets.map(b => `• ${b}`).join("\n");
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-gray-900 text-sm">{exp.role}</p>
                          <CopyButton value={bulletText} label="Copy" />
                        </div>
                        <ul className="space-y-1.5 bg-gray-50 border border-gray-200 rounded-lg p-3">
                          {exp.bullets.map((b, j) => (
                            <li key={j} className="text-sm text-gray-800 flex gap-2">
                              <span className="text-gray-400">•</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <Card hover={false} className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-sm text-blue-900">
                <strong>📌 How to apply:</strong> Open LinkedIn → click the pencil icon on each section → paste. Headline first (biggest SEO impact), then About, then update each role&apos;s description.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </ToolShell>
  );
}
