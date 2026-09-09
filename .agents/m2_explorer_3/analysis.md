# Technical Analysis: Dynamic Imports, Client/Server Boundaries, and Third-Party Libraries

**Agent**: `m2_explorer_3`  
**Date**: 2026-09-01  
**Milestone**: M2 (Auth & Layout Hardening / Project-wide Error Audit)

---

## 1. Executive Summary

This investigation analyzed dynamic imports, Client vs Server component boundaries, heavy third-party dependencies (`recharts`, `react-player`, `@meursyphus/flitter`, `@xenova/transformers`, `@ricky0123/vad-web`), and runtime/hydration error resilience across the `muryen-front` Next.js 15 App Router codebase.

### Key Findings
1. **Dynamic Imports & Code Splitting**: All critical charting subcomponents (`DonutChart`, `AttendanceLineChart`, `SkillsRadarChart`, `SparringBarChart`) are dynamically loaded via `next/dynamic` with `{ ssr: false }` and skeleton fallbacks. This keeps initial route bundles slim (`/basic-sense`: 113 kB, `/mypage`: 106 kB) and eliminates SSR DOM calculation errors.
2. **Bottom-Left Navigation & Hydration Integrity**:
   - `app/component/navigation.tsx` is clean of dead dynamic imports (`VideoModal`) and orphaned state.
   - `app/component/record-graph.tsx` utilizes deterministic date parsing (`parseISO("2024-12-31")`) and arithmetic pseudo-random generation, guaranteeing 100% hydration equivalence across all client timezones.
3. **Third-Party Heavy Libraries**:
   - `recharts` is safely isolated to client-only dynamically imported components.
   - `@ricky0123/vad-web` & `onnxruntime-web` are loaded via lazy CDN scripts with runtime availability guards and complete `AudioContext`/`MediaStreamTrack` teardown in `vad-analyzer.tsx`.
   - `@meursyphus/flitter`, `@xenova/transformers`, `lamejs`, `styled-components`, and `next-themes` are declared in `package.json` but have **0 active usages** in the codebase.
4. **Targeted Hardening Opportunities**:
   - `app/component/video-circle.tsx` uses hooks (`useState`, `useEffect`, `useTheme`, `requestAnimationFrame`) but is missing the `"use client";` directive at line 1.
   - Six orphaned legacy files exist in `app/component/` (`VideoModal.tsx`, `introduction.tsx`, `main-open.tsx`, `call-to-action.tsx`, `techniques.tsx`, `vanta-background.tsx`) and can be cleaned.
   - `InteractivePlayer` in `app/component/patten-page.tsx` can optionally be dynamically imported to code-split `react-player` (~150 kB).

---

## 2. Detailed Inspection of Key Target Components

| Component | Path | Client/Server Boundary | Dynamic Import / SSR Strategy | Health Status | Hardening Recommendation |
|---|---|---|---|---|---|
| **Navigation** | `app/component/navigation.tsx` | Client (`"use client"`) | Static icons; zero orphaned dynamic imports | 🟢 **Healthy** | Fully hardened; `isLoggedIn` cookie check isolated to `useEffect`. |
| **Intro Basic (24반 무예)** | `app/component/intro-basic.tsx` | Client (`"use client"`) | `const DonutChart = dynamic(() => import("./donut-chart"), { ssr: false, loading: Skeleton })` | 🟢 **Healthy** | Recharts and DOM portals strictly client-side. |
| **Dashboard Stat Cards** | `components/dashboard/stat-cards.tsx` | Client (`"use client"`) | Dynamically loads `AttendanceLineChart`, `SkillsRadarChart`, `SparringBarChart` (`ssr: false`) | 🟢 **Healthy** | Decouples charts from RSC `app/mypage/page.tsx`. |
| **VAD Analyzer** | `components/ai/vad-analyzer.tsx` | Client (`"use client"`) | Global `window.vad` via CDN `<Script strategy="lazyOnload">` | 🟢 **Healthy** | Full `AudioContext` & MediaStream teardown in `teardownVad`. |
| **Video Circle** | `app/component/video-circle.tsx` | Client Hooks (Missing directive) | GPU CSS keyframe animations (`animate-[spin_90s_linear_infinite]`) | 🟡 **Minor Defense** | Add explicit `"use client";` to line 1. |
| **Record Graph** | `app/component/record-graph.tsx` | Client (`"use client"`) | Deterministic arithmetic on `parseISO("2024-12-31")` | 🟢 **Healthy** | Timezone-invariant; single hoisted `TooltipProvider`. |

---

## 3. Third-Party Library Loading & Dependency Audit

| Dependency | Declared Version | Actual Usage in Codebase | SSR / CSR Risk | Current Mitigation | Hardening Action |
|---|---|---|---|---|---|
| **`recharts`** | `^2.15.0` | `donut-chart.tsx`, `stat-charts.tsx` | High (DOM dimension queries, SVG rendering) | Loaded via `next/dynamic(..., { ssr: false })` | Keep dynamic isolation. |
| **`react-player`** | `^2.14.1` | `interactive-player.tsx`, `VideoModal.tsx` (orphaned) | Medium (Window/Media API) | `mounted` guard in `InteractivePlayer` | Delete `VideoModal.tsx`; optionally dynamic import in `patten-page.tsx`. |
| **`@ricky0123/vad-web`** | `^0.0.21` | Global script CDN in `app/layout.tsx` | Medium (WebAudio, ONNX WASM) | Safe guard `if (!window.vad)`; track cleanup on unmount | Verified clean. |
| **`@meursyphus/flitter`** | `^2.1.0` | **None** (0 imports) | None | Unused | Prune from `package.json`. |
| **`@xenova/transformers`** | `^2.0.1` | **None** (0 imports) | None | Unused | Prune from `package.json`. |
| **`lamejs`** | `^1.2.1` | **None** (0 imports) | None | Unused | Prune from `package.json`. |
| **`styled-components`** | `^6.1.13` | **None** (0 imports) | None | Unused | Prune from `package.json`. |
| **`next-themes`** | `^0.4.6` | **None** (0 imports) | None | Unused (custom ThemeContext in use) | Prune from `package.json`. |

---

## 4. Client vs. Server Component Boundary Analysis

Next.js App Router enforces strict boundaries between Server Components (RSC) and Client Components (`"use client"`).

### Analysis of Route Entry Points
1. **Root Layout (`app/layout.tsx`)**:
   - Pure Server Component exporting static `metadata`.
   - Imports Client Component wrappers: `<Providers>`, `<ThemeProvider>`, `<VantaBackground>`, `<AppShell>`.
   - Injects non-blocking scripts via `next/script` (`ort.js`, `bundle.min.js`, and JSON-LD structured data).
2. **Page Server Components**:
   - `app/about/page.tsx`, `app/sparring/page.tsx`, `app/mypage/page.tsx`, `app/basic/page.tsx`, `app/cutting/page.tsx`, etc., export static `Metadata` objects while delegating interactive UI to dedicated client page components (`AboutPage`, `SparringPage`, `DashboardStatCards`, etc.).
3. **Interactive UI Components**:
   - All stateful hooks, event handlers, and browser API callers are correctly wrapped in client components.

---

## 5. Verification & Benchmark Results

1. **Jest Suite**:
   ```bash
   npm test -- --ci
   ```
   - **Result**: `24 passed, 24 total`, `179 passed, 179 total` (0 failures).
2. **ESLint**:
   ```bash
   npm run lint
   ```
   - **Result**: `✔ No ESLint warnings or errors`.
3. **Next.js Production Build**:
   ```bash
   npm run build
   ```
   - **Result**: 24/24 static & dynamic pages successfully generated.
   - **First Load JS shared by all**: 103 kB.
