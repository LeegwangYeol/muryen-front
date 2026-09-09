# Changes Summary — Milestone M2: Auth & Layout Hardening

## Overview
Implemented all synthesized hardening requirements for Milestone M2:
1. Added `"use client";` directive at line 1 of `app/component/video-circle.tsx`.
2. Removed redundant `md:ml-24` class from `app/component/login-page.tsx` for clean centering within `AppShell`.
3. Added explicit request validation (400 Bad Request with `{ message: "Username and password are required" }`) in `app/api/auth/login/route.ts`.
4. Updated `middleware.ts` to preserve destination path in redirect query param (`/login?redirect=${encodeURIComponent(pathname)}`) and purge cookies on unauthorized protected requests.
5. Deleted 6 unused dead legacy stubs in `app/component/` (`VideoModal.tsx`, `introduction.tsx`, `main-open.tsx`, `call-to-action.tsx`, `techniques.tsx`, `vanta-background.tsx`) after verifying 0 imports in codebase.
6. Expanded automated test suite with `__tests__/auth/middleware.test.ts` and additional adversarial test cases in `__tests__/adversarial/auth-routes.test.ts` and `__tests__/adversarial/csr-layout.test.tsx`.
7. Verified 100% pass across test suite (25 suites, 187 tests), ESLint (0 errors/warnings), and Next.js production build (24/24 static & dynamic routes compiled).

---

## File Changes Detail

### 1. `app/component/video-circle.tsx`
- **Change**: Added `"use client";` at line 1.
- **Rationale**: Strengthens component boundary contract and prevents SSR execution issues when imported directly.

### 2. `app/component/login-page.tsx`
- **Change**: Removed `md:ml-24` from line 45 className.
- **Rationale**: `AppShell` already manages main container left margin (`md:ml-64` / `md:ml-24`); eliminating redundant margin ensures precise center alignment of login card.

### 3. `app/api/auth/login/route.ts`
- **Change**: Added input validation before `AuthService.login()` check:
  ```ts
  const { username, password } = body || {};
  if (
    !username ||
    !password ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    return NextResponse.json(
      { message: "Username and password are required" },
      { status: 400 }
    );
  }
  ```
- **Rationale**: Returns explicit HTTP 400 Bad Request error payload on missing or malformed credentials instead of falling through to authentication service.

### 4. `middleware.ts`
- **Change**: Updated redirect target URLs:
  ```ts
  new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)
  ```
- **Rationale**: Preserves original destination for post-login redirection across protected `/daily` routes and subpaths.

### 5. Dead Legacy Stubs Deletion (`app/component/`)
- Deleted:
  - `app/component/VideoModal.tsx`
  - `app/component/introduction.tsx`
  - `app/component/main-open.tsx`
  - `app/component/call-to-action.tsx`
  - `app/component/techniques.tsx`
  - `app/component/vanta-background.tsx`
- **Rationale**: All 6 files were confirmed to have 0 imports across the codebase; removal prevents codebase bloat and ambiguity.

### 6. Test Suite Updates
- Created `__tests__/auth/middleware.test.ts`:
  - Validates public route passthrough (200 OK, no redirect).
  - Validates missing token redirect to `/login?redirect=%2Fdaily` (307).
  - Validates nested protected subpath redirect preservation.
  - Validates cookie deletion on invalid / expired token redirect.
  - Validates successful `/daily` access with valid verified token.
- Updated `__tests__/adversarial/auth-routes.test.ts`:
  - Added 400 Bad Request test cases for empty object, missing password, and non-string payload.
- Updated `__tests__/adversarial/csr-layout.test.tsx`:
  - Added tests for `LoginPage` layout centering without `md:ml-24` and `VideoCircle` client component rendering.
