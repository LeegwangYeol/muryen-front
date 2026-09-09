# Technical Analysis — Milestone M2: Auth & Layout Hardening / Project-wide Error Audit

**Explorer**: `m2_explorer_1`  
**Date**: 2026-09-01  
**Target Application**: `muryen-front` (Next.js 15.5.15 App Router / React 18.2.0 / TypeScript 5 / Tailwind CSS 3.4.1)

---

## 1. Executive Summary

A comprehensive, end-to-end technical investigation of the `muryen-front` codebase was performed covering:
1. **Root Layout & Global Wrappers**: `app/layout.tsx`, `app/providers.tsx`, `app/context/theme-context.tsx`, `app/error.tsx`, `app/not-found.tsx`, `app/loading.tsx`.
2. **Layout & Shell System**: `components/layout/app-shell.tsx`, `components/layout/mobile-nav.tsx`, `components/layout/footer.tsx`, `components/layout/main-layout.tsx`, `app/component/navigation.tsx`.
3. **All 14 Page Routes**:
   - Primary: `/` (Home), `/about` (Introduction), `/basic` (Basics), `/basic-sense` (24-Ban Overview), `/cutting` (Cutting & VAD), `/daily` (Activity Calendar), `/equipment` (Weapons & Armor), `/know-how` (Knowledge), `/location` (Training Location), `/login` (Auth), `/mypage` (Dashboard Stats), `/pattern` (Forms/Turo & Interactive Player), `/reference` (Historical References), `/sparring` (Armored Sparring).
   - Additional test routes: `/test` (VAD Test), `/test2` (NextAuth Google Test).
4. **Authentication & Session Management**: `app/api/auth/[...nextauth]/route.ts`, `app/api/auth/login/route.ts`, `app/api/auth/logout/route.ts`, `lib/auth-service.ts`, `lib/token-service.ts`.
5. **Hydration, SSR/CSR, and Error Boundary Audit**: Checked Recharts dynamic loading, ReactPlayer SSR guards, date determinism, and theme hydration.

### Overall Assessment
The codebase is in an exceptionally stable and hardened state following Milestone M1 fixes.
- **Test Suite**: 24/24 test suites passed (179/179 tests passed, 0 failures).
- **ESLint**: 0 errors, 0 warnings.
- **Production Build**: Next.js 15 App Router compiled all 24 static and dynamic routes cleanly with 0 build errors.
- **One minor cosmetic layout optimization identified**: `app/component/login-page.tsx:45` contains a redundant `md:ml-24` class that can be safely removed by the M2 Worker to achieve perfect horizontal centering inside `AppShell`.
- **One orphaned file identified**: `app/component/VideoModal.tsx` is completely unused after M1 removed the bottom-left navigation modal.

---

## 2. Detailed Component & Route Audit

### 2.1 Root Layout & Global Infrastructure

| Component / File | Role | Hydration & Error Resilience | Findings |
|---|---|---|---|
| `app/layout.tsx` | Root HTML shell | `<html lang="ko" suppressHydrationWarning>` + `<Script id="theme-init" strategy="beforeInteractive">` | Correctly suppresses attribute mismatch while inline script applies stored theme (`theme-dark`/`theme-light`). Cleaned of third-party LLAMI scripts. Standard JSON-LD structured data intact. |
| `app/providers.tsx` | NextAuth client wrapper | `"use client"` wrapping `<SessionProvider>` | Stable pass-through client component; does not crash during SSR. |
| `app/context/theme-context.tsx` | Theme state provider | Syncs `theme` with `localStorage` and `document.documentElement` | Graceful fallback when `localStorage` is unavailable or window is undefined. |
| `app/error.tsx` | Global Error Boundary | `"use client"`, receives `error` and `reset` | Catches unhandled client exceptions, renders reset button and link to `/`. |
| `app/not-found.tsx` | 404 Not Found Page | Server Component with quick links | Clean styling, `robots: { index: false, follow: false }` metadata. |
| `app/loading.tsx` | Route Transition Skeleton | Server Component with indeterminate progress bar | `role="progressbar"`, `aria-busy="true"`, supports `prefers-reduced-motion`. |

### 2.2 Shell & Navigation Hierarchy

| Component / File | Dimensions & Layout Contracts | Responsive & State Handling | Findings |
|---|---|---|---|
| `components/layout/app-shell.tsx` | `isNavExpanded ? "md:ml-64" : "md:ml-24"` | Desktop: `<Navigation>`, Mobile: `<MobileNav>`. Skip link `#main` present. | Seamless zero-gap layout contract with desktop sidebar (`w-64` / `w-24`). |
| `app/component/navigation.tsx` | Desktop sidebar: `w-64` (expanded) / `w-24` (collapsed) | Fixed sidebar with toggle button, theme switcher, YouTube link, and logout button. | Bottom container (`absolute bottom-4 left-4 right-4`) cleanly purged of dead `VideoModal` and state in M1. |
| `components/layout/mobile-nav.tsx` | Mobile drawer (`fixed top-0 left-0 bottom-0 z-[60] w-72 max-w-[85vw]`) | Framer Motion `AnimatePresence`. Auto-closes on `pathname` change. | Handled safe-area insets (`env(safe-area-inset-top)`). Auth cookie detection for logout button. |
| `components/layout/footer.tsx` | Full-width container inside `#main` | Dynamic copyright year, navigation links, YouTube/Instagram links. | Responsive grid (2 cols mobile, 4 cols desktop), accessible links. |
| `components/layout/main-layout.tsx` | Pass-through wrapper | Prevents unnecessary re-mount of shell during route transitions. | Working as intended. |

### 2.3 Comprehensive 14 Page Routes Audit

| Route | Main File & Subcomponents | Rendering Strategy | Audit Notes & Status |
|---|---|---|---|
| `/` | `app/page.tsx` -> `app/component/home-client.tsx` | CSR with SSR shell | Tabs for philosophy/reason/training; opening hero animation with timeout cleanup. Stable. |
| `/about` | `app/about/page.tsx` -> `app/component/about-page.tsx` | SSR with client interactive sections | ArticleJsonLd & BreadcrumbJsonLd included. Stable. |
| `/basic` | `app/basic/page.tsx` -> `app/component/basic-page.tsx` | SSR with client interactive sections | Framer Motion entry animations, structured metadata. Stable. |
| `/basic-sense` | `app/basic-sense/page.tsx` -> `app/component/intro-basic.tsx` | Dynamic CSR for Recharts | `DonutChart` dynamically imported (`ssr: false`) with animated loading placeholder. No hydration mismatch. |
| `/cutting` | `app/cutting/page.tsx` -> `app/component/cutting-page.tsx` | CSR with AI VAD analyzer | `<VadAnalyzer>` safely guards `window.vad` and tears down audio streams/contexts on unmount. |
| `/daily` | `app/daily/page.tsx` -> `app/component/record-graph.tsx` | Client commit heatmap | Uses static `ANCHOR_DATE = parseISO("2024-12-31")` and deterministic generator. Zero hydration drift. |
| `/equipment` | `app/equipment/page.tsx` -> `app/component/equipment.tsx` | Client modal & card grid | Next.js `<Image fill sizes="..." />` used correctly. Interactive detail modal. Stable. |
| `/know-how` | `app/know-how/page.tsx` | Static page | Placeholder page rendered cleanly inside AppShell. |
| `/location` | `app/location/page.tsx` | Static page | Placeholder page rendered cleanly inside AppShell. |
| `/login` | `app/login/page.tsx` -> `app/component/login-page.tsx` | Client form with credentials auth | Handles `/api/auth/login` POST, issues auth cookies. *Minor note*: `login-page.tsx:45` has redundant `md:ml-24` class. |
| `/mypage` | `app/mypage/page.tsx` -> `components/dashboard/stat-cards.tsx` | Dynamic CSR for Recharts | `AttendanceLineChart`, `SkillsRadarChart`, `SparringBarChart` all dynamically imported with `{ ssr: false }`. |
| `/pattern` | `app/pattern/page.tsx` -> `app/component/patten-page.tsx` | Client interactive player & tables | `<InteractivePlayer>` incorporates `mounted` state guard preventing ReactPlayer SSR divergence. |
| `/reference` | `app/reference/page.tsx` -> `app/component/reference-page.tsx` | Client card list | Dual-column responsive cards with historical images and book details. Stable. |
| `/sparring` | `app/sparring/page.tsx` -> `app/component/sparring-page.tsx` | Client syllabus layout | 4-stage sparring curriculum breakdown, Framer Motion staggered reveals. Stable. |

### 2.4 Authentication Flow Audit

1. **NextAuth API Route (`app/api/auth/[...nextauth]/route.ts`)**:
   - `GoogleProvider` is conditionally registered only when both `process.env.GOOGLE_CLIENT_ID` and `process.env.GOOGLE_CLIENT_SECRET` are truthy.
   - Handles JWT and session callbacks safely.
   - Exports standard App Router route handlers (`GET`, `POST`).
2. **Credentials Login Route (`app/api/auth/login/route.ts`)**:
   - Validates user against `AuthService`.
   - Sets secure HTTP-only `accessToken` cookie (`httpOnly: true, sameSite: "lax", path: "/"`).
   - Sets non-sensitive `isLoggedIn` cookie (`httpOnly: false`) for client UI state synchronization.
3. **Logout Route (`app/api/auth/logout/route.ts`)**:
   - Deletes `accessToken` and `isLoggedIn` cookies.
   - Synchronized across both `Navigation` and `MobileNav` logout handlers.
4. **Token Security (`lib/token-service.ts`)**:
   - Uses `jose` library with HS256 JWT signing and expiration validation.

---

## 3. Hydration & Error Resilience Audit

### Verified Protections
1. **Window / Document Access**:
   - All `window` access (`window.matchMedia`, `window.vad`, `window.location`) is either inside `useEffect`, event handlers, or guarded with `typeof window !== "undefined"` checks.
2. **Recharts SSR Isolation**:
   - All Recharts components (`DonutChart`, `AttendanceLineChart`, `SkillsRadarChart`, `SparringBarChart`) are wrapped in `next/dynamic(..., { ssr: false, loading: ... })`.
3. **Media Player SSR Isolation**:
   - `InteractivePlayer` uses `const [mounted, setMounted] = useState(false)` and returns `null` on the server pass, eliminating ReactPlayer DOM mismatch.
4. **Deterministic Mock Data**:
   - `RecordGraph` uses fixed anchor date (`2024-12-31`) rather than `new Date()`, guaranteeing identical server and client initial markup.
5. **Theme Switching**:
   - Inline script sets classes before paint; `<html>` tag uses `suppressHydrationWarning` to prevent React warnings.

---

## 4. Recommendations for Milestone M2 Worker

1. **Clean up redundant margin class in `app/component/login-page.tsx`**:
   - Line 45: Remove `md:ml-24` from `className="min-h-screen flex items-center justify-center p-4 md:ml-24 ..."` to ensure perfect horizontal centering of the login card within `AppShell`.
2. **Delete orphaned `app/component/VideoModal.tsx`**:
   - `VideoModal.tsx` is completely unused across all routes and can be excised to prevent dead code buildup.
3. **Codebase Status Confirmation**:
   - The authentication and layout systems are already robust and hardened. No additional structural rewrites or fixes are required for M2 stability.
