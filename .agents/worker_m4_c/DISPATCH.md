# Dispatch to Worker M4-C: Types, Performance & Test Pass Clearance

- **Authoritative Request**: `/Users/a7890/src/muryen-front/.agents/ORIGINAL_REQUEST.md`
- **Project Blueprint**: `/Users/a7890/src/muryen-front/PROJECT.md`
- **Explorer 3 Report**: `/Users/a7890/src/muryen-front/.agents/sweep_explorer_3/handoff.md`

## Files Owned Exclusively
1. `components/dashboard/stat-charts.tsx`
2. `app/component/record-graph.tsx`
3. `app/component/donut-chart.tsx`
4. `components/ui/chart.tsx`
5. `app/context/theme-context.tsx`
6. `app/layout.tsx`
7. `__tests__/tiers/tier1-feature-coverage.test.tsx`
8. `__tests__/tiers/tier4-real-world-scenarios.test.tsx`

## Tasks & Specifications
1. **Fix TypeScript Errors in `components/dashboard/stat-charts.tsx`**:
   - `AttendanceLineChart`, `SkillsRadarChart`, and `SparringBarChart` currently mandate `textColor: string` and `gridColor: string`.
   - Make them optional (`textColor?: string`, `gridColor?: string`) with sensible defaults (`textColor = isDark ? "#e5e7eb" : "#374151"`, `gridColor = isDark ? "#374151" : "#e5e7eb"`).
   - This resolves 5 `TS2739` errors in `__tests__/tiers/tier2-boundary-corner-cases.test.tsx` and ensures `npx tsc --noEmit` passes with 0 errors!
2. **Optimize `app/component/record-graph.tsx`**:
   - Currently instantiates 1,095+ Radix `<Tooltip>` and `<TooltipTrigger>` components inside `<TooltipProvider>`, overwhelming jsdom DOM operations and causing the 5,000ms timeout in `__tests__/tiers/tier4-real-world-scenarios.test.tsx` Scenario 5.
   - Refactor to a lightweight tooltip pattern (e.g. standard HTML `title` attributes on cells or a single active floating tooltip component rendered conditionally when hovering a cell).
3. **Optimize `app/component/donut-chart.tsx`**:
   - Eliminate memory leak: ensure `mousemove` listener on `window` is properly cleaned up on unmount or replace with component-level `onMouseMove`.
   - Remove forced synchronous layout reflow: do not trigger `getBoundingClientRect()` in `useLayoutEffect` synchronously triggering state updates.
   - Remove redundant hidden 500x500 `<Image>` elements.
4. **Context & Theme Hardening**:
   - In `components/ui/chart.tsx`: memoize the `ChartContext.Provider` value with `useMemo`.
   - In `app/context/theme-context.tsx`: wrap `localStorage.getItem` and `localStorage.setItem` in `try/catch` to prevent private browsing crashes (`SecurityError`).
5. **Clean Layout External Scripts in `app/layout.tsx`**:
   - Remove global unused CDN injection of `onnxruntime-web` and `vad-web` from root layout (they are only needed on experimental `/test` page).
6. **Tier Tests Clearance in `__tests__/tiers/`**:
   - In `tier1-feature-coverage.test.tsx`: ensure the query for main navigation uses `getByRole("navigation", { name: "주요 내비게이션" })` matching Worker M4-B's `aria-label="주요 내비게이션"`.
   - Ensure `tier4-real-world-scenarios.test.tsx` Scenario 5 runs smoothly and passes well under the timeout.
   - Run `npm test` and verify that ALL 26 test suites pass with 100% success rate!

## Verification Commands
- `npx tsc --noEmit`
- `npm test`
- `npm run lint`
- Write handoff report to `/Users/a7890/src/muryen-front/.agents/worker_m4_c/handoff.md`.

## 2026-09-09T14:25:00Z
You are worker_m4_c for muryen-front.
Your working directory is /Users/a7890/src/muryen-front/.agents/worker_m4_c.
You MUST read /Users/a7890/src/muryen-front/.agents/ORIGINAL_REQUEST.md and /Users/a7890/src/muryen-front/.agents/worker_m4_c/DISPATCH.md before starting.
Also review Explorer 3 report at /Users/a7890/src/muryen-front/.agents/sweep_explorer_3/handoff.md.

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Files Owned Exclusively by you:
1. `components/dashboard/stat-charts.tsx`
2. `app/component/record-graph.tsx`
3. `app/component/donut-chart.tsx`
4. `components/ui/chart.tsx`
5. `app/context/theme-context.tsx`
6. `app/layout.tsx`
7. `__tests__/tiers/tier1-feature-coverage.test.tsx`
8. `__tests__/tiers/tier4-real-world-scenarios.test.tsx`

Your mission:
1. In `components/dashboard/stat-charts.tsx`: Make `textColor?: string` and `gridColor?: string` optional with default values in `AttendanceLineChart`, `SkillsRadarChart`, and `SparringBarChart`. Verify `npx tsc --noEmit` resolves the 5 `TS2739` errors.
2. In `app/component/record-graph.tsx`: Refactor from 1,095+ individual Radix Tooltips to a lightweight single-tooltip or standard title attribute pattern to eliminate DOM overhead and prevent test timeouts.
3. In `app/component/donut-chart.tsx`: Clean up mousemove event listeners, remove forced layout reflow (`getBoundingClientRect`), and remove redundant hidden 500x500 images.
4. In `components/ui/chart.tsx`: Memoize `ChartContext.Provider` value with `useMemo`.
5. In `app/context/theme-context.tsx`: Wrap `localStorage` calls in try/catch to protect against private browsing `SecurityError`.
6. In `app/layout.tsx`: Remove the global `<Script>` injection of `onnxruntime-web` and `vad-web`.
7. In `__tests__/tiers/tier1-feature-coverage.test.tsx`: Query navigation with `name: "주요 내비게이션"`. Ensure `tier4-real-world-scenarios.test.tsx` Scenario 5 passes quickly.
8. Verify `npx tsc --noEmit` and `npm test`.
9. Document your findings, diffs, and verification commands in `/Users/a7890/src/muryen-front/.agents/worker_m4_c/handoff.md` and send a completion message to the parent orchestrator.
