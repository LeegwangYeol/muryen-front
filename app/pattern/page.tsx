import type { Metadata } from "next";
import PatternPage from "../component/patten-page";
import { BreadcrumbJsonLd } from "../component/breadcrumb-jsonld";
import { ArticleJsonLd } from "../component/article-jsonld";

const PUBLISHED = "2026-01-01T00:00:00+09:00";
const MODIFIED = "2026-04-23T00:00:00+09:00";

export const metadata: Metadata = {
  title: "투로 · 24반 무예 형(形)",
  description:
    "본국검·쌍수도·제독검·월도 등 무예도보통지 투로(형)를 수련하며 기법의 맥락을 읽는 방법.",
  alternates: { canonical: "/pattern" },
  openGraph: {
    type: "article",
    title: "투로 · 24반 무예 형(形) | 무련",
    description: "본국검·쌍수도·제독검·월도 투로 — 조선 검술 형(形)의 수련.",
    url: "/pattern",
    siteName: "무련",
    locale: "ko_KR",
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
    authors: ["무련"],
    section: "투로",
    tags: ["투로", "24반 무예", "본국검", "쌍수도", "제독검", "월도", "형"],
    images: [{ url: "/images/announce/gumiAllone.webp", alt: "무련 투로 수련" }],
  },
};

export default function Pattern() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "투로", path: "/pattern" }]} />
      <ArticleJsonLd
        headline="투로 · 24반 무예 형(形)"
        description="본국검·쌍수도·제독검·월도 등 무예도보통지 투로(형)를 수련하며 기법의 맥락을 읽는 방법."
        path="/pattern"
        datePublished={PUBLISHED}
        dateModified={MODIFIED}
        section="투로"
        tags={["투로", "24반 무예", "본국검", "쌍수도", "제독검", "월도", "형"]}
      />
      <PatternPage />
    </>
  );
}
