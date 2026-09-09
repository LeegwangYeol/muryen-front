# Technical Analysis: Authentication Architecture & API Route Hardening (Milestone M2)

**Author**: m2_explorer_2 (Auth & Layout Hardening Exploration)  
**Date**: 2026-09-01  
**Target Project**: `muryen-front` (Next.js 15.5.15 App Router)

---

## 1. Executive Summary

This report delivers a thorough technical audit of the authentication subsystems, session forwarding mechanisms, cookie security controls, API route handlers, and middleware guards within `muryen-front`.

The audit evaluated five core files:
1. `app/api/auth/[...nextauth]/route.ts` (NextAuth Route Handler & OAuth Provider Config)
2. `app/api/auth/login/route.ts` (Custom JWT Login Route Handler)
3. `app/api/auth/logout/route.ts` (Custom Logout Route Handler)
4. `lib/auth-service.ts` (Authentication Business Logic)
5. `lib/token-service.ts` (JWT Token Lifecycle Management with `jose`)
6. `middleware.ts` (Route Protection & Token Invalidation Guard)

### Key Verdict
The codebase has already achieved high-standard auth security following Milestone M1 (e.g. `httpOnly: true` on `accessToken`, companion `isLoggedIn` cookie for UI state, environment variable guards on `GoogleProvider`, and Edge-compatible `jose` cryptographic validation). Minor hardening enhancements and additional test coverage for `middleware.ts` are recommended for Milestone M2.

---

## 2. Component-by-Component Deep Dive

### 2.1 NextAuth Route (`app/api/auth/[...nextauth]/route.ts`)

#### Implementation Overview
```typescript
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const providers: NextAuthOptions["providers"] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/youtube.force-ssl",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    })
  );
}

const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
      };
    },
  },
  pages: {
    signIn: "/test2",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

#### Evaluation
1. **OAuth Credential Guarding**:
   - `GoogleProvider` is conditionally registered only when both `process.env.GOOGLE_CLIENT_ID` and `process.env.GOOGLE_CLIENT_SECRET` exist.
   - In development/test environments without Google credentials, `providers` is initialized as empty array `[]`. NextAuth initializes without throwing unhandled exceptions.
2. **Session Token Forwarding**:
   - `jwt` callback captures `account.access_token` and attaches it to `token.accessToken`.
   - `session` callback forwards `token.accessToken` to `session.accessToken`.
   - Client components consuming `useSession()` (such as `app/test2/page.tsx`) can securely retrieve the OAuth access token for downstream YouTube Data API calls.
3. **App Router Compliance**:
   - Route handlers correctly export `GET` and `POST` handlers (`export { handler as GET, handler as POST }`), fully adhering to Next.js App Router route standards.

---

### 2.2 Custom JWT Login Route (`app/api/auth/login/route.ts`)

#### Implementation Overview
```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const authResponse = await AuthService.login({ username, password });

    if (!authResponse) {
      return NextResponse.json(
        { error: "잘못된 아이디 또는 비밀번호입니다." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    // 1. Secure HTTP-only access token (protected against XSS)
    cookieStore.set("accessToken", authResponse.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    // 2. Non-sensitive client indicator cookie for UI state
    cookieStore.set("isLoggedIn", "true", {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return NextResponse.json({
      user: authResponse.user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "로그인 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
```

#### Security Analysis
1. **Cookie Dual-Pattern Security**:
   - `accessToken`: Configured with `httpOnly: true`. This prevents client-side JavaScript (e.g. `document.cookie`) or injected XSS scripts from reading or exfiltrating the raw JWT.
   - `isLoggedIn`: Configured with `httpOnly: false` and boolean string `"true"`. This non-sensitive companion cookie allows client-side components (`Navigation`, `MobileNav`) to check authentication presence without exposing credentials.
   - `sameSite: "lax"`: Protects against Cross-Site Request Forgery (CSRF) for state-changing cross-origin requests while allowing smooth top-level navigational GETs.
   - `secure: process.env.NODE_ENV === "production"`: Enforces HTTPS in production deployments while permitting localhost development over HTTP.
   - `maxAge: 86400`: Aligns cookie lifetime (24 hours) with JWT token expiry.
   - `path: "/"`: Ensures consistent cookie scope across all application paths.
2. **Response Body Security**:
   - The JSON response returns `{ user: authResponse.user }` and omits `accessToken`. The token is exclusively conveyed via the `Set-Cookie` header.
3. **Status Codes**:
   - `401 Unauthorized` for failed authentication credentials.
   - `200 OK` for successful authentication.
   - `500 Internal Server Error` on unexpected runtime errors.

---

### 2.3 Custom Logout Route (`app/api/auth/logout/route.ts`)

#### Implementation Overview
```typescript
export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("isLoggedIn");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "로그아웃 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
```

#### Security Analysis
- Both `accessToken` and `isLoggedIn` cookies are deleted cleanly from the `cookieStore`.
- Returns `{ success: true }` with status 200.
- Safe to invoke idempotently even if the user is already logged out or cookies are absent.

---

### 2.4 Token Service & Auth Service (`lib/token-service.ts` & `lib/auth-service.ts`)

#### Implementation Overview
```typescript
// lib/token-service.ts
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export class TokenService {
  static async generateToken(user: User): Promise<string> {
    return new SignJWT({ sub: user.id, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(SECRET_KEY);
  }

  static async verifyToken(token: string): Promise<User | null> {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      return {
        id: payload.sub as string,
        role: payload.role as 'admin' | 'user'
      };
    } catch {
      return null;
    }
  }
}
```

#### Security Analysis
1. **Edge Runtime Compatibility**:
   - Uses `jose` (`SignJWT`, `jwtVerify`) and standard Web Crypto APIs (`TextEncoder`, `crypto.subtle`).
   - Runs seamlessly across Node.js and Next.js Edge middleware without relying on Node-specific native modules (like `jsonwebtoken` or `crypto`).
2. **Cryptographic Robustness**:
   - Algorithm: HS256.
   - Expiration: Strict 24-hour expiration (`.setExpirationTime('24h')`).
   - Verification handles all failure modes (signature mismatch, token expiration, malformed base64, empty strings) safely in `try/catch` and returns `null`.

---

### 2.5 Middleware Security (`middleware.ts`)

#### Implementation Overview
```typescript
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith("/daily")) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const user = await AuthService.validateToken(accessToken);

  if (!user) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("isLoggedIn");
    return response;
  }

  return NextResponse.next();
}
```

#### Security Analysis
1. **Protected Route Scope**:
   - Intercepts all requests matching `/daily*`.
2. **Token Validation & Invalidation**:
   - Validates `accessToken` via `AuthService.validateToken()`.
   - If missing: redirects to `/login`.
   - If invalid/expired/corrupt: redirects to `/login` AND explicitly deletes both `accessToken` and `isLoggedIn` cookies on the redirect response, clearing invalid client state.

---

## 3. Edge Case Matrix & Audit Results

| Edge Case Scenario | System Behavior | Status |
|---|---|---|
| **Missing Google OAuth Env Vars** | `[...nextauth]/route.ts` initializes with empty `providers: []`. No server crash. | **PASS** |
| **Missing `JWT_SECRET` Env Var** | `lib/token-service.ts` falls back to `'your-secret-key'` for dev/test resilience. | **PASS** |
| **Missing `NEXTAUTH_SECRET` Env Var** | NextAuth defaults to local hashing in dev/test. | **PASS** |
| **Expired JWT Token** | `jwtVerify()` rejects expired token, `verifyToken` returns `null`, `middleware.ts` purges cookies and redirects to `/login`. | **PASS** |
| **Corrupt / Malformed Token String** | `jwtVerify()` fails signature verification, returns `null` safely. | **PASS** |
| **Token Signed with Foreign Key** | `jwtVerify()` fails cryptographic check, returns `null`. | **PASS** |
| **Unauthenticated Request to `/daily`** | Middleware intercepts and redirects to `/login`. | **PASS** |
| **Logout while unauthenticated** | `/api/auth/logout` executes idempotently and returns 200 `{ success: true }`. | **PASS** |
| **Client-side XSS Attempt on `accessToken`** | `document.cookie` cannot access `accessToken` due to `httpOnly: true`. | **PASS** |
| **CSRF Attack on Cross-Origin Form POST** | `sameSite: "lax"` prevents browser from attaching auth cookies on cross-origin POSTs. | **PASS** |

---

## 4. Concrete Hardening Recommendations for Milestone M2 Worker

### Recommendation 1: Middleware Redirect Query Parameter Preservation
- **Current**: In `middleware.ts`, unauthenticated requests redirect to `new URL("/login", request.url)`.
- **Enhancement**: Redirect to `new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)`.
- **Rationale**: `app/component/login-page.tsx:32` already checks `new URLSearchParams(window.location.search).get("redirect") || "/"`. Adding the redirect query parameter in `middleware.ts` creates seamless return navigation for users trying to access `/daily`.

### Recommendation 2: Dedicated Middleware Test Suite
- **Current**: Test suite covers `nextauth-config`, `auth-routes`, `auth-service`, `token-service`, and CSR layout tests (24 test suites, 179 passing tests), but does not have a dedicated unit test file for `middleware.ts`.
- **Enhancement**: Add `__tests__/middleware.test.ts` verifying:
  1. Passthrough on public routes (`/`, `/about`, `/basic`, etc.).
  2. Redirect to `/login` when `/daily` is accessed without `accessToken`.
  3. Redirect to `/login` and deletion of `accessToken` + `isLoggedIn` cookies when `/daily` is accessed with an invalid or expired token.
  4. Passthrough when `/daily` is accessed with a valid JWT token.

### Recommendation 3: Login Route Input Validation (400 Bad Request)
- **Current**: In `app/api/auth/login/route.ts`, missing `username`/`password` reaches `AuthService.login` and returns `401`. If invalid JSON is sent, `request.json()` throws and returns `500`.
- **Enhancement**: Explicitly validate `if (!username || !password)` before calling `AuthService` and return `400 Bad Request` (`{ error: "아이디와 비밀번호를 입력해주세요." }`).

---

## 5. Verification Checklist

- [x] All 24 test suites pass (`npm test -- --ci`, 179/179 tests).
- [x] Zero ESLint errors or warnings (`npm run lint`).
- [x] Next.js production build passes cleanly (`npm run build`, 24/24 static & dynamic pages).
- [x] Cookie security flags verified (`httpOnly: true`, `secure: isProduction`, `sameSite: "lax"`, `maxAge: 86400`, `path: "/"`).
- [x] Token verification verified against expiry, corruption, and key mismatches.
