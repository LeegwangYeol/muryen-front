# Project: muryen-front Debugging Sweep & Error Resolution

## Architecture
- **Framework**: Next.js 15.5.15 App Router, React 18.2.0, TypeScript 5, Tailwind CSS 3.4.1.
- **Root Shell Hierarchy**: `app/layout.tsx` -> `<Providers>` (NextAuth `SessionProvider`) -> `<ThemeProvider>` -> `<VantaBackground>` -> `<AppShell>` (`Navigation`, `MobileNav`, `Footer`, `#main`).
- **State & Theme**: Custom `ThemeContext` (`app/context/theme-context.tsx`) synchronizing `.dark` and `theme-dark`/`theme-light` on `document.documentElement`.
- **Dynamic Loading**: Recharts (`donut-chart.tsx`, `stat-charts.tsx`) and ReactPlayer (`video-modal.tsx`, `interactive-player.tsx`) dynamically loaded with `{ ssr: false }`.
- **Authentication**: JWT/Cookie auth (`lib/auth-service.ts`, `lib/token-service.ts`) + NextAuth (`app/api/auth/[...nextauth]/route.ts`).

## Code Layout
- `app/`: Next.js App Router pages, layouts, API routes, and context providers.
  - `app/layout.tsx`: Root HTML shell and provider wrappers.
  - `app/providers.tsx`: SessionProvider client wrapper.
  - `app/context/`: Context definitions (`theme-context.tsx`).
  - `app/api/`: Auth API endpoints (`auth/[...nextauth]`, `auth/login`, `auth/logout`).
- `components/`: Modular UI and layout components.
  - `components/layout/`: AppShell, MainLayout, Navigation, Footer, MobileNav.
  - `components/ui/`: Reusable primitives (button, card, dialog, input, scroll-area, tabs, tooltip, typography).
  - `components/feature/`: Domain-specific components (sparring, equipment, mypage, etc.).
- `lib/`: Business logic, auth services, API client, token management, utility helpers.
- `__tests__/`: Automated Jest & React Testing Library test suites.

## Feature Inventory
| # | Feature / Issue | Description | Milestone | Source |
|---|-----------------|-------------|-----------|--------|
| 1 | Bottom-Left Error Cleanup | Remove third-party LLAMI chat widget CSS and JS injection from `app/layout.tsx` and eliminate dead/orphaned widget files (`app/component/llami-chat-widget.tsx`). | M1 | Survey (Explorer 1 & 2) |
| 2 | Bottom-Left Navigation Anchor Cleanup | Remove unused `<VideoModal>` instance and dead state `isVideoModalOpen` from bottom container in `app/component/navigation.tsx`. | M1 | Survey (Explorer 1 & 2) |
| 3 | NextAuth Google Provider Guard | Guard `GoogleProvider` in `app/api/auth/[...nextauth]/route.ts` against undefined environment variables in local development. | M2 | Survey (Explorer 1) |
| 4 | Project-wide Error & Hydration Audit | Ensure all routes, providers, dynamic imports, and hooks operate without runtime errors or hydration mismatches. | M2 | Survey (Explorer 1, 2, 3) |
| 5 | Automated E2E & Component Verification Suite | Develop and run complete E2E and component test suites covering Tiers 1–4 across all routes and layout components. | M-E2E | Survey (Explorer 3) |
| 6 | Full Test & Build Gate Clearance | Ensure 100% test pass rate across Jest and E2E tests with clean `npm run lint` and `npm run build`. | M3 (Final) | Survey (All Explorers) |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | UI Error & Widget Cleanup | Remove faulty third-party LLAMI script injection from `app/layout.tsx`, remove dead `llami-chat-widget.tsx`, and clean orphaned bottom-left modal in `app/component/navigation.tsx`. | None | IN_PROGRESS |
| M2 | Auth & Layout Hardening | Guard `GoogleProvider` credentials in NextAuth route and verify error-boundary and provider stability across all routes. | M1 | PLANNED |
| M-E2E | E2E & Component Test Track | Design and establish comprehensive opaque-box test suites (Tiers 1–4) verifying layout rendering, error absence, and route navigation. | None | PLANNED |
| M3 | Final Gate & Adversarial Hardening | Verify 100% pass on all unit and E2E test suites, execute Tier 5 adversarial stress tests, and verify clean build/lint. | M1, M2, M-E2E | PLANNED |

## Interface Contracts
### `app/layout.tsx` ↔ Client Components
- `RootLayout` provides clean HTML `<head>` without unhandled third-party scripts.
- Wraps application tree in `<Providers>`, `<ThemeProvider>`, `<VantaBackground>`, `<AppShell>`.

### `components/layout/navigation.tsx` ↔ Layout
- Navigation bar renders sidebar menu, theme toggle, and bottom user controls cleanly with zero orphaned dynamic imports.
