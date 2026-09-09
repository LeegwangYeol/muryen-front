# Handoff Report — Milestone M2 Adversarial Verification

**Agent**: `challenger_m2_1`  
**Handoff Type**: Hard (Verification Complete)  
**Milestone**: M2 (Auth & Layout Hardening)  
**Verdict**: **REQUEST_CHANGES**  

---

## 1. Observation

### Observation 1: Malformed JSON Payload in `app/api/auth/login/route.ts` Returns HTTP 500 instead of HTTP 400
- **File**: `app/api/auth/login/route.ts:5-20, 57-63`
- **Code**:
  ```ts
  5: export async function POST(request: Request) {
  6:   try {
  7:     const body = await request.json();
  8:     const { username, password } = body || {};
  9: 
  10:     if (
  11:       !username ||
  12:       !password ||
  13:       typeof username !== "string" ||
  14:       typeof password !== "string"
  15:     ) {
  16:       return NextResponse.json(
  17:         { message: "Username and password are required" },
  18:         { status: 400 }
  19:       );
  20:     }
  ...
  57:   } catch (error) {
  58:     console.error("Login error:", error);
  59:     return NextResponse.json(
  60:       { error: "로그인 처리 중 오류가 발생했습니다." },
  61:       { status: 500 }
  62:     );
  63:   }
  ```
- **Empirical Execution Command**:
  ```bash
  npx tsx -e "
  import { POST as loginHandler } from './app/api/auth/login/route';
  (async () => {
    const req = new Request('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{\"username\": \"admin\"' // Truncated/malformed JSON
    });
    const res = await loginHandler(req);
    console.log('Status:', res.status, 'Body:', await res.json());
  })();
  "
  ```
- **Result**:
  - `Status: 500 Body: { error: '로그인 처리 중 오류가 발생했습니다.' }`
  - In `__tests__/adversarial/auth-routes.test.ts:174-186`, the test suite explicitly expects `expect(response.status).toBe(500)` on JSON parse failure:
    ```ts
    174: it("returns 500 when JSON parsing fails", async () => {
    175:   const request = new Request("http://localhost/api/auth/login", {
    176:     method: "POST",
    177:     headers: { "Content-Type": "application/json" },
    178:     body: "invalid-json",
    179:   });
    180:
    181:   const response = await loginHandler(request);
    182:   expect(response.status).toBe(500);
    ```
  - For non-malformed payloads with missing fields, empty strings, null, numbers, or booleans (`{}`, `{ username: "" }`, `{ username: null }`, `{ username: 1234 }`, `{ username: true }`), the route correctly returns `HTTP 400 Bad Request` with body `{ message: "Username and password are required" }`.

---

### Observation 2: Query Strings Lost During Redirection in `middleware.ts`
- **File**: `middleware.ts:5-19, 24-31`
- **Code**:
  ```ts
  5: export async function middleware(request: NextRequest) {
  6:   const pathname = request.nextUrl.pathname;
  7: 
  8:   // daily 경로가 아니면 통과
  9:   if (!pathname.startsWith("/daily")) {
  10:     return NextResponse.next();
  11:   }
  12: 
  13:   const accessToken = request.cookies.get("accessToken")?.value;
  14: 
  15:   if (!accessToken) {
  16:     return NextResponse.redirect(
  17:       new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url)
  18:     );
  19:   }
  ```
- **Empirical Execution Command**:
  ```bash
  npx tsx -e "
  import { middleware } from './middleware';
  import { NextRequest } from 'next/server';
  (async () => {
    const req = new NextRequest('http://localhost:3000/daily/sub?tab=foo');
    const res = await middleware(req);
    console.log('Redirect Location:', res.headers.get('location'));
  })();
  "
  ```
- **Result**:
  - `Redirect Location: http://localhost:3000/login?redirect=%2Fdaily%2Fsub`
  - The query parameter `?tab=foo` was stripped.
  - Tested across paths:
    - `http://localhost:3000/daily/sub?tab=foo` -> redirects to `/login?redirect=%2Fdaily%2Fsub` (Query `?tab=foo` lost)
    - `http://localhost:3000/daily/records?page=2&filter=recent` -> redirects to `/login?redirect=%2Fdaily%2Frecords` (Query `?page=2&filter=recent` lost)
    - `http://localhost:3000/daily/sparring?category=sword&round=1` -> redirects to `/login?redirect=%2Fdaily%2Fsparring` (Query `?category=sword&round=1` lost)

---

### Observation 3: Build, Lint, and Baseline Tests Pass Cleanly
- **`npm test -- --ci`**:
  - `Test Suites: 25 passed, 25 total`
  - `Tests: 187 passed, 187 total`
  - `Snapshots: 0 total`
  - `Time: 6.628 s`
- **`npm run lint`**:
  - `✔ No ESLint warnings or errors`
- **`npm run build`**:
  - Exit code 0
  - 24/24 static and dynamic routes compiled successfully.

---

## 2. Logic Chain

1. **Requirement 1 Assessment (Malformed JSON Handling)**:
   - The user mission specifies: *"1. Subject `app/api/auth/login/route.ts` to missing fields, empty strings, null, numbers, booleans, and malformed JSON payloads. Verify 400 Bad Request is returned."*
   - As observed in Observation 1, `await request.json()` fails with a `SyntaxError` when receiving malformed JSON (e.g. `invalid-json`, `{"username":` or empty string `""`).
   - Because `await request.json()` is inside the top-level `try` block and has no dedicated JSON parse error handling, the thrown `SyntaxError` enters `catch (error)`, returning HTTP 500 Internal Server Error (`route.ts:61`).
   - In RFC 9110 / RFC 7231, client syntax errors are 4xx client errors (specifically 400 Bad Request), not 500 server internal errors.
   - Therefore, Requirement 1 is NOT fully satisfied.

2. **Requirement 2 Assessment (Query String and Special Character Preservation)**:
   - The user mission specifies: *"2. Verify `middleware.ts` redirect preserves paths with special characters or query strings (`/daily/sub?tab=foo`)."*
   - As observed in Observation 2, `middleware.ts` constructs the redirect target using only `pathname` (`request.nextUrl.pathname`), ignoring `request.nextUrl.search`.
   - When unauthorized users access `/daily/sub?tab=foo` or `/daily/records?page=2`, the query parameters are dropped upon redirect. After logging in, the user lands on `/daily/sub` without their intended tab or filter state.
   - Preserving full destination context requires incorporating `request.nextUrl.search` (e.g., `const target = request.nextUrl.pathname + request.nextUrl.search;` and `new URL('/login?redirect=${encodeURIComponent(target)}', request.url)`).
   - Therefore, Requirement 2 is NOT fully satisfied.

---

## 3. Caveats

1. **Open Redirect Sanitization in `app/component/login-page.tsx`**:
   - `login-page.tsx:33-36` reads `redirectUrl = params.get("redirect") || "/"` and sets `window.location.href = redirectUrl`.
   - While not strictly in the M2 dispatch criteria, external URLs (e.g. `?redirect=https://attacker.com` or `//attacker.com`) could cause an unvalidated open redirect if passed directly. Validating that `redirectUrl` begins with a single `/` and not `//` or a protocol scheme would enhance security.
2. **Mock Credential Environment**:
   - `lib/auth-service.ts` uses static demonstration credentials (`1111/1111`, `2222/2222`). This is expected for frontend mock mode and does not affect the route contract.

---

## 4. Conclusion

**Verdict: REQUEST_CHANGES**

The M2 implementation successfully hardened client-side layout boundaries and basic field validation, passing all existing tests and builds. However, two critical adversarial requirements require correction:

1. **`app/api/auth/login/route.ts`**:
   - Handle JSON parsing errors (or `request.json().catch(...)`) gracefully to return **HTTP 400 Bad Request** (`{ message: "Invalid JSON or payload format" }` or `{ message: "Username and password are required" }`) instead of **HTTP 500 Internal Server Error**.
   - Update `__tests__/adversarial/auth-routes.test.ts:174-186` to expect status `400` instead of `500` on invalid JSON.
2. **`middleware.ts`**:
   - Include `request.nextUrl.search` in the redirect parameter (e.g., `const target = request.nextUrl.pathname + request.nextUrl.search;`) so that query strings like `?tab=foo` are preserved during `/login` redirection.
   - Add unit test coverage in `__tests__/auth/middleware.test.ts` for paths containing query strings (`/daily/sub?tab=foo`).

---

## 5. Verification Method

To independently reproduce and verify these findings:

1. **Verify Malformed JSON Status Code**:
   ```bash
   npx tsx -e "
   import { POST } from './app/api/auth/login/route';
   (async () => {
     const req = new Request('http://localhost:3000/api/auth/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: 'not-valid-json'
     });
     const res = await POST(req);
     console.log('Status (expected 400, got):', res.status);
   })();
   "
   ```
   *Actual Result*: Returns `500`.

2. **Verify Query String Stripping in Middleware**:
   ```bash
   npx tsx -e "
   import { middleware } from './middleware';
   import { NextRequest } from 'next/server';
   (async () => {
     const req = new NextRequest('http://localhost:3000/daily/sub?tab=foo');
     const res = await middleware(req);
     console.log('Location (expected /login?redirect=%2Fdaily%2Fsub%3Ftab%3Dfoo):', res.headers.get('location'));
   })();
   "
   ```
   *Actual Result*: Returns `http://localhost:3000/login?redirect=%2Fdaily%2Fsub` (lacks `%3Ftab%3Dfoo`).

3. **Verify Baseline Suites**:
   ```bash
   npm test -- --ci
   npm run lint
   npm run build
   ```
