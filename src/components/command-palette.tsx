"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Home,
  User,
  Briefcase,
  FileText,
  Sparkles,
  Star,
  Tag,
  Settings,
  Rocket,
  Crown,
  Mail,
  GitCompare,
  Eye,
  Flame,
  Target,
  Mic,
  Github,
  Linkedin,
  Wand2,
  ListTodo,
  Bot,
  TrendingUp,
  DollarSign,
  Lightbulb,
} from "lucide-react";

type Cmd = {
  id: string;
  label: string;
  hint?: string;
  group: "Navigation" | "AI Tools" | "Actions";
  icon: typeof Home;
  shortcut?: string;
  href?: string;
  action?: () => void;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const commands = useMemo<Cmd[]>(() => [
    // Navigation
    { id: "home", label: "Home", group: "Navigation", icon: Home, href: "/" },
    { id: "about", label: "About", group: "Navigation", icon: User, href: "/about" },
    { id: "projects", label: "Projects", group: "Navigation", icon: Briefcase, href: "/projects" },
    { id: "resume", label: "Resume", hint: "printable PDF", group: "Navigation", icon: FileText, href: "/resume" },
    { id: "contact", label: "Contact", group: "Navigation", icon: Mail, href: "/contact" },
    { id: "tools", label: "AI Tools Hub", group: "Navigation", icon: Sparkles, href: "/tools" },
    { id: "pricing", label: "Pricing", group: "Navigation", icon: Tag, href: "/pricing" },
    { id: "compare", label: "Compare vs competitors", group: "Navigation", icon: GitCompare, href: "/compare" },
    { id: "reviews", label: "Reviews", group: "Navigation", icon: Star, href: "/reviews" },
    { id: "deploy", label: "Deploy guide", group: "Navigation", icon: Rocket, href: "/deploy" },
    { id: "admin", label: "Admin", hint: "edit your portfolio", group: "Navigation", icon: Settings, href: "/admin" },
    { id: "unlock", label: "Activate Pro license", group: "Navigation", icon: Crown, href: "/unlock" },

    // AI Tools
    { id: "roast", label: "Roast My Resume", hint: "brutal AI critique", group: "AI Tools", icon: Flame, href: "/tools/roast" },
    { id: "match", label: "JD Matcher", hint: "paste JD → match %", group: "AI Tools", icon: Target, href: "/tools/match" },
    { id: "apply", label: "Application Pack", hint: "cover letter + email + DM + thank-you", group: "AI Tools", icon: Briefcase, href: "/tools/apply" },
    { id: "cover", label: "Cover Letter Generator", group: "AI Tools", icon: FileText, href: "/tools/cover-letter" },
    { id: "interview", label: "Mock Interview", hint: "AI grades your answers", group: "AI Tools", icon: Mic, href: "/tools/interview" },
    { id: "readme", label: "GitHub README Generator", group: "AI Tools", icon: Github, href: "/tools/readme" },
    { id: "linkedin", label: "LinkedIn Optimizer", group: "AI Tools", icon: Linkedin, href: "/tools/linkedin" },
    { id: "tracker", label: "Application Tracker", hint: "Pro", group: "AI Tools", icon: ListTodo, href: "/tools/tracker" },
    { id: "coach", label: "AI Career Coach", hint: "Pro · chat", group: "AI Tools", icon: Bot, href: "/tools/coach" },
    { id: "skills", label: "Skill Gap Analyzer", hint: "what to learn for a target role", group: "AI Tools", icon: TrendingUp, href: "/tools/skills" },
    { id: "salary", label: "Salary Negotiator", hint: "offer → negotiation script", group: "AI Tools", icon: DollarSign, href: "/tools/salary" },
    { id: "projects-ai", label: "Project Idea Generator", hint: "what should I build?", group: "AI Tools", icon: Lightbulb, href: "/tools/projects" },

    // Actions
    {
      id: "preview",
      label: "Live preview my portfolio",
      group: "Actions",
      icon: Eye,
      href: "/admin",
    },
    {
      id: "rewrite-ai",
      label: "Set up AI key",
      hint: "Groq / OpenRouter free tier",
      group: "Actions",
      icon: Wand2,
      href: "/admin",
    },
  ], []);

  // Toggle on Cmd/Ctrl+K + Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(prev => !prev);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus + reset search when opened
  useEffect(() => {
    if (open) {
      setQ("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Filtered commands
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return commands;
    return commands.filter(c => {
      const haystack = `${c.label} ${c.hint || ""} ${c.group}`.toLowerCase();
      // simple subsequence match
      let qi = 0;
      for (let i = 0; i < haystack.length && qi < query.length; i++) {
        if (haystack[i] === query[qi]) qi++;
      }
      return qi === query.length;
    });
  }, [q, commands]);

  // Group filtered for display
  const grouped = useMemo(() => {
    const out: Record<string, Cmd[]> = {};
    filtered.forEach(c => {
      if (!out[c.group]) out[c.group] = [];
      out[c.group].push(c);
    });
    return out;
  }, [filtered]);

  // Active item navigation
  useEffect(() => {
    setActiveIdx(0);
  }, [q]);

  const run = (c: Cmd) => {
    setOpen(false);
    if (c.action) {
      c.action();
    } else if (c.href) {
      router.push(c.href);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filtered[activeIdx];
      if (target) run(target);
    }
  };

  if (!open) {
    return (
      <>
        {/* Hint button — fixed corner */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-44 z-30 hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 shadow hover:shadow-md transition text-xs text-gray-600 font-medium"
          aria-label="Open command palette"
        >
          <Search size={12} />
          <span>Quick nav</span>
          <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-mono">⌘K</kbd>
        </button>
      </>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center pt-[15vh] p-4 bg-black/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search for a page or tool…"
            className="flex-1 bg-transparent outline-none text-sm"
            autoComplete="off"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] font-mono text-gray-500">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-8">No matches. Try a different query.</p>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="mb-2">
                <p className="px-2 py-1 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  {group}
                </p>
                {items.map(c => {
                  const Icon = c.icon;
                  const idx = filtered.indexOf(c);
                  const isActive = idx === activeIdx;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => run(c)}
                      onMouseEnter={() => setActiveIdx(idx)}
                      className={`w-full flex items-center gap-3 p-2 rounded-md text-left text-sm transition ${
                        isActive ? "bg-purple-50 text-purple-900" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={`flex-shrink-0 ${isActive ? "text-purple-600" : "text-gray-400"}`}
                      />
                      <span className="flex-1 truncate">{c.label}</span>
                      {c.hint && (
                        <span className="text-xs text-gray-400 truncate">{c.hint}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t bg-gray-50 flex items-center gap-3 text-[10px] text-gray-500">
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white border font-mono">↑↓</kbd>
            navigate
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white border font-mono">↵</kbd>
            select
          </span>
          <span className="ml-auto">⌘K to toggle</span>
        </div>
      </div>
    </div>
  );
}
