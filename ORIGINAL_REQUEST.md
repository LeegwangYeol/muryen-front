# Original User Request

## Initial Request — 2026-09-01T09:08:29+09:00

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview
> Requested team: Full team

Conduct a comprehensive debugging sweep of the `muryen-front` application. Specifically, identify and fix the cause of the error message currently displaying in the bottom-left corner of the UI, and ensure no related errors exist elsewhere in the codebase.

Working directory: /Users/a7890/src/muryen-front
Integrity mode: development

## Requirements

### R1. Identify and Resolve UI Error
Locate the component or logic causing an error message to render in the bottom-left corner of the screen. Fix the underlying issue (e.g., hydration mismatch, unhandled exception, or missing data) so the message disappears.

### R2. Project-wide Error Audit
Audit the entire project to ensure that whatever caused the bottom-left error (e.g., faulty provider, layout issue, misconfigured dynamic import) hasn't caused similar silent or visible failures in other components.

## Acceptance Criteria

### Verification
- [ ] Reproduce the error locally or identify it statically.
- [ ] The bottom-left error message no longer appears on application load.
- [ ] `npm run lint` and `npm run build` pass without new errors.
