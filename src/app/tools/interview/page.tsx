"use client";

import { useState } from "react";
import { Mic, Loader2, AlertCircle, Sparkles, ChevronRight, RotateCw } from "lucide-react";
import ToolShell from "@/components/tool-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import {
  aiCritiqueAnswer,
  aiGenerateInterviewQuestions,
  AnswerFeedback,
  buildResumeText,
  InterviewQuestion,
  loadAIConfig,
} from "@/lib/ai";

const CATEGORY_STYLES: Record<InterviewQuestion["category"], { bg: string; text: string; label: string }> = {
  behavioral: { bg: "bg-purple-100", text: "text-purple-800", label: "Behavioral" },
  technical: { bg: "bg-blue-100", text: "text-blue-800", label: "Technical" },
  "system-design": { bg: "bg-amber-100", text: "text-amber-800", label: "System Design" },
  "role-fit": { bg: "bg-emerald-100", text: "text-emerald-800", label: "Role Fit" },
};

export default function InterviewPage() {
  const { data } = usePortfolioData();
  const [role, setRole] = useState(data.personalInfo.title || "");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<Record<number, AnswerFeedback>>({});
  const [generating, setGenerating] = useState(false);
  const [critiquing, setCritiquing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gen = async () => {
    setError(null);
    if (!role.trim()) {
      setError("Enter the role you're interviewing for.");
      return;
    }
    const config = loadAIConfig();
    if (!config?.apiKey) {
      setError("Set up AI in Admin → AI Setup.");
      return;
    }
    setGenerating(true);
    setQuestions([]);
    setAnswers({});
    setFeedback({});
    try {
      const resumeText = buildResumeText(data);
      const qs = await aiGenerateInterviewQuestions(resumeText, role, config);
      setQuestions(qs);
      setActiveIdx(0);
    } catch (e: any) {
      setError(e?.message || "Failed to generate questions.");
    } finally {
      setGenerating(false);
    }
  };

  const critique = async () => {
    if (!questions[activeIdx]) return;
    const answer = answers[activeIdx] || "";
    if (answer.trim().length < 20) {
      setError("Write a fuller answer first (at least a sentence or two).");
      return;
    }
    setError(null);
    const config = loadAIConfig();
    if (!config?.apiKey) return;
    setCritiquing(true);
    try {
      const resumeText = buildResumeText(data);
      const fb = await aiCritiqueAnswer(questions[activeIdx].question, answer, resumeText, config);
      setFeedback(prev => ({ ...prev, [activeIdx]: fb }));
    } catch (e: any) {
      setError(e?.message || "Critique failed.");
    } finally {
      setCritiquing(false);
    }
  };

  const current = questions[activeIdx];
  const currentFeedback = feedback[activeIdx];

  return (
    <ToolShell
      emoji="🎤"
      title="AI Mock Interview"
      tagline="Realistic questions tailored to your resume. Practice. Get feedback. Land the role."
    >
      {questions.length === 0 ? (
        <Card hover={false}>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Target role
              </label>
              <input
                type="text"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="e.g. Frontend Engineer at a fintech startup"
              />
              <p className="text-xs text-gray-500 mt-1">
                The more specific the role, the better the questions.
              </p>
            </div>

            <Button onClick={gen} disabled={generating} size="lg" className="w-full">
              {generating ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Generating questions…
                </>
              ) : (
                <>
                  <Mic size={18} className="mr-2" />
                  Start mock interview
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question list */}
          <aside className="lg:col-span-1">
            <Card hover={false}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Questions
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuestions([])}
                    className="text-gray-400 hover:text-gray-700"
                    aria-label="Reset"
                  >
                    <RotateCw size={14} />
                  </button>
                </div>
                <ul className="space-y-1">
                  {questions.map((q, i) => {
                    const isActive = i === activeIdx;
                    const isAnswered = !!feedback[i];
                    return (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => setActiveIdx(i)}
                          className={`w-full text-left p-2 rounded-md text-sm flex items-start gap-2 transition ${
                            isActive ? "bg-blue-50 text-blue-900" : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <span
                            className={`flex-shrink-0 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                              isAnswered
                                ? "bg-emerald-100 text-emerald-700"
                                : isActive
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {isAnswered ? "✓" : i + 1}
                          </span>
                          <span className="line-clamp-2 text-xs">{q.question}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </aside>

          {/* Active question */}
          <main className="lg:col-span-3">
            {current && (
              <div className="space-y-4">
                <Card hover={false}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${CATEGORY_STYLES[current.category].bg} ${CATEGORY_STYLES[current.category].text}`}
                      >
                        {CATEGORY_STYLES[current.category].label}
                      </span>
                      <span className="text-xs text-gray-500">
                        Question {activeIdx + 1} of {questions.length}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {current.question}
                    </h2>
                    <p className="text-sm text-gray-500 italic">
                      Why this might be asked: {current.why}
                    </p>
                  </CardContent>
                </Card>

                <Card hover={false}>
                  <CardContent className="p-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Your answer
                    </label>
                    <textarea
                      value={answers[activeIdx] || ""}
                      onChange={e =>
                        setAnswers(prev => ({ ...prev, [activeIdx]: e.target.value }))
                      }
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Type your answer. Aim for STAR: Situation, Task, Action, Result."
                    />
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">
                        {(answers[activeIdx] || "").length} chars
                      </span>
                      <Button onClick={critique} disabled={critiquing}>
                        {critiquing ? (
                          <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Grading…
                          </>
                        ) : (
                          <>
                            <Sparkles size={16} className="mr-2" />
                            Get AI feedback
                          </>
                        )}
                      </Button>
                    </div>
                    {error && (
                      <div className="mt-3 p-3 rounded bg-red-50 border border-red-200 text-sm text-red-800 flex items-start gap-2">
                        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                        {error}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {currentFeedback && (
                  <Card hover={false}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm uppercase tracking-wider font-bold text-gray-900">
                          AI Feedback
                        </h3>
                        <div className="text-3xl font-black text-blue-600">
                          {currentFeedback.score}/10
                        </div>
                      </div>

                      {currentFeedback.strengths.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                            Strengths
                          </p>
                          <ul className="space-y-1 text-sm text-gray-700">
                            {currentFeedback.strengths.map((s, i) => (
                              <li key={i}>· {s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {currentFeedback.improvements.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                            Improvements
                          </p>
                          <ul className="space-y-1 text-sm text-gray-700">
                            {currentFeedback.improvements.map((s, i) => (
                              <li key={i}>· {s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-1">
                          Model answer (STAR)
                        </p>
                        <p className="text-sm text-gray-700 bg-purple-50 p-3 rounded border border-purple-100 leading-relaxed">
                          {currentFeedback.modelAnswer}
                        </p>
                      </div>

                      {activeIdx < questions.length - 1 && (
                        <Button
                          onClick={() => setActiveIdx(activeIdx + 1)}
                          className="mt-4 w-full"
                        >
                          Next question
                          <ChevronRight size={16} className="ml-1" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </main>
        </div>
      )}
    </ToolShell>
  );
}
