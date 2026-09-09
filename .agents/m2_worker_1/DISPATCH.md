## 2026-08-27T17:00:07Z
You are M2 Worker 1 (teamwork_preview_worker).
Your working directory is: /Users/a7890/src/muryen-front/.agents/m2_worker_1
The original user request is at: /Users/a7890/src/muryen-front/.agents/ORIGINAL_REQUEST.md
The project scope is at: /Users/a7890/src/muryen-front/PROJECT.md
The Survey 3 analysis is at: /Users/a7890/src/muryen-front/.agents/survey_explorer_3/analysis.md
The project root is: /Users/a7890/src/muryen-front

Mission:
Implement all Milestone 2 Performance Optimizations (Requirement R2):

1. Bundle Splitting & Dynamic Imports:
   - In `app/component/navigation.tsx`: Use `next/dynamic` to dynamically load `VideoModal` (`const VideoModal = dynamic(() => import("./VideoModal"), { ssr: false });`), removing `react-player` from the initial shared bundle.
   - In `app/component/intro-basic.tsx`: Dynamically import Recharts pie chart components (`PieChart`, `Pie`, `Cell`, `ResponsiveContainer`) or wrap the chart in a dynamically loaded client component with `ssr: false`.
   - In `components/dashboard/stat-cards.tsx`: Dynamically import Recharts charts (`LineChart`, `RadarChart`, `BarChart`, `ResponsiveContainer`) with `next/dynamic` (`ssr: false`).

2. Render Loop & Provider Optimization:
   - In `app/component/video-circle.tsx`: Eliminate the 50ms `setInterval` state update (`setRotation`). Replace with CSS keyframe animation / smooth CSS rotation or optimize with requestAnimationFrame so that React state is not continuously re-rendered at 20 FPS.
   - In `app/component/record-graph.tsx`: Hoist `<TooltipProvider>` out of the `eachDayOfInterval` loop so a single `<TooltipProvider>` wraps the entire calendar grid instead of allocating 1,095 separate provider instances.
   - In `app/context/theme-context.tsx`: Wrap `toggleTheme` in `useCallback` and the context provider value object in `useMemo` to avoid unnecessary subscriber re-renders.

3. Image Loading & Preload Optimizations:
   - In `app/component/how-work.tsx` and `app/component/video-circle.tsx`: Add explicit `sizes` props to `<Image fill ...>` elements.
   - In `app/component/intro-basic.tsx`: Remove `priority` props on images inside non-active tabs to prevent bandwidth contention during initial page load.

4. Verification:
   - Run `npm run lint` and verify 0 errors, 0 warnings.
   - Run `npm run build` and inspect route bundle sizes.
   - Write your complete handoff report to /Users/a7890/src/muryen-front/.agents/m2_worker_1/handoff.md and send a message to your parent.
