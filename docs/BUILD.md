# Decora — Build Blueprint

**Nigeria's first AI-powered interior design platform.**
Photo in → photorealistic, Nigerian-styled redesign out → itemised Naira budget → one-tap path to buy from local suppliers.

> This document is the source of truth for engineers building V1.0. If something here disagrees with the Master Plan, the Master Plan wins on **product intent**, this doc wins on **execution detail**. When in doubt, write the question down in `OPEN_QUESTIONS.md` and ship anyway.

---

## 1. North Star

One number we are optimising for in V1.0:

> **Time-to-first-WhatsApp-share** — from a new user opening the app to them sharing their first AI-generated redesign on WhatsApp.

Target: **under 4 minutes**, on a 4G connection, on a mid-range Android.

Every product, design, architecture and engineering decision in V1.0 must shorten that loop or be cut.

---

## 2. What We Are Building (V1.0 Only)

A user can:

1. Sign up (Google OAuth or email/password) and complete a 3-question taste quiz.
2. Take or upload a photo of a single room.
3. See the AI detect the room (`Living Room · ~4m × 5m · Sofa, 2 chairs, TV unit`) and confirm.
4. Pick one of **8 Nigerian-aware design styles**.
5. Enter a Naira budget (quick-select ₦100K / ₦250K / ₦500K / ₦1M / ₦2M+, or custom).
6. Wait <90 seconds and receive **3 photorealistic redesign variants** that preserve the room's walls, windows and doors.
7. See an itemised Naira budget breakdown next to the render — every item linked to a Jumia/Konga affiliate match (tracked).
8. Save, download, share to WhatsApp, share to IG Stories.
9. Upgrade their plan via Paystack (card / transfer / USSD).

Anything not in this list is **V2 or later**. Don't build it.

---

## 3. Out of Scope for V1.0

These are explicitly *not* being built first. Don't sneak them in.

- Video upload (V2)
- Floor plan / architectural drawing upload (V2)
- AR preview (V2)
- Item-level swap / individual-object editing (V2)
- B2B client portal, white-label PDFs, team seats (V2)
- Real-time multi-user collaboration (V3)
- Full in-app vendor marketplace / vendor CMS (V3)
- Custom furniture / artisan matching (V3)
- Pidgin UI (V2 — design for it now, don't translate yet)

---

## 4. Tech Stack — Decided

| Layer | Choice | Reason |
|---|---|---|
| Web frontend | **Next.js 14** (App Router) | SSR for first paint on 3G/4G, image optimisation, edge CDN |
| Mobile | **React Native + Expo** | One codebase iOS+Android; camera & share built-in |
| Styling | **Tailwind CSS** | Velocity, consistent, low-bundle |
| State (client) | **Zustand** | Lightweight, no Redux ceremony |
| Server state | **TanStack Query** | Cache, retry, polling for AI jobs |
| API (V1) | **Next.js Route Handlers** | No separate server until traffic demands it |
| AI service | **Python + FastAPI** | Replicate/Claude/SDXL ecosystem is Python-native |
| Job queue | **BullMQ + Upstash Redis** | AI renders are 30–90s; never block HTTP |
| Database | **Supabase (Postgres)** | DB + Auth + Storage + Realtime in one |
| Object storage | **Supabase Storage** + Cloudflare CDN | Lagos PoP, WebP delivery |
| Payments | **Paystack** (primary), **Flutterwave** (failover) | Nigerian cards / transfer / USSD |
| LLM | **Claude API** (Sonnet 4.6 for prod, Haiku 4.5 for cheap analysis) | Best Nigerian-context reasoning |
| Image gen | **Replicate** — SDXL + ControlNet | Managed GPUs, structural fidelity, pay-per-render |
| Analytics | **PostHog** (self-hostable) | Funnels, NDPR-friendly |
| Errors | **Sentry** | Frontend + backend |
| Hosting (web) | **Vercel** | Zero-config Next.js, global edge |
| Hosting (AI svc) | **Railway** or **Render** | Managed Python with autoscale |

**Decisions that are not up for re-debate in V1.0:** Next.js, Supabase, Paystack, Replicate (SDXL+ControlNet), Claude, BullMQ. Re-opening these costs a week.

---

## 5. Repo Layout

We ship V1.0 as a **monorepo** (pnpm workspaces). Splitting is cheap later; merging is not.

```
decora/
├── apps/
│   ├── web/                  # Next.js 14 — user-facing web app
│   ├── mobile/               # Expo / React Native — iOS + Android
│   └── ai-service/           # FastAPI — render pipeline & workers
├── packages/
│   ├── ui/                   # Shared design-system components (web + RN where possible)
│   ├── design-tokens/        # colours, type, spacing, motion — single source
│   ├── api-client/           # Typed client for the Next.js API (zod + fetch)
│   ├── prompts/              # Nigerian style-prompt library (THIS IS THE MOAT)
│   ├── pricing/              # Naira price-catalogue helpers + tier logic
│   └── shared-types/         # zod schemas shared across web/mobile/AI
├── supabase/
│   ├── migrations/           # SQL migrations, version-controlled
│   ├── seed.sql              # Style cards, sample price catalogue
│   └── functions/            # Edge functions (webhooks, low-latency reads)
├── infra/
│   ├── vercel.json
│   ├── railway.toml
│   └── cloudflare/           # CDN rules, WebP transforms
├── docs/
│   ├── BUILD.md              # ← you are here
│   ├── ARCHITECTURE.md       # Diagrams + decisions (owned by architecture agent)
│   ├── DESIGN.md             # Visual language + flows (owned by product-design agent)
│   ├── QA.md                 # Test strategy (owned by qa agent)
│   ├── ADRs/                 # Architecture Decision Records
│   └── OPEN_QUESTIONS.md
└── .claude/
    └── agents/               # product-design, architecture, development, qa
```

---

## 6. Local Dev Quickstart

> Target: a new engineer is rendering their first room in **under 30 minutes** from clone.

```bash
# Prereqs: Node 20+, pnpm 9+, Python 3.11+, Docker (for local Postgres+Redis)

git clone <repo> decora && cd decora
pnpm install

# Bring up local Supabase + Redis
pnpm dev:infra            # docker compose: postgres, redis, supabase studio

# Apply migrations + seed
pnpm db:reset

# Required env vars (see .env.example for the full list):
#   SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE
#   REPLICATE_API_TOKEN
#   ANTHROPIC_API_KEY
#   PAYSTACK_SECRET_KEY, PAYSTACK_PUBLIC_KEY
#   JUMIA_AFFILIATE_ID, KONGA_AFFILIATE_ID
#   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN

cp .env.example .env.local
# Fill in keys from 1Password vault: "Decora — Dev Secrets"

# Run everything
pnpm dev                  # web (3000), ai-service (8000), worker, mobile metro

# Or piecewise
pnpm dev:web
pnpm dev:ai
pnpm dev:mobile
```

**Smoke test:** open `http://localhost:3000`, sign in with a seeded test user, upload `/fixtures/test-room.jpg`, pick "Lagos Minimalist", set budget ₦500,000, submit. You should see 3 renders within 90s and an itemised budget panel.

---

## 7. The AI Pipeline (the spine)

Every render is one job through four stages. **Each stage has a contract.** If a stage breaks the contract, the job fails fast — we do not silently produce garbage.

```
[ User uploads photo ]
         │
         ▼
┌──────────────────────────────────────────────┐
│ Stage 1: Room Intelligence                   │
│ Claude (vision) → structured JSON            │
│ { roomType, dims, furniture[], lighting,     │
│   walls, floor, windows, doors }             │
└──────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────┐
│ Stage 2: Prompt Composition                  │
│ Claude → render prompt + negative prompt     │
│ Inputs: room JSON + style + budget tier +    │
│         Nigerian style library               │
└──────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────┐
│ Stage 3: Image Generation                    │
│ Replicate: SDXL + ControlNet (depth/canny)   │
│ 3 variants, seed-shifted, same prompt        │
│ ControlNet ref = original photo              │
└──────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────┐
│ Stage 4: Budget & Shop                       │
│ Claude → itemised list with Naira ranges     │
│ Match each item → Jumia/Konga affiliate URL  │
│ Flag overruns; suggest downgrades            │
└──────────────────────────────────────────────┘
         │
         ▼
[ Webhook to user: "Your render is ready" ]
```

**Targets per render request (3 variants):**

| Stage | Tool | p50 latency | p95 latency | Cost (NGN) |
|---|---|---|---|---|
| 1 — Room JSON | Claude (vision) | 4s | 8s | ~₦8 |
| 2 — Prompt | Claude | 2s | 5s | ~₦5 |
| 3 — 3× image | Replicate SDXL+ControlNet | 60s | 90s | ~₦65–₦130 |
| 4 — Budget | Claude | 5s | 10s | ~₦12 |
| **Total** | | **~75s** | **~110s** | **~₦90–₦155** |

Gross-margin sanity check: Home Plan = ₦15,000/mo, 40 renders = ₦3,600–₦6,200 in AI cost. Comfortable margin.

**Engineering constraints on the pipeline:**

- The pipeline is **idempotent per `render_request_id`**. Re-running a failed job is safe.
- Every stage emits a structured log line: `render_id`, `stage`, `latency_ms`, `cost_ngn`, `status`.
- Stages 1/2/4 are retried up to 2× on transient errors. Stage 3 is retried once (it's the expensive one).
- If Stage 3 fails twice, the user gets an apology screen + 1 free render credit, and we get a Sentry alert.
- ControlNet conditioning **must** preserve walls/windows/doors. If structural fidelity drifts, the prompt is wrong — fix the prompt, don't loosen the conditioning.

---

## 8. Data Model (V1.0 essentials)

The schema below is the minimum. Migrations live in `supabase/migrations/`.

```sql
-- users (managed by Supabase Auth; we extend with profile)
profile (
  user_id uuid pk references auth.users,
  display_name text,
  city text check (city in ('lagos','abuja','ph','other')),
  home_type text check (home_type in ('apartment','duplex','bungalow','compound','other')),
  taste_quiz jsonb,
  default_style text,
  created_at timestamptz default now()
)

plan (
  id text pk,            -- 'free' | 'home' | 'family' | 'elite' | 'signature'
  monthly_render_limit int not null,
  watermark bool not null,
  founding bool default false,
  price_ngn_monthly int not null,
  price_ngn_annual int not null
)

subscription (
  id uuid pk,
  user_id uuid references auth.users,
  plan_id text references plan,
  status text check (status in ('active','past_due','canceled','trialing')),
  founding_locked_until date,         -- if user is in founding 1,000
  paystack_subscription_code text,
  current_period_end timestamptz,
  created_at timestamptz default now()
)

project (
  id uuid pk,
  user_id uuid references auth.users,
  title text,
  room_type text,
  created_at timestamptz default now(),
  archived_at timestamptz
)

render_request (
  id uuid pk,
  project_id uuid references project,
  user_id uuid references auth.users,
  source_image_url text not null,
  style text not null,
  budget_ngn int not null,
  status text check (status in ('queued','analyzing','generating','scoring','done','failed')),
  failure_reason text,
  room_json jsonb,                    -- Stage 1 output
  prompt jsonb,                       -- Stage 2 output
  budget_json jsonb,                  -- Stage 4 output
  cost_ngn int,                       -- accumulated infra cost
  latency_ms int,
  created_at timestamptz default now()
)

render_variant (
  id uuid pk,
  render_request_id uuid references render_request,
  variant_index int check (variant_index in (0,1,2)),
  image_url text not null,
  seed bigint,
  width int, height int
)

price_catalogue (
  id uuid pk,
  category text not null,             -- 'sofa_3seater', 'floor_tile_sqm', ...
  subcategory text,
  tier text check (tier in ('entry','mid','premium')),
  price_min_ngn int, price_mid_ngn int, price_max_ngn int,
  source text check (source in ('manual','jumia_feed','konga_feed','vendor_direct')),
  last_updated timestamptz default now()
)

affiliate_product (
  id uuid pk,
  platform text check (platform in ('jumia','konga','vendor_direct')),
  product_name text,
  category text,
  price_ngn int,
  affiliate_url text not null,
  image_url text,
  last_synced timestamptz
)

affiliate_click (
  id uuid pk,
  user_id uuid references auth.users,
  render_request_id uuid references render_request,
  affiliate_product_id uuid references affiliate_product,
  clicked_at timestamptz default now(),
  converted bool default false,
  commission_ngn int
)

referral (
  id uuid pk,
  inviter_user_id uuid references auth.users,
  invitee_user_id uuid references auth.users,
  credited bool default false,
  created_at timestamptz default now()
)
```

RLS on every table. No exceptions. A user can read their own rows; service-role bypass for workers only.

---

## 9. Build Order — Week by Week (10–14 weeks)

| Wk | Milestone | Owner |
|---|---|---|
| 1 | Repo, monorepo tooling, Supabase project, env scaffolding, CI green | dev |
| 2 | Schema + migrations, Supabase Auth (email + Google), basic UI shell, Paystack sandbox | dev + arch |
| 3 | Photo upload (web + mobile), client-side compression, Supabase Storage, signed URLs | dev + design |
| 4 | Stage 1 — Claude room-intelligence integration; "We detected…" confirmation UI | dev + design |
| 5 | Style picker (8 cards), budget input, taste-quiz onboarding, render request creation | dev + design |
| 6 | Job queue, worker, Stage 2 prompt composer, Nigerian prompt library v1 | dev + arch |
| 7 | Stage 3 SDXL+ControlNet via Replicate, 3-variant generation, progress UI | dev |
| 8 | Stage 4 budget breakdown, price-catalogue seed (manual research, 200 SKUs), aff-link match | dev + product |
| 9 | Render viewer, before/after slider, item taps, WhatsApp + IG share, downloads | design + dev |
| 10 | Paystack live, plan limits, founding-discount codes, watermark on free tier | dev |
| 11 | Onboarding polish, empty states, error states, 3G perf pass, image compression audit | design + qa |
| 12 | Mobile parity (Expo build, TestFlight + internal Play track), push notifications | dev + qa |
| 13 | E2E + load tests, AI-pipeline chaos tests, NDPR compliance review | qa + arch |
| 14 | Soft launch — 100 founding users, daily metrics review, hotfix room kept open | all |

A slip on Stage 3 (week 7) is the slip that kills the timeline. Pad it; nothing else.

---

## 10. Engineering Principles (non-negotiable)

1. **Mobile-first, low-bandwidth-first.** Every screen is tested on a throttled 3G profile and a real mid-range Android. If it doesn't load in 3s, it doesn't ship.
2. **The render pipeline is the product.** Anything that protects its reliability, latency, or quality wins over anything that doesn't. Period.
3. **Naira everywhere.** No USD anywhere in the UI. No "≈₦" without a price-catalogue source. No stale-by-default. Every price is sourced.
4. **WhatsApp is a first-class surface.** Every shareable artifact must look correct on WhatsApp's preview, with a pre-written caption.
5. **NDPR by default.** Room photos auto-delete in 90 days unless saved. No model training on user data without opt-in. No US-shipping of identifiable analytics events.
6. **Idempotent jobs, structured logs, traceable cost.** Every render has an id, a cost, a latency, and a status. We can answer "what did this user's render cost us?" in one query.
7. **The prompt library is IP.** `packages/prompts` is reviewed like code. Style additions go through PR review by the product-design agent + one engineer.
8. **No silent fallbacks.** If we can't price an item, we don't invent a number — we say "estimated". If a render fails, we apologise and refund a credit.
9. **Affiliate links are tracked or they don't ship.** Every `Shop This` click logs `user_id`, `render_id`, `affiliate_product_id`, `platform`. Untracked links are bugs.
10. **Velocity over polish in weeks 1–9. Polish over velocity in weeks 10–14.** Resist the urge to flip these.

---

## 11. Definition of Done (per feature)

A feature ships only when **all** of these are true:

- [ ] Works on web (Chrome, Safari, Firefox, latest 2 versions)
- [ ] Works on Expo iOS and Android (latest 2 OS versions)
- [ ] Tested on throttled 3G + mid-range Android (real device, not just devtools)
- [ ] Empty / loading / error / offline states designed and implemented
- [ ] PostHog events wired (entry, success, failure)
- [ ] Sentry tested with a forced error path
- [ ] Copy reviewed for Nigerian English voice (no "y'all", no "buck", no "$")
- [ ] Naira formatting via shared util — never inline `₦${n}`
- [ ] RLS policy added/verified for any new table or column
- [ ] Docs touched if the feature changes a public contract (API, schema, env var)

---

## 12. Risks Worth Watching

| Risk | Likelihood | Mitigation |
|---|---|---|
| ControlNet drifts on Nigerian rooms (skews Western) | High | Build a 200-room test set with known-good outputs; regression-test every prompt change |
| Replicate latency spikes during global incidents | Medium | fal.ai as secondary; queue tolerates 5-min delays without UX collapse |
| Paystack subscription webhook edge cases | Medium | Idempotent webhook handler; reconciliation cron daily |
| Affiliate price drift / 404s on `Shop This` | High | Daily affiliate feed sync; show "confirm price on site"; fall back to category page |
| Founding-user count race (1,001st user) | Low | Atomic counter in Postgres with `for update`; one-shot lock at 1,000 |
| AI cost overruns on heavy users | Medium | Per-plan render caps enforced server-side; hard kill at 2× monthly cap |

---

## 13. The Four Agents

V1.0 is being built with four specialised AI agents collaborating with the human team. Each owns a slice and has a charter:

- **`product-design`** — owns DESIGN.md, the design system, user flows, copy, accessibility, and Nigerian visual language.
- **`architecture`** — owns ARCHITECTURE.md, ADRs, schema, contracts, scaling and security decisions.
- **`development`** — owns the code: implements features end-to-end against the spec, with tests.
- **`qa`** — owns QA.md, test plans, regression suites, performance and load tests, NDPR audits.

Agent definitions live in `.claude/agents/`. Don't invoke them all at once for the same task — they conflict. Use them per-slice.

---

## 14. Open Questions (move to OPEN_QUESTIONS.md as they accumulate)

- Final brand name: **Decora / Aso / Ilé AI / Ojutu / Decora NG / HomeNG AI** — pick before week 4.
- Mobile-first vs web-first launch: which gets the polish budget in weeks 10–11?
- Price-catalogue refresh — manual monthly vs weekly?
- Do we ship Pidgin copy in V1.0 or V1.1? (Currently V2.)
- Replicate vs fal.ai for primary image gen — run a head-to-head bake-off in week 5.

---

**Document owner:** Founder + Architecture agent
**Last updated:** 2026-05-28
**Version:** 1.0 — Foundation
