# Comprehensive Codebase Audit & Bug Analysis Report

**Project**: `muryen-front` (Next.js 15 App Router + React 18 + Tailwind CSS + Radix UI)  
**Auditor**: Survey Explorer 2  
**Date**: 2026-08-28  

---

## 1. Executive Summary

A comprehensive investigation of `muryen-front` was conducted across all pages, components, context providers, API routes, and configuration files. While the application successfully compiles with `npm run build` and `tsc`, the audit identified **17 specific bugs and risk areas** across five critical categories:

1. **Hydration & SSR Errors**: Severe hydration mismatch on `/daily` caused by module-level non-deterministic random data generation (`Math.random()`, `new Date()`), along with SEO blanking on the homepage caused by a 2.5-second opening delay state.
2. **Broken Assets & Runtime Exceptions**: Missing image files in `equipment.tsx` causing 404 image errors on all equipment cards, unhandled promise rejections on video playback, and uncancelled animation frames.
3. **Styling & Theme Synchronization**: Inconsistency between Tailwind's `darkMode: ["class"]` and `theme-context.tsx`, preventing all `dark:...` Tailwind utility classes from functioning anywhere in the application.
4. **Lifecycle, Memory Leaks & Anti-patterns**: AudioContext and microphone streams left open on component unmount, `requestAnimationFrame` memory leaks in `video-circle.tsx`, prop mutations in `llami-chat-widget.tsx`, and unused variables triggering linter warnings.
5. **Security & Configuration**: Insecure JWT cookie handling (`httpOnly: false`), NextAuth test route redirect mismatch, and 5 heavy unused dependencies in `package.json`.

---

## 2. Issues Summary Table

| ID | Severity | Category | File Path | Line(s) | Short Description |
|---|---|---|---|---|---|
| **BUG-01** | 🔴 High | SSR / Hydration | `app/component/record-graph.tsx` | 37–59 | Module-level `Math.random()` and dynamic dates create 1,000+ SSR hydration mismatches on `/daily` |
| **BUG-02** | 🔴 High | Styling / Logic | `app/context/theme-context.tsx` | 28–34 | ThemeProvider only toggles `theme-dark` / `theme-light`; `.dark` is never applied to `<html>`, disabling all Tailwind `dark:*` classes |
| **BUG-03** | 🔴 High | Runtime / 404 Assets | `app/component/equipment.tsx` | 87–89 | Broken `.jpg` image paths for Korean names (e.g. `/images/전통-갑옷.jpg`) resulting in 404s on all cards |
| **BUG-04** | 🟡 Medium | SSR / SEO | `app/component/home-client.tsx` | 22–50 | Initial state `isOpening=true` replaces main SSR layout with 2.5s hero delay, hiding main content and `<h1>` from SSR HTML |
| **BUG-05** | 🟡 Medium | Layout / UI | `components/layout/app-shell.tsx` vs `app/component/navigation.tsx` | `app-shell.tsx:37`, `navigation.tsx:135` | Navigation expanded width is `w-44` (176px) but AppShell sets `<main>` margin to `md:ml-64` (256px), creating an 80px visual gap |
| **BUG-06** | 🟡 Medium | Lifecycle / Memory | `app/component/video-circle.tsx` | 32–66 | `requestAnimationFrame` lacks unmount cleanup; progress divisor calculation is mathematically broken (`/ fastRotationDuration`) |
| **BUG-07** | 🟡 Medium | Resource Leak | `components/ai/vad-analyzer.tsx` & `app/test/page.tsx` | `vad-analyzer.tsx:22-28`, `page.tsx:30-36` | AudioContext & microphone MediaStream tracks are not destroyed on unmount, keeping the browser mic indicator active |
| **BUG-08** | 🟡 Medium | SSR / Hydration | `app/component/navigation.tsx` & `app/component/sparring-page.tsx` | `navigation.tsx:130`, `sparring-page.tsx:113` | Redundant `if (!theme) return null;` suppresses SSR rendering and causes blank initial render / layout shift |
| **BUG-09** | 🟡 Medium | Security | `app/api/auth/login/route.ts` | 23 | `httpOnly: true` is commented out on `accessToken` cookie, exposing JWT tokens to client-side XSS access |
| **BUG-10** | 🔵 Low | UI / Layout | `app/component/login-page.tsx` | 45 | Hardcoded `md:ml-24` inside AppShell's `md:ml-64` causes the login card to be off-center to the right |
| **BUG-11** | 🔵 Low | Runtime / Exception | `app/component/animated-image.tsx` | 17 | `videoRef.current.play()` promise is unhandled; throws `AbortError` if playback is interrupted by quick state change |
| **BUG-12** | 🔵 Low | React Anti-pattern | `app/component/llami-chat-widget.tsx` | 16 | Direct prop parameter mutation (`theme = "catalog"`) violates React immutability rules and triggers linter warnings |
| **BUG-13** | 🔵 Low | Lint / Static | Multiple files (equipment, intro-basic, login-page, navigation, theme-context, test2) | Multiple | 14 unused variables, interfaces, and imports triggering ESLint warnings |
| **BUG-14** | 🔵 Low | Cleanliness | `app/layout.tsx.rej` | 1–29 | Leftover rejected git patch file committed in repository |
| **BUG-15** | 🔵 Low | Configuration | `app/api/auth/[...nextauth]/route.ts` | 37 | NextAuth sign-in page points to test route `pages: { signIn: "/test2" }` instead of `/login` |
| **BUG-16** | 🔵 Low | Performance / DOM | `app/component/record-graph.tsx` | 111–129 | `TooltipProvider` is instantiated 1,095 times inside the day cell loop rather than wrapping the container once |
| **BUG-17** | 🔵 Low | Dependencies | `package.json` | 12, 19, 25, 29, 34 | Heavy unused packages (`@meursyphus/flitter`, `@xenova/transformers`, `lamejs`, `styled-components`, `next-themes`) bloat bundle/dependencies |

---

## 3. Detailed Technical Analysis & Root Causes

### BUG-01: Module-level Random Mock Data Causing SSR Hydration Mismatch
- **Location**: `app/component/record-graph.tsx` (Lines 37–59)
- **Code Observation**:
  ```tsx
  const mockCommitData: CommitData = {
    ...Object.fromEntries(
      Array.from({ length: 365 * 3 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return [
          format(date, "yyyy-MM-dd"),
          {
            count: Math.floor(Math.random() * 10),
            records: Array.from(
              { length: Math.floor(Math.random() * 5) },
              (_, j) => ({
                id: `record-${i}-${j}`,
                title: `수련 기록 ${j + 1}`,
                content: `이날의 수련 내용입니다. ${j + 1}번째 기록`,
                timestamp: format(date, "HH:mm:ss"),
              })
            ),
          },
        ];
      })
    ),
  };
  ```
- **Root Cause**: Module-level evaluation executes on the server during build/SSR and again on the browser during client bundle execution. Because `Math.random()` and `new Date()` produce different outputs on server vs. client, the generated DOM structure, CSS color classes (`getColorClass(data.count)`), and tooltip text differ completely. React 18 throws hydration mismatch warnings for every cell across 3 years of daily commits (1,095 instances).
- **Recommended Fix**:
  1. Replace random generation with a deterministic PRNG based on the date string (or a static seed).
  2. Alternatively, generate mock data inside a `useEffect` on client mount, displaying a skeleton/loading placeholder until mounted.

---

### BUG-02: Tailwind Dark Mode Class (`dark`) Desynchronization
- **Location**: `app/context/theme-context.tsx` (Lines 28–34), `app/layout.tsx` (Lines 343–345), `tailwind.config.ts` (Line 4)
- **Code Observation**:
  ```tsx
  // in theme-context.tsx
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    root.classList.remove("theme-light", "theme-dark");
    root.classList.add(`theme-${theme}`);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);
  ```
  ```ts
  // in tailwind.config.ts
  darkMode: ["class"],
  ```
- **Root Cause**: Tailwind CSS is configured with `darkMode: ["class"]`, meaning Tailwind looks for `<html class="dark">` to activate `dark:...` utility styles. However, the custom `ThemeProvider` only adds `theme-dark` (and `theme-light`). It **never** adds `dark` to `document.documentElement`.
- **Impact**: All classes using Tailwind's `dark:` modifier (e.g. `dark:text-gray-400`, `dark:bg-gray-800`, `dark:invert`, `dark:border-gray-700` in `vad-analyzer.tsx`, `interactive-player.tsx`, `stat-cards.tsx`, `intro-basic.tsx`, `mypage/page.tsx`) remain permanently deactivated, even when dark mode is turned on.
- **Recommended Fix**: Update `theme-context.tsx` and the inline script in `app/layout.tsx` to toggle `.dark`:
  ```tsx
  if (theme === "dark") {
    root.classList.add("dark", "theme-dark");
    root.classList.remove("theme-light");
  } else {
    root.classList.remove("dark", "theme-dark");
    root.classList.add("theme-light");
  }
  ```

---

### BUG-03: 404 Broken Images in Equipment Component
- **Location**: `app/component/equipment.tsx` (Lines 87–89)
- **Code Observation**:
  ```tsx
  <Image
    src={`/images/${item.title
      .toLowerCase()
      .replace(" ", "-")}.jpg`}
    alt={item.title}
    width={300}
    height={200}
    className="rounded-lg mb-4"
  />
  ```
- **Root Cause**: `item.title` is Korean text ("전통 갑옷", "전투용 투구", "장창"). This template attempts to load `/images/전통-갑옷.jpg`, `/images/전투용-투구.jpg`, and `/images/장창.jpg`. Inspection of `public/images/` confirms none of these files exist. All 3 images fail to load with HTTP 404.
- **Recommended Fix**: Add an explicit `image` field to `Equipment` items pointing to valid existing assets:
  - "전통 갑옷" → `"/images/armour.png"`
  - "전투용 투구" → `"/images/sparring.png"`
  - "장창" → `"/images/foot/muye24ki_core_01_jangchang.gif"`

---

### BUG-04: Initial State `isOpening=true` Hides SSR Content and Harms SEO
- **Location**: `app/component/home-client.tsx` (Lines 22–50)
- **Code Observation**:
  ```tsx
  const [isOpening, setIsOpening] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpening(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isOpening) {
    return (
      <motion.div className="fixed inset-0 z-[100] ...">
        <Hero />
      </motion.div>
    );
  }

  return (
    <MainLayout>
      <h1 className="sr-only">무련(武緣) — 조선 24반 무예...</h1>
      ...
  ```
- **Root Cause**: On server render (SSR), `isOpening` evaluates to `true`. Next.js therefore prerenders ONLY the fullscreen `<Hero />` animation overlay. All main content (`<MainLayout>`, `Tabs`, `Philosophy`, `WhyMuryeon`, `TargetAudience`, `TrainingSystem`, `InquirySection`, and the `<h1>` heading) is completely missing from the HTML response sent to search crawlers and users. After 2.5 seconds on the client, the entire DOM tree unmounts and remounts.
- **Recommended Fix**: Render `<MainLayout>` directly in the root flow and render the hero overlay on top via `AnimatePresence` with `onAnimationComplete`, or integrate the Hero into the regular page document flow so SSR HTML contains all semantic content.

---

### BUG-05: Desktop Layout Width & Margin Mismatch
- **Location**: `components/layout/app-shell.tsx` (Line 37), `app/component/navigation.tsx` (Line 135)
- **Code Observation**:
  - `Navigation` component: `<nav className={`${isExpanded ? "w-44" : "w-24"} ...`
  - `AppShell` component: `<main className={`... ${isNavExpanded ? "md:ml-64" : "md:ml-24"}`}>`
- **Root Cause**: `w-44` is `11rem = 176px`, while `md:ml-64` is `16rem = 256px`. When the navigation bar is expanded, the content area has a left margin of 256px while the sidebar is only 176px wide, creating an unintended 80px blank space between the navbar and the page content on all desktop views.
- **Recommended Fix**: Synchronize dimensions: set `Navigation` to `w-64` when expanded (or change `AppShell` margin to `isNavExpanded ? "md:ml-44" : "md:ml-24"`).

---

### BUG-06: Animation Calculation Bug and rAF Memory Leak in VideoCircle
- **Location**: `app/component/video-circle.tsx` (Lines 32–66)
- **Code Observation**:
  ```tsx
  useEffect(() => {
    if (initialAnimation) {
      const startTime = Date.now();
      const duration = 1500;
      const fastRotationDuration = 1000;

      const animateInitial = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;

        if (elapsed < fastRotationDuration) {
          setRotation((prev) => (prev + 5) % 360);
          setCurrentRadius(radius * (1 - elapsed / fastRotationDuration));
          requestAnimationFrame(animateInitial);
        } else if (elapsed < duration) {
          const progress = (elapsed - fastRotationDuration) / fastRotationDuration; // BUG: divides by 1000 instead of (duration - fastRotationDuration) = 500
          setCurrentRadius(radius * progress);
          setRotation((prev) => (prev + 5 * (1 - progress)) % 360);
          requestAnimationFrame(animateInitial);
        } else {
          setInitialAnimation(false);
          setCurrentRadius(radius);
        }
      };

      requestAnimationFrame(animateInitial);
      // BUG: Missing cleanup return!
    }
  }, [initialAnimation, radius]);
  ```
- **Root Cause**:
  1. `progress` calculation: `elapsed - fastRotationDuration` goes from 0 to 500. Dividing by `fastRotationDuration` (1000) results in `progress` only reaching 0.5 (radius 125px) before abruptly snapping to 250px on completion. Divisor must be `(duration - fastRotationDuration)`.
  2. No cleanup function is returned when `initialAnimation === true`. If the user navigates away or switches tabs during the initial 1.5 seconds, `requestAnimationFrame` continues invoking `setRotation` and `setCurrentRadius` on unmounted component state.
- **Recommended Fix**: Store `rafId` in a variable and return `() => cancelAnimationFrame(rafId);`. Fix `progress` divisor to `(duration - fastRotationDuration)`.

---

### BUG-07: MediaStream & AudioContext Leak in VAD Analyzer
- **Location**: `components/ai/vad-analyzer.tsx` (Lines 22–28)
- **Code Observation**:
  ```tsx
  useEffect(() => {
    return () => {
      if (myVad) {
        myVad.pause();
      }
    };
  }, [myVad]);
  ```
- **Root Cause**: `MicVAD` acquires microphone access via `navigator.mediaDevices.getUserMedia()`. Calling `pause()` only pauses internal audio processing; it does not close the `AudioContext` or stop the underlying `MediaStreamTrack`s. When the user navigates away from `/cutting` while VAD is on, the microphone recording indicator remains stuck on in the browser tab.
- **Recommended Fix**: Call `myVad.destroy()` (or stop tracks on the audio stream) in the cleanup return function.

---

### BUG-08: Redundant Early Return `if (!theme) return null`
- **Location**: `app/component/navigation.tsx` (Line 130), `app/component/sparring-page.tsx` (Line 113)
- **Code Observation**:
  ```tsx
  if (!theme) return null;
  ```
- **Root Cause**: In `ThemeProvider`, `theme` fallback is `theme ?? "light"`. If `theme` state starts as `undefined` before `useEffect` runs, `Navigation` and `SparringPage` render `null` on the server while other components render. This produces mismatched DOM trees between server and client.
- **Recommended Fix**: Provide a stable fallback default theme in state (`const [theme, setTheme] = useState<Theme>("light")`) and remove `if (!theme) return null;`.

---

### BUG-09: Disabled `httpOnly` Flag on Authentication Cookie
- **Location**: `app/api/auth/login/route.ts` (Line 23)
- **Code Observation**:
  ```ts
  (await cookies()).set("accessToken", authResponse.accessToken, {
    // httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60, // 24 hours
  });
  ```
- **Root Cause**: `httpOnly` was commented out so that client components (`Navigation`, `MobileNav`) could check `document.cookie.includes("accessToken")`. Leaving `httpOnly` disabled allows malicious client-side scripts (XSS) to read and exfiltrate authentication JWT tokens.
- **Recommended Fix**: Re-enable `httpOnly: true`. Implement a `/api/auth/session` route or use NextAuth's `useSession()` / React context for client-side login state.

---

### BUG-10: Duplicate Offset in Login Page
- **Location**: `app/component/login-page.tsx` (Line 45)
- **Code Observation**:
  ```tsx
  <div className={`min-h-screen flex items-center justify-center p-4 md:ml-24 ...`}>
  ```
- **Root Cause**: `AppShell` wraps all children in `<main className="md:ml-64">`. Adding `md:ml-24` to `login-page.tsx` creates an unnecessary 96px additional left shift, throwing the login form out of horizontal center.
- **Recommended Fix**: Remove `md:ml-24` from `login-page.tsx`.

---

### BUG-11: Unhandled Promise in Video Autoplay
- **Location**: `app/component/animated-image.tsx` (Lines 16–21)
- **Code Observation**:
  ```tsx
  if (isVisible) {
    videoRef.current.play()
  } else {
    videoRef.current.pause()
  }
  ```
- **Root Cause**: `HTMLVideoElement.play()` returns a Promise. If paused or unmounted while the play request is loading, browsers reject the promise with `DOMException: The play() request was interrupted by a call to pause()`.
- **Recommended Fix**: Call `videoRef.current.play().catch(() => {})`.

---

### BUG-12: Direct Prop Mutation in `llami-chat-widget.tsx`
- **Location**: `app/component/llami-chat-widget.tsx` (Line 16)
- **Code Observation**:
  ```tsx
  if (pathname.startsWith("/catalog/llami-chat")) theme = "catalog";
  ```
- **Root Cause**: Mutating the component argument `theme` directly violates React's pure function rules and triggers ESLint's `react-hooks/exhaustive-deps` warning.
- **Recommended Fix**: Use a local variable: `const effectiveTheme = pathname.startsWith("/catalog/llami-chat") ? "catalog" : theme;`.

---

### BUG-13: Unused Variables and Imports
- **Locations**:
  - `app/component/equipment.tsx:5`: `Shield`, `Sword`
  - `app/component/intro-basic.tsx:13, 49, 69, 73, 77, 103`: `ChartContainer`, `TechniqueData`, `footTechniques`, `mountedTechniques`, `renderCustomizedLabel`, `chartConfig`
  - `app/component/login-page.tsx:4, 29`: `Apple`, `data`
  - `app/component/navigation.tsx:8`: `Swords`
  - `app/context/theme-context.tsx:4`: `themes`
  - `app/test2/page.tsx:3`: `useEffect`
- **Recommended Fix**: Remove all unused identifiers to achieve 0 ESLint warnings.

---

### BUG-14: Leftover Git Patch Artifact
- **Location**: `app/layout.tsx.rej`
- **Root Cause**: A failed patch rejection file was left in the source directory.
- **Recommended Fix**: Remove `app/layout.tsx.rej`.

---

### BUG-15: NextAuth Sign-in Route Misconfiguration
- **Location**: `app/api/auth/[...nextauth]/route.ts` (Line 37)
- **Code Observation**: `pages: { signIn: "/test2" }`
- **Root Cause**: Redirects unauthenticated NextAuth requests to the `/test2` experimental page instead of `/login`.
- **Recommended Fix**: Change to `pages: { signIn: "/login" }`.

---

### BUG-16: TooltipProvider Over-instantiation in Daily Graph
- **Location**: `app/component/record-graph.tsx` (Lines 111–129)
- **Root Cause**: `<TooltipProvider>` is rendered inside the `.map()` loop for every single day (1,095 instances), adding unnecessary React context overhead and DOM wrapper nodes.
- **Recommended Fix**: Wrap the entire year or chart container once with a single `<TooltipProvider>`.

---

### BUG-17: Heavy Unused Packages in `package.json`
- **Location**: `package.json` (Lines 12, 19, 25, 29, 34)
- **Identified Packages**:
  - `@meursyphus/flitter`
  - `@xenova/transformers`
  - `lamejs`
  - `styled-components`
  - `next-themes`
- **Root Cause**: None of these packages are imported or used in the codebase.
- **Recommended Fix**: Run `npm uninstall @meursyphus/flitter @xenova/transformers lamejs styled-components next-themes`.
