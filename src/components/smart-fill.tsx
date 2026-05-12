"use client";

import { useMemo, useState } from "react";
import { Wand2, Loader2, Check } from "lucide-react";
import { Portfolio } from "@/types/portfolio";
import { aiGenerateHighlights, aiGenerateProjectDescription, aiRewrite, buildResumeText, loadAIConfig } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

interface SmartFillProps {
  portfolio: Portfolio;
  onChange: (next: Portfolio) => void;
}

interface Gap {
  id: string;
  label: string;
  desc: string;
}

function detectGaps(p: Portfolio): Gap[] {
  const gaps: Gap[] = [];
  if (!p.personalInfo.highlights || p.personalInfo.highlights.length < 3) {
    gaps.push({ id: "highlights", label: "Hero highlights", desc: "3 impact bullets recruiters scan first" });
  }
  if (!p.personalInfo.tagline) {
    gaps.push({ id: "tagline", label: "Tagline", desc: "A catchy one-liner under your name" });
  }
  if (!p.personalInfo.currentlyBuilding) {
    gaps.push({ id: "currentlyBuilding", label: "Now widget", desc: "What you're working on this week" });
  }
  const emptyProjectDesc = p.projects.filter(pr => !pr.description || pr.description.length < 20);
  if (emptyProjectDesc.length > 0) {
    gaps.push({ id: "project-descriptions", label: `Project descriptions (${emptyProjectDesc.length})`, desc: "Short descriptions for projects missing one" });
  }
  const noImpact = p.projects.filter(pr => pr.featured && !pr.impact);
  if (noImpact.length > 0) {
    gaps.push({ id: "project-impact", label: `Featured project impact (${noImpact.length})`, desc: "Impact metrics on your featured projects" });
  }
  return gaps;
}

export default function SmartFill({ portfolio, onChange }: SmartFillProps) {
  const gaps = useMemo(() => detectGaps(portfolio), [portfolio]);
  const [filling, setFilling] = useState<string | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());
  const toast = useToast();

  if (gaps.length === 0) {
    return (
      <Card className="mb-6 border-emerald-200 bg-emerald-50" hover={false}>
        <CardContent className="p-4 flex items-center gap-3">
          <Check className="text-emerald-600" size={20} />
          <div>
            <p className="font-semibold text-emerald-900">Your portfolio looks complete!</p>
            <p className="text-xs text-emerald-700">Every field worth filling is filled. ✨</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const fill = async (gap: Gap) => {
    const config = loadAIConfig();
    if (!config?.apiKey) {
      toast.error("AI key needed", "Set one up in the AI Setup tab.");
      return;
    }
    setFilling(gap.id);
    try {
      const next: Portfolio = { ...portfolio };

      if (gap.id === "highlights") {
        const list = await aiGenerateHighlights(
          portfolio.personalInfo.bio,
          portfolio.experience.map(e => ({ position: e.position, company: e.company, achievements: e.achievements })),
          portfolio.projects.map(p => ({ title: p.title, description: p.description, impact: p.impact })),
          config
        );
        next.personalInfo = { ...next.personalInfo, highlights: list };
      } else if (gap.id === "tagline") {
        const out = await aiRewrite(
          portfolio.personalInfo.bio || portfolio.personalInfo.title,
          "concise",
          "Generate a single 8-12 word tagline that captures the candidate's positioning.",
          config
        );
        next.personalInfo = { ...next.personalInfo, tagline: out.replace(/^["']|["']$/g, "").trim() };
      } else if (gap.id === "currentlyBuilding") {
        const out = await aiRewrite(
          portfolio.experience[0]?.description || portfolio.personalInfo.bio,
          "concise",
          "Generate a one-sentence 'currently building' status — what they're working on this week, max 20 words.",
          config
        );
        next.personalInfo = { ...next.personalInfo, currentlyBuilding: out.replace(/^["']|["']$/g, "").trim() };
      } else if (gap.id === "project-descriptions") {
        const updated = await Promise.all(
          portfolio.projects.map(async pr => {
            if (pr.description && pr.description.length >= 20) return pr;
            const desc = await aiGenerateProjectDescription(pr.title, pr.technologies, config);
            return { ...pr, description: desc.trim() };
          })
        );
        next.projects = updated;
      } else if (gap.id === "project-impact") {
        const resumeText = buildResumeText(portfolio);
        const updated = await Promise.all(
          portfolio.projects.map(async pr => {
            if (!pr.featured || pr.impact) return pr;
            const out = await aiRewrite(
              `Project: ${pr.title}. Description: ${pr.description}. Tech: ${pr.technologies.join(", ")}.`,
              "impact",
              `Generate a one-sentence measurable IMPACT statement for this project. Use plausible metrics if not explicit. Candidate context: ${resumeText.slice(0, 500)}`,
              config
            );
            return { ...pr, impact: out.replace(/^["']|["']$/g, "").trim() };
          })
        );
        next.projects = updated;
      }

      onChange(next);
      setDone(prev => new Set(prev).add(gap.id));
      toast.ai("Filled with AI", gap.label);
    } catch (e: any) {
      toast.error("AI fill failed", e?.message || "Try a different model.");
    } finally {
      setFilling(null);
    }
  };

  const fillAll = async () => {
    for (const gap of gaps) {
      if (done.has(gap.id)) continue;
      await fill(gap);
    }
  };

  return (
    <Card className="mb-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50" hover={false}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Wand2 className="text-purple-600" size={18} />
              Smart Fill — let AI complete your portfolio
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              {gaps.length} gap{gaps.length === 1 ? "" : "s"} found. One click fills them all using what you&apos;ve already entered.
            </p>
          </div>
          <Button onClick={fillAll} disabled={filling !== null}>
            {filling ? <Loader2 size={14} className="animate-spin mr-1" /> : <Wand2 size={14} className="mr-1" />}
            Fill all
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-2">
          {gaps.map(g => {
            const isDone = done.has(g.id);
            const isFilling = filling === g.id;
            return (
              <li
                key={g.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition ${
                  isDone ? "bg-emerald-50 border-emerald-200" : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  {isDone ? (
                    <Check size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900">{g.label}</p>
                    <p className="text-xs text-gray-500">{g.desc}</p>
                  </div>
                </div>
                {!isDone && (
                  <Button
                    onClick={() => fill(g)}
                    disabled={filling !== null}
                    size="sm"
                    variant="outline"
                  >
                    {isFilling ? <Loader2 size={12} className="animate-spin" /> : "Fill"}
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
