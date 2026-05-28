# Decora

Nigeria's first AI-powered interior design platform.

Photo of a room → AI-generated, Nigerian-styled redesign → itemised Naira budget → tap to buy from local suppliers → share to WhatsApp.

---

## Quickstart

```bash
# Prereqs: Node 20+, pnpm 9+, Python 3.11+, Docker
git clone https://github.com/Dynamic-AI-Innovations/Decora.git
cd Decora
pnpm install
cp .env.example .env.local       # fill in from 1Password vault
pnpm dev:infra                   # local postgres + redis
pnpm db:reset                    # apply migrations + seed
pnpm dev                         # web (3000), ai-service (8000), mobile metro
```

Full engineering blueprint: [docs/BUILD.md](docs/BUILD.md).

---

## Repo layout

```
apps/
  web/          Next.js 14 (App Router) — consumer web app
  mobile/       Expo / React Native — iOS + Android
  ai-service/   FastAPI — render pipeline + workers
packages/
  shared-types/   zod schemas shared everywhere
  design-tokens/  colours, type, spacing (web + mobile)
  ui/             shared components
  api-client/     typed client for the Next.js API
  prompts/        Nigerian style-prompt library (the IP)
  pricing/        Naira utilities + price catalogue helpers
supabase/         migrations, seed, edge functions
infra/            Vercel, Railway, Cloudflare config
docs/             BUILD.md, ADRs, OPEN_QUESTIONS.md
.claude/agents/   product-design · architecture · development · qa
```

---

## The four agents

V1.0 is built with four specialised AI agents:

| Agent | Owns |
|---|---|
| `product-design` | `docs/DESIGN.md`, design system, flows, copy, accessibility |
| `architecture` | `docs/ARCHITECTURE.md`, ADRs, schema, contracts, scaling |
| `development` | the code: features end-to-end against the spec, with tests |
| `qa` | `docs/QA.md`, test plans, regression suites, NDPR audits |

Definitions in [.claude/agents/](.claude/agents/). Invoke per-slice — don't run them all on the same task.

---

## North star

**Time-to-first-WhatsApp-share** — new user opens the app → shares their first AI-generated redesign on WhatsApp. Target: **under 4 minutes** on 4G.

---

© Dynamic AI Innovations · Internal · Not for distribution.
