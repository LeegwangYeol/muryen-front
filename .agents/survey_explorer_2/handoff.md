# Handoff Report — Codebase Audit & Bug Survey

**Agent**: Survey Explorer 2 (`teamwork_preview_explorer`)  
**Working Directory**: `/Users/a7890/src/muryen-front/.agents/survey_explorer_2`  
**Target Project**: `muryen-front` (Next.js 15 App Router)  
**Parent Conversation ID**: `3cc5ed4a-ba8b-448b-bc68-43ce7e3b2327`  
**Timestamp**: 2026-08-28T01:40:00+09:00  

---

## 1. Observation

Direct observations from tool executions and code inspections:

1. **`app/component/record-graph.tsx` (Lines 37–59)**:
   ```tsx
   const mockCommitData: CommitData = {
     ...Object.fromEntries(
       Array.from({ length: 365 * 3 }, (_, i) => {
         const date = new Date();
         date.setDate(date.getDate() - i);
         return [
           format(date, "yyyy-MM-dd"),
           {
             count: Math.floor(Math.random() * 10),
             records: Array.from(
               { length: Math.floor(Math.random() * 5) },
               (_, j) => ({
                 id: `record-${i}-${j}`,
                 title: `수련 기록 ${j + 1}`,
                 content: `이날의 수련 내용입니다. ${j + 1}번째 기록`,
                 timestamp: format(date, "HH:mm:ss"),
               })
             ),
           },
         ];
       })
     ),
   };
   ```
   - Observed: Non-deterministic `Math.random()` and `Date` calls executed at top-level module scope, causing different markup on server build vs. browser client mount across 1,095 day cells.
   - Observed: `TooltipProvider` placed on line 111 inside each day cell loop iteration (1,095 nested providers).

2. **`app/context/theme-context.tsx` (Lines 28–34) & `tailwind.config.ts` (Line 4)**:
   ```tsx
   // theme-context.tsx:28-34
   const root = document.documentElement;
   root.classList.remove("theme-light", "theme-dark");
   root.classList.add(`theme-${theme}`);
   ```
   ```ts
   // tailwind.config.ts:4
   darkMode: ["class"],
   ```
   - Observed: `tailwind.config.ts` uses `darkMode: ["class"]`, which requires `<html class="dark">`. `theme-context.tsx` only adds `theme-dark` and never `dark`. All Tailwind `dark:...` utility classes across the application are inoperative.

3. **`app/component/equipment.tsx` (Lines 87–89)**:
   ```tsx
   <Image
     src={`/images/${item.title.toLowerCase().replace(" ", "-")}.jpg`}
     alt={item.title}
     width={300}
     height={200}
     className="rounded-lg mb-4"
   />
   ```
   - Observed: File search in `public/images/` confirmed `/images/전통-갑옷.jpg`, `/images/전투용-투구.jpg`, `/images/장창.jpg` do not exist. All 3 cards throw 404 image load errors.

4. **`app/component/home-client.tsx` (Lines 22–50)**:
   ```tsx
   const [isOpening, setIsOpening] = useState(true);
   useEffect(() => {
     const timer = setTimeout(() => setIsOpening(false), 2500);
     return () => clearTimeout(timer);
   }, []);
   if (isOpening) {
     return <motion.div ...><Hero /></motion.div>;
   }
   return <MainLayout>...<h1 className="sr-only">...</h1>...</MainLayout>;
   ```
   - Observed: SSR renders only `<Hero />`. All semantic content (`MainLayout`, `Tabs`, `WhyMuryeon`, `TargetAudience`, `TrainingSystem`, `InquirySection`, `h1`) is excluded from the initial SSR HTML payload.

5. **`components/layout/app-shell.tsx` (Line 37) vs `app/component/navigation.tsx` (Line 135)**:
   - `navigation.tsx:135`: `<nav className={`${isExpanded ? "w-44" : "w-24"} ...`
   - `app-shell.tsx:37`: `<main className={`... ${isNavExpanded ? "md:ml-64" : "md:ml-24"}`}>`
   - Observed: `w-44` (176px) vs `md:ml-64` (256px) leaves an 80px gap between sidebar and content.

6. **`app/component/video-circle.tsx` (Lines 32–66)**:
   - Line 48: `const progress = (elapsed - fastRotationDuration) / fastRotationDuration;` (divides by 1000 instead of 500, capping progress at 0.5 before snapping to 1.0).
   - Line 58: `requestAnimationFrame(animateInitial)` in `useEffect` has no return cleanup function, updating state after unmount.

7. **`components/ai/vad-analyzer.tsx` (Lines 22–28)**:
   - `useEffect` cleanup calls `myVad.pause()`, leaving the `AudioContext` and `MediaStream` microphone tracks open.

8. **`app/component/navigation.tsx` (Line 130) & `app/component/sparring-page.tsx` (Line 113)**:
   - `if (!theme) return null;` suppresses SSR rendering before client hydration.

9. **`app/api/auth/login/route.ts` (Line 23)**:
   - `// httpOnly: true,` is commented out, leaving `accessToken` cookie accessible to client JavaScript.

10. **ESLint & Compiler Diagnostics (`npm run lint`)**:
    - Warnings on unused variables:
      - `app/component/equipment.tsx:5`: `Shield`, `Sword`
      - `app/component/intro-basic.tsx:13, 49, 69, 73, 77, 103`: `ChartContainer`, `TechniqueData`, `footTechniques`, `mountedTechniques`, `renderCustomizedLabel`, `chartConfig`
      - `app/component/llami-chat-widget.tsx:11, 16`: `theme` unused & mutated inside `useEffect`
      - `app/component/login-page.tsx:4, 29`: `Apple`, `data`
      - `app/component/navigation.tsx:8`: `Swords`
      - `app/context/theme-context.tsx:4`: `themes`
      - `app/test2/page.tsx:3`: `useEffect`

11. **Leftover patch rejection**:
    - `app/layout.tsx.rej` contains 29 lines of rejected diff text.

12. **Unused dependencies in `package.json`**:
    - Search confirmed 0 usages for `@meursyphus/flitter`, `@xenova/transformers`, `lamejs`, `styled-components`, `next-themes`.

---

## 2. Logic Chain

1. **Hydration Mismatch Chain**:
   - Observation 1 shows `mockCommitData` evaluated with `Math.random()` and `new Date()` at top level.
   - SSR server execution produces date keys and counts with server timestamp.
   - Browser evaluation on hydration produces different date keys and counts with client timestamp.
   - React 18 compares SSR HTML with client initial render tree → DOM mismatch error triggered on 1,095 elements.

2. **Dark Mode Failure Chain**:
   - Observation 2 shows `tailwind.config.ts` requires class `dark`.
   - `theme-context.tsx` adds `theme-dark` to `document.documentElement` and never adds `dark`.
   - Tailwind CSS selector `.dark .dark\:...` never matches.
   - All dark mode variant classes in components fail to apply.

3. **Asset 404 Chain**:
   - Observation 3 shows `equipment.tsx` dynamically constructs `.jpg` filenames from Korean titles.
   - Files do not exist in `public/images/`.
   - Browser receives 404 responses for all 3 images on `/equipment`.

4. **SEO & Performance Blanking Chain**:
   - Observation 4 shows `isOpening = true` on initial render.
   - Server renders only `<Hero />`.
   - Search engines index an empty shell without headings, metadata tabs, or body copy.
   - Users experience a 2.5s rendering delay and complete DOM replacement.

5. **Sidebar Layout Defect Chain**:
   - Observation 5 shows navigation width is `11rem` (`w-44`) while page margin is `16rem` (`md:ml-64`).
   - 256px - 176px = 80px unfilled void between sidebar and main layout on desktop.

---

## 3. Caveats

1. External APIs (`@ricky0123/vad-web` CDN scripts, Google OAuth credentials in `.env.local`, YouTube Data API endpoints) require live network/credentials for full runtime execution.
2. The investigation was conducted in read-only mode — no source code modifications were made.

---

## 4. Conclusion

The codebase is functional in static compilation, but contains 17 specific defects that directly affect user experience, SEO, runtime stability, and styling integrity.

### Priority Implementation Recommendations:
1. **P0 - Fix SSR Hydration**: Make `record-graph.tsx` mock data deterministic or load on client mount; remove `if (!theme) return null;` early returns.
2. **P0 - Fix Dark Mode**: Update `theme-context.tsx` and `app/layout.tsx` to toggle `.dark` on `document.documentElement`.
3. **P1 - Fix 404 Image Assets**: Update `equipment.tsx` to reference existing images in `public/images/`.
4. **P1 - Fix Layout & SEO**: Remove 2.5s `isOpening` unmount in `home-client.tsx`; align `Navigation` (`w-64`) and `AppShell` (`md:ml-64`).
5. **P1 - Fix Memory Leaks & Math Bugs**: Cancel rAF in `video-circle.tsx` and fix progress formula; destroy VAD stream on unmount.
6. **P2 - Clean Linter Warnings & Unused Code**: Clean up 14 unused variables/imports, remove `app/layout.tsx.rej`, and prune unused packages in `package.json`.

Detailed documentation is available in `/Users/a7890/src/muryen-front/.agents/survey_explorer_2/analysis.md`.

---

## 5. Verification Method

To independently verify all findings:

1. **Verify Linter Warnings**:
   ```bash
   npm run lint
   ```
   Expected: 14 ESLint warnings in `equipment.tsx`, `intro-basic.tsx`, `llami-chat-widget.tsx`, `login-page.tsx`, `navigation.tsx`, `theme-context.tsx`, `test2/page.tsx`.

2. **Verify Dark Mode Class Desync**:
   Inspect `app/context/theme-context.tsx` lines 28–34 and check `document.documentElement.classList`. Confirm that class `dark` is never added when switching themes.

3. **Verify Equipment Image 404s**:
   Check `app/component/equipment.tsx` lines 87–89 and test image existence with:
   ```bash
   ls public/images/전통-갑옷.jpg public/images/전투용-투구.jpg public/images/장창.jpg
   ```
   Expected: Files not found.

4. **Verify Hydration Mismatch on `/daily`**:
   Inspect `app/component/record-graph.tsx` lines 37–59 and observe module-level `Math.random()`.

5. **Verify Layout Margin Mismatch**:
   Inspect `app/component/navigation.tsx` line 135 (`w-44` = 176px) vs `components/layout/app-shell.tsx` line 37 (`md:ml-64` = 256px).
