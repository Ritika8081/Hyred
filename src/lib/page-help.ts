// Route → contextual help payload, shown by the HelpDrawer.
// Match by `startsWith` so nested routes (e.g. /projects/foo) inherit.
// Add a new entry here and the drawer picks it up automatically.

export interface PageHelp {
  title: string;
  intro: string;
  tips: { title: string; body: string }[];
  cta?: { label: string; href: string };
}

const DEFAULT: PageHelp = {
  title: "How Hyred works",
  intro:
    "Build a recruiter-ready portfolio + ATS-tuned PDF + AI cover letters from one source of truth.",
  tips: [
    { title: "Start in the Builder", body: "Paste your resume — AI extracts roles, skills, projects in seconds." },
    { title: "Polish with one click", body: "Hit ✨ on any field to rewrite. Or jump into a focused AI tool." },
    { title: "Ship", body: "Preview, share the link, download PDF, or deploy to your own domain." },
  ],
  cta: { label: "Open the full guide", href: "/help" },
};

const MAP: Array<[string, PageHelp]> = [
  ["/admin", {
    title: "Builder — your portfolio cockpit",
    intro: "Everything that powers your portfolio lives here. Edits save automatically to your browser.",
    tips: [
      { title: "Import a resume", body: "Drop a PDF or paste text in the Import section — AI auto-fills the form." },
      { title: "AI rewrite", body: "Look for ✨ next to fields to rewrite bullets, summaries, and project blurbs." },
      { title: "Set your AI key", body: "Open AI Settings to paste a free Groq / OpenRouter key. Stays in your browser." },
      { title: "Preview & deploy", body: "Use Quick Actions to preview, download PDF, export JSON, or deploy." },
    ],
    cta: { label: "Full guide & FAQ", href: "/help" },
  }],
  ["/build", {
    title: "Builder — your portfolio cockpit",
    intro: "Everything that powers your portfolio lives here. Edits save automatically.",
    tips: [
      { title: "Import a resume", body: "Drop a PDF or paste text in the Import section — AI auto-fills." },
      { title: "AI rewrite", body: "Look for ✨ on field labels to polish copy with AI." },
      { title: "Preview", body: "Use the Live Preview panel to see your site as you edit." },
    ],
    cta: { label: "Full guide & FAQ", href: "/help" },
  }],
  ["/tools/roast", {
    title: "Roast My Resume",
    intro: "Get a brutally honest AI critique with a shareable card.",
    tips: [
      { title: "Use your saved resume", body: "We pull from the Builder data. Make sure your bio + projects are filled in." },
      { title: "Share the card", body: "Copy the result as an image to post on X / LinkedIn for instant attention." },
    ],
    cta: { label: "More tools", href: "/tools" },
  }],
  ["/tools/match", {
    title: "JD Matcher",
    intro: "Paste a job description — see your match % and get a tailored summary.",
    tips: [
      { title: "Paste the full JD", body: "More context = better match analysis and bio rewrites." },
      { title: "Copy the tailored bio", body: "Use the rewrite directly in your cover letter or LinkedIn About." },
    ],
    cta: { label: "Application Pack", href: "/tools/apply" },
  }],
  ["/tools/apply", {
    title: "Application Pack",
    intro: "Cover letter + cold email + LinkedIn DM + thank-you note from one JD.",
    tips: [
      { title: "Paste the JD + company URL", body: "AI uses the full context to personalize tone and references." },
      { title: "Download or copy", body: "Each piece has a one-click copy and a PDF export." },
    ],
    cta: { label: "Mock Interview", href: "/tools/interview" },
  }],
  ["/tools/interview", {
    title: "Voice Mock Interview",
    intro: "Get real questions based on YOUR resume — type or speak your answers, AI grades each one.",
    tips: [
      { title: "Speak instead of type", body: "Hit the Voice button next to your answer to dictate. AI scores content + pacing." },
      { title: "Answer in your own words", body: "AI scores clarity, specificity, and structure (STAR method)." },
      { title: "Iterate", body: "Read the model answer, rewrite, re-grade. Three rounds usually gets you to an 8+." },
    ],
    cta: { label: "Recruiter View Simulator", href: "/tools/recruiter-view" },
  }],
  ["/tools/recruiter-view", {
    title: "Recruiter View Simulator",
    intro: "AI plays the role of a senior in-house recruiter. Get the 30-second snap reaction, the 2-minute deep read, and the fixes that would flip a pass to an interview.",
    tips: [
      { title: "Paste the full JD", body: "More JD detail = sharper simulation. Include responsibilities AND nice-to-haves." },
      { title: "Read the red flags first", body: "What hesitated the recruiter is usually one or two fixable things in your portfolio." },
      { title: "Apply the fixes, then re-run", body: "Edit in Admin, re-simulate, watch your callback odds climb." },
    ],
    cta: { label: "Open the Builder", href: "/admin" },
  }],
  ["/tools/quantify", {
    title: "Impact Quantifier",
    intro: "Turn vague resume bullets into measurable impact. Get 3 rewrites — conservative, bold, and data-heavy — so you can pick the tone that fits each application.",
    tips: [
      { title: "Add context", body: "Even rough numbers (\"weekly\", \"dozens\", \"~40% faster\") help AI ground the rewrites in reality instead of inventing." },
      { title: "Pick a variant per role", body: "Use 'data-heavy' for FAANG-style applications, 'bold' for startups, 'conservative' for govt/finance." },
      { title: "Mine the metrics list", body: "The 'numbers worth digging up' list points you at specific data to ask your manager for." },
    ],
    cta: { label: "Roast My Resume", href: "/tools/roast" },
  }],
  ["/tools/recruiter-reply", {
    title: "Recruiter Reply Generator",
    intro: "Paste a recruiter's outreach + pick your intent → get 3 polished reply drafts in different tones. No more freezing on LinkedIn DMs.",
    tips: [
      { title: "Paste the full message", body: "Include the recruiter's name, role details, and comp signal so AI can match their tone." },
      { title: "Be honest about intent", body: "'Not now' keeps the door open. 'Decline' closes it cleanly. Pick correctly." },
      { title: "Copy + personalize", body: "Use the draft as a starting point. Add 1-2 of your own touches before sending." },
    ],
    cta: { label: "Mock Interview prep", href: "/tools/interview" },
  }],
  ["/tools/company-prep", {
    title: "Company Interview Prep",
    intro: "Interview tomorrow? Paste a company name + role and AI builds you a one-page prep brief in 30 seconds — positioning, interview style, smart questions, talking points, red flags.",
    tips: [
      { title: "Paste any extras", body: "JD, About page, interviewer LinkedIn — anything you've pulled. AI uses it to make the brief sharper." },
      { title: "Memorize 2-3 smart questions", body: "Asking thoughtful questions is the highest-leverage signal you can send." },
      { title: "Watch the red flags", body: "If two or more appear during the interview, it's information about whether this role fits you." },
    ],
    cta: { label: "Mock Interview", href: "/tools/interview" },
  }],
  ["/tools/linkedin", {
    title: "LinkedIn Optimizer",
    intro: "Recruiter-magnet headline + About + bullets, ready to paste.",
    tips: [
      { title: "Set your target role", body: "AI optimizes for keywords recruiters search for that role." },
      { title: "Paste into LinkedIn", body: "Each section has a one-click copy with proper formatting." },
    ],
    cta: { label: "More tools", href: "/tools" },
  }],
  ["/tools/readme", {
    title: "GitHub README",
    intro: "A beautiful profile README, generated from your portfolio data.",
    tips: [
      { title: "Add to profile", body: "Create a repo named exactly like your GitHub username and paste in README.md." },
      { title: "Tweak the markdown", body: "Edit colors, badges, and stats before saving." },
    ],
    cta: { label: "More tools", href: "/tools" },
  }],
  ["/tools/skills", {
    title: "Skill Gap Analyzer",
    intro: "Target a role — AI shows the exact skills + projects you need to land it.",
    tips: [
      { title: "Be specific", body: "“Senior Frontend at Stripe” gets sharper results than “engineer”." },
      { title: "Pair with Project Ideas", body: "Generate project ideas that fill the highlighted gaps." },
    ],
    cta: { label: "Project Ideas", href: "/tools/projects" },
  }],
  ["/tools/salary", {
    title: "Salary Negotiator",
    intro: "Paste your offer — get a script and market data to push for more.",
    tips: [
      { title: "Include full comp", body: "Base + equity + bonus + signing. AI uses each piece in the script." },
      { title: "Practice in Mock Interview", body: "Use the negotiation script in a mock to build confidence." },
    ],
  }],
  ["/tools/projects", {
    title: "Project Idea Generator",
    intro: "Stop building TODO apps. Get ideas matched to your skill gaps and target role.",
    tips: [
      { title: "Filter by skill", body: "Pick the techs you want to practice — get ideas you'd actually ship." },
      { title: "Add to your portfolio", body: "Use the “Add to portfolio” button on any idea to scaffold it in the Builder." },
    ],
  }],
  ["/tools/tracker", {
    title: "Job Tracker",
    intro: "Track every application in one place — status, JD, contacts, follow-ups.",
    tips: [
      { title: "Add by JD URL", body: "AI pulls company + role automatically from the link." },
      { title: "Set a follow-up", body: "Tracker reminds you to follow up at the right moment." },
    ],
  }],
  ["/tools/coach", {
    title: "AI Coach",
    intro: "Open chat with an AI that knows your resume and career goals.",
    tips: [
      { title: "Ask anything", body: "Career advice, interview prep, resume questions — all grounded in your data." },
    ],
  }],
  ["/tools/cover-letter", {
    title: "Cover Letter",
    intro: "Personalized cover letter from your data + a job description.",
    tips: [
      { title: "Match the tone", body: "Pick formal, casual, or technical to match the company's vibe." },
    ],
    cta: { label: "Application Pack", href: "/tools/apply" },
  }],
  ["/tools", {
    title: "AI Toolkit",
    intro: "Nine focused tools for every step of the job hunt. Free with your own AI key.",
    tips: [
      { title: "Start in the Builder", body: "Most tools use your portfolio data — fill it in once, reuse everywhere." },
      { title: "Set your AI key", body: "Tools need an AI key. Free Groq or OpenRouter works." },
    ],
    cta: { label: "Setup help", href: "/help" },
  }],
  ["/preview", {
    title: "Live example portfolio",
    intro: "A real portfolio rendered from Hyred data so you can see the output before building yours.",
    tips: [
      { title: "All Hyred", body: "Every section here is generated from a Hyred portfolio JSON." },
      { title: "Make yours", body: "Click Start free to begin in the Builder with the same template." },
    ],
    cta: { label: "Start free", href: "/admin" },
  }],
  ["/deploy", {
    title: "Deploy your portfolio",
    intro: "One-click flows for Vercel, Netlify, or static export to any host.",
    tips: [
      { title: "Vercel is fastest", body: "Connect a GitHub account and deploy in 60 seconds — free tier is enough." },
      { title: "Custom domain", body: "Add your domain in the deploy panel — DNS instructions auto-generate." },
    ],
    cta: { label: "Deploy guide", href: "/help" },
  }],
  ["/contact", {
    title: "Get in touch",
    intro: "Real human, real reply — usually within a day.",
    tips: [
      { title: "Tell us what you tried", body: "Where it broke + what you expected = fastest fix." },
    ],
  }],
];

export function getPageHelp(pathname: string): PageHelp {
  for (const [prefix, help] of MAP) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) return help;
  }
  return DEFAULT;
}
