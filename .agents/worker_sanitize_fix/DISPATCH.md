## 2026-09-10T15:41:46Z

You are worker_sanitize_fix.
Your working directory is /Users/a7890/src/muryen-front/.agents/worker_sanitize_fix.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATORY INPUTS (read before starting):
- /Users/a7890/src/muryen-front/.agents/ORIGINAL_REQUEST.md
- /Users/a7890/src/muryen-front/.agents/challenger_live_1/handoff.md
- /Users/a7890/src/muryen-front/app/component/login-page.tsx
- /Users/a7890/src/muryen-front/__tests__/auth/login-page.test.tsx
- /Users/a7890/src/muryen-front/__tests__/adversarial/auth-chat-stress.test.tsx

Your task — Fix Open-Redirect Control-Character Bypass:
1. Files Owned:
   - app/component/login-page.tsx
   - __tests__/auth/login-page.test.tsx
   - __tests__/adversarial/auth-chat-stress.test.tsx

2. The Defect:
   In app/component/login-page.tsx, sanitizeRedirectUrl(url):
   Currently:
   ```ts
   export function sanitizeRedirectUrl(url: string | null): string {
     if (!url) return "/";
     if (url.startsWith("/") && !url.startsWith("//") && !url.startsWith("/\\")) {
       return url;
     }
     return "/";
   }
   ```
   Challenger 1 confirmed: inputs like `/\t/evil.com`, `/\r/evil.com`, `/\n/evil.com` pass the prefix checks because `!url.startsWith("//")` is true. Under the WHATWG URL Standard § 4.3, browsers strip tabs/newlines/control characters before resolving authority, transforming `/\t/evil.com` into `//evil.com` upon `window.location.href` assignment, causing an open redirect!

3. Remediation to Apply:
   Update `sanitizeRedirectUrl` in app/component/login-page.tsx:
   ```ts
   export function sanitizeRedirectUrl(url: string | null): string {
     if (!url) return "/";
     // Strip ASCII control characters (0x00-0x1F, 0x7F) and trim whitespace
     const cleaned = url.replace(/[\x00-\x1F\x7F]/g, "").trim();
     // Must start with single '/' and not be followed by '/' or '\'
     if (/^\/[^\/\\]/.test(cleaned) || cleaned === "/") {
       return cleaned;
     }
     return "/";
   }
   ```

4. Test Updates:
   - In __tests__/auth/login-page.test.tsx, add test cases verifying that `/\t/evil.com`, `/\r/evil.com`, `/\n/evil.com`, `/\0/evil.com`, `/ /evil.com` safely return `"/"`.
   - In __tests__/adversarial/auth-chat-stress.test.tsx, update test 3.5 to verify that `sanitizeRedirectUrl` now safely prevents control character bypasses and resolves to `"/"`.

5. Verification:
   - Run `npm test` and verify 100% of test suites pass.
   - Run `npm run lint` and verify 0 errors, 0 warnings.
   - Run `npm run build` and verify clean build with 25/25 static pages.

6. Handoff:
   - Update /Users/a7890/src/muryen-front/.agents/worker_sanitize_fix/progress.md with timestamps.
   - Write your complete handoff report to /Users/a7890/src/muryen-front/.agents/worker_sanitize_fix/handoff.md.
   - When complete, call send_message to notify your parent.
