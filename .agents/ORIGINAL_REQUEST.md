# Original User Request

## Initial Request — 2026-09-01T09:08:29+09:00

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview
> Requested team: Full team

Conduct a comprehensive debugging sweep of the `muryen-front` application. Specifically, identify and fix the cause of the error message currently displaying in the bottom-left corner of the UI, and ensure no related errors exist elsewhere in the codebase.

Working directory: /Users/a7890/src/muryen-front
Integrity mode: development

## Requirements

### R1. Identify and Resolve UI Error
Locate the component or logic causing an error message to render in the bottom-left corner of the screen. Fix the underlying issue (e.g., hydration mismatch, unhandled exception, or missing data) so the message disappears.

### R2. Project-wide Error Audit
Audit the entire project to ensure that whatever caused the bottom-left error (e.g., faulty provider, layout issue, misconfigured dynamic import) hasn't caused similar silent or visible failures in other components.

## Acceptance Criteria

### Verification
- [ ] Reproduce the error locally or identify it statically.
- [ ] The bottom-left error message no longer appears on application load.
- [ ] `npm run lint` and `npm run build` pass without new errors.

## Follow-up — 2026-09-09T14:13:50Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview
> Requested team: Use a very large team of agents.

Use a very large team of agents. Conduct a final, exhaustive, autonomous codebase sweep of the `muryen-front` application. Search thoroughly for any remaining hidden bugs, edge cases, or performance bottlenecks, fix them, and perform a definitive final inspection.

Working directory: /Users/a7890/src/muryen-front
Integrity mode: development

## Requirements

### R1. Exhaustive Bug Hunt & Fix
Deploy a massive team of agents to comb through every file, component, and API route in the repository. Identify any remaining logical errors, TypeScript type issues, or runtime exceptions, and fix them autonomously.

### R2. Final Quality Inspection
Conduct a definitive final review of the entire application's architecture, security (e.g., NextAuth), and performance. 

### R3. Comprehensive Reporting
Document all newly discovered issues and the corresponding fixes applied during this final sweep.

## Acceptance Criteria

### Verification
- [ ] `npm run lint` passes with 0 errors and 0 warnings.
- [ ] `npm run build` compiles successfully without any build-breaking errors.
- [ ] All existing and newly generated tests (`npm test`) pass with 100% success rate.
- [ ] The independent Victory Auditor confirms no regression has been introduced.

## Follow-up — 2026-09-10T14:58:00Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview
> Requested team: Use a very large team of agents. (30 agents authorized)

Use a very large team of agents. Locate the Vercel deployed URL for the `muryen-front` application and conduct an extremely rigorous, forensic audit of the live production site. You must heavily utilize the Chrome DevTools MCP tools and troubleshooting skills to inspect the live page dynamically.

Working directory: /Users/a7890/src/muryen-front
Integrity mode: development

## Requirements

### R1. Live Production Site Audit (Vercel)
Identify the Vercel deployment URL. Deploy a massive 30-agent team to access the live site. Conduct an exhaustive inspection covering all user flows, pages, and interactive components in the production environment.

### R2. Chrome DevTools Troubleshooting
Actively use Chrome DevTools MCP tools to inspect the live production DOM, intercept network requests, analyze console logs, and measure Core Web Vitals (LCP, CLS, FID) on the Vercel page. Hunt for any production-only edge cases that might not appear in local development.

### R3. Comprehensive Reporting & Remediation
Document every single discrepancy, console warning, accessibility violation, or performance drop found on the Vercel live site. If code fixes are required to address these production issues, apply them to the local repository.

## Acceptance Criteria

### Verification
- [ ] The Vercel live site is successfully navigated and analyzed via Chrome DevTools.
- [ ] An exhaustive audit report is generated detailing the health of the production deployment.
- [ ] If local code changes are made to fix Vercel-specific issues, `npm run build` and all tests must still pass cleanly.
