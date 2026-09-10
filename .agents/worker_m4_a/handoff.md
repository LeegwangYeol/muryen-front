# Handoff Report: Security, Auth & Configuration Hardening (Worker M4-A)

**Worker ID**: `worker_m4_a`  
**Milestone**: M4 Security, Auth & Configuration Hardening  
**Date**: 2026-09-09  
**Status**: TASK COMPLETE (Hard Handoff)  
**Report Location**: `/Users/a7890/src/muryen-front/.agents/worker_m4_a/handoff.md`

---

## 1. Observation

Direct observations of source files, vulnerabilities, build errors, and tool executions:

### O-1: Open Redirect & Input Accessibility in `app/component/login-page.tsx`
- **File**: `app/component/login-page.tsx` (Lines 31-36, 64-99 before edit)
- **Verbatim Code**:
  ```typescript
  const params = new URLSearchParams(window.location.search);
  const redirectUrl = params.get("redirect") || "/";
  window.location.href = redirectUrl;
  ```
- **Observed Behavior**: The login form directly assigned the `redirect` query parameter to `window.location.href` without validating protocol schemes or path format. External URLs (`https://phishing.com`) or protocol-relative URLs (`//evil.com` or `/\\evil.com`) were accepted. In addition, `<Input>` fields lacked explicit `aria-label` attributes, and the `<Button type="submit">` remained clickable during in-flight fetch requests.

### O-2: Weak JWT Claims Verification & Default Secret in `lib/token-service.ts`
- **File**: `lib/token-service.ts` (Lines 4, 14-24 before edit)
- **Verbatim Code**:
  ```typescript
  const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
  ...
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
  ```
- **Observed Behavior**: `verifyToken` returned `{ id: payload.sub, role: payload.role }`. If a token contained empty claims or invalid non-string claims, JavaScript returned `{ id: undefined, role: undefined }`, which is truthy. In `middleware.ts`, `if (!user)` evaluated to `false`, allowing unauthenticated or malformed tokens to pass the route guard. Additionally, `SECRET_KEY` defaulted to `'your-secret-key'` without guarding production environments.

### O-3: Incomplete Route Protection & Unhandled Rejection in `middleware.ts`
- **File**: `middleware.ts` (Lines 8-11, 22-25 before edit)
- **Verbatim Code**:
  ```typescript
  if (!pathname.startsWith("/daily")) {
    return NextResponse.next();
  }
  ...
  const user = await AuthService.validateToken(accessToken);
  if (!user) { ... }
  ```
- **Observed Behavior**: The member dashboard `/mypage` was completely unprotected by middleware. Furthermore, `AuthService.validateToken` was called outside a `try...catch` block, risking unhandled promise rejections and HTTP 500 crashes if token parsing or cryptographic verification threw an error. Finally, no Next.js route matcher was exported, forcing middleware execution across all static chunks and assets.

### O-4: NextAuth SignIn Route Points to `/test2`
- **File**: `app/api/auth/[...nextauth]/route.ts` (Line 43 before edit)
- **Verbatim Code**:
  ```typescript
  pages: {
    signIn: "/test2",
  },
  ```
- **Observed Behavior**: NextAuth's `signIn` option directed unauthenticated users to `/test2` instead of the canonical `/login` page.

### O-5: Missing Security Headers in `next.config.ts`
- **File**: `next.config.ts` (Lines 1-8 before edit)
- **Verbatim Code**:
  ```typescript
  const nextConfig: NextConfig = {};
  ```
- **Observed Behavior**: The application did not emit standard HTTP security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`), had `reactStrictMode` unspecified, and did not disable `poweredByHeader`.

---

## 2. Logic Chain

1. **Open Redirect Remediation (`app/component/login-page.tsx`)**:
   - *From O-1*: Sanitizing the redirect URL requires ensuring the target is a valid relative path. If `url` does not start with single `/`, or starts with `//` or `/\\`, it represents an external or evasion URI scheme.
   - *Solution*: Implemented `sanitizeRedirectUrl(url: string | null): string` which returns `url` only if `url.startsWith("/") && !url.startsWith("//") && !url.startsWith("/\\")`, falling back to `"/"`.
   - *A11y & Flight*: Added `aria-label="아이디"` and `aria-label="비밀번호"` to input elements. Added `isLoading` state variable which disables inputs and submit button when in flight, preventing double submissions.

2. **Strict Runtime Claims Verification (`lib/token-service.ts`)**:
   - *From O-2*: Returning an object with `undefined` properties bypasses null checks.
   - *Solution*: Added validation that `token` is a non-empty string. Verified that `payload.sub` exists and `typeof payload.sub === 'string'`, and `payload.role === 'admin' || payload.role === 'user'`. Otherwise, `verifyToken` returns `null`.
   - *Production Secret*: Added dynamic `getSecretKey()` that checks `if (!secret && process.env.NODE_ENV === 'production') throw new Error('JWT_SECRET environment variable is missing in production');`.

3. **Route Guard & Matcher (`middleware.ts`)**:
   - *From O-3*: Protected prefixes were expanded to `["/daily", "/mypage"]`.
   - *Error Handling*: Wrapped `AuthService.validateToken` in a `try...catch` block. On any exception, the middleware catches the error, purges `accessToken` and `isLoggedIn` cookies, and redirects cleanly to `/login?redirect=...`.
   - *Matcher*: Exported `config = { matcher: ["/daily/:path*", "/mypage/:path*"] }` ensuring edge compute invokes middleware only for protected routes.

4. **Canonical NextAuth SignIn Page (`app/api/auth/[...nextauth]/route.ts`)**:
   - *From O-4*: Updated `pages.signIn` to `"/login"`.
   - *Test Adaptation*: Updated `__tests__/auth/nextauth-config.test.ts` expectation to `"/login"`.

5. **Security Headers & Optimization (`next.config.ts`)**:
   - *From O-5*: Added `headers()` async hook returning `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy: camera=(), microphone=(self), geolocation=()`.
   - Set `poweredByHeader: false` and `reactStrictMode: true`.

---

## 3. Caveats

- **Mock Auth Users**: In `lib/auth-service.ts`, test accounts (`1111` and `2222`) are hardcoded for demonstration. When migrating to an external database, password hashing (Argon2id/bcrypt) and rate limiting should be introduced.
- **Dual Session Model**: NextAuth (used for Google/YouTube OAuth in `/test2`) and the custom JWT cookie system operate independently and do not share unified session state.

---

## 4. Conclusion

All 5 assigned files have been modified cleanly according to specifications.
1. `app/component/login-page.tsx`: Open redirect vulnerability resolved with strict sanitation; input accessible labels added; submit button disabled while in flight.
2. `lib/token-service.ts`: Strict runtime claims checking enforced; truthy empty-object bypass eliminated; missing JWT secret guarded in production.
3. `middleware.ts`: Route protection extended to `/mypage`; token validation wrapped in `try/catch`; matcher configuration exported.
4. `app/api/auth/[...nextauth]/route.ts`: Canonical sign-in page set to `"/login"`.
5. `next.config.ts`: HTTP security headers configured; `poweredByHeader: false` and `reactStrictMode: true` enabled.

All tests pass (57/57 tests across 7 auth and token test suites), `npm run lint` reports 0 warnings and 0 errors, and `npm run build` compiles with 100% success.

---

## 5. Verification Method

To independently reproduce and verify all changes:

### Command 1: Run Auth & Security Jest Test Suites
```bash
npx jest __tests__/auth/ __tests__/adversarial/auth-routes.test.ts __tests__/utils/auth-service.test.ts __tests__/utils/token-service.test.ts
```
**Expected Output**:
```
Test Suites: 7 passed, 7 total
Tests:       57 passed, 57 total
Snapshots:   0 total
```

### Command 2: Run ESLint
```bash
npm run lint
```
**Expected Output**:
```
✔ No ESLint warnings or errors
```

### Command 3: Run Next.js Production Build
```bash
npm run build
```
**Expected Output**:
```
✓ Compiled successfully
✓ Generating static pages (25/25)
ƒ Middleware 40.5 kB
Exit code: 0
```

### Files to Inspect:
- `lib/token-service.ts`: Lines 4-38
- `middleware.ts`: Lines 5-47
- `app/component/login-page.tsx`: Lines 9-95
- `app/api/auth/[...nextauth]/route.ts`: Lines 42-44
- `next.config.ts`: Lines 3-32
- `__tests__/auth/login-page.test.tsx`: All
- `__tests__/auth/next-config.test.ts`: All
- `__tests__/auth/middleware.test.ts`: Lines 135-195
- `__tests__/utils/token-service.test.ts`: Lines 60-125
