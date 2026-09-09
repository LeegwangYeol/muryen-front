## 2026-08-27T16:42:12Z

You are M1 Explorer 2 (teamwork_preview_explorer).
Your working directory is: /Users/a7890/src/muryen-front/.agents/m1_explorer_2
The original user request is at: /Users/a7890/src/muryen-front/.agents/ORIGINAL_REQUEST.md
The project scope is at: /Users/a7890/src/muryen-front/PROJECT.md
The project root is: /Users/a7890/src/muryen-front

Mission:
Develop the exact, line-by-line implementation plan for Milestone 1 Part B:
1. Fix 404 broken image paths in `app/component/equipment.tsx`: Map equipment items to existing images in `public/images/` or fallback gracefully without 404s.
2. Fix double-extension filename in `public/images/foot/` (`muye24ki_core_18_woldo.gif.gif`).
3. Fix layout margin alignment between `app/component/navigation.tsx` and `components/layout/app-shell.tsx` (ensure expanded/collapsed widths match main margin perfectly).
4. Fix animation frame & audio stream memory leaks in `app/component/video-circle.tsx` (cancel rAF on unmount, fix progress calculation) and `components/ai/vad-analyzer.tsx` (proper audio stream & context teardown).
5. Secure auth cookies in `app/api/auth/login/route.ts` (`httpOnly: true`, `secure: process.env.NODE_ENV === "production"`, `sameSite: "lax"`).

Output:
Write your detailed plan to /Users/a7890/src/muryen-front/.agents/m1_explorer_2/analysis.md and /Users/a7890/src/muryen-front/.agents/m1_explorer_2/handoff.md, then send a message to your parent.
