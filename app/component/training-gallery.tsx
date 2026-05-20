"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Section,
  SectionHeading,
  Eyebrow,
  Body,
} from "@/components/ui/typography";

type Cat = "전체" | "갑주 대련" | "검술 시범" | "대회" | "단체" | "인물";

type Photo = {
  src: string;
  alt: string;
  caption: string;
  cat: Exclude<Cat, "전체">;
  span?: "lg" | "md";
};

const photos: Photo[] = [
  // 갑주 대련 — 한강 다리 아래 야간 검술
  { src: "/images/gallery/galju-spar-01.webp", alt: "한강 다리 아래 갑주 검 대련 — 두 명이 검을 맞대고 선 액션 컷", caption: "갑주 대련 · 한강", cat: "갑주 대련", span: "lg" },
  { src: "/images/gallery/galju-spar-02.webp", alt: "갑주를 입은 두 수련생이 검을 마주 댄 순간", caption: "갑주 대련", cat: "갑주 대련" },
  { src: "/images/gallery/galju-spar-03.webp", alt: "갑주 대련 자세 — 한 명이 무릎을 굽혀 낮은 자세", caption: "낮은 자세 공방", cat: "갑주 대련" },
  { src: "/images/gallery/galju-spar-04.webp", alt: "갑주 대련 — 두 검이 교차하는 순간", caption: "교차 공방", cat: "갑주 대련" },
  { src: "/images/gallery/galju-spar-05.webp", alt: "갑주 대련 — 검이 부딪치는 격검", caption: "격검", cat: "갑주 대련" },
  { src: "/images/gallery/galju-spar-06.webp", alt: "갑주 대련 — 거리 조절 중인 두 수련생", caption: "거리 조절", cat: "갑주 대련" },
  // 갑주 — 야간 항만 시리즈 (기존)
  { src: "/images/photos/galju-spar-1.webp", alt: "야간 항만에서의 갑주 대련 — 두 수련생이 검을 들고 마주섬", caption: "야간 갑주 대련", cat: "갑주 대련" },
  { src: "/images/photos/galju-archer.webp", alt: "갑주 차림의 수련생이 활시위를 당기는 야간 장면", caption: "갑주 + 궁시", cat: "갑주 대련" },
  { src: "/images/photos/galju-solo-night.webp", alt: "야간 갑주 차림 단독 — 활을 든 강한 인물 컷", caption: "야간 단독", cat: "갑주 대련" },
  { src: "/images/photos/galju-pair-dock.webp", alt: "야간 부두 위 갑주 두 명 풀샷", caption: "부두 위 두 무사", cat: "갑주 대련" },

  // 검술 시범 — 24반 무예 대회 단독 자세
  { src: "/images/gallery/pattern-demo-01.webp", alt: "검술 시범 — 검을 머리 위로 들어올린 자세", caption: "올려베기 자세", cat: "검술 시범", span: "lg" },
  { src: "/images/gallery/pattern-demo-02.webp", alt: "검술 시범 — 도복 차림으로 정자세", caption: "정자세", cat: "검술 시범" },
  { src: "/images/gallery/pattern-demo-03.webp", alt: "검술 시범 — 검을 들고 회전", caption: "회전 동작", cat: "검술 시범" },
  { src: "/images/gallery/pattern-demo-04.webp", alt: "검술 시범 — 보랏빛 도복 + 검을 가슴 앞에", caption: "안정된 자세", cat: "검술 시범" },
  { src: "/images/gallery/pattern-demo-05.webp", alt: "검술 시범 — 보랏빛 도복으로 검을 들어 올림", caption: "들어 올리기", cat: "검술 시범" },
  // 검술 대회 시범 (45 series)
  { src: "/images/gallery/pattern-comp-01.webp", alt: "24반 무예 대회 — 검술 시범 자세", caption: "대회 시범 1", cat: "검술 시범" },
  { src: "/images/gallery/pattern-comp-02.webp", alt: "24반 무예 대회 — 검을 가슴 앞으로", caption: "대회 시범 2", cat: "검술 시범" },
  { src: "/images/gallery/pattern-comp-03.webp", alt: "24반 무예 대회 — 검을 들어 올리는 자세", caption: "대회 시범 3", cat: "검술 시범" },

  // 대회 (24반 무예 전국대회)
  { src: "/images/gallery/tournament-01.webp", alt: "24반 무예 전국대회 — 다양한 색의 갑주와 도복을 입은 무예인들", caption: "전국대회 정렬", cat: "대회" },
  { src: "/images/gallery/tournament-02.webp", alt: "24반 무예 대회 입장 — 화려한 갑주 단독", caption: "대회 입장", cat: "대회", span: "lg" },
  { src: "/images/gallery/tournament-03.webp", alt: "24반 무예 대회 — 빨간색·파란색 한복 단체", caption: "대회 정렬 라인업", cat: "대회" },
  // 기존 시연
  { src: "/images/photos/muye-line.webp", alt: "수원 화성 신풍루 야간 시연 — 24반 무예인들이 도복 차림으로 무기를 들고 정렬", caption: "신풍루 야간 시연", cat: "대회" },
  { src: "/images/photos/palace-demo.webp", alt: "궁궐 야간 시연 — 도복을 입은 24반 무예인들의 단체 자세", caption: "궁궐 시연", cat: "대회" },

  // 단체
  { src: "/images/gallery/group-sea-01.webp", alt: "빨간 한복 4명 단체 — 바다 배경", caption: "바다 앞 단체", cat: "단체" },
  { src: "/images/gallery/group-tent-01.webp", alt: "그늘 막사 안에서 빨간 한복 차림 3명", caption: "막사 휴식", cat: "단체" },
  { src: "/images/gallery/group-banner.webp", alt: "무예 대회 현수막 앞 단체 — 도복 차림", caption: "대회 현수막", cat: "단체" },
  { src: "/images/gallery/rest-group.webp", alt: "대회장 휴식 — 도복 차림으로 V 사인", caption: "대회장 휴식", cat: "단체" },
  // 기존 깃발
  { src: "/images/photos/suwon-flag.webp", alt: "수원 화성 성벽 위에서 깃발을 들고 선 도복 차림의 수련생들", caption: "성벽 위의 깃발", cat: "단체" },

  // 인물 (시각 포트레이트)
  { src: "/images/gallery/portrait-trio.webp", alt: "수원 화성을 배경으로 한 갑주 3인 포트레이트", caption: "성루 앞 세 사람", cat: "인물", span: "lg" },
  { src: "/images/photos/archer-stance.webp", alt: "수련 자세 — 갑주를 입고 활을 든 정자세", caption: "갑주 + 궁시 자세", cat: "인물" },
];

const cats: Cat[] = ["전체", "갑주 대련", "검술 시범", "대회", "단체", "인물"];

export default function TrainingGallery() {
  const [active, setActive] = useState<Cat>("전체");
  const filtered = useMemo(
    () => (active === "전체" ? photos : photos.filter((p) => p.cat === active)),
    [active]
  );

  return (
    <Section width="wide" padding="loose">
      <div className="text-center mb-8 sm:mb-12">
        <Eyebrow className="mb-3 text-center">REAL TRAINING</Eyebrow>
        <SectionHeading align="center" size="lg" className="mb-3 sm:mb-4">
          실제 수련 현장
        </SectionHeading>
        <Body size="sm" muted className="max-w-2xl mx-auto">
          연출이 아닌, 무련의 실제 수련·시연·대련 장면입니다.
        </Body>
      </div>

      {/* 카테고리 필터 */}
      <nav
        className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8"
        aria-label="사진 카테고리"
      >
        {cats.map((c) => {
          const isActive = c === active;
          const count = c === "전체" ? photos.length : photos.filter((p) => p.cat === c).length;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm rounded-full border transition-colors min-h-[40px] sm:min-h-0 ${
                isActive
                  ? "bg-[rgb(var(--accent))] text-white border-[rgb(var(--accent))] font-semibold"
                  : "border-current/20 hover:bg-current/5"
              }`}
            >
              {c}
              <span className="opacity-70 text-[0.85em]">({count})</span>
            </button>
          );
        })}
      </nav>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {filtered.map((p, i) => (
          <motion.figure
            key={p.src}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: (i % 6) * 0.04 }}
            className={`relative overflow-hidden rounded-lg sm:rounded-xl border border-current/10 group ${
              p.span === "lg"
                ? "col-span-2 row-span-2 aspect-square sm:aspect-[4/3]"
                : "aspect-square sm:aspect-[4/3]"
            }`}
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-3 py-2 text-white text-xs sm:text-sm font-medium">
              {p.caption}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </Section>
  );
}
