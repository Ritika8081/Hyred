"use client";

import { useState } from "react";
import { Wand2, Loader2, AlertCircle, FileUp, ChevronDown, ChevronUp } from "lucide-react";
import { Portfolio } from "@/types/portfolio";
import { aiParseResume, loadAIConfig } from "@/lib/ai";
import { extractPdfText } from "@/lib/pdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

interface ResumeImporterProps {
  onParsed: (next: Portfolio) => void;
  current: Portfolio;
  /** When true, upload/paste area is visible immediately (Profile tab). */
  defaultOpen?: boolean;
}

export default function ResumeImporter({ onParsed, current, defaultOpen = false }: ResumeImporterProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const [parsingPdf, setParsingPdf] = useState(false);

  const onFile = async (file: File) => {
    if (!file) return;
    setError(null);
    try {
      if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        setParsingPdf(true);
        const extracted = await extractPdfText(file);
        if (extracted.trim().length < 50) {
          throw new Error("PDF appears to have no extractable text (might be a scanned image). Try copy-paste instead.");
        }
        setText(extracted);
        toast.success("PDF parsed!", `${extracted.length} characters extracted. Click 'Build my portfolio' next.`);
      } else {
        const t = await file.text();
        setText(t);
      }
    } catch (e: any) {
      setError(e?.message || "Couldn't read file.");
    } finally {
      setParsingPdf(false);
    }
  };

  const parse = async () => {
    setError(null);
    if (text.trim().length < 100) {
      setError("Paste more text — at least a paragraph of your resume.");
      return;
    }
    const config = loadAIConfig();
    if (!config?.apiKey) {
      setError("Set up your AI key first (AI Setup tab).");
      return;
    }
    setLoading(true);
    try {
      const parsed = await aiParseResume(text, config);

      // Merge parsed data into existing portfolio, generating IDs where needed
      const next: Portfolio = {
        ...current,
        personalInfo: {
          ...current.personalInfo,
          name: parsed.personalInfo.name || current.personalInfo.name,
          title: parsed.personalInfo.title || current.personalInfo.title,
          bio: parsed.personalInfo.bio || current.personalInfo.bio,
          tagline: parsed.personalInfo.tagline || current.personalInfo.tagline,
          yearsOfExperience: parsed.personalInfo.yearsOfExperience || current.personalInfo.yearsOfExperience,
          highlights: parsed.personalInfo.highlights?.length
            ? parsed.personalInfo.highlights.slice(0, 3)
            : current.personalInfo.highlights,
        },
        contact: {
          ...current.contact,
          email: parsed.contact.email || current.contact.email,
          location: parsed.contact.location || current.contact.location,
          linkedin: parsed.contact.linkedin || current.contact.linkedin,
          github: parsed.contact.github || current.contact.github,
          website: parsed.contact.website || current.contact.website,
        },
        experience: parsed.experience.length
          ? parsed.experience.map((e, i) => ({
              id: `exp-${Date.now()}-${i}`,
              company: e.company,
              position: e.position,
              startDate: e.startDate,
              endDate: e.endDate || undefined,
              description: e.description,
              achievements: e.achievements || [],
              technologies: e.technologies || [],
              type: e.type || "full-time",
            }))
          : current.experience,
        education: parsed.education.length
          ? parsed.education.map((e, i) => ({
              id: `edu-${Date.now()}-${i}`,
              institution: e.institution,
              degree: e.degree,
              field: e.field,
              startDate: e.startDate,
              endDate: e.endDate || undefined,
              gpa: e.gpa || undefined,
              achievements: e.achievements || [],
              coursework: e.coursework || [],
            }))
          : current.education,
        skills: parsed.skills.length
          ? parsed.skills.map((s, i) => ({
              id: `skill-${Date.now()}-${i}`,
              name: s.name,
              category: (["frontend", "backend", "database", "tools", "languages", "frameworks", "ai"].includes(s.category)
                ? s.category
                : "tools") as any,
              proficiency: (Math.min(5, Math.max(1, s.proficiency)) || 3) as 1 | 2 | 3 | 4 | 5,
              yearsOfExperience: s.yearsOfExperience || 1,
            }))
          : current.skills,
        projects: parsed.projects.length
          ? parsed.projects.map((p, i) => ({
              id: `proj-${Date.now()}-${i}`,
              title: p.title,
              description: p.description,
              longDescription: p.description,
              technologies: p.technologies || [],
              image: "",
              images: [],
              githubUrl: p.githubUrl || undefined,
              liveUrl: p.liveUrl || undefined,
              category: "web",
              featured: i < 3,
              createdDate: new Date().toISOString().split("T")[0],
              status: "completed",
              challenges: [],
              learnings: [],
            }))
          : current.projects,
      };

      onParsed(next);
      toast.success("Resume imported!", `Filled ${parsed.experience.length} roles, ${parsed.projects.length} projects, ${parsed.skills.length} skills. Don't forget to save.`);
      setOpen(false);
      setText("");
    } catch (e: any) {
      setError(e?.message || "Failed to parse. Try a different model in AI Setup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6 border-2 border-brand-200" hover={false}>
      <CardHeader>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-600 to-coral-600 flex items-center justify-center flex-shrink-0">
              <Wand2 size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                ✨ Paste your resume — we&apos;ll build your portfolio
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                30 seconds. AI parses everything: experience, skills, projects, contact info.
              </p>
            </div>
          </div>
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </CardHeader>
      {open && (
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <label>
              <input
                type="file"
                accept=".pdf,.txt,.md,application/pdf"
                className="hidden"
                onChange={e => e.target.files?.[0] && onFile(e.target.files[0])}
              />
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-brand-300 bg-brand-50 hover:bg-brand-100 text-sm text-brand-800 cursor-pointer font-semibold">
                {parsingPdf ? <Loader2 size={14} className="animate-spin" /> : <FileUp size={14} />}
                {parsingPdf ? "Parsing PDF…" : "Upload PDF or text file"}
              </span>
            </label>
            <span className="text-xs text-gray-500">…or paste below · {text.length} chars</span>
          </div>

          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={10}
            className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm"
            placeholder="Paste your resume text here. PDF? Open it, Ctrl+A, Ctrl+C, paste here. LinkedIn? Print to PDF first then do the same."
          />

          {error && (
            <div className="p-3 rounded bg-red-50 border border-red-200 text-sm text-red-800 flex items-start gap-2">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <Button onClick={parse} disabled={loading || text.length < 100} className="w-full" size="lg">
            {loading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Parsing your resume…
              </>
            ) : (
              <>
                <Wand2 size={16} className="mr-2" />
                Build my portfolio from this
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            💡 This overwrites your current Profile, Experience, Education, Skills, and Projects. Personal data stays in your browser only.
          </p>
        </CardContent>
      )}
    </Card>
  );
}
