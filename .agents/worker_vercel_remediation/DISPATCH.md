## 2026-09-10T15:15:23Z

You are worker_vercel_remediation.
Your working directory is /Users/a7890/src/muryen-front/.agents/worker_vercel_remediation.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATORY INPUTS (read before starting):
- /Users/a7890/src/muryen-front/.agents/ORIGINAL_REQUEST.md
- /Users/a7890/src/muryen-front/.agents/auditor_live_auth_modals/handoff.md
- /Users/a7890/src/muryen-front/.agents/auditor_live_landing_nav/handoff.md
- /Users/a7890/src/muryen-front/.agents/auditor_live_chat_perf/handoff.md

Your task — Implement local code remediations for all issues uncovered during the live production audit on https://muryen-front.vercel.app:

1. Files Owned:
   - app/api/auth/[...nextauth]/route.ts
   - lib/token-service.ts
   - app/component/login-page.tsx
   - app/component/navigation.tsx
   - components/layout/app-shell.tsx
   - next.config.ts
   - components/chat/chat-widget.tsx

2. Specific Remediations to Apply:
   a. NextAuth Fallback Secret:
      In app/api/auth/[...nextauth]/route.ts line 45, provide a resilient fallback secret:
      secret: process.env.NEXTAUTH_SECRET || "muryen-production-fallback-secret-2026-auth",
      so that when NEXTAUTH_SECRET is unset in production environment, NextAuth v4 does not crash with 500 [NO_SECRET] on /api/auth/session.
   b. TokenService Fallback Secret:
      In lib/token-service.ts lines 4-9, update getSecretKey() so that instead of throwing an unhandled Error when process.env.JWT_SECRET is unset in production, it falls back safely to a secure default key (e.g. secret || 'muryen-fallback-jwt-secret-key-2026'). This allows login /api/auth/login and Edge middleware token verification to succeed in production even without manual Vercel dashboard env vars.
   c. Login Form Accessibility:
      In app/component/login-page.tsx, add id="username", name="username", autoComplete="username" to the username Input, and id="password", name="password", autoComplete="current-password" to the password Input.
   d. Desktop Sidebar Accessibility:
      In app/component/navigation.tsx line 139, add aria-label={isExpanded ? "사이드바 축소" : "사이드바 확장"} and title={isExpanded ? "사이드바 축소" : "사이드바 확장"} to the collapse toggle button.
      In line 223, remove the prohibited aria-label from the disabled Instagram <span> (matching mobile-nav.tsx: <span aria-disabled="true" title="Instagram 계정 준비 중" ...><Instagram size={18} /></span>).
   e. Skip Link Color Contrast Ratio:
      In components/layout/app-shell.tsx line 23, update the skip link focus background to a darker blue (e.g. focus:bg-blue-700 or focus:bg-[#1d4ed8]) so that white text has WCAG AA contrast >= 4.5:1.
   f. Content-Security-Policy Header:
      In next.config.ts, inject a Content-Security-Policy header in the headers() configuration supporting 'self', 'unsafe-inline', 'unsafe-eval' for Next.js, CDNs (cdnjs, jsdelivr), Google Analytics, Naver Analytics, YouTube embeds, and Tokki server (https://my-server-test.vercel.app).
   g. Defensive Masking for Tokki Chat:
      In components/chat/chat-widget.tsx, detect if streamed output contains "[LLM error]" or "insufficient_quota" (upstream OpenAI credit exhaustion on the Tokki backend), and replace it with a graceful Korean message: "AI 도우미가 현재 점검 중입니다. 잠시 후 다시 이용해 주세요."

3. Verification Requirements:
   - Run `npm run lint` and verify 0 errors, 0 warnings.
   - Run `npm test` and verify all 28 test suites (222+ tests) pass with 100% success rate. If any tests need updating due to new props/attributes (e.g. aria-label changes), update the test expectations cleanly.
   - Run `npm run build` and verify clean compilation with 0 errors.

4. Deliverables:
   - Maintain progress.md in your working directory with timestamps.
   - Write your complete handoff report to /Users/a7890/src/muryen-front/.agents/worker_vercel_remediation/handoff.md detailing all modifications made and full verification command outputs.
   - Send completion message to parent when done.
