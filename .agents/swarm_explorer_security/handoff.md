# Handoff Report — Security Audit (`swarm_explorer_security`)

## 1. Observation

- **Custom JWT Key Fallback (`lib/token-service.ts:4-9`)**:
  ```typescript
  function getSecretKey(): Uint8Array {
    const secret = process.env.JWT_SECRET;
    return new TextEncoder().encode(
      secret || 'muryen-fallback-jwt-secret-key-2026'
    );
  }
  ```
  `.env.local` contains `NEXTAUTH_SECRET` and `NEXTAUTH_URL`, but does not define `JWT_SECRET`. The fallback key `'muryen-fallback-jwt-secret-key-2026'` is active by default.

- **NextAuth Fallback Key (`app/api/auth/[...nextauth]/route.ts:45-48`)**:
  ```typescript
    secret:
      process.env.NEXTAUTH_SECRET ||
      "muryen-production-fallback-secret-2026-auth",
  ```

- **Plaintext Hardcoded Credentials (`lib/auth-service.ts:11-15`)**:
  ```typescript
    if (username === '1111' && password === '1111') {
      user = { id: '1', role: 'admin' };
    } else if (username === '2222' && password === '2222') {
      user = { id: '2', role: 'user' };
    }
  ```

- **Middleware Route Protection (`middleware.ts:5, 11-16, 52-54`)**:
  ```typescript
  const PROTECTED_PREFIXES = ["/daily", "/mypage"];
  ...
  export const config = {
    matcher: ["/daily/:path*", "/mypage/:path*"],
  };
  ```
  Only `/daily` and `/mypage` are guarded. `/test` (audio capture) and `/test2` (YouTube comment tool with `youtube.force-ssl` OAuth) are omitted from the matcher and publicly accessible.
  `middleware.ts:19` checks only `request.cookies.get("accessToken")?.value`. It never inspects NextAuth's `next-auth.session-token`.

- **Open Redirect Sanitization (`app/component/login-page.tsx:9-18`)**:
  ```typescript
  export function sanitizeRedirectUrl(url: string | null): string {
    if (!url) return "/";
    const cleaned = url.replace(/[\x00-\x1F\x7F]/g, "").trim();
    if (/^\/[^\/\\\s]/.test(cleaned) || cleaned === "/") {
      return cleaned;
    }
    return "/";
  }
  ```
  Unit tests in `__tests__/auth/login-page.test.tsx` (lines 19-60) pass 7 test cases verifying rejection of `https://`, `//evil.com`, `/\evil.com`, `javascript:`, control characters, and acceptance of valid `/daily` and `/mypage`.

- **HTTP Headers Configuration (`next.config.ts:3-44`)**:
  Configured: `poweredByHeader: false`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(self), geolocation=()`, and `Content-Security-Policy`.
  Missing: `Strict-Transport-Security` (HSTS), `object-src`, `base-uri`, and `form-action` in CSP.

- **API Route Validations (`app/api/auth/login/route.ts:6-29`)**:
  Validates JSON parsing in `try/catch` and checks string types of `username` and `password`. Sets `accessToken` (`httpOnly: true`, `sameSite: "lax"`, `secure: isProduction`) and `isLoggedIn` (`httpOnly: false`).
  No rate limiting or account lockout is present.

- **Environment & Git History**:
  `git log --all --full-history -- "**.env*"` returned 0 commits. `.gitignore` contains `.env*`. No server secrets leaked in client code.

- **Test Suite Results**:
  `npm test -- __tests__/auth` ran 4 suites and 31 tests with 100% pass rate (`middleware.test.ts`, `nextauth-config.test.ts`, `next-config.test.ts`, `login-page.test.tsx`).

---

## 2. Logic Chain

1. **Cryptographic Key Security**:
   - `lib/token-service.ts` uses `'muryen-fallback-jwt-secret-key-2026'` whenever `JWT_SECRET` is unset.
   - `.env.local` does not supply `JWT_SECRET`.
   - Anyone with access to the codebase can compute valid HMAC-SHA256 signatures for `{ sub: '1', role: 'admin' }`.
   - Therefore, the authentication system has a critical secret management vulnerability unless `JWT_SECRET` is strictly mandated at runtime.

2. **Credential Management**:
   - `AuthService.login` checks credentials against hardcoded plaintext strings `'1111'` and `'2222'`.
   - No password hashing or database lookup occurs.
   - Therefore, any attacker knowing or guessing these 4-digit strings obtains instant admin or user access.

3. **Attack Surface & Test Routes**:
   - `app/test2/page.tsx` implements a YouTube Comment Manager that calls `signIn("google")` requesting `https://www.googleapis.com/auth/youtube.force-ssl` and invokes Google YouTube API endpoints.
   - `middleware.ts` only guards `/daily/:path*` and `/mypage/:path*`.
   - Therefore, `/test2` is exposed to unauthenticated public visitors in production.

4. **Authentication Duality**:
   - NextAuth is mounted at `/api/auth/[...nextauth]` and wrapped in `app/providers.tsx`.
   - However, `middleware.ts` exclusively checks the custom JWT cookie `accessToken`.
   - Therefore, if a user signs in via Google on `/test2`, they cannot access protected routes (`/daily`, `/mypage`), showing an incomplete/orphaned integration.

5. **API Abuse & Brute Force**:
   - `POST /api/auth/login` checks 4-digit credentials without rate limiting.
   - An attacker can automate a dictionary or brute-force attack (10,000 possibilities) in seconds without triggering any lockout or rate limit.

---

## 3. Caveats

- **External Host Environment**: In a live Vercel deployment, Vercel automatically terminates TLS and injects HSTS headers at its edge, which partially compensates for the absence of HSTS in `next.config.ts`. However, on any non-Vercel host or container, HSTS will be missing.
- **Wasm & VAD Requirements**: The CSP directive `script-src` includes `'unsafe-eval'`, which is typically required by `@xenova/transformers` and `@ricky0123/vad-web` (WebAssembly/ONNX runtime compilation). Removing `'unsafe-eval'` without testing WebAssembly execution could break audio analysis features.
- **Scope of Assessment**: This audit was strictly read-only and static/local runtime inspection. No active fuzzing against live production external servers (`https://my-server-test.vercel.app`) was executed.

---

## 4. Conclusion

1. **Client-side & Transport Defense**: The application successfully implements HTTP-only cookies for access tokens, strict open-redirect URL sanitization, secure frame/MIME headers, and zero secret leakage into client bundles or Git history.
2. **Defects to Remediate**:
   - Remove fallback secret strings and require `JWT_SECRET` and `NEXTAUTH_SECRET` in environment variables.
   - Restrict or purge `/test` and `/test2` prior to production deployment.
   - Implement rate limiting on `POST /api/auth/login`.
   - Add `Strict-Transport-Security` to `next.config.ts`.
   - Migrate hardcoded credentials to hashed credentials or an external identity store.
3. **Architecture Documentation**: The complete Security Architecture section has been authored and formatted in `/Users/a7890/src/muryen-front/.agents/swarm_explorer_security/report.md` for immediate inclusion into `PROJECT_SUMMARY.md`.

---

## 5. Verification Method

To independently verify these findings:

1. **Verify Fallback Key & Plaintext Credentials**:
   ```bash
   # Check fallback secret in token service
   grep -n "muryen-fallback" lib/token-service.ts
   # Check fallback secret in NextAuth
   grep -n "fallback-secret" app/api/auth/\[...nextauth\]/route.ts
   # Check hardcoded credentials in auth service
   grep -n "1111" lib/auth-service.ts
   ```

2. **Verify Route Protection Matcher**:
   ```bash
   grep -A 5 "matcher" middleware.ts
   ```
   Inspect lines 52-54 showing only `["/daily/:path*", "/mypage/:path*"]`.

3. **Verify Auth Test Suites**:
   ```bash
   npm test -- __tests__/auth
   ```
   Expected: 4 passed test suites, 31 tests passing.

4. **Verify Git Leakage**:
   ```bash
   git log --all --full-history -- "**.env*"
   ```
   Expected: 0 commits returned.
