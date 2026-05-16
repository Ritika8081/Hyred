# Hyred

**Build a job-winning portfolio and resume in one place — powered by AI you control.**

Hyred is an open-source career toolkit: paste or upload a resume, polish every field with AI, run 12+ job-hunt tools (roast, JD match, mock interview, and more), and ship a live portfolio recruiters can actually open. No monthly lock-in for downloads. Bring your own API key and stay free forever, or unlock Pro features with a one-time payment.

[Live demo](https://ritika8081.github.io/Hyred/) · [Report a bug](https://github.com/Ritika8081/Hyred/issues) · [Request a feature](https://github.com/Ritika8081/Hyred/issues/new)

---

## Why Hyred?

| The usual pain | What Hyred does |
|----------------|-----------------|
| Resume builders charge monthly just to export PDFs | PDF export stays free |
| Generic AI that doesn’t know your experience | Tools read **your** portfolio data — every suggestion is personal |
| ChatGPT rewrites text but won’t build your site | Resume + portfolio from the **same** data |
| Subscription fatigue while job hunting | Free tier with your own key, or **$9 once** for Pro |

---

## What you get

### Portfolio builder (`/build`)
- Paste resume text or drop a PDF — AI extracts roles, skills, and projects
- Auto-save in the browser with a one-time migration from legacy storage keys
- Live preview, 6 themes, drag-and-drop images, shareable portfolio URL (lz-string hash)
- **ATS score** panel with 17 checks
- GitHub repo importer, Cmd+K command palette, confetti on save

### 12 AI career tools (`/tools/*`)
All tools route through `src/lib/ai.ts` and support **BYO keys** (OpenAI, Groq, OpenRouter, Anthropic):

| Tool | What it does |
|------|----------------|
| Roast My Resume | Shareable brutal critique card |
| JD Matcher | Match % + tailored bio for any job description |
| Application Pack | Cover letter, cold email, LinkedIn DM, thank-you — one click |
| Cover Letter Generator | 4 tones, job-specific |
| Mock Interview | Questions from **your** resume + scored answers |
| LinkedIn Optimizer | Headline, About, experience bullets |
| GitHub README Builder | Profile README from portfolio data |
| Skill Gap Analyzer | Learn/build plan for your target role |
| Salary Negotiator | Script + talking points from your offer |
| Project Idea Generator | Portfolio projects matched to your gaps |
| Application Tracker | Kanban job hunt board *(Pro)* |
| AI Career Coach | Mentor that has read your resume *(Pro)* |

### Your public portfolio
Routes under `/preview`, `/about`, `/projects`, `/resume`, `/contact` — separate from the marketing/SaaS shell so you can ship one product and many portfolios.

### Admin without leaving the browser
- `Ctrl+Shift+A` (or `Cmd+Shift+A`), type `admin`, visit `/admin`, or use the footer gear
- Edit personal info, projects, skills, experience, education
- Export/import JSON backups

---

## Quick start

**Requirements:** Node.js 18+

```bash
git clone https://github.com/Ritika8081/Hyred.git
cd Hyred
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), go to **Build**, and paste a resume — or hit `/admin` to edit by hand.

### AI setup (optional but recommended)
1. Open any tool under `/tools`
2. Add an API key from OpenAI, Groq, OpenRouter, or Anthropic
3. Keys stay in **your browser** (localStorage) — never sent to a Hyred server

Free tier: limited AI calls per day (`src/lib/monetization.ts`). Pro unlocks more via `/unlock`.

### Production build

```bash
npm run build
```

Static export is configured for GitHub Pages (`basePath: /Hyred` in production). See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel, Netlify, and GitHub Pages details.

---

## Project structure

```
src/
├── app/
│   ├── page.tsx              # Marketing home
│   ├── build/                # Portfolio builder
│   ├── tools/                # AI toolkit (roast, match, interview, …)
│   ├── preview|about|projects|resume|contact/   # Public portfolio zone
│   └── admin/                # In-browser CMS
├── components/               # UI, builder, managers, tool shells
├── hooks/usePortfolioData.ts # Client-side portfolio state
├── lib/
│   ├── ai.ts                 # Provider routing + prompts
│   ├── ats.ts                # ATS checks
│   ├── monetization.ts       # Pricing + checkout URLs
│   └── storage-keys.ts       # localStorage keys + migration
├── data/portfolio.ts         # Default seed data
└── types/portfolio.ts
```

---

## Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** + **Framer Motion**
- **pdfjs-dist** (same-origin worker via `scripts/copy-pdf-worker.mjs`)
- Static export — deploy anywhere (GitHub Pages, Vercel, Netlify)

---

## Contributing

We’d love your help. Whether you’re fixing a typo, adding a tool, or improving accessibility — all contributions are welcome.

### Good first contributions
- **New AI tool** — add a page under `src/app/tools/`, wire prompts in `src/lib/ai.ts`, list it on `/tools`
- **ATS rules** — more checks in `src/lib/ats.ts`
- **UI polish** — themes, mobile layout, empty states
- **Docs** — clearer tooltips, deployment notes, screenshots in this README
- **Accessibility** — keyboard nav, ARIA labels, contrast
- **i18n** — strings are mostly inline today; a locale layer would be a big win

### Before you open a PR
1. Fork the repo and create a branch: `git checkout -b feat/your-feature`
2. Run locally: `npm run dev` and click through your change
3. Lint: `npm run lint:check`
4. **Do not** commit API keys, Stripe URLs with live secrets, or `.env` files
5. Keep PRs focused — one feature or fix per PR
6. Describe *what* and *why* in the PR; add screenshots for UI changes

### Code conventions
- Match existing patterns (client components where hooks are used, shared UI in `src/components/ui/`)
- Imports at the top of the file (PEP 8–style grouping: std → third-party → local)
- Prefer extending `usePortfolioData` and existing managers over duplicating state

Questions? Open a [Discussion](https://github.com/Ritika8081/Hyred/discussions) or an [Issue](https://github.com/Ritika8081/Hyred/issues).

---

## Roadmap ideas (pick one and ship it)

- [ ] More ATS checks and industry-specific templates
- [ ] OAuth save (Google Drive / Notion) instead of only localStorage
- [ ] Real backend for team/agency mode
- [ ] Plugin API for third-party tools
- [ ] Dark mode per theme in the builder

Have another idea? [Open an issue](https://github.com/Ritika8081/Hyred/issues/new) and we can scope it together.

---

## Star history

If Hyred helped your job search, consider **starring the repo** — it helps others discover the project and motivates maintainers.

---

## License

Open source. See repository license file for terms. If none is present yet, treat contributions as MIT-compatible unless the maintainer specifies otherwise.

---

<p align="center">
  Built with care for job seekers who’d rather ship than subscribe.<br/>
  <a href="https://github.com/Ritika8081/Hyred">GitHub</a> · <a href="/build">Try the builder</a> · <a href="/tools">Explore tools</a>
</p>
