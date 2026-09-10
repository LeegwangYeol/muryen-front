# Dispatch to Sweep Explorer 3: State, Performance, Dynamic Imports, Config & Types

- **Target Areas**: `app/context/**`, dynamic imports (`donut-chart`, `stat-charts`, `interactive-player`), state synchronization, re-rendering bottlenecks, bundle size, `next.config.mjs`, `tsconfig.json`, `package.json`, test coverage gaps.
- **Objective**: Conduct an exhaustive scan for performance bottlenecks, unoptimized re-renders, missing dynamic import fallbacks, TypeScript typing gaps/any types, configuration vulnerabilities, and missing stress tests.
- **Authoritative Request**: `/Users/a7890/src/muryen-front/.agents/ORIGINAL_REQUEST.md`
- **Output**: Write findings and recommended remediation actions to `/Users/a7890/src/muryen-front/.agents/sweep_explorer_3/handoff.md`.

## 2026-09-09T14:15:36Z
You are sweep_explorer_3 (Performance & State Explorer) for muryen-front.
Your working directory is /Users/a7890/src/muryen-front/.agents/sweep_explorer_3.
You MUST read /Users/a7890/src/muryen-front/.agents/ORIGINAL_REQUEST.md and /Users/a7890/src/muryen-front/.agents/sweep_explorer_3/DISPATCH.md before beginning.

Your Mission:
Conduct an exhaustive, forensic exploration of state management, dynamic imports, performance bottlenecks, TypeScript types, and configuration in muryen-front:
1. Files to examine: `app/context/**`, dynamic imports (`donut-chart`, `stat-charts`, `interactive-player`), `next.config.mjs`, `tsconfig.json`, `package.json`, test coverage in `__tests__/**`.
2. Investigate for:
   - Performance bottlenecks: unnecessary re-renders in context or large lists, missing memoization (`useMemo`, `useCallback`), heavy client bundle imports, missing dynamic loading fallbacks/skeletons.
   - State & synchronization bugs: stale closures, race conditions in async state updates, theme or session context desynchronization.
   - TypeScript typing issues: loose `any` types, type assertions masking runtime bugs, unhandled nullability.
   - Test gaps: edge case coverage gaps, un-tested components or utility functions.
3. You are read-only: do NOT modify source files directly.
4. Document all findings, exact line numbers, severity, and concrete fix recommendations in `/Users/a7890/src/muryen-front/.agents/sweep_explorer_3/handoff.md`.
5. Send a completion message to the parent orchestrator when your report is ready.
