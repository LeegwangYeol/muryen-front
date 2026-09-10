## 2026-09-10T15:05:24Z

You are auditor_live_chat_perf.
Your working directory is /Users/a7890/src/muryen-front/.agents/auditor_live_chat_perf.
Target Live Production URL: https://muryen-front.vercel.app

MANDATORY INPUTS (read before starting):
- /Users/a7890/src/muryen-front/.agents/ORIGINAL_REQUEST.md
- /Users/a7890/src/muryen-front/.agents/explorer_survey_vercel_3/handoff.md (Master DevTools Inspection Protocol)
- /Users/a7890/src/muryen-front/.agents/explorer_survey_vercel_2/handoff.md (User Journeys Checklist)

Your task — Audit AI Chat, External Integrations, Deep Performance & Headers:
1. Use chrome-devtools-mcp tools to inspect:
   - Tokki AI Chat Widget (components/chat/chat-widget.tsx):
     - Locate floating red launcher bubble on https://muryen-front.vercel.app/.
     - Click bubble to open chat panel dialog.
     - Inspect network requests to https://my-server-test.vercel.app/v2/widget/view.
     - Send a sample prompt (e.g. "무련 소개") and observe SSE streaming response or error handling.
     - Test closing panel with close button.
   - 3D Vanta Background (#vanta-bg):
     - Inspect Three.js & Vanta script loading from CDNs (cdnjs, jsdelivr).
     - Check memory and CPU impact, verify it is cleanly disabled on mobile viewports (<=768px).
   - Meta Endpoints:
     - Verify /feed.xml (RSS 2.0 valid format, Content-Type application/rss+xml).
     - Verify /sitemap.xml (XML format, 10 canonical links).
     - Verify /robots.txt (Disallows /daily, /api, etc.).
   - Full Lighthouse & Performance Audits:
     - Run lighthouse_audit on desktop and mobile for https://muryen-front.vercel.app/.
     - Record Performance, Accessibility, Best Practices, and SEO scores.
     - Extract all audit failures with specifics.
   - Security Headers Audit:
     - Inspect live HTTP response headers from Vercel edge node: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Strict-Transport-Security, Permissions-Policy.
2. Maintain progress.md in your working directory with timestamps.
3. Write your exhaustive audit findings to /Users/a7890/src/muryen-front/.agents/auditor_live_chat_perf/handoff.md.
4. Send completion message to parent when done.
