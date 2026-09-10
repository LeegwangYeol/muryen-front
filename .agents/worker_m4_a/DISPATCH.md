# Dispatch to Worker M4-A: Security, Auth & Configuration Hardening

- **Authoritative Request**: `/Users/a7890/src/muryen-front/.agents/ORIGINAL_REQUEST.md`
- **Project Blueprint**: `/Users/a7890/src/muryen-front/PROJECT.md`
- **Explorer 1 Report**: `/Users/a7890/src/muryen-front/.agents/sweep_explorer_1/handoff.md`
- **Explorer 3 Report**: `/Users/a7890/src/muryen-front/.agents/sweep_explorer_3/handoff.md`

## Files Owned Exclusively
1. `lib/token-service.ts`
2. `middleware.ts`
3. `app/component/login-page.tsx`
4. `app/api/auth/[...nextauth]/route.ts`
5. `next.config.ts`

## Tasks & Specifications
1. **Open Redirect Remediation in `app/component/login-page.tsx`**:
   - Sanitize redirect URL: ensure it starts with `/` and does NOT start with `//` or `/\\`. If invalid or external, fall back to `/`.
   - Add accessible labels (`aria-label="아이디"`, `aria-label="비밀번호"`) to inputs.
   - Prevent form double-submission (disable submit button while login is loading).
2. **Strict Runtime JWT Claims Validation in `lib/token-service.ts`**:
   - In `verifyToken`: check `if (!token || typeof token !== 'string') return null;`.
   - Ensure `payload.sub` exists, is a string, and `payload.role` is `'admin' | 'user'`. Return `null` if claims are missing, preventing truthy object `{ id: undefined, role: undefined }`.
   - In production, guard against missing `JWT_SECRET`.
3. **Route Guard & Matcher in `middleware.ts`**:
   - Add `/mypage` to protected routes alongside `/daily`.
   - Wrap `AuthService.validateToken` in `try/catch` to avoid HTTP 500 crashes; on failure or invalid token, delete auth cookies and redirect to `/login?redirect=...`.
   - Add `export const config = { matcher: ["/daily/:path*", "/mypage/:path*"] };` to skip unnecessary processing of static assets.
4. **NextAuth Configuration in `app/api/auth/[...nextauth]/route.ts`**:
   - Update `pages.signIn` to `"/login"` (replacing `"/test2"`).
5. **Security & Performance Headers in `next.config.ts`**:
   - Add `async headers()` with `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
   - Add `poweredByHeader: false`, `reactStrictMode: true`.

## Verification Commands
- Run auth tests: `npx jest __tests__/auth/`
- Run lint: `npm run lint`
- Run build: `npm run build`
- Report results and status in `/Users/a7890/src/muryen-front/.agents/worker_m4_a/handoff.md`.

## 2026-09-09T14:24:36Z
You are worker_m4_a for muryen-front.
Your working directory is /Users/a7890/src/muryen-front/.agents/worker_m4_a.
You MUST read /Users/a7890/src/muryen-front/.agents/ORIGINAL_REQUEST.md and /Users/a7890/src/muryen-front/.agents/worker_m4_a/DISPATCH.md before starting.
Also review the Explorer 1 report at /Users/a7890/src/muryen-front/.agents/sweep_explorer_1/handoff.md.

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Files Owned Exclusively by you:
1. `lib/token-service.ts`
2. `middleware.ts`
3. `app/component/login-page.tsx`
4. `app/api/auth/[...nextauth]/route.ts`
5. `next.config.ts`

Your mission:
1. Fix open redirect in `app/component/login-page.tsx`: ensure redirectUrl is sanitized (must start with single '/', no '//' or '/\\'). Add accessible labels (`aria-label`) to username and password inputs. Add disabled state to submit button when in flight.
2. In `lib/token-service.ts`: enforce strict runtime claims checking in `verifyToken` (sub must be string, role must be 'admin' | 'user'; return null otherwise, not an object with undefined properties). Guard missing secret in production.
3. In `middleware.ts`: protect `/mypage` along with `/daily`. Wrap token verification in `try/catch`. Export `config = { matcher: ["/daily/:path*", "/mypage/:path*"] }`.
4. In `app/api/auth/[...nextauth]/route.ts`: set `pages.signIn` to `"/login"`.
5. In `next.config.ts`: add HTTP security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), `poweredByHeader: false`, `reactStrictMode: true`.
6. Run auth tests (`npx jest __tests__/auth/`), `npm run lint`, and `npm run build`. Verify everything compiles and passes cleanly.
7. Write your full handoff report to `/Users/a7890/src/muryen-front/.agents/worker_m4_a/handoff.md` and send a completion message to the parent orchestrator.
