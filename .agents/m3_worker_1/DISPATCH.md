## 2026-08-27T17:04:13Z
You are Milestone 3 Worker (teamwork_preview_worker).
Your working directory is: /Users/a7890/src/muryen-front/.agents/m3_worker_1
The original user request is at: /Users/a7890/src/muryen-front/.agents/ORIGINAL_REQUEST.md
The project scope is at: /Users/a7890/src/muryen-front/PROJECT.md
The Survey 3 analysis is at: /Users/a7890/src/muryen-front/.agents/survey_explorer_3/analysis.md
The project root is: /Users/a7890/src/muryen-front

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Mission:
Implement complete automated unit test infrastructure and comprehensive test coverage with Jest and React Testing Library for `muryen-front` (Requirement R3):

1. Setup Test Infrastructure:
   - Install required testing devDependencies if not present: `jest`, `@types/jest`, `jest-environment-jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `ts-node`.
   - Create `/Users/a7890/src/muryen-front/jest.config.ts` using `next/jest`:
     * `testEnvironment: "jest-environment-jsdom"`
     * `setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"]`
     * `moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" }`
     * `testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"]`
   - Create `/Users/a7890/src/muryen-front/jest.setup.ts`:
     * `import "@testing-library/jest-dom";`
     * Mock `window.matchMedia`, `IntersectionObserver`, and `ResizeObserver`.
   - Update `package.json` with scripts: `"test": "jest"`, `"test:watch": "jest --watch"`, `"test:coverage": "jest --coverage"`.

2. Implement Comprehensive Unit Test Suites:
   - Utility tests:
     * `__tests__/utils/utils.test.ts`: Test `cn` helper with simple strings, conditional classes, conflicting Tailwind classes (tailwind-merge).
     * `__tests__/utils/auth-service.test.ts`: Test authentication service methods (login, register, token retrieval, error handling).
     * `__tests__/utils/token-service.test.ts`: Test cookie retrieval, setting, removal, and parsing logic.
     * `__tests__/utils/contact.test.ts`: Test contact form validation and submission payloads.
   - Context & State tests:
     * `__tests__/context/theme-context.test.tsx`: Test `ThemeProvider`, `useTheme`, initial theme, toggling theme, `.dark` class mutation on `document.documentElement`, and error handling when used outside provider.
   - UI Primitives tests:
     * `__tests__/ui/button.test.tsx`: Test default button, variants (default, destructive, outline, secondary, ghost, link), sizes, disabled state, click events, `asChild` slot.
     * `__tests__/ui/typography.test.tsx`: Test Typography components (H1, H2, H3, H4, P, Blockquote, List, InlineCode, Lead, Large, Small, Muted).
     * `__tests__/ui/card.test.tsx`: Test Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter rendering.
     * `__tests__/ui/input.test.tsx`: Test Input rendering, onChange event firing, disabled attribute, placeholder, custom classNames.
     * `__tests__/ui/tabs.test.tsx`: Test Tabs, TabsList, TabsTrigger, TabsContent switching and active tab state.
     * `__tests__/ui/dialog.test.tsx`: Test Dialog, DialogTrigger, DialogContent, DialogTitle open and close transitions.
     * `__tests__/ui/scroll-area.test.tsx`: Test ScrollArea rendering and viewport structure.
     * `__tests__/ui/tooltip.test.tsx`: Test Tooltip, TooltipTrigger, TooltipContent with TooltipProvider.
   - Core & Layout Component tests:
     * `__tests__/components/app-shell.test.tsx`: Test AppShell rendering, skip link (`#main`), child rendering, header/footer inclusion.
     * `__tests__/components/equipment.test.tsx`: Test Equipment page component, equipment card titles, descriptions, image paths, and category tabs.
     * `__tests__/components/navigation.test.tsx`: Test Navigation menu items, expanded/collapsed states, theme toggle button integration.
     * `__tests__/components/record-graph.test.tsx`: Test RecordGraph calendar rendering, commit cell count, year selector, and tooltip interaction.

3. Verification:
   - Run `npm test` (or `npx jest`) and ensure 100% of unit tests pass.
   - Run `npm run lint` and verify 0 errors, 0 warnings.
   - Run `npm run build` and verify clean build with 0 errors.
   - Write your report to /Users/a7890/src/muryen-front/.agents/m3_worker_1/handoff.md and send a message to your parent.
