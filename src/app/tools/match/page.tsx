"use client";

import { useState } from "react";
import { Target, Loader2, CheckCircle2, AlertCircle, X, Plus, Sparkles } from "lucide-react";
import ToolShell from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { aiMatchJD, buildResumeText, JDMatchResult, loadAIConfig } from "@/lib/ai";

export default function MatchPage() {
  const { data, updatePersonalInfo, updateSkills } = usePortfolioData();
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JDMatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const gradFrom = data.personalInfo.brand?.gradientFrom || "#2563eb";
  const gradTo = data.personalInfo.brand?.gradientTo || "#7c3aed";

  const handleMatch = async () => {
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
      const r = await aiMatchJD(resumeText, jd, config);
      setResult(r);
    } catch (e: any) {
      setError(e?.message || "Match failed. Try a different model.");
    } finally {
      setLoading(false);
    }
  };

  const applyRewrite = () => {
    if (!result) return;
    updatePersonalInfo({ ...data.personalInfo, bio: result.rewriteSummary });
    alert("Tailored bio applied to your portfolio. Don't forget to save in Admin.");
  };

  const addMissingSkill = (name: string) => {
    const exists = data.skills.some(s => s.name.toLowerCase() === name.toLowerCase());
    if (exists) return;
    const next = [
      ...data.skills,
      {
        id: `skill-${Date.now()}-${name}`,
        name,
        category: "tools" as const,
        proficiency: 3 as const,
        yearsOfExperience: 1,
      },
    ];
    updateSkills(next);
  };

  const scoreColor = result
    ? result.matchScore >= 75
      ? "text-emerald-600"
      : result.matchScore >= 50
      ? "text-amber-600"
      : "text-red-600"
    : "text-gray-400";

  return (
    <ToolShell
      emoji="🎯"
      title="JD Matcher"
      tagline="Paste a job description. AI tells you how well you fit — and what to fix."
    >
      <Card className="mb-6" hover={false}>
        <CardContent className="p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Paste the job description
          </label>
          <textarea
            value={jd}
            onChange={e => setJd(e.target.value)}
            rows={8}
            className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm"
            placeholder="Paste the full job description here — role, requirements, responsibilities, the more text the better the match score…"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-500">{jd.length} characters</span>
            <Button onClick={handleMatch} disabled={loading} size="lg">
              {loading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Target size={18} className="mr-2" />
                  Run match analysis
                </>
              )}
            </Button>
          </div>
          {error && (
            <div className="mt-3 p-3 rounded bg-red-50 border border-red-200 text-sm text-red-800 flex items-start gap-2">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          {/* Score */}
          <Card hover={false}>
            <CardContent className="p-8 text-center">
              <p className="text-sm uppercase tracking-wider font-semibold text-gray-500 mb-2">
                Match Score
              </p>
              <div className={`text-7xl font-black mb-2 ${scoreColor}`}>
                {result.matchScore}%
              </div>
              <div className="w-full max-w-md mx-auto h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-1000"
                  style={{
                    width: `${result.matchScore}%`,
                    background: `linear-gradient(90deg, ${gradFrom}, ${gradTo})`,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card hover={false}>
              <CardContent className="p-6">
                <h3 className="text-sm uppercase tracking-wider font-bold text-emerald-700 mb-3">
                  ✓ Matched keywords ({result.matchedKeywords.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.matchedKeywords.map(k => (
                    <span
                      key={k}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium"
                    >
                      <CheckCircle2 size={12} />
                      {k}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card hover={false}>
              <CardContent className="p-6">
                <h3 className="text-sm uppercase tracking-wider font-bold text-red-700 mb-3">
                  ✗ Missing keywords ({result.missingKeywords.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map(k => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => addMissingSkill(k)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium transition group"
                      title="Click to add as skill"
                    >
                      <Plus size={12} className="group-hover:rotate-90 transition" />
                      {k}
                    </button>
                  ))}
                </div>
                {result.missingKeywords.length > 0 && (
                  <p className="text-xs text-gray-500 mt-3">
                    Click any keyword to add it to your skills.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Rewrite */}
          <Card hover={false}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3 gap-3">
                <h3 className="text-sm uppercase tracking-wider font-bold text-gray-900">
                  ✨ Tailored bio for this role
                </h3>
                <Button onClick={applyRewrite} size="sm">
                  <Sparkles size={14} className="mr-1" />
                  Apply to portfolio
                </Button>
              </div>
              <p className="text-gray-700 leading-relaxed bg-purple-50 p-4 rounded-lg border border-purple-100">
                {result.rewriteSummary}
              </p>
            </CardContent>
          </Card>

          {/* Suggestions */}
          <Card hover={false}>
            <CardContent className="p-6">
              <h3 className="text-sm uppercase tracking-wider font-bold text-gray-900 mb-3">
                Action items
              </h3>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </ToolShell>
  );
}
