<div align="center">

# Hyred

### The open-source AI career toolkit.
### Portfolio + resume + ten job-hunt copilots — in your browser, on your terms.

<br/>

[![Live demo](https://img.shields.io/badge/▶_Live_demo-Hyred-0d9488?style=for-the-badge)](https://ritika8081.github.io/Hyred/)
[![License: MIT](https://img.shields.io/badge/License-MIT-84cc16.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-f97316.svg?style=for-the-badge)](#contributing)
[![Star this repo](https://img.shields.io/github/stars/Ritika8081/Hyred?style=for-the-badge&color=eab308)](https://github.com/Ritika8081/Hyred/stargazers)

![Next.js](https://img.shields.io/badge/Next.js_15-000?style=flat-square&logo=next.js&logoColor=white)
![React 19](https://img.shields.io/badge/React_19-149ECA?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![BYO AI Keys](https://img.shields.io/badge/Bring_Your_Own_AI-0d9488?style=flat-square)

<br/>

[**Live demo →**](https://ritika8081.github.io/Hyred/) &nbsp;·&nbsp; [Quick start](#quick-start) &nbsp;·&nbsp; [Tools](#the-ten-ai-tools) &nbsp;·&nbsp; [Contribute](#contributing) &nbsp;·&nbsp; [Roadmap](#roadmap)

</div>

---

## Why Hyred exists

Job hunting in 2026 is a stack of half-broken subscriptions:

- **Resume.io** charges \$16/month to download your own resume.
- **Rezi**'s AI gives generic bullets because it doesn't know who you are.
- **ChatGPT** rewrites text but won't ship a portfolio site.
- Every tool wants an account, a credit card, and your email forever.

Hyred is one app that **owns the whole loop** — paste your resume, AI tailors it, a live portfolio renders, and ten career tools help you land the offer. Your data stays in your browser. You bring your own AI key, or pay **once** to unlock hosted AI. Zero subscriptions.

> A single source of truth → a live portfolio, an ATS-tuned PDF, tailored cover letters, mock interviews, and salary scripts. Powered by AI you control.

---

## The promise

| Most builders | Hyred |
|---|---|
| Monthly fee just to export a PDF | **Free PDF export, forever** |
| Generic AI rewrites — same advice for everyone | AI reads **your** full portfolio. Every suggestion is grounded in your work |
| Resume only — you build the site yourself | One source of truth → portfolio + PDF + cover letters + interview prep |
| Server stores your data, third-party tracking | **Your data never leaves your browser.** No accounts. No tracking |
| Subscription stack while you job hunt | Free with your own AI key, or **\$9 once** for Pro |

---

## Quick start

**Requires:** Node 18+ &nbsp;·&nbsp; npm

```bash
git clone https://github.com/Ritika8081/Hyred.git
cd Hyred
npm install
npm run dev
```

Open **http://localhost:3000** → click **Start free** → paste your resume.

That's it. AI extracts your roles, skills, and projects. You have a recruiter-ready portfolio in about seven minutes.

> ⚡ **Switching between `dev` and `build`?** `npm run dev` auto-cleans the build cache for you — no `Cannot find module './XXX.js'` weirdness from Next.js static-export mode.

### Optional — connect AI

Open `/admin` → **AI Settings** → paste a key.

| Provider | Free tier | Get a key |
|---|---|---|
| **Groq** | Generous (recommended for students) | [console.groq.com](https://console.groq.com) |
| **OpenRouter** | Free models available (Gemini Flash) | [openrouter.ai](https://openrouter.ai) |
| **OpenAI** | Paid (best quality) | [platform.openai.com](https://platform.openai.com) |
| **Anthropic** | Paid (best for long context) | [console.anthropic.com](https://console.anthropic.com) |

🔒 Your key lives in `localStorage` and is sent **directly** to the provider you chose. No proxy, no logging, no Hyred server in the middle.

---

## What's inside

### The builder (`/admin`)

A real CMS that runs entirely in your browser.

- **Paste-to-portfolio** — drop a PDF or paste resume text; AI extracts every section
- **GitHub importer** — pulls your top repos with topics, stars, and language stats
- **Live preview** — see your portfolio render as you type
- **AI rewrite (✨)** on every field — bullets, summaries, project blurbs
- **17-point ATS score** with explanations for each gap
- **Theme picker** — 6 presets including the signature **Aurora** (teal → lime → apricot)
- **Auto-save** to `localStorage` with a one-time migration from legacy keys
- **Export / Import JSON** — your data is portable, forever

### The ten AI tools

| Tool | What it does | Route |
|---|---|---|
| 🔥 **Roast My Resume** | Brutally honest critique with a shareable card | `/tools/roast` |
| 🎯 **JD Matcher** | Paste a job description → match % + tailored bio | `/tools/match` |
| 📦 **Application Pack** | Cover letter + cold email + LinkedIn DM + thank-you, in one click | `/tools/apply` |
| ✉️ **Cover Letter** | Four tones, JD-specific | `/tools/cover-letter` |
| 🎤 **Mock Interview** | Questions from **your** resume, AI-graded answers | `/tools/interview` |
| 💼 **LinkedIn Optimizer** | Recruiter-magnet headline + About + experience bullets | `/tools/linkedin` |
| 🐙 **GitHub README** | Beautiful profile README from your portfolio data | `/tools/readme` |
| 📈 **Skill Gap Analyzer** | Target a role → exact skills + projects to land it | `/tools/skills` |
| 💰 **Salary Negotiator** | Script + market data from your offer letter | `/tools/salary` |
| 💡 **Project Ideas** | Portfolio projects matched to your skill gaps | `/tools/projects` |

All tools share one provider abstraction (`src/lib/ai.ts`) — adding a new one takes about an hour.

### The portfolio (`/preview`, `/about`, `/projects`, `/resume`, `/contact`)

A self-contained portfolio site rendered from the same data. Mobile-clean, ATS-friendly, fully styleable, one-click deployable to Vercel / Netlify / GitHub Pages.

### Everywhere

- **⌘K** command palette — jump to any page or tool
- **⌘/** contextual help drawer with per-page tips
- **Dark mode** (system-aware, no flash on load, full CSS-variable system)
- **WCAG-AA** focus rings, touch targets, reduced-motion respect
- **Safe-area-inset** support for notched / curved-edge devices

---

## The Aurora design system

Hyred ships its own restrained, premium design language:

- **Brand · Teal** `#0d9488 → #14b8a6` — the primary accent (confidence + growth)
- **Coral · Apricot** `#f97316 → #fb923c` — warm secondary
- **Lime accent** `#84cc16 → #a3e635` — electric pop, used sparingly
- **Aurora gradient** = teal → lime → apricot — appears **once per section** for signature moments (logo, headline italic, gradient-bordered "popular" cards, divider ribbons)

Most of the canvas is monochrome — type and whitespace do the work. The palette is wired through Tailwind tokens (`brand-*`, `coral-*`, `lime-*`) and CSS variables that swap automatically for dark mode.

```css
/* Drop-in utility classes for the signature moments */
.card-aurora      /* gradient-bordered card */
.chip-aurora      /* numbered step badge */
.divider-aurora   /* 1px gradient ribbon */
.brush-aurora     /* hand-painted underline behind a word */
.glow-aurora      /* halo on hover */
.aurora-orb       /* drifting background orb */
```

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  Browser (the only runtime)                                  │
│                                                              │
│   ┌─────────────────┐    ┌────────────────────────────────┐ │
│   │  Marketing zone │    │   Builder + AI tools zone      │ │
│   │  /, /pricing,   │    │   /admin, /build, /tools/*     │ │
│   │  /compare, etc. │    │                                │ │
│   └─────────────────┘    └────────────┬───────────────────┘ │
│           │                            │                     │
│           ▼                            ▼                     │
│   ┌──────────────────────────────────────────────────────┐  │
│   │  usePortfolioData() ── single source of truth        │  │
│   │  localStorage  +  hash-encoded share URLs (lz-string) │  │
│   └──────────────────────────────────────────────────────┘  │
│                              │                               │
│                              ▼                               │
│   ┌──────────────────────────────────────────────────────┐  │
│   │  src/lib/ai.ts                                       │  │
│   │   • Provider router (Groq / OpenRouter / OpenAI /    │  │
│   │     Anthropic)                                       │  │
│   │   • Direct fetch — key stays in the browser          │  │
│   │   • Streaming-ready, retry-aware                     │  │
│   └──────────────────────────────────────────────────────┘  │
│                                                              │
│                       (no Hyred server)                      │
└──────────────────────────────────────────────────────────────┘
```

**Key decisions:**

- **Static export.** `next.config.ts` runs `output: 'export'`. The whole app deploys as plain HTML/JS to any CDN. No serverless functions, no vendor lock-in.
- **No backend, on purpose.** Privacy is a feature. If Hyred shuts down tomorrow, your portfolio and data still work. Export JSON is one click.
- **Two zones, one shell.** A `getZone(pathname)` helper splits navigation/footer between the SaaS marketing site (Hyred) and the user's portfolio (their own brand). One product, infinite portfolios.
- **Singleton pub-sub for global UI** (help drawer, theme, command palette). Listeners are torn down on unmount; ref-counted body-scroll lock so multiple modals coexist safely.
- **Pre-hydration theme boot script** in `<head>` applies `.dark` to `<html>` before React hydrates. No flash of wrong theme. `suppressHydrationWarning` on `<body>` keeps React quiet about the legitimate mutation.

---

## Project structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing
│   ├── help/                     # Onboarding + searchable FAQ
│   ├── admin/                    # In-browser CMS
│   ├── build/                    # Builder (live preview + AI rewrite)
│   ├── tools/                    # AI toolkit — one folder per tool
│   ├── preview|about|projects|resume|contact/   # Public portfolio
│   ├── pricing|compare|reviews|deploy|unlock/   # Marketing
│   └── layout.tsx                # ThemeProvider + boot script + global shell
├── components/
│   ├── ui/                       # Buttons, cards, toasts, marquees
│   ├── marketing-hero.tsx        # Split hero + floating portfolio preview
│   ├── help-drawer.tsx           # Singleton, focus-trapped, scroll-locked
│   ├── help-fab.tsx              # Floating "Help" button (every page)
│   ├── theme-provider.tsx        # No-flash dark mode
│   └── …
├── hooks/
│   └── usePortfolioData.ts       # localStorage + share-URL hydration
├── lib/
│   ├── ai.ts                     # Provider routing + prompts
│   ├── ats.ts                    # 17-check ATS analysis
│   ├── page-help.ts              # Route → contextual help map
│   ├── monetization.ts           # Pricing + checkout config
│   └── storage-keys.ts           # localStorage keys + migration
├── data/portfolio.ts             # Default seed data
└── types/portfolio.ts            # Portfolio data model
```

---

## Add a new AI tool in five steps

Want to contribute a tool? Here's the recipe.

1. **Create the page** &nbsp;·&nbsp; `src/app/tools/your-tool/page.tsx`
2. **Wrap with `<ToolShell>`** for the consistent layout, AI key prompt, and Pro gating
3. **Write the prompt** &nbsp;·&nbsp; add a function to `src/lib/ai.ts` that calls `callAI({...})`
4. **Register on the toolkit page** &nbsp;·&nbsp; add an entry in `src/app/tools/page.tsx` + the landing's `TOOLS` array
5. **Add contextual help** &nbsp;·&nbsp; one entry in `src/lib/page-help.ts` and the help drawer picks it up

Open a PR with a screenshot. We'll ship it.

---

## Roadmap

- [ ] **Real-time collaboration** — share a portfolio link, get edits back like Figma comments
- [ ] **Plugin API** — let third parties ship tools (custom prompts + UI panel) without forking
- [ ] **i18n** — a locale layer; first translations: Spanish, Hindi, Portuguese
- [ ] **Resume version history** — diff your portfolio across applications
- [ ] **Browser extension** — auto-fill job applications from your Hyred data
- [ ] **Cover-letter A/B test analyzer** — paste two letters, get the recruiter-perspective verdict
- [ ] **Self-hosted backend (optional)** — OAuth save to your own Postgres for team/agency mode
- [ ] **More ATS rules** — industry-specific (FAANG, biotech, finance) and locale-specific (UK / EU)
- [ ] **Mobile builder** — full-fledged editing on a phone, not just preview

[Open an issue](https://github.com/Ritika8081/Hyred/issues/new) to claim one or propose your own.

---

## Contributing

Hyred is **maintainer-friendly by design**. Small, focused PRs ship in days, not weeks.

### Good first issues

- **New AI tool** → see the [recipe above](#add-a-new-ai-tool-in-five-steps)
- **New ATS rule** → `src/lib/ats.ts` — one function, one entry in the rules array
- **A11y polish** → keyboard navigation, ARIA labels, contrast nits
- **Empty states** → friendlier copy + illustrations in the Builder
- **i18n scaffolding** → extract inline strings, add a locale resolver
- **README screenshots / GIFs** — show the product in motion
- **A new help-drawer entry** in `src/lib/page-help.ts` — pure data, no code

### Workflow

```bash
git checkout -b feat/your-thing
npm run dev          # auto-cleans the build cache
# ...make your change, click through it...
npm run build        # final sanity check
git commit -m "feat: your thing"
git push origin feat/your-thing
```

Then [open a PR](https://github.com/Ritika8081/Hyred/compare). One feature per PR. Screenshots for UI changes. Tell us **why** in the description — the *what* is in the diff.

### Code conventions

- **TypeScript strict.** No `any` unless you genuinely can't avoid it.
- **Client components where hooks live.** Server components everywhere else.
- **Reuse `usePortfolioData()`** and existing managers — don't fork state.
- **Tailwind classes inline.** No CSS-in-JS, no styled-components.
- **Dark variants on every interactive surface** — `bg-*` always paired with `dark:bg-*`.
- **Touch targets ≥ 44px** on mobile (already enforced globally for buttons via `pointer: coarse`).

Don't commit API keys, Stripe URLs with live secrets, or `.env` files. The `.gitignore` covers most of it; a manual check on `git diff --cached` before pushing is cheap insurance.

---

## Privacy & security

- **No accounts, no tracking, no cookies** beyond browser-local storage
- **API keys live in your browser** — sent directly to the provider you chose
- **Static export** means nothing executes on a server
- **Export JSON** any time → your full portfolio data, portable forever
- **Self-host the whole thing** in 60 seconds:

```bash
git clone https://github.com/Ritika8081/Hyred.git
cd Hyred && npm install && npm run build
# Deploy /out to Vercel, Netlify, GitHub Pages, S3, or any static host
```

---

## Deploying

| Target | Instructions |
|---|---|
| **GitHub Pages** | Push to `main` — the included workflow under `.github/workflows/` builds and deploys. Edit `basePath` in `next.config.ts` to match your repo name |
| **Vercel** | Import the repo → defaults work. Set `NEXT_PUBLIC_BASE_PATH=""` in env |
| **Netlify** | Connect repo, `npm run build`, publish directory `out` |
| **Self-hosted** | `npm run build` → upload `out/` to any static host |

Detailed walkthroughs in [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## Community

- **Discussions** — [github.com/Ritika8081/Hyred/discussions](https://github.com/Ritika8081/Hyred/discussions) (questions, ideas, show-and-tell)
- **Issues** — [github.com/Ritika8081/Hyred/issues](https://github.com/Ritika8081/Hyred/issues) (bugs, feature requests)
- **Built a tool?** Open a PR — we'll add it to the gallery on `/tools`

---

## Star history

If Hyred saved you from a \$16/mo subscription or helped land an interview, **a star helps others find it** — and motivates the maintainers to keep shipping.

[![Star History Chart](https://api.star-history.com/svg?repos=Ritika8081/Hyred&type=Date)](https://star-history.com/#Ritika8081/Hyred&Date)

---

## Acknowledgements

Standing on the shoulders of:

- **Next.js**, **React**, **TypeScript** — the platform
- **Tailwind CSS** + **Framer Motion** — the look and the motion
- **Lucide** — the icon set
- **pdfjs-dist** — the in-browser PDF parser
- **Linear**, **Vercel**, **Cursor** — design inspirations for restraint

---

## License

**MIT.** Use it, fork it, ship it. If you build something cool with it, [tell us](https://github.com/Ritika8081/Hyred/discussions) — we'd love to feature it.

<br/>

<div align="center">

**Built for job seekers who'd rather ship than subscribe.**

[⭐ Star the repo](https://github.com/Ritika8081/Hyred) &nbsp;·&nbsp; [▶ Try the demo](https://ritika8081.github.io/Hyred/) &nbsp;·&nbsp; [💬 Discussions](https://github.com/Ritika8081/Hyred/discussions) &nbsp;·&nbsp; [📬 Open an issue](https://github.com/Ritika8081/Hyred/issues)

</div>
