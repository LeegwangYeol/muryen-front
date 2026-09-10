# Execution Plan — Final Exhaustive Codebase Sweep

## Objective
Execute a comprehensive, autonomous sweep of the entire `muryen-front` application using specialized subagents to discover hidden bugs, logical errors, edge cases, type issues, and performance bottlenecks, implement clean fixes, and verify with 100% test pass rate, 0 lint warnings/errors, clean build, and clean forensic audit.

## Phases

### Phase 1: Exhaustive Multi-Domain Survey & Exploration
- **Explorer 1 (Auth, API, Security, Middleware)**:
  - Focus: `app/api/**`, `lib/auth-service.ts`, `lib/token-service.ts`, `middleware.ts`, NextAuth handlers, session guards, cookie management, input validation.
  - Deliverable: Detailed inventory of edge cases, potential unhandled promises, invalid payload handling, security loopholes.
- **Explorer 2 (UI, Layouts, Navigation, Pages, Hydration & Accessibility)**:
  - Focus: `components/**`, `app/(pages)/**`, `app/layout.tsx`, client boundaries (`"use client"`), hydration consistency, mobile responsiveness, accessibility, edge cases in user inputs.
  - Deliverable: Catalog of UI bugs, state bugs, component rendering errors, hydration risks.
- **Explorer 3 (State, Performance, Dynamic Imports, Types, Config)**:
  - Focus: `app/context/**`, dynamic imports (`donut-chart`, `stat-charts`, `interactive-player`), memory leaks, bundle size/render bottlenecks, `tsconfig.json`, `next.config.mjs`, Jest/testing gaps.
  - Deliverable: Performance analysis, dynamic component fallback audit, type strictness issues, test suite gap analysis.

### Phase 2: Synthesis & Remediation Planning
- Project Orchestrator synthesizes findings from all 3 explorers.
- Create explicit defect remediation work items with clear file write boundaries.

### Phase 3: Targeted Implementation & Remediation
- Dispatch Worker(s) to fix confirmed defects, edge cases, and performance bottlenecks.
- Workers run lint, build, and tests after each set of modifications.

### Phase 4: Independent Review & Empirical Challenge
- Dispatch Reviewer(s) to inspect code quality, architecture, security, and edge-case coverage.
- Dispatch Challenger(s) to stress test edge cases, invalid payloads, boundary conditions, and performance.

### Phase 5: Definitive Final Inspection & Forensic Audit
- Dispatch Forensic Auditor to verify integrity, no cheating, no regressions, authentic implementations.
- Confirm `npm run lint` (0 errors, 0 warnings), `npm run build` (success), `npm test` (100% pass).
- Synthesize final comprehensive report for Sentinel and user.
