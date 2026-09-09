# Handoff Report — Milestone 1: Bug Fixing, Hydration & Hygiene

**Author**: M1 Worker 1 (`teamwork_preview_worker`)  
**Target Path**: `/Users/a7890/src/muryen-front/.agents/m1_worker_1/handoff.md`  
**Date**: 2026-08-28  
**Status**: Complete (Hard Handoff)

---

## 1. Observation

### 1.1 Initial ESLint & Hydration Issues
- Running `npm run lint` initially produced 14 warnings across 7 files:
  - `app/component/equipment.tsx:5:26`: `'Shield'` is defined but never used (`@typescript-eslint/no-unused-vars`).
  - `app/component/equipment.tsx:5:34`: `'Sword'` is defined but never used (`@typescript-eslint/no-unused-vars`).
  - `app/component/intro-basic.tsx:13:10`: `'ChartContainer'` is defined but never used (`@typescript-eslint/no-unused-vars`).
  - `app/component/intro-basic.tsx:49:11`: `'TechniqueData'` is defined but never used (`@typescript-eslint/no-unused-vars`).
  - `app/component/intro-basic.tsx:69:7`: `'footTechniques'` is assigned a value but never used (`@typescript-eslint/no-unused-vars`).
  - `app/component/intro-basic.tsx:73:7`: `'mountedTechniques'` is assigned a value but never used (`@typescript-eslint/no-unused-vars`).
  - `app/component/intro-basic.tsx:77:7`: `'renderCustomizedLabel'` is assigned a value but never used (`@typescript-eslint/no-unused-vars`).
  - `app/component/intro-basic.tsx:103:7`: `'chartConfig'` is assigned a value but never used (`@typescript-eslint/no-unused-vars`).
  - `app/component/llami-chat-widget.tsx:11:35`: `'theme'` is assigned a value but never used (`@typescript-eslint/no-unused-vars`).
  - `app/component/llami-chat-widget.tsx:16:61`: Assignments to the `'theme'` variable inside `useEffect` (`react-hooks/exhaustive-deps`).
  - `app/component/login-page.tsx:4:20`: `'Apple'` is defined but never used (`@typescript-eslint/no-unused-vars`).
  - `app/component/login-page.tsx:29:13`: `'data'` is assigned a value but never used (`@typescript-eslint/no-unused-vars`).
  - `app/component/navigation.tsx:8:3`: `'Swords'` is defined but never used (`@typescript-eslint/no-unused-vars`).
  - `app/context/theme-context.tsx:4:17`: `'themes'` is defined but never used (`@typescript-eslint/no-unused-vars`).
  - `app/test2/page.tsx:3:10`: `'useEffect'` is defined but never used (`@typescript-eslint/no-unused-vars`).
- `app/component/record-graph.tsx` lines 37–59 evaluated `new Date()` and `Math.random()` at top-level module load time, causing SSR/CSR HTML mismatch.
- `app/component/navigation.tsx` (line 130) and `app/component/sparring-page.tsx` (line 113) included `if (!theme) return null;`, blanking server-rendered HTML for navigation and sparring.
- `app/context/theme-context.tsx` and `app/layout.tsx` managed `theme-dark`/`theme-light` classes but omitted `.dark`, preventing Tailwind `dark:*` utility styles from applying.
- `app/component/home-client.tsx` returned only `<Hero />` when `isOpening` was true, suppressing `<MainLayout>` and main content during SSR.

### 1.2 Assets, Layout & Leaks
- `app/component/equipment.tsx` dynamically requested non-existent `.jpg` filenames (`/images/전통-갑옷.jpg`, etc.), resulting in 404s.
- `public/images/foot/muye24ki_core_18_woldo.gif.gif` had an accidental double extension.
- `app/component/navigation.tsx` defined expanded width `w-44` (176px), whereas `components/layout/app-shell.tsx` used `md:ml-64` (256px), leaving an 80px gap.
- `app/component/video-circle.tsx` lacked `cancelAnimationFrame` cleanup and divided by `fastRotationDuration` instead of `expansionDuration`.
- `components/ai/vad-analyzer.tsx` only called `myVad.pause()`, leaking `AudioContext` and active `MediaStreamTrack`s.
- `app/api/auth/login/route.ts` commented out `httpOnly: true` on `accessToken`.
- `app/layout.tsx.rej` existed as an orphaned patch reject file.
- `README.md` contained raw git conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>> 6b73e5c`).

---

## 2. Logic Chain

1. **Hydration Determinism**:
   - Anchoring `mockCommitData` generation in `record-graph.tsx` to a constant date (`2024-12-31T00:00:00Z`) with arithmetic formulas for commit counts and record timestamps ensures both Node.js SSR and browser hydration generate identical DOM trees.
   - Sorting `years` descending ensures deterministic year ordering across platforms.

2. **SSR Full-Content Rendering**:
   - Initializing `theme` in `ThemeProvider` with default `"light"` and updating on mount allows removing `if (!theme) return null;` in `navigation.tsx` and `sparring-page.tsx`.
   - Modifying `home-client.tsx` to wrap the opening hero screen in `<AnimatePresence>` as an absolute/fixed overlay ensures semantic page elements (`<MainLayout>`, `<h1>`, `<Tabs>`, sections) are rendered immediately in SSR HTML without initial blanking.

3. **Dark Mode Sync**:
   - `tailwind.config.ts` requires the `.dark` class on `document.documentElement` to trigger `dark:*` classes.
   - Synchronizing both `dark` and `theme-dark`/`theme-light` in `theme-context.tsx` and the inline `theme-init` script in `app/layout.tsx` guarantees consistent theming without FOUC (Flash of Unstyled Content).

4. **Asset Integrity & Double Extension**:
   - Assigning `/images/armour.png`, `/images/sparring.png`, and `/images/foot/muye24ki_core_01_jangchang.gif` in `equipmentData` fixes 404s and uses responsive `next/image` with `fill` and `sizes`.
   - Renaming `muye24ki_core_18_woldo.gif.gif` to `.gif` via `git mv` and updating `intro-basic.tsx` restores asset loading for Woldo.

5. **Layout Alignment & Resource Cleanup**:
   - Updating `navigation.tsx` expanded width from `w-44` to `w-64` satisfies the `md:ml-64` layout contract in `app-shell.tsx`.
   - Adding `cancelAnimationFrame` in `video-circle.tsx` and correcting the denominator `expansionDuration = duration - fastRotationDuration` fixes animation jumps and unmount leaks.
   - Adding `teardownVad` in `vad-analyzer.tsx` stops all `MediaStreamTrack`s and closes `AudioContext`.

6. **Cookie Security**:
   - Enabling `httpOnly: true`, `secure: process.env.NODE_ENV === "production"`, and `sameSite: "lax"` on `accessToken` prevents token extraction via client XSS.
   - Setting `isLoggedIn=true` (`httpOnly: false`) allows client components (`navigation.tsx`, `mobile-nav.tsx`) to safely detect authentication status.

7. **Linter & Hygiene**:
   - Removing unused imports, unused variables, and mutable parameter reassignments across all 7 target files eliminated all 14 ESLint warnings.
   - Removing `app/layout.tsx.rej` and replacing `README.md` with clean documentation cleaned repository status.

---

## 3. Caveats

- **External OAuth / Google APIs**: `app/test2/page.tsx` uses Google OAuth credentials which require runtime environment variables (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) to authenticate against live YouTube APIs. Build and static analysis passed without errors.
- **Audio Permission in Browsers**: VAD analyzer requires user microphone permission at runtime. When denied or unsupported, errors are caught gracefully and user feedback is rendered.

---

## 4. Conclusion

All Milestone 1 requirements have been successfully implemented:
- **0 ESLint Errors / 0 ESLint Warnings**: Verified via `npm run lint`.
- **Clean Production Build**: Verified via `npm run build` with all 24 routes successfully prerendered / compiled.
- **Hydration & Theming**: Fixed deterministic mock data, removed SSR suppressions, synced `.dark` class, and kept semantic SSR DOM in home client.
- **Assets, Layout & Security**: Resolved 404s, double extensions, 80px desktop gap, memory leaks, and auth cookie vulnerabilities.
- **Hygiene**: Orphaned files removed and clean documentation in `README.md`.

---

## 5. Verification Method

### 5.1 Verification Commands
1. **ESLint Static Analysis**:
   ```bash
   npm run lint
   ```
   *Expected Output*: `✔ No ESLint warnings or errors`.

2. **Production Build**:
   ```bash
   npm run build
   ```
   *Expected Output*: `Compiled successfully` with `Generating static pages (24/24)`.

3. **Git Status & Working Tree Hygiene**:
   ```bash
   git status
   ```
   *Expected Output*: No merge conflict markers, `app/layout.tsx.rej` deleted, `woldo.gif` renamed.

### 5.2 Files to Inspect
- `app/component/record-graph.tsx`: Deterministic date generator and descending sort.
- `app/component/navigation.tsx`: `w-64` width, no `if (!theme) return null;`, clean imports.
- `app/component/sparring-page.tsx`: No `if (!theme) return null;`.
- `app/context/theme-context.tsx` & `app/layout.tsx`: `.dark` class synchronization.
- `app/component/home-client.tsx`: Direct `<MainLayout>` return with `AnimatePresence` overlay.
- `app/component/equipment.tsx`: Real asset paths (`armour.png`, `sparring.png`, `muye24ki_core_01_jangchang.gif`).
- `app/component/video-circle.tsx`: rAF cleanup and `expansionDuration` math.
- `components/ai/vad-analyzer.tsx`: `teardownVad` stopping tracks and audioContext.
- `app/api/auth/login/route.ts`: `httpOnly: true` on `accessToken`.
