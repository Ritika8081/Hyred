import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://hyred.io"; // change to your real production domain

const ROUTES = [
  "",
  "/preview",
  "/about",
  "/projects",
  "/contact",
  "/resume",
  "/pricing",
  "/reviews",
  "/compare",
  "/deploy",
  "/unlock",
  "/build",
  "/tools",
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
