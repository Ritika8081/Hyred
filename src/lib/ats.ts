import { Portfolio } from "@/types/portfolio";

export interface ATSCheck {
  id: string;
  label: string;
  pass: boolean;
  weight: number; // 1-10
  hint?: string;
}

export interface ATSReport {
  score: number; // 0-100
  checks: ATSCheck[];
  level: "weak" | "ok" | "good" | "excellent";
}

const ACTION_VERBS = [
  "built", "shipped", "designed", "led", "owned", "scaled", "optimized", "reduced",
  "increased", "implemented", "delivered", "developed", "architected", "automated",
  "launched", "migrated", "refactored", "improved", "drove", "managed", "created",
  "founded", "spearheaded", "orchestrated", "engineered", "deployed",
];

const QUANT_RE = /\d+(\.\d+)?\s*(%|x|k|m|users|requests|ms|seconds?|minutes?|hours?|days?|weeks?|months?|years?|members|teams?|projects?|prs?|pull requests?|commits?|stars?|downloads?)/i;

function countActionVerbs(text: string): number {
  const lower = text.toLowerCase();
  return ACTION_VERBS.reduce((acc, v) => (lower.includes(v) ? acc + 1 : acc), 0);
}

function hasQuant(text: string): boolean {
  return QUANT_RE.test(text);
}

export function analyzeATS(p: Portfolio): ATSReport {
  const checks: ATSCheck[] = [];

  // 1. Name + title set
  checks.push({
    id: "name",
    label: "Full name + professional title set",
    pass: !!(p.personalInfo.name && p.personalInfo.title),
    weight: 8,
    hint: "Both are required for recruiter search.",
  });

  // 2. Email
  checks.push({
    id: "email",
    label: "Email contact present",
    pass: /\S+@\S+\.\S+/.test(p.contact.email || ""),
    weight: 10,
    hint: "Recruiters can't reach you without it.",
  });

  // 3. Location
  checks.push({
    id: "location",
    label: "Location specified",
    pass: !!p.contact.location && p.contact.location.length > 1,
    weight: 5,
    hint: "Helps with location-based filtering.",
  });

  // 4. LinkedIn or GitHub
  checks.push({
    id: "social",
    label: "LinkedIn or GitHub linked",
    pass: !!(p.contact.linkedin || p.contact.github),
    weight: 7,
    hint: "Recruiters always check these.",
  });

  // 5. Bio length
  const bioLen = (p.personalInfo.bio || "").length;
  checks.push({
    id: "bio",
    label: "Bio between 100 and 600 characters",
    pass: bioLen >= 100 && bioLen <= 600,
    weight: 7,
    hint: bioLen < 100 ? "Bio too short — add more context." : "Bio too long — trim to 600 chars.",
  });

  // 6. Resume file URL
  checks.push({
    id: "resume",
    label: "Downloadable resume URL set",
    pass: !!p.personalInfo.resume,
    weight: 6,
    hint: "Some recruiters still want the PDF.",
  });

  // 7. Highlights
  checks.push({
    id: "highlights",
    label: "3 hero highlights set",
    pass: !!(p.personalInfo.highlights && p.personalInfo.highlights.length >= 3),
    weight: 8,
    hint: "Recruiters scan in seconds — these are the fastest signal.",
  });

  // 8. At least 1 experience
  checks.push({
    id: "experience",
    label: "At least one work experience",
    pass: p.experience.length >= 1,
    weight: 9,
    hint: "Even an internship or freelance counts.",
  });

  // 9. Achievements per experience
  const expWithAchievements = p.experience.filter(e => e.achievements.length >= 2);
  checks.push({
    id: "achievements",
    label: "Each role lists 2+ achievements",
    pass: p.experience.length > 0 && expWithAchievements.length === p.experience.length,
    weight: 8,
    hint: "Bullets convert better than paragraphs.",
  });

  // 10. Quantified achievements
  const allAchievements = p.experience.flatMap(e => e.achievements).join(" ");
  checks.push({
    id: "quantified",
    label: "Achievements include numbers/metrics",
    pass: hasQuant(allAchievements),
    weight: 9,
    hint: "Use numbers: %, X faster, N users, etc.",
  });

  // 11. Action verbs
  const verbCount = countActionVerbs(allAchievements + " " + p.experience.map(e => e.description).join(" "));
  checks.push({
    id: "verbs",
    label: "Strong action verbs in experience",
    pass: verbCount >= 3,
    weight: 7,
    hint: "Built, shipped, led, scaled, etc.",
  });

  // 12. Skills coverage
  checks.push({
    id: "skills",
    label: "At least 8 skills listed",
    pass: p.skills.length >= 8,
    weight: 6,
    hint: "Recruiters search by skill name.",
  });

  // 13. At least 3 projects
  checks.push({
    id: "projects",
    label: "3+ projects in portfolio",
    pass: p.projects.length >= 3,
    weight: 7,
    hint: "Shows breadth.",
  });

  // 14. Featured projects
  checks.push({
    id: "featured",
    label: "At least one featured project",
    pass: p.projects.some(pr => pr.featured),
    weight: 5,
    hint: "Mark your best work as featured.",
  });

  // 15. Project impact
  const withImpact = p.projects.filter(pr => pr.impact && pr.impact.length > 5).length;
  checks.push({
    id: "impact",
    label: "Featured projects describe measurable impact",
    pass: withImpact >= Math.min(2, p.projects.filter(pr => pr.featured).length),
    weight: 8,
    hint: "Add the 'Impact' field on your top projects.",
  });

  // 16. Education
  checks.push({
    id: "education",
    label: "At least one education entry",
    pass: p.education.length >= 1,
    weight: 4,
    hint: "Even bootcamps count.",
  });

  // 17. Testimonials (bonus)
  checks.push({
    id: "testimonials",
    label: "At least one testimonial (recruiter trust signal)",
    pass: !!(p.testimonials && p.testimonials.length >= 1),
    weight: 5,
    hint: "Ask a manager or mentor on LinkedIn.",
  });

  // Score
  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const earned = checks.reduce((s, c) => s + (c.pass ? c.weight : 0), 0);
  const score = Math.round((earned / totalWeight) * 100);

  let level: ATSReport["level"] = "weak";
  if (score >= 90) level = "excellent";
  else if (score >= 75) level = "good";
  else if (score >= 50) level = "ok";

  return { score, checks, level };
}
