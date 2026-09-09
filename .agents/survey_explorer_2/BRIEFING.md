# BRIEFING — 2026-08-28T01:39:45+09:00

## Mission
Audit muryen-front codebase for SSR/hydration bugs, runtime errors, React lifecycle issues, typing errors, and logic bugs.

## 🔒 My Identity
- Archetype: explorer
- Roles: bug audit, code inspection, risk analysis
- Working directory: /Users/a7890/src/muryen-front/.agents/survey_explorer_2
- Original parent: 3cc5ed4a-ba8b-448b-bc68-43ce7e3b2327
- Milestone: codebase-survey

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- List specific files, line numbers, root causes, and recommended fixes

## Current Parent
- Conversation ID: 3cc5ed4a-ba8b-448b-bc68-43ce7e3b2327
- Updated: not yet

## Investigation State
- **Explored paths**: Entire codebase (app/, components/, lib/, types/, styles/, package.json, tailwind.config.ts)
- **Key findings**:
  1. RecordGraph (record-graph.tsx:37-59): Massive hydration mismatch with random dates/numbers at module scope.
  2. Dark mode desync: Tailwind darkMode "class" expects `dark` on `<html>`, but theme-context only sets `theme-dark`, disabling all `dark:...` styles.
  3. 404 images in equipment.tsx: dynamically generated `.jpg` paths for Korean names don't exist.
  4. VideoCircle (video-circle.tsx): memory leak with rAF and broken progress math.
  5. Layout margin mismatch: Navigation (w-44) vs AppShell (md:ml-64).
  6. HomeClient (home-client.tsx): 2.5s unmount delay completely hides SSR content.
  7. ESLint unused variables and dead components.
- **Unexplored areas**: None. Comprehensive survey complete.

## Key Decisions Made
- Categorized all findings into 5 structured domains with exact line numbers, root causes, and fix recommendations.

## Artifact Index
- /Users/a7890/src/muryen-front/.agents/survey_explorer_2/DISPATCH.md — Dispatch log
- /Users/a7890/src/muryen-front/.agents/survey_explorer_2/progress.md — Liveness and task tracking
- /Users/a7890/src/muryen-front/.agents/survey_explorer_2/analysis.md — Comprehensive findings
- /Users/a7890/src/muryen-front/.agents/survey_explorer_2/handoff.md — 5-component handoff report
