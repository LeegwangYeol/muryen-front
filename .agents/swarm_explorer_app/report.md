# Next.js App Router Architectural & Code-Level Inspection Report

**Date**: 2026-09-30  
**Target Repository**: `muryen-front` (`/Users/a7890/src/muryen-front`)  
**Auditor**: `swarm_explorer_app` (Explorer / Architecture Specialist)  
**Next.js Version**: `^15.5.15` (App Router)  
**React Version**: `^18.2.0`  

---

## 1. Executive Summary

An exhaustive, line-by-line inspection of the Next.js App Router implementation in `muryen-front` was conducted across all 25 build targets, including root special files (`layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts`), 17 page route segments, 4 route handlers, middleware configuration, and internal component boundaries.

### Key Architectural Strengths:
1. **Next.js 15 Async Request APIs**: Route handlers (`/api/auth/login`, `/api/auth/logout`) correctly await `cookies()` per Next.js 15 async API requirements.
2. **Clean Landmark Semantics (Zero Nested `<main>`)**: The root application shell (`AppShell`) exclusively renders the `<main id="main">` landmark. `error.tsx` and `not-found.tsx` use `<section aria-labelledby="...">` and `<MainLayout>` is a clean pass-through wrapper (`<>{children}</>`), ensuring 100% W3C HTML semantics compliance.
3. **Optimized Client/Server Boundaries**: All primary informational pages (`/`, `/about`, `/basic`, `/basic-sense`, `/cutting`, `/gallery`, `/pattern`, `/reference`, `/sparring`) are Server Components that export structured metadata and JSON-LD schemas (`ArticleJsonLd`, `BreadcrumbJsonLd`), hydrating interactive client sub-trees (`HomeClient`, `PhotoGrid`, etc.) down the tree.
4. **Hydration Mismatch Defenses**: Inline `<Script id="theme-init" strategy="beforeInteractive">` eliminates dark/light mode hydration flash; `suppressHydrationWarning` guards dynamic year output; and heavy third-party browser-only libraries (`Recharts`, `ReactPlayer`) are safely isolated via `next/dynamic({ ssr: false })` or client mount guards.

### Key Micro-Defects & Anti-Patterns Identified:
1. **Broken VAD Integration (`@ricky0123/vad-web`)**: `components/ai/vad-analyzer.tsx` (mounted on `/cutting`) and `app/test/page.tsx` assume `window.vad` is injected globally via a script tag in `layout.tsx`. No such script tag exists. Clicking "마이크 켜기" fails with fallback status, and `/test` throws an unhandled TypeError.
2. **Missing Route Metadata**: `/daily`, `/login`, `/know-how`, and `/location` do not export `metadata` or `generateMetadata`. `/test` and `/test2` are declared as `"use client"` directly at the route level, preventing metadata export entirely.
3. **Orphaned / Dead Components**:
   - `app/component/styles.tsx`: Unused mock component containing placeholder text for Taekwondo/Hapkido.
   - `app/component/training-gallery.tsx`: Finished photo teaser component intended for the homepage, but not imported in `home-client.tsx`.
   - `app/component/animated-image.tsx`: Unused video animation helper.
4. **Naming / Typo Inconsistencies**:
   - `app/component/patten-page.tsx`: Misspelled filename (`patten` instead of `pattern`).
   - `app/test/wma.ts`: Misspelled function export `downladaudio`.
5. **Production Exposure of Experimental Test Routes**: `/test` and `/test2` are accessible in production (disallowed in `robots.txt` but bundled in production build).

---

## 2. Complete Routing Hierarchy & Architecture Map

The application consists of **25 distinct compiled route outputs** (17 page routes, 4 route handlers, 2 metadata routes, 1 404 handler, and 1 middleware).

### Complete Routing Table (for `PROJECT_SUMMARY.md`)

| Route Path | File Location | Route Type | Component Boundary | Auth / Guard | Metadata Declared | Key Responsibilities & Subcomponents |
|---|---|---|---|---|---|---|
| `/` | `app/page.tsx` | Static (○) | RSC -> Client | Public | ✅ Full Static (`title.absolute`, OG, Twitter) | Renders `HomeClient` (Hero, Philosophy, Tri-Section, VideoCircle, WhyMuryeon, TargetAudience, TrainingSystem, InquirySection). |
| `/about` | `app/about/page.tsx` | Static (○) | RSC -> Client | Public | ✅ Full Static (Article OG, Canonical) | Historical lineage, 24 Ban Association, Dobotongji book breakdown; renders `ArticleJsonLd`, `BreadcrumbJsonLd`, `AboutPage`. |
| `/basic` | `app/basic/page.tsx` | Static (○) | RSC -> Client | Public | ✅ Full Static (Article OG, Canonical) | Basic sword/spear stance and breathing; renders `ArticleJsonLd`, `BreadcrumbJsonLd`, `BasicPage`, `PageCTA`. |
| `/basic-sense` | `app/basic-sense/page.tsx` | Static (○) | RSC -> Client | Public | ✅ Full Static (Article OG, Canonical) | Overview of all 24 martial arts from Dobotongji; dynamically renders Recharts `DonutChart` with `{ ssr: false }`. |
| `/cutting` | `app/cutting/page.tsx` | Static (○) | RSC -> Client | Public | ✅ Full Static (Article OG, Canonical) | Cutting theory & mechanics; renders `CuttingPage`, `VadAnalyzer` (AI Kihap detection), `PageCTA`. |
| `/daily` | `app/daily/page.tsx` | Static (○) | RSC -> Client | 🔒 Protected (`middleware.ts`) | ❌ **Missing** (Inherits default layout title) | Member training activity heatmap; renders `RecordGraph` (1,095 commit buttons, Radix Dialog log modal). |
| `/equipment` | `app/equipment/page.tsx` | Static (○) | RSC -> Client | Public | ✅ Full Static (Article OG, Canonical) | Traditional armaments & brigandine armour; renders `Equipment` with Radix Dialog modal and purchase links. |
| `/gallery` | `app/gallery/page.tsx` | Static (○) | RSC -> Client | Public | ✅ Full Static (Website OG, Twitter) | Real training photography; renders `PhotoGrid` with category filters (Sparring, Demonstration, Tournament, Group, Portrait). |
| `/know-how` | `app/know-how/page.tsx` | Static (○) | RSC | Public (Disallowed in robots) | ❌ **Missing** | Stub/Placeholder route returning `<div>KnowHow</div>`. |
| `/location` | `app/location/page.tsx` | Static (○) | RSC | Public (Disallowed in robots) | ❌ **Missing** | Stub/Placeholder route returning `<div>Location</div>`. |
| `/login` | `app/login/page.tsx` | Static (○) | RSC -> Client | Public (Disallowed in robots) | ❌ **Missing** | Authentication portal; renders `LoginPage` with open-redirect URI sanitizer and credentials form. |
| `/mypage` | `app/mypage/page.tsx` | Static (○) | RSC -> Client | 🔒 Protected (`middleware.ts`) | ✅ Static (`title: "나의 무련 기록"`) | User dashboard; renders `DashboardStatCards` dynamically loading Recharts Line/Radar/Bar charts. |
| `/pattern` | `app/pattern/page.tsx` | Static (○) | RSC -> Client | Public | ✅ Full Static (Article OG, Canonical) | Turo forms & philosophy; renders `PatternCurriculumTable`, `InteractivePlayer` (YouTube video player), `PageCTA`. |
| `/reference` | `app/reference/page.tsx` | Static (○) | RSC -> Client | Public | ✅ Full Static (Article OG, Canonical) | Bibliography & historical sources on Dobotongji and Brigandine armour; renders `ReferencePage`, `PageCTA`. |
| `/sparring` | `app/sparring/page.tsx` | Static (○) | RSC -> Client | Public | ✅ Full Static (Article OG, Canonical) | Full-contact armored sparring guide & 4-stage progression; renders `SparringPage`, `PageCTA`. |
| `/test` | `app/test/page.tsx` | Static (○) | **Direct Client ('use client')** | Public (Disallowed in robots) | ❌ **None** (Client Component) | Experimental Voice Activity Detection test page. Calls `window.vad` and `downladaudio`. |
| `/test2` | `app/test2/page.tsx` | Static (○) | **Direct Client ('use client')** | Public (Disallowed in robots) | ❌ **None** (Client Component) | Experimental YouTube Comment manager using NextAuth `useSession` and Google OAuth token. |
| `/api/auth/[...nextauth]` | `app/api/auth/[...nextauth]/route.ts` | Dynamic (ƒ) | Route Handler | Public | N/A | NextAuth OAuth catch-all endpoint (GET, POST); configures GoogleProvider and JWT token passthrough. |
| `/api/auth/login` | `app/api/auth/login/route.ts` | Dynamic (ƒ) | Route Handler | Public | N/A | Custom JWT credential login (POST); validates payload, issues `accessToken` (httpOnly) & `isLoggedIn` cookies. |
| `/api/auth/logout` | `app/api/auth/logout/route.ts` | Dynamic (ƒ) | Route Handler | Public | N/A | Custom session logout (POST); clears `accessToken` and `isLoggedIn` cookies. |
| `/feed.xml` | `app/feed.xml/route.ts` | Dynamic (ƒ) | Route Handler | Public | N/A | RSS 2.0 XML feed generator (GET) covering 8 public content routes with RFC 822 publication dates. |
| `/robots.txt` | `app/robots.ts` | Static (○) | Metadata Route | Public | N/A | Generates robots.txt disallowing private/test routes (`/daily`, `/api`, `/test`, `/test2`, `/login`, etc.). |
| `/sitemap.xml` | `app/sitemap.ts` | Static (○) | Metadata Route | Public | N/A | Generates sitemap.xml listing 10 public routes with priority (0.6 - 1.0) and image metadata. |
| `_not-found` | `app/not-found.tsx` | Static (○) | RSC | Public | ✅ Static (`robots: { index: false }`) | Global 404 page; renders `<section>` with quick-links to main sections and home navigation button. |
| (Error Boundary) | `app/error.tsx` | Static (○) | Client Component | Public | N/A | Global error boundary; renders `<section>` with error digest display, retry handler, and return home button. |

---

## 3. Layout Nesting & Architectural Hierarchy

```
app/layout.tsx (Server Component - RootLayout)
 │
 ├── <head>
 │     ├── <Script id="theme-init" strategy="beforeInteractive"> (Dark/Light class bootstrap)
 │     ├── <link rel="alternate" type="application/rss+xml" href="/feed.xml">
 │     ├── Organization JSON-LD (<script id="org-jsonld">)
 │     ├── WebSite JSON-LD (<script id="website-jsonld">)
 │     ├── FAQPage JSON-LD (<script id="faq-jsonld">)
 │     ├── SportsClub / LocalBusiness JSON-LD (<script id="localbusiness-jsonld">)
 │     └── Search Console Verification Meta (Naver, Google)
 │
 └── <body>
       └── <Providers> (NextAuth SessionProvider)
             └── <ThemeProvider> (app/context/theme-context.tsx)
                   └── <VantaBackground> (app/component/vanta-main-background.tsx - Desktop 3D Cells)
                         └── <AppShell> (components/layout/app-shell.tsx)
                               ├── <a href="#main" className="sr-only focus:not-sr-only ..."> (Skip link)
                               ├── <MobileNav /> (components/layout/mobile-nav.tsx)
                               ├── <div className="flex">
                               │     ├── <aside><Navigation /></aside> (components/layout/navigation.tsx)
                               │     └── <main id="main">
                               │           ├── {children} (Current Route Page Content)
                               │           └── <Footer /> (components/layout/footer.tsx)
                               │         </main>
                               │   </div>
                               └── <ChatWidget /> (components/chat/chat-widget.tsx)
```

### Key Architectural Characteristics:
1. **Single Global Shell**: The application relies on a single layout (`app/layout.tsx`). No nested layouts or route groups exist under `app/`.
2. **Main Layout Pass-Through**: `<MainLayout>` (`components/layout/main-layout.tsx`) is implemented as `<>{children}</>`. This prevents duplicate `<main>` tags while allowing legacy page imports to function without regressions.
3. **Global Chat Integration**: `ChatWidget` is mounted globally in `AppShell` and connects to the Tokki SSE backend (`my-server-test.vercel.app`) using direct streaming tokens, maintaining conversation context via `localStorage`.

---

## 4. Middleware & Route Protection Audit

### `middleware.ts`:
- **Protected Paths**: Matches `/daily/:path*` and `/mypage/:path*`.
- **Validation Flow**:
  1. Inspects `accessToken` cookie from incoming request.
  2. If missing, immediately redirects to `/login?redirect=${encodeURIComponent(targetUrl)}`.
  3. If present, calls `AuthService.validateToken(accessToken)` via `lib/token-service.ts` (using `jose` to verify HMAC SHA-256 signature and assert `sub` and `role` claims).
  4. If invalid or expired, deletes cookies (`accessToken`, `isLoggedIn`) and redirects to `/login`.
  5. Passes through all other requests (`NextResponse.next()`).
- **Security Rating**: Excellent. Protects both server-rendered page navigation and any nested subpaths.

---

## 5. Detailed Findings & Micro-Defect Catalog

### Finding 1: Unwired VAD Web Audio Integration (High Severity Micro-Defect)
- **Files**: `components/ai/vad-analyzer.tsx` (lines 8-13, 64-67), `app/test/page.tsx` (line 11).
- **Observation**:
  `components/ai/vad-analyzer.tsx` comments:
  ```ts
  // @ricky0123/vad-web is loaded via script tag in layout.tsx as a global
  declare global {
    interface Window {
      vad: any;
    }
  }
  ```
  However, `app/layout.tsx` contains NO script tag loading `@ricky0123/vad-web`.
- **Impact**:
  When a user navigates to `/cutting` and clicks "마이크 켜기" on the AI 기합 측정기, `window.vad` is `undefined`, outputting: `"VAD 모듈이 아직 로드되지 않았습니다."` On `/test`, clicking "녹음 시작" crashes with `TypeError: Cannot read properties of undefined (reading 'MicVAD')`.
- **Remediation Recommendation**:
  Either import `@ricky0123/vad-web` dynamically within `VadAnalyzer` (e.g., `const vad = await import("@ricky0123/vad-web")`) or load the browser bundle via `next/script` in `layout.tsx` or `/cutting` page.

### Finding 2: Missing Metadata on Functional Pages (Medium Severity)
- **Files**:
  - `app/daily/page.tsx` (no metadata declared)
  - `app/login/page.tsx` (no metadata declared)
  - `app/know-how/page.tsx` (no metadata declared)
  - `app/location/page.tsx` (no metadata declared)
- **Observation**:
  These pages lack `export const metadata: Metadata`. Consequently, they fallback to the generic root template title (`무련 武緣 — 조선 24반 무예를 갑주 입고 대련합니다 | 무련`), missing dedicated titles, descriptions, and canonical links.
- **Remediation Recommendation**:
  Export explicit metadata objects for `/daily` (`"수련일지 — 나의 활동 기록 | 무련"`), `/login` (`"로그인 | 무련"`, `robots: { index: false, follow: false }`), and the remaining pages.

### Finding 3: Direct Client Components at Route Level (Low Severity / Next.js Best Practice)
- **Files**: `app/test/page.tsx`, `app/test2/page.tsx`.
- **Observation**:
  Both pages place `"use client"` at line 1 of `page.tsx`. In Next.js App Router, marking `page.tsx` itself as a Client Component prevents static metadata extraction (`export const metadata` triggers a Next.js compilation error if placed in a client file).
- **Remediation Recommendation**:
  Wrap interactive content in a client component and keep `page.tsx` as a Server Component. (Alternatively, delete or isolate `/test` and `/test2` since they are internal dev harnesses).

### Finding 4: Dead / Orphaned Components in `app/component/` (Low Severity / Maintenance)
- **Files**:
  - `app/component/styles.tsx`: Mock component showcasing Taekwondo/Hapkido/Taekkyon with Lorem ipsum. Unused anywhere in repository.
  - `app/component/training-gallery.tsx`: Complete hero photo teaser component meant for `/` (Home), filtering `hero === true` photos. Never mounted in `app/component/home-client.tsx`.
  - `app/component/animated-image.tsx`: Unused video animation component.
- **Impact**: Accumulates dead code, increases cognitive load for maintainers.

### Finding 5: Typographical Filename and Symbol Inconsistencies (Low Severity)
- **Files**:
  - `app/component/patten-page.tsx`: Misspelled filename (`patten` instead of `pattern`).
  - `app/test/wma.ts`: Function name exported as `downladaudio` (missing `o`, `w`, camelCase).

### Finding 6: Test Suite Scenario 5 Concurrency Timeout (Test Infrastructure)
- **File**: `__tests__/tiers/tier4-real-world-scenarios.test.tsx` (line 223).
- **Observation**:
  `SCENARIO 5` tests both `Equipment` modal and `RecordGraph` (which renders 1,095 buttons with DOM queries). Under concurrent test execution of 30 suites, it took 5.1s, narrowly exceeding Jest's 5000ms per-test timeout. When run in isolation, it passes in 1.2s.
- **Remediation Recommendation**:
  Add `jest.setTimeout(15000)` or pass a 15,000ms timeout argument to `it("SCENARIO 5...", async () => { ... }, 15000)`.

---

## 6. Project Summary Contribution (Artifact Ready)

The complete Routing Map table in Section 2 has been prepared in standard Markdown format, ready for direct inclusion into `PROJECT_SUMMARY.md`.
