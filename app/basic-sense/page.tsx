import type { Metadata } from "next";
import Muye24Introduction from "../component/intro-basic";
import { BreadcrumbJsonLd } from "../component/breadcrumb-jsonld";

const PUBLISHED = "2026-01-01T00:00:00+09:00";
const MODIFIED = "2026-04-23T00:00:00+09:00";

export const metadata: Metadata = {
  title: "24반 무예 소개 · 무예도보통지 24기",
  description:
    "조선 정조 때 편찬된 무예도보통지(1790)의 24가지 국방무예를 소개합니다. 지상무예 18기 + 마상무예 6기 — 수원 화성 장용영 군사들이 수련한 조선의 실전 무예.",
  alternates: { canonical: "/basic-sense" },
  openGraph: {
    type: "article",
    title: "24반 무예 소개 · 무예도보통지 24기 | 무련",
    description:
      "무예도보통지 24가지 국방무예 — 지상 18기 · 마상 6기. 무련이 잇는 조선 전통 무예의 전모.",
    url: "/basic-sense",
    siteName: "무련",
    locale: "ko_KR",
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
    authors: ["무련"],
    section: "24반 무예",
    tags: ["24반 무예", "무예도보통지", "조선 무예", "장용영", "수원 화성", "지상무예", "마상무예"],
    images: [{ url: "/images/announce/gumiAllone.webp", alt: "무련 24반 무예 소개" }],
  },
};

export default function BasicSensePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "24반 무예 소개", path: "/basic-sense" }]} />
      <Muye24Introduction />
    </>
  );
}
