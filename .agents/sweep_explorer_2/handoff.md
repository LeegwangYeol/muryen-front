# Forensic UI, Layout, Hydration, and Component Audit Report

**Explorer**: `sweep_explorer_2` (UI & Hydration Explorer)  
**Target Application**: `muryen-front` (Next.js 15.5.15 App Router, React 18.2.0, TypeScript 5, Tailwind CSS 3.4.1)  
**Date**: 2026-09-09  
**Status**: Investigation Complete (Read-Only)

---

## 1. Observation

### 1.1 Automated Test Execution Failure
- **Command**: `npm test`
- **Result**: `Test Suites: 1 failed, 25 passed, 26 total. Tests: 2 failed, 199 passed, 201 total.`
- **Failure 1**: `__tests__/tiers/tier1-feature-coverage.test.tsx:53:21`
  ```text
  TestingLibraryElementError: Found multiple elements with the role 'navigation'
  ```
  Inside `<AppShell>`:
  1. `<Navigation onExpand={setIsNavExpanded} />` (`app/component/navigation.tsx:131`) renders `<nav className="...">` with **no `aria-label`**.
  2. `<Footer />` (`components/layout/footer.tsx:179`) renders `<nav className="sm:hidden" aria-label="사이트맵">`.
  3. Assistive technologies and `screen.getByRole("navigation")` encounter multiple navigation landmarks without distinguishing names.
- **Failure 2**: `__tests__/tiers/tier1-feature-coverage.test.tsx:108:21`
  ```text
  TestingLibraryElementError: Found multiple elements with the text: 무련
  ```
  In `components/layout/footer.tsx:59-65` (mobile header, `sm:hidden`) and `components/layout/footer.tsx:114-121` (desktop header, `hidden sm:grid`), `{SITE.name}` ("무련") is rendered in two parallel blocks, causing duplicate text matches.

---

### 1.2 Invalid HTML & Nested `<main>` Landmark Structure
- **Observation**:
  - `app/layout.tsx:399`: `<AppShell>{children}</AppShell>`
  - `components/layout/app-shell.tsx:32-43`:
    ```tsx
    <main
      id="main"
      style={{ paddingTop: "calc(3.5rem + env(safe-area-inset-top))" }}
      className={`flex-1 transition-all duration-300 md:!pt-0 ${isNavExpanded ? "md:ml-64" : "md:ml-24"}`}
    >
      {children}
      <Footer />
    </main>
    ```
  - `app/error.tsx:23`:
    ```tsx
    <main className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12 text-[rgb(var(--foreground))]">
    ```
  - `app/not-found.tsx:23`:
    ```tsx
    <main className="min-h-screen flex items-center justify-center px-4 py-12 text-[rgb(var(--foreground))]">
    ```
- **Consequence**: In Next.js App Router, `app/error.tsx` and `app/not-found.tsx` render as `{children}` inside `app/layout.tsx`. Both files render `<main>` inside `AppShell`'s `<main id="main">`. This directly violates W3C HTML5 §4.4.1 ("a `<main>` element cannot be a descendant of another `<main>` element") and creates conflicting ARIA `main` landmarks.

---

### 1.3 Tailwind Responsive Font-Size Class Collisions
- **Observation**:
  - `app/component/patten-page.tsx:122-124`:
    ```tsx
    className={`text-2xl sm:text-xl sm:text-2xl md:text-3xl md:text-4xl font-bold mb-6 sm:mb-12 text-center ${
      theme === "dark" ? "text-white" : "text-gray-900"
    }`}
    ```
  - `app/component/sparring-page.tsx:120-122`:
    ```tsx
    className={`text-2xl sm:text-xl sm:text-2xl md:text-3xl md:text-4xl font-bold mb-6 sm:mb-12 text-center ${
      theme === "dark" ? "text-white" : "text-gray-900"
    }`}
    ```
- **Consequence**: Both headings specify conflicting duplicate breakpoint utility classes: `sm:text-xl` alongside `sm:text-2xl`, and `md:text-3xl` alongside `md:text-4xl`. The winning font-size is arbitrary based on generated CSS declaration order.

---

### 1.4 Desktop Navigation Sidebar Overflow & Vertical Collision
- **Observation**:
  - `app/component/navigation.tsx:131-257`:
    `Navigation` is styled with `h-screen fixed top-0 left-0 z-50`.
    At lines 206-256: `<div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">` anchors YouTube/Instagram links and the logout button.
    The menu list (`<ul className="space-y-2">`, lines 189-205) renders 9 menu items + top header + theme switch button without any `overflow-y-auto` or height constraint.
- **Consequence**: On displays with vertical height under 800px (standard laptops 1366x768, tablets in landscape, or browser windows docked horizontally), the bottom menu items ("수련일지", "입회 안내", "나의 수련 (My)") collide with and are occluded by the absolute bottom container.

---

### 1.5 Duplicate Theme Toggle Controls in Navigation
- **Observation**:
  - `app/component/navigation.tsx:160-171`: Circular button `<button onClick={toggleTheme} className="flex items-center justify-center w-10 h-10 rounded-full border ...">`
  - `app/component/navigation.tsx:175-188`:
    ```tsx
    {isExpanded && (
      <button
        onClick={toggleTheme}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 mb-3 rounded-lg text-xs font-medium border ..."
      >
        {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
        <span>{theme === "light" ? "다크 모드" : "라이트 모드"}</span>
      </button>
    )}
    ```
- **Consequence**: When the sidebar is expanded (default view), two theme toggle buttons are rendered stacked directly on top of each other.

---

### 1.6 Modal Dialog Accessibility & UX Flaws in `Equipment`
- **Observation**:
  - `app/component/equipment.tsx:108-138`:
    ```tsx
    {selectedEquipment && (
      <div ref={modalRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-5 sm:p-8 rounded-lg max-w-2xl w-full">
          ...
          <Button onClick={closeModal} variant="ghost">
            <X className="h-6 w-6" />
          </Button>
          ...
          <Button asChild>
            <a href={selectedEquipment.purchase} target="_blank" rel="noopener noreferrer">
              <ShoppingBasket className="mr-2 h-4 w-4" /> 구매하기
            </a>
          </Button>
        </div>
      </div>
    )}
    ```
- **Consequence**:
  1. **No Backdrop Click**: The overlay `<div>` does not have an `onClick={closeModal}` handler. Clicking outside the modal does not close it.
  2. **No Escape Listener**: Pressing the `Escape` key does nothing.
  3. **No Focus Trap**: Tab key navigates behind the modal into background DOM.
  4. **No ARIA Semantics**: Missing `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
  5. **No Accessible Name on Close**: Close button `<X className="h-6 w-6" />` has no `aria-label="닫기"`.
  6. **No Dark Mode Support**: Hardcoded `bg-white` renders a glaring white box in dark mode.
  7. **Dummy Purchase URLs**: Lines 34, 44, 54 link to `https://example.com/traditional-armor`, etc.

---

### 1.7 Mobile Navigation Drawer Flaws in `MobileNav`
- **Observation**:
  - `components/layout/mobile-nav.tsx:124-245`: Drawer is implemented via `<motion.aside>` in `<AnimatePresence>`.
  - **Missing Escape Key Handler**: No keydown listener closes the drawer.
  - **Missing Focus Trap**: Tabbing cycles through hidden elements behind the drawer.
  - **Missing Body Scroll Lock**: Touch-scrolling the drawer scrolls the background page body.
  - **Missing Role**: Lacks `role="dialog"` or `aria-modal="true"`.

---

### 1.8 ChatWidget Escape Key & Focus Restoration
- **Observation**:
  - `components/chat/chat-widget.tsx:128-287`: Declares `role="dialog"`, but pressing Escape does not close the panel. Closing does not return focus to the trigger button (`bottom-5 right-5`). If `send()` throws, `input` state is wiped prior to sending, causing loss of user input.

---

### 1.9 VideoCircle Keyboard Inaccessibility & NaN Divide-by-Zero
- **Observation**:
  - `app/component/video-circle.tsx:173-198`: Circular items are `<div className="... cursor-pointer" onClick={() => setSelected(video)}>`.
  - **Keyboard Inaccessible**: Not focusable (`tabIndex` absent), no `role="button"`, no `onKeyDown` handler.
  - **NaN Vulnerability** (`app/component/video-circle.tsx:25, 153`):
    ```ts
    const totalVideos = videos.length;
    const angle = (index / totalVideos) * 2 * Math.PI + (rotation * Math.PI) / 180;
    ```
    If `videos` is an empty array `[]`, `index / totalVideos` produces `0 / 0 = NaN`, resulting in `transform: translate(NaNpx, NaNpx)`.
    If `videos` is undefined, `videos.length` throws `TypeError: Cannot read properties of undefined`.

---

### 1.10 PhotoGrid Accessibility & Empty Array State
- **Observation**:
  - `app/component/photo-grid.tsx:45-59`: Filter buttons lack `aria-pressed={isActive}`. Screen reader users cannot tell which category filter is active.
  - If `photos` is empty, an empty grid renders with zero feedback.

---

### 1.11 Raw Non-Clickable External URL in `ReferencePage`
- **Observation**:
  - `app/component/reference-page.tsx:41-42`:
    ```ts
    details: [
      "본격적인 방호구",
      "수련은 평상복 및 갑주를 입은 상태에서도 이뤄짐",
      "평상복, 갑주 어느쪽을 입던 동일한 움직임이 나와야함",
      "https://armours.pro/",
    ]
    ```
  - Rendered at line 108 as `<Body as="span" size="sm">{detail}</Body>`. Users cannot click the URL.

---

### 1.12 Hardcoded Rickroll Demo Video in Public Route
- **Observation**:
  - `app/component/patten-page.tsx:160-164`:
    ```tsx
    <InteractivePlayer 
      url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
      title="본국검 투로 시연 (예시 영상)" 
    />
    ```
  - Hardcoded URL is Rick Astley ("Never Gonna Give You Up").

---

### 1.13 Hanja Branding Discrepancy
- **Observation**:
  - `lib/contact.ts:4`: `hanja: "武聯"` (Military Union / Federation)
  - `components/layout/footer.tsx:64, 120`: `{SITE.name} <span className="opacity-60">{SITE.hanja}</span>` (renders 武聯)
  - `app/layout.tsx:43, 82, 96, 128, 172, 199`, `app/not-found.tsx:29`, `app/component/hero.tsx:18`, `app/component/home-client.tsx:57`, `app/component/about-page.tsx:36`: `武緣` (Martial Destiny / Bond)
- **Consequence**: The site alternately displays 武緣 and 武聯.

---

### 1.14 Open Redirect Vulnerability in `LoginPage`
- **Observation**:
  - `app/component/login-page.tsx:32-36`:
    ```ts
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get("redirect") || "/";
    window.location.href = redirectUrl;
    ```
- **Consequence**: Navigating to `/login?redirect=https://evil.com` or `javascript:...` executes an external redirection upon login without validating that the target is a relative local path.

---

### 1.15 LoginPage Missing Form Labels & Dead Links
- **Observation**:
  - `app/component/login-page.tsx:65-75, 78-88`: `<Input type="text" placeholder="아이디" />` and `<Input type="password" placeholder="비밀번호" />` have no `<label>` or `aria-label`. Placeholder is not an accessible label (WCAG 2.1 SC 3.3.2).
  - Lines 122 & 133: `<a href="#">비밀번호를 잊으셨나요?</a>` and `<a href="#">회원가입</a>` cause jump-to-top hash changes.

---

### 1.16 NextAuth Redirect Route Mapped to Test Page
- **Observation**:
  - `app/api/auth/[...nextauth]/route.ts:43`:
    ```ts
    pages: {
      signIn: "/test2",
    },
    ```
- **Consequence**: NextAuth sign-in redirects to `/test2` ("YouTube Comment Manager") instead of `/login`.

---

### 1.17 Unused / Test Files in Production Scope
- `app/component/styles.tsx`: Unused dead component with placeholder Latin text ("Lorem ipsum...") and unrelated martial arts ("Taekwondo", "Hapkido").
- `app/component/animated-image.tsx`: Unused dead component with unhandled Promise rejection on `videoRef.current.play()`.
- `app/know-how/page.tsx`: Stub route returning `<div>KnowHow</div>`.
- `app/location/page.tsx`: Stub route returning `<div>Location</div>`.
- `app/test/page.tsx` & `app/test/wma.ts`: VAD test scratchpad that does not clean up MediaStream / AudioContext on unmount.
- `app/test2/page.tsx`: YouTube comment API testing scratchpad.
- `app/daily/page.tsx`: Lacks metadata, has English heading ("User Activity Record") and English commit wording ("commits on...") rather than martial arts training record terms.
- `app/mypage/page.tsx`: Unprotected route rendering static mock user dashboard.

---

### 1.18 Build Verification
- **Command**: `rm -rf .next && npx next build`
- **Result**: `✓ Compiled successfully in 26.9s. ✓ Generating static pages (25/25). Exit code: 0`.
- **Note**: An earlier non-clean run failed with `ENOENT: .next/server/pages-manifest.json` due to corrupted stale build artifacts. A clean build compiles 100% cleanly.

---

## 2. Logic Chain

1. **Test Failures ↔ Semantic Landmark & Text Ambiguity**:
   - `Navigation` has no `aria-label`. When combined with `Footer`'s `<nav aria-label="사이트맵">` and `MobileNav`, multiple navigation landmarks exist. Testing Library throws `Found multiple elements with the role 'navigation'`. Adding `aria-label="주요 내비게이션"` satisfies WCAG 1.3.1 and eliminates the failure.
   - `Footer` renders `SITE.name` ("무련") in both mobile and desktop viewports simultaneously. In a jsdom test environment where CSS media queries are ignored, both elements are in the DOM, failing `getByText(SITE.name)`. Using `getAllByText` in tests or unifying the header solves this.

2. **Nested `<main>` ↔ Root AppShell Hierarchy**:
   - Next.js App Router nests route pages inside `app/layout.tsx`. Because `app/layout.tsx` embeds `<AppShell>` which contains `<main id="main">`, any page route or error boundary that returns `<main>` creates an illegal `<main><main>...</main></main>` hierarchy. Converting `app/error.tsx` and `app/not-found.tsx` to `<section>` or `<div>` eliminates this violation.

3. **Font-Size Collision ↔ CSS Cascade Race Condition**:
   - Tailwind utility classes like `sm:text-xl` and `sm:text-2xl` map to `@media (min-width: 640px) { font-size: ... }`. When both are present on the same element, the rule that appears later in the generated CSS bundle wins. Removing the duplicates guarantees consistent typography.

4. **Desktop Sidebar Occlusion ↔ Absolute Layout Constraint**:
   - The desktop navigation sidebar is `h-screen fixed`. The social links container is anchored with `absolute bottom-4`. The list of 9 menu items above it lacks `overflow-y-auto`. When screen height is smaller than the combined height of header + items + bottom container (~780px), DOM elements physically overlap, making bottom items unclickable.

5. **Modal Trap & A11y ↔ Hand-Rolled DOM Overlays**:
   - `app/component/equipment.tsx` implements a custom modal without keyboard listeners, focus management, or ARIA attributes. Replacing it with the Radix UI `Dialog` primitive (`components/ui/dialog.tsx`) provides automatic Escape key handling, focus trap, and screen reader announcements.

6. **Security & Redirection ↔ Unvalidated Query Parameters**:
   - `LoginPage` reads `new URLSearchParams(window.location.search).get("redirect")` and assigns it directly to `window.location.href`. An attacker can construct a phishing URL `https://muryen.com/login?redirect=https://evil.com`. Validating that the URL begins with `/` and not `//` prevents external open redirects.

---

## 3. Caveats

1. **Next.js App Router Root Layout Execution**:
   - `app/layout.tsx` is a Server Component and cannot use `useTheme` or client-side hooks directly. The inline `<Script id="theme-init">` and `suppressHydrationWarning` on `<html>` successfully prevent client hydration errors.
2. **Third-Party CDN Scripts**:
   - `VantaBackground` and `VadAnalyzer` dynamically load external scripts from CDNs (`cdnjs`, `jsdelivr`). If the client has no internet connection, these features gracefully fall back without breaking core site rendering.
3. **No Code Modification**:
   - As per the read-only mandate, no source files were modified during this investigation. All remediation steps below are concrete proposals ready for execution.

---

## 4. Conclusion & Concrete Fix Inventory

| ID | File Path | Line(s) | Severity | Category | Remediation Action |
|:---|:---|:---:|:---:|:---|:---|
| **BUG-01** | `app/component/navigation.tsx` | 131 | **High** | A11y / Test | Add `aria-label="주요 내비게이션"` to `<nav>` in `Navigation`. |
| **BUG-02** | `app/error.tsx` | 23, 57 | **High** | HTML / A11y | Replace `<main>` with `<section aria-labelledby="error-heading">` to prevent nested `<main>` tags inside `AppShell`. |
| **BUG-03** | `app/not-found.tsx` | 23, 59 | **High** | HTML / A11y | Replace `<main>` with `<section aria-labelledby="not-found-heading">` to prevent nested `<main>` tags inside `AppShell`. |
| **BUG-04** | `app/component/patten-page.tsx` | 122 | **Medium** | Visual / CSS | Replace `text-2xl sm:text-xl sm:text-2xl md:text-3xl md:text-4xl` with `text-2xl sm:text-3xl md:text-4xl`. |
| **BUG-05** | `app/component/sparring-page.tsx` | 120 | **Medium** | Visual / CSS | Replace `text-2xl sm:text-xl sm:text-2xl md:text-3xl md:text-4xl` with `text-2xl sm:text-3xl md:text-4xl`. |
| **BUG-06** | `app/component/navigation.tsx` | 189–205 | **High** | UI / Layout | Add `overflow-y-auto max-h-[calc(100vh-220px)]` to the navigation `<ul>` to prevent vertical occlusion on small screens. |
| **BUG-07** | `app/component/navigation.tsx` | 160–188 | **Low** | UI / Polish | Remove the redundant wide theme toggle button or hide the circular toggle when `isExpanded` is true. |
| **BUG-08** | `app/component/equipment.tsx` | 108–138 | **High** | A11y / Modal | Migrate hand-rolled modal to Radix UI `<Dialog>` (`components/ui/dialog.tsx`) to get focus trap, Escape key handling, backdrop click, and dark mode support. |
| **BUG-09** | `components/layout/mobile-nav.tsx` | 124–245 | **Medium** | A11y / Modal | Add `keydown` Escape handler, body scroll lock (`overflow: hidden`), and `role="dialog"` to mobile drawer. |
| **BUG-10** | `components/chat/chat-widget.tsx` | 128–287 | **Medium** | A11y / UX | Add `keydown` Escape listener, return focus to trigger button on close, and retain `input` on API error. |
| **BUG-11** | `app/component/video-circle.tsx` | 23–25, 173 | **High** | A11y / Edge Case | Add default `videos = []`, guard `totalVideos === 0` against `0/0 = NaN`, and convert interactive circle `div` to `<button type="button">` or add `role="button"` and `tabIndex={0}`. |
| **BUG-12** | `app/component/photo-grid.tsx` | 45–59, 63 | **Medium** | A11y / Edge Case | Add `aria-pressed={isActive}` to category buttons and render empty state fallback if `filtered.length === 0`. |
| **BUG-13** | `app/component/reference-page.tsx` | 41 | **Low** | Content / UX | Convert raw text `"https://armours.pro/"` into an external hyperlink `<a href="https://armours.pro/" ...>`. |
| **BUG-14** | `app/component/patten-page.tsx` | 161 | **Low** | Content | Replace Rickroll YouTube link with an official Muryen video asset. |
| **BUG-15** | `lib/contact.ts` | 4 | **Medium** | Branding | Harmonize `hanja: "武聯"` to `"武緣"` to match the entire site branding. |
| **BUG-16** | `app/component/login-page.tsx` | 32–36 | **High** | Security | Validate `redirectUrl.startsWith("/") && !redirectUrl.startsWith("//")` to prevent open redirects. |
| **BUG-17** | `app/component/login-page.tsx` | 65–88, 122 | **Medium** | A11y / UX | Add `aria-label="아이디"` and `aria-label="비밀번호"`; replace dead `#` anchors. |
| **BUG-18** | `app/api/auth/[...nextauth]/route.ts` | 43 | **High** | Auth Config | Change `pages: { signIn: "/test2" }` to `signIn: "/login"`. |
| **BUG-19** | `components/layout/footer.tsx` | 219, 222 | **Low** | Hydration | Add `suppressHydrationWarning` to the dynamic year span `new Date().getFullYear()`. |
| **BUG-20** | `app/know-how`, `app/location`, `app/test*` | Various | **Medium** | Housekeeping | Remove or properly flesh out stub routes (`know-how`, `location`) and test scratchpads (`test`, `test2`, `styles.tsx`, `animated-image.tsx`). |
| **BUG-21** | `__tests__/tiers/tier1-feature-coverage.test.tsx` | 53, 108 | **Medium** | Testing | Update test queries to `getByRole("navigation", { name: "주요 내비게이션" })` and `getAllByText(SITE.name)[0]`. |

---

## 5. Verification Method

1. **Unit & Integration Test Suite**:
   ```bash
   npx jest __tests__/tiers/tier1-feature-coverage.test.tsx
   npm test
   ```
   - Verify `F1-1` and `F1-5` pass once `aria-label="주요 내비게이션"` is applied to `Navigation` and duplicate text query is resolved.
2. **ESLint Verification**:
   ```bash
   npm run lint
   ```
   - Must output: `✔ No ESLint warnings or errors`.
3. **Production Clean Build Verification**:
   ```bash
   rm -rf .next && npm run build
   ```
   - Must generate all 25 static & dynamic routes and output `✓ Generating static pages (25/25)` with exit code 0.
4. **HTML Hierarchy Verification**:
   - Inspect DOM of `/error` and `/not-found` in browser or test runner; confirm zero instances of `<main>` inside `<main id="main">`.
5. **Responsive Viewport Verification**:
   - In browser DevTools, resize viewport to `1024x600` and `768x500`; verify desktop sidebar menu scrolls smoothly without hiding items behind the bottom social links.
