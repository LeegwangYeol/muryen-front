# Empirical Security & Accessibility Challenge Report

**Date**: 2026-09-30  
**Agent Identity**: `swarm_challenger_2`  
**Archetype**: EMPIRICAL CHALLENGER (Roles: critic, specialist)  
**Target Repository**: `muryen-front` (`/Users/a7890/src/muryen-front`)  
**Objective Verdict**: **APPROVE** (with non-blocking architectural advisories)

---

## 1. Executive Summary

This empirical review rigorously challenged four core domains of the `muryen-front` application:
1. **HTTP Security Headers** (`next.config.ts`): HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
2. **Open Redirect Boundary Protection** (`app/component/login-page.tsx`): Boundary fuzzing across protocol-relative, backslash evasion, script pseudo-schemes, URL encoding, and whitespace/control-character bypasses.
3. **Keyboard & Event Listener Behaviors** (`app/component/navigation.tsx`): Global `Escape` key event listener behavior, lifecycle cleanup, and collision with other overlays.
4. **Accessible Modals** (`app/component/video-circle.tsx`): ARIA attributes (`aria-label="닫기"`, `role="dialog"`, `aria-modal="true"`, `aria-labelledby`), keyboard activation, and backdrop click handlers.

All test suites were executed empirically. A dedicated adversarial challenge suite (`__tests__/adversarial/m4-security-a11y-challenger.test.tsx`) comprising 22 adversarial assertions was created and verified (100% passing). Additionally, the full project test suite (31 suites, 269 tests), linting (0 errors, 0 warnings), and production build (25/25 static pages) were executed and validated.

---

## 2. Empirical Challenge Matrix & Test Results

| Challenge Target | Scope / Attack Vector | Empirical Test Method | Result | Risk Level |
| :--- | :--- | :--- | :--- | :--- |
| **HSTS Header** | RFC 6797 compliance, max-age >= 31536000, preload, subdomains | Jest inspection on `nextConfig.headers()` | **PASS** (`max-age=63072000; includeSubDomains; preload`) | NONE |
| **X-Content-Type-Options** | MIME-type sniffing defense | Strict exact-match assertion | **PASS** (`nosniff`) | NONE |
| **X-Frame-Options** | Clickjacking defense | Strict match (`SAMEORIGIN` / `DENY`) | **PASS** (`SAMEORIGIN`) | NONE |
| **Content-Security-Policy** | Directive syntax, script whitelist, frame restrictions | W3C CSP directive breakdown & parsing | **PASS** (syntactically valid, YouTube whitelisted) | LOW (Trade-off: `'unsafe-inline'`) |
| **Open Redirect: `//evil.com`** | Protocol-relative domain evasion | `sanitizeRedirectUrl("//evil.com")` | **PASS** (returns `"/"`) | NONE |
| **Open Redirect: `/\\evil.com`** | Backslash evasion | `sanitizeRedirectUrl("/\\evil.com")` | **PASS** (returns `"/"`) | NONE |
| **Open Redirect: `javascript:`** | Script execution scheme | `sanitizeRedirectUrl("javascript:alert(1)")` | **PASS** (returns `"/"`) | NONE |
| **Open Redirect: `https:`** | Absolute external URL | `sanitizeRedirectUrl("https://attacker.com")` | **PASS** (returns `"/"`) | NONE |
| **Open Redirect: Empty input** | Empty string / null / undefined / whitespace | `sanitizeRedirectUrl("")`, `sanitizeRedirectUrl(null)` | **PASS** (returns `"/"`) | NONE |
| **Open Redirect: `/daily`** | Legitimate internal relative route | `sanitizeRedirectUrl("/daily")` | **PASS** (returns `"/daily"`) | NONE |
| **Open Redirect: Advanced Fuzzing** | `///`, `/\t/`, `/\r\n/`, `/\0/`, UNC paths | Fuzzing against multi-slash, control chars, UNC | **PASS** (all neutralized to `"/"`) | NONE |
| **Navigation Escape Listener** | Escape key collapse & unmount cleanup | DOM `dispatchEvent` on window | **PASS** (collapses from `w-64` to `w-24`, removes listener) | NONE |
| **Modal Close `aria-label`** | Modal accessibility, close button, dialog semantics | React Testing Library queries & ARIA checks | **PASS** (`aria-label="닫기"`, `role="dialog"`, `aria-modal="true"`) | NONE |
| **Escape Collision (Adversarial)** | Multi-component Escape key conflict | Simultaneous mount of Navigation + VideoCircle | **FINDING** (Closing modal also collapses nav) | LOW (UX Advisory) |

---

## 3. Deep-Dive Findings & Attack Surface Analysis

### 3.1 HTTP Security Headers (`next.config.ts`)
- **Strict-Transport-Security**: Configured as `max-age=63072000; includeSubDomains; preload`. Delta seconds equal 2 years (63,072,000s), comfortably exceeding Chrome HSTS Preload submission threshold of 1 year (31,536,000s).
- **X-Content-Type-Options**: Set to `nosniff`, blocking MIME-confusion attacks.
- **X-Frame-Options**: Set to `SAMEORIGIN`, preventing framing by untrusted origins.
- **Content-Security-Policy (CSP)**:
  - Format: Syntactically valid semicolon-delimited directive string.
  - Whitelist: Properly includes YouTube (`https://www.youtube.com`, `https://www.youtube-nocookie.com`), Google Tag Manager, Naver Analytics, and backend API origin (`https://my-server-test.vercel.app`).
  - *Trade-off / Attack Surface*: `script-src` includes `'unsafe-inline'` and `'unsafe-eval'`. This is a common requirement in Next.js development and analytics setups without middleware nonces.
  - *Mitigation recommendation*: If stricter CSP Level 3 is desired in future releases, generate dynamic nonces in `middleware.ts` to retire `'unsafe-inline'`.

### 3.2 Open Redirect Protection (`app/component/login-page.tsx`)
The `sanitizeRedirectUrl` implementation:
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
**Empirical Stress-Test Analysis**:
- The regex `/^\/[^\/\\\s]/` strictly demands that character 0 is `/` and character 1 is neither `/`, `\`, nor any whitespace character `\s`.
- JavaScript regex `\s` covers all ASCII and Unicode whitespace (including `\u00A0` NBSP, `\u3000` Ideographic space, tabs, newlines).
- ASCII control character stripping (`[\x00-\x1F\x7F]`) neutralizes null-bytes (`\0`) and CRLF attacks before regex evaluation.
- Relative internal URLs (e.g. `/daily`, `/mypage?tab=records`, `/basic-sense/detail/123`) correctly pass through.
- Absolute URLs (`https://`, `ftp://`), protocol-relative (`//`), backslash variations (`/\`, `\\`), and script pseudo-schemes (`javascript:`, `data:`, `vbscript:`) are neutralized to `/`.

### 3.3 Navigation & Overlay Keyboard Interaction
1. **Desktop Navigation (`app/component/navigation.tsx`)**:
   - Correctly registers `keydown` listener for `"Escape"` when expanded (`isExpanded`).
   - Calling `handleExpand(false)` updates sidebar width from `w-64` to `w-24`.
   - Event listener is cleanly removed on component unmount (`window.removeEventListener("keydown", handleKeyDown)`).
2. **Global Escape Collision (Architectural Observation)**:
   - When a user opens a modal dialog (e.g. `VideoCircle`) and presses `Escape`, both `VideoCircle` and `Navigation` receive the event on `window`. Consequently, closing the modal dialog simultaneously collapses the desktop sidebar navigation.
   - *Advisory*: Check `e.defaultPrevented` in `Navigation` or stop propagation in the modal dialog keydown handler so Escape only closes the top-most overlay.
3. **Mobile Drawer (`components/layout/mobile-nav.tsx`)**:
   - `Navigation` is hidden on mobile screens via `hidden md:block` (though still mounted in React).
   - The dedicated mobile drawer component (`MobileNav`) opens via hamburger menu but does not currently implement an `Escape` key listener to dismiss the drawer.
   - *Advisory*: Add `useEffect` on `isOpen` in `mobile-nav.tsx` to handle `Escape` for mobile keyboard and assistive technology users.

### 3.4 Modal Accessibility (`app/component/video-circle.tsx`)
- Trigger buttons have explicit `role="button"`, `tabIndex={0}`, descriptive `aria-label="${video.title} 상세 보기"`, and support keyboard activation via `Enter` and `Space`.
- Modal dialog container provides `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="circle-modal-title"`.
- Close button possesses explicit `aria-label="닫기"` and visible text `"닫기"`, fulfilling WCAG 2.5.3 (Label in Name).
- Dismissal is supported via Close button, Escape key, and backdrop click with `e.stopPropagation()` on dialog content.

---

## 4. Verification Commands & Outputs

### 4.1 Targeted Adversarial Challenge Test
```bash
npx jest __tests__/adversarial/m4-security-a11y-challenger.test.tsx
```
**Output**:
```
PASS __tests__/adversarial/m4-security-a11y-challenger.test.tsx
  Empirical Challenge Suite: Security Boundaries & Accessibility Behaviors
    Challenge 1: HTTP Security Headers (next.config.ts)
      ✓ verifies poweredByHeader is explicitly disabled
      ✓ verifies Strict-Transport-Security (HSTS) format and parameters
      ✓ verifies X-Content-Type-Options is exactly nosniff
      ✓ verifies X-Frame-Options is SAMEORIGIN or DENY for clickjacking defense
      ✓ verifies Referrer-Policy enforces strict origin on cross-origin requests
      ✓ verifies Permissions-Policy restricts sensitive hardware APIs
      ✓ verifies Content-Security-Policy (CSP) syntax, directives, and restrictions
    Challenge 2: Open Redirect Boundary Attacks (app/component/login-page.tsx)
      ✓ neutralizes standard adversarial inputs required by challenge specification
      ✓ neutralizes null, undefined, whitespace-only, and blank inputs
      ✓ neutralizes scheme variations and dangerous protocols
      ✓ neutralizes multi-slash, backslash-slash, and CRLF / null-byte bypasses
      ✓ neutralizes Windows UNC and network share evasion patterns
      ✓ allows complex valid internal application routes and query strings
    Challenge 3: Mobile & Desktop Navigation Escape Key Listener (app/component/navigation.tsx)
      ✓ collapses expanded sidebar when Escape key is pressed
      ✓ does not trigger extra onExpand calls when Escape is pressed while already collapsed
      ✓ ignores non-Escape keys (Enter, Space, Tab, ArrowDown)
      ✓ cleans up keydown event listener upon unmount to prevent memory leaks
    Challenge 4: VideoCircle Modal Close & A11y Verification (app/component/video-circle.tsx)
      ✓ verifies modal close button has aria-label='닫기' and visible text '닫기'
      ✓ verifies modal closes when Escape key is pressed
      ✓ verifies backdrop click closes modal but inner dialog click does not propagate
      ✓ verifies keyboard activation of circular thumbnail items (Enter / Space)
    Challenge 5: Global Escape Key Collision & MobileNav Findings
      ✓ empirically demonstrates global Escape collision between modal and Navigation

Test Suites: 1 passed, 1 total
Tests:       22 passed, 22 total
```

### 4.2 Auth & Navigation Test Suites
```bash
npx jest __tests__/auth
```
**Output**:
```
PASS __tests__/auth/middleware.test.ts
PASS __tests__/auth/nextauth-config.test.ts
PASS __tests__/auth/next-config.test.ts
PASS __tests__/auth/login-page.test.tsx
Test Suites: 4 passed, 4 total
Tests:       31 passed, 31 total
```

```bash
npx jest __tests__/components/navigation.test.tsx
```
**Output**:
```
PASS __tests__/components/navigation.test.tsx
Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
```

### 4.3 Full Repository Test Suite
```bash
npm test
```
**Output**:
```
Test Suites: 31 passed, 31 total
Tests:       269 passed, 269 total
Snapshots:   0 total
Time:        7.631 s
```

### 4.4 Linter & Build Verification
```bash
npm run lint
```
**Output**: `✔ No ESLint warnings or errors`

```bash
npm run build
```
**Output**: `✓ Compiled successfully in 3.3s`, `✓ Generating static pages (25/25)`, Exit code 0.

---

## 5. Final Objective Verdict

**Verdict**: **APPROVE**

**Justification**:
1. All required HTTP security headers (HSTS, CSP, XFO, XCTO) are strictly defined and active.
2. The open redirect protection in `login-page.tsx` resisted all adversarial bypass attempts, including protocol-relative, backslash evasions, control characters, and Unicode whitespace attacks.
3. Desktop navigation Escape key collapsing and VideoCircle modal accessibility (`aria-label="닫기"`, dialog roles, Enter/Space/Escape keyboard navigation) function as designed.
4. All existing and newly generated tests pass with 100% success rate (269 tests across 31 suites).
5. Build and linter pass with 0 errors and 0 warnings.
