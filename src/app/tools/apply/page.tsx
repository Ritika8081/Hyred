"use client";

import { useState } from "react";
import { Briefcase, Loader2, AlertCircle, Mail, MessageCircle, Heart, FileText } from "lucide-react";
import ToolShell from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CopyButton from "@/components/ui/copy-button";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { aiGenerateApplicationPack, ApplicationPack, buildResumeText, loadAIConfig } from "@/lib/ai";

type TabId = "cover" | "email" | "dm" | "thanks";

const TABS: { id: TabId; label: string; emoji: string; icon: typeof Mail }[] = [
  { id: "cover", label: "Cover Letter", emoji: "📝", icon: FileText },
  { id: "email", label: "Cold Email", emoji: "📧", icon: Mail },
  { id: "dm", label: "LinkedIn DM", emoji: "💬", icon: MessageCircle },
  { id: "thanks", label: "Thank-You", emoji: "🙏", icon: Heart },
];

export default function ApplyPage() {
  const { data } = usePortfolioData();
  const [jd, setJd] = useState("");
  const [company, setCompany] = useState("");
  const [pack, setPack] = useState<ApplicationPack | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("cover");
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
    setPack(null);
    try {
      const resumeText = buildResumeText(data);
      const out = await aiGenerateApplicationPack(resumeText, jd, company, config);
      setPack(out);
    } catch (e: any) {
      setError(e?.message || "Failed to generate. Try a different model.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell
      emoji="🎯"
      title="Application Materials Pack"
      tagline="One JD → cover letter + recruiter email + LinkedIn DM + thank-you note. The full application kit in 15 seconds."
    >
      <Card className="mb-6" hover={false}>
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Company name <span className="text-gray-400 font-normal">(optional, makes emails more specific)</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="e.g. Stripe"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Job description *
            </label>
            <textarea
              value={jd}
              onChange={e => setJd(e.target.value)}
              rows={8}
              className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm"
              placeholder="Paste the JD here. The more text, the better all 4 materials will be tailored."
            />
            <p className="text-xs text-gray-500 mt-1">{jd.length} chars</p>
          </div>

          <Button onClick={generate} disabled={loading} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Generating 4 materials…
              </>
            ) : (
              <>
                <Briefcase size={16} className="mr-2" />
                Generate full application pack
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

      {pack && (
        <Card hover={false}>
          <CardContent className="p-0">
            {/* Tabs */}
            <div className="border-b border-gray-200 overflow-x-auto">
              <nav className="flex">
                {TABS.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                      activeTab === t.id
                        ? "border-brand-600 text-brand-700 bg-brand-50"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <span className="mr-1.5">{t.emoji}</span>
                    {t.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Cover letter */}
            {activeTab === "cover" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">Cover Letter</h3>
                  <CopyButton value={pack.coverLetter} label="Copy" />
                </div>
                <div className="whitespace-pre-wrap bg-gray-50 border border-gray-200 rounded-lg p-6 text-gray-800 leading-relaxed font-serif">
                  {pack.coverLetter}
                </div>
              </div>
            )}

            {/* Cold email */}
            {activeTab === "email" && (
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Cold Email to Recruiter</h3>
                  <CopyButton
                    value={`Subject: ${pack.recruiterEmail.subject}\n\n${pack.recruiterEmail.body}`}
                    label="Copy all"
                  />
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      <strong className="text-gray-700">Subject:</strong> {pack.recruiterEmail.subject}
                    </p>
                    <CopyButton value={pack.recruiterEmail.subject} label="Copy subject" />
                  </div>
                  <div className="p-4 whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {pack.recruiterEmail.body}
                  </div>
                </div>
              </div>
            )}

            {/* LinkedIn DM */}
            {activeTab === "dm" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">LinkedIn DM</h3>
                  <CopyButton value={pack.linkedinDM} label="Copy" />
                </div>
                <div className="bg-[#f3f6f8] border border-[#0a66c2]/20 rounded-2xl p-4 max-w-md">
                  <p className="whitespace-pre-wrap text-gray-800 leading-relaxed text-sm">
                    {pack.linkedinDM}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 LinkedIn caps DMs at 300 chars for non-connections. This is {pack.linkedinDM.length} chars.
                </p>
              </div>
            )}

            {/* Thank-you */}
            {activeTab === "thanks" && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">Post-Interview Thank-You</h3>
                  <CopyButton value={pack.thankYouNote} label="Copy" />
                </div>
                <div className="whitespace-pre-wrap bg-gray-50 border border-gray-200 rounded-lg p-6 text-gray-800 leading-relaxed font-serif">
                  {pack.thankYouNote}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Replace <code className="bg-yellow-100 px-1 rounded">[specific point]</code> with something concrete from your interview. Send within 24 hours.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </ToolShell>
  );
}
