import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://hyred.app"; // change to your real production domain

const ROUTES = [
  "",
  "/preview",
  "/about",
  "/projects",
  "/contact",
  "/resume",
  "/help",
  "/deploy",
  "/build",
  "/tools",
  "/tools/recruiter-view",
  "/tools/quantify",
  "/tools/recruiter-reply",
  "/tools/company-prep",
  "/tools/roast",
  "/tools/match",
  "/tools/cover-letter",
  "/tools/interview",
  "/tools/readme",
  "/tools/linkedin",
  "/tools/apply",
  "/tools/tracker",
  "/tools/coach",
  "/tools/skills",
  "/tools/salary",
  "/tools/projects",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map(path => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1.0 : path.startsWith("/tools") ? 0.8 : 0.6,
  }));
}
