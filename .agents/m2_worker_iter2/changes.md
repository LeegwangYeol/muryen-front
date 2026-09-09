# Changes Summary — Milestone M2 Iteration 2

## Modified Files

### 1. `app/api/auth/login/route.ts`
- **Rationale**: RFC 9110 / RFC 7231 client syntax errors should return HTTP 400 Bad Request instead of unhandled HTTP 500 Internal Server Error.
- **Changes**:
  - Wrapped `await request.json()` in a dedicated `try/catch` block before field validation.
  - If JSON parsing fails (e.g. malformed JSON body or invalid syntax), returns `NextResponse.json({ message: "Invalid JSON or request body" }, { status: 400 })`.

### 2. `__tests__/adversarial/auth-routes.test.ts`
- **Rationale**: Update test assertion to verify the hardened 400 Bad Request behavior on malformed JSON payloads.
- **Changes**:
  - Updated test `returns 400 when JSON parsing fails` to assert `expect(response.status).toBe(400)` and `expect(json.message).toBe("Invalid JSON or request body")`.

### 3. `middleware.ts`
- **Rationale**: Ensure user destination state (e.g. tab selections, filters, query parameters) is not lost when redirected to `/login`.
- **Changes**:
  - Computed `targetUrl = request.nextUrl.pathname + request.nextUrl.search`.
  - Constructed redirect URL with `new URL('/login?redirect=' + encodeURIComponent(targetUrl), request.url)` for both unauthenticated and invalid/expired session branches.

### 4. `__tests__/auth/middleware.test.ts`
- **Rationale**: Provide regression coverage for query parameters preservation in middleware redirects.
- **Changes**:
  - Added test case `preserves query parameters in redirect query parameter when unauthenticated` (`/daily?tab=schedule` -> `/login?redirect=%2Fdaily%3Ftab%3Dschedule`).
  - Added test case `preserves complex nested subpaths and multiple query parameters` (`/daily/sub?tab=foo&filter=recent` -> `/login?redirect=%2Fdaily%2Fsub%3Ftab%3Dfoo%26filter%3Drecent`).
  - Added test case `redirects with query params preserved when accessToken is invalid or expired` (`/daily/sparring?tab=schedule&page=1`).

## Verification Results
- `npm test -- --ci`: 26 test suites passed, 201 tests passed (100%).
- `npm run lint`: Clean (0 errors, 0 warnings).
- `npm run build`: Exit code 0, 24/24 static routes generated cleanly.
