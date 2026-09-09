# BRIEFING — 2026-08-28T01:45:00+09:00

## Mission
Develop the exact, line-by-line implementation plan for Milestone 1 Part A (SSR Hydration, SSR suppressions removal, Dark Mode class sync, SEO & Initial SSR render).

## 🔒 My Identity
- Archetype: explorer
- Roles: investigation, synthesis
- Working directory: /Users/a7890/src/muryen-front/.agents/m1_explorer_1
- Original parent: 3cc5ed4a-ba8b-448b-bc68-43ce7e3b2327
- Milestone: Milestone 1 Part A

## 🔒 Key Constraints
- Read-only investigation — do NOT implement directly in source code
- Target files:
  1. app/component/record-graph.tsx (SSR hydration / deterministic mock data)
  2. app/component/navigation.tsx and app/component/sparring-page.tsx (remove SSR suppressions)
  3. app/context/theme-context.tsx and app/layout.tsx (dark mode class synchronization)
  4. app/component/home-client.tsx (SEO & Initial SSR render)

## Current Parent
- Conversation ID: 3cc5ed4a-ba8b-448b-bc68-43ce7e3b2327
- Updated: 2026-08-28T01:45:00+09:00

## Investigation State
- **Explored paths**:
  - `app/component/record-graph.tsx`: Evaluated module-scope random date/math generation causing React 18 hydration mismatch. Designed deterministic anchor generator.
  - `app/component/navigation.tsx` & `app/component/sparring-page.tsx`: Identified `if (!theme) return null;` SSR suppressions wiping HTML content for crawlers.
  - `app/context/theme-context.tsx`, `app/layout.tsx`, `tailwind.config.ts`, `app/globals.css`: Found missing `.dark` class synchronization on `document.documentElement` required for Tailwind `dark:` variants.
  - `app/component/home-client.tsx`: Identified 2.5s opening block preventing SSR of `<MainLayout>` and entire home semantic content. Designed `AnimatePresence` overlay.
- **Key findings**: Complete line-by-line diffs defined in `analysis.md` and synthesized in `handoff.md`.
- **Unexplored areas**: Milestone 1 Part B (broken image URLs, layout margin offsets, stream cleanups) assigned to other agents.

## Key Decisions Made
- Anchored commit data to fixed UTC date constant `2024-12-31T00:00:00Z` with index-based deterministic formulas for exact SSR/hydration byte-match.
- Defaulted `theme` to `"light"` in `ThemeProvider` with client effect hydration and inline script sync for zero FOUC and full SSR rendering.
- Preserved visual hero opening via `AnimatePresence` overlay on top of server-rendered `<MainLayout>` for maximum SEO visibility.

## Artifact Index
- `/Users/a7890/src/muryen-front/.agents/m1_explorer_1/DISPATCH.md` — Dispatch log
- `/Users/a7890/src/muryen-front/.agents/m1_explorer_1/BRIEFING.md` — Persistent working memory
- `/Users/a7890/src/muryen-front/.agents/m1_explorer_1/progress.md` — Liveness heartbeat and progress
- `/Users/a7890/src/muryen-front/.agents/m1_explorer_1/analysis.md` — Detailed analysis and implementation plan
- `/Users/a7890/src/muryen-front/.agents/m1_explorer_1/handoff.md` — 5-component handoff report
