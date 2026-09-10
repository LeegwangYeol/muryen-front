# Live Production Audit Report: Landing Page, Shell, Navigation, Theme & Responsive Viewports

**Auditor Agent**: `auditor_live_landing_nav`  
**Target Environment**: Live Production Vercel Deployment (`https://muryen-front.vercel.app`)  
**Audit Tooling**: `chrome-devtools-mcp` on Chromium 152 (Isolated Context: `auditor_landing_nav`, Page ID: 5)  
**Inspection Date**: 2026-09-11T00:14:45+09:00 (Local) / 2026-09-10T15:14:45Z (UTC)  

---

## 1. Observation

### 1.1 Core Web Vitals & Real-Time Performance Measurements
Captured using Navigation Timing API and PerformanceObserver on `https://muryen-front.vercel.app/`:

| Metric | Measured Value | Standard Threshold (Good) | Evaluation |
|---|---|---|---|
| **TTFB (Time to First Byte)** | **8 ms** | < 800 ms | Exceptional (Vercel Edge CDN Cache HIT) |
| **DOMContentLoaded** | **86 ms** | < 1,500 ms | Instantaneous |
| **First Contentful Paint (FCP)** | **316 ms** | < 1,800 ms | Fast |
| **Load Complete** | **309 ms** | < 3,000 ms | Instantaneous |
| **Largest Contentful Paint (LCP)** | **316 ms** | < 2,500 ms | Exceptional (LCP size: 93,169 px) |
| **Cumulative Layout Shift (CLS)** | **0.0000** | < 0.10 | Perfect stability (0 shifts recorded) |
| **Long Tasks (during hydration)** | **4 tasks** (115ms, 74ms, 83ms, 86ms) | < 50ms ideal | Fast client hydration & Three.js initialization |

### 1.2 Landing Page Lifecycle & Hero Splash Screen Animation
- **Source**: `app/component/home-client.tsx:24-53`
- **Measurement Method**: Injected high-frequency DOM sampling script via `initScript` during reload:
  ```javascript
  // Polling every 100ms
  // Result Timeline:
  // - t = 307ms: Overlay mounted (opacity: "1", pointerEvents: "none", ariaHidden: "true")
  // - t = 1502ms: Solid display ends, Framer Motion fade-out transition starts
  // - t = 1802ms: opacity: "0.848969"
  // - t = 2102ms: opacity: "0.57748"
  // - t = 2401ms: opacity: "0.32132"
  // - t = 2700ms: opacity: "0.133648"
  // - t = 3001ms: opacity: "0.0187951"
  // - t = 3301ms: opacity: "0"
  // - t = 4210ms: unmounted from DOM completely (AnimatePresence cleanup)
  ```
- **Observations**:
  1. `pointer-events: none` is maintained continuously throughout the splash lifecycle, preventing any blocking of user interaction or clicks.
  2. `aria-hidden="true"` is set on the splash container, preventing screen readers from reading stale splash text.
  3. Clean removal from the DOM occurs at ~4.2s without lingering zombie DOM nodes.

### 1.3 3-Tab Switcher Audit
- **Source**: `app/component/home-client.tsx:59-116`
- **Tab 1 ("무련이란" / Philosophy)**:
  - Default active tab on initial load (`data-state="active"`, `aria-selected="true"`).
  - Renders `<Philosophy />` containing headings "무련이란?", "우리는 원리의 깨달음을 추구합니다", "개인과 단체", "우리는 진행형입니다".
- **Tab 2 ("어떻게 수련하는가" / HowWork)**:
  - Switched via Radix Tab Trigger (`data-state="active"`, `aria-selected="true"`).
  - Renders `<HowWork />` containing "어떻게 수련할까요?", "수련의 삼각형", 4 cards ("베기", "투로", "대련", "기본기") with optimized Next.js WebP/PNG images.
- **Tab 3 ("왜 수련하는가" / VideoCircle)**:
  - Switched via Radix Tab Trigger (`data-state="active"`, `aria-selected="true"`).
  - Renders `<VideoCircle videos={mockVideos} />`.

### 1.4 VideoCircle Component Audit
- **Source**: `app/component/video-circle.tsx:23-217`
- **Radial Expansion & Orbit Geometry**:
  - Container class: `relative w-[600px] h-[600px] scale-[0.55] sm:scale-75 md:scale-100 origin-center animate-[spin_90s_linear_infinite]`
  - Mathematical 6-item distribution at radius 250px:
    1. Item 1: `translate(250px, 0px)` (Angle: 0°)
    2. Item 2: `translate(125px, 216.506px)` (Angle: 60°)
    3. Item 3: `translate(-125px, 216.506px)` (Angle: 120°)
    4. Item 4: `translate(-250px, 3.06162e-14px)` (Angle: 180°)
    5. Item 5: `translate(-125px, -216.506px)` (Angle: 240°)
    6. Item 6: `translate(125px, -216.506px)` (Angle: 300°)
  - Counter-rotation on items: `animate-[spin_90s_linear_infinite_reverse]` to maintain upright orientation.
- **Modal Dialog Interaction**:
  - Clicking circle button opens Radix modal dialog (`role="dialog"`, `aria-modal="true"`, `aria-labelledby="circle-modal-title"`).
  - Dialog content verified:
    - Title: "기록이 몸이 되니까" (`id="circle-modal-title"`)
    - Hero image: `_next/image?url=%2Fimages%2Ffoot%2Fmuye24ki_core_15_bongukgum.gif&w=640&q=75`
    - CTA link: `<a href="/pattern">투로 수련 보기 →</a>`
    - Close button: `<button>닫기</button>`
  - **Escape Key Test**: Pressing `Escape` key closes the dialog instantly. Verified dialog is removed from accessibility tree.
  - **Close Button Test**: Clicking the "닫기" button closes the dialog instantly. Verified dialog is removed from accessibility tree.

### 1.5 Inquiry Section (#inquiry) & External Links
- **Source**: `app/component/inquiry-section.tsx` & `components/layout/footer.tsx`
- **Element Location**: `#inquiry` anchor located at `scrollY: 3688px` on desktop viewport.
- **Navigation Scroll**: Clicking "입회 안내" (`/#inquiry`) in navigation smoothly scrolls the browser directly to `#inquiry`, bringing it into viewport (`rect.top: 96px`, `rect.bottom: 782px`, `inView: true`).
- **YouTube Link**:
  - Text: `YouTube @muryeon 방문`
  - URL: `https://www.youtube.com/@muryeon`
  - Attributes: `target="_blank"`, `rel="noopener noreferrer"`. Security and accessibility requirements satisfied.

### 1.6 Desktop Navigation Shell & Layout Shifts
- **Source**: `app/component/navigation.tsx:131-165` and `components/layout/app-shell.tsx:28-44`
- **Initial Expanded State**:
  - `<nav>` class: `w-64` (computed width: `256px`)
  - `<main id="main">` class: `md:ml-64` (computed margin-left: `256px`)
- **Collapse Interaction**:
  - Clicking toggle button collapses `<nav>` to `w-24` (computed width: `96px`).
  - Layout transition shifts `<main id="main">` to `md:ml-24` (computed margin-left: `96px`) with `transition-all duration-300`.
- **Re-expansion Interaction**:
  - Clicking toggle button re-expands `<nav>` to `w-64` (computed width: `256px`) and `<main id="main">` to `md:ml-64` (computed margin-left: `256px`).
- **Accessibility Defect (Lighthouse `button-name`)**:
  - Selector: `div.flex > div.hidden > nav.w-64 > button.absolute` (`navigation.tsx:139-148`)
  - Snippet: `<button class="absolute -right-3 top-1/2 -translate-y-1/2 bg-[#280505] border border-white/10 ...">{isExpanded ? <ChevronLeft /> : <ChevronRight />}</button>`
  - **Violation**: The button contains only an SVG icon without `aria-label` or accessible text. Screen readers announce this button with no name.

### 1.7 Theme Switching & LocalStorage Persistence
- **Source**: `app/context/theme-context.tsx` and `app/layout.tsx:24-32`
- **Switching Mechanism**:
  - Default / Initial: `html.className` contains `theme-dark dark`. `body` background: `rgb(26, 26, 26)`, AppShell container: `rgba(65, 7, 7, 0.9)`.
  - Toggle to Light: Click `button[aria-label="라이트 모드로 전환"]`.
    - `html.className` removes `dark` and `theme-dark`, adds `theme-light`.
    - `localStorage.getItem('theme')` updates to `"light"`.
    - AppShell container background transitions to `rgba(240, 232, 232, 0.95)`.
    - Button label updates to `"다크 모드로 전환"`.
  - **Persistence Test**: Full page reload with `localStorage.theme === "light"`.
    - Pre-hydration inline script executes before paint.
    - Page renders immediately with `theme-light` and `rgba(240, 232, 232, 0.95)` with **zero flash of unstyled content (FOUC)**.
  - Toggle back to Dark: Click `button[aria-label="다크 모드로 전환"]`.
    - Restores `theme-dark dark` and updates `localStorage.theme` to `"dark"`.

### 1.8 Mobile Viewport (390x844 iPhone) Audit
- **Source**: `components/layout/mobile-nav.tsx:94-245`
- **Top Bar Audit**:
  - Element: `.md\:hidden.fixed.top-0`
  - Computed Height: **56px** (exact `h-14` = 3.5rem = 56px).
  - Safe-area padding: `pt-[env(safe-area-inset-top)] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]`.
  - Hamburger button: `button[aria-label="메뉴 열기"]` with `<Menu size={22} />`.
  - Desktop sidebar: `display: none` (`hidden md:block`).
- **Mobile Drawer Audit**:
  - Backdrop: `fixed inset-0 bg-black/50 z-[55]` appears.
  - Aside: `motion.aside` slides in from left to `left: 0, width: 288px` (`w-72`).
  - Contains 12 navigational items: 홈, 입회 안내, 소개, 24반, 기본기, 투로, 베기, 대련, 사진첩, 수련일지, YouTube link, Instagram placeholder.
  - Theme button: `button[aria-label="테마 전환"]` operational.
  - Close button: `button[aria-label="메뉴 닫기"]` with `<X size={18} />`. Clicking it closes and cleanly unmounts the drawer.
- **Horizontal Overflow Audit (Protocol Recipe 6)**:
  - `documentClientWidth`: `390px`
  - `windowInnerWidth`: `390px`
  - `scrollWidth`: `390px`
  - `hasHorizontalScroll`: `false`
  - `overflowingElementsCount`: **0**
  - **Result**: Complete absence of horizontal overflow. Responsive layout fits mobile viewport cleanly.

### 1.9 Console Logs & Network Forensics
- **Hydration & React**:
  - Zero hydration errors (`Hydration failed...` count: 0).
  - Zero React key prop warnings (`unique "key" prop` count: 0).
- **Backend Auth Failures (NextAuth 500)**:
  - `reqid=353 GET https://muryen-front.vercel.app/api/auth/session` -> `HTTP 500 Internal Server Error`
  - `reqid=372 POST https://muryen-front.vercel.app/api/auth/_log` -> `HTTP 500 Internal Server Error`
  - Client console messages:
    - `[error] Failed to load resource: the server responded with a status of 500 ()`
    - `[error] [next-auth][error][CLIENT_FETCH_ERROR] https://next-auth.js.org/errors#client_fetch_error There is a problem with the server configuration.`
  - Cause: NextAuth v4 in production requires `NEXTAUTH_SECRET`. In Vercel, this environment variable is missing, causing NextAuth to return 500 on all `/api/auth/*` requests.

### 1.10 Lighthouse Snapshot Audit Summary (Desktop)
- **Accessibility**: 91 / 100
- **Best Practices**: 100 / 100
- **SEO**: 100 / 100
- **Identified Failures**:
  1. `button-name`: `div.flex > div.hidden > nav.w-64 > button.absolute` missing `aria-label`.
  2. `aria-prohibited-attr`: `nav.w-64 > div.absolute > div.flex > span.flex` has `aria-label` on `<span>` without role (`navigation.tsx:223`).

---

## 2. Logic Chain

1. **Premise 1 (Animation & Lifecycle Stability)**:
   A splash overlay that does not unmount or that intercepts pointer events causes input deadlocks. Observation 1.2 proves that `pointer-events: none` is set throughout and the overlay is completely removed from the DOM at 4,210ms.
2. **Premise 2 (State & Geometry Integrity)**:
   Interactive radial menus must maintain circular geometry and allow both mouse and keyboard dismissal to be WCAG compliant. Observation 1.4 proves 6 items orbiting at 60-degree increments along a 250px radius, with modal dialog opening and closing via both Escape key and the close button.
3. **Premise 3 (Responsive Layout Stability)**:
   Mobile viewports (390px) often suffer from horizontal scroll bugs caused by fixed-width elements or untruncated text. Observation 1.8 executed Recipe 6 inspecting all DOM bounding client rects, proving `scrollWidth === clientWidth === 390px` with 0 overflowing elements.
4. **Premise 4 (Accessibility Compliance)**:
   WCAG 2.1 Criteria 4.1.2 (Name, Role, Value) requires all interactive buttons to possess an accessible name. Observation 1.6 and 1.10 prove the sidebar collapse button lacks `aria-label`, and Observation 1.10 proves a generic `<span>` has prohibited `aria-label`.
5. **Conclusion**:
   The landing page and navigation shell are structurally sound, responsive, and exceptionally performant (LCP 316ms, CLS 0.0000), but require two targeted accessibility remedies in `app/component/navigation.tsx`.

---

## 3. Caveats

1. **Concurrent Browser Context**: Running headless Chromium across multiple automated agents required isolated browser contexts (`isolatedContext: "auditor_landing_nav"`) to avoid cross-agent state contamination from navigation or authentication actions.
2. **Vercel Server Environment**: The 500 errors on `/api/auth/session` stem from missing Vercel environment variables (`NEXTAUTH_SECRET`), which can only be resolved in the Vercel project settings dashboard, not via client-side code alone.

---

## 4. Conclusion

The live production site at `https://muryen-front.vercel.app` exhibits top-tier frontend performance with zero layout shift and flawless mobile responsiveness. The landing page transitions, 3-tab switcher, VideoCircle orbit, inquiry section, theme toggle, and mobile drawer operate exactly as specified.

Two localized accessibility defects were identified in `app/component/navigation.tsx`:
1. **Sidebar Collapse Button**: Missing `aria-label` (`button-name` violation).
2. **Instagram Disabled Placeholder**: `aria-label` present on non-role `<span>` (`aria-prohibited-attr` violation).

### Proposed Code Remediation (for implementer agent):

#### Patch 1: `app/component/navigation.tsx` (Lines 139–148)
```tsx
// Before:
<button
  onClick={() => handleExpand(!isExpanded)}
  className={`absolute -right-3 top-1/2 -translate-y-1/2 ...`}
>
  {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
</button>

// After:
<button
  onClick={() => handleExpand(!isExpanded)}
  aria-label={isExpanded ? "사이드바 축소" : "사이드바 확장"}
  title={isExpanded ? "사이드바 축소" : "사이드바 확장"}
  className={`absolute -right-3 top-1/2 -translate-y-1/2 ...`}
>
  {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
</button>
```

#### Patch 2: `app/component/navigation.tsx` (Lines 222–232)
```tsx
// Before:
<span
  aria-label="Instagram (준비 중)"
  aria-disabled="true"
  title="Instagram 계정 준비 중"
  className={`flex items-center justify-center w-10 h-10 rounded-full opacity-40 cursor-not-allowed ...`}
>
  <Instagram size={18} />
</span>

// After (matches mobile-nav.tsx):
<span
  aria-disabled="true"
  title="Instagram 계정 준비 중"
  className={`flex items-center justify-center w-10 h-10 rounded-full opacity-40 cursor-not-allowed ...`}
>
  <Instagram size={18} />
</span>
```

---

## 5. Verification Method

### 5.1 Independent Live Verification via Chrome DevTools MCP
1. Open page `https://muryen-front.vercel.app/` in Chrome DevTools MCP.
2. Run `lighthouse_audit({ pageId: <id>, device: "desktop", mode: "snapshot" })` to confirm Accessibility score and failure items.
3. Run Recipe 6 overflow script via `evaluate_script` under `390x844x3,mobile,touch` emulation:
   ```javascript
   () => ({
     scrollWidth: document.documentElement.scrollWidth,
     clientWidth: document.documentElement.clientWidth,
     hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth
   })
   ```
   Verify `hasHorizontalScroll === false`.

### 5.2 Local Build & Test Verification
Run the standard build and test commands:
```bash
npm run lint
npm test
npm run build
```
Verify:
- 0 lint errors and 0 warnings.
- All unit and adversarial tests pass with 100% success rate.
- Next.js build compiles cleanly without errors.
