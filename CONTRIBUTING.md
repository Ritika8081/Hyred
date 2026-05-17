# Contributing to Hyred

Thank you. Whether it's a typo fix, a new AI tool, or an accessibility nit — every contribution makes Hyred better for the next person job-hunting.

By participating, you agree to the [Code of Conduct](./CODE_OF_CONDUCT.md). Security issues go through [SECURITY.md](./SECURITY.md), not public issues.

---

## Ways to contribute

You don't have to write code to help.

| Type | Examples |
|------|----------|
| **Bug reports** | Something broken in the builder, a tool returning weird AI output, a UI glitch on a specific browser |
| **Feature requests** | A new AI tool, a new ATS check, a new theme, a deployment target |
| **Code** | Fix a bug, add a tool, improve performance, write tests |
| **Docs** | Clarify the README, add screenshots, translate help drawer content |
| **Design** | UI polish, a new theme preset, illustrations for empty states |
| **A11y** | Keyboard nav, ARIA labels, contrast, reduced-motion bugs |
| **Triage** | Reproduce open issues, ask clarifying questions, label them |
| **Show-and-tell** | Built something with Hyred? Post in [Discussions](https://github.com/Ritika8081/Hyred/discussions) |

If you're new to open source, look for issues tagged [`good first issue`](https://github.com/Ritika8081/Hyred/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) or [`help wanted`](https://github.com/Ritika8081/Hyred/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22).

---

## Before you start

For anything bigger than a typo, **open an issue first** (or comment on an existing one) so we can scope it together.

- **Discussion** — open-ended questions, ideas, "should we…", show-and-tell
- **Issue** — concrete bug or feature with a clear definition of done

---

## Dev environment

**Requires:** Node 18+ &nbsp;·&nbsp; npm

```bash
git clone https://github.com/<your-username>/Hyred.git
cd Hyred
npm install
npm run dev          # starts on http://localhost:3000 (auto-cleans build cache)
```

Hyred uses `output: 'export'` in `next.config.ts`. The `predev` script auto-cleans `.next/` to avoid `Cannot find module './XXX.js'` errors caused by mixing prod and dev caches.

### Scripts

```bash
npm run dev          # dev server with auto-clean
npm run dev:clean    # explicit clean + dev
npm run build        # production build (also auto-cleans)
npm run clean        # wipe .next, out, tsconfig.tsbuildinfo
npm run lint         # ESLint, autofix
```

### Optional: AI key for testing tools

Most tools call out to an AI provider. For local development:

- **Groq** — [console.groq.com](https://console.groq.com) (recommended, fast free tier)
- **OpenRouter** — [openrouter.ai](https://openrouter.ai) (free Gemini Flash)

Paste the key in `/admin` → **AI Settings**. Keys live in your browser's `localStorage`.

---

## Branch + commit conventions

```bash
git checkout -b feat/your-thing      # new feature
git checkout -b fix/your-thing       # bug fix
git checkout -b docs/your-thing      # documentation
git checkout -b refactor/your-thing  # code restructure, no behavior change
git checkout -b chore/your-thing     # build, CI, deps
```

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) loosely:

```
feat: add salary negotiator empty state
fix: prevent help drawer from closing on initial mount
docs: clarify BYO AI key flow in the README
refactor: extract VoiceInput from interview page
chore: bump next to 15.5.9
```

One commit per logical change. Squash noise commits before opening the PR.

---

## Pull request checklist

- [ ] Branch is up to date with `main`
- [ ] `npm run dev` — clicked through your change manually
- [ ] `npm run build` — passed
- [ ] No `console.log`, `debugger`, dead code, or committed secrets
- [ ] One feature or fix per PR
- [ ] Screenshots for UI changes
- [ ] PR description explains **why**, not just **what**

### What reviewers look for

- Does it solve the stated problem?
- Does it match existing patterns?
- Mobile + tablet + desktop OK?
- Light AND dark mode OK?
- Keyboard navigation + a11y intact?
- No unnecessary new dependencies?

First feedback usually within 3 working days.

---

## Code style

### TypeScript

- **No `any`** unless unavoidable. Prefer `unknown` + a type guard.
- Public functions exported from `src/lib/` get explicit return types.
- React components: `interface` for props.

### React + Next.js (App Router)

- **Server components** by default. `"use client"` only when needed.
- Hooks in `src/hooks/`. Extend `usePortfolioData()` instead of forking state.
- Shared UI primitives in `src/components/ui/`.
- Tool pages live under `src/app/tools/<name>/page.tsx`, wrap with `<ToolShell>`.

### Tailwind

- Classes inline. No CSS-in-JS.
- **Every interactive surface needs a dark variant** — `bg-*` always paired with `dark:bg-*`.
- Use brand tokens (`brand-*`, `coral-*`, `lime-*`) for accent moments.
- Touch targets ≥ 44px on mobile (globally enforced for `<button>` via `pointer: coarse`).

### Naming

- Components: `kebab-case.tsx` (`help-drawer.tsx`)
- Hooks: `useXxx.ts`
- Pages: Next.js App Router (`page.tsx`, `layout.tsx`)
- Imports grouped: React/Next → third-party → local (`@/`) → relative

### Comments

Default to no comments. Add one only when **why** is non-obvious — a hidden constraint, a workaround, a subtle invariant.

---

## Recipes

### Add a new AI tool in five steps

1. **Page** &nbsp;·&nbsp; `src/app/tools/your-tool/page.tsx` — wrap with `<ToolShell>`
2. **AI function** &nbsp;·&nbsp; add to `src/lib/ai.ts` — call `chat(messages, config)`, parse JSON defensively
3. **Wire it** &nbsp;·&nbsp; call from a button handler with `loadAIConfig()`
4. **Register** &nbsp;·&nbsp; add to the `TOOLS` array in `src/app/tools/page.tsx`
5. **Help** &nbsp;·&nbsp; one entry in `src/lib/page-help.ts` and the help drawer picks it up automatically

Open a PR with a screenshot. We'll ship it.

### Add a new ATS check

Open `src/lib/ats.ts`. Add a rule:

```ts
{
  id: "your-check",
  title: "Brief, scannable title",
  weight: 5,                          // 1–10
  test: (portfolio) => boolean,       // pass = true
  hint: "What to do if you fail",
}
```

### Add a help drawer entry

Open `src/lib/page-help.ts`. Add a `[prefix, PageHelp]` entry. No other code changes needed.

### Add a new theme preset

Open `src/components/theme-picker.tsx`. Add to the `PRESETS` array with `accent`, `gradientFrom`, `gradientTo` hexes. Test it on `/preview`.

---

## Performance + a11y bar

PRs should not regress:

- **Lighthouse Performance ≥ 90** on the landing page
- **Lighthouse Accessibility = 100**
- **First contentful paint ≤ 1.5s** on throttled 4G
- **Keyboard navigable** — every interactive element reachable + visible focus ring
- **Reduced-motion** respected (wired globally via `prefers-reduced-motion`)

New heavy dependencies need justification in the PR description.

---

## License

Hyred is **MIT-licensed**. By contributing, you agree your contributions are licensed under the same terms.

If your employer has IP-assignment terms that might affect your contribution, please check with them first.

---

## Where to find us

- **Issues** — [github.com/Ritika8081/Hyred/issues](https://github.com/Ritika8081/Hyred/issues)
- **Discussions** — [github.com/Ritika8081/Hyred/discussions](https://github.com/Ritika8081/Hyred/discussions)
- **Security** — [SECURITY.md](./SECURITY.md) (private channel)

Thanks again. Welcome aboard.
