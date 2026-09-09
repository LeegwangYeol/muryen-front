# Milestone 1 Part A Detailed Implementation Plan & Analysis

## Executive Summary
This document provides the exact, line-by-line implementation plan for **Milestone 1 Part A**, addressing critical SSR hydration mismatches, search engine optimization (SEO) rendering suppressions, dark mode class synchronization with Tailwind CSS, and initial load blanking.

---

## 1. SSR Hydration Fixes in `app/component/record-graph.tsx`

### Problem Analysis
- **File**: `app/component/record-graph.tsx` (Lines 37–59, 88–90)
- **Root Cause**: `mockCommitData` executes `new Date()` and `Math.random()` at top-level module evaluation time.
  - On the Next.js server (SSR), `new Date()` and `Math.random()` generate one set of dates, commit counts, and records.
  - In the client browser during hydration, the module runs `Math.random()` again, resulting in completely different background colors (`getColorClass`), commit counts, and tooltip texts.
  - This triggers React 18 hydration mismatch errors: `"Hydration failed because the initial UI does not match what was rendered on the server"`.
  - Furthermore, `years` derived from `Object.keys(mockCommitData)` relies on insertion order without explicit sorting.

### Proposed Code Changes
Replace lines 37–59 in `app/component/record-graph.tsx` with a deterministic data generator function anchored at a fixed date constant (`ANCHOR_DATE`), and sort `years` descending.

#### Code Diff Specification
```tsx
// Target: app/component/record-graph.tsx

// --- BEFORE (Lines 37-59) ---
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

// --- AFTER (Deterministic Generation) ---
const ANCHOR_DATE = new Date("2024-12-31T00:00:00Z");

const generateMockCommitData = (): CommitData => {
  const data: CommitData = {};
  const totalDays = 365 * 3;
  for (let i = 0; i < totalDays; i++) {
    const date = new Date(ANCHOR_DATE.getTime() - i * 86400000);
    const dateString = format(date, "yyyy-MM-dd");
    // Deterministic arithmetic formula based on day index
    const count = (i * 7 + (i % 3) * 5 + 3) % 10;
    const recordCount = count > 0 ? ((i * 3 + 1) % 4) + 1 : 0;
    const records = Array.from({ length: recordCount }, (_, j) => {
      const hour = String(9 + ((i * 2 + j * 3) % 12)).padStart(2, "0");
      const minute = String((i * 13 + j * 17) % 60).padStart(2, "0");
      return {
        id: `record-${i}-${j}`,
        title: `수련 기록 ${j + 1}`,
        content: `이날의 수련 내용입니다. ${j + 1}번째 기록`,
        timestamp: `${hour}:${minute}:00`,
      };
    });
    data[dateString] = { count, records };
  }
  return data;
};

const mockCommitData: CommitData = generateMockCommitData();
```

#### Line 88-90 Update:
```tsx
// --- BEFORE ---
const years = Array.from(
  new Set(Object.keys(mockCommitData).map((date) => date.split("-")[0]))
);

// --- AFTER ---
const years = Array.from(
  new Set(Object.keys(mockCommitData).map((date) => date.split("-")[0]))
).sort().reverse();
```

---

## 2. Remove SSR Suppressions in `navigation.tsx` & `sparring-page.tsx`

### Problem Analysis
- **Files**:
  - `app/component/navigation.tsx` (Line 130: `if (!theme) return null;`)
  - `app/component/sparring-page.tsx` (Line 113: `if (!theme) return null;`)
- **Root Cause**: Because `theme` was initially typed as `Theme | undefined` and initialized to `undefined`, early returns were added to avoid rendering before the client mounted.
  - This suppressed the entire navigation menu and the entire sparring page from server-rendered HTML.
  - Search engine crawlers (Googlebot, Naver Yeti) receive empty HTML shells without navigation links or sparring curriculum text.
  - Users experience layout shift when hydration completes and the components suddenly appear.

### Proposed Code Changes

#### 1. `app/component/navigation.tsx`
- Remove lines 129–130:
```tsx
// Line 129-130: DELETE
-   // theme이 결정되지 않았으면 렌더하지 않음 (SSR/CSR mismatch 방지)
-   if (!theme) return null;
```
- Clean up unused import at Line 8:
```tsx
// Line 8: Clean unused 'Swords'
-   Swords,
```

#### 2. `app/component/sparring-page.tsx`
- Remove line 113:
```tsx
// Line 113: DELETE
-   if (!theme) return null;
```

---

## 3. Dark Mode Class Synchronization in `theme-context.tsx` & `app/layout.tsx`

### Problem Analysis
- **Files**:
  - `app/context/theme-context.tsx` (Lines 15, 26–34, 41)
  - `app/layout.tsx` (Lines 336–349)
  - `tailwind.config.ts` (`darkMode: ["class"]`)
- **Root Cause**:
  - `tailwind.config.ts` uses class-based dark mode (`darkMode: ["class"]`), meaning Tailwind's `dark:*` utility classes (e.g. `dark:text-white`, `dark:bg-slate-900`) only activate when `document.documentElement` (`<html>`) has the CSS class `.dark`.
  - `globals.css` also defines custom property overrides under `.dark`.
  - Currently, `theme-context.tsx` and `app/layout.tsx` only add/remove `theme-light` and `theme-dark`, NEVER `.dark`.
  - Consequently, components using `dark:` classes (`app/mypage/page.tsx`, `components/ai/vad-analyzer.tsx`, `components/ui/chart.tsx`, `components/video/interactive-player.tsx`, `app/component/intro-basic.tsx`) fail to apply dark styles.
  - `theme` in `ThemeProvider` was initialized to `undefined`, causing downstream components to require null-guards.

### Proposed Code Changes

#### 1. `app/context/theme-context.tsx`
```tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Theme } from "../styles/theme";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-light", "theme-dark");
    root.classList.add(`theme-${theme}`);
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
```

#### 2. `app/layout.tsx` (Inline Theme Init Script)
Update lines 336–349:
```tsx
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var isDark = stored === 'dark' || (!stored && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  var activeTheme = stored || (isDark ? 'dark' : 'light');
                  document.documentElement.classList.remove('theme-light', 'theme-dark');
                  document.documentElement.classList.add('theme-' + activeTheme);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
```

---

## 4. SEO & Initial SSR Render in `app/component/home-client.tsx`

### Problem Analysis
- **File**: `app/component/home-client.tsx` (Lines 22–50)
- **Root Cause**: `HomeClient` conditionally renders the entire page based on `if (isOpening) return <HeroOverlay />`.
  - On SSR and during the first 2.5 seconds on client, the main semantic page structure (`<MainLayout>`, `<h1>`, `<Tabs>`, `<Philosophy>`, `<HowWork>`, `<VideoCircle>`, `<WhyMuryeon>`, `<TargetAudience>`, `<TrainingSystem>`, `<InquirySection>`) is NOT mounted in the DOM.
  - Search crawlers see only the Hero overlay (`aria-hidden="true"`), degrading SEO indexing.
  - When `isOpening` transitions to `false` after 2.5s, the entire tree is replaced, causing a jarring DOM rebuild and layout jump.

### Proposed Code Changes
- Import `AnimatePresence` from `"framer-motion"`.
- Always render `<MainLayout>` and its children in the main component return.
- Render the opening hero screen as an animated overlay (`fixed inset-0 z-[100] pointer-events-none`) inside `<AnimatePresence>`, allowing it to smoothly fade out after 2.5s without unmounting the underlying semantic DOM.

#### Code Diff Specification
```tsx
// Target: app/component/home-client.tsx

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layout/main-layout";
import Hero from "./hero";
import Philosophy from "./philosophy";
import VideoCircle from "./video-circle";
import HowWork from "./how-work";
import WhyMuryeon from "./why-muryeon";
import TargetAudience from "./target-audience";
import TrainingSystem from "./training-system";
import InquirySection from "./inquiry-section";
import { mockVideos } from "./mock-data";
import { useTheme } from "../context/theme-context";

export default function HomeClient() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("philosophy");
  const [isOpening, setIsOpening] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpening(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isOpening && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, delay: 1 }}
            aria-hidden="true"
          >
            <motion.div
              className="relative w-full h-full"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
            >
              <Hero />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MainLayout>
        <h1 className="sr-only">
          무련(武緣) — 조선 24반 무예 · 갑주 대련 · 대학경당 계보를 잇는 서울 수련 동호회. 무련은 무예도보통지의 기록을 몸으로 읽어내는 방식으로 24반 무예를 수련합니다.
        </h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-14 md:top-4 z-40 flex justify-center px-2 py-3 pointer-events-none isolate [transform:translateZ(0)]">
            <TabsList
              className={`pointer-events-auto max-w-[96vw] md:max-w-[600px] justify-center border shadow-sm rounded-full transition-colors duration-200 text-[11px] sm:text-sm gap-0.5 sm:gap-1 px-1 sm:px-2 ${
                theme === "dark"
                  ? "bg-gray-900 border-gray-700 text-gray-200"
                  : "bg-white border-gray-200 text-gray-800"
              }`}
            >
              <TabsTrigger
                value="philosophy"
                className={`transition-all duration-200 px-2 sm:px-3 py-1.5 ${
                  theme === "dark"
                    ? "data-[state=active]:bg-gray-700 hover:bg-gray-700/50"
                    : "data-[state=active]:bg-gray-100 hover:bg-gray-50"
                }`}
              >
                <span className="sm:hidden">무련</span>
                <span className="hidden sm:inline">무련이란</span>
              </TabsTrigger>
              <TabsTrigger
                value="reason"
                className={`transition-all duration-200 px-2 sm:px-3 py-1.5 ${
                  theme === "dark"
                    ? "data-[state=active]:bg-gray-700 hover:bg-gray-700/50"
                    : "data-[state=active]:bg-gray-100 hover:bg-gray-50"
                }`}
              >
                <span className="sm:hidden">수련법</span>
                <span className="hidden sm:inline">어떻게 수련하는가</span>
              </TabsTrigger>
              <TabsTrigger
                value="training"
                className={`transition-all duration-200 px-2 sm:px-3 py-1.5 ${
                  theme === "dark"
                    ? "data-[state=active]:bg-gray-700 hover:bg-gray-700/50"
                    : "data-[state=active]:bg-gray-100 hover:bg-gray-50"
                }`}
              >
                <span className="sm:hidden">의미</span>
                <span className="hidden sm:inline">왜 수련하는가</span>
              </TabsTrigger>
            </TabsList>
          </div>
          <div>
            <ScrollArea>
              <TabsContent value="philosophy" className="overflow-hidden">
                <Philosophy />
              </TabsContent>
              <TabsContent value="reason" className="overflow-hidden">
                <HowWork />
              </TabsContent>
              <TabsContent value="training">
                <VideoCircle videos={mockVideos} />
              </TabsContent>
            </ScrollArea>
          </div>
        </Tabs>

        <WhyMuryeon />
        <TargetAudience />
        <TrainingSystem />
        <InquirySection />
      </MainLayout>
    </>
  );
}
```

---

## 5. Verification Matrix

| Target File | Verification Metric | Command / Check Method | Expected Result |
|---|---|---|---|
| `app/component/record-graph.tsx` | Hydration Match & Determinism | `npm run build && curl -s http://localhost:3000/daily` | Server HTML commit grid matches client rendered DOM exactly without console warnings. |
| `app/component/navigation.tsx` | SSR Navigation Rendering | Inspect initial HTML source of `/` and `/sparring` | `<nav>` elements and menu items are present in raw SSR response. |
| `app/component/sparring-page.tsx` | SSR Sparring Content Rendering | Inspect initial HTML source of `/sparring` | Full curriculum stages and section headings present in raw SSR response. |
| `app/context/theme-context.tsx` & `app/layout.tsx` | Dark Class Sync & Tailwind Variants | Toggle theme in UI, inspect `document.documentElement` classes | `document.documentElement` contains `dark` and `theme-dark` when theme is dark; `dark:*` Tailwind styles apply. |
| `app/component/home-client.tsx` | Semantic DOM & Fading Overlay | Inspect raw HTML of `/` | Full page content present in raw HTML; overlay fades smoothly on client without unmounting main content. |
| Whole Project | Build & Lint Gates | `npm run build && npm run lint` | Zero build errors, zero linter errors. |
