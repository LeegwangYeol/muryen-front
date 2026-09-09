# Milestone 1 Part C: ESLint Warnings & Repository Hygiene Implementation Plan

## Executive Summary
This document defines the complete, line-by-line implementation plan for **Milestone 1 Part C** of the `muryen-front` codebase.
Part C targets two primary goals:
1. **Zero ESLint Warnings & Errors**: Eliminating all 14 ESLint unused variable and hook dependency warnings across 7 target files.
2. **Repository Hygiene**: Deleting the orphaned patch reject file (`app/layout.tsx.rej`) and resolving git merge conflict markers in `README.md`.

---

## 1. Complete Issue Inventory

### A. ESLint Warnings (14 Warnings across 7 Files)
| # | File Path | Line:Col | Rule | Description / Target Identifier | Proposed Fix |
|---|-----------|----------|------|---------------------------------|--------------|
| 1 | `app/component/equipment.tsx` | 5:26 | `@typescript-eslint/no-unused-vars` | `'Shield'` is defined but never used | Remove `Shield` from `lucide-react` import |
| 2 | `app/component/equipment.tsx` | 5:34 | `@typescript-eslint/no-unused-vars` | `'Sword'` is defined but never used | Remove `Sword` from `lucide-react` import |
| 3 | `app/component/intro-basic.tsx` | 13:10 | `@typescript-eslint/no-unused-vars` | `'ChartContainer'` is defined but never used | Remove `ChartContainer` import |
| 4 | `app/component/intro-basic.tsx` | 49:11 | `@typescript-eslint/no-unused-vars` | `'TechniqueData'` is defined but never used | Remove unused interface `TechniqueData` |
| 5 | `app/component/intro-basic.tsx` | 69:7 | `@typescript-eslint/no-unused-vars` | `'footTechniques'` is assigned a value but never used | Remove unused constant `footTechniques` |
| 6 | `app/component/intro-basic.tsx` | 73:7 | `@typescript-eslint/no-unused-vars` | `'mountedTechniques'` is assigned a value but never used | Remove unused constant `mountedTechniques` |
| 7 | `app/component/intro-basic.tsx` | 77:7 | `@typescript-eslint/no-unused-vars` | `'renderCustomizedLabel'` is assigned a value but never used | Remove unused helper function `renderCustomizedLabel` |
| 8 | `app/component/intro-basic.tsx` | 103:7 | `@typescript-eslint/no-unused-vars` | `'chartConfig'` is assigned a value but never used | Remove unused constant `chartConfig` |
| 9 | `app/component/llami-chat-widget.tsx` | 11:35 | `@typescript-eslint/no-unused-vars` | `'theme'` is assigned a value but never used | Remove unused `theme` prop & `LLAMIChatWidgetProps` interface |
| 10 | `app/component/llami-chat-widget.tsx` | 16:61 | `react-hooks/exhaustive-deps` | Assignments to 'theme' inside `useEffect` lost after render | Remove mutable parameter reassignment `theme = "catalog"` |
| 11 | `app/component/login-page.tsx` | 4:20 | `@typescript-eslint/no-unused-vars` | `'Apple'` is defined but never used | Remove `Apple` from `lucide-react` import |
| 12 | `app/component/login-page.tsx` | 29:13 | `@typescript-eslint/no-unused-vars` | `'data'` is assigned a value but never used | Change `const data = await response.json()` to `await response.json()` |
| 13 | `app/component/navigation.tsx` | 8:3 | `@typescript-eslint/no-unused-vars` | `'Swords'` is defined but never used | Remove `Swords` from `lucide-react` import |
| 14 | `app/context/theme-context.tsx` | 4:17 | `@typescript-eslint/no-unused-vars` | `'themes'` is defined but never used | Remove `themes` from `../styles/theme` import |
| 15 | `app/test2/page.tsx` | 3:10 | `@typescript-eslint/no-unused-vars` | `'useEffect'` is defined but never used | Remove `useEffect` from `react` import |

### B. Repository Hygiene Issues (2 Items)
| # | Target | Issue Description | Proposed Remediation |
|---|--------|-------------------|----------------------|
| 1 | `app/layout.tsx.rej` | Orphaned reject file from previous patch attempt | Delete file via filesystem removal |
| 2 | `README.md` | Contains git merge conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>> 6b73e5c`) | Overwrite with clean, structured Korean README for Muryeon frontend |

---

## 2. Line-by-Line File Analysis & Proposed Diff Patches

### File 1: `app/component/equipment.tsx`
- **Location**: Line 5
- **Cause**: Unused icon imports `Shield` and `Sword`. Only `ShoppingBasket` and `X` are rendered in the component.
- **Diff Patch**:
```diff
--- a/app/component/equipment.tsx
+++ b/app/component/equipment.tsx
@@ -2,7 +2,7 @@
 
 import { useState, useRef } from "react";
 import Image from "next/image";
-import { ShoppingBasket, Shield, Sword, X } from "lucide-react";
+import { ShoppingBasket, X } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { MainLayout } from "@/components/layout/main-layout";
 import {
```

---

### File 2: `app/component/intro-basic.tsx`
- **Location**: Line 13, Lines 49-55, Lines 69-112
- **Cause**:
  1. Line 13: `ChartContainer` imported from `@/components/ui/chart` but never used (the component uses `ResponsiveContainer` from `recharts`).
  2. Lines 49-55: Unused TypeScript interface `TechniqueData`.
  3. Lines 69-112: Legacy/unused constants `footTechniques`, `mountedTechniques`, `renderCustomizedLabel`, `chartConfig` (the component uses custom SVG donut rendering with `CustomLabel` and `CustomSectionContent`).
- **Diff Patch**:
```diff
--- a/app/component/intro-basic.tsx
+++ b/app/component/intro-basic.tsx
@@ -10,7 +10,6 @@
 } from "react";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
-import { ChartContainer } from "@/components/ui/chart";
 import Image from "next/image";
 import { MainLayout } from "@/components/layout/main-layout";
 import { PageCTA } from "@/components/layout/page-cta";
@@ -46,13 +45,6 @@
   [key: string]: Book;
 }
 
-interface TechniqueData {
-  name: string;
-  value: number;
-  image: string;
-  description: string;
-  index: number;
-}
 
 const generateTechniqueData = (book: Book) => {
   const total = book.techniques.length;
@@ -66,51 +58,6 @@
   return data;
 };
 
-const footTechniques = [
-  { name: "도보 무예", value: 18, color: "hsl(var(--chart-1))" },
-];
-
-const mountedTechniques = [
-  { name: "기마 무예", value: 6, color: "hsl(var(--chart-2))" },
-];
-
-const renderCustomizedLabel = ({
-  cx,
-  cy,
-  midAngle,
-  innerRadius,
-  outerRadius,
-  percent,
-}: LabelProps) => {
-  const RADIAN = Math.PI / 180;
-  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
-  const x = cx + radius * Math.cos(-midAngle * RADIAN);
-  const y = cy + radius * Math.sin(-midAngle * RADIAN);
-
-  return (
-    <text
-      x={x}
-      y={y}
-      fill="white"
-      textAnchor={x > cx ? "start" : "end"}
-      dominantBaseline="central"
-    >
-      {`${(percent * 100).toFixed(0)}%`}
-    </text>
-  );
-};
-
-const chartConfig = {
-  footTechniques: {
-    label: "도보 무예",
-    color: "hsl(var(--chart-1))",
-  },
-  mountedTechniques: {
-    label: "기마 무예",
-    color: "hsl(var(--chart-2))",
-  },
-};
-
 const muye24Data: Muye24DataType = {
   book1: {
     title: "무예도보통지 제1권",
```

---

### File 3: `app/component/llami-chat-widget.tsx`
- **Location**: Lines 7-17
- **Cause**:
  1. `theme` parameter is destructured from `LLAMIChatWidgetProps` but never referenced elsewhere.
  2. Inside `useEffect`, line 16 performs `if (pathname.startsWith("/catalog/llami-chat")) theme = "catalog";`, directly mutating the function parameter. This triggers `react-hooks/exhaustive-deps` and is a React anti-pattern.
- **Diff Patch**:
```diff
--- a/app/component/llami-chat-widget.tsx
+++ b/app/component/llami-chat-widget.tsx
@@ -4,16 +4,11 @@
 import { usePathname } from "next/navigation";
 import Script from "next/script";
 
-interface LLAMIChatWidgetProps {
-  theme?: string | undefined;
-}
-
-export const LLAMIChatWidget = ({ theme }: LLAMIChatWidgetProps) => {
+export const LLAMIChatWidget = () => {
   const pathname = usePathname();
 
   useEffect(() => {
     if (pathname.startsWith("/chat-link")) return;
-    if (pathname.startsWith("/catalog/llami-chat")) theme = "catalog";
     const isExcludedPath = pathname.startsWith("/chat");
     if (!isExcludedPath) {
       // 위젯 로드 및 초기화
```

---

### File 4: `app/component/login-page.tsx`
- **Location**: Line 4, Line 29
- **Cause**:
  1. `Apple` icon imported from `lucide-react` but never used.
  2. `const data = await response.json();` creates an unused variable `data`.
- **Diff Patch**:
```diff
--- a/app/component/login-page.tsx
+++ b/app/component/login-page.tsx
@@ -1,7 +1,7 @@
 "use client";
 
 import { useState } from "react";
-import { Activity, Apple } from "lucide-react";
+import { Activity } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { useTheme } from "../context/theme-context";
@@ -26,7 +26,7 @@
         throw new Error("로그인에 실패했습니다.");
       }
 
-      const data = await response.json();
+      await response.json();
 
       // URL 파라미터에서 리다이렉트 URL 가져오기
       const params = new URLSearchParams(window.location.search);
```

---

### File 5: `app/component/navigation.tsx`
- **Location**: Line 8
- **Cause**: `Swords` imported from `lucide-react` on line 8, but never included in `menuItems` or rendered.
- **Diff Patch**:
```diff
--- a/app/component/navigation.tsx
+++ b/app/component/navigation.tsx
@@ -5,7 +5,6 @@
 import {
   Home,
   Feather,
-  Swords,
   Dumbbell,
   BookOpen,
   ChevronLeft,
```

---

### File 6: `app/context/theme-context.tsx`
- **Location**: Line 4
- **Cause**: `themes` imported from `../styles/theme` on line 4, but `ThemeContext` only uses the type `Theme`.
- **Diff Patch**:
```diff
--- a/app/context/theme-context.tsx
+++ b/app/context/theme-context.tsx
@@ -1,7 +1,7 @@
 "use client";
 
 import React, { createContext, useContext, useEffect, useState } from "react";
-import { Theme, themes } from "../styles/theme";
+import { Theme } from "../styles/theme";
 
 type ThemeContextType = {
   theme: Theme;
```

---

### File 7: `app/test2/page.tsx`
- **Location**: Line 3
- **Cause**: `useEffect` imported from `"react"` on line 3, but the component only uses `useState` and `useSession`.
- **Diff Patch**:
```diff
--- a/app/test2/page.tsx
+++ b/app/test2/page.tsx
@@ -1,6 +1,6 @@
 "use client";
 
-import { useEffect, useState } from "react";
+import { useState } from "react";
 import { signIn, signOut, useSession } from "next-auth/react";
 
 // 세션 타입 확장
```

---

### File 8: `app/layout.tsx.rej`
- **Action**: Delete file `/Users/a7890/src/muryen-front/app/layout.tsx.rej`.
- **Rationale**: An obsolete reject hunk containing metadata alterations that have already been completely merged into `/Users/a7890/src/muryen-front/app/layout.tsx` (lines 52-56).

---

### File 9: `README.md`
- **Action**: Overwrite `/Users/a7890/src/muryen-front/README.md` with clean project documentation.
- **New Content**:
```markdown
# 무련 (武緣, Muryeon) - 웹 프론트엔드

조선 정조 시대 편찬된 『무예도보통지』 24반 무예를 수련하고 연구하는 무예 수련 단체 **무련(武緣)**의 공식 웹사이트 프론트엔드 애플리케이션입니다.

## 주요 기능
- **24반 무예 소개**: 무예도보통지 24기(지상무예 18기 + 마상무예 6기) 인터랙티브 차트 및 상세 정보 제공
- **수련 안내 및 입회 신청**: 수련 장소, 시간, 회비 및 상담 신청
- **수련 일지 & 커뮤니티**: 나의 수련 기록 및 무예 수련 정보 아카이빙
- **다크/라이트 모드 지원**: 사용자 테마 전환 지원

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 결과를 확인할 수 있습니다.

## 빌드 및 검사

```bash
# ESLint 정적 분석
npm run lint

# 프로덕션 빌드
npm run build
```

## 기술 스택
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI / Shadcn UI / Lucide React
- **Data Visualization**: Recharts
```

---

## 3. Step-by-Step Implementation Sequence for Parent/Executor

1. **Step 1 — Clean Component Imports & Variables**:
   - Apply edits to `app/component/equipment.tsx`
   - Apply edits to `app/component/intro-basic.tsx`
   - Apply edits to `app/component/llami-chat-widget.tsx`
   - Apply edits to `app/component/login-page.tsx`
   - Apply edits to `app/component/navigation.tsx`

2. **Step 2 — Clean Context & Test Pages**:
   - Apply edits to `app/context/theme-context.tsx`
   - Apply edits to `app/test2/page.tsx`

3. **Step 3 — Clean Repository Hygiene**:
   - Delete `app/layout.tsx.rej`
   - Overwrite `README.md` to remove merge conflict markers

4. **Step 4 — Verification**:
   - Run `npm run lint` -> Must complete with 0 errors and 0 warnings.
   - Run `npm run build` -> Must verify complete production build integrity.
