# Security Policy

Thank you for helping keep Hyred and its users safe.

## Supported versions

Hyred ships from `main`. Security fixes land on `main` and deploy to the demo site within 48 hours of merge.

| Version | Supported |
|---------|-----------|
| `main`  | ✅ Yes    |
| Older tagged releases | ❌ Please upgrade |

## Reporting a vulnerability

**Please do not open a public GitHub issue for security bugs.** A public report tells attackers about the issue before users can patch.

Use one of these private channels:

1. **GitHub Security Advisories** (preferred) — open a draft advisory at
   [github.com/Ritika8081/Hyred/security/advisories/new](https://github.com/Ritika8081/Hyred/security/advisories/new).
   Only the maintainers can see it.
2. **Email** — `hello@hyred.app` (or the maintainer's preferred address).

Please include:

- A clear description and impact
- Steps to reproduce (minimal proof-of-concept — please don't run live exploits against the demo)
- The affected route, file, or feature
- Your environment (browser, OS, Hyred commit SHA)
- Optional: a suggested fix

## What to expect

| Stage | Target time |
|-------|-------------|
| Acknowledgement | within **72 hours** |
| Initial triage + severity assessment | within **7 days** |
| Patch released + advisory published | within **30 days** (High/Critical) · **90 days** (Low/Medium) |

We'll credit you in the advisory unless you ask us not to.

## Scope

Hyred runs **entirely in the browser**. There is no backend service that holds user data. The interesting attack surface lives in:

- Anything under `src/lib/` that touches `localStorage`, hash-encoded share URLs, AI provider routing, or PDF parsing
- `src/components/` — XSS via user-controlled HTML, prototype pollution
- The build configuration (`next.config.ts`, GitHub Actions workflows)
- Any third-party dependency in `package.json`

### In scope

- XSS / DOM injection in user-controlled fields
- Leakage of API keys, portfolio data, or share-URL contents
- Prototype pollution, ReDoS, supply-chain issues in dependencies
- Authorization or integrity issues in the share-URL hash encoding
- Workflow / CI vulnerabilities (e.g., token leakage in GitHub Actions)
- Vulnerabilities in the bundled `pdfjs-dist` worker as we ship it

### Out of scope

- Issues requiring physical access to a victim's unlocked device
- Self-hosted deployments where the operator misconfigured CORS, CSP, or HTTPS
- Social-engineering attacks on maintainers
- DoS against the demo site that requires unrealistic traffic
- Vulnerabilities in a chosen AI provider (OpenAI, Groq, OpenRouter, Anthropic) — report those to the provider directly

## Safe harbor

We will not pursue legal action against good-faith research that:

- Respects user privacy and data
- Avoids destroying data or degrading the service for other users
- Gives us reasonable time to remediate before public disclosure
- Does not exfiltrate any data beyond what's needed to demonstrate the issue

If you're unsure, ask first via the private channels above.

## Hall of fame

We publicly credit researchers who responsibly disclose vulnerabilities (with their permission).

---

Thanks for helping keep Hyred safe.
