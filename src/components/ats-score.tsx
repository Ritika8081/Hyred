"use client";

import { useMemo, useState } from "react";
import { Target, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Portfolio } from "@/types/portfolio";
import { analyzeATS, ATSReport } from "@/lib/ats";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ATSScoreProps {
  portfolio: Portfolio;
}

const LEVEL_COLORS: Record<ATSReport["level"], { ring: string; bg: string; text: string; label: string }> = {
  weak: { ring: "#ef4444", bg: "bg-red-50", text: "text-red-700", label: "Needs work" },
  ok: { ring: "#f59e0b", bg: "bg-amber-50", text: "text-amber-700", label: "Getting there" },
  good: { ring: "#3b82f6", bg: "bg-blue-50", text: "text-blue-700", label: "Solid" },
  excellent: { ring: "#10b981", bg: "bg-emerald-50", text: "text-emerald-700", label: "Recruiter-ready" },
};

export default function ATSScore({ portfolio }: ATSScoreProps) {
  const report = useMemo(() => analyzeATS(portfolio), [portfolio]);
  const [expanded, setExpanded] = useState(true);
  const colors = LEVEL_COLORS[report.level];
  const failing = report.checks.filter(c => !c.pass);
  const passing = report.checks.filter(c => c.pass);

  // Stroke-dash trick for radial progress
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - report.score / 100);

  return (
    <Card className="mb-8" hover={false}>
      <CardHeader>
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-xl font-bold flex items-center">
            <Target className="mr-2 text-blue-600" />
            Resume Health Score
          </h3>
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6 mb-6">
          <div className="relative flex-shrink-0 w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={colors.ring}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 0.6s ease-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{report.score}</span>
              <span className="text-xs text-gray-500">/ 100</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold mb-2 ${colors.bg} ${colors.text}`}>
              {colors.label}
            </div>
            <p className="text-sm text-gray-700">
              {passing.length} of {report.checks.length} checks pass. Fix the items below to climb the score.
            </p>
          </div>
        </div>

        {expanded && (
          <div className="space-y-2">
            {failing.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-700 mb-2">
                  To improve ({failing.length})
                </h4>
                <ul className="space-y-1.5">
                  {failing
                    .sort((a, b) => b.weight - a.weight)
                    .map(c => (
                    <li key={c.id} className="flex items-start gap-2 text-sm">
                      <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium">{c.label}</p>
                        {c.hint && <p className="text-xs text-gray-500">{c.hint}</p>}
                      </div>
                      <span className="text-xs text-gray-400">+{c.weight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {passing.length > 0 && (
              <details className="mt-3">
                <summary className="text-xs font-bold uppercase tracking-wider text-emerald-700 cursor-pointer hover:text-emerald-900">
                  Passing ({passing.length})
                </summary>
                <ul className="mt-2 space-y-1">
                  {passing.map(c => (
                    <li key={c.id} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5 text-emerald-500" />
                      <span>{c.label}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
