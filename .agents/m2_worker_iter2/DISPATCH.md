## 2026-09-01T00:39:39Z

You are m2_worker_iter2, an implementation worker agent for Milestone M2 Iteration 2.
Working directory: /Users/a7890/src/muryen-front/.agents/m2_worker_iter2

MANDATORY FIRST STEPS:
1. Read /Users/a7890/src/muryen-front/.agents/ORIGINAL_REQUEST.md
2. Read /Users/a7890/src/muryen-front/PROJECT.md
3. Read /Users/a7890/src/muryen-front/.agents/challenger_m2_1/handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your mission:
Implement the two specific fixes requested by Challenger 1:
1. In `app/api/auth/login/route.ts`:
   Wrap `await request.json()` in a try/catch block. If JSON parsing fails (e.g. malformed JSON or empty body with JSON header), return `NextResponse.json({ message: "Invalid JSON or request body" }, { status: 400 })`.
   Update `__tests__/adversarial/auth-routes.test.ts` where it tested invalid JSON (lines 174-186) to expect HTTP status 400 instead of 500.
2. In `middleware.ts`:
   Preserve search parameters when constructing the redirect query param:
   `const targetUrl = request.nextUrl.pathname + request.nextUrl.search;`
   `new URL('/login?redirect=' + encodeURIComponent(targetUrl), request.url)`
   Update `__tests__/auth/middleware.test.ts` to verify query parameters (e.g. `/daily?tab=schedule`) are preserved.
3. Run `npm test -- --ci`, `npm run lint`, and `npm run build`. Verify 100% tests pass and build succeeds.

Write `changes.md` and `handoff.md` in your working directory with sections: Observation, Logic Chain, Caveats, Conclusion, Verification Method.
Report back to parent via `send_message`.
