"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Section,
  SectionHeading,
  Eyebrow,
  Body,
} from "@/components/ui/typography";
import PhotoGrid from "./photo-grid";
import { photos } from "@/lib/photos";

/**
 * 홈 페이지 갤러리 티저.
 * - 전체 사진 중 `hero: true` 로 표시된 8장 안팎만 노출
 * - 필터 없이 깔끔하게 모자이크
 * - 하단에 "사진첩 전체 보기 →" CTA → /gallery
 */
export default function TrainingGallery() {
  const heroPhotos = photos.filter((p) => p.hero);

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

      <PhotoGrid photos={heroPhotos} showFilter={false} />

      <div className="mt-8 sm:mt-10 flex justify-center">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-current/30 hover:bg-current/5 transition-colors text-sm sm:text-base font-semibold"
        >
          사진첩 전체 보기 ({photos.length}장)
          <ArrowRight size={16} />
        </Link>
      </div>
    </Section>
  );
}
