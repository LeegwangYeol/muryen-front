## 2026-09-01T00:14:53Z

You are a Worker for Milestone M1 (UI Error & Layout Cleanup) in the muryen-front debugging sweep project.
Your working directory is: /Users/a7890/src/muryen-front/.agents/worker_m1

MANDATORY FIRST STEP: Read the original user request at /Users/a7890/src/muryen-front/.agents/ORIGINAL_REQUEST.md
Also read /Users/a7890/src/muryen-front/PROJECT.md and the survey reports at /Users/a7890/src/muryen-front/.agents/explorer_survey_1/handoff.md and /Users/a7890/src/muryen-front/.agents/explorer_survey_2/handoff.md.

YOUR TASKS:
1. In `app/layout.tsx`: Remove the third-party LLAMI AI chat widget stylesheet link (`https://static.llami.net/widget-v1.css`) and script (`https://static.llami.net/widget-v1.js` with `id="llami-chat-widget"`).
2. Clean up or remove the orphaned `app/component/llami-chat-widget.tsx` (ensure no broken imports exist).
3. In `app/component/navigation.tsx` (and `components/layout/navigation.tsx` if referenced): Clean up the bottom container (`absolute bottom-4 left-4 right-4`), removing the dead `<VideoModal>` dynamic component and unused `isVideoModalOpen` state.
4. In `app/api/auth/[...nextauth]/route.ts`: Conditionally include `GoogleProvider` only when `process.env.GOOGLE_CLIENT_ID` and `process.env.GOOGLE_CLIENT_SECRET` are defined.
5. In `__tests__/`: Update or add unit tests for Navigation, AppLayout, or components as needed to ensure complete verification.
6. Verify your implementation by running:
   - `npm test -- --ci`
   - `npm run lint`
   - `npm run build`
   Ensure all tests pass with 0 errors and 0 warnings.

FILE WRITE OWNERSHIP:
You have exclusive write ownership of:
- `app/layout.tsx`
- `app/component/llami-chat-widget.tsx`
- `app/component/navigation.tsx`
- `components/layout/navigation.tsx`
- `app/api/auth/[...nextauth]/route.ts`
- `__tests__/components/navigation.test.tsx` (and any new test files under `__tests__/`)
