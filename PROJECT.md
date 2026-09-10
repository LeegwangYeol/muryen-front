# Project: muryen-front Final Codebase Sweep & Quality Hardening

## Architecture
- **Framework**: Next.js 15.5.15 App Router, React 18.2.0, TypeScript 5, Tailwind CSS 3.4.1.
- **Root Shell Hierarchy**: `app/layout.tsx` -> `<Providers>` (NextAuth `SessionProvider`) -> `<ThemeProvider>` -> `<AppShell>` (`Navigation`, `MobileNav`, `Footer`, `#main`).
- **State & Theme**: Custom `ThemeContext` (`app/context/theme-context.tsx`) synchronizing `.dark` and `theme-dark`/`theme-light` on `document.documentElement`.
- **Dynamic Loading**: Recharts (`donut-chart.tsx`, `stat-charts.tsx`) and ReactPlayer (`interactive-player.tsx`) dynamically loaded with `{ ssr: false }`.
- **Authentication**: JWT/Cookie auth (`lib/auth-service.ts`, `lib/token-service.ts`) + NextAuth (`app/api/auth/[...nextauth]/route.ts`).

## Code Layout & File Boundaries
- **Auth & Config**:
  - `lib/token-service.ts`: JWT verification, signing, runtime claim validation.
  - `middleware.ts`: Route protection (`/daily`, `/mypage`), matcher configuration, error handling.
  - `app/component/login-page.tsx`: Login form, redirect URI sanitation, accessible labels.
  - `app/api/auth/[...nextauth]/route.ts`: NextAuth provider configuration, signIn route.
  - `next.config.ts`: HTTP security headers, performance optimizations.
- **UI & Layouts**:
  - `app/component/navigation.tsx`: Sidebar navigation, `aria-label`, viewport scroll constraints.
  - `components/layout/footer.tsx`: Footer landmarks, unique branding element, hydration suppression on date.
  - `app/error.tsx` & `app/not-found.tsx`: Error boundaries rendered as `<section>` (no nested `<main>`).
  - `app/component/patten-page.tsx` & `sparring-page.tsx`: Fixed responsive typography classes.
  - `app/component/equipment.tsx`: Radix UI `<Dialog>` modal implementation with focus trap and dark mode.
  - `app/component/video-circle.tsx`: Safe math for 0 videos, keyboard navigation support.
  - `lib/contact.ts`: Harmonized `hanja: "武緣"`.
- **Types & Performance**:
  - `components/dashboard/stat-charts.tsx`: Optional props with default values for `textColor` and `gridColor`.
  - `app/component/record-graph.tsx`: Lightweight single-tooltip architecture for 1,000+ commit cells.
  - `app/component/donut-chart.tsx`: Clean event listener management, elimination of layout reflows.
  - `components/ui/chart.tsx`: Memoized provider value.
  - `app/context/theme-context.tsx`: Safe `localStorage` access.
  - `app/layout.tsx`: Cleaned external scripts.
  - `__tests__/`: Automated Jest & React Testing Library test suites (28 suites, 222 tests).

## Feature Inventory
| # | Feature / Issue | Description | Milestone | Source |
|---|-----------------|-------------|-----------|--------|
| 1 | Bottom-Left Error Cleanup | Remove third-party LLAMI chat widget and dead files. | M1 | Completed |
| 2 | Auth & Layout Hardening | Guard GoogleProvider credentials and verify error boundaries. | M2 | Completed |
| 3 | Automated E2E Suite | Multi-tier test suite covering Tiers 1-4. | M-E2E | Completed |
| 4 | Open Redirect & Protocol Security | Sanitize `redirect` query parameter in `login-page.tsx` against open redirect / evil URI schemes. | M4-A | Completed (Worker M4-A) |
| 5 | Strict JWT Claims Validation | Validate runtime claims (`sub`, `role`) in `lib/token-service.ts` to prevent truthy object auth bypass. | M4-A | Completed (Worker M4-A) |
| 6 | Route Guard Gap for `/mypage` | Extend middleware authentication guard to cover `/mypage` and add route matcher. | M4-A | Completed (Worker M4-A) |
| 7 | HTTP Security Headers & Config | Add CSP, X-Frame-Options, X-Content-Type-Options to `next.config.ts`. | M4-A | Completed (Worker M4-A) |
| 8 | Semantic Navigation & Landmark A11y | Add `aria-label="주요 내비게이션"` to `Navigation`, fix duplicate footer headings, replace nested `<main>` tags in `app/error.tsx` and `not-found.tsx`. | M4-B | Completed (Worker M4-B) |
| 9 | Modal & Viewport Fixes | Migrate `equipment.tsx` to Radix `<Dialog>`, add scroll constraint to sidebar, fix duplicate theme button. | M4-B | Completed (Worker M4-B) |
| 10 | Stat-Charts TypeScript Fix | Make `textColor` and `gridColor` optional with defaults in `components/dashboard/stat-charts.tsx` (fixes 5 TS2739 errors). | M4-C | Completed (Worker M4-C) |
| 11 | RecordGraph & DonutChart Optimization | Eliminate 1,095+ simultaneous Radix Tooltips in `record-graph.tsx`, fix mousemove listener and layout reflow in `donut-chart.tsx`. | M4-C | Completed (Worker M4-C) |
| 12 | 100% Test Pass & Verification | Verify 100% pass on all 28 test suites (222/222 tests), 0 lint warnings, clean build. | M4-C | Completed (Worker M4-C) |
| 13 | Final Review, Challenge & Forensic Audit | Multi-agent review, empirical challenge, and independent forensic integrity verification. | M4-D | DONE |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | UI Error & Widget Cleanup | Removed LLAMI widget and dead modal code. | None | DONE |
| M2 | Initial Auth & Layout Hardening | Guard GoogleProvider and prune legacy components. | M1 | DONE |
| M-E2E | E2E & Component Test Track | Authored 60 multi-tier verification tests. | None | DONE |
| M3 | Initial Gate & Adversarial Pass | Passed 201/201 initial tests and clean build. | M1, M2, M-E2E | DONE |
| M4-A | Security, Auth & Config Hardening | Open Redirect fix, strict JWT claims validation, middleware `/mypage` guard, HTTP headers. | M3 | DONE |
| M4-B | UI Landmarks, Layouts & Modals | Navigation a11y, nested `<main>` removal, Radix Dialog migration, Tailwind fixes. | M4-A | DONE |
| M4-C | Types, Performance & Test Pass | Stat-charts TS fix, record-graph tooltip optimization, 100% test pass rate. | M4-B | DONE |
| M4-D | Final Quality & Forensic Audit | Reviewers, Challengers, and Forensic Auditor verification for post-victory. | M4-C | DONE |

## Interface Contracts
### `app/layout.tsx` ↔ Client Components
- `RootLayout` provides clean HTML `<head>` with security headers and no unused heavy scripts.
- Wraps application tree in `<Providers>`, `<ThemeProvider>`, `<AppShell>`.

### `components/layout/navigation.tsx` ↔ Layout
- Navigation bar renders semantic landmark with accessible name `aria-label="주요 내비게이션"`.
- Menu items scroll vertically within available viewport height.
