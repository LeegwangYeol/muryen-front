import type { Metadata } from "next";
import CuttingPage from "../component/cutting-page";
import { BreadcrumbJsonLd } from "../component/breadcrumb-jsonld";

const PUBLISHED = "2026-01-01T00:00:00+09:00";
const MODIFIED = "2026-04-23T00:00:00+09:00";

export const metadata: Metadata = {
  title: "베기 · 조선 검술 실전 기법",
  description:
    "본국검·쌍수도로 짚단·대나무 베기를 통해 검의 궤적과 타격 원리를 체화하는 24반 무예 수련법.",
  alternates: { canonical: "/cutting" },
  openGraph: {
    type: "article",
    title: "베기 · 조선 검술 실전 기법 | 무련",
    description: "짚단·대나무 베기 — 조선 검술의 궤적과 타격 원리.",
    url: "/cutting",
    siteName: "무련",
    locale: "ko_KR",
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
    authors: ["무련"],
    section: "베기",
    tags: ["베기", "검술", "본국검", "쌍수도", "짚단", "대나무", "24반 무예"],
    images: [{ url: "/images/announce/gumiAllone.webp", alt: "무련 베기 수련" }],
  },
};

export default function Cutting() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "베기", path: "/cutting" }]} />
      <CuttingPage />
    </>
  );
}
