// Lightweight AI client. BYO key — works with OpenAI, Groq, OpenRouter,
// Anthropic, and any OpenAI-compatible endpoint.

export type AIProvider = "openai" | "groq" | "openrouter" | "anthropic" | "custom";

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  baseUrl?: string; // for custom/OpenRouter
}

export const PROVIDER_DEFAULTS: Record<AIProvider, { baseUrl: string; defaultModel: string; label: string; signupUrl: string }> = {
  openai: {
    baseUrl: "https://api.openai.com/v1",
    defaultModel: "gpt-4o-mini",
    label: "OpenAI",
    signupUrl: "https://platform.openai.com/api-keys",
  },
  groq: {
    baseUrl: "https://api.groq.com/openai/v1",
    defaultModel: "llama-3.3-70b-versatile",
    label: "Groq (fast & free tier)",
    signupUrl: "https://console.groq.com/keys",
  },
  openrouter: {
    baseUrl: "https://openrouter.ai/api/v1",
    defaultModel: "google/gemini-2.0-flash-exp:free",
    label: "OpenRouter (free models)",
    signupUrl: "https://openrouter.ai/keys",
  },
  anthropic: {
    baseUrl: "https://api.anthropic.com/v1",
    defaultModel: "claude-haiku-4-5-20251001",
    label: "Anthropic Claude",
    signupUrl: "https://console.anthropic.com/settings/keys",
  },
  custom: {
    baseUrl: "",
    defaultModel: "",
    label: "Custom (OpenAI-compatible)",
    signupUrl: "",
  },
};

import { STORAGE_KEYS, migrateLegacyKeys } from "@/lib/storage-keys";

export function loadAIConfig(): AIConfig | null {
  if (typeof window === "undefined") return null;
  migrateLegacyKeys();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.aiConfig);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveAIConfig(config: AIConfig) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.aiConfig, JSON.stringify(config));
}

export function clearAIConfig() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.aiConfig);
}

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chat(messages: AIMessage[], config: AIConfig, signal?: AbortSignal): Promise<string> {
  if (!config.apiKey) throw new Error("No API key configured. Open AI Settings to add one.");

  const provider = config.provider;
  const baseUrl = config.baseUrl || PROVIDER_DEFAULTS[provider]?.baseUrl;
  if (!baseUrl) throw new Error("No base URL configured for provider.");

  // Anthropic uses a different shape
  if (provider === "anthropic") {
    const system = messages.find(m => m.role === "system")?.content;
    const userMessages = messages.filter(m => m.role !== "system");
    const res = await fetch(`${baseUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 1024,
        system,
        messages: userMessages.map(m => ({ role: m.role, content: m.content })),
      }),
      signal,
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`AI request failed (${res.status}): ${err.slice(0, 200)}`);
    }
    const data = await res.json();
    return data?.content?.[0]?.text || "";
  }

  // OpenAI-compatible
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
    signal,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI request failed (${res.status}): ${err.slice(0, 200)}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "";
}

// ---- Resume-specific tasks ----

const SYSTEM_RESUME = `You are an expert resume writer who helps job-seekers (especially students and early-career engineers) write content that performs well with both recruiters and ATS systems.
Rules:
- Output ONLY the rewritten text, no preamble, no explanation, no quotes around it.
- Use strong action verbs, quantified outcomes when possible.
- Be concise — no fluff.
- Match the requested tone.
- Never invent facts that aren't in the input.`;

export async function aiRewrite(
  text: string,
  mode: "professional" | "impact" | "concise" | "ats" | "casual",
  context: string,
  config: AIConfig
): Promise<string> {
  const modeInstructions: Record<typeof mode, string> = {
    professional: "Rewrite in a polished, professional tone suitable for a senior recruiter.",
    impact: "Rewrite to emphasize measurable impact, outcomes, and the candidate's unique contribution. Use strong action verbs.",
    concise: "Rewrite to be 30-50% shorter while keeping all key information.",
    ats: "Rewrite to be ATS-friendly: strong keywords, standard terminology, action verbs, scannable structure. No fancy formatting.",
    casual: "Rewrite with a warm, approachable, human tone — still professional, but less stiff.",
  };

  const prompt = `Context: ${context}

Original text:
${text}

Task: ${modeInstructions[mode]}`;

  return chat(
    [
      { role: "system", content: SYSTEM_RESUME },
      { role: "user", content: prompt },
    ],
    config
  );
}

export async function aiGenerateProjectDescription(
  title: string,
  technologies: string[],
  config: AIConfig
): Promise<string> {
  const prompt = `Generate a one-sentence project description (max 25 words) for a portfolio project.
Title: ${title}
Tech stack: ${technologies.join(", ")}

Output ONLY the sentence. Use strong action verbs. Focus on what it does and why it matters.`;
  return chat(
    [
      { role: "system", content: SYSTEM_RESUME },
      { role: "user", content: prompt },
    ],
    config
  );
}

export interface RoastResult {
  score: number;
  vibe: string; // one-liner verdict
  wins: string[]; // 3 things working
  fails: string[]; // 3 brutal critiques
  fix: string; // single most important fix
}

export async function aiRoastResume(resumeText: string, config: AIConfig): Promise<RoastResult> {
  const prompt = `You are a brutally honest senior recruiter who reviews 100 resumes a day. Roast this resume — be sharp, witty, specific. No mercy on weak content, but stay constructive and never insult the person.

Output JSON with this exact shape (no markdown fences, no other text):
{
  "score": <0-100 integer overall recruiter-readiness>,
  "vibe": "<single witty one-liner verdict, max 12 words>",
  "wins": ["<3 specific things that work, max 12 words each>"],
  "fails": ["<3 specific things that DON'T work — be brutal but specific, max 14 words each>"],
  "fix": "<the single most important thing to fix, max 20 words>"
}

Resume to roast:
${resumeText}`;

  const raw = await chat(
    [
      { role: "system", content: "You are a witty, brutally honest senior tech recruiter. Always respond with valid JSON only — no markdown fences, no commentary." },
      { role: "user", content: prompt },
    ],
    config
  );
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI did not return valid JSON. Try again or switch models.");
  const parsed = JSON.parse(match[0]);
  return {
    score: Number(parsed.score) || 0,
    vibe: String(parsed.vibe || ""),
    wins: Array.isArray(parsed.wins) ? parsed.wins.map(String).slice(0, 3) : [],
    fails: Array.isArray(parsed.fails) ? parsed.fails.map(String).slice(0, 3) : [],
    fix: String(parsed.fix || ""),
  };
}

export interface JDMatchResult {
  matchScore: number; // 0-100
  matchedKeywords: string[];
  missingKeywords: string[];
  rewriteSummary: string; // 2-3 sentence repositioning of the candidate
  suggestions: string[]; // 3-5 concrete actions
}

// ----- Recruiter View Simulator -----------------------------------------
// Roleplays a recruiter scanning a portfolio: a 30-second snap reaction
// (skim) and a 2-minute deeper read. Returns interview-decision signals.

export interface RecruiterViewResult {
  snapVerdict: "interview" | "maybe" | "pass";
  callbackOdds: number;            // 0-100
  thirtySecondImpression: string;  // 2-3 sentence first read
  twoMinuteImpression: string;     // longer reflection
  hooks: string[];                 // what made them dig deeper
  redFlags: string[];              // what made them hesitate
  fixesThatWouldFlip: string[];    // concrete changes to flip a pass -> interview
}

export async function aiRecruiterView(
  resumeText: string,
  jd: string,
  config: AIConfig
): Promise<RecruiterViewResult> {
  const prompt = `You are a senior in-house tech recruiter at a top company. You receive 200 candidates a week and have ~30 seconds per resume on the first pass. You are pragmatic, busy, and unsentimental.

For this candidate and role, simulate your decision-making honestly. Output JSON only.

Resume / portfolio:
${resumeText}

Job description:
${jd}

Output JSON with this exact shape:
{
  "snapVerdict": "interview" | "maybe" | "pass",
  "callbackOdds": <0-100 integer estimate of getting a phone screen>,
  "thirtySecondImpression": "<2-3 sentences in first-person recruiter voice describing your skim reaction>",
  "twoMinuteImpression": "<3-5 sentences in first-person describing what you found on a deeper read>",
  "hooks": ["<up to 4 specific things that made you want to talk to this person, each <= 16 words>"],
  "redFlags": ["<up to 4 specific concerns that made you hesitate, each <= 16 words>"],
  "fixesThatWouldFlip": ["<up to 4 concrete edits (not generic advice) that would change pass to interview, each <= 16 words>"]
}`;
  const raw = await chat(
    [
      { role: "system", content: "You are a brutally honest senior tech recruiter. Reply with valid JSON only — no markdown, no preamble." },
      { role: "user", content: prompt },
    ],
    config
  );
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI did not return valid JSON. Try again or switch models.");
  const p = JSON.parse(match[0]);
  const verdict = ["interview", "maybe", "pass"].includes(p.snapVerdict) ? p.snapVerdict : "maybe";
  return {
    snapVerdict: verdict,
    callbackOdds: Math.max(0, Math.min(100, Number(p.callbackOdds) || 0)),
    thirtySecondImpression: String(p.thirtySecondImpression || ""),
    twoMinuteImpression: String(p.twoMinuteImpression || ""),
    hooks: Array.isArray(p.hooks) ? p.hooks.map(String).slice(0, 4) : [],
    redFlags: Array.isArray(p.redFlags) ? p.redFlags.map(String).slice(0, 4) : [],
    fixesThatWouldFlip: Array.isArray(p.fixesThatWouldFlip) ? p.fixesThatWouldFlip.map(String).slice(0, 4) : [],
  };
}

export async function aiMatchJD(resumeText: string, jd: string, config: AIConfig): Promise<JDMatchResult> {
  const prompt = `Analyze how well this candidate fits this job description.

Resume:
${resumeText}

Job Description:
${jd}

Output JSON only:
{
  "matchScore": <0-100 integer, how strongly the resume aligns with the JD>,
  "matchedKeywords": ["<up to 10 relevant keywords/skills that appear in BOTH>"],
  "missingKeywords": ["<up to 8 important keywords/skills in the JD that are NOT in the resume>"],
  "rewriteSummary": "<2-3 sentences rewriting the candidate's bio to better target THIS specific role>",
  "suggestions": ["<3-5 specific actions the candidate should take to improve fit, max 16 words each>"]
}`;
  const raw = await chat(
    [
      { role: "system", content: "You are an expert tech recruiter who matches candidates to job descriptions. Respond with valid JSON only." },
      { role: "user", content: prompt },
    ],
    config
  );
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI did not return valid JSON.");
  const p = JSON.parse(match[0]);
  return {
    matchScore: Number(p.matchScore) || 0,
    matchedKeywords: Array.isArray(p.matchedKeywords) ? p.matchedKeywords.map(String) : [],
    missingKeywords: Array.isArray(p.missingKeywords) ? p.missingKeywords.map(String) : [],
    rewriteSummary: String(p.rewriteSummary || ""),
    suggestions: Array.isArray(p.suggestions) ? p.suggestions.map(String) : [],
  };
}

export async function aiGenerateCoverLetter(
  resumeText: string,
  jd: string,
  tone: "professional" | "warm" | "confident" | "concise",
  config: AIConfig
): Promise<string> {
  const toneMap = {
    professional: "polished, formal, recruiter-friendly",
    warm: "warm, personable, human — like writing to a future colleague",
    confident: "confident, direct, outcome-led — emphasize what you'll deliver",
    concise: "concise — under 200 words total, no fluff",
  };
  const prompt = `Write a cover letter for this candidate applying to this role.

Tone: ${toneMap[tone]}.
Structure: 3 short paragraphs — hook, fit/proof, sign-off.
Rules:
- Use ONLY facts present in the resume; don't invent experience.
- Open with a specific hook (something about the company or role from the JD).
- Middle paragraph: 2 concrete proof points from the resume that map to JD requirements.
- Close with a call-to-action and signature line.
- Output ONLY the cover letter text, no preamble.

Resume:
${resumeText}

Job Description:
${jd}`;
  return chat(
    [
      { role: "system", content: SYSTEM_RESUME },
      { role: "user", content: prompt },
    ],
    config
  );
}

export interface InterviewQuestion {
  question: string;
  category: "behavioral" | "technical" | "system-design" | "role-fit";
  why: string; // why this would be asked
}

export async function aiGenerateInterviewQuestions(
  resumeText: string,
  targetRole: string,
  config: AIConfig
): Promise<InterviewQuestion[]> {
  const prompt = `Generate 8 realistic interview questions for this candidate applying to: "${targetRole}".

Mix categories: 3 behavioral (based on their actual experience), 3 technical (based on their tech stack), 1 system-design, 1 role-fit/motivation.

Each question should be specific to THIS candidate's resume — not generic.

Output JSON only:
{
  "questions": [
    {
      "question": "<the interview question>",
      "category": "<behavioral|technical|system-design|role-fit>",
      "why": "<one sentence why an interviewer might ask THIS question to THIS candidate>"
    }
  ]
}

Resume:
${resumeText}`;
  const raw = await chat(
    [
      { role: "system", content: "You are a senior tech interviewer. Output valid JSON only." },
      { role: "user", content: prompt },
    ],
    config
  );
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI did not return valid JSON.");
  const parsed = JSON.parse(match[0]);
  return Array.isArray(parsed.questions) ? parsed.questions.slice(0, 10) : [];
}

export interface AnswerFeedback {
  score: number; // 0-10
  strengths: string[];
  improvements: string[];
  modelAnswer: string;
}

export async function aiCritiqueAnswer(
  question: string,
  answer: string,
  resumeContext: string,
  config: AIConfig
): Promise<AnswerFeedback> {
  const prompt = `Critique this interview answer.

Question: ${question}
Candidate's answer: ${answer}

Candidate's background (for context only):
${resumeContext}

Output JSON only:
{
  "score": <0-10 integer>,
  "strengths": ["<1-3 specific strengths, max 14 words each>"],
  "improvements": ["<1-3 specific improvements, max 16 words each>"],
  "modelAnswer": "<a STAR-format model answer in 80-130 words tailored to this candidate>"
}`;
  const raw = await chat(
    [
      { role: "system", content: "You are a senior interview coach. Be specific, kind, and direct. Output valid JSON only." },
      { role: "user", content: prompt },
    ],
    config
  );
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI did not return valid JSON.");
  const p = JSON.parse(match[0]);
  return {
    score: Number(p.score) || 0,
    strengths: Array.isArray(p.strengths) ? p.strengths.map(String) : [],
    improvements: Array.isArray(p.improvements) ? p.improvements.map(String) : [],
    modelAnswer: String(p.modelAnswer || ""),
  };
}

export interface SkillGapReport {
  fitScore: number; // 0-100 readiness for the role
  matched: string[];
  missing: Array<{ skill: string; priority: "must" | "nice"; learnPath: string }>;
  projectIdeas: Array<{ title: string; pitch: string; stack: string[] }>;
  summary: string;
}

export async function aiAnalyzeSkillGap(
  resumeText: string,
  targetRole: string,
  config: AIConfig
): Promise<SkillGapReport> {
  const prompt = `Analyze this candidate's readiness for a specific target role. Be specific and honest — don't sugar-coat.

Target role: ${targetRole}

Output JSON only:
{
  "fitScore": <0-100 integer how ready this candidate is right now>,
  "matched": ["<up to 12 skills the candidate already has that are relevant to this role>"],
  "missing": [
    {
      "skill": "<specific skill name>",
      "priority": "must | nice",
      "learnPath": "<one specific actionable resource — course name, doc URL pattern, book, or '2-week project doing X'>"
    }
    // ... up to 6 most critical missing skills
  ],
  "projectIdeas": [
    {
      "title": "<concrete project name>",
      "pitch": "<one sentence what it does and why it proves the missing skills>",
      "stack": ["..."]
    }
    // ... 3 project ideas that close the biggest gaps
  ],
  "summary": "<2-sentence honest verdict: where they stand + the single biggest gap to close>"
}

Resume:
${resumeText}`;

  const raw = await chat(
    [
      { role: "system", content: "You are a senior tech hiring manager who advises candidates on what to build/learn to land specific roles. Honest, specific, actionable. Output valid JSON only." },
      { role: "user", content: prompt },
    ],
    config
  );
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI did not return valid JSON.");
  return JSON.parse(match[0]) as SkillGapReport;
}

export interface SalaryAdvice {
  marketRange: { low: number; mid: number; high: number; currency: string };
  yourAsk: number;
  rationale: string;
  email: { subject: string; body: string };
  talkingPoints: string[];
  redFlags: string[];
}

export async function aiNegotiateSalary(
  resumeText: string,
  currentOffer: string,
  role: string,
  location: string,
  config: AIConfig
): Promise<SalaryAdvice> {
  const prompt = `Advise this candidate on negotiating a job offer.

Their resume:
${resumeText}

Role they're being offered: ${role}
Location: ${location}
Current offer details (compensation breakdown, perks, anything they pasted):
${currentOffer}

Output JSON only:
{
  "marketRange": {
    "low": <number — 25th percentile total comp for this role+location>,
    "mid": <number — median>,
    "high": <number — 75th percentile>,
    "currency": "<USD|INR|EUR|etc>"
  },
  "yourAsk": <number — what they should counter with>,
  "rationale": "<2-sentence why this ask is fair given their resume + market>",
  "email": {
    "subject": "<email subject line>",
    "body": "<full negotiation email body — confident, warm, never desperate. ~150 words. Includes specific asks for base/equity/signing bonus where appropriate. Uses 'I' not 'we'.>"
  },
  "talkingPoints": ["<3-5 specific things to say if they push back, max 18 words each>"],
  "redFlags": ["<2-3 warning signs to watch for in their response, max 14 words each>"]
}

Important:
- Be realistic about market rates. Don't inflate.
- Factor in the candidate's actual experience level from their resume.
- If the offer is already strong, say so and suggest negotiating non-cash items (equity, PTO, remote, signing bonus).`;

  const raw = await chat(
    [
      { role: "system", content: "You are a salary negotiation coach who has helped hundreds of engineers get $10-50k more. Output valid JSON only." },
      { role: "user", content: prompt },
    ],
    config
  );
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI did not return valid JSON.");
  return JSON.parse(match[0]) as SalaryAdvice;
}

export interface ProjectSuggestion {
  title: string;
  oneLiner: string;
  whyBuild: string;
  techStack: string[];
  features: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estDays: number;
  resumeBullet: string;
}

export async function aiSuggestProjects(
  resumeText: string,
  targetRole: string,
  config: AIConfig
): Promise<ProjectSuggestion[]> {
  const prompt = `Suggest 4 portfolio projects this candidate should build to land their target role.

Target role: ${targetRole}

For each project:
- Should fill a SPECIFIC gap in their current portfolio (analyze what they already have).
- Should be feasible in 1-3 weeks.
- Should produce a portfolio-worthy artifact.
- Should not be the cliché "todo app" or "weather app" — make it unique enough to remember.
- Mix difficulties: 1 beginner-friendly, 2 intermediate, 1 stretch.

Output JSON only:
{
  "projects": [
    {
      "title": "<concrete project name, max 8 words>",
      "oneLiner": "<one sentence describing what it does>",
      "whyBuild": "<why this fills a gap for THIS candidate, max 25 words>",
      "techStack": ["<3-6 specific technologies>"],
      "features": ["<3-5 concrete features to include>"],
      "difficulty": "beginner | intermediate | advanced",
      "estDays": <integer 5-21>,
      "resumeBullet": "<sample resume bullet after you build it, ~18 words with placeholder metrics>"
    }
  ]
}

Resume:
${resumeText}`;

  const raw = await chat(
    [
      { role: "system", content: "You are a senior engineer who advises juniors on portfolio projects that get them hired. Output valid JSON only." },
      { role: "user", content: prompt },
    ],
    config
  );
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI did not return valid JSON.");
  const parsed = JSON.parse(match[0]);
  return Array.isArray(parsed.projects) ? parsed.projects : [];
}

export async function aiCareerCoachReply(
  messages: AIMessage[],
  resumeText: string,
  config: AIConfig
): Promise<string> {
  const system = `You are Hyred's AI Career Coach — a senior tech career mentor.

You have read the user's resume below. Use it to give SPECIFIC advice — never generic. Reference their actual companies, projects, skills, gaps.

Style:
- Warm but direct. Like a senior friend at a top company.
- Short paragraphs. Use line breaks. No long walls of text.
- Concrete next actions, never abstract advice.
- If you don't have enough info, ask one clarifying question.
- Markdown formatting OK — bold key points, use bullet lists when natural.

User's resume:
${resumeText}`;

  const fullMessages: AIMessage[] = [{ role: "system", content: system }, ...messages];
  return chat(fullMessages, config);
}

export async function aiGenerateReadme(resumeText: string, githubUsername: string, config: AIConfig): Promise<string> {
  const prompt = `Generate a beautiful GitHub profile README in Markdown for this developer. The README will go at https://github.com/${githubUsername || "username"}.

Style guidelines:
- Lead with a strong one-line tagline (NOT "Hi, I'm X 👋" — be more interesting).
- Use a "## About me" section: 2-3 sentences, conversational but professional.
- Add a "## Stack" section with grouped tech badges using shields.io URLs. Group by: Languages / Frameworks / Tools.
  Format: ![Name](https://img.shields.io/badge/-Name-COLOR?style=flat-square&logo=NAME&logoColor=white)
- Add "## What I'm building" section pulling 2-3 highlight projects.
- Add a "## Currently" section if context allows (learning X, building Y).
- Add a "## Stats" section with these widgets:
  ![Stats](https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=tokyonight&hide_border=true)
  ![Streak](https://github-readme-streak-stats.herokuapp.com/?user=${githubUsername}&theme=tokyonight&hide_border=true)
- End with a "## Reach out" section with social links if known.
- Use emojis sparingly — 1-2 per section max.
- Output PURE markdown only, no fences or explanation.

Developer's resume:
${resumeText}`;

  return chat(
    [
      { role: "system", content: "You write GitHub profile READMEs that developers actually want to use. Output markdown only." },
      { role: "user", content: prompt },
    ],
    config
  );
}

export interface LinkedInOptimization {
  headline: string;
  about: string;
  experienceBullets: Array<{ role: string; bullets: string[] }>;
}

export async function aiOptimizeLinkedIn(resumeText: string, config: AIConfig): Promise<LinkedInOptimization> {
  const prompt = `Rewrite this candidate's LinkedIn profile for maximum recruiter reach.

Output JSON only:
{
  "headline": "<single line, max 220 chars. Lead with what they DO, then a unique angle. NO 'Aspiring' or '|' separators — use clean copy. Example: 'Software Engineer building real-time ML systems for biosensors · React + TypeScript + TensorFlow.js'>",
  "about": "<200-400 word LinkedIn About section. 3 paragraphs: (1) hook — what makes them unique, (2) recent proof — specific projects/wins, (3) what they're looking for + how to reach them. Use line breaks. NO bullet points. Conversational but professional.>",
  "experienceBullets": [
    {
      "role": "<position @ company>",
      "bullets": ["<3-5 strong achievement bullets per role, LinkedIn-formatted: lead with action verb, include metrics where present in resume, max 20 words each>"]
    }
  ]
}

Resume:
${resumeText}`;

  const raw = await chat(
    [
      { role: "system", content: "You are a LinkedIn ghostwriter for tech professionals. Output valid JSON only." },
      { role: "user", content: prompt },
    ],
    config
  );
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI did not return valid JSON.");
  const p = JSON.parse(match[0]);
  return {
    headline: String(p.headline || ""),
    about: String(p.about || ""),
    experienceBullets: Array.isArray(p.experienceBullets) ? p.experienceBullets : [],
  };
}

export interface ApplicationPack {
  coverLetter: string;
  recruiterEmail: { subject: string; body: string };
  linkedinDM: string;
  thankYouNote: string;
}

export async function aiGenerateApplicationPack(
  resumeText: string,
  jd: string,
  companyName: string,
  config: AIConfig
): Promise<ApplicationPack> {
  const prompt = `Generate a complete application materials pack for this candidate applying to this role.

Output JSON only:
{
  "coverLetter": "<3-paragraph cover letter — hook, fit/proof, sign-off. ~250 words.>",
  "recruiterEmail": {
    "subject": "<concise subject line, max 60 chars>",
    "body": "<cold email TO a recruiter at ${companyName || "the company"}. ~120 words. Warm but direct. Asks for a 15-min chat or a referral. Ends with their resume link / portfolio placeholder.>"
  },
  "linkedinDM": "<LinkedIn message to a hiring manager / employee at ${companyName || "the company"}. ~80 words. Specific, no fluff, asks one clear thing.>",
  "thankYouNote": "<post-interview thank-you note, ~100 words. References a specific thing from the conversation (use [specific point] as placeholder for them to fill).>"
}

Rules:
- Use ONLY facts from the resume — don't invent experience.
- Voice: confident, specific, never desperate.
- Open every email with a real hook, not "I hope this finds you well".

Resume:
${resumeText}

Job Description:
${jd}`;

  const raw = await chat(
    [
      { role: "system", content: "You write professional job-application materials that actually get responses. Output valid JSON only." },
      { role: "user", content: prompt },
    ],
    config
  );
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI did not return valid JSON.");
  const p = JSON.parse(match[0]);
  return {
    coverLetter: String(p.coverLetter || ""),
    recruiterEmail: {
      subject: String(p.recruiterEmail?.subject || ""),
      body: String(p.recruiterEmail?.body || ""),
    },
    linkedinDM: String(p.linkedinDM || ""),
    thankYouNote: String(p.thankYouNote || ""),
  };
}

export interface ParsedResume {
  personalInfo: {
    name: string;
    title: string;
    bio: string;
    tagline: string;
    yearsOfExperience: number;
    highlights: string[];
  };
  contact: {
    email: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
  };
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements: string[];
    technologies: string[];
    type: "full-time" | "part-time" | "contract" | "internship" | "freelance";
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: string;
    achievements: string[];
    coursework: string[];
  }>;
  skills: Array<{ name: string; category: string; proficiency: number; yearsOfExperience: number }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    githubUrl: string;
    liveUrl: string;
  }>;
}

export async function aiParseResume(resumeText: string, config: AIConfig): Promise<ParsedResume> {
  const prompt = `Extract structured data from this resume text. Output VALID JSON ONLY — no markdown fences, no commentary.

Use this exact shape (omit fields you don't find, use "" for missing strings, [] for missing arrays):
{
  "personalInfo": {
    "name": "<full name>",
    "title": "<current/most-recent role title>",
    "bio": "<2-3 sentence professional summary based on the resume>",
    "tagline": "<short catchy one-liner about them>",
    "yearsOfExperience": <number based on earliest job year>,
    "highlights": ["<3 impressive bullet-form achievements, max 18 words each>"]
  },
  "contact": {
    "email": "<email>",
    "location": "<city, country>",
    "linkedin": "<full URL or empty>",
    "github": "<full URL or empty>",
    "website": "<full URL or empty>"
  },
  "experience": [
    {
      "company": "...",
      "position": "...",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD or empty for current",
      "description": "<1-2 sentence what the role was about>",
      "achievements": ["<bullet>", "..."],
      "technologies": ["..."],
      "type": "full-time | part-time | contract | internship | freelance"
    }
  ],
  "education": [
    {
      "institution": "...",
      "degree": "...",
      "field": "...",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "gpa": "<or empty>",
      "achievements": [],
      "coursework": []
    }
  ],
  "skills": [
    {"name": "...", "category": "<frontend|backend|database|tools|languages|frameworks|ai>", "proficiency": <1-5>, "yearsOfExperience": <number>}
  ],
  "projects": [
    {
      "title": "...",
      "description": "<one sentence>",
      "technologies": ["..."],
      "githubUrl": "",
      "liveUrl": ""
    }
  ]
}

Rules:
- For dates, infer YYYY-MM-DD. If only year known, use YYYY-01-01.
- Don't invent data not present in the resume.
- "highlights" should be the 3 most impressive bullets from the WHOLE resume — promote them up.
- Categorize skills sensibly (React → frontend, Python → languages, PostgreSQL → database, etc.).

Resume:
${resumeText}`;

  const raw = await chat(
    [
      { role: "system", content: "You parse resumes into structured JSON. Output valid JSON only, nothing else." },
      { role: "user", content: prompt },
    ],
    config
  );
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI did not return valid JSON. Try a different model.");
  return JSON.parse(match[0]) as ParsedResume;
}

// Build a plain-text "resume" string for passing to AI prompts
import type { Portfolio } from "@/types/portfolio";

export function buildResumeText(p: Portfolio): string {
  const lines: string[] = [];
  lines.push(`Name: ${p.personalInfo.name}`);
  lines.push(`Title: ${p.personalInfo.title}`);
  if (p.personalInfo.tagline) lines.push(`Tagline: ${p.personalInfo.tagline}`);
  lines.push(`Bio: ${p.personalInfo.bio}`);
  if (p.personalInfo.highlights?.length) {
    lines.push(`Highlights:`);
    p.personalInfo.highlights.forEach(h => lines.push(`  - ${h}`));
  }
  lines.push(`Location: ${p.contact.location}`);
  lines.push(`\nExperience:`);
  p.experience.forEach(e => {
    lines.push(`- ${e.position} @ ${e.company} (${e.startDate} – ${e.endDate || "Present"})`);
    lines.push(`  ${e.description}`);
    e.achievements.forEach(a => lines.push(`  • ${a}`));
    if (e.technologies.length) lines.push(`  Tech: ${e.technologies.join(", ")}`);
  });
  lines.push(`\nProjects:`);
  p.projects.forEach(pr => {
    lines.push(`- ${pr.title}: ${pr.description}`);
    if (pr.impact) lines.push(`  Impact: ${pr.impact}`);
    lines.push(`  Tech: ${pr.technologies.join(", ")}`);
  });
  lines.push(`\nSkills: ${p.skills.map(s => s.name).join(", ")}`);
  lines.push(`\nEducation:`);
  p.education.forEach(ed => {
    lines.push(`- ${ed.degree} ${ed.field} @ ${ed.institution}`);
  });
  return lines.join("\n");
}

export async function aiGenerateHighlights(
  bio: string,
  experiences: { position: string; company: string; achievements: string[] }[],
  projects: { title: string; description: string; impact?: string }[],
  config: AIConfig
): Promise<string[]> {
  const context = `
Bio: ${bio}

Experience:
${experiences.map(e => `- ${e.position} @ ${e.company}: ${e.achievements.slice(0, 3).join("; ")}`).join("\n")}

Projects:
${projects.slice(0, 5).map(p => `- ${p.title}: ${p.description}${p.impact ? ` (Impact: ${p.impact})` : ""}`).join("\n")}
`;

  const prompt = `Based on this candidate's profile below, generate exactly 3 punchy highlight bullets for the hero section of their portfolio.
Each bullet must:
- Be one short sentence (max 18 words)
- Lead with a strong action verb
- Include a metric or outcome where possible
- Be in their voice (first person implied)

Output as a JSON array of 3 strings. NO other text.

${context}`;
  const raw = await chat(
    [
      { role: "system", content: SYSTEM_RESUME },
      { role: "user", content: prompt },
    ],
    config
  );
  try {
    // Extract JSON array even if model wrapped in text
    const match = raw.match(/\[[\s\S]*\]/);
    const parsed = JSON.parse(match ? match[0] : raw);
    if (Array.isArray(parsed)) return parsed.slice(0, 3).map(String);
  } catch {
    // fallback: split on newlines
    return raw
      .split("\n")
      .map(l => l.replace(/^[-*\d.)\s]+/, "").trim())
      .filter(l => l.length > 10)
      .slice(0, 3);
  }
  return [];
}

// ----- Impact Quantifier -----------------------------------------------
// Turns a vague resume bullet ("built a dashboard") into 3 quantified
// variants ("Built a dashboard used by 200+ engineers, cutting MTTR by
// 45%"). The AI is told to be conservative when the user gives no metrics
// and to invent plausible ranges only when explicitly asked.

export interface QuantifiedBullet {
  style: "conservative" | "bold" | "data-heavy";
  text: string;
  reasoning: string;
}

export interface QuantifyResult {
  variants: QuantifiedBullet[];
  metricsToGather: string[];
}

export async function aiQuantifyBullet(
  bullet: string,
  context: string,
  roleCategory: string,
  config: AIConfig
): Promise<QuantifyResult> {
  const prompt = `You're an expert resume writer. Take this candidate's bullet point and rewrite it into THREE variants that quantify impact and read like a recruiter's dream.

Original bullet:
${bullet}

Additional context the candidate provided (may be empty):
${context || "(none)"}

Role category: ${roleCategory}

Rules:
- Only invent numbers when the candidate hinted at them in context. Otherwise use credible ranges like "10s of", "hundreds of", "weekly", etc.
- Lead with the IMPACT, then the action — not the other way around.
- Use strong verbs (shipped, owned, cut, accelerated, eliminated, scaled), never "responsible for" or "worked on".
- Aim for one line each, 14-22 words.

Output JSON only:
{
  "variants": [
    { "style": "conservative", "text": "<safe rewrite, no invented numbers>", "reasoning": "<one sentence why this works>" },
    { "style": "bold", "text": "<assertive rewrite, sharper language>", "reasoning": "<one sentence why this works>" },
    { "style": "data-heavy", "text": "<numbers-forward rewrite>", "reasoning": "<one sentence why this works>" }
  ],
  "metricsToGather": ["<up to 4 specific data points the candidate should dig up to make any of these claims stronger, each <= 10 words>"]
}`;
  const raw = await chat(
    [
      { role: "system", content: "You are a senior resume writer who turns vague bullets into measurable impact. Reply with valid JSON only — no markdown." },
      { role: "user", content: prompt },
    ],
    config
  );
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI did not return valid JSON.");
  const p = JSON.parse(match[0]);
  const variants: QuantifiedBullet[] = Array.isArray(p.variants)
    ? p.variants.slice(0, 3).map((v: any) => ({
        style: ["conservative", "bold", "data-heavy"].includes(v.style) ? v.style : "conservative",
        text: String(v.text || ""),
        reasoning: String(v.reasoning || ""),
      }))
    : [];
  return {
    variants,
    metricsToGather: Array.isArray(p.metricsToGather) ? p.metricsToGather.map(String).slice(0, 4) : [],
  };
}

// ----- Recruiter Reply Generator ---------------------------------------
// Paste a recruiter's outreach + pick your intent → get 3 polished reply
// drafts in different tones. Solves the daily "I freeze when recruiters
// DM me" problem.

export type ReplyIntent = "interested" | "more-info" | "not-now" | "decline";

export interface ReplyDraft {
  tone: "warm" | "professional" | "brief";
  body: string;
}

export async function aiGenerateRecruiterReply(
  recruiterMessage: string,
  intent: ReplyIntent,
  resumeText: string,
  config: AIConfig
): Promise<ReplyDraft[]> {
  const intentDescription: Record<ReplyIntent, string> = {
    interested: "Express genuine interest. Ask 1-2 specific clarifying questions (comp range, remote policy, team size, etc.).",
    "more-info": "Be polite but non-committal. Ask for more details before saying yes — JD, comp band, interview process, timing.",
    "not-now": "Politely decline THIS opportunity while keeping the door open. Reference the recruiter for future roles.",
    decline: "Politely decline AND close the loop respectfully — don't burn the bridge but don't invite future outreach either.",
  };
  const prompt = `You're helping someone reply to a recruiter's outreach message. Write THREE reply drafts in different tones.

Recruiter's message:
${recruiterMessage}

Candidate's intent:
${intent} — ${intentDescription[intent]}

About the candidate (use lightly for personalization, don't quote it verbatim):
${resumeText.slice(0, 2000)}

Rules:
- Each reply is a complete email body — ready to copy/paste.
- Start by addressing the recruiter by name if their message included one (otherwise "Hi there" or just dive in).
- Stay under 120 words per reply.
- Match the recruiter's formality level loosely.
- No emoji unless the recruiter used them.

Output JSON only:
{
  "drafts": [
    { "tone": "warm", "body": "<full reply body>" },
    { "tone": "professional", "body": "<full reply body>" },
    { "tone": "brief", "body": "<full reply body, 3-4 sentences max>" }
  ]
}`;
  const raw = await chat(
    [
      { role: "system", content: "You are a career coach who writes great recruiter replies. Reply with valid JSON only." },
      { role: "user", content: prompt },
    ],
    config
  );
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI did not return valid JSON.");
  const p = JSON.parse(match[0]);
  return Array.isArray(p.drafts)
    ? p.drafts.slice(0, 3).map((d: any) => ({
        tone: ["warm", "professional", "brief"].includes(d.tone) ? d.tone : "professional",
        body: String(d.body || ""),
      }))
    : [];
}

// ----- Company Interview Prep ------------------------------------------
// Pre-interview brief: pasted company info → AI produces a one-page prep
// pack (positioning, likely interview style, smart questions to ask,
// talking points that show research).

export interface CompanyPrepResult {
  snapshot: string;             // 2-3 sentence company positioning
  interviewStyle: string;       // what to expect: behavioral, system design, take-home, etc.
  smartQuestions: string[];     // 5 questions YOU should ask interviewers
  talkingPoints: string[];      // 5 ways to show you've done your research
  redFlagsToWatch: string[];    // signals to watch for in the interview that might mean this isn't a fit
}

export async function aiCompanyPrep(
  companyName: string,
  role: string,
  contextNotes: string,
  resumeText: string,
  config: AIConfig
): Promise<CompanyPrepResult> {
  const prompt = `You are prepping a candidate for an interview tomorrow. Build a one-page brief based on what you know + what they told you.

Company: ${companyName}
Role being interviewed for: ${role}

Anything the candidate pasted about the company (JD, About page, recent news, leadership names, anything):
${contextNotes || "(none — work from general knowledge of the company)"}

Candidate's background (lightly inform the smart questions + talking points so they feel personal):
${resumeText.slice(0, 2500)}

Rules:
- Be confident but acknowledge what you don't know — never invent specific facts (revenue, headcount, funding stage) you're not sure of.
- Smart questions = ones that SHOW the candidate did their homework AND uncover real signal about the role / team.
- Talking points = ways the candidate can demonstrate they researched the company without sounding like they just read the About page.

Output JSON only:
{
  "snapshot": "<2-3 sentences positioning the company — what they do, who for, what's distinctive>",
  "interviewStyle": "<2-3 sentences on what interview rounds typically look like at a company of this type/stage. Be honest if you're inferring.>",
  "smartQuestions": ["<5 thoughtful questions to ask interviewers, each <= 22 words>"],
  "talkingPoints": ["<5 specific things the candidate can weave into their answers that show research, each <= 22 words>"],
  "redFlagsToWatch": ["<3-4 subtle signals in the interview that might suggest this isn't a great fit, each <= 18 words>"]
}`;
  const raw = await chat(
    [
      { role: "system", content: "You are a senior interview coach. Reply with valid JSON only — no markdown." },
      { role: "user", content: prompt },
    ],
    config
  );
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI did not return valid JSON.");
  const p = JSON.parse(match[0]);
  return {
    snapshot: String(p.snapshot || ""),
    interviewStyle: String(p.interviewStyle || ""),
    smartQuestions: Array.isArray(p.smartQuestions) ? p.smartQuestions.map(String).slice(0, 5) : [],
    talkingPoints: Array.isArray(p.talkingPoints) ? p.talkingPoints.map(String).slice(0, 5) : [],
    redFlagsToWatch: Array.isArray(p.redFlagsToWatch) ? p.redFlagsToWatch.map(String).slice(0, 4) : [],
  };
}
