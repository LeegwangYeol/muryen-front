# Exhaustive Security Audit Report — Muryen Front

**Target Project**: `muryen-front` (Next.js 15 App Router Frontend)  
**Auditor**: `swarm_explorer_security`  
**Date**: 2026-09-30  
**Status**: Completed  

---

## 1. Executive Summary & Audit Overview

A comprehensive, read-only security assessment of `muryen-front` was conducted across all authentication modules, routing middleware, HTTP headers, API endpoints, and configuration files.

### Overall Security Posture
The application exhibits strong defensive baseline practices in client-side XSS mitigation, secure cookie configurations, and open-redirect sanitization. However, critical architectural risks exist in secret key handling, authentication synchronization (dual NextAuth/custom JWT divergence), hardcoded test credentials, unauthenticated test routes in production, and a complete absence of rate limiting.

### Summary Risk Dashboard

| Severity | Issue Title | Location | Status / Risk |
|:---|:---|:---|:---|
| **CRITICAL** | Hardcoded Fallback Secrets for JWT & NextAuth | `lib/token-service.ts:7`, `app/api/auth/[...nextauth]/route.ts:47` | Allows offline JWT forgery if env vars omitted |
| **CRITICAL** | Plaintext Hardcoded Static Credentials in Production Code | `lib/auth-service.ts:11-15` | Trivial account takeover (IDs `1111`, `2222`) |
| **HIGH** | Unprotected High-Privilege Test Routes in Production | `app/test2/page.tsx`, `app/test/page.tsx` | Arbitrary YouTube comment posting & mic audio access |
| **HIGH** | Authentication Desynchronization (Orphaned NextAuth OAuth) | `middleware.ts`, `app/api/auth/[...nextauth]/route.ts` | NextAuth sessions ignored by middleware route guard |
| **HIGH** | Missing Rate Limiting on Login Endpoint | `app/api/auth/login/route.ts` | Brute-force risk on 4-digit credential space |
| **MEDIUM** | Missing HTTP Strict Transport Security (HSTS) | `next.config.ts` | Missing SSL downgrade protection header |
| **MEDIUM** | Permissive Directives in Content Security Policy (CSP) | `next.config.ts:31-38` | `script-src 'unsafe-inline' 'unsafe-eval'`; missing `object-src`, `base-uri` |
| **MEDIUM** | Stateless JWT Invalidation Deficit on Logout | `app/api/auth/logout/route.ts`, `lib/token-service.ts` | Issued tokens remain valid for 24h post-logout |
| **LOW** | Client-Side Inspection of HTTP-only Cookie | `app/component/navigation.tsx:97` | Ineffective `document.cookie.includes("accessToken")` check |

---

## 2. Audit Dimension 1: Authentication Architecture & Token Management

### 2.1 Dual Auth System Architecture
The application currently maintains two completely disjointed authentication subsystems:

1. **Custom JWT Subsystem (Primary / Active in UI)**:
   - Handled via `AuthService` (`lib/auth-service.ts`) and `TokenService` (`lib/token-service.ts`).
   - Entry point: `POST /api/auth/login`.
   - Token library: `jose` (v5.9.6).
   - Session storage: `accessToken` cookie (HTTP-only) and `isLoggedIn` cookie (client readable).
   - Route guard: Enforced by `middleware.ts`.

2. **NextAuth.js Subsystem (Orphaned / Secondary)**:
   - Handled via NextAuth v4.24.11 (`app/api/auth/[...nextauth]/route.ts`).
   - Configured with Google OAuth Provider (`GoogleProvider`).
   - Wrapped at application root via `SessionProvider` in `app/providers.tsx`.
   - Used exclusively in `app/test2/page.tsx` for requesting YouTube permissions (`https://www.googleapis.com/auth/youtube.force-ssl`).

```
                    ┌────────────────────────────┐
                    │      Incoming Visitor      │
                    └─────────────┬──────────────┘
                                  │
                  ┌───────────────┴───────────────┐
                  ▼                               ▼
       [Primary UI / Login]              [Experimental /test2]
       app/component/login-page.tsx       app/test2/page.tsx
                  │                               │
                  ▼                               ▼
         POST /api/auth/login             NextAuth Google OAuth
        (lib/auth-service.ts)             (/api/auth/[...nextauth])
                  │                               │
                  ▼                               ▼
         Cookie: accessToken             Cookie: next-auth.session-token
                  │                               │
                  ▼                               ▼
         Checked by middleware.ts        IGNORED by middleware.ts!
         (Access to /daily, /mypage)     (Redirected to /login)
```

### 2.2 Hardcoded Fallback Cryptographic Keys
In `lib/token-service.ts` (lines 4-9):
```typescript
function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  return new TextEncoder().encode(
    secret || 'muryen-fallback-jwt-secret-key-2026'
  );
}
```
In `app/api/auth/[...nextauth]/route.ts` (lines 45-48):
```typescript
  secret:
    process.env.NEXTAUTH_SECRET ||
    "muryen-production-fallback-secret-2026-auth",
```
**Observation & Impact**:
- In `.env.local`, only `NEXTAUTH_SECRET` is defined (`muryen_secret_key_for_development_only_12345`). `JWT_SECRET` is **not defined**.
- Therefore, in development and any environment lacking explicit `JWT_SECRET`, the static string `'muryen-fallback-jwt-secret-key-2026'` is used.
- Because this repository is tracked in source control, an attacker possessing this fallback secret can craft a forged JWT token using `jose` with payload `{ sub: "1", role: "admin" }`, set the `accessToken` cookie in their browser, and bypass middleware authentication entirely to access administrative and protected routes.

### 2.3 Hardcoded Static Credentials in Source Code
In `lib/auth-service.ts` (lines 6-16):
```typescript
    // 하드코딩된 사용자 인증
    const { username, password } = credentials;
    
    let user: User | null = null;

    if (username === '1111' && password === '1111') {
      user = { id: '1', role: 'admin' };
    } else if (username === '2222' && password === '2222') {
      user = { id: '2', role: 'user' };
    }
```
**Observation & Impact**:
- User accounts and credentials are hardcoded directly in production code.
- No password hashing (such as `bcrypt`, `argon2`, or `scrypt`) is used.
- The credentials are 4 digits (`1111` and `2222`), which is trivial to guess or brute force.
- No user registry, persistence layer, or password reset mechanism exists.

### 2.4 Token Generation, Claims, and Expiration
In `lib/token-service.ts` (lines 12-18):
```typescript
  static async generateToken(user: User): Promise<string> {
    const secretKey = getSecretKey();
    return new SignJWT({ sub: user.id, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secretKey);
  }
```
**Security Assessment**:
- Algorithm: `HS256` (HMAC with SHA-256). Appropriate for symmetric signing.
- Payload claims: `sub` (user ID), `role` (`'admin' | 'user'`).
- Validation (`verifyToken` lines 27-37):
  - Strictly checks `!payload.sub` and verifies that `payload.role === 'admin' || payload.role === 'user'`.
  - Type-safe runtime parsing prevents role pollution.
- Missing Claims:
  - Missing `iat` (issued-at timestamp).
  - Missing `iss` (issuer verification, e.g. `muryen.auth`).
  - Missing `aud` (audience verification, e.g. `muryen-app`).
  - Missing `jti` (JWT ID) for replay prevention / token identification.
- Expiration:
  - Fixed 24-hour expiration (`24h`).
  - No sliding session or refresh token rotation mechanism.
  - If a user changes credentials or role, existing tokens remain valid until expiration.

### 2.5 Cookie Storage Configuration & Session Lifetime
In `app/api/auth/login/route.ts` (lines 40-60):
- Cookie 1: `accessToken`
  - `httpOnly: true` (Protects token against client-side JavaScript access and DOM-based XSS exfiltration).
  - `secure: process.env.NODE_ENV === "production"` (Enforces HTTPS transmission in production).
  - `sameSite: "lax"` (Prevents CSRF on cross-site subrequests while permitting top-level navigation).
  - `maxAge: 86400` (24 hours, in sync with JWT expiration).
  - `path: "/"` (Available across application).
- Cookie 2: `isLoggedIn`
  - `httpOnly: false` (Intentionally accessible by client-side JavaScript).
  - `secure: isProduction`.
  - `sameSite: "lax"`.
  - `maxAge: 86400`.
  - Purpose: Signals authenticated UI state (showing logout button) without exposing the sensitive `accessToken`.

**Ineffective Code in UI**:
In `app/component/navigation.tsx` (lines 95-98) and `components/layout/mobile-nav.tsx` (lines 54-57):
```typescript
setIsLoggedIn(
  document.cookie.includes("isLoggedIn=true") ||
    document.cookie.includes("accessToken")
);
```
Because `accessToken` is marked `httpOnly: true`, `document.cookie.includes("accessToken")` will ALWAYS evaluate to `false` in the browser. The fallback only functions because `isLoggedIn=true` is present.

---

## 3. Audit Dimension 2: Route Protection & Middleware

### 3.1 Middleware Configuration & Matchers
In `middleware.ts`:
```typescript
const PROTECTED_PREFIXES = ["/daily", "/mypage"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (!isProtected) {
    return NextResponse.next();
  }
...
}

export const config = {
  matcher: ["/daily/:path*", "/mypage/:path*"],
};
```

### 3.2 Coverage & Gap Analysis
1. **Protected Paths**:
   - `/daily` and all nested paths (`/daily/*`).
   - `/mypage` and all nested paths (`/mypage/*`).
   - Evaluated using both Next.js route matchers (`/daily/:path*`) and runtime string prefix check (`pathname.startsWith(prefix)`).
2. **Public Paths Allowed**:
   - `/`, `/about`, `/basic`, `/basic-sense`, `/pattern`, `/cutting`, `/sparring`, `/equipment`, `/gallery`, `/know-how`, `/location`, `/login`, `/feed.xml`.
3. **Critical Unprotected Routes**:
   - `/test`: Audio recording and automatic WAV download tool. Publicly exposed.
   - `/test2`: YouTube comment integration tool with Google OAuth. Publicly exposed.
   Neither `/test` nor `/test2` are guarded by `middleware.ts`. In production, any anonymous visitor can access `/test2`, connect their Google account, and post comments or access recording utilities.
4. **Lack of Role-Based Authorization (RBAC)**:
   - Although the token supports `role: 'admin'`, `middleware.ts` only validates that `user` is non-null. There are no admin-specific route guards (e.g. `/admin/:path*`).

### 3.3 Token Verification & Exception Handling
In `middleware.ts` (lines 27-49):
```typescript
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
  } catch (error) {
    console.error("Middleware auth verification error:", error);
    const response = NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(targetUrl)}`, request.url)
    );
    response.cookies.delete("accessToken");
    response.cookies.delete("isLoggedIn");
    return response;
  }
```
**Assessment**:
- Resilient exception handling: If Edge Runtime encounters cryptographic errors or token corruption, it catches the exception, logs it, clears authentication cookies, and redirects safely.
- Cookie purging (`response.cookies.delete`) prevents infinite redirection loops on corrupted client cookies.

### 3.4 Open Redirect Prevention & URI Sanitation
The application handles post-login redirects in two steps:

**Step 1: Generation in Middleware (`middleware.ts:22-24`)**:
```typescript
const targetUrl = request.nextUrl.pathname + request.nextUrl.search;
return NextResponse.redirect(
  new URL(`/login?redirect=${encodeURIComponent(targetUrl)}`, request.url)
);
```
Because `targetUrl` is constructed strictly from `request.nextUrl.pathname`, and `middleware.ts` only executes on matched protected paths, the generated parameter is guaranteed to be a relative path on the same origin.

**Step 2: Consumption & Sanitation on Client (`app/component/login-page.tsx:9-18`)**:
```typescript
export function sanitizeRedirectUrl(url: string | null): string {
  if (!url) return "/";
  // Strip ASCII control characters (0x00-0x1F, 0x7F) and trim whitespace
  const cleaned = url.replace(/[\x00-\x1F\x7F]/g, "").trim();
  // Must start with single '/' and not be followed by '/', '\', or whitespace
  if (/^\/[^\/\\\s]/.test(cleaned) || cleaned === "/") {
    return cleaned;
  }
  return "/";
}
```

**Adversarial Security Evaluation of `sanitizeRedirectUrl`**:
- Scheme-based redirects (`https://evil.com`, `http://evil.com`): Rejected (does not start with `/`).
- Protocol-relative URLs (`//evil.com`, `///evil.com`): Rejected (second character is `/`, failing `[^\/\\\s]`).
- Backslash evasion (`/\evil.com`, `/\\evil.com`): Rejected (second character is `\`, failing `[^\/\\\s]`).
- Control characters and whitespace injection (`/\t/evil.com`, `/\r\n/evil.com`): Stripped by regex, then evaluated; second character fails.
- Script pseudo-schemes (`javascript:alert(1)`, `data:text/html,...`): Rejected.
- Encoded paths (`/%2f%2fevil.com`): Interpreted by browser relative to current host origin (`https://muryen.com/%2f%2fevil.com`), staying on-site.
- Valid internal paths (`/daily`, `/mypage?tab=records`): Allowed and returned cleanly.
- **Verdict**: Open redirect mitigation is robust and comprehensive.

---

## 4. Audit Dimension 3: HTTP Security Headers in `next.config.ts`

### 4.1 Header Configuration Matrix
In `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://www.googletagmanager.com https://wcs.pstatic.net https://ssl.pstatic.net",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https:",
              "connect-src 'self' https://my-server-test.vercel.app https://www.google-analytics.com https://wcs.naver.com",
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
              "media-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};
```

### 4.2 Detailed Header-by-Header Evaluation

1. **`poweredByHeader: false`**:
   - Suppresses `X-Powered-By: Next.js`. Reduces technology fingerprinting. (PASS)
2. **`X-Content-Type-Options: nosniff`**:
   - Instructs browsers not to sniff MIME types away from declared `Content-Type`. Prevents script execution disguised as images or text. (PASS)
3. **`X-Frame-Options: SAMEORIGIN`**:
   - Restricts iframe embedding to same-origin. Protects against clickjacking. (PASS)
4. **`Referrer-Policy: strict-origin-when-cross-origin`**:
   - Sends full URL when navigating same-origin, sends only origin over HTTPS cross-origin, sends no referrer on downgrade to HTTP. (PASS)
5. **`Permissions-Policy: camera=(), microphone=(self), geolocation=()`**:
   - Explicitly restricts powerful browser APIs. Disables camera and GPS; scopes microphone strictly to `self` (necessary for voice activity detection). (PASS)
6. **`Strict-Transport-Security` (HSTS)**:
   - **MISSING** from `next.config.ts`.
   - While Vercel sets HSTS on its standard edge, self-hosted, custom domain, or containerized deployments lack HSTS unless explicitly configured.
   - Recommended: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
7. **Content Security Policy (CSP)**:
   - **Strengths**:
     - Explicit domain whitelists for CDNs, analytics (`google-analytics.com`, `naver.com`), YouTube iframes, and Tokki chat backend (`my-server-test.vercel.app`).
     - Scoped `connect-src` and `frame-src`.
   - **Weaknesses & Gaps**:
     - `script-src` includes `'unsafe-inline'` and `'unsafe-eval'`: Allows arbitrary inline `<script>` tags and `eval()`. (Required currently due to un-nonced inline theme initialization scripts and WebAssembly/ONNX dependencies).
     - Missing `object-src 'none'`: Enables plugin execution (`<object>`, `<embed>`).
     - Missing `base-uri 'self'`: Does not prevent injection of `<base href="...">` which could hijack relative script paths.
     - Missing `form-action 'self'`: Allows form submissions to arbitrary external origins if attacker injects HTML.
     - Missing `frame-ancestors 'self'`: Modern standard replacing `X-Frame-Options`.
     - Missing `upgrade-insecure-requests`: Fails to automatically upgrade passive mixed content to HTTPS.

---

## 5. Audit Dimension 4: API Routes Security Audit (`app/api/`)

### 5.1 Route Inventory & Verification

The application exposes 3 API routes and 1 XML route handler:
1. `POST /api/auth/login` (`app/api/auth/login/route.ts`)
2. `POST /api/auth/logout` (`app/api/auth/logout/route.ts`)
3. `ALL /api/auth/[...nextauth]` (`app/api/auth/[...nextauth]/route.ts`)
4. `GET /feed.xml` (`app/feed.xml/route.ts`)

### 5.2 Endpoint-by-Endpoint Analysis

#### 1. `POST /api/auth/login`
- **Payload Parsing**:
  ```typescript
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON or request body" }, { status: 400 });
  }
  ```
  Properly guarded against malformed JSON syntax crashes.
- **Input Validation**:
  ```typescript
  const { username, password } = body || {};
  if (!username || !password || typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
  }
  ```
  Type-strict checking eliminates null/undefined/numeric type juggling.
- **Rate Limiting & Brute-Force**:
  - **CRITICAL GAP**: No rate limiting (e.g. Redis, token bucket, or in-memory map) is implemented.
  - Given that valid credentials are 4 digits (`1111` and `2222`), an automated brute-force attacker can test all 10,000 4-digit combinations within a few seconds.
- **Error Disclosures**:
  - Generic message `"잘못된 아이디 또는 비밀번호입니다."` returned on invalid credentials. Does not reveal whether username vs password was incorrect, preventing username enumeration.
- **CORS & CSRF**:
  - No explicit CORS headers configured (defaults to same-origin in Next.js).
  - Cookie uses `SameSite: Lax`, providing baseline defense against cross-site POSTs in standard modern browsers.

#### 2. `POST /api/auth/logout`
- **Behavior**: Calls `cookieStore.delete("accessToken")` and `cookieStore.delete("isLoggedIn")`.
- **Vulnerability**: Stateless JWTs cannot be revoked without a server-side token revocation list (blocklist or Redis session table). If a user logs out on a shared or compromised terminal, the issued JWT continues to be valid for 24 hours if copied prior to cookie deletion.

#### 3. `ALL /api/auth/[...nextauth]`
- **Behavior**: Delegates to `NextAuth(authOptions)` with `GoogleProvider`.
- **Scope Risk**: Requests `https://www.googleapis.com/auth/youtube.force-ssl`. This OAuth scope grants full read/write/delete access to the user's YouTube account.
- **Divergence**: NextAuth is not integrated into `middleware.ts` or the main `/login` form, creating an unmaintained surface.

#### 4. `GET /feed.xml`
- **Behavior**: Outputs RSS XML feed for SEO.
- **Sanitization**: Implements `escapeXml()` converting `&`, `<`, `>`, `"`, `'` to XML entities, and wraps description in CDATA.
- **Cache-Control**: `public, max-age=3600, s-maxage=3600`.
- **Verdict**: Completely secure. No injection vulnerabilities.

---

## 6. Audit Dimension 5: Sensitive Data Handling & Environment Variable Exposure

### 6.1 Environment Variable Audit

| Variable Name | Scope | Location Found | Exposure Risk / Assessment |
|:---|:---|:---|:---|
| `JWT_SECRET` | Server-only | `lib/token-service.ts` | **Private Secret**. Not leaked to client bundle. High risk if missing due to hardcoded fallback string. |
| `NEXTAUTH_SECRET` | Server-only | `app/api/auth/[...nextauth]/route.ts` | **Private Secret**. Not leaked to client. High risk if missing due to fallback string. |
| `GOOGLE_CLIENT_ID` | Server-only | `app/api/auth/[...nextauth]/route.ts` | Server config. Not leaked. |
| `GOOGLE_CLIENT_SECRET`| Server-only | `app/api/auth/[...nextauth]/route.ts` | **Private Secret**. Kept server-side in NextAuth provider options. |
| `NEXT_PUBLIC_GA_ID` | Client & Server | `app/component/analytics.tsx` | Public client analytics ID (`G-78SSBDLD14`). By design public. |
| `NEXT_PUBLIC_NAVER_ANALYTICS_ID` | Client & Server | `app/component/analytics.tsx` | Public client analytics ID (`1c35b7d72227160`). By design public. |
| `NEXT_PUBLIC_TOKKI_API_URL` | Client & Server | `lib/tokki.ts` | Public backend API URL (`https://my-server-test.vercel.app`). By design public. |
| `NEXT_PUBLIC_TOKKI_WIDGET_ID` | Client & Server | `lib/tokki.ts` | Public widget tenant ID (`muryen`). By design public. |

### 6.2 Git History & Repository Hygiene
- Checked `.gitignore`: Contains `.env*` on line 33.
- Checked git history for `.env` leaks (`git log --all --full-history -- "**.env*"`):
  - Result: **0 commits found**. No `.env` files or secrets were ever committed to Git history.
- Local `.env.local` contains development placeholder secrets only:
  ```
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=muryen_secret_key_for_development_only_12345
  ```

### 6.3 Client-Side Bundle & DOM Leakage
- Verified that `process.env.JWT_SECRET`, `GOOGLE_CLIENT_SECRET`, and other non-`NEXT_PUBLIC_` variables are never imported or referenced in client components (`"use client"`).
- Verified `ChatWidget` and LLM integration:
  - Tokens and messages are rendered as standard React text children, preventing DOM XSS injection from external LLM streaming responses.

---

## 7. Security Vulnerabilities, Edge Cases & Remediation

### Vulnerability Matrix

```
[CRITICAL] VULN-01: Hardcoded Fallback Secrets for JWT Signing & NextAuth
- Severity: CRITICAL (CVSS: 9.1)
- CWE: CWE-798 (Use of Hard-coded Credentials)
- Location: lib/token-service.ts:7-8, app/api/auth/[...nextauth]/route.ts:46-47
- Description: Fallback strings 'muryen-fallback-jwt-secret-key-2026' and 'muryen-production-fallback-secret-2026-auth' are used if env vars are unset.
- Exploit Scenario: An attacker deploys or targets an instance where JWT_SECRET is omitted. The attacker generates a JWT with sub='1' and role='admin' using the known secret key, sets cookie 'accessToken', and obtains full administrative access.
- Remediation: Remove fallback string and throw an error during startup if JWT_SECRET or NEXTAUTH_SECRET is missing.

[CRITICAL] VULN-02: Plaintext Hardcoded Static Credentials in Production
- Severity: CRITICAL (CVSS: 8.8)
- CWE: CWE-259 (Use of Hard-coded Password)
- Location: lib/auth-service.ts:11-15
- Description: Plaintext credentials ('1111'/'1111' for admin, '2222'/'2222' for user) are hardcoded directly in the application code.
- Remediation: Migrate to a database or environment-based salted hash verification (e.g. bcrypt/argon2).

[HIGH] VULN-03: Unprotected Public Test Routes with External Impact
- Severity: HIGH (CVSS: 7.5)
- CWE: CWE-306 (Missing Authentication for Critical Function)
- Location: app/test/page.tsx, app/test2/page.tsx
- Description: Routes /test and /test2 are omitted from middleware protection. /test2 enables YouTube OAuth authentication with 'youtube.force-ssl' scope and allows sending arbitrary comments to YouTube videos.
- Remediation: Delete /test and /test2 before production deployment, or guard them strictly under middleware with role === 'admin'.

[HIGH] VULN-04: Missing Rate Limiting on Login Endpoint
- Severity: HIGH (CVSS: 7.3)
- CWE: CWE-307 (Improper Restriction of Excessive Authentication Attempts)
- Location: app/api/auth/login/route.ts
- Description: No rate limiting exists on POST /api/auth/login.
- Remediation: Add an IP-based or account-based rate limiter (e.g., sliding window via Redis or in-memory limiter).

[MEDIUM] VULN-05: Missing HSTS and Permissive CSP Directives
- Severity: MEDIUM (CVSS: 5.4)
- CWE: CWE-693 (Protection Mechanism Failure)
- Location: next.config.ts
- Description: Missing Strict-Transport-Security header; CSP contains 'unsafe-inline' and 'unsafe-eval' while missing 'object-src', 'base-uri', and 'form-action'.
- Remediation: Add HSTS header and restrict CSP directives.
```

---

## 8. Complete Security Architecture Specification (For `PROJECT_SUMMARY.md`)

Below is the definitive documentation of the Security Architecture ready to be incorporated into `PROJECT_SUMMARY.md`:

```markdown
### Security Architecture

#### 1. Threat Model & Security Perimeter
- **Client Boundary**: Browser application running Next.js 15 React Server and Client Components.
- **Edge Boundary**: Next.js Edge Middleware (`middleware.ts`) enforcing path matchers and cryptographic JWT verification before route rendering.
- **API Boundary**: Next.js App Router API Route Handlers (`app/api/auth/*`) validating request bodies, issuing HTTP-only session cookies, and handling logout.
- **External Integration Perimeter**:
  - Tokki AI Chat Backend (`https://my-server-test.vercel.app`): Whitelisted in CSP `connect-src`.
  - Google Analytics (`G-78SSBDLD14`) & Naver Analytics (`1c35b7d72227160`): Public telemetry IDs.
  - YouTube Embeds: Scoped in CSP `frame-src` to `https://www.youtube.com` and `https://www.youtube-nocookie.com`.

#### 2. Authentication & Session Architecture
- **Token Mechanism**: Stateless JSON Web Tokens (JWT) signed with HMAC-SHA256 (`HS256`) via `jose`.
- **Claims**:
  - `sub`: User ID (`string`)
  - `role`: Role identifier (`'admin' | 'user'`)
  - `exp`: 24-hour expiration (`24h`)
- **Cookie Hierarchy**:
  - `accessToken`: `HttpOnly`, `SameSite=Lax`, `Secure` (production), `Path=/`, `Max-Age=86400`. Transports the cryptographic bearer token. Inaccessible to client JavaScript to eliminate token theft via XSS.
  - `isLoggedIn`: `HttpOnly=false`, `SameSite=Lax`, `Secure` (production), `Path=/`, `Max-Age=86400`. Public Boolean indicator enabling client-side UI reactive state changes (e.g. rendering Logout button in navigation) without exposing sensitive credentials.

#### 3. Route Guard & Middleware Protection Pipeline
- **Protected Paths**: `/daily/:path*`, `/mypage/:path*`.
- **Enforcement Mechanism**:
  1. Incoming request path matched against protected prefix whitelist.
  2. Reads `accessToken` from request cookies.
  3. If missing: 307 redirects to `/login?redirect=<sanitized_target_url>`.
  4. If present: Invokes `AuthService.validateToken(accessToken)` via `jose.jwtVerify`.
  5. If valid: Request proceeds via `NextResponse.next()`.
  6. If invalid / expired / corrupted: Purges `accessToken` and `isLoggedIn` cookies, redirects to `/login`.
- **Open Redirect Defense**:
  - All post-login redirects are sanitized via `sanitizeRedirectUrl()`:
    - Strips ASCII control characters `[\x00-\x1F\x7F]` and whitespace.
    - Enforces relative path syntax: `/^\/[^\/\\\s]/` or `/`.
    - Prohibits protocol-relative (`//`), backslash bypass (`/\`), and external scheme (`https://`, `javascript:`) targets.

#### 4. HTTP Security Headers
Configured globally across all paths (`/:path*`) via `next.config.ts`:
- **Information Hiding**: `poweredByHeader: false` suppresses `X-Powered-By: Next.js`.
- **MIME Defense**: `X-Content-Type-Options: nosniff`.
- **Clickjacking Defense**: `X-Frame-Options: SAMEORIGIN`.
- **Referrer Privacy**: `Referrer-Policy: strict-origin-when-cross-origin`.
- **Hardware Privileges**: `Permissions-Policy: camera=(), microphone=(self), geolocation=()`.
- **Content Security Policy (CSP)**:
  - `default-src 'self'`
  - `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://www.googletagmanager.com https://wcs.pstatic.net https://ssl.pstatic.net`
  - `style-src 'self' 'unsafe-inline'`
  - `img-src 'self' data: https: blob:`
  - `font-src 'self' data: https:`
  - `connect-src 'self' https://my-server-test.vercel.app https://www.google-analytics.com https://wcs.naver.com`
  - `frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com`
  - `media-src 'self' blob:`
```

---

## 9. Architectural Remediation Roadmap

1. **Phase 1: Secret Key Enforcement**:
   - In `lib/token-service.ts`: Throw an error if `process.env.JWT_SECRET` is undefined rather than falling back to `'muryen-fallback-jwt-secret-key-2026'`.
   - In `app/api/auth/[...nextauth]/route.ts`: Require `process.env.NEXTAUTH_SECRET`.
2. **Phase 2: Route Hygiene & Test Route Containment**:
   - Delete or restrict `/test` and `/test2` in production builds.
   - Alternatively, add `/test/:path*` and `/test2/:path*` to `middleware.ts` matchers requiring `role: 'admin'`.
3. **Phase 3: Rate Limiting & Auth Hardening**:
   - Implement rate limiting middleware or an in-memory/Redis leaky bucket on `POST /api/auth/login` (limit to 5 attempts per minute per IP).
   - Replace hardcoded credentials in `lib/auth-service.ts` with hashed passwords in a database or secure server-side store.
4. **Phase 4: Security Headers Enhancement**:
   - Add `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` in `next.config.ts`.
   - Tighten CSP by adding `object-src 'none'`, `base-uri 'self'`, and `form-action 'self'`.
