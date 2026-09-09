## 2026-08-27T16:42:12Z
Mission:
Develop the exact, line-by-line implementation plan for Milestone 1 Part A:
1. SSR Hydration fixes in `app/component/record-graph.tsx`: Eliminate module-scope Math.random() / new Date() execution. Make mockCommitData deterministic on initial render or generate consistently so client hydration matches server HTML perfectly without DOM mismatch.
2. Remove SSR suppressions (`if (!theme) return null;`) in `app/component/navigation.tsx` and `app/component/sparring-page.tsx`.
3. Dark Mode class synchronization in `app/context/theme-context.tsx` and `app/layout.tsx`: Ensure `document.documentElement` receives `.dark` class when theme is dark (or matching system dark), aligning with `tailwind.config.ts` (`darkMode: ["class"]`).
4. SEO & Initial SSR render in `app/component/home-client.tsx`: Ensure full semantic page content is rendered server-side and client-side without a 2.5s blanking delay or unmounted DOM.

Output:
Write your detailed plan to /Users/a7890/src/muryen-front/.agents/m1_explorer_1/analysis.md and /Users/a7890/src/muryen-front/.agents/m1_explorer_1/handoff.md, then send a message to your parent.
