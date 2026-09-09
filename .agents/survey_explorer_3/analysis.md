# Performance & Testing Survey Analysis: `muryen-front`

**Date**: 2026-08-28  
**Surveyor**: Survey Explorer 3 (`teamwork_preview_explorer`)  
**Scope**: Codebase performance audit, Core Web Vitals, dynamic imports, bundle optimization, and complete Jest & React Testing Library configuration & unit test strategy.

---

## 1. Executive Summary

`muryen-front` is a Next.js 15 (App Router, React 18.2, TypeScript 5) web application for the Korean martial arts group "Muryeon (武緣)".
The application build (`npx next build`) compiles successfully into static and dynamic routes. However, the survey identified critical performance bottlenecks (layout-level bundle pollution, CPU-intensive timer loops, unmemoized context providers, 1,000+ redundant DOM providers, and un-scoped AI/VAD CDN scripts) and a complete absence of testing infrastructure.

### Key Performance Findings:
1. **Global Bundle Pollution**: `react-player` is imported via `VideoModal` in `Navigation`, which is imported in `AppShell` in `RootLayout`. As a consequence, `react-player` (~150KB) is bundled into the First Load JS shared by all 24 routes across the entire site.
2. **20 FPS Unnecessary React Re-renders**: `VideoCircle` runs `setInterval(..., 50)` updating React state 20 times per second, forcing continuous reconciliation and trigonometry calculations on 6-10 image components.
3. **1,095 Redundant Radix Tooltip Providers**: `RecordGraph` renders `<TooltipProvider>` inside a 3-year date iteration (1,095 times), creating thousands of unnecessary React DOM nodes and event listeners.
4. **Heavy Global Script Load**: `onnxruntime-web` and `@ricky0123/vad-web` are loaded on every page in `RootLayout` (`app/layout.tsx`), despite only being used in the VAD component on `/cutting`.
5. **Next.js Image `sizes` Missing**: Multiple `fill` images in `how-work.tsx` and `video-circle.tsx` omit `sizes`, causing Next.js to deliver 100vw images to 300px card thumbnails.
6. **Preloading Contention**: `intro-basic.tsx` renders 16 hidden images with `priority={index < 4}`, generating preload headers for off-screen hidden GIFs and delaying critical LCP assets.
7. **Unused Heavy Dependencies**: `@xenova/transformers` and `@meursyphus/flitter` are installed in `package.json` but never imported anywhere.

### Key Testing Findings:
1. **Zero Testing Setup**: No Jest, React Testing Library, test scripts, `jest.config.*`, or unit test files exist.
2. **Designed Solution**: Complete Next.js 15 App Router `next/jest` configuration designed with `@testing-library/react`, `jest-environment-jsdom`, and path alias mapping (`@/*`).
3. **Test Scope Enumerated**: 4 core utility modules (`utils.ts`, `auth-service.ts`, `token-service.ts`, `contact.ts`), 1 context (`theme-context.tsx`), 9 UI primitives (`button.tsx`, `typography.tsx`, `card.tsx`, `input.tsx`, `tabs.tsx`, `dialog.tsx`, `scroll-area.tsx`, `tooltip.tsx`), and 8 layout/feature components (`main-layout.tsx`, `footer.tsx`, `mobile-nav.tsx`, `page-cta.tsx`, `hero.tsx`, `why-muryeon.tsx`, `training-system.tsx`, `pattern-curriculum-table.tsx`).

---

## 2. Deep-Dive Performance Audit

### 2.1 Component Re-renders & React Memoization

#### Issue P1.1: `VideoCircle` 20 FPS React Render Loop (`app/component/video-circle.tsx`)
- **Observation**: Lines 60–64 in `video-circle.tsx`:
  ```tsx
  const interval = setInterval(() => {
    setRotation((prev) => (prev + 0.2) % 360);
  }, 50);
  ```
- **Impact**: React state `rotation` updates every 50ms, triggering full reconciliation of the component and all child nodes 20 times every second. On mobile or lower-end devices, this causes high CPU/battery consumption and potential jank.
- **Remedy**:
  - Replace JavaScript state-driven rotation with CSS keyframe animation (`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`) or apply continuous CSS transforms directly on container DOM refs via `requestAnimationFrame` without React state triggers.

#### Issue P1.2: `RecordGraph` 1,095 Duplicate `TooltipProvider`s (`app/component/record-graph.tsx`)
- **Observation**: Lines 111–129 in `record-graph.tsx`:
  ```tsx
  {eachDayOfInterval({...}).map((date) => (
    <TooltipProvider key={dateString}>
      <Tooltip>
        <TooltipTrigger>...</TooltipTrigger>
        <TooltipContent>...</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ))}
  ```
- **Impact**: Generates 1,095 Radix UI `<TooltipProvider>` instances per render. Also, `parseISO`, `startOfYear`, and `eachDayOfInterval` run inside the JSX render loop for each year on every state change (e.g., clicking a day).
- **Remedy**:
  - Hoist ONE `<TooltipProvider delayDuration={100}>` outside the `years.map` loop.
  - Wrap date interval computations in `useMemo`.

#### Issue P1.3: `ThemeProvider` Context Value Recreation (`app/context/theme-context.tsx`)
- **Observation**: Lines 40–44 in `theme-context.tsx`:
  ```tsx
  return (
    <ThemeContext.Provider value={{ theme: theme ?? "light", toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
  ```
- **Impact**: Since `toggleTheme` is an inline arrow function and `value` is a raw object literal, a new object reference is created on every render of `ThemeProvider`. All components using `useTheme()` re-render whenever the root provider updates.
- **Remedy**:
  ```tsx
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(() => ({
    theme: theme ?? "light",
    toggleTheme,
  }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
  ```

#### Issue P1.4: `intro-basic.tsx` Mousemove Pixel Tracking (`app/component/intro-basic.tsx`)
- **Observation**: Lines 394–399 in `intro-basic.tsx`:
  ```tsx
  useEffect(() => {
    if (!isHovered) return;
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isHovered]);
  ```
- **Impact**: Every mousemove event on a hovered slice triggers React state update `setMousePos`, causing React re-render per pixel movement.
- **Remedy**: Use CSS hover tooltips or update tooltip container coordinates via direct DOM `style.transform` mutation on a ref rather than React component state.

---

### 2.2 Bundle Size, Code Splitting & Dynamic Imports

#### Issue P2.1: `react-player` Loaded on All Pages via Layout Tree
- **Observation**:
  1. `VideoModal.tsx` statically imports `react-player`.
  2. `app/component/navigation.tsx` statically imports `VideoModal`.
  3. `components/layout/app-shell.tsx` imports `Navigation`.
  4. `app/layout.tsx` imports `AppShell`.
  5. In addition, `Navigation.tsx` renders `<VideoModal isOpen={false} videoId="" />` where modal is never opened from navigation.
- **Impact**: Every route on the website bundles `react-player` into the shared JS chunk (`chunks/4bd1b696-*.js`).
- **Remedy**:
  - Dynamic import `VideoModal` with `dynamic(() => import('./VideoModal'), { ssr: false })` or remove the unused modal from `Navigation.tsx`.
  - Dynamic import `InteractivePlayer` in `patten-page.tsx`.

#### Issue P2.2: Recharts Bundle Splitting (`/basic-sense` and `/mypage`)
- **Observation**:
  - `/basic-sense` First Load JS: **227 kB** (`intro-basic.tsx` uses Recharts `PieChart`, `Pie`, `Cell`, `ResponsiveContainer`).
  - `/mypage` First Load JS: **214 kB** (`stat-cards.tsx` uses Recharts `LineChart`, `RadarChart`, `BarChart`).
- **Impact**: Recharts (~160 kB uncompressed) is loaded synchronously on page evaluation.
- **Remedy**:
  - Dynamically import chart components:
    ```tsx
    const DonutChart = dynamic(() => import("./donut-chart"), {
      ssr: false,
      loading: () => <div className="h-[800px] animate-pulse bg-white/5 rounded-lg" />,
    });
    ```
    ```tsx
    const DashboardStatCards = dynamic(
      () => import("@/components/dashboard/stat-cards").then((mod) => mod.DashboardStatCards),
      { ssr: false, loading: () => <div className="h-64 animate-pulse bg-white/5 rounded-lg" /> }
    );
    ```

#### Issue P2.3: Heavy ONNX / VAD CDN Scripts in Global Root Layout (`app/layout.tsx`)
- **Observation**: Lines 361–368 in `app/layout.tsx`:
  ```html
  <Script src="https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/ort.js" strategy="lazyOnload" />
  <Script src="https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.19/dist/bundle.min.js" strategy="lazyOnload" />
  ```
- **Impact**: Every user visiting any page (home, about, basic, sparring, etc.) downloads the multi-megabyte ONNX WebAssembly runtime script.
- **Remedy**:
  - Move the CDN script tags into `components/ai/vad-analyzer.tsx` (or dynamically inject them only when the user navigates to `/cutting` and interacts with "마이크 켜기").

#### Issue P2.4: Unused Heavy Dependencies in `package.json`
- **Observation**:
  - `"@xenova/transformers": "^2.0.1"`
  - `"@meursyphus/flitter": "^2.1.0"`
- **Impact**: Bloats `node_modules` and dependency resolution time during CI/CD.
- **Remedy**: Remove unused packages from `package.json`.

---

### 2.3 Image Optimization & Core Web Vitals (LCP, CLS)

| Location | Issue | Impact | Recommended Fix |
|---|---|---|---|
| `app/component/how-work.tsx:130,156` | `<Image fill ... />` missing `sizes` | Next.js defaults to `100vw`, serving full-resolution images for 300px card thumbnails | Add `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"` |
| `app/component/video-circle.tsx:171` | `<Image fill ... />` missing `sizes` | Circle thumbnails (160px) fetch 100vw images | Add `sizes="160px"` |
| `app/component/intro-basic.tsx:441` | Hidden images with `priority={index < 4}` | Generates 16 high-priority `<link rel="preload">` in `<head>` for hidden off-screen GIF images | Remove hidden preload images or remove `priority` |
| `app/component/styles.tsx:18` | `src="images/hero.jpeg"` | Relative URL missing leading `/` | Change to `src="/images/hero.jpeg"` (or delete dead component) |
| `app/component/equipment.tsx:87` | `src={'/images/' + item.title.toLowerCase().replace(' ', '-') + '.jpg'}` | Files like `전통-갑옷.jpg` do not exist in `/public/images/`, causing 404 image errors | Map to existing images (`/images/armour.png`, etc.) |
| `app/component/home-client.tsx:22-50` | `isOpening` state blocks initial SSR content for 2.5s | Server renders only `<Hero />` in fixed overlay; full page content is delayed by 2.5s CSR timeout | Render full page content in SSR HTML; overlay opening animation with Framer Motion `AnimatePresence` on top |

---

## 3. Testing Infrastructure & Unit Test Strategy

### 3.1 Required Packages & Versions
To support Next.js 15 (App Router, React 18, TypeScript 5), the following devDependencies are required:

```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "@types/jest": "^29.5.14",
    "jest-environment-jsdom": "^29.7.0",
    "@testing-library/react": "^16.2.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "ts-node": "^10.9.2"
  }
}
```

### 3.2 Exact Jest Configuration (`jest.config.ts`)

```ts
import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const customJestConfig: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  collectCoverageFrom: [
    "lib/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "app/context/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
};

export default createJestConfig(customJestConfig);
```

### 3.3 Setup File (`jest.setup.ts`)

```ts
import "@testing-library/jest-dom";

// Mock matchMedia for jsdom environment (used in ThemeProvider, VantaBackground)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver for components using ResponsiveContainer / Radix UI
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
```

### 3.4 Scripts in `package.json`

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## 4. Test Target Inventory

### 4.1 Utility Functions (`lib/`)

| File | Functions / Objects | Test Scenarios | Priority |
|---|---|---|---|
| `lib/utils.ts` | `cn(...inputs)` | 1. Merges standard class strings<br>2. Evaluates conditionals (`false && 'cls'`, `undefined`, `null`)<br>3. Resolves conflicting Tailwind classes (e.g. `p-2` vs `p-4` -> `p-4`) | High |
| `lib/token-service.ts` | `TokenService.generateToken()`, `TokenService.verifyToken()` | 1. Generates valid signed HS256 JWT with sub and role<br>2. Verifies valid JWT and extracts payload<br>3. Returns `null` on invalid or tampered token | High |
| `lib/auth-service.ts` | `AuthService.login()`, `AuthService.validateToken()` | 1. Authenticates admin credentials (`1111/1111`) returning admin user and JWT<br>2. Authenticates user credentials (`2222/2222`) returning user role and JWT<br>3. Returns `null` for invalid credentials<br>4. Validates token via `TokenService` | High |
| `lib/contact.ts` | `SITE`, `CONTACT`, `KEYWORDS`, `ANALYTICS` | 1. Validates required metadata fields (`url`, `name`, `slogan`, `schedule`, `fee`)<br>2. Validates YouTube URL and GA4 measurement ID structure | Medium |

### 4.2 React Contexts & Hooks (`app/context/`)

| File | Target | Test Scenarios | Priority |
|---|---|---|---|
| `app/context/theme-context.tsx` | `ThemeProvider`, `useTheme()` | 1. Defaults to `light` when localStorage is empty<br>2. Loads existing theme (`dark`) from localStorage<br>3. `toggleTheme()` toggles theme and updates `document.documentElement` class list and localStorage<br>4. `useTheme()` throws error when rendered outside `ThemeProvider` | High |

### 4.3 UI Primitive Components (`components/ui/`)

| File | Target Component | Test Scenarios | Priority |
|---|---|---|---|
| `components/ui/button.tsx` | `Button` | 1. Renders default button with children text<br>2. Applies variant classes (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`)<br>3. Applies size classes (`default`, `sm`, `lg`, `icon`)<br>4. Handles `asChild` slot delegation<br>5. Fires `onClick` handler when clicked; disabled state prevents click | High |
| `components/ui/typography.tsx` | `PageHeading`, `SectionHeading`, `SubHeading`, `Body`, `Eyebrow`, `Quote`, `Section`, `CardContainer`, `CardGrid`, `Divider` | 1. Renders semantic headings (`h1`, `h2`, `h3`, `p`, `blockquote`, `section`)<br>2. Adapts class colors based on theme context (light vs dark)<br>3. Supports `as` tag polymorphism (`as="span"`, `as="h1"`)<br>4. Applies custom `className` alongside typography presets | High |
| `components/ui/card.tsx` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | 1. Renders card wrapper and child slots with correct markup<br>2. Merges additional classNames correctly | Medium |
| `components/ui/input.tsx` | `Input` | 1. Renders input element with type, placeholder, and value<br>2. Triggers `onChange` handler on user input | High |
| `components/ui/tabs.tsx` | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | 1. Renders tab triggers and default active content<br>2. Switches visible `TabsContent` when trigger is clicked | Medium |
| `components/ui/dialog.tsx` | `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle` | 1. Does not render content when `open=false`<br>2. Renders modal dialog and title when `open=true`<br>3. Calls `onOpenChange` when closed | Medium |

### 4.4 Layout & Presentation Components (`components/layout/` & `app/component/`)

| File | Target Component | Test Scenarios | Priority |
|---|---|---|---|
| `components/layout/footer.tsx` | `Footer` | 1. Renders site name, tagline, copyright text<br>2. Renders navigation links and YouTube/Instagram links | Medium |
| `components/layout/page-cta.tsx` | `PageCTA` | 1. Renders default title & subtitle<br>2. Renders custom title/subtitle props when passed<br>3. Renders inquiry link pointing to `/#inquiry` | Medium |
| `app/component/hero.tsx` | `Hero` | 1. Renders title "무련 武緣", subtitle, and slogan<br>2. Renders Next.js hero background image with `priority` | Medium |
| `app/component/why-muryeon.tsx` | `WhyMuryeon` | 1. Renders section heading "왜 무련인가?"<br>2. Renders 3 feature cards (갑주 대련, 대학경당 계보, 회비 없음) | Medium |
| `app/component/training-system.tsx` | `TrainingSystem` | 1. Renders 3-period cards (1교시 기본기, 2교시 투로, 3교시 대련) | Medium |
| `app/component/pattern-curriculum-table.tsx` | `PatternCurriculumTable` | 1. Renders 6 curriculum steps (0 to 5) with correct track titles | Medium |
| `app/component/inquiry-section.tsx` | `InquirySection` | 1. Renders location, schedule, fee, entry barrier info<br>2. Renders YouTube link with correct target and rel attributes | Medium |

---

## 5. Prioritized Action Plan for Implementation

```
[Phase 1: Test Infrastructure Setup]
  ├── Step 1.1: Install jest, @testing-library/react, @testing-library/jest-dom, jest-environment-jsdom, ts-node
  ├── Step 1.2: Create jest.config.ts and jest.setup.ts
  └── Step 1.3: Add "test", "test:watch", "test:coverage" scripts to package.json

[Phase 2: Unit Test Suite Implementation]
  ├── Step 2.1: Write unit tests for lib/utils.ts, lib/token-service.ts, lib/auth-service.ts, lib/contact.ts
  ├── Step 2.2: Write unit tests for app/context/theme-context.tsx
  ├── Step 2.3: Write unit tests for components/ui/ (button, typography, card, input, tabs, dialog)
  └── Step 2.4: Write unit tests for layout & presentation components (footer, page-cta, why-muryeon, etc.)

[Phase 3: Performance & Bundle Optimization]
  ├── Step 3.1: Memoize ThemeContext value & useCallback for toggleTheme
  ├── Step 3.2: Dynamic import VideoModal in Navigation (or isolate from layout) to eliminate react-player from global bundle
  ├── Step 3.3: Dynamic import Recharts in basic-sense and mypage
  ├── Step 3.4: Fix VideoCircle 20 FPS setInterval with CSS animation / RAF
  ├── Step 3.5: Hoist TooltipProvider in RecordGraph and memoize date computations
  ├── Step 3.6: Add explicit sizes to all Next.js fill images (how-work.tsx, video-circle.tsx)
  └── Step 3.7: Relocate VAD/ONNX scripts from root layout to dynamic component load
```
