"use client";

import { useState } from "react";
import { DollarSign, Loader2, AlertCircle, TrendingUp, MessageCircle, AlertTriangle } from "lucide-react";
import ToolShell from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CopyButton from "@/components/ui/copy-button";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { aiNegotiateSalary, buildResumeText, loadAIConfig, SalaryAdvice } from "@/lib/ai";

function formatMoney(n: number, ccy: string): string {
  if (!ccy || ccy === "USD") return `$${n.toLocaleString()}`;
  if (ccy === "INR") return `₹${n.toLocaleString("en-IN")}`;
  if (ccy === "EUR") return `€${n.toLocaleString()}`;
  return `${ccy} ${n.toLocaleString()}`;
}

export default function SalaryPage() {
  const { data } = usePortfolioData();
  const [offer, setOffer] = useState("");
  const [role, setRole] = useState(data.personalInfo.title || "");
  const [location, setLocation] = useState(data.contact.location || "");
  const [advice, setAdvice] = useState<SalaryAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const negotiate = async () => {
    setError(null);
    if (!offer.trim() || !role.trim()) {
      setError("Add the offer details and role.");
      return;
    }
    const config = loadAIConfig();
    if (!config?.apiKey) {
      setError("Set up your AI key in Admin → AI Setup.");
      return;
    }
    setLoading(true);
    setAdvice(null);
    try {
      const resumeText = buildResumeText(data);
      const a = await aiNegotiateSalary(resumeText, offer, role, location, config);
      setAdvice(a);
    } catch (e: any) {
      setError(e?.message || "Negotiation analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell
      emoji="💰"
      title="Salary Negotiator"
      tagline="Paste your offer. AI gives you the script, the numbers, and the talking points to push for more."
    >
      <Card className="mb-6" hover={false}>
        <CardContent className="p-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Role</label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Location</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Bangalore, India or Remote (US)"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Paste the offer details
            </label>
            <textarea
              value={offer}
              onChange={e => setOffer(e.target.value)}
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm"
              placeholder="Base salary: ₹X LPA&#10;Joining bonus: ₹X&#10;Stock/ESOP: X over Y years&#10;Benefits: ..."
            />
          </div>

          <Button onClick={negotiate} disabled={loading} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Building your counter…
              </>
            ) : (
              <>
                <DollarSign size={16} className="mr-2" />
                Negotiate this offer
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

      {advice && (
        <div className="space-y-5">
          {/* Market range + your ask */}
          <Card hover={false}>
            <CardContent className="p-6">
              <h3 className="text-sm uppercase tracking-wider font-bold text-gray-900 mb-4 flex items-center gap-1.5">
                <TrendingUp size={14} />
                Market reality
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Pill label="Market low" value={formatMoney(advice.marketRange.low, advice.marketRange.currency)} />
                <Pill label="Market median" value={formatMoney(advice.marketRange.mid, advice.marketRange.currency)} />
                <Pill label="Market high" value={formatMoney(advice.marketRange.high, advice.marketRange.currency)} />
                <Pill
                  label="Counter with"
                  value={formatMoney(advice.yourAsk, advice.marketRange.currency)}
                  highlight
                />
              </div>
              <p className="text-sm text-gray-700 mt-4 leading-relaxed italic">{advice.rationale}</p>
            </CardContent>
          </Card>

          {/* Negotiation email */}
          <Card hover={false}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm uppercase tracking-wider font-bold text-gray-900">
                  📧 Your negotiation email
                </h3>
                <CopyButton value={`Subject: ${advice.email.subject}\n\n${advice.email.body}`} label="Copy all" />
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-50 border-b text-xs">
                  <strong className="text-gray-700">Subject:</strong> {advice.email.subject}
                </div>
                <div className="p-4 whitespace-pre-wrap text-gray-800 leading-relaxed text-sm font-serif">
                  {advice.email.body}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Talking points */}
          <Card hover={false}>
            <CardContent className="p-6">
              <h3 className="text-sm uppercase tracking-wider font-bold text-brand-700 mb-3 flex items-center gap-1.5">
                <MessageCircle size={14} />
                If they push back, say this
              </h3>
              <ul className="space-y-2">
                {advice.talkingPoints.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Red flags */}
          {advice.redFlags.length > 0 && (
            <Card hover={false} className="border-amber-200 bg-amber-50">
              <CardContent className="p-6">
                <h3 className="text-sm uppercase tracking-wider font-bold text-amber-700 mb-3 flex items-center gap-1.5">
                  <AlertTriangle size={14} />
                  Watch out for
                </h3>
                <ul className="space-y-1.5">
                  {advice.redFlags.map((r, i) => (
                    <li key={i} className="text-sm text-amber-900">
                      · {r}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </ToolShell>
  );
}

function Pill({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`p-3 rounded-lg text-center ${
        highlight
          ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
          : "bg-gray-50 border border-gray-200"
      }`}
    >
      <p className={`text-[10px] uppercase tracking-wider font-semibold ${highlight ? "opacity-90" : "text-gray-500"}`}>
        {label}
      </p>
      <p className={`text-xl font-bold ${highlight ? "text-white" : "text-gray-900"}`}>{value}</p>
    </div>
  );
}
