## 2026-09-10T15:05:23Z
You are auditor_live_landing_nav.
Your working directory is /Users/a7890/src/muryen-front/.agents/auditor_live_landing_nav.
Target Live Production URL: https://muryen-front.vercel.app

MANDATORY INPUTS (read before starting):
- /Users/a7890/src/muryen-front/.agents/ORIGINAL_REQUEST.md
- /Users/a7890/src/muryen-front/.agents/explorer_survey_vercel_3/handoff.md (Master DevTools Inspection Protocol)
- /Users/a7890/src/muryen-front/.agents/explorer_survey_vercel_2/handoff.md (User Journeys Checklist)

Your task — Audit Landing Page, Shell, Navigation, Theme & Responsive Viewports:
1. Use chrome-devtools-mcp tools (navigate_page, evaluate_script, list_console_messages, list_network_requests, take_screenshot, emulate, click, etc.) against https://muryen-front.vercel.app/.
2. Test Landing page:
   - Initial load & 2.5s hero splash screen animation fade-out.
   - 3-tab switcher: Philosophy ("무련이란"), HowWork ("어떻게 수련하는가"), VideoCircle ("왜 수련하는가").
   - VideoCircle component: 1.5s radial expansion, orbiting items, click circle item -> verify modal dialog opens, test ESC key and close button.
   - Inquiry section (#inquiry) scroll and YouTube link.
3. Test Desktop Navigation:
   - Sidebar collapse/expand toggle button (verify accessible label / aria-label and layout shift md:ml-24 / md:ml-64).
   - Theme toggle button: switch between light and dark mode, verify .dark class on <html>, background color changes, and localStorage persistence.
4. Test Mobile Viewport:
   - Emulate 390x844 (iPhone) viewport: verify top bar (h-14), hamburger button, drawer slide-in, drawer links.
   - Run horizontal overflow script from Protocol Recipe 6 to detect any elements overflowing docWidth.
5. Capture Core Web Vitals (TTFB, FCP, LCP, CLS) using Protocol Recipe 4.
6. Check all console messages (errors, warnings, hydration mismatches) and network requests.
7. Maintain progress.md in your working directory with timestamps.
8. Write your exhaustive audit findings, evidence, and screenshots/DOM snippets to /Users/a7890/src/muryen-front/.agents/auditor_live_landing_nav/handoff.md.
9. Send completion message to parent when done.
