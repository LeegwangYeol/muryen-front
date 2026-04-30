"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTheme } from "@/app/context/theme-context";

interface PageCTAProps {
  /** 카피 — 기본: "함께 수련하실래요?" */
  title?: string;
  /** 보조 한 줄 — 기본: "회비 무료 · 숙련도 무관 · 주말 수련" */
  subtitle?: string;
  /** 버튼 라벨 — 기본: "입회 안내 보기" */
  buttonLabel?: string;
  /** 이동할 경로 — 기본: "/#inquiry" */
  href?: string;
}

/**
 * 모든 디테일 페이지(기본기/투로/베기/대련/참고자료) 끝에 등장하는
 * 통일된 입회 안내 CTA. 깊이 있는 본문을 다 읽은 사용자가 자연스럽게
 * 다음 행동(가입 문의)으로 이어지도록 안내한다.
 */
export function PageCTA({
  title = "함께 수련해보시겠습니까?",
  subtitle = "회비 무료 · 숙련도 무관 · 매주 주말 수련",
  buttonLabel = "입회 안내 보기",
  href = "/#inquiry",
}: PageCTAProps = {}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      className={`mt-16 sm:mt-24 mx-auto max-w-3xl px-4 sm:px-6 text-center`}
      aria-label="입회 안내로 이동"
    >
      <div
        className={`rounded-2xl p-6 sm:p-10 border ${
          isDark
            ? "bg-white/5 border-white/15 text-white"
            : "bg-gray-900/[0.03] border-gray-300 text-gray-900"
        }`}
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">
          {title}
        </h2>
        <p
          className={`text-sm sm:text-base mb-5 sm:mb-7 ${
            isDark ? "text-white/75" : "text-gray-600"
          }`}
        >
          {subtitle}
        </p>
        <Link
          href={href}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm sm:text-base shadow-md transition-colors ${
            isDark
              ? "bg-white text-gray-900 hover:bg-white/90"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          {buttonLabel}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
