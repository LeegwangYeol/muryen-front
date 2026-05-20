import type { Metadata } from "next";
import { MainLayout } from "@/components/layout/main-layout";
import PhotoGrid from "@/app/component/photo-grid";
import { PageCTA } from "@/components/layout/page-cta";
import {
  PageHeading,
  Body,
  Eyebrow,
} from "@/components/ui/typography";
import { BreadcrumbJsonLd } from "@/app/component/breadcrumb-jsonld";
import { SITE } from "@/lib/contact";
import { photos } from "@/lib/photos";

const OG_IMAGE = "/images/gallery/galju-spar-01.webp";

export const metadata: Metadata = {
  title: "사진첩 — 무련의 실제 수련·대련·시연",
  description:
    "무련(武緣)의 실제 수련 현장 사진 모음 — 갑주 대련, 24반 검술 시범, 대회 시연, 단체 사진까지. 회비 무료, 매주 주말 수련.",
  alternates: { canonical: `${SITE.url}/gallery` },
  openGraph: {
    type: "website",
    title: "사진첩 | 무련",
    description: "무련(武緣)의 실제 수련 현장 사진 모음 — 갑주 대련·24반 검술·대회 시연.",
    url: `${SITE.url}/gallery`,
    siteName: SITE.name,
    locale: "ko_KR",
    images: [{ url: OG_IMAGE, alt: "무련 갑주 대련 — 한강" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "사진첩 | 무련",
    description: "무련(武緣)의 실제 수련 현장 사진 모음.",
    images: [{ url: OG_IMAGE, alt: "무련 갑주 대련 — 한강" }],
  },
};

export default function GalleryPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "사진첩", path: "/gallery" }]} />
      <MainLayout>
        <div className="container mx-auto px-4 py-6 sm:py-10">
          <div className="text-center mb-8 sm:mb-12 max-w-2xl mx-auto">
            <Eyebrow className="mb-3 text-center">REAL TRAINING</Eyebrow>
            <PageHeading size="lg" className="mb-3 sm:mb-4">
              사진첩
            </PageHeading>
            <Body size="base" className="mb-2">
              연출이 아닌, 무련의 실제 수련·시연·대련 장면입니다.
            </Body>
            <Body size="xs" muted>
              총 {photos.length}장 · 카테고리별로 필터 가능
            </Body>
          </div>

          <PhotoGrid />

          <div className="mt-12 sm:mt-16">
            <PageCTA
              title="이런 수련에 함께해보시겠습니까?"
              subtitle="회비 무료 · 숙련도 무관 · 매주 주말"
              buttonLabel="입회 안내 보기"
            />
          </div>
        </div>
      </MainLayout>
    </>
  );
}
