# Dispatch to Worker M4-B: UI Landmarks, Layouts, Accessibility & Modal Modernization

- **Authoritative Request**: `/Users/a7890/src/muryen-front/.agents/ORIGINAL_REQUEST.md`
- **Project Blueprint**: `/Users/a7890/src/muryen-front/PROJECT.md`
- **Explorer 2 Report**: `/Users/a7890/src/muryen-front/.agents/sweep_explorer_2/handoff.md`

## Files Owned Exclusively
1. `app/component/navigation.tsx`
2. `components/layout/footer.tsx`
3. `app/error.tsx`
4. `app/not-found.tsx`
5. `app/component/patten-page.tsx`
6. `app/component/sparring-page.tsx`
7. `app/component/equipment.tsx`
8. `app/component/video-circle.tsx`
9. `lib/contact.ts`

## Tasks & Specifications
1. **Semantic Navigation & Viewport Fixes in `app/component/navigation.tsx`**:
   - Add `aria-label="주요 내비게이션"` to `<nav>` tag (line 131). This resolves the `TestingLibraryElementError: Found multiple elements with the role 'navigation'` in Tier 1 tests!
   - Add `overflow-y-auto max-h-[calc(100vh-220px)]` to the menu list `<ul>` to eliminate occlusion on shorter viewports.
   - Clean up redundant duplicate theme button when sidebar is expanded.
2. **Footer Brand Heading & Hydration in `components/layout/footer.tsx`**:
   - Resolve duplicate brand heading match issue in tests while keeping responsive styling clean.
   - Add `suppressHydrationWarning` on `new Date().getFullYear()`.
3. **HTML5 Spec Violation Fix in `app/error.tsx` & `app/not-found.tsx`**:
   - Replace root `<main>` elements with `<section aria-labelledby="...">` (or `<div>`) so that nested `<main>` tags are eliminated inside `<AppShell>`'s `<main id="main">`.
4. **Tailwind Breakpoint Collision Fix**:
   - In `app/component/patten-page.tsx` (line 122) and `app/component/sparring-page.tsx` (line 120): replace duplicate classes (`text-2xl sm:text-xl sm:text-2xl md:text-3xl md:text-4xl`) with clean standard scale (`text-2xl sm:text-3xl md:text-4xl`).
   - Replace Rickroll YouTube link in `app/component/patten-page.tsx` with authentic/placeholder Muryen martial video link.
5. **Radix UI Modal Migration in `app/component/equipment.tsx`**:
   - Migrate custom modal to Radix UI `<Dialog>` (`components/ui/dialog.tsx`) to natively support Escape key, backdrop click, focus trapping, screen readers, and dark mode.
6. **VideoCircle Safe Math & Keyboard A11y in `app/component/video-circle.tsx`**:
   - Guard against empty array: if `totalVideos === 0`, prevent `0/0 = NaN`.
   - Add `role="button"` and `tabIndex={0}` or use `<button>` for keyboard focusability.
7. **Brand Consistency in `lib/contact.ts`**:
   - Harmonize `hanja: "武聯"` to `"武緣"` to align with the rest of the application.

## Verification


## 2026-09-09T14:24:47Z
You are worker_m4_b for muryen-front.
Your working directory is /Users/a7890/src/muryen-front/.agents/worker_m4_b.
You MUST read /Users/a7890/src/muryen-front/.agents/ORIGINAL_REQUEST.md and /Users/a7890/src/muryen-front/.agents/worker_m4_b/DISPATCH.md before starting.
Also review Explorer 2 report at /Users/a7890/src/muryen-front/.agents/sweep_explorer_2/handoff.md.

Files Owned Exclusively by you:
1. `app/component/navigation.tsx`
2. `components/layout/footer.tsx`
3. `app/error.tsx`
4. `app/not-found.tsx`
5. `app/component/patten-page.tsx`
6. `app/component/sparring-page.tsx`
7. `app/component/equipment.tsx`
8. `app/component/video-circle.tsx`
9. `lib/contact.ts`
