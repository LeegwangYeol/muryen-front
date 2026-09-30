# Handoff Report — swarm_explorer_app

**Task**: Next.js App Router Architectural and Code-Level Inspection  
**Working Directory**: `/Users/a7890/src/muryen-front/.agents/swarm_explorer_app`  
**Report Artifact**: `/Users/a7890/src/muryen-front/.agents/swarm_explorer_app/report.md`  
**Status**: Complete (Hard Handoff)  

---

## 1. Observation

1. **Build & Route Generation**:
   Command: `npm run build`
   Result:
   ```
   ▲ Next.js 15.5.15
   ✓ Compiled successfully in 4.0s
   ✓ Generating static pages (25/25)
   ✓ Finalizing page optimization
   ```
   Total routes: 25 compiled route outputs (17 page routes, 4 route handlers: `/api/auth/[...nextauth]`, `/api/auth/login`, `/api/auth/logout`, `/feed.xml`, 2 metadata routes: `/robots.txt`, `/sitemap.xml`, 1 `_not-found` route, 1 middleware `40.5 kB`).

2. **HTML Semantics & Landmark Structure**:
   Command: `grep -n "<main" across the project`
   Result: Exactly one `<main>` tag exists in the active UI codebase:
   `components/layout/app-shell.tsx:32`: `<main id="main" ...>`
   `app/error.tsx:23` uses `<section aria-labelledby="error-heading">`
   `app/not-found.tsx:23` uses `<section aria-labelledby="not-found-heading">`
   `components/layout/main-layout.tsx:11-13` is a pass-through fragment `<>{children}</>`.
   Zero nested `<main>` tags were detected.

3. **VAD Web Audio Module Disconnect**:
   - `components/ai/vad-analyzer.tsx:8`:
     `// @ricky0123/vad-web is loaded via script tag in layout.tsx as a global`
   - `components/ai/vad-analyzer.tsx:64-67`:
     ```ts
     if (!window.vad) {
       setFeedback("VAD 모듈이 아직 로드되지 않았습니다.");
       return;
     }
     ```
   - `app/layout.tsx:335-386`: No script tag loading `@ricky0123/vad-web` exists in `<head>` or `<body>`.
   - `app/test/page.tsx:11`:
     `const vad = (window as any).vad;`
     `const vadInstance = await vad.MicVAD.new({...});` -> Throws `TypeError: Cannot read properties of undefined` when clicked.

4. **Missing Metadata Declarations**:
   - `app/daily/page.tsx`: Does not export `metadata` or `generateMetadata`.
   - `app/login/page.tsx`: Does not export `metadata`.
   - `app/know-how/page.tsx`: Does not export `metadata`.
   - `app/location/page.tsx`: Does not export `metadata`.
   - `app/test/page.tsx` & `app/test2/page.tsx`: Directly marked with `"use client"` at line 1, disabling Next.js static metadata export.

5. **Orphaned Components**:
   - `app/component/styles.tsx`: Defines `Styles()` with Taekwondo/Hapkido mockup content. Grep confirms 0 references in the repository.
   - `app/component/training-gallery.tsx`: Defines `TrainingGallery()` filtering `hero === true` photos. Grep confirms 0 imports in `app/component/home-client.tsx` or elsewhere.
   - `app/component/animated-image.tsx`: Defines `AnimatedImage`. Grep confirms 0 imports in the repository.

6. **Test Suite Verification**:
   Command: `npm run lint` -> Passed with 0 errors and 0 warnings.
   Command: `npx jest __tests__/tiers/tier4-real-world-scenarios.test.tsx` -> Passed with 5/5 tests in 4.1s.
   Command: `npm test` across all 30 test suites -> 29 suites passed, 1 suite failed on `SCENARIO 5` due to 5000ms default test timeout under high parallel concurrency.

---

## 2. Logic Chain

1. **Routing and Page Structure**:
   - Based on the 25 routes generated during `npm run build` (Observation 1), the application employs the Next.js 15 App Router standard with static prerendering for all content pages and dynamic server evaluation for authentication endpoints and RSS feed.
   - The root layout (`app/layout.tsx`) acts as the single application shell host, encapsulating all child routes within `Providers -> ThemeProvider -> VantaBackground -> AppShell`.

2. **Semantic Hierarchy & Hydration Safety**:
   - From Observation 2, `AppShell` encapsulates `{children}` inside `<main id="main">`. Because all subpages, error boundaries, and not-found fallbacks use `<section>` or `<>`, no invalid nested `<main>` tags are rendered into the DOM.
   - In `app/layout.tsx`, `suppressHydrationWarning` on `<html>` and an early `theme-init` script prevent theme attribute mismatches, while dynamic imports with `{ ssr: false }` prevent SSR mismatches in Recharts and ReactPlayer components.

3. **Defect Verification (VAD)**:
   - From Observation 3, `VadAnalyzer` (used in `/cutting`) relies on `window.vad`. Because neither `app/layout.tsx` nor `/cutting/page.tsx` injects this global, clicking the microphone toggle cannot access `MicVAD`, leading to user-visible failure or runtime errors.

4. **SEO & Metadata Coverage**:
   - Major public pages (`/`, `/about`, `/basic`, `/basic-sense`, `/cutting`, `/gallery`, `/pattern`, `/reference`, `/sparring`, `/mypage`, `_not-found`) have full metadata and JSON-LD schemas.
   - From Observation 4, `/daily`, `/login`, `/know-how`, and `/location` lack metadata, causing search engines to fall back to the default layout title.

---

## 3. Caveats

1. **Test Environment Performance**:
   Under multi-worker parallel execution, JSDOM rendering 1,095 buttons in `RecordGraph` (Scenario 5) takes ~5.1s, narrowly exceeding Jest's default 5.0s timeout. When executed individually, it runs in ~1.2s.
2. **Third-party External Dependencies**:
   Vanta.js background depends on external CDN scripts (`cdnjs.cloudflare.com/ajax/libs/three.js` and `cdn.jsdelivr.net/npm/vanta`), and ChatWidget connects to an external Tokki endpoint (`my-server-test.vercel.app`). In offline environments, these gracefully degrade to static backgrounds and fallback error notices.
3. **Read-Only Inspection**:
   Per the swarm explorer role constraint, no source code was modified during this audit. Proposed code fixes and improvements are documented in `report.md`.

---

## 4. Conclusion

1. The Next.js App Router in `muryen-front` is structurally sound, compiles cleanly without errors (25/25 routes), passes ESLint with 0 warnings, and enforces correct HTML semantics without any nested `<main>` landmarks.
2. The complete Routing Map has been documented and formatted for direct inclusion into `PROJECT_SUMMARY.md` (see Section 2 of `report.md`).
3. Six specific micro-defects were identified and prioritized for remediation:
   - Fix VAD script loading or dynamic import for `/cutting` and `/test`.
   - Add explicit metadata to `/daily` and `/login`.
   - Remove or integrate dead components (`styles.tsx`, `training-gallery.tsx`, `animated-image.tsx`).
   - Fix typographical filename `patten-page.tsx` -> `pattern-page.tsx` and helper `downladaudio`.
   - Increase test timeout for Scenario 5 in `tier4-real-world-scenarios.test.tsx` to 15s to withstand heavy parallel test runs.

---

## 5. Verification Method

1. **Build Verification**:
   ```bash
   npm run build
   ```
   Expected: 25/25 pages successfully compiled without TypeScript or Next.js build errors.

2. **Lint Verification**:
   ```bash
   npm run lint
   ```
   Expected: `No ESLint warnings or errors`.

3. **Test Suite Verification**:
   ```bash
   npx jest __tests__/tiers/tier4-real-world-scenarios.test.tsx
   ```
   Expected: All 5 scenarios pass cleanly.

4. **Detailed Report Inspection**:
   Inspect `/Users/a7890/src/muryen-front/.agents/swarm_explorer_app/report.md` for full routing tables, layout diagrams, and remediation code blocks.
