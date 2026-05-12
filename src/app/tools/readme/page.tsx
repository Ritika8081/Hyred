"use client";

import { useState } from "react";
import { Github, Loader2, Download, AlertCircle, Code2, Eye } from "lucide-react";
import ToolShell from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CopyButton from "@/components/ui/copy-button";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { aiGenerateReadme, buildResumeText, loadAIConfig } from "@/lib/ai";

export default function ReadmePage() {
  const { data } = usePortfolioData();
  const [username, setUsername] = useState(() => {
    const gh = data.contact.github || "";
    const m = gh.match(/github\.com\/([^/]+)/);
    return m ? m[1] : "";
  });
  const [readme, setReadme] = useState("");
  const [view, setView] = useState<"markdown" | "preview">("markdown");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setError(null);
    if (!username.trim()) {
      setError("Enter your GitHub username so badges render correctly.");
      return;
    }
    const config = loadAIConfig();
    if (!config?.apiKey) {
      setError("Set up your AI key in Admin → AI Setup.");
      return;
    }
    setLoading(true);
    try {
      const resumeText = buildResumeText(data);
      const out = await aiGenerateReadme(resumeText, username, config);
      setReadme(out.trim().replace(/^```(?:markdown|md)?\n?/, "").replace(/\n?```$/, ""));
    } catch (e: any) {
      setError(e?.message || "Failed to generate. Try a different model.");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    const blob = new Blob([readme], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Minimal markdown → HTML preview (just enough to look right)
  const renderPreview = (md: string): string => {
    return md
      .split("\n")
      .map(line => {
        if (line.startsWith("### ")) return `<h3 class="text-lg font-bold mt-4 mb-2">${escapeHtml(line.slice(4))}</h3>`;
        if (line.startsWith("## ")) return `<h2 class="text-xl font-bold mt-5 mb-2">${escapeHtml(line.slice(3))}</h2>`;
        if (line.startsWith("# ")) return `<h1 class="text-2xl font-black mt-5 mb-3">${escapeHtml(line.slice(2))}</h1>`;
        if (line.startsWith("- ")) return `<li class="ml-5 list-disc">${inline(escapeHtml(line.slice(2)))}</li>`;
        if (line.match(/^!\[.*?\]\(.*?\)/)) return inline(line);
        if (line.trim() === "") return "<br/>";
        return `<p class="my-2 text-gray-700">${inline(escapeHtml(line))}</p>`;
      })
      .join("");
  };

  return (
    <ToolShell
      emoji="🐙"
      title="GitHub README Generator"
      tagline="Beautiful profile README from your portfolio data. Recruiters Google your GitHub before they call."
    >
      <Card className="mb-6" hover={false}>
        <CardContent className="p-6 space-y-3">
          <label className="block text-sm font-semibold text-gray-900">GitHub username</label>
          <div className="flex gap-2">
            <span className="inline-flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-sm font-mono">
              github.com/
            </span>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value.trim().replace(/^@/, ""))}
              className="flex-1 p-3 border border-gray-300 rounded-r-lg font-mono text-sm"
              placeholder="yourusername"
            />
          </div>

          <Button onClick={generate} disabled={loading} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Writing your README…
              </>
            ) : (
              <>
                <Github size={16} className="mr-2" />
                Generate my GitHub README
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

      {readme && (
        <Card hover={false}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="font-bold text-gray-900">Your README.md</h3>
              <div className="flex gap-2 flex-wrap">
                <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setView("markdown")}
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${
                      view === "markdown" ? "bg-white shadow text-gray-900" : "text-gray-600"
                    }`}
                  >
                    <Code2 size={12} />
                    Markdown
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("preview")}
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${
                      view === "preview" ? "bg-white shadow text-gray-900" : "text-gray-600"
                    }`}
                  >
                    <Eye size={12} />
                    Preview
                  </button>
                </div>
                <CopyButton value={readme} label="Copy MD" />
                <Button onClick={download} variant="outline" size="sm">
                  <Download size={14} className="mr-1.5" />
                  README.md
                </Button>
              </div>
            </div>

            {view === "markdown" ? (
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs overflow-x-auto max-h-[600px] overflow-y-auto whitespace-pre-wrap">
                {readme}
              </pre>
            ) : (
              <div
                className="prose prose-sm max-w-none bg-white border border-gray-200 rounded-lg p-6 max-h-[600px] overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: renderPreview(readme) }}
              />
            )}

            <div className="mt-4 p-3 rounded bg-blue-50 border border-blue-200 text-xs text-blue-900">
              <p className="font-semibold mb-1">📌 To use this:</p>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>Create a public repo on GitHub named the same as your username (e.g., <code className="bg-white px-1 rounded">{username}/{username}</code>).</li>
                <li>Drop this README.md in there.</li>
                <li>Your GitHub profile page will display it automatically.</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}
    </ToolShell>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(s: string): string {
  // images
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="inline-block mx-0.5 my-1" />');
  // links
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-blue-600 underline">$1</a>');
  // bold
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // inline code
  s = s.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-xs font-mono">$1</code>');
  return s;
}
