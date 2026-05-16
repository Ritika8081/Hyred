"use client";

import { useState } from "react";
import { TrendingUp, Loader2, AlertCircle, Check, Lightbulb, ExternalLink } from "lucide-react";
import ToolShell from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { aiAnalyzeSkillGap, buildResumeText, loadAIConfig, SkillGapReport } from "@/lib/ai";

export default function SkillsPage() {
  const { data } = usePortfolioData();
  const [role, setRole] = useState(data.personalInfo.title || "");
  const [report, setReport] = useState<SkillGapReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    setError(null);
    if (!role.trim()) {
      setError("Enter a target role.");
      return;
    }
    const config = loadAIConfig();
    if (!config?.apiKey) {
      setError("Set up your AI key in Admin → AI Setup.");
      return;
    }
    setLoading(true);
    setReport(null);
    try {
      const resumeText = buildResumeText(data);
      const r = await aiAnalyzeSkillGap(resumeText, role, config);
      setReport(r);
    } catch (e: any) {
      setError(e?.message || "Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = report
    ? report.fitScore >= 75
      ? "text-emerald-600"
      : report.fitScore >= 50
      ? "text-amber-600"
      : "text-red-600"
    : "text-gray-400";

  return (
    <ToolShell
      emoji="📈"
      title="Skill Gap Analyzer"
      tagline="Tell us your target role. AI tells you exactly what to learn and what to build to get there."
    >
      <Card className="mb-6" hover={false}>
        <CardContent className="p-6 space-y-3">
          <label className="block text-sm font-semibold text-gray-900">
            Target role
          </label>
          <input
            type="text"
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder="e.g. Senior Frontend Engineer at a fintech, or Data Scientist at a Series B startup"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <p className="text-xs text-gray-500">
            Be specific — &quot;Frontend Engineer at fintech&quot; gives better advice than just &quot;Developer&quot;.
          </p>
          <Button onClick={analyze} disabled={loading} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Analyzing your gap…
              </>
            ) : (
              <>
                <TrendingUp size={16} className="mr-2" />
                Show me what to learn
              </>
            )}
          </Button>
          {error && (
            <div className="p-3 rounded bg-red-50 border border-red-200 text-sm text-red-800 flex items-start gap-2">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {report && (
        <div className="space-y-5">
          {/* Fit score + summary */}
          <Card hover={false}>
            <CardContent className="p-6 text-center">
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-2">
                Readiness right now
              </p>
              <div className={`text-6xl font-black mb-2 ${scoreColor}`}>
                {report.fitScore}%
              </div>
              <p className="text-gray-700 max-w-xl mx-auto">{report.summary}</p>
            </CardContent>
          </Card>

          {/* Matched + missing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card hover={false}>
              <CardContent className="p-6">
                <h3 className="text-sm uppercase tracking-wider font-bold text-emerald-700 mb-3">
                  ✓ You already have
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {report.matched.map(s => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium"
                    >
                      <Check size={11} />
                      {s}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card hover={false}>
              <CardContent className="p-6">
                <h3 className="text-sm uppercase tracking-wider font-bold text-red-700 mb-3">
                  ✗ To learn ({report.missing.length})
                </h3>
                <ul className="space-y-3">
                  {report.missing.map((m, i) => (
                    <li key={i} className="border-l-2 border-red-200 pl-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-gray-900">{m.skill}</p>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                            m.priority === "must"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {m.priority === "must" ? "Must-have" : "Nice-to-have"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{m.learnPath}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Project ideas */}
          <Card hover={false}>
            <CardContent className="p-6">
              <h3 className="text-sm uppercase tracking-wider font-bold text-brand-700 mb-3 flex items-center gap-1.5">
                <Lightbulb size={14} />
                Projects to close the gap
              </h3>
              <div className="space-y-3">
                {report.projectIdeas.map((p, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border-2 border-brand-200 bg-gradient-to-br from-brand-50 to-coral-50"
                  >
                    <h4 className="font-bold text-gray-900 mb-1">{p.title}</h4>
                    <p className="text-sm text-gray-700 mb-2">{p.pitch}</p>
                    <div className="flex flex-wrap gap-1">
                      {p.stack.map(t => (
                        <span
                          key={t}
                          className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-white text-brand-700 border border-brand-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                💡 Try <a href="/tools/projects" className="underline">Project Idea Generator</a> for more options with detailed scopes.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </ToolShell>
  );
}
