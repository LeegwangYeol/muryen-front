# Handoff Report: Performance Optimization & Testing Infrastructure Survey

**Agent**: Survey Explorer 3 (`teamwork_preview_explorer`)  
**Target Project**: `muryen-front` (Next.js 15.5.15, React 18.2.0, TypeScript 5)  
**Report Type**: Hard Handoff (Task Complete)  
**Deliverables**: `/Users/a7890/src/muryen-front/.agents/survey_explorer_3/analysis.md`

---

## 1. Observation

1. **Testing Infrastructure Absence**:
   - `package.json` lines 5–10:
     ```json
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "start": "next start",
       "lint": "next lint"
     }
     ```
   - Zero test dependencies in `devDependencies`: no `jest`, `@types/jest`, `jest-environment-jsdom`, `@testing-library/react`, or `@testing-library/jest-dom`.
   - File search across root found no `jest.config.*`, `jest.setup.*`, `setupTests.*`, or `*.test.*` / `*.spec.*` files.

2. **Shared Bundle Pollution via `react-player`**:
   - `app/component/VideoModal.tsx:4`: `import ReactPlayer from "react-player";`
   - `app/component/navigation.tsx:25`: `import VideoModal from "./VideoModal";`
   - `components/layout/app-shell.tsx:4`: `import Navigation from "@/app/component/navigation";`
   - `app/layout.tsx:10`: `import { AppShell } from "@/components/layout/app-shell";`
   - In `app/component/navigation.tsx:259–263`, `<VideoModal isOpen={isVideoModalOpen} ... videoId="" />` is rendered with hardcoded `false` state.
   - Build output shows `First Load JS shared by all: 102 kB` (including `react-player`).

3. **Recharts Bundle Weight on Sub-routes**:
   - `/basic-sense` First Load JS: **227 kB** (`app/component/intro-basic.tsx:12` imports `PieChart`, `Pie`, `Cell`, `ResponsiveContainer` from `recharts`).
   - `/mypage` First Load JS: **214 kB** (`components/dashboard/stat-cards.tsx:5-19` imports `LineChart`, `RadarChart`, `BarChart`, `ResponsiveContainer` from `recharts`).

4. **Continuous 20 FPS React Re-rendering**:
   - `app/component/video-circle.tsx:60–64`:
     ```tsx
     const interval = setInterval(() => {
       setRotation((prev) => (prev + 0.2) % 360);
     }, 50);
     ```
   - Triggers full component re-render every 50ms, recalculating `Math.cos` / `Math.sin` for all videos and thrashing React VDOM.

5. **1,095 Redundant Radix UI Providers**:
   - `app/component/record-graph.tsx:111–129`:
     `<TooltipProvider>` is instantiated inside `eachDayOfInterval` for 3 years (1,095 iterations), creating 1,095 context providers and DOM trees.

6. **Unmemoized Theme Context Value**:
   - `app/context/theme-context.tsx:40–44`:
     `<ThemeContext.Provider value={{ theme: theme ?? "light", toggleTheme }}>` recreates the value object on every render because `toggleTheme` is an unmemoized inline function.

7. **Global VAD / ONNX WebAssembly Scripts**:
   - `app/layout.tsx:361–368`:
     ```html
     <Script src="https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/ort.js" strategy="lazyOnload" />
     <Script src="https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.19/dist/bundle.min.js" strategy="lazyOnload" />
     ```
     Loaded unconditionally on every page, despite only being used in `components/ai/vad-analyzer.tsx` on `/cutting`.

8. **Image Component Missing `sizes` & Preload Contention**:
   - `app/component/how-work.tsx:130,156`: `<Image fill ... />` missing `sizes`.
   - `app/component/video-circle.tsx:171`: `<Image fill ... />` missing `sizes`.
   - `app/component/intro-basic.tsx:446`: 16 hidden images rendered with `priority={index < 4}`, generating preload links in `<head>` for hidden offscreen elements.
   - `app/component/equipment.tsx:87`: Generates nonexistent image paths `/images/전통-갑옷.jpg`.

9. **Unused Dependencies in `package.json`**:
   - `"@xenova/transformers": "^2.0.1"` and `"@meursyphus/flitter": "^2.1.0"` are in `dependencies` but unused anywhere.

---

## 2. Logic Chain

1. **Testing Setup Necessity**:
   - *From Observation 1*: The project has zero test runner, zero test config, and zero test files.
   - *Therefore*: A Jest + React Testing Library environment based on `next/jest` must be initialized with `jest.config.ts`, `jest.setup.ts`, and required devDependencies (`jest`, `@types/jest`, `jest-environment-jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`).

2. **Bundle Splitting & First Load JS**:
   - *From Observation 2*: `react-player` is in the root layout's static import chain via `VideoModal` in `Navigation`.
   - *Therefore*: Removing or dynamically importing `VideoModal` with `next/dynamic` (`ssr: false`) will immediately strip `react-player` from the shared root bundle for all 24 pages.
   - *From Observation 3*: Recharts on `/basic-sense` and `/mypage` accounts for over 50% of page-specific JS payload.
   - *Therefore*: Dynamic imports for chart components will defer loading until client rendering is necessary.

3. **Runtime Performance & Battery/CPU Optimization**:
   - *From Observation 4*: 50ms `setInterval` state update is CPU-inefficient and causes unnecessary React reconciliation cycles.
   - *Therefore*: Migrating `VideoCircle` animation to CSS keyframes / CSS transform will run on the compositor thread without triggering React renders.
   - *From Observation 5 & 6*: Hoisting `<TooltipProvider>` and memoizing `ThemeContext` value will eliminate thousands of duplicate DOM wrappers and prevent cascade re-renders.

4. **Resource Loading & Core Web Vitals**:
   - *From Observation 7 & 8*: Removing `priority` on hidden images in `intro-basic.tsx` and adding explicit `sizes` props in `how-work.tsx` will prevent bandwidth contention during initial LCP rendering.

---

## 3. Caveats

1. **VAD Audio Analyzer**: `VadAnalyzer` (`components/ai/vad-analyzer.tsx`) depends on global `window.vad`. If script tags are removed from `layout.tsx`, dynamic script injection inside `VadAnalyzer` must be verified to ensure `window.vad` is initialized before mic activation.
2. **Next.js 15 Async Request Contexts**: When testing Next.js 15 App Router components or route handlers, server functions accessing cookies/headers require async resolution or mocking.
3. **No Existing Test Regression**: Since no tests currently exist, the test suite to be created establishes the initial baseline for regression testing.

---

## 4. Conclusion

1. **Testing**: `muryen-front` needs a complete Jest + RTL configuration (`jest.config.ts`, `jest.setup.ts`) and unit tests for 4 utility modules (`utils`, `auth-service`, `token-service`, `contact`), 1 context (`theme-context`), 9 UI primitives (`button`, `typography`, `card`, `input`, `tabs`, `dialog`, `scroll-area`, `tooltip`), and 8 layout/presentation components.
2. **Performance**: Implementing 7 specific optimizations (dynamic import for `react-player`/Recharts, CSS animation for `VideoCircle`, single `TooltipProvider` in `RecordGraph`, memoized `ThemeContext`, `sizes` on `fill` images, removing hidden preloads, and isolating VAD CDN scripts) will significantly reduce bundle size, eliminate frame drops, and improve Core Web Vitals (LCP, INP, CLS).

---

## 5. Verification Method

To verify these findings and test the future implementation:

1. **Verify Current Build**:
   ```sh
   cd /Users/a7890/src/muryen-front && npm run build
   ```
   *Expected*: Build completes successfully, displaying route sizes (e.g. `/basic-sense` ~227 kB, shared ~102 kB).

2. **Verify Lint Status**:
   ```sh
   cd /Users/a7890/src/muryen-front && npm run lint
   ```
   *Expected*: Zero errors (currently only warnings for unused imports in `equipment.tsx`, `intro-basic.tsx`, `llami-chat-widget.tsx`, etc.).

3. **Verify Future Test Runner** (after implementation):
   ```sh
   npm test
   ```
   *Expected*: Jest runs in `jsdom` environment, executes all test suites in `__tests__` or `*.test.tsx`, and passes with 100% success.
