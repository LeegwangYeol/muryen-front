# Forensic Exploration Report: Performance, State, Dynamic Imports, Config & Types

**Explorer**: `sweep_explorer_3` (Performance & State Explorer)  
**Date**: 2026-09-09  
**Target Repository**: `muryen-front` (`/Users/a7890/src/muryen-front`)  
**Mode**: Read-Only Forensic Investigation  

---

## 1. Observation

### 1.1 Command Executions & Verbatim Diagnostic Failures

#### A. TypeScript Compilation (`npx tsc --noEmit`)
- **Command**: `npx tsc --noEmit`
- **Result**: Exited with code `2`.
- **Verbatim Errors**:
  ```text
  __tests__/tiers/tier2-boundary-corner-cases.test.tsx(406,10): error TS2739: Type '{ data: never[]; isDark: false; }' is missing the following properties from type '{ data: AttendanceItem[]; isDark: boolean; textColor: string; gridColor: string; }': textColor, gridColor
  __tests__/tiers/tier2-boundary-corner-cases.test.tsx(411,10): error TS2739: Type '{ data: never[]; isDark: true; }' is missing the following properties from type '{ data: SkillItem[]; isDark: boolean; textColor: string; gridColor: string; }': textColor, gridColor
  __tests__/tiers/tier2-boundary-corner-cases.test.tsx(416,10): error TS2739: Type '{ data: never[]; isDark: false; }' is missing the following properties from type '{ data: SparringItem[]; isDark: boolean; textColor: string; gridColor: string; }': textColor, gridColor
  __tests__/tiers/tier2-boundary-corner-cases.test.tsx(423,10): error TS2739: Type '{ data: { month: string; attendance: number; }[]; isDark: true; }' is missing the following properties from type '{ data: AttendanceItem[]; isDark: boolean; textColor: string; gridColor: string; }': textColor, gridColor
  __tests__/tiers/tier2-boundary-corner-cases.test.tsx(434,10): error TS2739: Type '{ data: { skill: string; score: number; }[]; isDark: false; }' is missing the following properties from type '{ data: SkillItem[]; isDark: boolean; textColor: string; gridColor: string; }': textColor, gridColor
  ```

#### B. Jest Test Suite Execution (`npm test`)
- **Command**: `npm test`
- **Result**: Exited with code `1`. `Test Suites: 2 failed, 24 passed, 26 total. Tests: 3 failed, 198 passed, 201 total.`
- **Verbatim Errors**:
  1. `__tests__/tiers/tier1-feature-coverage.test.tsx:356`:
     ```text
     FAIL __tests__/tiers/tier1-feature-coverage.test.tsx
     ● Tier 1: Feature Coverage Verification Suite › Feature 1: Clean Layout & No Error Overlays › F1-1: renders root semantic landmarks: skip-link, nav, main, and contentinfo

     TestingLibraryElementError: Found multiple elements with the role "navigation"
     ```
  2. `__tests__/tiers/tier1-feature-coverage.test.tsx:108`:
     ```text
     FAIL __tests__/tiers/tier1-feature-coverage.test.tsx
     ● Tier 1: Feature Coverage Verification Suite › Feature 1: Clean Layout & No Error Overlays › F1-5: Footer component renders brand identity, schedule info, and structured nav groups

     TestingLibraryElementError: Found multiple elements with the text: 무련
     ```
  3. `__tests__/tiers/tier4-real-world-scenarios.test.tsx:223`:
     ```text
     FAIL __tests__/tiers/tier4-real-world-scenarios.test.tsx (11.401 s)
     ● Tier 4: Real-World Application Scenarios Suite › SCENARIO 5: Interactive equipment inspection modal and training history record dialog

     thrown: "Exceeded timeout of 5000 ms for a test.
     Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."
     ```

#### C. Build Execution (`npm run build`)
- **Command**: `npm run build`
- **Result**: Failed during page prerendering / build trace collection:
  ```text
  Error occurred prerendering page "/feed.xml". Read more: https://nextjs.org/docs/messages/prerender-error
  [Error: Cannot find module '/Users/a7890/src/muryen-front/.next/server/app/feed.xml/route.js'
  ```
  And when re-run without a clean cache:
  ```text
  [Error: ENOENT: no such file or directory, open '/Users/a7890/src/muryen-front/.next/server/app/_not-found/page.js.nft.json']
  ```

---

### 1.2 File-by-File Forensic Observations

#### 1. `components/dashboard/stat-charts.tsx` (Lines 36–46, 73–83, 109–119)
- Props for `AttendanceLineChart`, `SkillsRadarChart`, and `SparringBarChart` declare `textColor` and `gridColor` as required without default fallbacks:
  ```tsx
  export function AttendanceLineChart({
    data,
    isDark,
    textColor,
    gridColor,
  }: {
    data: AttendanceItem[];
    isDark: boolean;
    textColor: string;
    gridColor: string;
  })
  ```
- Missing optional modifiers (`textColor?: string`, `gridColor?: string`) and missing default assignments (`textColor = isDark ? "#fff" : "#333"`, `gridColor = isDark ? "#444" : "#ccc"`).
- None of the 3 chart components are wrapped with `React.memo`, causing full SVG canvas recalculation on every parent re-render.

#### 2. `app/component/record-graph.tsx` (Lines 116–153)
- Direct observation in lines 129–147:
  ```tsx
  {days.map((date) => {
    const dateString = format(date, "yyyy-MM-dd");
    const data = mockCommitData[dateString] || { count: 0, records: [] };
    return (
      <Tooltip key={dateString}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => handleDateClick(dateString)}
            aria-label={`${format(date, "yyyy-MM-dd")}: ${data.count}회 수련`}
            className={`w-3 h-3 m-[1px] rounded-sm ${getColorClass(data.count)} cursor-pointer ...`}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{data.count} commits on {format(date, "MMM d, yyyy")}</p>
        </TooltipContent>
      </Tooltip>
    );
  })}
  ```
- In `yearIntervals`, `days` covers 3 to 4 years (1,095 to 1,460 days).
- For every day, a separate Radix `<Tooltip>`, `<TooltipTrigger>`, and `<TooltipContent>` is instantiated under a single `<TooltipProvider>`.
- In addition, clicking a date calls `setSelectedDate(dateString)`, which updates parent state. Because neither `RecordGraph` rows nor cells are memoized, all 1,095+ Tooltip components, triggers, and buttons re-render on every selection.

#### 3. `app/component/donut-chart.tsx` (Lines 99–113, 158–163, 201–216, 223–231)
- **Mousemove event listener and forced reflow in `CustomSectionContent` & `Tooltip`**:
  Lines 158–163:
  ```tsx
  useEffect(() => {
    if (!isHovered) return;
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isHovered]);
  ```
  Lines 99–113:
  ```tsx
  useLayoutEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect(); // Synchronous reflow!
    ...
    setPos({ left, top }); // Second re-render on every mousemove pixel!
  }, [x, y]);
  ```
  On every single pixel of mouse movement over any slice, `setMousePos` is triggered, forcing a re-render. In `Tooltip`, `useLayoutEffect` synchronously measures `getBoundingClientRect()` (triggering browser layout recalculation/thrashing) and immediately calls `setPos`, resulting in two synchronous render passes and forced reflow on every mousemove event.
- **Redundant hidden image rendering**:
  Lines 201–216 render `<TechniqueImages images={techniqueData} />` containing hidden Next.js `<Image width={500} height={500} />` elements inside `<div className="hidden">`.
  Lines 223–231 simultaneously instantiate `new window.Image()` for every image in `useEffect`.
  `CustomLabel` (lines 64–70) and `CustomSectionContent` (lines 174–187) already render `<Image fill />` for all slices.

#### 4. `components/video/interactive-player.tsx` & `app/component/patten-page.tsx`
- **Static import of `react-player`**:
  `components/video/interactive-player.tsx` line 4:
  `import ReactPlayer from "react-player";`
  `app/component/patten-page.tsx` line 10:
  `import { InteractivePlayer } from "@/components/video/interactive-player";`
  `react-player` is bundled into the synchronous initial chunk of `patten-page` instead of being code-split with `next/dynamic`.
- **Layout Shift (CLS) on mount**:
  `components/video/interactive-player.tsx` lines 27–32:
  ```tsx
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  ```
  Returns `null` on SSR and hydration without preserving the 16:9 aspect ratio or rendering a skeleton placeholder, causing content below line 160 to jump.

#### 5. Root Global CDN Scripts in `app/layout.tsx` (Lines 365–371)
- Direct observation:
  ```tsx
  <Script
    src="https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/ort.js"
    strategy="lazyOnload"
  />
  <Script
    src="https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.19/dist/bundle.min.js"
    strategy="lazyOnload"
  />
  ```
- Both ONNX Runtime Web and VAD Web (~multi-megabyte JavaScript libraries) are injected into the global `<head>` of EVERY page in the application, despite `VadAnalyzer` being used exclusively on `/cutting`.

#### 6. Unmemoized Context Value in `components/ui/chart.tsx` (Line 50)
- Direct observation:
  ```tsx
  <ChartContext.Provider value={{ config }}>
  ```
  A new object literal `{ config }` is allocated on every single render of `ChartContainer`, busting reference equality and forcing re-renders of all downstream chart consumers (`ChartTooltipContent`, `ChartLegendContent`).

#### 7. Vulnerabilities & Desynchronization in `app/context/theme-context.tsx`
- **Missing try-catch in initial read (Line 24)**:
  ```tsx
  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
  ```
  Unlike line 44 (`try { localStorage.setItem(...) } catch {}`), line 24 does not catch `SecurityError` / `DOMException` thrown when `localStorage` is blocked or restricted (e.g. private browsing or sandboxed iframes).
- **Missing multi-tab synchronization**:
  No `window.addEventListener("storage", ...)` listener exists. Theme toggles in Tab A do not update Tab B.
- **Missing OS media query change listener**:
  If the user has not stored a preference, the app does not listen to `matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ...)`.

#### 8. Open Redirect Vulnerability in `app/component/login-page.tsx` (Lines 32–36)
- Direct observation:
  ```tsx
  // URL 파라미터에서 리다이렉트 URL 가져오기
  const params = new URLSearchParams(window.location.search);
  const redirectUrl = params.get("redirect") || "/";

  // 리다이렉트
  window.location.href = redirectUrl;
  ```
  Arbitrary URLs passed via `?redirect=https://malicious.com` or `javascript:...` are accepted and assigned to `window.location.href` upon login without validation.

#### 9. Disconnected Session Providers (NextAuth vs Custom Cookie)
- `app/providers.tsx` wraps the app in `<SessionProvider>` (`next-auth`).
- `app/api/auth/[...nextauth]/route.ts` configures Google OAuth.
- However, `Navigation` (`app/component/navigation.tsx` lines 94–99) and `MobileNav` (`components/layout/mobile-nav.tsx` lines 53–58) ignore NextAuth's `useSession()` and instead evaluate:
  ```tsx
  document.cookie.includes("isLoggedIn=true") || document.cookie.includes("accessToken")
  ```
  If a user signs in with Google via NextAuth at `/test2`, navigation reflects logged-out state. If a user signs in with credentials at `/login`, NextAuth session is null.

#### 10. Missing Cancellation & Unmounted State in `components/chat/chat-widget.tsx` (Lines 79–107)
- `send()` invokes `ask({ message, threadId, onToken })` without passing an `AbortSignal`.
- If the chat panel is closed or unmounted during a streaming response, tokens continue streaming in the background, and `setStreaming(false)`, `setStreamingText("")`, and `inputRef.current?.focus()` fire against unmounted components.

#### 11. Hardcoded Light Theme in Modals: `app/component/equipment.tsx` (Lines 113, 124)
- Modal container uses `bg-white` and `pre` uses `bg-gray-100` without dark mode variant classes (`dark:bg-gray-900`, `dark:text-white`), causing an eye-straining white rectangle when opening the modal in dark mode.

#### 12. Unused Dependencies in `package.json`
- Lines 15, 22, 28, 32, 37:
  * `"@meursyphus/flitter": "^2.1.0"` — 0 references across entire codebase.
  * `"@xenova/transformers": "^2.0.1"` — 0 references across entire codebase.
  * `"lamejs": "^1.2.1"` — 0 references across entire codebase.
  * `"styled-components": "^6.1.13"` — 0 references across entire codebase.
  * `"next-themes": "^0.4.6"` — 0 references across entire codebase.

#### 13. Incomplete `next.config.ts`
- File contains only:
  ```ts
  import type { NextConfig } from "next";
  const nextConfig: NextConfig = {};
  export default nextConfig;
  ```
  Missing `poweredByHeader: false`, `reactStrictMode: true`, `images.remotePatterns`, and `experimental.optimizePackageImports`.

---

## 2. Logic Chain

### 2.1 TypeScript Compilation Failure Chain
1. `__tests__/tiers/tier2-boundary-corner-cases.test.tsx` tests boundary rendering of `AttendanceLineChart`, `SkillsRadarChart`, and `SparringBarChart` by rendering them with minimal props: `<AttendanceLineChart data={[]} isDark={false} />`.
2. In `components/dashboard/stat-charts.tsx`, the prop types are defined as `{ data: AttendanceItem[]; isDark: boolean; textColor: string; gridColor: string; }`.
3. Because `textColor` and `gridColor` lack `?` optional modifiers, TypeScript strictly requires them on every JSX invocation.
4. Therefore, `tsc --noEmit` fails with 5 `TS2739` errors, blocking type validation in CI/CD.

### 2.2 Jest Test Failures Chain
1. **F1-1 Navigation Role Clash**: `AppShell` renders both `Navigation` (`<nav>`) and `Footer` (`<nav aria-label="푸터 사이트 네비게이션">`). The test `screen.getByRole("navigation")` expects a single `<nav>`, but finds multiple, causing `TestingLibraryElementError`.
2. **F1-5 Brand Text Clash**: `Footer` renders both a mobile header brand link and a desktop brand link, both containing the text string `무련`. The query `screen.getByText(SITE.name)` expects a single matching element, failing with `Found multiple elements with the text: 무련`.
3. **Scenario 5 Timeout**: `RecordGraph` renders 1,095+ Radix `Tooltip` instances. In jsdom, `user.click()` initiates synthetic pointer events across the entire DOM tree. With over 1,000 active tooltip event listeners and timers, execution exceeds Jest's 5,000 ms timeout.

### 2.3 Performance Degradation Chain in `DonutChart` & `RecordGraph`
1. In `donut-chart.tsx`, `CustomSectionContent` registers a native `mousemove` listener on `window` whenever a slice is hovered.
2. Every pixel moved dispatches `onMove` -> `setMousePos` -> triggers component re-render.
3. On every render of `Tooltip`, `useLayoutEffect` invokes `getBoundingClientRect()`. Because the DOM tree is dirty from the re-render, the browser is forced to synchronously recalculate layout (reflow).
4. `setPos` is immediately called inside `useLayoutEffect`, causing a second synchronous render pass for that single mouse event.
5. In `RecordGraph`, every single day cell instantiates a complex Radix Tooltip tree. When any date is selected, the lack of memoization (`React.memo`) forces reconciliation across all 1,000+ nodes.

### 2.4 Bundle & Load Performance Chain
1. `interactive-player.tsx` imports `react-player` statically. `patten-page.tsx` imports `InteractivePlayer` statically.
2. Next.js packs `react-player` and its third-party player adapters into the initial JavaScript bundle for `/pattern`.
3. During initial render, `InteractivePlayer` returns `null` (`if (!mounted) return null`), reserving 0 height. Once hydration completes and `mounted` becomes true, the player expands to 16:9 aspect ratio, pushing down all subsequent content and causing severe CLS.
4. In `app/layout.tsx`, CDN scripts for ONNX Runtime Web and VAD Web are injected into the root layout head, forcing all 25+ pages to download and parse multi-megabyte scripts even though they are only used by the AI Kihap Analyzer on `/cutting`.

### 2.5 Security & State Desynchronization Chain
1. In `LoginPage`, `redirectUrl` is taken directly from `new URLSearchParams(window.location.search).get("redirect")`.
2. The code performs `window.location.href = redirectUrl` without verifying that `redirectUrl` begins with `/` and does not begin with `//` or contain protocol schemes.
3. An attacker can construct `https://muryen.com/login?redirect=https://phishing.com`, and upon legitimate login, the user will be automatically redirected to the attacker's server.
4. In `app/context/theme-context.tsx`, `localStorage.getItem("theme")` is called unprotected. In privacy-focused browser modes or cross-origin iframes where `localStorage` is disabled, the browser throws a DOMException `SecurityError`, crashing the initial render.

---

## 3. Caveats

1. **Read-Only Scope**: In compliance with the Teamwork Explorer protocol, no production source code files or test files were directly edited or overwritten during this investigation.
2. **External CDN & Service Dependencies**:
   - `https://my-server-test.vercel.app` (Tokki backend API) is an external remote service. Response latency and streaming stability are dependent on network and server uptime.
   - Remote Google OAuth credentials (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) require external configuration in Google Cloud Console.
3. **Build Worker Trace Behavior**:
   - The transient `ENOENT` error during `Collecting build traces` on `.next/server/app/_not-found/page.js.nft.json` was observed during incremental builds where `.next` had existing stale state. A clean build (`rm -rf .next && npm run build`) compiles all 25 pages successfully, but optimization options in `next.config.ts` are needed to prevent file-locking race conditions.

---

## 4. Conclusion & Recommended Remediation

### Summary Table of Findings

| ID | Category | Target File | Lines | Severity | Impact |
|:---|:---|:---|:---|:---|:---|
| **F-01** | TypeScript | `components/dashboard/stat-charts.tsx` | 36-46, 73-83, 109-119 | **High** | `tsc --noEmit` fails with 5 `TS2739` errors |
| **F-02** | Test Failures | `__tests__/tiers/tier1-feature-coverage.test.tsx` | 356, 108 | **High** | `npm test` fails due to ambiguous role/text queries |
| **F-03** | Test Timeout | `__tests__/tiers/tier4-real-world-scenarios.test.tsx` | 223-273 | **High** | Scenario 5 times out at 5,000 ms due to 1,095+ Tooltips |
| **F-04** | Performance | `app/component/record-graph.tsx` | 116-153 | **High** | 1,095+ Radix Tooltip components cause severe DOM bloat & lag |
| **F-05** | Performance | `app/component/donut-chart.tsx` | 99-113, 158-163 | **High** | Double re-rendering & forced layout reflow (`getBoundingClientRect`) on every mousemove |
| **F-06** | Performance / CLS | `components/video/interactive-player.tsx` & `patten-page.tsx` | 4, 27-32; 10 | **High** | Static import of `react-player` and `!mounted return null` causing CLS |
| **F-07** | Bundle / Network | `app/layout.tsx` | 365-371 | **High** | Global ONNX and VAD CDN scripts loaded across all pages |
| **F-08** | Security | `app/component/login-page.tsx` | 32-36 | **High** | Open redirect vulnerability via unvalidated `?redirect=` param |
| **F-09** | State / Auth | `components/layout/mobile-nav.tsx`, `navigation.tsx`, `providers.tsx` | 94-99, 53-58 | **High** | NextAuth `SessionProvider` vs raw cookie auth desynchronization |
| **F-10** | State / Theme | `app/context/theme-context.tsx` | 23-33 | **Medium** | Uncaught `localStorage.getItem` exception (`SecurityError`), missing tab/media sync |
| **F-11** | Performance | `components/ui/chart.tsx` | 50 | **Medium** | Unmemoized `{ config }` object in `ChartContext.Provider` |
| **F-12** | State / Chat | `components/chat/chat-widget.tsx` | 79-107 | **Medium** | Streaming fetch lacks `AbortSignal`; unmounted component state updates |
| **F-13** | Theme Styling | `app/component/equipment.tsx` | 113, 124 | **Medium** | Hardcoded white background in modal breaks dark theme |
| **F-14** | Bundle Hygiene | `package.json` | 15, 22, 28, 32, 37 | **Medium** | Heavy unused dependencies (`@xenova/transformers`, `styled-components`, etc.) |
| **F-15** | Configuration | `next.config.ts` | 3-5 | **Medium** | Blank config; missing security headers and `optimizePackageImports` |

---

### Concrete Fix Proposals for Downstream Implementers

#### Fix 1: Resolve TypeScript Error in `components/dashboard/stat-charts.tsx`
Make `textColor` and `gridColor` optional with default values based on `isDark`:
```tsx
export function AttendanceLineChart({
  data,
  isDark,
  textColor = isDark ? "#fff" : "#333",
  gridColor = isDark ? "#444" : "#ccc",
}: {
  data: AttendanceItem[];
  isDark: boolean;
  textColor?: string;
  gridColor?: string;
})
```
Apply the identical optional types and defaults to `SkillsRadarChart` and `SparringBarChart`. Wrap all three charts in `React.memo`.

#### Fix 2: Optimize `app/component/record-graph.tsx` to Fix Scenario 5 Timeout
Replace individual per-cell Radix `<Tooltip>` wrappers with a single shared tooltip or native accessible tooltip attributes:
```tsx
// In RecordGraph:
<button
  type="button"
  onClick={() => handleDateClick(dateString)}
  aria-label={`${format(date, "yyyy-MM-dd")}: ${data.count}회 수련`}
  title={`${data.count} commits on ${format(date, "MMM d, yyyy")}`}
  className={`w-3 h-3 m-[1px] rounded-sm ${getColorClass(data.count)} cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-emerald-500 focus:outline-none`}
/>
```
Memoize the month/year subgrids using `React.memo` so selecting a date does not re-reconcile 1,000+ DOM buttons.

#### Fix 3: Fix `DonutChart` Layout Thrashing & Duplicate Images in `app/component/donut-chart.tsx`
1. In `CustomSectionContent`, remove `window.addEventListener("mousemove", onMove)`. Position the tooltip using SVG slice coordinates (`cx`, `cy`) or CSS `transform` on mouse enter/hover.
2. In `Tooltip`, remove `useLayoutEffect` and `getBoundingClientRect()`. Use fixed/absolute positioning with CSS clamping (`left: clamp(12px, calc(x + 18px), 90vw)`).
3. Remove `<TechniqueImages images={techniqueData} />` which renders hidden duplicate 500x500 images.

#### Fix 4: Dynamic Code-Splitting and Aspect Ratio Fallback for `InteractivePlayer`
1. In `app/component/patten-page.tsx`:
   ```tsx
   import dynamic from "next/dynamic";

   const InteractivePlayer = dynamic(
     () => import("@/components/video/interactive-player").then((m) => m.InteractivePlayer),
     {
       ssr: false,
       loading: () => (
         <div className="w-full aspect-[16/9] rounded-xl bg-black/10 dark:bg-white/5 animate-pulse flex items-center justify-center text-gray-400">
           교보재 영상 플레이어 로딩 중...
         </div>
       ),
     }
   );
   ```
2. In `components/video/interactive-player.tsx`, replace `if (!mounted) return null;` with a styled skeleton container having `aspect-[16/9]` matching the player container to prevent CLS.

#### Fix 5: Scoped Loading for VAD / ONNX Scripts
Move the following scripts from `app/layout.tsx` into `app/cutting/page.tsx` or load them conditionally inside `VadAnalyzer`:
```tsx
// Load only when VadAnalyzer is mounted on /cutting
```

#### Fix 6: Memoize `ChartContext.Provider` in `components/ui/chart.tsx`
```tsx
const contextValue = React.useMemo(() => ({ config }), [config]);
return (
  <ChartContext.Provider value={contextValue}>
    ...
  </ChartContext.Provider>
);
```

#### Fix 7: Hardened `theme-context.tsx`
```tsx
useEffect(() => {
  try {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      return;
    }
  } catch {}

  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setTheme("dark");
  }
}, []);

// Add storage listener for multi-tab synchronization:
useEffect(() => {
  const onStorage = (e: StorageEvent) => {
    if (e.key === "theme" && (e.newValue === "light" || e.newValue === "dark")) {
      setTheme(e.newValue);
    }
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}, []);
```

#### Fix 8: Open Redirect Sanitization in `app/component/login-page.tsx`
```tsx
const params = new URLSearchParams(window.location.search);
const rawRedirect = params.get("redirect") || "/";
const isSafeRedirect = rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") && !rawRedirect.includes(":");
const redirectUrl = isSafeRedirect ? rawRedirect : "/";
window.location.href = redirectUrl;
```

#### Fix 9: Fix Test Queries in `__tests__/tiers/tier1-feature-coverage.test.tsx`
1. For F1-1: Use `screen.getByRole("navigation", { name: /메인/i })` or disambiguate from the footer `<nav aria-label="푸터 사이트 네비게이션">`.
2. For F1-5: Use `screen.getAllByText(SITE.name)[0]` to handle duplicate responsive brand elements.

#### Fix 10: Next.js Configuration Hardening in `next.config.ts`
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "framer-motion", "date-fns"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
```

---

## 5. Verification Method

To independently reproduce and verify these findings, execute the following commands in order:

### 1. Verify TypeScript Errors
```bash
npx tsc --noEmit
```
**Expected Failure**: Exits with code 2 and lists 5 errors in `__tests__/tiers/tier2-boundary-corner-cases.test.tsx` referencing missing `textColor` and `gridColor` properties on `AttendanceLineChart`, `SkillsRadarChart`, and `SparringBarChart`.  
**Pass Condition After Fix**: Exits with code 0 with 0 errors.

### 2. Verify Jest Test Failures & Timeout
```bash
npm test
```
**Expected Failure**: 2 suites fail (`tier1-feature-coverage.test.tsx` on navigation/brand queries, and `tier4-real-world-scenarios.test.tsx` timing out at 5,000 ms on Scenario 5).  
**Pass Condition After Fix**: 26/26 test suites pass with 100% success rate under 15 seconds.

### 3. Verify Clean Production Build
```bash
rm -rf .next && npm run build
```
**Pass Condition**: Compiles, checks types, and exports all 25 static pages cleanly with code 0.

### 4. Verify Open Redirect Security
1. Open browser to `/login?redirect=https://example.com`.
2. Submit valid credentials.
3. Confirm that the browser redirects to `/` instead of `https://example.com`.
