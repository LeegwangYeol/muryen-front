# Handoff Report — UI, Accessibility & Performance Adversarial Verification

**Agent**: `sweep_challenger_2` (Empirical Challenger: UI & Performance)  
**Handoff Type**: Hard (Verification Complete)  
**Milestone**: M4-D (Final Quality & Forensic Audit)  
**Verdict**: **APPROVE**

---

## 1. Observation

### Observation 1: Single Top-Level `<main>` Landmark; Zero Nested `<main>` Tags
- **Files**:
  - `components/layout/app-shell.tsx:32-44`
  - `app/error.tsx:23`
  - `app/not-found.tsx:23`
- **Verbatim Code**:
  - `app-shell.tsx:32-44`:
    ```tsx
    <main
      id="main"
      style={{ paddingTop: "calc(3.5rem + env(safe-area-inset-top))" }}
      className={`flex-1 transition-all duration-300 md:!pt-0 ${
        isNavExpanded ? "md:ml-64" : "md:ml-24"
      }`}
    >
      {children}
      <Footer />
    </main>
    ```
  - `app/error.tsx:23`:
    ```tsx
    <section aria-labelledby="error-heading" className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12 text-[rgb(var(--foreground))]">
    ```
  - `app/not-found.tsx:23`:
    ```tsx
    <section aria-labelledby="not-found-heading" className="min-h-screen flex items-center justify-center px-4 py-12 text-[rgb(var(--foreground))]">
    ```
- **Static Code Search**:
  - Regex search `<\s*main(\s|>|$)` across the entire codebase matches only `components/layout/app-shell.tsx:32` in production code. No page component, route handler, or boundary renders a `<main>` tag.
- **Empirical Execution & DOM Inspection**:
  - Rendered `GlobalError` inside `AppShell`: `container.querySelectorAll("main").length === 1` (`#main`), with 0 nested `<main>` tags.
  - Rendered `NotFound` inside `AppShell`: `container.querySelectorAll("main").length === 1` (`#main`), with 0 nested `<main>` tags.
  - Rendered `Equipment` inside `AppShell`: `container.querySelectorAll("main").length === 1` (`#main`), with 0 nested `<main>` tags.

---

### Observation 2: Radix Dialog in `Equipment` Modal (Escape Key, Backdrop, Focus Trap)
- **Files**:
  - `app/component/equipment.tsx:115-151`
  - `components/ui/dialog.tsx:21-54`
- **Verbatim Code (`equipment.tsx`)**:
  ```tsx
  <Dialog
    open={!!selectedEquipment}
    onOpenChange={(open) => {
      if (!open) closeModal();
    }}
  >
    {selectedEquipment && (
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            {selectedEquipment.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {selectedEquipment.description}
          </DialogDescription>
        </DialogHeader>
        ...
        <DialogFooter>
          <Button asChild>
            <a href={selectedEquipment.purchase} target="_blank" rel="noopener noreferrer">
              <ShoppingBasket className="mr-2 h-4 w-4" /> 구매하기
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    )}
  </Dialog>
  ```
- **Empirical Execution Results**:
  1. **Escape Key**: Triggering `await user.keyboard("{Escape}")` while the modal is open immediately invokes `onOpenChange(false)` -> `closeModal()`, cleanly removing `role="dialog"` from the DOM (`expect(screen.queryByRole("dialog")).not.toBeInTheDocument()`).
  2. **Backdrop / Overlay Click**: Triggering `pointerDown` + `click` on `document.querySelector(".fixed.inset-0.bg-black\\/80")` dismisses the dialog immediately.
  3. **Focus Trap & Accessibility**:
     - `role="dialog"` is rendered with accessible name linked to `DialogTitle`.
     - `DialogDescription` is present with `sr-only` to comply with Radix / WCAG accessibility expectations.
     - `data-radix-focus-guard` elements (2 guard spans) surround the dialog boundaries to intercept and contain focus within the modal.
     - `data-scroll-locked="1"` is added to `document.body` while the dialog is open to prevent background scrolling.

---

### Observation 3: `VideoCircle` Edge Cases (Empty Array `[]`, Undefined, Null)
- **File**: `app/component/video-circle.tsx:23-25, 151-160`
- **Verbatim Code**:
  ```tsx
  export default function VideoCircle({ videos = [] }: VideoCircleProps) {
    const radius = 250;
    const totalVideos = videos?.length ?? 0;
    ...
    {videos.map((video, index) => {
      const angle =
        totalVideos > 0
          ? (index / totalVideos) * 2 * Math.PI + (rotation * Math.PI) / 180
          : 0;
      const x = currentRadius * Math.cos(angle);
      const y = currentRadius * Math.sin(angle);
  ```
- **Empirical Execution Results**:
  1. **Empty Array (`videos = []`)**:
     - Rendered `<VideoCircle videos={[]} />`.
     - Result: `totalVideos` is 0. Array `map` iterates 0 times.
     - Inspecting `container.innerHTML`: Contains **zero `NaN`**, zero unhandled exceptions.
  2. **Undefined (`videos = undefined`)**:
     - Rendered `<VideoCircle videos={undefined as any} />`.
     - Result: Default parameter `videos = []` activates.
     - Inspecting `container.innerHTML`: Contains **zero `NaN`**, zero unhandled exceptions.
  3. **Null (`videos = null as any`)**:
     - TypeScript compile-time: Statically rejected by TypeScript (`Type 'null' is not assignable to type 'CircleItem[]'`).
     - Runtime if forced: ES6 default parameter `{ videos = [] }` does not trigger on `null`. Line 152 `videos.map(...)` throws `TypeError: Cannot read properties of null (reading 'map')`.
     - Production callers: `app/component/home-client.tsx:112` passes `mockVideos` (a hardcoded array of 3 elements), so `null` is never passed at runtime.

---

### Observation 4: TypeScript Validation, Test Suite Execution Time & Build
- **`npx tsc --noEmit`**:
  - Output: Exited with code `0`. 0 errors.
- **`npm test`**:
  - Test Suites: `28 passed, 28 total`
  - Tests: `222 passed, 222 total`
  - Snapshots: `0 total`
  - Execution Time: **4.502 seconds** (well under the 10-second threshold)
  - Zero timeouts, zero test failures.
- **`npm run lint`**:
  - Output: `✔ No ESLint warnings or errors`. Exited with code `0`.
- **`npm run build`**:
  - Output: Next.js 15.5.15 compiled successfully in 2.8s.
  - Generated all 25 static and dynamic routes (`25/25`). Exited with code `0`.

---

## 2. Logic Chain

1. **DOM Landmark Validation**:
   - W3C and WCAG guidelines mandate that a document must have at most one top-level `<main>` landmark element to define the primary content of the document.
   - `components/layout/app-shell.tsx` establishes this landmark at `<main id="main">`.
   - By verifying that `app/error.tsx` and `app/not-found.tsx` use `<section aria-labelledby="...">` instead of `<main>`, and checking that no child pages render `<main>`, we confirm that the rendered document has strictly one `<main>` landmark with zero nesting.

2. **Modal Dialog A11y & Focus Trapping**:
   - The Radix UI `<Dialog>` primitive was adopted in `app/component/equipment.tsx` to replace manual dialog rendering.
   - Radix primitives wire native event listeners to capture `Escape` keydowns and outside pointer events on the backdrop overlay, calling `onOpenChange(false)`.
   - Empirical interaction with `@testing-library/user-event` confirmed both `Escape` keypress and overlay `pointerDown` cleanly unmount the dialog.
   - Radix `FocusScope` injects `data-radix-focus-guard` elements before and after the portal, ensuring keyboard focus is trapped within the dialog while active.

3. **VideoCircle Numerical Stability & Edge Handling**:
   - `totalVideos = videos?.length ?? 0` combined with `totalVideos > 0 ? (index / totalVideos) ... : 0` completely prevents division-by-zero that previously generated `NaN` in CSS translate expressions.
   - Both empty array `[]` and `undefined` default seamlessly to empty items without rendering artifacts.
   - While `videos = null as any` can trigger a `TypeError` if TypeScript safety is bypassed, TypeScript's `strict: true` type checker enforces non-nullability across all codebase call sites.

4. **Performance & Compilation Reliability**:
   - Zero TypeScript compilation errors (`tsc --noEmit`).
   - The full test suite of 222 tests runs in 4.5 seconds—less than half of the 10-second limit—demonstrating no runaway loops, unhandled timers, or expensive reflows during test execution.
   - Production build compiles 25/25 routes with zero warnings.

---

## 3. Caveats

1. **Low-Risk Defensive Hardening for `VideoCircle`**:
   - If `VideoCircle` is ever connected to dynamic backend APIs in the future that return `{ videos: null }`, line 152 `{videos.map(...)}` could throw. Changing line 152 to `{(videos ?? []).map(...)}` or `videos?.map(...)` would provide complete runtime defensive immunity. In current code, this is non-blocking because all callers pass non-null arrays and TypeScript forbids `null`.
2. **Headless Browser vs Real GPU Rendering**:
   - Tests were executed in Jest JSDOM with mocked `matchMedia`. Visual WebGL particle canvas rendering (`VantaBackground`) was mocked or bypassed as expected in JSDOM unit environments.

---

## 4. Conclusion

### **VERDICT: APPROVE**

The application satisfies all UI, accessibility, edge-case, TypeScript, and performance requirements:
1. **DOM Landmark Structure**: Conforms strictly to W3C ARIA landmarks; zero nested `<main>` tags.
2. **Equipment Modal**: Fully accessible Radix Dialog responding correctly to Escape key, overlay backdrop clicks, and focus traps.
3. **VideoCircle**: Completely resilient against empty arrays and undefined; zero `NaN` occurrences.
4. **TypeScript & Performance**: Zero TypeScript compiler errors; 28/28 test suites (222/222 tests) pass in 4.502s (<10s limit); clean production build.

---

## 5. Verification Method

To independently verify these empirical results:

1. **Run TypeScript Compiler Check**:
   ```bash
   npx tsc --noEmit
   ```
   *Expected*: Code 0, zero errors.

2. **Run Full Test Suite & Measure Execution Time**:
   ```bash
   time npm test
   ```
   *Expected*: 28 passed, 222 passed, execution time < 10 seconds.

3. **Verify DOM Landmark Uniqueness**:
   ```bash
   # Confirm no <main> tags exist outside components/layout/app-shell.tsx
   grep -rn "<main" app/ components/
   ```
   *Expected*: Only `components/layout/app-shell.tsx:32: <main id="main">`.

4. **Verify ESLint & Production Build**:
   ```bash
   npm run lint
   npm run build
   ```
   *Expected*: 0 lint warnings, 25/25 static/dynamic routes compiled cleanly.
