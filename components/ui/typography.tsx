"use client";

import type { ReactNode, ElementType, HTMLAttributes } from "react";
import { useTheme } from "@/app/context/theme-context";

/**
 * 반응형이 기본 내장된 타이포그래피·레이아웃 프리미티브.
 * 모든 텍스트·섹션을 이 컴포넌트들로 쓰면
 * - 반응형 브레이크포인트를 매번 직접 작성할 필요가 없고
 * - 테마(라이트/다크) 대응이 자동이며
 * - 사이트 전반의 타이포 스케일이 일관됩니다.
 *
 * ## 사용 예
 *   <Section>
 *     <Eyebrow>WHY MURYEON</Eyebrow>
 *     <SectionHeading>왜 무련인가?</SectionHeading>
 *     <Body>...</Body>
 *     <CardGrid cols={3}>
 *       <CardContainer>...</CardContainer>
 *       ...
 *     </CardGrid>
 *   </Section>
 */

function useColors() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return {
    head: dark ? "text-white" : "text-gray-900",
    body: dark ? "text-gray-200" : "text-gray-700",
    muted: dark ? "text-white/60" : "text-gray-500",
    divider: dark ? "border-white/15" : "border-gray-300/60",
    glass: dark ? "glassmorphism-dark" : "glassmorphism-light",
    surface: dark ? "bg-white/5" : "bg-gray-900/5",
    border: dark ? "border-white/10" : "border-gray-200",
  };
}

// ─────────────────────────────────────────────────────────────
// 제목
// ─────────────────────────────────────────────────────────────

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: ElementType;
  align?: "left" | "center";
  size?: "sm" | "md" | "lg" | "xl";
}

const HEADING_SIZE = {
  sm: "text-lg sm:text-xl md:text-2xl",
  md: "text-xl sm:text-2xl md:text-3xl",
  lg: "text-2xl sm:text-3xl md:text-4xl",
  xl: "text-3xl sm:text-4xl md:text-5xl",
} as const;

/** 페이지 타이틀 (h1). 기본 xl, 가운데 정렬. */
export function PageHeading({
  as: Tag = "h1",
  align = "center",
  size = "xl",
  className = "",
  children,
  ...rest
}: HeadingProps & { children: ReactNode }) {
  const c = useColors();
  return (
    <Tag
      className={`font-bold mb-6 sm:mb-10 ${HEADING_SIZE[size]} ${c.head} ${align === "center" ? "text-center" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** 섹션 타이틀 (h2). 기본 lg. */
export function SectionHeading({
  as: Tag = "h2",
  align = "left",
  size = "lg",
  className = "",
  children,
  ...rest
}: HeadingProps & { children: ReactNode }) {
  const c = useColors();
  return (
    <Tag
      className={`font-bold mb-4 sm:mb-6 ${HEADING_SIZE[size]} ${c.head} ${align === "center" ? "text-center" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** 서브섹션 타이틀 (h3). 기본 md. */
export function SubHeading({
  as: Tag = "h3",
  align = "left",
  size = "md",
  className = "",
  children,
  ...rest
}: HeadingProps & { children: ReactNode }) {
  const c = useColors();
  return (
    <Tag
      className={`font-semibold mb-2 sm:mb-3 ${HEADING_SIZE[size]} ${c.head} ${align === "center" ? "text-center" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// ─────────────────────────────────────────────────────────────
// 본문
// ─────────────────────────────────────────────────────────────

interface BodyProps extends HTMLAttributes<HTMLParagraphElement> {
  size?: "xs" | "sm" | "base" | "lg";
  muted?: boolean;
  as?: ElementType;
}

const BODY_SIZE = {
  xs: "text-xs sm:text-sm",
  sm: "text-sm sm:text-base",
  base: "text-sm sm:text-base md:text-lg",
  lg: "text-base sm:text-lg md:text-xl",
} as const;

/** 본문 문단. size로 크기 조절, muted로 보조 색상, as로 렌더 태그(span 등). */
export function Body({
  size = "base",
  muted = false,
  as: Tag = "p",
  className = "",
  children,
  ...rest
}: BodyProps & { children: ReactNode }) {
  const c = useColors();
  return (
    <Tag
      className={`leading-relaxed ${BODY_SIZE[size]} ${muted ? c.muted : c.body} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** 작은 윗 라벨 (eyebrow/pretitle). 대문자 + 넓은 자간. */
export function Eyebrow({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLParagraphElement> & { children: ReactNode }) {
  const c = useColors();
  return (
    <p
      className={`text-xs sm:text-sm tracking-[0.3em] mb-3 ${c.muted} ${className}`}
      {...rest}
    >
      {children}
    </p>
  );
}

/** 인용구 */
export function Quote({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLQuoteElement> & { children: ReactNode }) {
  const c = useColors();
  return (
    <blockquote
      className={`italic text-sm sm:text-base md:text-lg leading-relaxed border-l-2 pl-4 ${c.body} ${c.divider} ${className}`}
      {...rest}
    >
      {children}
    </blockquote>
  );
}

// ─────────────────────────────────────────────────────────────
// 레이아웃 컨테이너
// ─────────────────────────────────────────────────────────────

interface SectionProps extends HTMLAttributes<HTMLElement> {
  width?: "prose" | "narrow" | "wide";
  padding?: "compact" | "normal" | "loose";
}

const SECTION_WIDTH = {
  prose: "max-w-3xl",
  narrow: "max-w-4xl",
  wide: "max-w-6xl",
} as const;

const SECTION_PADDING = {
  compact: "py-6 sm:py-10 px-4 sm:px-6",
  normal: "py-10 sm:py-16 px-4 sm:px-6 md:px-8",
  loose: "py-14 sm:py-24 px-4 sm:px-6 md:px-8",
} as const;

/** 전체 섹션 래퍼. 가로 정렬 + 세로 간격 + 콘텐츠 최대폭. */
export function Section({
  width = "wide",
  padding = "normal",
  className = "",
  children,
  ...rest
}: SectionProps & { children: ReactNode }) {
  return (
    <section className={`w-full ${SECTION_PADDING[padding]} ${className}`} {...rest}>
      <div className={`${SECTION_WIDTH[width]} mx-auto`}>{children}</div>
    </section>
  );
}

/** 좁은 단 프로즈 컨테이너 (가운데 정렬 용이). */
export function ProseContainer({
  className = "",
  children,
}: { className?: string; children: ReactNode }) {
  return (
    <div className={`max-w-3xl mx-auto px-4 sm:px-6 ${className}`}>{children}</div>
  );
}

/** 글라스모피즘 카드. 라운드 + 반응형 패딩 내장. */
export function CardContainer({
  className = "",
  children,
  padding = "normal",
}: {
  className?: string;
  children: ReactNode;
  padding?: "compact" | "normal" | "loose";
}) {
  const c = useColors();
  const pad =
    padding === "compact"
      ? "p-4 sm:p-5"
      : padding === "loose"
        ? "p-6 sm:p-10"
        : "p-5 sm:p-8";
  return (
    <div
      className={`${pad} rounded-lg sm:rounded-xl border ${c.glass} ${c.border} ${className}`}
    >
      {children}
    </div>
  );
}

/** 카드 그리드. 기본 1-col, md에서 N-col. */
export function CardGrid({
  cols = 3,
  gap = "normal",
  className = "",
  children,
}: {
  cols?: 2 | 3 | 4;
  gap?: "compact" | "normal";
  className?: string;
  children: ReactNode;
}) {
  const colsCls =
    cols === 2
      ? "md:grid-cols-2"
      : cols === 4
        ? "sm:grid-cols-2 md:grid-cols-4"
        : "sm:grid-cols-2 md:grid-cols-3";
  const gapCls = gap === "compact" ? "gap-3 sm:gap-4" : "gap-4 sm:gap-6";
  return (
    <div className={`grid grid-cols-1 ${colsCls} ${gapCls} ${className}`}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 장식
// ─────────────────────────────────────────────────────────────

/** 가로 divider. 프로즈 섹션 상단에 배치해 구역 구분. */
export function Divider({
  className = "",
  align = "center",
  width = "sm",
}: {
  className?: string;
  align?: "left" | "center";
  width?: "sm" | "md" | "lg";
}) {
  const c = useColors();
  const w = width === "sm" ? "w-12" : width === "md" ? "w-20" : "w-32";
  const m = align === "center" ? "mx-auto" : "ml-0";
  return (
    <div className={`${w} h-px mb-4 sm:mb-5 ${m} ${c.divider} border-t ${className}`} />
  );
}
