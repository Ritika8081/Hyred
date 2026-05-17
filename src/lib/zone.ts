// Determines which "zone" of the app the current path belongs to.
//
// Zone 1 — Hyred app (marketing + builder + tools):  /, /tools, /help, /build, /admin, /deploy
// Zone 2 — User's portfolio (rendered output):        /preview, /about, /projects, /resume, /contact

export type Zone = "hyred" | "portfolio";

const PORTFOLIO_PREFIXES = ["/preview", "/about", "/projects", "/resume", "/contact"];

export function getZone(pathname: string | null | undefined): Zone {
  if (!pathname) return "hyred";
  for (const p of PORTFOLIO_PREFIXES) {
    if (pathname === p || pathname.startsWith(p + "/")) return "portfolio";
  }
  return "hyred";
}

export function isPortfolioRoute(pathname: string | null | undefined): boolean {
  return getZone(pathname) === "portfolio";
}

export function isHyredRoute(pathname: string | null | undefined): boolean {
  return getZone(pathname) === "hyred";
}
