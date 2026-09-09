# BRIEFING — 2026-09-01T09:12:45+09:00

## Mission
Investigate and identify the root cause of the error message displaying in the bottom-left corner of the UI on application load in muryen-front, audit related UI components/providers/states, and recommend concrete fix strategies.

## 🔒 My Identity
- Archetype: explorer
- Roles: investigator, synthesizer
- Working directory: /Users/a7890/src/muryen-front/.agents/explorer_survey_1
- Original parent: b49411bf-2c7e-4bd6-888a-e027f4092d05
- Milestone: survey and root cause diagnosis

## 🔒 Key Constraints
- Read-only investigation — do NOT implement fixes in source code directly
- Document findings in analysis.md and handoff.md
- Maintain progress.md with timestamped updates

## Current Parent
- Conversation ID: b49411bf-2c7e-4bd6-888a-e027f4092d05
- Updated: 2026-09-01T09:12:45+09:00

## Investigation State
- **Explored paths**:
  - `app/layout.tsx` (Head scripts, LLAMI chat widget injection, providers, metadata)
  - `app/component/llami-chat-widget.tsx` (Orphaned chatbot widget component)
  - `app/component/navigation.tsx` (Fixed desktop navigation sidebar, bottom-left container, VideoModal)
  - `app/component/VideoModal.tsx` (ReactPlayer modal)
  - `app/providers.tsx` & `app/api/auth/[...nextauth]/route.ts` (NextAuth SessionProvider and Google OAuth)
  - `components/layout/app-shell.tsx`, `mobile-nav.tsx`, `footer.tsx`
  - `app/page.tsx` & `app/component/home-client.tsx`
  - `__tests__/` test suites, `package.json`, `tailwind.config.ts`, `globals.css`
- **Key findings**:
  - Primary bottom-corner error caused by external LLAMI Chatbot Widget (`https://static.llami.net/widget-v1.js`) in `app/layout.tsx:358-382`.
  - Bottom-left viewport container in `app/component/navigation.tsx:210-265` contains dead `<VideoModal isOpen={isVideoModalOpen} videoId="" />`.
  - NextAuth `GoogleProvider` non-null assertion without defined environment variables in `app/api/auth/[...nextauth]/route.ts`.
  - Project tests (17 suites, 97 tests), lint (0 errors/warnings), and build (24 static pages) all pass.
- **Unexplored areas**: None (full survey complete).

## Key Decisions Made
- Formulated a 4-step concrete remediation plan in analysis.md and handoff.md.

## Artifact Index
- `/Users/a7890/src/muryen-front/.agents/explorer_survey_1/analysis.md` — Detailed forensic investigation & audit table
- `/Users/a7890/src/muryen-front/.agents/explorer_survey_1/handoff.md` — 5-component handoff report
- `/Users/a7890/src/muryen-front/.agents/explorer_survey_1/progress.md` — Progress log & liveness heartbeat
