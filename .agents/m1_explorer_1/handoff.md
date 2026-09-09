# Milestone 1 Part A Handoff Report

## 1. Observation
1. **`app/component/record-graph.tsx` (Lines 37–59, 88–90)**:
   - Module-level execution of `Math.random()` and `new Date()`:
     ```tsx
     count: Math.floor(Math.random() * 10),
     records: Array.from({ length: Math.floor(Math.random() * 5) }, ...),
     timestamp: format(date, "HH:mm:ss")
     ```
   - On Next.js SSR build/render, `Math.random()` executes on Node.js server. On client hydration, `Math.random()` executes again in the browser, producing divergent DOM color classes (`getColorClass`) and commit counts, causing hydration mismatch errors.
2. **`app/component/navigation.tsx` (Line 130) & `app/component/sparring-page.tsx` (Line 113)**:
   - Verbatim suppression:
     ```tsx
     // navigation.tsx:130
     if (!theme) return null;

     // sparring-page.tsx:113
     if (!theme) return null;
     ```
   - Because `theme` in `ThemeContext` initialized to `undefined`, these components rendered `null` on server-side rendering, wiping navigation links and sparring text from the initial HTML.
3. **`app/context/theme-context.tsx` (Lines 26–34) & `app/layout.tsx` (Lines 336–349)**:
   - Verbatim class list update:
     ```tsx
     // theme-context.tsx:29-30
     root.classList.remove("theme-light", "theme-dark");
     root.classList.add(`theme-${theme}`);
     ```
   - Only `theme-light` and `theme-dark` were added/removed. The `.dark` class required by `tailwind.config.ts` (`darkMode: ["class"]`) and CSS variable overrides in `app/globals.css` (Line 252: `.dark { ... }`) was never synchronized to `document.documentElement`.
   - `dark:*` Tailwind classes in `app/mypage/page.tsx`, `components/ai/vad-analyzer.tsx`, `components/ui/chart.tsx`, `components/video/interactive-player.tsx`, and `app/component/intro-basic.tsx` did not activate in dark mode.
4. **`app/component/home-client.tsx` (Lines 22–50)**:
   - Verbatim opening blocker:
     ```tsx
     if (isOpening) {
       return (
         <motion.div className="fixed inset-0 z-[100] ... aria-hidden="true">
           <Hero />
         </motion.div>
       );
     }
     ```
   - SSR output contained only the Hero overlay with `aria-hidden="true"`, omitting all main page content (`<MainLayout>`, `<h1>`, `<Tabs>`, `<Philosophy>`, `<WhyMuryeon>`, `<TargetAudience>`, `<TrainingSystem>`, `<InquirySection>`) from initial HTML.
5. **Build & Lint Status**:
   - `npm run build` currently compiles successfully with Next.js 15 App Router.
   - `npm run lint` reported unused variable warnings in `theme-context.tsx` (`themes`), `navigation.tsx` (`Swords`), `equipment.tsx` (`Shield`, `Sword`), and `intro-basic.tsx`.

---

## 2. Logic Chain
1. **Hydration Determinism (Observation 1 -> Fix 1)**:
   - By replacing `new Date()` and `Math.random()` with `ANCHOR_DATE = new Date("2024-12-31T00:00:00Z")` and deterministic integer arithmetic `(i * 7 + (i % 3) * 5 + 3) % 10`, the data structure is identical on Node.js SSR and browser hydration.
   - Sorting `years` ensures deterministic markup structure across platforms.
2. **SSR Availability (Observation 2 -> Fix 2)**:
   - By initializing `theme` to `"light"` in `ThemeProvider` (Observation 3), `theme` is guaranteed non-null on SSR and initial client pass.
   - Removing `if (!theme) return null;` allows Next.js to render full `<nav>` items and `<SparringPage>` contents during SSR.
3. **Tailwind Dark Mode Contract (Observation 3 -> Fix 3)**:
   - Tailwind `darkMode: ["class"]` requires `.dark` on `document.documentElement`.
   - Synchronizing `root.classList.add("dark")` when `theme === "dark"` (and `root.classList.remove("dark")` when light) in both `theme-context.tsx` and `app/layout.tsx` inline script aligns with Tailwind and `globals.css`.
4. **SEO & Non-Blocking Overlay (Observation 4 -> Fix 4)**:
   - By rendering `<MainLayout>` unconditionally as the primary tree and rendering the opening Hero inside `<AnimatePresence>` as a fixed `pointer-events-none` overlay, the SSR HTML contains the full semantic tree while preserving the smooth fade-out visual animation.

---

## 3. Caveats
- `TooltipProvider` in `record-graph.tsx` is currently instantiated per cell (1,095 instances). Hoisting it to wrap the entire calendar grid is scheduled for Milestone 2 Feature 12 (performance optimization).
- `localStorage` theme preference changes on the client will cause a single React re-render from `"light"` to `"dark"` after mount, but the inline script in `app/layout.tsx` sets `.dark` before first paint to prevent visual flash (FOUC).
- Unused variables in other files (`equipment.tsx`, `intro-basic.tsx`, `llami-chat-widget.tsx`) are scheduled for cleanup in Milestone 1 Part B / Feature 8.

---

## 4. Conclusion
Milestone 1 Part A implementation plan is fully specified and ready for immediate execution by the executor agent.
Target files and changes:
1. `app/component/record-graph.tsx`: Deterministic `mockCommitData` generator with fixed anchor date and arithmetic PRNG; sorted `years`.
2. `app/component/navigation.tsx`: Remove `if (!theme) return null;` and unused `Swords` import.
3. `app/component/sparring-page.tsx`: Remove `if (!theme) return null;`.
4. `app/context/theme-context.tsx`: Default state to `"light"`, synchronize `.dark` class to `document.documentElement`, clean unused `themes` import.
5. `app/layout.tsx`: Update `theme-init` inline script to synchronize `.dark` class with system preference fallback.
6. `app/component/home-client.tsx`: Use `AnimatePresence` overlay for `isOpening` while keeping `<MainLayout>` permanently mounted for SSR SEO.

---

## 5. Verification Method
1. **Build Gate**:
   ```sh
   npm run build
   ```
   Must succeed with zero errors.
2. **Lint Gate**:
   ```sh
   npm run lint
   ```
   Must pass without introducing new lint errors.
3. **SSR Content Check**:
   ```sh
   # Verify full navigation, sparring text, and home semantic content are in raw SSR output
   curl -s http://localhost:3000/ | grep "무련은 무예도보통지"
   curl -s http://localhost:3000/sparring | grep "대련의 특성과 의미"
   ```
4. **Dark Mode Sync Check**:
   - Open browser developer tools, toggle theme to dark, and confirm `document.documentElement` class list contains both `theme-dark` and `dark`.
