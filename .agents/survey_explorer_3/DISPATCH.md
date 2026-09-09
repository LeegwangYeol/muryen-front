## 2026-08-27T16:35:22Z
Mission:
Survey performance optimization opportunities and testing setup requirements for `muryen-front`.

Tasks:
1. Read /Users/a7890/src/muryen-front/.agents/ORIGINAL_REQUEST.md.
2. Investigate performance aspects:
   - Unnecessary re-renders, missing React.memo / useMemo / useCallback where beneficial.
   - Image loading optimizations (next/image usage, priority, sizes, layout shifts).
   - Core Web Vitals, dynamic imports / code splitting opportunities.
3. Investigate testing infrastructure and unit test coverage:
   - Check if Jest, React Testing Library, ts-jest/babel/swc jest configurations exist.
   - If missing or incomplete, design the exact Jest & RTL configuration needed for this Next.js project.
   - Enumerate all core UI components and utility functions that need unit test coverage.
4. Write your findings to /Users/a7890/src/muryen-front/.agents/survey_explorer_3/analysis.md and a structured handoff to /Users/a7890/src/muryen-front/.agents/survey_explorer_3/handoff.md.
5. Send a message to your parent when done referencing the handoff path.
