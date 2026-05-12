"use client";

import { useState } from "react";
import { Github, Loader2, AlertCircle, Plus, Star, GitFork, Check } from "lucide-react";
import { Project } from "@/types/portfolio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  pushed_at: string;
  fork: boolean;
}

interface GitHubImporterProps {
  existing: Project[];
  onImport: (newProjects: Project[]) => void;
}

function repoToProject(r: GitHubRepo): Project {
  const tech: string[] = [];
  if (r.language) tech.push(r.language);
  r.topics.slice(0, 6).forEach(t => {
    const norm = t.charAt(0).toUpperCase() + t.slice(1);
    if (!tech.includes(norm)) tech.push(norm);
  });
  return {
    id: `gh-${r.id}`,
    title: r.name,
    description: r.description || `Open-source ${r.language || ""} project.`,
    longDescription: r.description || "",
    technologies: tech,
    image: "",
    images: [],
    githubUrl: r.html_url,
    liveUrl: r.homepage || undefined,
    category: r.language === "Python" || r.topics.some(t => t.includes("ml") || t.includes("ai")) ? "ai" : "web",
    featured: r.stargazers_count >= 5,
    createdDate: r.created_at.split("T")[0],
    completedDate: r.pushed_at.split("T")[0],
    status: "completed",
    challenges: [],
    learnings: [],
    impact: r.stargazers_count > 0 ? `${r.stargazers_count} GitHub stars` : undefined,
  };
}

export default function GitHubImporter({ existing, onImport }: GitHubImporterProps) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const existingGithubUrls = new Set(existing.map(p => p.githubUrl).filter(Boolean));

  const fetchRepos = async () => {
    setError(null);
    const u = username.trim().replace(/^@/, "").replace(/^https?:\/\/github\.com\//, "").split("/")[0];
    if (!u) {
      setError("Enter a GitHub username.");
      return;
    }
    setLoading(true);
    setRepos([]);
    setSelected(new Set());
    try {
      const res = await fetch(`https://api.github.com/users/${u}/repos?sort=updated&per_page=100`);
      if (!res.ok) {
        if (res.status === 404) throw new Error(`GitHub user "${u}" not found.`);
        if (res.status === 403) throw new Error("GitHub rate limit hit. Try again in a minute.");
        throw new Error(`GitHub API error (${res.status}).`);
      }
      const data: GitHubRepo[] = await res.json();
      // filter forks and sort by stars
      const filtered = data
        .filter(r => !r.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count);
      setRepos(filtered);
      // Preselect repos with stars or descriptions, skip ones we already have
      const auto = new Set(
        filtered
          .filter(r => !existingGithubUrls.has(r.html_url))
          .filter(r => r.stargazers_count > 0 || !!r.description)
          .slice(0, 5)
          .map(r => r.id)
      );
      setSelected(auto);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch repos.");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const doImport = () => {
    const picked = repos.filter(r => selected.has(r.id));
    if (picked.length === 0) return;
    const projects = picked.map(repoToProject);
    onImport([...existing, ...projects]);
    setRepos([]);
    setSelected(new Set());
    setUsername("");
  };

  return (
    <Card className="mb-8" hover={false}>
      <CardHeader>
        <h3 className="text-xl font-bold flex items-center">
          <Github className="mr-2" />
          Import from GitHub
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Paste your GitHub username and pull projects in seconds. ✨ No API key needed.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") fetchRepos(); }}
            className="flex-1 p-3 border border-gray-300 rounded-lg"
            placeholder="e.g. torvalds or https://github.com/torvalds"
          />
          <Button onClick={fetchRepos} disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Fetch"}
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-sm text-red-800 flex items-start gap-2">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {repos.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-700">
                Found <strong>{repos.length}</strong> repos · <strong>{selected.size}</strong> selected
              </p>
              <Button onClick={doImport} disabled={selected.size === 0}>
                <Plus size={14} className="mr-1" />
                Import {selected.size}
              </Button>
            </div>
            <div className="max-h-96 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-2">
              {repos.map(r => {
                const isSelected = selected.has(r.id);
                const alreadyHave = existingGithubUrls.has(r.html_url);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => !alreadyHave && toggle(r.id)}
                    disabled={alreadyHave}
                    className={`w-full text-left p-3 rounded-lg border-2 transition ${
                      alreadyHave
                        ? "bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed"
                        : isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                        isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"
                      }`}>
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-gray-900">{r.name}</span>
                          {alreadyHave && (
                            <span className="text-xs text-gray-500">(already imported)</span>
                          )}
                          {r.language && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                              {r.language}
                            </span>
                          )}
                        </div>
                        {r.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">{r.description}</p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span className="inline-flex items-center gap-0.5"><Star size={11} />{r.stargazers_count}</span>
                          <span className="inline-flex items-center gap-0.5"><GitFork size={11} />{r.forks_count}</span>
                          {r.topics.slice(0, 3).map(t => (
                            <span key={t} className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
