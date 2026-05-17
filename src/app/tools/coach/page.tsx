"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Loader2, AlertCircle, Trash2, Bot, User } from "lucide-react";
import ToolShell from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { aiCareerCoachReply, AIMessage, buildResumeText, loadAIConfig } from "@/lib/ai";

const PROMPTS = [
  "What roles should I be applying for given my background?",
  "Critique my resume's biggest weakness",
  "Help me prepare for a system design interview",
  "How do I negotiate salary for my first job?",
  "What skills should I learn next to level up?",
  "Write me a 30-day plan to land a job",
  "Should I do a master's or get more work experience?",
  "Why am I not getting interview callbacks?",
];

export default function CoachPage() {
  return (
    <ToolShell
      emoji="🧭"
      title="AI Career Coach"
      tagline="A senior tech mentor who's read your resume. Ask anything. Real advice, not generic AI."
    >
      <CoachChat />
    </ToolShell>
  );
}

function CoachChat() {
  const { data } = usePortfolioData();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    setError(null);
    if (!text.trim()) return;
    const config = loadAIConfig();
    if (!config?.apiKey) {
      setError("Set up your AI key in Admin → AI Setup.");
      return;
    }
    const userMsg: AIMessage = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const resumeText = buildResumeText(data);
      const reply = await aiCareerCoachReply(next, resumeText, config);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setError(e?.message || "Coach failed to reply.");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card hover={false} className="overflow-hidden">
      <CardContent className="p-0 flex flex-col h-[600px]">
        {/* Header */}
        <div className="px-4 py-3 border-b bg-gradient-to-r from-brand-50 to-coral-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-coral-600 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900">Hyred Coach</p>
              <p className="text-[10px] text-gray-500">Has read your resume · Replies in seconds</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm("Start a new conversation?")) setMessages([]);
              }}
              className="text-gray-400 hover:text-gray-700 text-xs inline-flex items-center gap-1"
            >
              <Trash2 size={12} />
              New chat
            </button>
          )}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-600 mb-4">
                Ask me anything about your job hunt. Try one of these:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto">
                {PROMPTS.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => send(p)}
                    className="text-left text-xs p-2.5 rounded-lg border border-gray-200 hover:border-brand-400 hover:bg-brand-50 transition text-gray-700"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    m.role === "user"
                      ? "bg-gray-200 text-gray-700"
                      : "bg-gradient-to-br from-brand-600 to-coral-600 text-white"
                  }`}
                >
                  {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-brand-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-600 to-coral-600 flex items-center justify-center text-white flex-shrink-0">
                <Bot size={14} />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-2 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-gray-500" />
                <span className="text-xs text-gray-500">Thinking…</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mx-3 mb-2 p-2 rounded bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-1">
            <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Input */}
        <div className="border-t p-3 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask anything…"
            disabled={loading}
            className="flex-1 p-2.5 border border-gray-300 rounded-lg text-sm"
          />
          <Button onClick={() => send(input)} disabled={loading || !input.trim()}>
            <Send size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
