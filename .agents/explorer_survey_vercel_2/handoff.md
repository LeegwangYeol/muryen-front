# Comprehensive Architectural Survey & Live Vercel Audit Checklist

**Agent**: `explorer_survey_vercel_2`  
**Target Repository**: `muryen-front`  
**Live Production URL**: `https://muryen-front.vercel.app`  
**Timestamp**: 2026-09-11T00:04:00+09:00  

---

## 1. Observation

### 1.1 Target Environment & Base Infrastructure
- **Live Vercel Production URL**: `https://muryen-front.vercel.app`
  - Defined in `lib/contact.ts` (line 2): `url: "https://muryen-front.vercel.app"`
  - Used in canonical metadata, OpenGraph, Twitter Cards, `sitemap.ts`, `robots.ts`, `feed.xml/route.ts`, Schema.org JSON-LD (`organizationJsonLd`, `websiteJsonLd`, `localBusinessJsonLd`).
- **Core Framework & Runtime**:
  - `next`: `15.5.15` (App Router)
  - `react`: `18.2.0`, `react-dom`: `18.2.0`
  - `typescript`: `^5`, `tailwindcss`: `^3.4.1`
  - `recharts`: `^2.15.0`, `framer-motion`: `^11.14.4`, `react-player`: `^2.14.1`
  - `@radix-ui/react-dialog`: `^1.1.2`, `@radix-ui/react-tabs`: `^1.1.1`
  - `jose`: `^5.9.6`, `next-auth`: `^4.24.11`
- **Global Layout Shell Hierarchy (`app/layout.tsx`)**:
  - `<html lang="ko" className="light ${fontSans.variable} ${fontSerif.variable}" suppressHydrationWarning>`
  - Inline head script: `theme-init` (reads `localStorage.getItem('theme')` / `prefers-color-scheme` before render)
  - Verification tokens:
    - Naver Webmaster: `2cce48a339c16bb7335a20dc643ac93bcb8efe9a`
    - Google Search Console: `atTkk_hkH8HFattE-OcHmpSNTwwRphdqaaHZKsuwOuk`
  - Body hierarchy:
    - `<Providers>` (NextAuth `SessionProvider` in `app/providers.tsx`)
    - `<ThemeProvider>` (`app/context/theme-context.tsx`)
    - `<VantaBackground>` (`app/component/vanta-main-background.tsx`, 3D Cells canvas on `#vanta-bg`)
    - `<AppShell>` (`components/layout/app-shell.tsx`)
      - Skip link: `<a href="#main" className="sr-only focus:not-sr-only">본문으로 건너뛰기</a>`
      - `<MobileNav />` (`components/layout/mobile-nav.tsx`, visible on `< md`)
      - Desktop `<Navigation onExpand={setIsNavExpanded} />` (`app/component/navigation.tsx`, visible on `>= md`)
      - `<main id="main">` (`flex-1 transition-all duration-300 md:ml-64` or `md:ml-24`)
      - `<Footer />` (`components/layout/footer.tsx`)
      - `<ChatWidget />` (`components/chat/chat-widget.tsx`, floating launcher bubble & panel)
    - `<Analytics />` (`app/component/analytics.tsx`, GA4 + Naver Analytics)
    - `<WebVitals />` (`app/component/web-vitals.tsx`, Real-user CWV reporting to GA4)

---

### 1.2 Comprehensive Inventory of App Pages (`app/`)

| Path | File Location | Route Type | Rendering / Guards | Key Features & Interactive Elements |
|---|---|---|---|---|
| `/` | `app/page.tsx` & `app/component/home-client.tsx` | Page | Client (HomeClient) | 2.5s Hero splash screen transition, 3-tab switcher (`Philosophy`, `HowWork`, `VideoCircle`), `WhyMuryeon`, `TargetAudience`, `TrainingSystem`, `InquirySection` (`#inquiry`) |
| `/about` | `app/about/page.tsx` & `app/component/about-page.tsx` | Page | Static + Client components | Muryeon intro, 24-ban martial arts association lineage, Muyedobotongji history, 4 volumes summary, CTA, JSON-LD |
| `/basic-sense` | `app/basic-sense/page.tsx` & `app/component/intro-basic.tsx` | Page | Dynamic Client (`ssr: false` DonutChart) | 4 `DonutChart` instances (Books 1–4) with Recharts Pie, SVG labels, interactive hover tooltips with portals, image preloading |
| `/basic` | `app/basic/page.tsx` & `app/component/basic-page.tsx` | Page | Static + Client components | Sword/spear/pole fundamentals, movement principles, breathing, footwork, CTA, JSON-LD |
| `/pattern` | `app/pattern/page.tsx` & `app/component/patten-page.tsx` | Page | Client | Turo training philosophy, `PatternCurriculumTable`, `InteractivePlayer` (ReactPlayer with custom controls & speed selector) |
| `/cutting` | `app/cutting/page.tsx` & `app/component/cutting-page.tsx` | Page | Client | Straw bundle/bamboo cutting principles, `VadAnalyzer` (AI Kihap detection mic tool with audio amplitude score) |
| `/sparring` | `app/sparring/page.tsx` & `app/component/sparring-page.tsx` | Page | Client | Dujunggap armor sparring philosophy, 30% sparring progression to free armored combat, JSON-LD |
| `/gallery` | `app/gallery/page.tsx` & `app/component/photo-grid.tsx` | Page | Client (PhotoGrid) | Training & sparring photo gallery, category filter chips ("전체", "갑주 대련", "검술 시범", "대회", "단체", "인물"), hover zoom, captions |
| `/daily` | `app/daily/page.tsx` & `app/component/record-graph.tsx` | Page (Protected) | **Protected by `middleware.ts`** | GitHub-style 3-year commit history grid, day cell click opens Radix Dialog modal with practice sessions |
| `/mypage` | `app/mypage/page.tsx` & `components/dashboard/stat-cards.tsx` | Page (Protected) | **Protected by `middleware.ts`** | User dashboard (128 hrs), Recharts visualizations (`AttendanceLineChart`, `SkillsRadarChart`, `SparringBarChart`) |
| `/equipment` | `app/equipment/page.tsx` & `app/component/equipment.tsx` | Page | Client | Equipment showcase (Armor, Helmet, Spear), Radix `<Dialog>` modal with details, makingMethod, external purchase link |
| `/reference` | `app/reference/page.tsx` & `app/component/reference-page.tsx` | Page | Static + Client components | Historical research documents, Muyedobotongji source materials, external resource links |
| `/login` | `app/login/page.tsx` & `app/component/login-page.tsx` | Page | Client | Username/password form, `sanitizeRedirectUrl` open-redirect protection, authenticates against `/api/auth/login` |
| `/location` | `app/location/page.tsx` | Page (Stub) | Static | Returns `<div>Location</div>` (robots disallowed) |
| `/know-how` | `app/know-how/page.tsx` | Page (Stub) | Static | Returns `<div>KnowHow</div>` (robots disallowed) |
| `/test` | `app/test/page.tsx` | Page (Test) | Client | VAD voice test with WAV download (robots disallowed) |
| `/test2` | `app/test2/page.tsx` | Page (Test) | Client | YouTube comment posting & NextAuth Google sign-in test (robots disallowed) |
| `not-found` | `app/not-found.tsx` | Special Route | Client/Static | Custom 404 page with Hanja "武緣" heading, quick link chips, return home CTA |
| `error` | `app/error.tsx` | Special Route | Client error boundary | Custom error page with retry `reset()` button, `error.digest` display, return home CTA |
| `loading` | `app/loading.tsx` | Special Route | Client | Route transition progress bar, spinner, animated skeleton placeholders |

---

### 1.3 Complete Inventory of API Routes & Meta Endpoints

1. **`POST /api/auth/login`** (`app/api/auth/login/route.ts`):
   - Validates `username` and `password` strings.
   - Hardcoded user verification in `lib/auth-service.ts`:
     - Admin: `1111` / `1111` -> `{ id: "1", role: "admin" }`
     - User: `2222` / `2222` -> `{ id: "2", role: "user" }`
   - Signs JWT using `jose` HS256 (`lib/token-service.ts`).
   - Sets cookies:
     - `accessToken`: HttpOnly, Secure in prod, SameSite=Lax, Max-Age 24h.
     - `isLoggedIn`: "true", Client-accessible, Secure in prod, SameSite=Lax, Max-Age 24h.
   - **Production Requirement**: `process.env.JWT_SECRET` must be set in Vercel environment variables!
2. **`POST /api/auth/logout`** (`app/api/auth/logout/route.ts`):
   - Deletes `accessToken` and `isLoggedIn` cookies.
   - Returns `{ success: true }`.
3. **`GET / POST /api/auth/[...nextauth]`** (`app/api/auth/[...nextauth]/route.ts`):
   - NextAuth handler with optional `GoogleProvider` (active if `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` exist).
   - Custom `signIn: "/login"`.
4. **`GET /feed.xml`** (`app/feed.xml/route.ts`):
   - RSS 2.0 XML generator with 8 published article entries.
   - Headers: `Content-Type: application/rss+xml; charset=utf-8`, `Cache-Control: public, max-age=3600, s-maxage=3600`.
5. **`GET /robots.txt`** (`app/robots.ts`):
   - Disallows: `/daily`, `/api`, `/test`, `/test2`, `/login`, `/location`, `/know-how`.
   - Links sitemap: `https://muryen-front.vercel.app/sitemap.xml`.
6. **`GET /sitemap.xml`** (`app/sitemap.ts`):
   - Generates XML sitemap covering 10 primary pages (`/`, `/about`, `/gallery`, `/basic-sense`, `/sparring`, `/basic`, `/pattern`, `/cutting`, `/equipment`, `/reference`).

---

### 1.4 Navigation Items Inventory

#### Desktop Navigation (`app/component/navigation.tsx`)
- Sidebar with expandable width (`w-64` expanded, `w-24` collapsed), chevron toggle button.
- Home brand link (`/`).
- Theme toggle button (Sun/Moon icon).
- Menu items:
  1. `/about` -> "소개" (`Info` icon)
  2. `/basic-sense` -> "24반" (`Feather` icon)
  3. `/basic` -> "기본기" (`BookOpen` icon)
  4. `/pattern` -> "투로" (`Waypoints` icon)
  5. `/cutting` -> "베기" (`Scissors` icon)
  6. `/sparring` -> "대련" (`Shield` icon)
  7. `/daily` -> "수련일지" (`Dumbbell` icon) — *Protected*
  8. `/#inquiry` -> "입회 안내" (`Mail` icon)
  9. `/mypage` -> "나의 수련 (My)" (`FileText` icon) — *Protected*
  *(Note: `/reference` and `/equipment` are commented out in desktop sidebar menu list)*
- Bottom bar:
  - YouTube link (`https://www.youtube.com/@muryeon`)
  - Instagram icon (disabled placeholder)
  - Logout button (`handleLogout()`, visible when `isLoggedIn` is true)

#### Mobile Navigation (`components/layout/mobile-nav.tsx`)
- Top bar (`h-14`, safe-area inset top) with brand link, Theme toggle, Hamburger menu button.
- Sliding drawer (Framer Motion `motion.aside`, `w-72` max-w `85vw`):
  1. `/` -> "홈" (`Home`)
  2. `/#inquiry` -> "입회 안내" (`Mail`, highlighted badge)
  3. `/about` -> "소개" (`Info`)
  4. `/basic-sense` -> "24반" (`Feather`)
  5. `/basic` -> "기본기" (`BookOpen`)
  6. `/pattern` -> "투로" (`Waypoints`)
  7. `/cutting` -> "베기" (`Scissors`)
  8. `/sparring` -> "대련" (`Shield`)
  9. `/gallery` -> "사진첩" (`Images`) — *Note: Mobile nav features `/gallery`*
  10. `/daily` -> "수련일지" (`Dumbbell`) — *Protected*
- Bottom social links (YouTube, Instagram) and Logout button.

#### Footer Navigation (`components/layout/footer.tsx`)
- Desktop 4-column layout & Mobile `<details>` expandable accordion:
  - **소개**: `/about#muryeon`, `/about#association`, `/about#dobo`, `/about#techniques`
  - **수련**: `/basic`, `/pattern`, `/cutting`, `/sparring`, `/daily`
  - **참여**: `/#inquiry`, `/gallery`, `/basic-sense`, `/reference`
- Branding, Copyright with hydration suppression, slogan.

---

### 1.5 Modal Dialogs Inventory

1. **`app/component/equipment.tsx`**:
   - Built with Radix UI `<Dialog>`, `<DialogContent>`, `<DialogHeader>`, `<DialogTitle>`, `<DialogDescription>`, `<DialogFooter>`.
   - Triggered by clicking "자세히 보기" on equipment cards (전통 갑옷, 전투용 투구, 장창).
   - Displays details, materials, making method, and external purchase link (`https://example.com/...`).
2. **`app/component/record-graph.tsx`**:
   - Built with Radix UI `<Dialog>`, `<DialogContent>`, `<DialogHeader>`, `<DialogTitle>`, `<DialogDescription>`.
   - Triggered by clicking any daily commit cell in the 3-year history grid on `/daily`.
   - Displays session date, list of practice records, timestamps, and details.
3. **`app/component/video-circle.tsx`**:
   - Custom modal dialog with backdrop (`role="dialog"`, `aria-modal="true"`, `aria-labelledby="circle-modal-title"`).
   - Triggered by clicking or pressing Enter/Space on any of the 6 rotating video/story circles on `/` (3rd tab).
   - Displays full-width image, title, story text, CTA navigation button, and close button. Keyboard Esc listener.
4. **`components/chat/chat-widget.tsx`**:
   - Built with floating launcher bubble and dialog panel (`role="dialog"`, `aria-label="... 채팅"`).
   - Triggered by clicking the red floating message bubble in the bottom-right corner.
   - Loads Tokki AI helper persona, message history, suggested questions, streaming chat input form.

---

### 1.6 Interactive Components Inventory

1. **`app/component/donut-chart.tsx`**:
   - 4 instances on `/basic-sense` rendered via Recharts `PieChart` and `ResponsiveContainer`.
   - Custom SVG `<foreignObject>` labels for technique circular icons.
   - Active shape `CustomSectionContent` with `onMouseEnter`/`onMouseMove`/`onMouseLeave` coordinates.
   - Floating `<Tooltip>` rendered into `document.body` via `createPortal`.
2. **`components/dashboard/stat-charts.tsx`**:
   - 3 Recharts components dynamically imported (`ssr: false`) in `components/dashboard/stat-cards.tsx` on `/mypage`:
     - `AttendanceLineChart`: Line chart of monthly attendance (`#d4af37`).
     - `SkillsRadarChart`: Radar chart of skill scores across 6 disciplines.
     - `SparringBarChart`: Bar chart of hit frequencies by body target.
   - Supports both light and dark theme colors (`textColor`, `gridColor`).
3. **`app/component/record-graph.tsx`**:
   - 3-year GitHub-style commit heatmap on `/daily` using `date-fns`.
   - Color gradient (`bg-emerald-50` to `bg-emerald-800`).
   - Single dialog modal state for cell clicks.
4. **`app/component/video-circle.tsx`**:
   - Orbiting 6 items in continuous rotation (`animate-[spin_90s_linear_infinite]`).
   - Initial 1.5s radial expansion animation (`requestAnimationFrame`).
   - Interactive hover cards with dark/light glassmorphism and image glow.
5. **`app/context/theme-context.tsx` & Theme Toggler**:
   - Synchronizes `theme` ("light" | "dark") to `localStorage`.
   - Modifies `document.documentElement` with classes `.dark` and `theme-light`/`theme-dark`.
   - Listens to cross-tab `storage` events.
   - Buttons present in Desktop Sidebar, Mobile Top Bar, and Mobile Drawer.
6. **`components/video/interactive-player.tsx`**:
   - Custom ReactPlayer controller on `/pattern` for YouTube video `https://www.youtube.com/watch?v=kYJvMv1w8i4`.
   - Interactive Play/Pause, seek to start, mute toggle, progress bar, speed selector (0.5x, 0.75x, 1.0x, 1.25x).
7. **`components/ai/vad-analyzer.tsx`**:
   - AI Kihap detector on `/cutting`.
   - Mic toggle button, animation pulse, feedback messages ("Perfect!...", "Good!...", "VAD 모듈이 아직 로드되지 않았습니다.").
   - Complete AudioContext / MediaStream track cleanup on unmount.
8. **`app/component/photo-grid.tsx`**:
   - Category filtering on `/gallery` with interactive pill buttons and item count badges.
9. **`app/component/vanta-main-background.tsx`**:
   - Dynamic 3D Cells background on desktop viewports via Three.js and Vanta.js CDNs.
   - Automatically disabled on screens `<= 768px` and when `prefers-reduced-motion: reduce` is detected.
10. **`components/chat/chat-widget.tsx`**:
    - AI Chat assistant connecting to Tokki backend (`https://my-server-test.vercel.app`).
    - SSE streaming tokens, auto-scroll to bottom, localStorage thread ID persistence.

---

## 2. Logic Chain

1. **Routing Architecture**: Next.js App Router defines 17 unique page routes. Routes `/daily` and `/mypage` are explicitly intercepted by `middleware.ts` before rendering. If `accessToken` cookie is absent or invalid, middleware redirects to `/login?redirect=...`. Therefore, verification on the live site must test both unauthenticated redirection and authenticated session access.
2. **Authentication Mechanism**: The login API (`/api/auth/login`) issues a signed JWT using `lib/token-service.ts`. In production mode (`process.env.NODE_ENV === 'production'`), `TokenService.getSecretKey()` strictly requires `process.env.JWT_SECRET`. If this environment variable was omitted during Vercel deployment, login requests will fail with 500. This is an essential live verification item.
3. **Responsive Navigation Discrepancies**: Desktop `navigation.tsx` includes `/mypage` and omits `/gallery`, whereas mobile `mobile-nav.tsx` includes `/gallery` and omits `/mypage`. Furthermore, `/equipment` and `/reference` are commented out in the desktop sidebar but are accessible in the footer, sitemap, and direct URLs. Both navigation surfaces must be tested across desktop and mobile viewports.
4. **Third-Party CDN & API Dependencies**:
   - Vanta 3D background relies on external CDNs (`cdnjs.cloudflare.com` and `cdn.jsdelivr.net`).
   - Tokki AI Chatbot connects to an external server (`https://my-server-test.vercel.app`).
   - YouTube embedded player and links connect to `youtube.com`.
   - GA4 and Naver Analytics inject external scripts (`googletagmanager.com`, `wcs.pstatic.net`).
   If any CSP or network restrictions interfere on Vercel production, console errors or broken features will occur.
5. **Dynamic Imports & Client Components**: Heavy charting libraries (Recharts) and media players (ReactPlayer) are configured with `ssr: false` or client-side mount checks to prevent SSR hydration mismatches. Live verification using Chrome DevTools must inspect the console for hydration warnings or layout shifts.

---

## 3. Caveats

- **Vercel Environment Secrets**: We do not have direct access to the Vercel project settings dashboard, so we cannot statically verify whether `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_GA_ID`, or `NEXT_PUBLIC_TOKKI_API_URL` are configured on Vercel. This must be confirmed empirically via live network requests.
- **External API Availability**: The Tokki backend (`https://my-server-test.vercel.app`) is an external microservice whose uptime is independent of `muryen-front.vercel.app`.
- **Stub Routes**: `/location` and `/know-how` exist in the repository as bare stubs (`<div>Location</div>`, `<div>KnowHow</div>`). They are excluded in `robots.ts` and not linked in main navigation.

---

## 4. Conclusion & Live Vercel Verification Checklist

To execute a definitive audit of `https://muryen-front.vercel.app` using Chrome DevTools MCP tools, the audit team must execute against the following structured checklist:

### 4.1 Route & Status Code Verification Matrix

| Target URL | Expected Status | Unauthenticated Behavior | Authenticated Behavior | Verification Criteria |
|---|---|---|---|---|
| `/` | 200 OK | Full access | Full access | Splash screen fades in 2.5s; 3 tabs switch properly; `#inquiry` anchor scrolls cleanly |
| `/about` | 200 OK | Full access | Full access | Text renders with correct typography; JSON-LD scripts present in DOM |
| `/basic-sense` | 200 OK | Full access | Full access | 4 Donut charts render without crashing; hovering slices displays portal tooltip |
| `/basic` | 200 OK | Full access | Full access | Prose & principles cards render cleanly; image loads correctly |
| `/pattern` | 200 OK | Full access | Full access | Curriculum table renders; ReactPlayer mounts; play/pause/speed controls work |
| `/cutting` | 200 OK | Full access | Full access | VadAnalyzer renders; clicking mic button displays non-crashing feedback message |
| `/sparring` | 200 OK | Full access | Full access | Armored sparring cards & images load; typography scales cleanly |
| `/gallery` | 200 OK | Full access | Full access | Photo grid renders; category filter chips ("전체", "갑주 대련", etc.) filter images |
| `/equipment` | 200 OK | Full access | Full access | 3 cards render; clicking "자세히 보기" opens Radix Dialog modal; ESC/close works |
| `/reference` | 200 OK | Full access | Full access | Reference document links render; layout shell intact |
| `/daily` | 307 -> `/login` | **Redirects to `/login?redirect=%2Fdaily`** | **Renders 200 OK** | Commit history grid renders; clicking a day cell opens Radix Dialog |
| `/mypage` | 307 -> `/login` | **Redirects to `/login?redirect=%2Fmypage`** | **Renders 200 OK** | 128 hrs card renders; Attendance Line, Skills Radar, Sparring Bar charts render |
| `/login` | 200 OK | Form renders | Form renders | Inputs work; submit `1111`/`1111` logs in; redirect sanitization prevents open redirect |
| `/nonexistent-route` | 404 Not Found | Renders `app/not-found.tsx` | Renders `app/not-found.tsx` | Hanja "武緣" title, quick links work, "메인으로 돌아가기" button navigates to `/` |
| `/feed.xml` | 200 OK | RSS XML response | RSS XML response | Valid XML, `application/rss+xml`, 8 items |
| `/sitemap.xml` | 200 OK | Sitemap XML response | Sitemap XML response | Valid XML with 10 canonical URLs |
| `/robots.txt` | 200 OK | Text response | Text response | Disallows `/daily`, `/api`, `/test`, etc., points to sitemap |

---

### 4.2 Key User Journeys Checklist

- [ ] **Journey 1: Public Exploration & Tab Navigation**
  1. Open `https://muryen-front.vercel.app/`.
  2. Verify opening splash animation: Hero overlay displays for ~2.5s and smoothly fades out.
  3. Verify sticky tab list: click "무련이란" -> `Philosophy` content visible.
  4. Click "어떻게 수련하는가" -> `HowWork` content visible.
  5. Click "왜 수련하는가" -> `VideoCircle` visible. Wait for radial animation (1.5s). Click one circle item -> verify modal dialog opens with image and story text. Press Escape -> verify modal closes.
  6. Scroll down to `#inquiry` section -> verify inquiry details and YouTube link.

- [ ] **Journey 2: Desktop Sidebar & Mobile Drawer Navigation**
  1. On desktop (`>= 768px`): Click sidebar toggle chevron -> verify sidebar collapses from `w-64` to `w-24`. Verify main content expands margin (`md:ml-24`).
  2. Click theme button -> verify theme switches to dark mode (`.dark` class on `<html>`, background changes to `#410707`/`#280505`).
  3. Resize viewport to mobile (`375px` or `414px`): Verify top bar (`h-14`) appears with safe-area spacing.
  4. Click hamburger button -> verify drawer slides in with backdrop overlay.
  5. Click "입회 안내" -> verify drawer closes and page scrolls to `#inquiry`.

- [ ] **Journey 3: Authentication & Protected Route Guard**
  1. Clear all cookies.
  2. Directly navigate to `https://muryen-front.vercel.app/daily`.
  3. Verify immediate 307 redirect to `/login?redirect=%2Fdaily`.
  4. Fill in credentials: Username `1111`, Password `1111`. Click "로그인".
  5. Inspect network: `POST /api/auth/login` returns HTTP 200 with `Set-Cookie: accessToken=...; HttpOnly` and `Set-Cookie: isLoggedIn=true`.
  6. Verify automatic redirection back to `/daily`.
  7. Verify `/daily` renders the GitHub-style commit activity grid. Click any green square -> verify Radix Dialog opens with session title and timestamp.
  8. Navigate to `/mypage` -> verify dashboard stat cards render:
     - "월별 수련 출석률" (Line chart)
     - "무예 숙련도 (스탯)" (Radar chart)
     - "대련 주요 타격 부위" (Bar chart)
  9. Click "로그아웃" button in sidebar/drawer -> verify `POST /api/auth/logout` succeeds, cookies cleared, redirected to `/`.
  10. Attempt to access `/mypage` again -> verify redirected back to `/login`.

- [ ] **Journey 4: Interactive Charts & Portals (`/basic-sense`)**
  1. Navigate to `/basic-sense`.
  2. Wait for dynamic import of `donut-chart.tsx`.
  3. Verify all 4 Books (제1권 ~ 제4권) render circular Recharts PieCharts.
  4. Hover over individual pie technique icons (e.g. 장창, 본국검) -> verify floating tooltip portal appears near mouse position with technique title and full description.
  5. Toggle dark mode -> verify chart slice strokes and tooltip styles adapt.

- [ ] **Journey 5: Media & Video Controls (`/pattern`)**
  1. Navigate to `/pattern`.
  2. Verify `InteractivePlayer` component mounts.
  3. Click Play button -> verify YouTube stream begins.
  4. Click speed selector buttons (`0.5x`, `0.75x`, `1.25x`) -> verify playback rate updates.
  5. Click Mute toggle -> verify audio mutes/unmutes.
  6. Click "다시 처음부터" (seek 0) -> verify video resets to start.

- [ ] **Journey 6: Equipment Radix Dialog (`/equipment`)**
  1. Navigate to `/equipment`.
  2. Verify 3 equipment cards render (전통 갑옷, 전투용 투구, 장창).
  3. Click "자세히 보기" on "전통 갑옷" -> verify Radix Dialog modal appears with title, description, materials, making method, and "구매하기" button.
  4. Test modal closing via backdrop click, Close button, and Escape key.

- [ ] **Journey 7: Photo Gallery Filtering (`/gallery`)**
  1. Navigate to `/gallery`.
  2. Verify filter chips display category counts: "전체", "갑주 대련", "검술 시범", "대회", "단체", "인물".
  3. Click "갑주 대련" -> verify only armored sparring photos remain in grid.
  4. Click "검술 시범" -> verify sword exhibition photos display.
  5. Hover over photos -> verify zoom and caption gradient overlay.

- [ ] **Journey 8: Tokki AI Chatbot Assistant**
  1. Click floating red chat bubble in bottom-right corner.
  2. Verify chat dialog panel opens (`height: min(560px, calc(100vh - 8rem))`).
  3. Verify network call `POST https://my-server-test.vercel.app/v2/widget/view` returns persona and welcome message.
  4. Click a suggested question or enter a message -> verify `POST /v2/ask` streams tokens via SSE.
  5. Verify input focuses correctly and panel can be closed with the "X" button.

- [ ] **Journey 9: AI Kihap Mic Analyzer (`/cutting`)**
  1. Navigate to `/cutting`.
  2. Locate `AI 기합(Kihap) 측정기` card.
  3. Click "마이크 켜기".
  4. Verify that since `window.vad` is not loaded in production HTML, it gracefully shows "VAD 모듈이 아직 로드되지 않았습니다." without throwing an unhandled runtime exception.

- [ ] **Journey 10: Performance, Core Web Vitals & Console Audit**
  1. Run Chrome DevTools Lighthouse audit on `/` and `/basic-sense`:
     - LCP (Largest Contentful Paint) < 2.5s.
     - CLS (Cumulative Layout Shift) < 0.1.
     - FID / INP (Interaction to Next Paint) < 200ms.
  2. Verify no uncaught console errors, hydration mismatches, or missing static asset 404s.
  3. Inspect response headers on Vercel:
     - `X-Content-Type-Options: nosniff`
     - `X-Frame-Options: SAMEORIGIN`
     - `Referrer-Policy: strict-origin-when-cross-origin`

---

## 5. Verification Method

To independently verify this survey and local codebase integrity:

1. **Run full automated test suite**:
   ```bash
   npm test -- --bail
   ```
   *Expected result*: 28 test suites passed, 222 tests passed (100% pass rate).

2. **Verify production compilation**:
   ```bash
   npm run build
   ```
   *Expected result*: Clean compilation of all static and dynamic route targets with 0 errors.

3. **Verify lint rules**:
   ```bash
   npm run lint
   ```
   *Expected result*: 0 errors and 0 warnings.

4. **Live Production Smoke Test via Curl / Fetch**:
   ```bash
   # Check headers and 200 OK
   curl -I https://muryen-front.vercel.app/
   # Check route protection 307
   curl -I https://muryen-front.vercel.app/daily
   curl -I https://muryen-front.vercel.app/mypage
   # Check RSS feed
   curl -I https://muryen-front.vercel.app/feed.xml
   # Check sitemap
   curl -I https://muryen-front.vercel.app/sitemap.xml
   ```

5. **Live Chrome DevTools Forensic Inspection**:
   Using `chrome-devtools-mcp` tools (`navigate_page`, `list_console_messages`, `list_network_requests`, `lighthouse_audit`), navigate through each checklist journey to verify live DOM state, console log silence, and network round-trips.
