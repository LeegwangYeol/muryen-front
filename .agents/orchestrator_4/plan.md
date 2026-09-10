# Plan: Vercel Live Production Forensic Audit & Remediation

## Objective
Conduct an exhaustive, forensic audit of the live Vercel production deployment of `muryen-front` using Chrome DevTools MCP tools, troubleshooting skills, and local code inspection, resolving any issues found.

## Phases

### Phase 1: Survey & Vercel Deployment URL Discovery
- Dispatch Explorers to find the exact Vercel deployment URL (inspecting `.vercel`, `package.json`, git commit/remote history, README, and configuration files).
- Map all user flows, routes, and interactive components.
- Output: Verified live URL and route/component target matrix.

### Phase 2: Live Chrome DevTools Production Inspection
Deploy specialized agents equipped with Chrome DevTools MCP to thoroughly inspect the live production URL:
- **Track 1: Landing Page, Shell, Navigation & Layout**
  - Navigate to root/landing page, capture screenshot, inspect DOM landmarks, footer, navigation bar.
  - Verify theme switching (dark/light) and mobile responsive navigation drawer.
  - Check for hydration warnings or bottom-left/floating errors on the live site.
- **Track 2: Authentication & Route Security**
  - Test `/login`, form interactions, sanitize redirect parameters on live site.
  - Test protected routes (`/daily`, `/mypage`) to ensure live middleware redirects/guards properly without infinite loops or crashes.
  - Test 404 (`/not-found-random-page`) and error boundary rendering in production.
- **Track 3: Interactive Dashboards & Heavy Components**
  - Test Radix UI dialog (`/equipment` or modal trigger), verify focus trap and ESC key behavior.
  - Inspect Recharts / StatCharts / DonutChart / RecordGraph rendering on live DOM.
  - Verify video circle or interactive player components.
- **Track 4: Network, Console, Security Headers & Core Web Vitals**
  - Capture all network requests (HTTP status, CORS, asset sizes, caching, API failures).
  - List console messages (warnings, errors, CSP violations, unhandled rejections).
  - Measure Core Web Vitals: LCP, CLS, INP/FID, and performance traces via Chrome DevTools.

### Phase 3: Synthesis & Gap Analysis
- Synthesize all live production findings into a unified matrix of discrepancies, errors, a11y violations, and bottlenecks.
- Determine necessary local code fixes vs environment configuration recommendations.

### Phase 4: Remediation & Local Verification (if code fixes required)
- Dispatch Worker(s) to fix any discovered issues in the local repository.
- Require workers to verify `npm run lint`, `npm run build`, and `npm test` (100% pass rate).

### Phase 5: Multi-Agent Gate Check
- 2x Reviewers: inspect changes and verify live compliance.
- 2x Challengers: empirical stress-testing of fixes and edge cases.
- 1x Forensic Auditor: binary integrity audit.

### Phase 6: Final Comprehensive Production Health Audit Report
- Deliver exhaustive report detailing Vercel deployment health, findings, performance metrics, and remediations.
