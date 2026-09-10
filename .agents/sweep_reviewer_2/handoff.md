# Handoff Report: UI, Accessibility & Performance Review (Sweep Reviewer 2)

**Reviewer Agent**: `sweep_reviewer_2` (Roles: reviewer, critic)  
**Parent Agent**: `orchestrator_3` (`3bd27fc9-f7f8-43dc-a3fc-72134db9387e`)  
**Target Work Products**: Implementations from Worker M4-B and Worker M4-C  
**Working Directory**: `/Users/a7890/src/muryen-front/.agents/sweep_reviewer_2`  
**Date**: 2026-09-09  
**Verdict**: **APPROVE**  
**Integrity Status**: **CLEAN (No integrity violations detected)**  

---

## 1. Observation

### 1.1 Navigation & Landmark Accessibility (`app/component/navigation.tsx`)
- **Observation**:
  - Line 131-132: `<nav aria-label="주요 내비게이션" className="...">` successfully adds a semantic landmark with an accessible name.
  - Line 175: `<ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-220px)]">` introduces an explicit vertical scroll constraint preventing link overflow and clipping on displays with vertical height <800px.
  - Lines 161-172: Theme toggle is consolidated into a single accessible button (`aria-label={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}` and matching `title`). The previous duplicate toggle rendered when `isExpanded` was true has been cleanly removed.
  - Navigation landmark no longer conflicts with `<Footer>`'s mobile navigation landmark `<nav className="sm:hidden" aria-label="사이트맵">`.

### 1.2 Error Boundary & 404 Landmark Hygiene (`app/error.tsx`, `app/not-found.tsx`)
- **Observation**:
  - `app/error.tsx:23`: Root element is `<section aria-labelledby="error-heading" className="...">` with `<h1 id="error-heading">`.
  - `app/not-found.tsx:23`: Root element is `<section aria-labelledby="not-found-heading" className="...">` with `<h1 id="not-found-heading">`.
  - Global codebase search (`grep -rn "<main"`) confirms exactly ONE `<main>` tag exists in the entire application: `components/layout/app-shell.tsx:32` (`<main id="main">`).
  - No nested `<main>` tags remain anywhere in the codebase, ensuring full compliance with W3C HTML5 §4.4.1.

### 1.3 Modal Modernization (`app/component/equipment.tsx`)
- **Observation**:
  - The hand-rolled fixed `<div>` modal was completely replaced with Radix UI `<Dialog>` primitives (`components/ui/dialog.tsx`).
  - Implements `Dialog`, `DialogContent`, `DialogDescription` (with `className="sr-only"` for screen reader compliance), `DialogHeader`, `DialogTitle`, and `DialogFooter`.
  - Container sizing `max-w-2xl max-h-[90vh] overflow-y-auto` guarantees responsive behavior on small screens.
  - Utilizes semantic design tokens (`text-muted-foreground`, `bg-muted`, `text-foreground`) providing native dark mode support.
  - Built-in Radix focus trapping, Escape key dismissal, and backdrop click handling were empirically verified via Jest test suite `__tests__/components/equipment.test.tsx`.

### 1.4 TypeScript Soundness & Dashboard Charts (`components/dashboard/stat-charts.tsx`)
- **Observation**:
  - `AttendanceLineChart`, `SkillsRadarChart`, and `SparringBarChart` make `textColor?: string` and `gridColor?: string` optional with robust default expressions:
    ```typescript
    textColor = isDark ? "#e5e7eb" : "#374151",
    gridColor = isDark ? "#374151" : "#e5e7eb"
    ```
  - All three components are wrapped in `React.memo` to eliminate redundant SVG canvas recalibrations.
  - `npx tsc --noEmit` exits with code 0 (5 previous `TS2739` errors in `tier2-boundary-corner-cases.test.tsx` completely resolved).

### 1.5 Performance Thrashing & DOM Bloat Fixes (`app/component/record-graph.tsx`, `app/component/donut-chart.tsx`)
- **Observation**:
  - `app/component/record-graph.tsx`: Replaced 1,095+ separate Radix `<Tooltip>` wrappers with accessible native HTML `title` and `aria-label` attributes on `DayButton`.
  - `DayButton` and `YearGrid` wrapped in `React.memo`; `handleDateClick` wrapped in `useCallback`.
  - Reduced DOM tree size by >3,000 nodes, dropping Scenario 5 runtime in `tier4-real-world-scenarios.test.tsx` from >5,000ms timeout down to <1s.
  - `app/component/donut-chart.tsx`: Removed `useLayoutEffect` and `getBoundingClientRect()` from `Tooltip`, replacing it with pure JavaScript boundary clamping. Removed global `window` `mousemove` listener, replacing it with element-level `onMouseMove`. Removed redundant `TechniqueImages` 500x500 DOM elements.

### 1.6 Additional Hardening Inspected
- `app/component/video-circle.tsx`: Safe math `totalVideos > 0 ? (index / totalVideos) * ... : 0` prevents `0/0 = NaN`; added `role="button"`, `tabIndex={0}`, and Enter/Space `onKeyDown` handlers.
- `app/context/theme-context.tsx`: `localStorage.getItem` wrapped in `try/catch` with cross-tab `storage` event listener.
- `components/ui/chart.tsx`: Memoized `ChartContext.Provider` value with `React.useMemo`.
- `app/layout.tsx`: Removed heavy global CDN scripts (`onnxruntime-web`, `vad-web`).

### 1.7 Verification Commands Executed
- `npx tsc --noEmit`: Exited with code 0 (0 type errors).
- `npm test`: Exited with code 0 (28 suites passed, 222 tests passed in 7.5s).
- `npm run lint`: Exited with code 0 (0 warnings, 0 errors).
- `npm run build`: Exited with code 0 (compiled successfully in 2.9s; 25/25 static pages generated).

---

## 2. Logic Chain

1. **Accessibility Disambiguation**: By applying `aria-label="주요 내비게이션"` to the primary sidebar `<nav>`, assistive technologies and Testing Library queries can distinguish between the sidebar navigation and the footer sitemap (`<nav aria-label="사이트맵">`). This resolved the `TestingLibraryElementError` while enhancing screen reader navigation.
2. **HTML5 Semantic Validity**: Next.js App Router wraps all route components inside `components/layout/app-shell.tsx:32` (`<main id="main">`). By transforming `<main>` in `app/error.tsx` and `app/not-found.tsx` into `<section aria-labelledby="...">`, the DOM maintains exactly one `<main>` landmark per document, adhering strictly to W3C specification without altering visual presentation.
3. **Modal Modernization & Resilience**: Radix UI `<Dialog>` natively manages ARIA attributes (`role="dialog"`, `aria-modal="true"`), traps focus within the dialog container, restores focus on close, and provides Escape key dismissal. Migrating `equipment.tsx` to Radix UI resolves accessibility and theme bugs while ensuring consistent modal patterns across the application.
4. **Type Soundness & Fallbacks**: In `components/dashboard/stat-charts.tsx`, callers previously had to supply `textColor` and `gridColor` manually. Defaulting them conditionally based on `isDark` (`isDark ? "#e5e7eb" : "#374151"`) ensures full backward compatibility with callers that omit these props (such as test suites) while upholding strict TypeScript type safety.
5. **Layout Thrashing Elimination**: In `donut-chart.tsx`, invoking `getBoundingClientRect()` inside a `useLayoutEffect` on every mouse move triggered synchronous browser style and layout recalculation, followed by an immediate state update (`setPos`). Computing bounded offsets directly (`Math.max(12, Math.min(x + 18, ...))`) eliminates forced synchronous reflows completely.
6. **DOM Scalability**: In `record-graph.tsx`, instantiating 1,095+ stateful tooltip components consumed significant memory and degraded jsdom synthetic event performance. Relying on native browser `title` attributes combined with accessible `aria-label` retains complete user information and accessibility while eliminating thousands of DOM nodes.

---

## 3. Caveats

1. **Sidebar Collapse Button Accessible Name**: In `app/component/navigation.tsx:139`, the collapse chevron toggle button lacks an explicit `aria-label` (e.g., `aria-label={isExpanded ? "내비게이션 접기" : "내비게이션 펼치기"}`). Visual users see the chevron icon, but adding an explicit `aria-label` would provide optimal screen reader fidelity (logged as Minor Finding).
2. **DonutChart Tooltip Extreme Right Boundary**: In `app/component/donut-chart.tsx:90-96`, the tooltip horizontal clamping assumes a fixed boundary of 320px (`window.innerWidth - 320`), while the card max width is `min(90vw, 500px)`. On very wide desktop screens hovering at the extreme right edge, the right margin could touch the window edge before repositioning. Because `pointerEvents: "none"` is active, this causes no functional breakdown (logged as Minor Finding).

---

## 4. Quality Review

### Verdict: APPROVE

### Findings

#### [Minor] Finding 1: Collapse/Expand Sidebar Button Lacks Accessible Name
- **Where**: `app/component/navigation.tsx:139-148`
- **What**: The toggle button rendering `<ChevronLeft>` / `<ChevronRight>` does not specify an `aria-label`.
- **Why**: Screen readers will announce it simply as "button" without indicating its action.
- **Suggestion**: Add `aria-label={isExpanded ? "내비게이션 접기" : "내비게이션 펼치기"}` and matching `title`.

#### [Minor] Finding 2: Donut Chart Tooltip Boundary Clamping Dimension Assumption
- **Where**: `app/component/donut-chart.tsx:90-103`
- **What**: Clamping logic uses static `window.innerWidth - 320` while the tooltip has `w-[min(90vw,500px)]`.
- **Why**: Hovering near the extreme right edge of large viewports may render the right side of the tooltip near the viewport margin.
- **Suggestion**: Use `window.innerWidth - Math.min(500, window.innerWidth * 0.9) - 24` for precise boundary snapping.

### Verified Claims
- `aria-label="주요 내비게이션"` present on navigation `<nav>` → verified via `view_file` & Jest → **PASS**
- No nested `<main>` tags in `error.tsx` or `not-found.tsx` → verified via `grep` & AST review → **PASS**
- Radix UI Dialog migrated in `equipment.tsx` → verified via code inspection & `__tests__/components/equipment.test.tsx` → **PASS**
- Optional chart properties in `stat-charts.tsx` → verified via `npx tsc --noEmit` & `tier2-boundary-corner-cases.test.tsx` → **PASS**
- Performance fixes in `record-graph.tsx` and `donut-chart.tsx` → verified via `tier4-real-world-scenarios.test.tsx` (subsecond run) & code review → **PASS**
- Full build and test verification → verified via `npm test` (222/222 passed), `npm run lint` (0 warnings), `npm run build` (25/25 pages static) → **PASS**

### Coverage Gaps
- None. All 9 target files and associated test suites were inspected and verified.

### Unverified Items
- None. All tasks and test runs were directly executed in the local environment.

---

## 5. Adversarial Challenge & Stress-Testing

### Challenge Summary
**Overall Risk Assessment**: **LOW**

### Challenges

#### [Low] Challenge 1: Empty or Undefined Videos Dataset in VideoCircle
- **Assumption Challenged**: Component assumes `videos` always contains items.
- **Attack Scenario**: Render `<VideoCircle videos={[]} />` or `<VideoCircle />`.
- **Stress Test Result**:
  - `videos = []` default parameter handles omitted props.
  - `totalVideos = videos?.length ?? 0` evaluates to 0.
  - `totalVideos > 0 ? (index / totalVideos) * ... : 0` prevents `0/0 = NaN`.
  - Array mapping performs 0 iterations; no NaN coordinates injected into DOM.
  - **Result**: **PASS (Robust)**

#### [Low] Challenge 2: Unauthenticated / Sandboxed Storage Access in ThemeContext
- **Assumption Challenged**: `localStorage` is always readable and writable.
- **Attack Scenario**: Run in private browsing / sandboxed iframe where `localStorage.getItem` throws `SecurityError`.
- **Stress Test Result**:
  - `try { localStorage.getItem("theme") } catch { ... }` catches the exception.
  - Falls back gracefully to `window.matchMedia("(prefers-color-scheme: dark)")`.
  - **Result**: **PASS (Robust)**

#### [Low] Challenge 3: Extreme Cell Counts and Rapid Clicking in RecordGraph
- **Assumption Challenged**: 3 full years of cells (1,095+ buttons) could cause click lag or memory exhaustion.
- **Attack Scenario**: Click across day buttons rapidly in `tier4-real-world-scenarios.test.tsx`.
- **Stress Test Result**:
  - `DayButton` and `YearGrid` are wrapped in `React.memo`.
  - `handleDateClick` is wrapped in `useCallback`.
  - Only the target date state updates; 1,094 unclicked buttons do not re-render.
  - Jest suite completed in 833ms without memory spikes.
  - **Result**: **PASS (Robust)**

---

## 6. Integrity Verification

As required by the Reviewer and Adversarial Critic mandate, a thorough integrity check was performed:
1. **No Hardcoded Test Results**: Code in `stat-charts.tsx`, `donut-chart.tsx`, `record-graph.tsx`, and `equipment.tsx` implements genuine logic and calculations.
2. **No Dummy or Facade Implementations**: Radix UI Dialog is fully wired to state and user actions; landmark roles and accessibility attributes are authentic.
3. **No Task Bypasses**: All tasks specified in `ORIGINAL_REQUEST.md`, `PROJECT.md`, and `DISPATCH.md` were implemented properly within their respective file boundaries.
4. **No Fabricated Outputs**: All test suites (28/28 suites, 222/222 tests), TypeScript type check (0 errors), linter (0 warnings), and production build (25/25 static pages) were independently executed and confirmed.

---

## 7. Conclusion

The implementations delivered by Worker M4-B and Worker M4-C meet all architectural, accessibility, performance, and type-safety standards required by the project. All core test suites pass with 100% success rate, the linter reports zero warnings or errors, and the Next.js production build compiles cleanly in under 3 seconds.

Explicit Verdict: **APPROVE**.

---

## 8. Verification Method

To independently verify all findings in this report:

```bash
# 1. Verify TypeScript type checking (confirms 0 TS errors in stat-charts & tests)
npx tsc --noEmit

# 2. Verify all automated unit and integration tests (28 suites, 222 tests)
npm test

# 3. Verify ESLint compliance (0 warnings, 0 errors)
npm run lint

# 4. Verify Next.js production compilation and static page generation (25 static pages)
npm run build

# 5. Verify no nested <main> tags exist across the entire repository
grep -rn "<main" app/ components/
# Output must show only: components/layout/app-shell.tsx:32: <main id="main"
```
