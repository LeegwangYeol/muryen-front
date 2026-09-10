# Forensic Audit Report: Authentication, API, Middleware & Security

**Explorer**: sweep_explorer_1 (Auth & Security Explorer)  
**Target Repository**: `muryen-front`  
**Date**: 2026-09-09  
**Status**: COMPLETE (Read-Only Forensic Audit)  
**Report Location**: `/Users/a7890/src/muryen-front/.agents/sweep_explorer_1/handoff.md`

---

## Executive Summary

A forensic, read-only code and architecture audit was executed across all authentication modules, Next.js API route handlers, middleware guards, session handling, cookie policies, and security configurations in `muryen-front`. 

The audit examined 100% of files in scope:
- `middleware.ts`
- `lib/auth-service.ts`
- `lib/token-service.ts`
- `app/api/auth/[...nextauth]/route.ts`
- `app/api/auth/login/route.ts`
- `app/api/auth/logout/route.ts`
- `app/feed.xml/route.ts`
- `app/component/login-page.tsx` & `app/login/page.tsx`
- `app/mypage/page.tsx` & `app/daily/page.tsx`
- `components/layout/mobile-nav.tsx` & `app/component/navigation.tsx`
- `app/layout.tsx` & `next.config.ts`
- Associated test suites in `__tests__/auth/*`, `__tests__/adversarial/*`, and `__tests__/tiers/*`

### Finding Summary Matrix

| ID | Finding | Severity | Category | File & Line |
|---|---|---|---|---|
| **SEC-01** | Open Redirect & Client-Side URI Scheme Execution | **CRITICAL** | Security (CWE-601 / CWE-79) | `app/component/login-page.tsx:31-36` |
| **SEC-02** | Weak JWT Claims Validation (Object Truthiness Bypass) | **HIGH** | Auth Logic (CWE-287 / CWE-345) | `lib/token-service.ts:14-24` |
| **SEC-03** | Hardcoded Fallback JWT Secret & Missing Environment Config | **HIGH** | Security (CWE-798 / CWE-1188) | `lib/token-service.ts:4`, `.env.local` |
| **SEC-04** | Route Guard Gap: Member Dashboard `/mypage` Unprotected | **HIGH** | Access Control (CWE-306) | `middleware.ts:8-11`, `app/mypage/page.tsx` |
| **SEC-05** | Missing Middleware Route Matcher (Runs on All Static Assets) | **MEDIUM** | Performance / Architecture | `middleware.ts:1-36` |
| **SEC-06** | Unhandled Rejection Crash Risk (HTTP 500) in Middleware Guard | **MEDIUM** | Reliability / Error Handling | `middleware.ts:23` |
| **SEC-07** | Total Absence of HTTP Security Headers (No CSP, HSTS, X-Frame) | **MEDIUM** | Security Config (CWE-693) | `next.config.ts:1-7` |
| **SEC-08** | Unpinned CDN External Scripts in Root Layout without SRI | **MEDIUM** | Supply Chain (CWE-353) | `app/layout.tsx:364-371` |
| **SEC-09** | Dead `document.cookie` HttpOnly Inspection & Stale UI Auth State | **LOW** | Client Logic Bug (CWE-1004) | `mobile-nav.tsx:53-58`, `navigation.tsx:94-99` |
| **SEC-10** | NextAuth SignIn Page Points to `/test2` & Lacks Token Rotation | **LOW** | NextAuth Config | `app/api/auth/[...nextauth]/route.ts:26-46` |
| **SEC-11** | Login Form Double Submission Race Condition | **LOW** | UI State / Concurrency | `app/component/login-page.tsx:14-41` |

---

## 1. Observation

### Observation 1 [SEC-01: CRITICAL]: Open Redirect & Arbitrary Protocol Redirection
- **File**: `/Users/a7890/src/muryen-front/app/component/login-page.tsx`
- **Lines**: 31-36
- **Verbatim Code**:
```typescript
31:       // URL 파라미터에서 리다이렉트 URL 가져오기
32:       const params = new URLSearchParams(window.location.search);
33:       const redirectUrl = params.get("redirect") || "/";
34: 
35:       // 리다이렉트
36:       window.location.href = redirectUrl;
```
- **Observed Behavior**: The login form pulls the `redirect` query parameter from the browser window's search string. Without performing any validation, protocol checks, or path sanitation, it assigns the string directly to `window.location.href`.
- **Impact**:
  1. If an attacker directs a victim to `https://<site>/login?redirect=https://malicious-phishing.com` or `https://<site>/login?redirect=//evil.com`, successful authentication silently redirects the user to the attacker's phishing site.
  2. If an attacker inputs `javascript:...` or `data:...` schemes, client-side script execution can occur in browsers/webviews that allow navigation to script URIs.

---

### Observation 2 [SEC-02: HIGH]: Incomplete JWT Payload Validation in TokenService
- **File**: `/Users/a7890/src/muryen-front/lib/token-service.ts`
- **Lines**: 14-24
- **Verbatim Code**:
```typescript
14:   static async verifyToken(token: string): Promise<User | null> {
15:     try {
16:       const { payload } = await jwtVerify(token, SECRET_KEY);
17:       return {
18:         id: payload.sub as string,
19:         role: payload.role as 'admin' | 'user'
20:       };
21:     } catch {
22:       return null;
23:     }
24:   }
```
- **Observed Behavior**: `verifyToken` uses pure TypeScript type assertions (`payload.sub as string`, `payload.role as 'admin' | 'user'`). In JavaScript at runtime, if `payload.sub` or `payload.role` is missing, null, undefined, or empty:
  - The return value is `{ id: undefined, role: undefined }`.
  - In `middleware.ts`:
    ```typescript
    const user = await AuthService.validateToken(accessToken);
    if (!user) { ... }
    ```
  - Since `{ id: undefined, role: undefined }` is an object, `Boolean(user)` is `true`! The check `if (!user)` is bypassed, treating an empty or malformed token as an authorized user.

---

### Observation 3 [SEC-03: HIGH]: Hardcoded Fallback Secret & Missing `.env` Configuration
- **File**: `/Users/a7890/src/muryen-front/lib/token-service.ts` (Line 4)
- **File**: `/Users/a7890/src/muryen-front/.env.local` (Lines 1-3)
- **Verbatim Code (`token-service.ts`)**:
```typescript
4: const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
```
- **Verbatim Content (`.env.local`)**:
```bash
1: NEXTAUTH_URL=http://localhost:3000
2: NEXTAUTH_SECRET=muryeon_secret_key_for_development_only_12345
```
- **Observed Behavior**:
  1. `process.env.JWT_SECRET` is NOT defined in `.env.local`.
  2. Any deployment lacking an explicit `JWT_SECRET` environment variable falls back to the static string `'your-secret-key'`.
  3. Anyone reading the repository can mint their own valid HS256 JWT tokens with arbitrary `sub` and `role: "admin"`, entirely bypassing authentication without knowing credentials.

---

### Observation 4 [SEC-04: HIGH]: Route Protection Gap for Member Page `/mypage`
- **File**: `/Users/a7890/src/muryen-front/middleware.ts` (Lines 8-11)
- **File**: `/Users/a7890/src/muryen-front/app/mypage/page.tsx` (Lines 1-38)
- **Verbatim Code (`middleware.ts`)**:
```typescript
8:   // daily 경로가 아니면 통과
9:   if (!pathname.startsWith("/daily")) {
10:     return NextResponse.next();
11:   }
```
- **Verbatim Code (`app/mypage/page.tsx`)**:
```typescript
11: export default function MyPage() {
12:   return (
13:     <MainLayout>
...
23:               <SubHeading size="lg" className="text-white mb-1">김무련 무사님, 환영합니다!</SubHeading>
...
33:         <DashboardStatCards />
34:       </div>
35:     </MainLayout>
36:   );
37: }
```
- **Build Inspection (`npm run build` output)**:
```
├ ○ /mypage                              3.44 kB         106 kB
```
- **Observed Behavior**: `middleware.ts` guards only paths starting with `/daily`. The member page `/mypage` (rendered in the primary navigation as `"나의 수련 (My)"`) contains personal member training data, attendance stats, and sparring metrics. It has zero authentication checks in middleware and zero checks inside the component. Any anonymous visitor can view `/mypage`.

---

### Observation 5 [SEC-05: MEDIUM]: Missing Middleware Matcher
- **File**: `/Users/a7890/src/muryen-front/middleware.ts`
- **Observed Behavior**: `middleware.ts` does not export a `config = { matcher: [...] }` object.
- **Consequence**: Next.js triggers the middleware function on every request, including Next.js static chunks (`/_next/static/*`), optimized images (`/_next/image/*`), favicon (`/favicon.ico`), and public assets. While `pathname.startsWith("/daily")` returns early, passing through the 40.3 kB middleware bundle on every static request creates unnecessary Edge compute invocations and latency.

---

### Observation 6 [SEC-06: MEDIUM]: Unhandled Promise Rejection Crash Risk in `middleware.ts`
- **File**: `/Users/a7890/src/muryen-front/middleware.ts` (Lines 22-25)
- **Verbatim Code**:
```typescript
22:   // 토큰 검증
23:   const user = await AuthService.validateToken(accessToken);
24: 
25:   if (!user) {
```
- **Observed Behavior**: `await AuthService.validateToken(accessToken)` is called without a `try...catch` wrapper.
- **Consequence**: If an unexpected exception occurs inside the Web Crypto API, during UTF-8 decoding, or in JOSE token validation in the Edge runtime, the middleware rejects with an unhandled promise rejection. Next.js returns an HTTP 500 Internal Server Error, displaying a server failure page to the user instead of catching the error, purging the invalid cookie, and redirecting safely to `/login`.

---

### Observation 7 [SEC-07: MEDIUM]: Complete Absence of HTTP Security Headers
- **File**: `/Users/a7890/src/muryen-front/next.config.ts`
- **Verbatim Code**:
```typescript
1: import type { NextConfig } from "next";
2: 
3: const nextConfig: NextConfig = {
4:   /* config options here */
5: };
6: 
7: export default nextConfig;
```
- **Observed Behavior**: No security headers are configured in `next.config.ts` or in `middleware.ts`.
- **Consequence**: The application sends responses with no:
  - `Content-Security-Policy` (CSP)
  - `X-Frame-Options` (defaulting to `SAMEORIGIN` or missing, allowing potential framing / clickjacking)
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy`

---

### Observation 8 [SEC-08: MEDIUM]: Global External CDN Script Ingestion without Subresource Integrity (SRI)
- **File**: `/Users/a7890/src/muryen-front/app/layout.tsx`
- **Lines**: 364-371
- **Verbatim Code**:
```tsx
364:         <Script
365:           src="https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/ort.js"
366:           strategy="lazyOnload"
367:         />
368:         <Script
369:           src="https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.19/dist/bundle.min.js"
370:           strategy="lazyOnload"
371:         />
```
- **Observed Behavior**:
  1. Root `layout.tsx` imports heavy external JavaScript binaries from `cdn.jsdelivr.net` for every visitor across the entire application.
  2. The `<Script>` tags omit `integrity` (SRI hash) and `crossOrigin="anonymous"`.
  3. These scripts are only needed on the experimental `/test` page (which uses `(window as any).vad`).
- **Consequence**: If `cdn.jsdelivr.net` or the published npm packages are hijacked or tampered with, malicious script execution occurs globally across all site pages without integrity verification.

---

### Observation 9 [SEC-09: LOW]: Ineffective `document.cookie` HttpOnly Inspection & Stale UI Auth State
- **File**: `/Users/a7890/src/muryen-front/components/layout/mobile-nav.tsx` (Lines 53-58)
- **File**: `/Users/a7890/src/muryen-front/app/component/navigation.tsx` (Lines 94-99)
- **Verbatim Code**:
```typescript
  useEffect(() => {
    setIsLoggedIn(
      document.cookie.includes("isLoggedIn=true") ||
        document.cookie.includes("accessToken")
    );
  }, []);
```
- **Observed Behavior**:
  1. `accessToken` is set with `httpOnly: true` in `/api/auth/login/route.ts` (Line 45). Therefore, `document.cookie.includes("accessToken")` is always `false` in production.
  2. `useEffect(..., [])` runs only on initial mount. Because `Navigation` and `MobileNav` are housed inside `AppShell` in `layout.tsx`, they do not unmount during client-side Next.js route transitions. If a user logs in and navigates using client-side routing, `isLoggedIn` does not re-evaluate.
  3. Substring matching `document.cookie.includes("isLoggedIn=true")` is fragile compared to parsing cookie key-value pairs or maintaining state via an auth context/event.

---

### Observation 10 [SEC-10: LOW]: NextAuth Sign-In Route Inconsistency & OAuth Token Expiry
- **File**: `/Users/a7890/src/muryen-front/app/api/auth/[...nextauth]/route.ts` (Lines 26-46)
- **File**: `/Users/a7890/src/muryen-front/app/test2/page.tsx` (Lines 44-98)
- **Verbatim Code**:
```typescript
42:   pages: {
43:     signIn: "/test2",
44:   },
45:   secret: process.env.NEXTAUTH_SECRET,
```
- **Observed Behavior**:
  1. NextAuth's `signIn` page is configured to `"/test2"` (a debug YouTube comment manager), rather than `/login`.
  2. The Google OAuth provider requests `access_type: "offline"`, but the `jwt` callback stores only `account.access_token`. It does not store `account.refresh_token` or `account.expires_at`, and implements no refresh rotation logic. Google access tokens expire in 1 hour; any subsequent API call using `session.accessToken` in `/test2` fails with HTTP 401.
  3. In `app/test2/page.tsx`, `userResponse.json()` and `response.json()` lack safe parsing for non-JSON error payloads.

---

### Observation 11 [SEC-11: LOW]: Form Double Submission & Race Condition on Login
- **File**: `/Users/a7890/src/muryen-front/app/component/login-page.tsx`
- **Lines**: 14-41, 90-99
- **Observed Behavior**: `handleLogin` has no loading state boolean. The submit button remains active and clickable while the asynchronous `fetch('/api/auth/login')` is in-flight.
- **Consequence**: Rapid clicks or Enter presses send duplicate simultaneous login requests, risking race conditions on cookie store mutation.

---

## 2. Logic Chain

### Logic Chain for SEC-01 (Open Redirect):
1. *Observation 1*: `params.get("redirect")` directly sets `window.location.href`.
2. *Premise*: Next.js uses client-side routing, but `window.location.href = ...` triggers browser-level navigation to whatever URI string is assigned.
3. *Inference*: If `redirect` is `https://evil.com` or `//evil.com`, the browser treats it as an absolute URL or protocol-relative URL and redirects away from `muryen.com`.
4. *Conclusion*: An external attacker can craft trusted domain links (`https://muryen-front.vercel.app/login?redirect=...`) for credential harvesting or phishing. Remediation requires validating that the target URL starts with a single `/` and does NOT start with `//` or `/\`.

### Logic Chain for SEC-02 (JWT Claims Truthiness Bypass):
1. *Observation 2*: `TokenService.verifyToken` decodes the token with `jwtVerify`, and returns `{ id: payload.sub as string, role: payload.role as 'admin' | 'user' }`.
2. *Premise*: JavaScript considers any non-null object (even `{ id: undefined, role: undefined }`) truthy in boolean expressions (`if (!user)` is false).
3. *Inference*: If a token has an empty payload `{}` or non-string `sub`, `verifyToken` returns a truthy object.
4. *Observation in Middleware*: `middleware.ts` line 25 evaluates `if (!user)`. Since `user` is truthy, the request is permitted through the route guard.
5. *Conclusion*: Runtime validation must check `if (!payload.sub || typeof payload.sub !== 'string' || !payload.role) return null;`.

### Logic Chain for SEC-03 (Fallback Secret Key):
1. *Observation 3*: `process.env.JWT_SECRET || 'your-secret-key'` defaults to `'your-secret-key'`.
2. *Observation in `.env.local`*: `JWT_SECRET` is completely missing from `.env.local`.
3. *Inference*: Any environment that does not supply `JWT_SECRET` signs tokens using a publicly known string.
4. *Conclusion*: In production (`process.env.NODE_ENV === 'production'`), the application must require `JWT_SECRET` and refuse to use default secrets.

### Logic Chain for SEC-04 (Route Guard Gap for `/mypage`):
1. *Observation 4*: `middleware.ts` only checks `!pathname.startsWith("/daily")`.
2. *Observation in App*: `/mypage` was added to navigation and contains user dashboard data (`DashboardStatCards`, attendance, personal greetings).
3. *Inference*: Anyone navigating to `/mypage` bypasses authentication entirely.
4. *Conclusion*: Update `middleware.ts` and matcher to protect both `/daily` and `/mypage` (e.g. `['/daily/:path*', '/mypage/:path*']`).

---

## 3. Caveats

1. **Static Mock Backend**: `lib/auth-service.ts` currently authenticates against mock hardcoded users (`1111`/`1111` for admin, `2222`/`2222` for user). This is designed for demonstration/mock purposes; when moving to a production database, password hashing (e.g. Argon2/bcrypt) and rate limiting must be introduced.
2. **Dual Authentication Systems**: The application has two distinct auth mechanisms:
   - Custom JWT stored in HttpOnly cookie `accessToken` (used for `/daily` and the mock auth service).
   - NextAuth with GoogleProvider (used in `/test2` for YouTube API access).
   These two systems do not currently share session state.
3. **Next.js 15 Cookie Store Async Requirement**: In Next.js 15, `cookies()` returns a Promise. `app/api/auth/login/route.ts` and `logout/route.ts` already correctly `await cookies()`.

---

## 4. Conclusion & Concrete Fix Recommendations

### Priority 1: Remediate Open Redirect Vulnerability in `app/component/login-page.tsx`
**Fix**: Add URL sanitation before setting `window.location.href`:
```typescript
// Safe redirect helper
function sanitizeRedirectUrl(url: string | null): string {
  if (!url) return "/";
  // Must start with single '/' and not '//' or '/\'
  if (url.startsWith("/") && !url.startsWith("//") && !url.startsWith("/\\")) {
    return url;
  }
  return "/";
}

// In handleLogin:
const params = new URLSearchParams(window.location.search);
const redirectUrl = sanitizeRedirectUrl(params.get("redirect"));
window.location.href = redirectUrl;
```

### Priority 2: Enforce Strict Runtime Claims Validation in `lib/token-service.ts`
**Fix**:
```typescript
  static async verifyToken(token: string): Promise<User | null> {
    if (!token || typeof token !== 'string') return null;
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      if (
        !payload.sub ||
        typeof payload.sub !== 'string' ||
        (payload.role !== 'admin' && payload.role !== 'user')
      ) {
        return null;
      }
      return {
        id: payload.sub,
        role: payload.role as 'admin' | 'user'
      };
    } catch {
      return null;
    }
  }
```

### Priority 3: Guard Fallback Secret in `lib/token-service.ts`
**Fix**:
```typescript
const secret = process.env.JWT_SECRET;
if (!secret && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is missing in production');
}
const SECRET_KEY = new TextEncoder().encode(secret || 'your-secret-key');
```

### Priority 4: Expand Middleware Protection to `/mypage` and Add Matcher & Error Handling in `middleware.ts`
**Fix**:
```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthService } from "./lib/auth-service";

const PROTECTED_PREFIXES = ["/daily", "/mypage"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (!isProtected) {
    return NextResponse.next();
  }

  const targetUrl = request.nextUrl.pathname + request.nextUrl.search;
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(targetUrl)}`, request.url)
    );
  }

  try {
    const user = await AuthService.validateToken(accessToken);

    if (!user) {
      const response = NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(targetUrl)}`, request.url)
      );
      response.cookies.delete("accessToken");
      response.cookies.delete("isLoggedIn");
      return response;
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware auth verification error:", err);
    const response = NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(targetUrl)}`, request.url)
    );
    response.cookies.delete("accessToken");
    response.cookies.delete("isLoggedIn");
    return response;
  }
}

export const config = {
  matcher: ["/daily/:path*", "/mypage/:path*"],
};
```

### Priority 5: Add Standard Security Headers in `next.config.ts`
**Fix**:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(self), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## 5. Verification Method

To independently verify all findings and test remediations:

1. **Run Full Auth Test Suite**:
   ```bash
   npx jest __tests__/auth/ __tests__/adversarial/auth-routes.test.ts __tests__/utils/auth-service.test.ts __tests__/utils/token-service.test.ts
   ```
   *Expected Result*: All 5 suites (36 tests) pass.

2. **Verify Open Redirect Fix**:
   Execute the following test in Jest or browser:
   ```typescript
   // Testing sanitizeRedirectUrl
   expect(sanitizeRedirectUrl("https://evil.com")).toBe("/");
   expect(sanitizeRedirectUrl("//evil.com")).toBe("/");
   expect(sanitizeRedirectUrl("/\\evil.com")).toBe("/");
   expect(sanitizeRedirectUrl("javascript:alert(1)")).toBe("/");
   expect(sanitizeRedirectUrl("/daily")).toBe("/daily");
   expect(sanitizeRedirectUrl("/mypage?tab=records")).toBe("/mypage?tab=records");
   ```

3. **Verify Empty Claims Rejection**:
   ```typescript
   const emptyPayloadToken = await new SignJWT({})
     .setProtectedHeader({ alg: 'HS256' })
     .setExpirationTime('24h')
     .sign(new TextEncoder().encode('your-secret-key'));
   
   const result = await TokenService.verifyToken(emptyPayloadToken);
   expect(result).toBeNull(); // Must be null, not { id: undefined, role: undefined }
   ```

4. **Verify Middleware Guarding `/mypage`**:
   In `__tests__/auth/middleware.test.ts`:
   ```typescript
   const req = new NextRequest("http://localhost:3000/mypage");
   const res = await middleware(req);
   expect(res.status).toBe(307);
   expect(res.headers.get("location")).toBe("http://localhost:3000/login?redirect=%2Fmypage");
   ```

5. **Lint and Build Commands**:
   - `npm run lint`: Confirms 0 errors, 0 warnings.
   - `npm run build`: Confirms Next.js compiles routes and types cleanly.
