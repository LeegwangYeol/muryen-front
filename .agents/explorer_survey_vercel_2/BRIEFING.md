# BRIEFING — 2026-09-11T00:03:50+09:00

## Mission
Conduct a full architectural survey of muryen-front routes, pages, modal dialogs, interactive components, and flows to build an exhaustive checklist for live Vercel audit.

## 🔒 My Identity
- Archetype: explorer
- Roles: survey, synthesis
- Working directory: /Users/a7890/src/muryen-front/.agents/explorer_survey_vercel_2
- Original parent: a2a2802d-525d-4d62-9f19-059aaa153527
- Milestone: live_production_audit

## 🔒 Key Constraints
- Read-only investigation — do NOT implement code changes in the app source code
- Maintain progress.md with timestamps
- Write full report and checklist to handoff.md
- Send message to parent upon completion

## Current Parent
- Conversation ID: a2a2802d-525d-4d62-9f19-059aaa153527
- Updated: 2026-09-11T00:03:50+09:00

## Investigation State
- **Explored paths**:
  - `app/` (page.tsx, layout.tsx, loading.tsx, error.tsx, not-found.tsx, robots.ts, sitemap.ts, feed.xml/route.ts)
  - `app/about`, `app/basic-sense`, `app/basic`, `app/pattern`, `app/cutting`, `app/sparring`, `app/gallery`, `app/equipment`, `app/reference`, `app/daily`, `app/mypage`, `app/login`, `app/location`, `app/know-how`, `app/test`, `app/test2`
  - `app/api/auth/[...nextauth]`, `app/api/auth/login`, `app/api/auth/logout`
  - `app/component/` (navigation, home-client, equipment, donut-chart, record-graph, video-circle, photo-grid, vanta-main-background, etc.)
  - `components/` (layout, dashboard, chat, video, ai, ui)
  - `lib/` (contact, tokki, auth-service, token-service, photos)
  - `middleware.ts`, `next.config.ts`, `package.json`
- **Key findings**:
  - Production target identified as `https://muryen-front.vercel.app`.
  - 17 app pages, 3 auth API routes, 3 feed/sitemap/robots endpoints identified.
  - Route protection active on `/daily` and `/mypage` via `middleware.ts`, requiring `accessToken`.
  - Test credentials for authentication: `1111`/`1111` (admin) and `2222`/`2222` (user).
  - Production risk identified: `JWT_SECRET` must be set in Vercel environment variables or `/api/auth/login` throws 500.
  - Interactive components, charts (Recharts Pie, Line, Radar, Bar), modals (Radix Dialogs), players (ReactPlayer), and AI components (Tokki Chat, VadAnalyzer) fully inventoried.
- **Unexplored areas**: None. Architectural survey and inventory are complete.

## Key Decisions Made
- Structured the survey into full route inventory, interactive component mapping, external services catalogue, user journey blueprints, and verification matrix for production testing.

## Artifact Index
- handoff.md — Comprehensive forensic survey report and live Vercel checklist
- progress.md — Heartbeat and execution progress
- DISPATCH.md — Recorded dispatch prompt
