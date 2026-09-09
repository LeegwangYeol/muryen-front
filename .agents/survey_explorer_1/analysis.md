# Comprehensive Project Architecture & Codebase Survey

**Project**: `muryen-front`  
**Target Repository**: `LeegwangYeol/muryen-front`  
**Surveyor**: `survey_explorer_1` (Survey Explorer 1)  
**Date**: 2026-08-28  

---

## 1. Executive Summary

`muryen-front` is a Next.js 15 web application dedicated to **Muryeon (무련 武緣)**, a Seoul-based traditional martial arts society practicing the 24 Martial Arts of Joseon (*Muyedobotongji*, 1790) with armored sparring (*Gappju Daeryeon*).

The application features:
- A responsive marketing and educational landing experience with tabbed content, interactive video carousel, and visual training curriculum.
- Dedicated thematic pages for Martial Arts Introduction (24반), Basic Stances (기본기), Forms/Patterns (투로), Real Blade Cutting (베기), Armored Sparring (갑주 대련), Reference Materials (참고 자료), and Equipment (장비).
- Interactive client-side tools:
  - **AI Kihap (Voice Activity Detection) Analyzer** (`VadAnalyzer`) using browser VAD.
  - **Interactive Video Player** with speed adjustment controls.
  - **Interactive 24-Arts Curriculum Chart** with Recharts Pie visualization.
  - **User Training Record Heatmap** (`RecordGraph`) on the `/daily` route.
  - **Member Dashboard** (`/mypage`) with radar, line, and bar chart analytics.
- Dual Authentication architecture: Custom JWT cookies (with `/daily` route middleware guard) + NextAuth Google OAuth (for YouTube integration experiments).

---

## 2. Technology Stack & Dependencies

### Core Framework & Runtimes
| Package | Version | Purpose |
|---|---|---|
| `next` | `^15.5.15` | App Router React Framework |
| `react` / `react-dom` | `^18.2.0` | React 18 UI Runtime |
| `typescript` | `^5` | Static Typing |

### UI & Styling
| Package | Version | Purpose |
|---|---|---|
| `tailwindcss` | `^3.4.1` | Utility-first CSS framework |
| `tailwindcss-animate` | `^1.0.7` | Keyframe animation utilities |
| `@radix-ui/react-*` | Various | Accessible headless primitives (`dialog`, `scroll-area`, `slot`, `tabs`, `tooltip`) |
| `framer-motion` | `^11.14.4` | Motion and layout animations |
| `lucide-react` | `^0.468.0` | Icon system |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Latest | Dynamic component styling |
| `styled-components` | `^6.1.13` | Declared in dependencies (legacy/minimal) |
| `next-themes` | `^0.4.6` | Theme helper (alongside custom `theme-context.tsx`) |

### Visualizations & Media
| Package | Version | Purpose |
|---|---|---|
| `recharts` | `^2.15.0` | Charting (Line, Radar, Bar, Pie charts) |
| `@meursyphus/flitter` | `^2.1.0` | Canvas/SVG graphics engine |
| `react-player` | `^2.14.1` | Video playback wrapper |
| Vanta.js & Three.js | CDN | Animated dynamic cell background on desktop |

### Audio & AI
| Package | Version | Purpose |
|---|---|---|
| `@ricky0123/vad-web` | `^0.0.21` | In-browser Voice Activity Detection |
| `@xenova/transformers` | `^2.0.1` | In-browser machine learning inference |
| `lamejs` | `^1.2.1` | Audio encoding helper |

### Authentication & Utilities
| Package | Version | Purpose |
|---|---|---|
| `jose` | `^5.9.6` | Lightweight JWT signing and validation (Edge compatible) |
| `next-auth` | `^4.24.11` | NextAuth OAuth integration (Google & YouTube) |
| `date-fns` | `^4.1.0` | Date manipulation and formatting |

---

## 3. Directory Layout & Module Structure

```
muryen-front/
├── app/                               # Next.js App Router root
│   ├── layout.tsx                     # Global Root Layout (SEO, Fonts, Scripts, Providers)
│   ├── page.tsx                       # Landing Page Entrypoint
│   ├── globals.css                    # Design Tokens, Glassmorphism, Theme Variables
│   ├── loading.tsx                    # Top indeterminate loading bar + skeleton placeholders
│   ├── error.tsx                      # Global route error boundary
│   ├── not-found.tsx                  # 404 Not Found screen
│   ├── providers.tsx                  # Client Providers wrapper (SessionProvider)
│   ├── robots.ts                      # robots.txt dynamic generator
│   ├── sitemap.ts                     # sitemap.xml dynamic generator
│   ├── feed.xml/route.ts              # RSS 2.0 Feed endpoint
│   │
│   ├── (routes)/                      # Route Pages
│   │   ├── about/page.tsx             # Society & Muyedobotongji history
│   │   ├── basic/page.tsx             # Basic posture & weapon movement
│   │   ├── basic-sense/page.tsx       # 24-Arts 4-book comprehensive guide
│   │   ├── cutting/page.tsx           # Straw/Bamboo cutting + AI Kihap tool
│   │   ├── daily/page.tsx             # Protected training commit activity calendar
│   │   ├── equipment/page.tsx         # Armour and weapon inventory & specs
│   │   ├── know-how/page.tsx          # (Stub)
│   │   ├── location/page.tsx          # (Stub)
│   │   ├── login/page.tsx             # Custom credentials login page
│   │   ├── mypage/page.tsx            # Member training analytics & stats
│   │   ├── pattern/page.tsx           # Forms/Forms curriculum & video player
│   │   ├── reference/page.tsx         # Books & armor references
│   │   ├── sparring/page.tsx          # Sparring principles & Dujeonggap rules
│   │   ├── test/page.tsx              # VAD audio test page
│   │   └── test2/page.tsx             # YouTube API test page
│   │
│   ├── api/                           # API Route Handlers
│   │   └── auth/
│   │       ├── [...nextauth]/route.ts # NextAuth Google OAuth handler
│   │       ├── login/route.ts         # JWT credentials login handler
│   │       └── logout/route.ts        # Cookie cleanup handler
│   │
│   ├── component/                     # Page-specific views & widgets (app-level)
│   │   ├── home-client.tsx            # Main page interactive container
│   │   ├── intro-basic.tsx            # 24-Arts Pie chart & detail accordion
│   │   ├── patten-page.tsx            # Pattern view component
│   │   ├── pattern-curriculum-table.tsx # Matrix curriculum table
│   │   ├── basic-page.tsx             # Basic view component
│   │   ├── cutting-page.tsx           # Cutting view component
│   │   ├── sparring-page.tsx          # Sparring view component
│   │   ├── reference-page.tsx         # Reference view component
│   │   ├── about-page.tsx             # About view component
│   │   ├── login-page.tsx             # Login form component
│   │   ├── record-graph.tsx           # Training activity heatmap component
│   │   ├── vanta-main-background.tsx  # Desktop 3D background animation
│   │   ├── video-circle.tsx           # Rotating circular video carousel
│   │   ├── hero.tsx, why-muryeon.tsx, target-audience.tsx, training-system.tsx, inquiry-section.tsx, philosophy.tsx, how-work.tsx
│   │   └── (Unused legacy files: introduction.tsx, main-open.tsx, call-to-action.tsx, techniques.tsx, vanta-background.tsx, llami-chat-widget.tsx)
│   │
│   └── context/
│       └── theme-context.tsx          # Light/Dark theme context & DOM manager
│
├── components/                        # Shared UI, Layout & Feature modules
│   ├── layout/
│   │   ├── app-shell.tsx              # Unified App Shell (Sidebar + Mobile Nav + Skip to Content)
│   │   ├── main-layout.tsx            # Pass-through layout wrapper
│   │   ├── mobile-nav.tsx             # Mobile drawer and navigation top bar
│   │   ├── footer.tsx                 # Site footer with links, copyright & socials
│   │   └── page-cta.tsx               # Standardized recruitment CTA for subpages
│   ├── ui/                            # Headless & Design System UI primitives
│   │   ├── button.tsx, card.tsx, chart.tsx, dialog.tsx, input.tsx, scroll-area.tsx, tabs.tsx, tooltip.tsx
│   │   └── typography.tsx             # Responsive typography and layout primitives (Heading, Body, CardContainer, CardGrid, Section)
│   ├── ai/
│   │   └── vad-analyzer.tsx           # Voice Activity Detection Kihap Analyzer
│   ├── dashboard/
│   │   └── stat-cards.tsx             # Recharts visualizations for MyPage
│   └── video/
│       └── interactive-player.tsx     # ReactPlayer with playback rate and scrub controls
│
├── lib/                               # Business logic & Utilities
│   ├── auth-service.ts                # Authentication validation logic
│   ├── token-service.ts               # JWT creation & verification with jose
│   ├── contact.ts                     # Site constants, metadata, SNS URLs & GA4 ID
│   └── utils.ts                       # Tailwind `cn()` helper
│
├── types/
│   └── auth.ts                        # Auth interfaces & User roles
│
├── middleware.ts                      # Route protection middleware for `/daily`
└── configuration & assets
```

---

## 4. Route & Navigation Architecture

| Route | Type | Auth Required | Description |
|---|---|---|---|
| `/` | Static (SSG) | No | Main landing page (Opening hero animation, Philosophy/Method tabs, Why Muryeon, Target Audience, Training System, Inquiry CTA) |
| `/about` | Static (SSG) | No | Introduction to Muryeon, 24 Banmuye Society lineage, and Muyedobotongji history |
| `/basic-sense` | Static (SSG) | No | Interactive breakdown of all 24 martial arts across the 4 historical volumes |
| `/basic` | Static (SSG) | No | Principles of basic posture, breathing, footwork, and weapon handling |
| `/pattern` | Static (SSG) | No | Forms (투로) philosophy, curriculum table, and interactive demonstration player |
| `/cutting` | Static (SSG) | No | Straw & bamboo test cutting principles, stages, and interactive AI Kihap analyzer |
| `/sparring` | Static (SSG) | No | Armored sparring methodology, tactical awareness, and progression stages |
| `/reference` | Static (SSG) | No | Historical reference texts and Dujeonggap protective gear background |
| `/equipment` | Static (SSG) | No | Weapon & armor specifications and construction |
| `/mypage` | Static (SSG) | No | Member profile and training performance dashboard with Recharts |
| `/daily` | Static (SSG) | **Yes** (JWT Cookie) | Training commit history and activity heatmap |
| `/login` | Static (SSG) | No | Credentials login form generating 24h JWT cookie |
| `/test` | Static (SSG) | No | Audio VAD recording and wav download test |
| `/test2` | Static (SSG) | No | YouTube comment API test using NextAuth Google OAuth |
| `/feed.xml` | Dynamic (SSR) | No | RSS 2.0 feed generator |
| `/sitemap.xml` | Static (SSG) | No | Search engine sitemap generator |
| `/robots.txt` | Static (SSG) | No | Crawling rules generator |
| `/api/auth/login` | Dynamic (Route) | No | JWT login authentication endpoint |
| `/api/auth/logout` | Dynamic (Route) | No | Cookie clearance endpoint |
| `/api/auth/[...nextauth]` | Dynamic (Route) | No | NextAuth handler |

---

## 5. Build, Lint, and Execution Status

### Build Verification (`npm run build`)
- **Status**: PASSED (Compiled in 3.4s, 24/24 static pages generated).
- **Output**:
  - Total shared first-load JS: ~102 kB.
  - Page bundle sizes range between 1.19 kB and 24.2 kB.
  - Middleware bundle size: 40.3 kB.

### Lint Verification (`npm run lint`)
- **Status**: PASSED with zero errors, but 12 compiler warnings:
  1. `app/component/equipment.tsx`: Unused imports `Shield`, `Sword`.
  2. `app/component/intro-basic.tsx`: Unused `ChartContainer`, `TechniqueData`, `footTechniques`, `mountedTechniques`, `renderCustomizedLabel`, `chartConfig`.
  3. `app/component/llami-chat-widget.tsx`: Unused `theme`, incorrect mutable variable reassignment in `useEffect`.
  4. `app/component/login-page.tsx`: Unused `Apple`, `data`.
  5. `app/component/navigation.tsx`: Unused `Swords`.
  6. `app/context/theme-context.tsx`: Unused `themes`.
  7. `app/test2/page.tsx`: Unused `useEffect`.

---

## 6. Detailed Findings & Improvement Opportunities

### A. Critical Issues & Logic / Runtime Bugs
1. **Broken Image Paths in `app/component/equipment.tsx`**:
   - `equipment.tsx` constructs image URLs via `/images/${item.title.toLowerCase().replace(" ", "-")}.jpg`, generating `/images/전통-갑옷.jpg`, `/images/전투용-투구.jpg`, `/images/장창.jpg`. None of these filenames exist in `public/images/`.
   - In `public/images/foot/`, `muye24ki_core_18_woldo.gif.gif` has a double extension.
2. **`README.md` Git Conflict Artifacts**:
   - Unresolved merge conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>> 6b73e5c`) present at the top and bottom of `README.md`.
3. **Orphaned Patch Reject File in App Directory**:
   - `app/layout.tsx.rej` is present in the `app/` folder. While Next.js ignores `.rej` during build, it pollutes the source tree.

### B. Performance Bottlenecks & Hydration Risks
1. **Massive Over-allocation of Tooltip Providers in `RecordGraph`**:
   - In `app/component/record-graph.tsx`, 3 years of days (1,095 items) are mapped, and each day instantiates its own `<TooltipProvider>`. This results in >1,000 React context instances, event listeners, and DOM observers on a single page.
   - `mockCommitData` generates random numbers and timestamps at module evaluation time (`Math.random()`), which can produce hydration mismatches between SSR and CSR.
2. **High-Frequency State Updates in `VideoCircle`**:
   - `app/component/video-circle.tsx` runs `setInterval` every 50ms (20fps) calling `setRotation((prev) => (prev + 0.2) % 360)`. This triggers 20 full React component re-renders per second.
3. **Forced Intro Delay on Landing Page**:
   - `app/component/home-client.tsx` sets `isOpening` state with a 2,500ms `setTimeout`. On every landing visit, users are blocked for 2.5 seconds by an overlay before seeing content.
4. **Vanta Background Resource Optimization**:
   - `vanta-main-background.tsx` loads Three.js and Vanta.js from CDNs on the client. It correctly checks for mobile (`<= 768px`) and `prefers-reduced-motion`, but should ensure cleanup and script caching to avoid re-fetching on rapid route changes.

### C. Architectural Redundancy & Dead Code
1. **Dual Component Directories**:
   - Both `app/component/` and `components/` exist. `app/component/` contains full-page views (`about-page.tsx`, `basic-page.tsx`, `patten-page.tsx`, `cutting-page.tsx`, `sparring-page.tsx`, `reference-page.tsx`), creating confusion between route handlers and views.
2. **Unused / Legacy Components**:
   - `app/component/introduction.tsx`: Unused boilerplate component with English text about Taekwondo/Hapkido.
   - `app/component/main-open.tsx`: Unused alternate opening animation.
   - `app/component/call-to-action.tsx`: Unused legacy call-to-action component.
   - `app/component/techniques.tsx`: Unused masonry technique grid.
   - `app/component/vanta-background.tsx`: Older fog animation superseded by `vanta-main-background.tsx`.
   - `app/component/llami-chat-widget.tsx`: Unused widget component (script loaded directly in `app/layout.tsx`).

### D. Testing & Quality Assurance Gaps
- There is currently **no test configuration or test suite** in the project.
- No Jest configuration (`jest.config.js` / `jest.config.ts`), Babel/SWC transform, or React Testing Library dependencies in `devDependencies`.
- Implementation of automated unit tests for core UI components (`Typography`, `Button`, `AppShell`, `VadAnalyzer`, `InteractivePlayer`) and utility functions (`cn`, `AuthService`, `TokenService`, `CONTACT`) is required to fulfill user requirement R3.

---

## 7. Recommendations for Subsequent Implementation

1. **Bug Fixes**:
   - Fix image references in `equipment.tsx` and rename `muye24ki_core_18_woldo.gif.gif` to standard `.gif`.
   - Resolve conflict markers in `README.md` and delete `app/layout.tsx.rej`.
   - Fix all 12 ESLint unused variable and hook warnings.
2. **Performance Optimizations**:
   - Refactor `RecordGraph`: Wrap the entire heatmap container in a single `<TooltipProvider>` instead of 1,095 individual providers; memoize date intervals and mock data generation.
   - Optimize `VideoCircle`: Use CSS animation/transforms for continuous rotation or requestAnimationFrame instead of 50ms React state ticks.
   - Optimize `HomeClient`: Prevent opening animation from re-blocking navigation if already seen (e.g. session flag) or streamline animation transitions.
3. **Automated Testing Setup**:
   - Install `jest`, `jest-environment-jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `@types/jest`, `ts-jest` / Next.js Jest transform.
   - Configure `jest.config.ts` and `jest.setup.ts` with module alias mapping (`@/*`).
   - Add `"test": "jest"` and `"test:watch": "jest --watch"` scripts in `package.json`.
   - Write comprehensive unit tests for UI primitives, layout, auth services, and utility helpers.
