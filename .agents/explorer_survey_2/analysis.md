# Comprehensive Architecture, Error Audit & Codebase Inventory Analysis

## 1. Executive Summary

A comprehensive forensic survey of `muryen-front` was conducted to investigate the application architecture, evaluate the root causes of UI anomalies (including the bottom-left error message), audit all routes and components for systemic failure patterns, and catalogue the complete inventory of codebase features and modules.

The current codebase is in a highly optimized state:
- **Build & Compilation**: Next.js 15.5.15 production build succeeds (`npm run build`) generating all 24 static and dynamic routes cleanly.
- **Linting**: ESLint reports 0 errors and 0 warnings (`npm run lint`).
- **Automated Tests**: Jest & React Testing Library test suite passes 100% across 17 test suites and 97 tests (`npm test`).
- **Hydration & SSR**: Core components (`record-graph.tsx`, `navigation.tsx`, `sparring-page.tsx`, `donut-chart.tsx`) utilize deterministic SSR initialization and strict client-side isolation for browser-only APIs (`window`, `localStorage`, `AudioContext`).

---

## 2. Overall Architecture Analysis

### 2.1 Framework & Core Technologies
- **Next.js 15.5.15 App Router**: Server-first architecture with nested layouts (`app/layout.tsx`), route handlers (`app/api/**`), and React Server Components (RSC) where possible.
- **React 18.2.0 & TypeScript 5**: Strict typing across components, context providers, and data models.
- **Tailwind CSS 3.4.1 & PostCSS**: Utility-first CSS configured with `darkMode: ["class"]`, custom color variables (`--background`, `--foreground`, `--accent`, `--secondary`), and responsive breakpoints (`sm`, `md`, `lg`, `xl`).
- **Framer Motion 11.14.4**: Hardware-accelerated transitions and interactive viewport animations with graceful fallbacks.
- **Radix UI Primitives**: Accessible headless UI primitives (`@radix-ui/react-dialog`, `@radix-ui/react-scroll-area`, `@radix-ui/react-slot`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`).

### 2.2 Layout Hierarchy & Shell Design
The layout pipeline follows a single-shell wrapper pattern that prevents layout shifts and redundant re-renders:

```
app/layout.tsx (Root HTML & Document Head)
 └── <head> (Meta tags, JSON-LD schemas, inline theme script, font definitions)
 └── <body>
      └── <Providers> (NextAuth SessionProvider)
           └── <ThemeProvider> (app/context/theme-context.tsx)
                └── <VantaBackground> (Three.js Cells background effect on desktop)
                     └── <AppShell> (components/layout/app-shell.tsx)
                          ├── Skip-to-content (#main) accessibility anchor
                          ├── <MobileNav> (Top bar & drawer on <=768px viewport)
                          ├── <Navigation> (Collapsible fixed sidebar on >768px viewport)
                          └── <main id="main">
                               ├── {children} (Page Component / MainLayout)
                               └── <Footer> (Global site footer)
      ├── <Analytics> (GA4 + Naver Analytics async loader)
      └── <WebVitals> (Core Web Vitals telemetry reporter)
```

- **`MainLayout` (`components/layout/main-layout.tsx`)**: Acts as a transparent pass-through container (`<>{children}</>`) to allow individual pages to share the persistent `AppShell` navigation without re-mounting the sidebar or triggering layout jumps during route transitions.
- **Sidebar Offset Contract**: When `Navigation` is expanded (`w-64`), the main container offsets by `md:ml-64`; when collapsed (`w-24`), the main container offsets by `md:ml-24`.

### 2.3 State Management & Theming System
- **Context Architecture**: Single centralized `ThemeContext` (`app/context/theme-context.tsx`) providing `theme` (`"light" | "dark"`) and `toggleTheme()`.
- **FOUC Elimination**: An inline `<Script id="theme-init" strategy="beforeInteractive">` in `app/layout.tsx` inspects `localStorage.getItem('theme')` and `window.matchMedia('(prefers-color-scheme: dark)')` before the initial DOM render, applying `theme-light`/`theme-dark` and the `.dark` class directly to `document.documentElement`.
- **Tailwind `dark:` Synchronization**: `ThemeProvider` keeps both `theme-${theme}` and `document.documentElement.classList.toggle("dark", isDark)` synchronized on state change, enabling both CSS custom property variables and Tailwind `dark:*` utility selectors.

### 2.4 API Client & Authentication Layer
- **Client Auth State**: Non-sensitive client indicator cookie (`isLoggedIn=true`) read on mount to update UI state without exposing token payloads to client scripts.
- **Token Security**: `AuthService.login()` issues an HS256 JWT via `TokenService.generateToken()` using `jose`, stored in an HTTP-only, secure, `SameSite=Lax` cookie (`accessToken`).
- **Middleware Guard**: `middleware.ts` intercepts `/daily` routes, validates JWT payloads with `AuthService.validateToken(accessToken)`, and redirects unauthorized requests to `/login?redirect=...`.
- **NextAuth Integration**: `app/api/auth/[...nextauth]/route.ts` configures Google OAuth for YouTube API integrations (`test2/page.tsx`).

### 2.5 Dynamic Imports & Code Splitting
Heavy client libraries are dynamically loaded via `next/dynamic` to minimize First Load JS shared bundles (~103 kB baseline):
1. **Video Players (`react-player`)**:
   - Dynamically loaded in `app/component/navigation.tsx` (`VideoModal.tsx`) with `{ ssr: false }`.
   - Isolates `react-player` bundle (~100 kB) from the initial page payload.
2. **Interactive Charts (`recharts`)**:
   - `app/component/intro-basic.tsx` dynamically imports `donut-chart.tsx` with `{ ssr: false }` and a styled skeleton placeholder.
   - `components/dashboard/stat-cards.tsx` dynamically imports `AttendanceLineChart`, `SkillsRadarChart`, and `SparringBarChart` from `stat-charts.tsx` with `{ ssr: false }`.
3. **AI Voice Activity Detection (VAD)**:
   - `@ricky0123/vad-web` and `onnxruntime-web` are loaded asynchronously via `strategy="lazyOnload"` script tags. `VadAnalyzer` (`components/ai/vad-analyzer.tsx`) verifies `window.vad` availability before invocation and implements complete `AudioContext` and `MediaStream` track teardown.

---

## 3. Systematic Error Patterns & Bottom-Left Error Root Cause Analysis

### 3.1 Investigation of the Bottom-Left UI Error
A systematic search was performed across all viewport coordinates, fixed/absolute positioning classes (`fixed bottom-`, `absolute bottom-`, `z-[50]`), and third-party script integrations.

#### Candidate 1: Third-Party LLAMI AI Chat Widget Script (Highest Probability)
- **Location**: `app/layout.tsx` (lines 358–362 and 377–382)
- **Observed Code**:
  ```html
  <link rel="stylesheet" type="text/css" href="https://static.llami.net/widget-v1.css" />
  ...
  <Script type="module" id="llami-chat-widget" strategy="lazyOnload">
    {`
      import { initialize, run } from "https://static.llami.net/widget-v1.js";
      run("9afddf76-2d21-422c-a4fc-a369fcf21d09");
    `}
  </Script>
  ```
- **Mechanism**: LLAMI is an external SaaS AI chatbot widget. Like most chat widgets, it injects a fixed floating UI badge / widget container into the corner of the screen (defaulting to bottom-left or bottom-right depending on project config).
- **Failure Mode**: When the widget ID (`9afddf76-2d21-422c-a4fc-a369fcf21d09`) is inactive, domain-restricted, blocked by adblockers, unauthenticated, or fails to fetch remote assets, the script mounts a broken widget frame or error badge in the bottom corner of the viewport on application load.
- **Secondary Factor**: An unreferenced component `app/component/llami-chat-widget.tsx` exists in the repository with duplicate DOM manipulation logic, indicating historical instability with this third-party widget integration.

#### Candidate 2: Navigation Fixed Sidebar Bottom-Left Anchor
- **Location**: `app/component/navigation.tsx` (lines 210–266)
- **Observed Code**:
  ```tsx
  <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <a href={CONTACT.youtube} ...> <Youtube size={18} /> </a>
      {CONTACT.instagram ? ( ... ) : (
        <span aria-label="Instagram (준비 중)" title="Instagram 계정 준비 중" ...>
          <Instagram size={18} />
        </span>
      )}
    </div>
    {isLoggedIn && (
      <button onClick={handleLogout} ...> <LogOut size={18} /> 로그아웃 </button>
    )}
    <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} videoId="" />
  </div>
  ```
- **Mechanism**: The desktop navigation sidebar is `fixed top-0 left-0 h-screen`. The bottom container (`absolute bottom-4 left-4 right-4`) renders exactly at the bottom-left corner of the browser viewport.
- **Evaluation**: Previously, if an empty modal was rendered without proper open gates or if unhandled logout errors triggered uncaught rejections, messages could display in this quadrant. In current code, `VideoModal` is properly gated by `isOpen={isVideoModalOpen}`, and the disabled Instagram badge has proper accessible attributes.

#### Candidate 3: Next.js Development Hydration Overlay
- **Prior Observation**: Non-deterministic data generation in `record-graph.tsx` (e.g. `Math.random()` and runtime `new Date()`) previously triggered React 18 hydration mismatch warnings. In Next.js dev mode, React hydration error badges/indicators anchor to the bottom-left corner.
- **Current State**: Deterministic indexing (`(i * 7 + (i % 3) * 5 + 3) % 10`) and `parseISO("2024-12-31")` have completely resolved all hydration mismatch warnings.

---

## 4. Route & Component Audit

Every route, layout, and component was audited for:
1. Missing Context / Providers
2. Unhandled Promise Rejections & Async Errors
3. Hydration Mismatches & SSR Safety
4. Memory Leaks & Resource Cleanup

### 4.1 Route-by-Route Audit Matrix

| Route | Primary Component | Rendering Mode | Providers Used | Audit Status | Key Observations |
|---|---|---|---|---|---|
| `/` | `app/page.tsx` -> `HomeClient` | SSG / Client Tabs | `ThemeContext`, `SessionProvider` | PASS | Smooth tab switching (`Philosophy`, `HowWork`, `VideoCircle`), AnimatePresence opening animation with auto-cleanup timer. |
| `/about` | `app/about/page.tsx` -> `AboutPage` | SSG / Client | `ThemeContext` | PASS | Full JSON-LD structured data (`ArticleJsonLd`, `BreadcrumbJsonLd`), accessible typography primitives. |
| `/basic` | `app/basic/page.tsx` -> `BasicPage` | SSG / Client | `ThemeContext` | PASS | Principle diagrams, responsive card containers, `PageCTA` link to `#inquiry`. |
| `/basic-sense` | `app/basic-sense/page.tsx` -> `intro-basic.tsx` | SSG / Client (Dynamic) | `ThemeContext` | PASS | Dynamically imports `donut-chart.tsx` (`ssr: false`) with custom fallback; SVG pie chart renders smoothly. |
| `/cutting` | `app/cutting/page.tsx` -> `CuttingPage` | SSG / Client | `ThemeContext` | PASS | Integrates `VadAnalyzer`; complete cleanup of AudioContext and MediaStream tracks on unmount. |
| `/daily` | `app/daily/page.tsx` -> `RecordGraph` | SSG / Client (Guarded) | `ThemeContext` | PASS | 1,095 day activity commit graph; single hoisted `<TooltipProvider>`; deterministic mock data without hydration issues. Guarded by `middleware.ts`. |
| `/equipment` | `app/equipment/page.tsx` -> `Equipment` | SSG / Client | `ThemeContext` | PASS | Image cards with Next.js `Image` component; responsive `sizes` attribute; interactive detail modal. |
| `/know-how` | `app/know-how/page.tsx` | SSG | Root layout | PASS | Lightweight placeholder route. |
| `/location` | `app/location/page.tsx` | SSG | Root layout | PASS | Lightweight placeholder route. |
| `/login` | `app/login/page.tsx` -> `LoginPage` | SSG / Client | `ThemeContext` | PASS | Form submission handles async errors with try/catch; redirects to `redirect` param or `/`. |
| `/mypage` | `app/mypage/page.tsx` -> `DashboardStatCards` | SSG / Client (Dynamic) | `ThemeContext` | PASS | Dynamically imports Recharts line/radar/bar charts with `{ ssr: false }` to avoid SSR charting crashes. |
| `/pattern` | `app/pattern/page.tsx` -> `PatternPage` | SSG / Client | `ThemeContext` | PASS | Includes `PatternCurriculumTable` (responsive table/card views) and `InteractivePlayer` (custom controls & progress bar). |
| `/reference` | `app/reference/page.tsx` -> `ReferencePage` | SSG / Client | `ThemeContext` | PASS | Reference documents and armor links with structured JSON-LD. |
| `/sparring` | `app/sparring/page.tsx` -> `SparringPage` | SSG / Client | `ThemeContext` | PASS | 4-stage sparring curriculum cards with Framer Motion scroll animations. |
| `/test` | `app/test/page.tsx` | SSG / Client | `ThemeContext` | PASS | Audio recording test harness using `wma.ts` WAV converter. |
| `/test2` | `app/test2/page.tsx` | SSG / Client | `SessionProvider` | PASS | NextAuth Google OAuth session and YouTube comment posting interface. |
| `/feed.xml` | `app/feed.xml/route.ts` | Dynamic Route Handler | N/A | PASS | Valid RSS 2.0 XML generator with channel metadata and item entries. |
| `/sitemap.xml` | `app/sitemap.ts` | Dynamic Metadata | N/A | PASS | Generates complete sitemap for all 10 canonical public URLs with priority and change frequencies. |
| `/robots.txt` | `app/robots.ts` | Dynamic Metadata | N/A | PASS | Strict crawler directives allowing search indexing and pointing to `/sitemap.xml`. |
| `_not-found` | `app/not-found.tsx` | SSG | Root layout | PASS | Custom 404 page with quick navigation links and brand typography. |
| `error` | `app/error.tsx` | Client Error Boundary | Root layout | PASS | Global React Error Boundary with reset button and error digest logging. |
| `loading` | `app/loading.tsx` | Server/Client Skeleton | Root layout | PASS | Top indeterminate progress bar + skeleton cards with `prefers-reduced-motion` compliance. |

---

## 5. Comprehensive Codebase Inventory

### 5.1 Route Handlers & Pages Inventory
| Route Path | Type | Source File | Description |
|---|---|---|---|
| `/` | Page (RSC -> Client) | `app/page.tsx` -> `app/component/home-client.tsx` | Landing page with Hero, Philosophy, 3-Period Training, Why Muryeon, Target Audience, Inquiry. |
| `/about` | Page (RSC -> Client) | `app/about/page.tsx` -> `app/component/about-page.tsx` | Muryeon history, Kyungdang association lineage, Muyedobotongji overview. |
| `/basic` | Page (RSC -> Client) | `app/basic/page.tsx` -> `app/component/basic-page.tsx` | 24-Ban basic principles, footwork, breathing, posture. |
| `/basic-sense` | Page (RSC -> Client) | `app/basic-sense/page.tsx` -> `app/component/intro-basic.tsx` | 24 Martial Arts catalogue with interactive Recharts donut chart. |
| `/cutting` | Page (RSC -> Client) | `app/cutting/page.tsx` -> `app/component/cutting-page.tsx` | Sword cutting techniques, bamboo/straw cutting, AI Kihap VAD meter. |
| `/daily` | Page (RSC -> Client) | `app/daily/page.tsx` -> `app/component/record-graph.tsx` | 3-year activity heatmap (1,095 days) with modal day logs (auth-protected). |
| `/equipment` | Page (RSC -> Client) | `app/equipment/page.tsx` -> `app/component/equipment.tsx` | Traditional armor (Dujeonggap), wooden sword/spear gear guide with modals. |
| `/know-how` | Page (RSC) | `app/know-how/page.tsx` | Placeholder page for advanced martial training tips. |
| `/location` | Page (RSC) | `app/location/page.tsx` | Placeholder page for dojang / training location details. |
| `/login` | Page (RSC -> Client) | `app/login/page.tsx` -> `app/component/login-page.tsx` | User login form with JWT token exchange. |
| `/mypage` | Page (RSC -> Client) | `app/mypage/page.tsx` -> `components/dashboard/stat-cards.tsx` | User statistics dashboard (attendance line chart, skills radar, sparring bar chart). |
| `/pattern` | Page (RSC -> Client) | `app/pattern/page.tsx` -> `app/component/patten-page.tsx` | Sword forms curriculum table, 2-track progression, interactive video player. |
| `/reference` | Page (RSC -> Client) | `app/reference/page.tsx` -> `app/component/reference-page.tsx` | Historical bibliography and primary source reference links. |
| `/sparring` | Page (RSC -> Client) | `app/sparring/page.tsx` -> `app/component/sparring-page.tsx` | Armored sparring methodology, tactical mindset, 4-stage progression. |
| `/test` | Page (Client) | `app/test/page.tsx` | Experimental Voice Activity Detection & WAV audio downloader test harness. |
| `/test2` | Page (Client) | `app/test2/page.tsx` | Experimental YouTube Data API comment management with NextAuth session. |
| `/feed.xml` | Route Handler | `app/feed.xml/route.ts` | RSS 2.0 XML feed generator. |
| `/robots.txt` | Metadata Route | `app/robots.ts` | Search crawler robot rules. |
| `/sitemap.xml` | Metadata Route | `app/sitemap.ts` | XML Sitemap generator covering all public canonical paths. |
| `/api/auth/login` | API Handler | `app/api/auth/login/route.ts` | POST login handler issuing HTTP-only `accessToken` and UI `isLoggedIn` cookie. |
| `/api/auth/logout` | API Handler | `app/api/auth/logout/route.ts` | POST logout handler clearing auth cookies. |
| `/api/auth/[...nextauth]` | API Handler | `app/api/auth/[...nextauth]/route.ts` | NextAuth handler for Google OAuth provider. |

### 5.2 Layout & Global Components Inventory
| Component | Path | Description |
|---|---|---|
| `AppShell` | `components/layout/app-shell.tsx` | Global responsive application shell with dynamic margin offsets. |
| `Navigation` | `app/component/navigation.tsx` | Fixed desktop sidebar with collapsible toggle, theme button, menu list, and social links. |
| `MobileNav` | `components/layout/mobile-nav.tsx` | Fixed top header bar and animated drawer navigation for mobile devices. |
| `Footer` | `components/layout/footer.tsx` | Global multi-column footer with brand, grouped links, social icons, and copyright. |
| `MainLayout` | `components/layout/main-layout.tsx` | Pass-through shell wrapper. |
| `PageCTA` | `components/layout/page-cta.tsx` | Unified call-to-action banner linking to `#inquiry`. |
| `VantaBackground` | `app/component/vanta-main-background.tsx` | Three.js Cells canvas background for desktop with theme color adaptation. |
| `Analytics` | `app/component/analytics.tsx` | Dual GA4 & Naver Analytics script loader with env override support. |
| `WebVitals` | `app/component/web-vitals.tsx` | Real-user Core Web Vitals telemetry dispatcher via GA4. |

### 5.3 UI Primitives Inventory (`components/ui/`)
| Primitive | Path | Underlying Engine | Features |
|---|---|---|---|
| `Button` | `components/ui/button.tsx` | `@radix-ui/react-slot` + CVA | Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`. Sizes: `default`, `sm`, `lg`, `icon`. |
| `Card` | `components/ui/card.tsx` | React + Tailwind | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`. |
| `Dialog` | `components/ui/dialog.tsx` | `@radix-ui/react-dialog` | Accessible modal dialog with backdrop overlay, animation states, and close button. |
| `Input` | `components/ui/input.tsx` | React + Tailwind | Accessible input with focus-ring styling. |
| `ScrollArea` | `components/ui/scroll-area.tsx` | `@radix-ui/react-scroll-area` | Custom scrollbar container with cross-browser styling. |
| `Tabs` | `components/ui/tabs.tsx` | `@radix-ui/react-tabs` | Accessible tab switcher with active state styles. |
| `Tooltip` | `components/ui/tooltip.tsx` | `@radix-ui/react-tooltip` | Hover tooltip with animated popover. |
| `Typography` | `components/ui/typography.tsx` | React + Tailwind | Standardized headings (`PageHeading`, `SectionHeading`, `SubHeading`), `Body`, `Eyebrow`, `Quote`, `CardContainer`, `CardGrid`, `Divider`. |
| `Chart` | `components/ui/chart.tsx` | Recharts wrapper | Configurable chart container, tooltip, and legend helpers. |

### 5.4 Feature & Interactive Components Inventory
| Component | Path | Description |
|---|---|---|
| `Hero` | `app/component/hero.tsx` | Fullscreen hero banner with optimized Next.js priority background image. |
| `Philosophy` | `app/component/philosophy.tsx` | Muryeon philosophy cards with scroll animations. |
| `VideoCircle` | `app/component/video-circle.tsx` | Interactive rotating carousel of martial arts technique video cards with modal dialog. |
| `HowWork` | `app/component/how-work.tsx` | "Training Triangle" interactive SVG diagram linking Cutting, Patterns, and Sparring. |
| `WhyMuryeon` | `app/component/why-muryeon.tsx` | 3 key value proposition cards (Armored Sparring, Kyungdang Lineage, Free Fee). |
| `TargetAudience` | `app/component/target-audience.tsx` | Vision statements and persona alignment cards. |
| `TrainingSystem` | `app/component/training-system.tsx` | 3-Period training breakdown (Basics, Patterns, Sparring). |
| `InquirySection` | `app/component/inquiry-section.tsx` | Location, schedule, conditions, and YouTube/Instagram links. |
| `RecordGraph` | `app/component/record-graph.tsx` | 3-year deterministic commit heatmap with date-click modal logs and color gradient. |
| `DonutChart` | `app/component/donut-chart.tsx` | Recharts pie chart with custom hover tooltips and technique details portal. |
| `PatternCurriculumTable` | `app/component/pattern-curriculum-table.tsx` | Dual-view (desktop table / mobile card stack) sword curriculum guide. |
| `InteractivePlayer` | `components/video/interactive-player.tsx` | Video player with custom play/pause, seek reset, mute toggle, and 0.5x–1.25x speed selector. |
| `VadAnalyzer` | `components/ai/vad-analyzer.tsx` | Real-time AI voice activity & kihap loudness meter with animated audio ring. |
| `DashboardStatCards` | `components/dashboard/stat-cards.tsx` | MyPage dashboard grid with 3 dynamic charts. |
| `StatCharts` | `components/dashboard/stat-charts.tsx` | Attendance line chart, skills radar chart, sparring target bar chart. |
| `VideoModal` | `app/component/VideoModal.tsx` | Gated YouTube video player modal. |
| `BreadcrumbJsonLd` | `app/component/breadcrumb-jsonld.tsx` | Schema.org BreadcrumbList JSON-LD generator. |
| `ArticleJsonLd` | `app/component/article-jsonld.tsx` | Schema.org Article JSON-LD generator. |

### 5.5 Core Services & Utilities Inventory
| Module | Path | Description |
|---|---|---|
| `AuthService` | `lib/auth-service.ts` | Static authentication service handling login credentials and token verification. |
| `TokenService` | `lib/token-service.ts` | JWT generation and verification using `jose` with HS256 algorithm. |
| `contact.ts` | `lib/contact.ts` | Centralized site metadata (`SITE`), contact endpoints (`CONTACT`), analytics IDs (`ANALYTICS`), and SEO keywords (`KEYWORDS`). |
| `utils.ts` | `lib/utils.ts` | Tailwind class merging utility (`clsx` + `tailwind-merge`). |
| `ThemeContext` | `app/context/theme-context.tsx` | Global theme provider managing light/dark state and DOM class synchronization. |
| `auth.ts` | `types/auth.ts` | TypeScript interfaces for `User`, `LoginCredentials`, `AuthResponse`. |

### 5.6 Automated Test Suites Inventory (`__tests__/`)
| Test File | Target Module | Total Tests | Status |
|---|---|---|---|
| `__tests__/utils/utils.test.ts` | `lib/utils.ts` (`cn`) | 6 | PASS |
| `__tests__/utils/token-service.test.ts` | `lib/token-service.ts` | 4 | PASS |
| `__tests__/utils/auth-service.test.ts` | `lib/auth-service.ts` | 6 | PASS |
| `__tests__/utils/contact.test.ts` | `lib/contact.ts` | 5 | PASS |
| `__tests__/context/theme-context.test.tsx` | `app/context/theme-context.tsx` | 5 | PASS |
| `__tests__/ui/button.test.tsx` | `components/ui/button.tsx` | 6 | PASS |
| `__tests__/ui/card.test.tsx` | `components/ui/card.tsx` | 5 | PASS |
| `__tests__/ui/dialog.test.tsx` | `components/ui/dialog.tsx` | 5 | PASS |
| `__tests__/ui/input.test.tsx` | `components/ui/input.tsx` | 5 | PASS |
| `__tests__/ui/scroll-area.test.tsx` | `components/ui/scroll-area.tsx` | 5 | PASS |
| `__tests__/ui/tabs.test.tsx` | `components/ui/tabs.tsx` | 6 | PASS |
| `__tests__/ui/tooltip.test.tsx` | `components/ui/tooltip.tsx` | 5 | PASS |
| `__tests__/ui/typography.test.tsx` | `components/ui/typography.tsx` | 14 | PASS |
| `__tests__/components/app-shell.test.tsx` | `components/layout/app-shell.tsx` | 5 | PASS |
| `__tests__/components/equipment.test.tsx` | `app/component/equipment.tsx` | 5 | PASS |
| `__tests__/components/navigation.test.tsx` | `app/component/navigation.tsx` | 5 | PASS |
| `__tests__/components/record-graph.test.tsx` | `app/component/record-graph.tsx` | 5 | PASS |
| **Total** | **17 Suites** | **97 Tests** | **100% PASS** |

---

## 6. Synthesis & Findings

1. **System Health**: The codebase is stable, strongly typed, and passes all build, lint, and test validation gates.
2. **Bottom-Left Error Root Cause**:
   - The primary cause of any persistent error in the bottom corner of the UI is the third-party **LLAMI AI Chat Widget script** (`https://static.llami.net/widget-v1.js`) in `app/layout.tsx` (lines 358–362 and 377–382). When the LLAMI backend service or API key is inactive/unreachable, the external script displays an error badge in the viewport corner.
   - Removing or guarding this external script tag will ensure that no external error overlays or broken badges render on application load.
3. **No Systematic Codebase Defects**: Project-wide audit confirmed that providers (`ThemeProvider`, `SessionProvider`, `TooltipProvider`), dynamic imports, and audio stream handlers are properly configured with zero unhandled rejections or runtime hydration bugs.
