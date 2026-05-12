"use client";

import { useState } from "react";
import { Lightbulb, Loader2, AlertCircle, Clock, Tag } from "lucide-react";
import ToolShell from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CopyButton from "@/components/ui/copy-button";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { aiSuggestProjects, buildResumeText, loadAIConfig, ProjectSuggestion } from "@/lib/ai";

const DIFF_COLOR: Record<ProjectSuggestion["difficulty"], { bg: string; text: string }> = {
  beginner: { bg: "bg-emerald-100", text: "text-emerald-800" },
  intermediate: { bg: "bg-blue-100", text: "text-blue-800" },
  advanced: { bg: "bg-purple-100", text: "text-purple-800" },
};

export default function ProjectsAIPage() {
  const { data } = usePortfolioData();
  const [role, setRole] = useState(data.personalInfo.title || "");
  const [projects, setProjects] = useState<ProjectSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggest = async () => {
    setError(null);
    if (!role.trim()) {
      setError("Tell us your target role.");
      return;
    }
    const config = loadAIConfig();
    if (!config?.apiKey) {
      setError("Set up your AI key in Admin → AI Setup.");
      return;
    }
    setLoading(true);
    setProjects([]);
    try {
      const resumeText = buildResumeText(data);
      const list = await aiSuggestProjects(resumeText, role, config);
      setProjects(list);
    } catch (e: any) {
      setError(e?.message || "Failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell
      emoji="💡"
      title="Project Idea Generator"
      tagline="Tell AI your target role. It returns portfolio projects matched to your gaps. Stop building TODO apps."
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
            placeholder="e.g. ML Engineer at a healthcare startup, or Full-stack at a Series B SaaS"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <Button onClick={suggest} disabled={loading} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Brainstorming…
              </>
            ) : (
              <>
                <Lightbulb size={16} className="mr-2" />
                Give me 4 project ideas
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

      {projects.length > 0 && (
        <div className="space-y-4">
          {projects.map((p, i) => {
            const diff = DIFF_COLOR[p.difficulty];
            return (
              <Card key={i} hover={false}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {i + 1}. {p.title}
                      </h3>
                      <p className="text-gray-700">{p.oneLiner}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${diff.bg} ${diff.text}`}
                      >
                        {p.difficulty}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        ~{p.estDays}d
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 italic mb-3">
                    💡 Why for you: {p.whyBuild}
                  </p>

                  <div className="mb-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Stack
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {p.techStack.map(t => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                        >
                          <Tag size={9} />
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Build these features
                    </p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {p.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="text-purple-500 mt-0.5">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        Future resume bullet
                      </p>
                      <p className="text-sm text-gray-800 italic mt-0.5">&ldquo;{p.resumeBullet}&rdquo;</p>
                    </div>
                    <CopyButton value={p.resumeBullet} label="Copy" />
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Card hover={false} className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 text-sm text-purple-900">
              💡 <strong>Next step:</strong> Pick the one that looks most fun, build the minimum-viable version in a week, and add it to your portfolio via <a href="/admin" className="underline">Admin → Projects</a>. Even a half-done version is better than another TODO app.
            </CardContent>
          </Card>
        </div>
      )}
    </ToolShell>
  );
}
