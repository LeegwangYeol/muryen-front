# Handoff Report — Codebase Survey & Architectural Mapping

**Agent**: `survey_explorer_1`  
**Milestone**: Codebase Survey & Architectural Mapping  
**Target Project**: `muryen-front` (`/Users/a7890/src/muryen-front`)  
**Analysis Reference**: `/Users/a7890/src/muryen-front/.agents/survey_explorer_1/analysis.md`  

---

## 1. Observation

1. **Project Dependencies & Scripts** (`package.json:5-10, 11-48`):
   - Dependencies: `next@^15.5.15`, `react@^18.2.0`, `react-dom@^18.2.0`, `framer-motion@^11.14.4`, `recharts@^2.15.0`, `jose@^5.9.6`, `next-auth@^4.24.11`, `@ricky0123/vad-web@^0.0.21`, `@radix-ui/react-*`, `@meursyphus/flitter@^2.1.0`.
   - Scripts: `"dev": "next dev"`, `"build": "next build"`, `"start": "next start"`, `"lint": "next lint"`.
   - No `test` script, no `jest`, no `@testing-library/react` installed in `devDependencies`.

2. **Build & Lint Results**:
   - `npm run lint` exited with code 0 but emitted 12 warnings:
     - `app/component/equipment.tsx:5:26`: `'Shield' is defined but never used.`
     - `app/component/equipment.tsx:5:34`: `'Sword' is defined but never used.`
     - `app/component/intro-basic.tsx:13:10`: `'ChartContainer' is defined but never used.`
     - `app/component/intro-basic.tsx:49:11`: `'TechniqueData' is defined but never used.`
     - `app/component/intro-basic.tsx:69:7`: `'footTechniques' is assigned a value but never used.`
     - `app/component/intro-basic.tsx:73:7`: `'mountedTechniques' is assigned a value but never used.`
     - `app/component/intro-basic.tsx:77:7`: `'renderCustomizedLabel' is assigned a value but never used.`
     - `app/component/intro-basic.tsx:103:7`: `'chartConfig' is assigned a value but never used.`
     - `app/component/llami-chat-widget.tsx:11:35`: `'theme' is assigned a value but never used.`
     - `app/component/llami-chat-widget.tsx:16:61`: `Assignments to the 'theme' variable from inside React Hook useEffect will be lost after each render.`
     - `app/component/login-page.tsx:4:20`: `'Apple' is defined but never used.`, `login-page.tsx:29:13`: `'data' is assigned a value but never used.`
     - `app/component/navigation.tsx:8:3`: `'Swords' is defined but never used.`
     - `app/context/theme-context.tsx:4:17`: `'themes' is defined but never used.`
     - `app/test2/page.tsx:3:10`: `'useEffect' is defined but never used.`
   - `npm run build` exited with code 0; successfully compiled 24 static/dynamic routes in 3.4s.

3. **Routes & Layouts**:
   - App Router contains 15 primary routes: `/`, `/about`, `/basic`, `/basic-sense`, `/cutting`, `/daily`, `/equipment`, `/know-how`, `/location`, `/login`, `/mypage`, `/pattern`, `/reference`, `/sparring`, `/test`, `/test2`.
   - API routes: `/api/auth/[...nextauth]`, `/api/auth/login`, `/api/auth/logout`.
   - Feed & Metadata routes: `/feed.xml`, `/robots.txt`, `/sitemap.xml`.
   - Layout architecture: `app/layout.tsx` wraps `Providers` -> `ThemeProvider` -> `VantaBackground` -> `AppShell` (containing `Navigation`, `MobileNav`, `Footer`, `#main` skip link).

4. **Code Smells, Broken Assets & Performance Flaws**:
   - In `app/component/equipment.tsx:87-89`: image path interpolation generates `/images/전통-갑옷.jpg`, `/images/전투용-투구.jpg`, `/images/장창.jpg` which do not exist in `public/images/`.
   - In `public/images/foot/`: `muye24ki_core_18_woldo.gif.gif` has double extension.
   - In `app/component/record-graph.tsx:111-130`: 1,095 days each render a separate `<TooltipProvider>`, resulting in extreme context/event listener overhead.
   - In `app/component/video-circle.tsx:60-65`: `setInterval` runs at 50ms (20fps), triggering continuous React state re-renders.
   - In `README.md:1, 4, 41`: Unresolved git merge conflict markers present.
   - In `app/`: Orphaned patch reject file `app/layout.tsx.rej`.
   - Dual directory structure: `app/component/` holds page implementations and legacy stubs (`introduction.tsx`, `main-open.tsx`, `call-to-action.tsx`, `techniques.tsx`, `vanta-background.tsx`, `llami-chat-widget.tsx`), while `components/` holds design system and layout components.

---

## 2. Logic Chain

1. **Requirement R1 (Codebase Audit & Bug Fixing)**:
   - Observation 2 reveals 12 ESLint compiler warnings. Fixing them directly cleans up the compiler feedback.
   - Observation 4 reveals broken image references in `equipment.tsx`, double-extension filename `muye24ki_core_18_woldo.gif.gif`, merge conflict markers in `README.md`, and an orphaned `.rej` file in `app/`. Fixing these resolves visual rendering bugs and repository hygiene issues.

2. **Requirement R2 (Performance Optimization)**:
   - Observation 4 shows `RecordGraph` spawning >1,000 `<TooltipProvider>` instances on `/daily`. Lifting the provider to wrap the entire calendar eliminates thousands of redundant context and listener allocations.
   - Observation 4 shows `VideoCircle` running a 50ms React state interval, causing 20 re-renders per second. Replacing state-driven angle stepping with CSS animation or `requestAnimationFrame` removes constant component churn.

3. **Requirement R3 (Unit Testing)**:
   - Observation 1 shows no testing dependencies or scripts exist in `package.json`.
   - Introducing `jest`, `jest-environment-jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event` along with `jest.config.ts` and test scripts will enable comprehensive unit testing for core UI primitives (`typography.tsx`, `button.tsx`, `app-shell.tsx`), AI tools (`vad-analyzer.tsx`), and auth utilities (`auth-service.ts`, `token-service.ts`, `contact.ts`, `utils.ts`).

---

## 3. Caveats

- The external VAD script (`@ricky0123/vad-web`) and ONNX runtime rely on browser WebAssembly and microphone hardware. In headless Jest environments, Web Audio and AudioContext must be mocked.
- NextAuth Google OAuth is configured for `/test2` and requires valid Google client secrets (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) to execute real OAuth flows. Local mock testing should bypass live API calls.
- `styled-components` is listed in `package.json` dependencies but no active components require it. It can be safely retained or pruned without affecting Tailwind-styled components.

---

## 4. Conclusion

The `muryen-front` codebase has a clean, functional Next.js 15 App Router architecture with rich interactive features and structured typography. However, it currently has:
1. Minor image path bugs and lint warnings.
2. Distinct performance bottlenecks in `RecordGraph` and `VideoCircle`.
3. Complete absence of automated unit test infrastructure (Requirement R3).

All components and modules are well-isolated and ready for targeted bug fixes, performance refactoring, and test suite implementation.

---

## 5. Verification Method

To independently verify the survey observations and findings:

1. **Verify Dependencies & Config**:
   ```bash
   cat /Users/a7890/src/muryen-front/package.json
   cat /Users/a7890/src/muryen-front/next.config.ts
   ```
2. **Verify Lint & Build Output**:
   ```bash
   npm run lint
   npm run build
   ```
3. **Verify Broken Assets and Conflict Markers**:
   ```bash
   head -n 10 /Users/a7890/src/muryen-front/README.md
   ls -la /Users/a7890/src/muryen-front/app/layout.tsx.rej
   ls -la /Users/a7890/src/muryen-front/public/images/
   ```
4. **Verify Detailed Analysis**:
   - Inspect `/Users/a7890/src/muryen-front/.agents/survey_explorer_1/analysis.md`.
