## 2026-08-27T16:45:19Z

<USER_REQUEST>
You are M1 Worker 1 (teamwork_preview_worker).
Your working directory is: /Users/a7890/src/muryen-front/.agents/m1_worker_1
The original user request is at: /Users/a7890/src/muryen-front/.agents/ORIGINAL_REQUEST.md
The project scope is at: /Users/a7890/src/muryen-front/PROJECT.md
The Explorer blueprints are at:
- /Users/a7890/src/muryen-front/.agents/m1_explorer_1/analysis.md
- /Users/a7890/src/muryen-front/.agents/m1_explorer_2/analysis.md
- /Users/a7890/src/muryen-front/.agents/m1_explorer_3/analysis.md
The project root is: /Users/a7890/src/muryen-front

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Mission:
Implement all Milestone 1 fixes (Bug Fixing, Hydration & Hygiene) according to the Explorer specifications:

1. Part A — Hydration & Theming:
   - `app/component/record-graph.tsx`: Deterministic mockCommitData (eliminate top-level Math.random() / new Date() hydration mismatch).
   - `app/component/navigation.tsx` & `app/component/sparring-page.tsx`: Remove `if (!theme) return null;` SSR suppressions.
   - `app/context/theme-context.tsx` & `app/layout.tsx`: Synchronize `.dark` class on `document.documentElement` when theme is dark.
   - `app/component/home-client.tsx`: Render `<MainLayout>` directly without SSR blanking, keeping hero intro as an animated overlay.

2. Part B — Assets, Layout, Leaks & Security:
   - `app/component/equipment.tsx`: Map equipment images to existing valid assets (`/images/armour.png`, `/images/sparring.png`, `/images/foot/muye24ki_core_01_jangchang.gif`).
   - Rename `public/images/foot/muye24ki_core_18_woldo.gif.gif` -> `muye24ki_core_18_woldo.gif` and sync in `app/component/intro-basic.tsx`.
   - `app/component/navigation.tsx`: Set expanded sidebar width to `w-64` matching `app-shell.tsx` `md:ml-64`.
   - `app/component/video-circle.tsx`: Add rAF cancellation cleanup and fix expansionDuration formula.
   - `components/ai/vad-analyzer.tsx`: Add audio stream & context teardown on unmount.
   - `app/api/auth/login/route.ts`: Set `httpOnly: true`, `secure`, and `sameSite: "lax"` on `accessToken`.

3. Part C — ESLint Warnings & Repo Hygiene:
   - Remove unused variables/imports across `equipment.tsx`, `intro-basic.tsx`, `llami-chat-widget.tsx`, `login-page.tsx`, `navigation.tsx`, `theme-context.tsx`, `test2/page.tsx`.
   - Delete orphaned `app/layout.tsx.rej`.
   - Remove merge conflict markers from `README.md`.

4. Verification:
   - Run `npm run lint` and verify 0 errors and 0 warnings.
   - Run `npm run build` and verify clean build with 0 errors.
   - Write your report to /Users/a7890/src/muryen-front/.agents/m1_worker_1/handoff.md and send a message to your parent.
</USER_REQUEST>
