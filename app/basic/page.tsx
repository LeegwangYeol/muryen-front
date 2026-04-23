import type { Metadata } from "next";
import BasicPage from "../component/basic-page";
import { BreadcrumbJsonLd } from "../component/breadcrumb-jsonld";
import { ArticleJsonLd } from "../component/article-jsonld";

const PUBLISHED = "2026-01-01T00:00:00+09:00";
const MODIFIED = "2026-04-23T00:00:00+09:00";

export const metadata: Metadata = {
  title: "24반 무예 기본기",
  description:
    "검·창·봉 기본 자세부터 호흡·보법까지 — 24반 무예의 토대가 되는 기본기 수련 가이드.",
  alternates: { canonical: "/basic" },
  openGraph: {
    type: "article",
    title: "24반 무예 기본기 수련 | 무련",
    description: "검·창·봉 기본 자세와 보법·호흡 — 무련의 기본기 수련법.",
    url: "/basic",
    siteName: "무련",
    locale: "ko_KR",
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
    authors: ["무련"],
    section: "기본기",
    tags: ["기본기", "24반 무예", "검술", "창술", "봉술", "보법", "호흡"],
    images: [{ url: "/images/announce/gumiAllone.webp", alt: "무련 24반 무예 기본기" }],
  },
};

export default function Basic() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "기본기", path: "/basic" }]} />
      <ArticleJsonLd
        headline="24반 무예 기본기 — 검·창·봉"
        description="검·창·봉 기본 자세부터 호흡·보법까지 — 24반 무예의 토대가 되는 기본기 수련 가이드."
        path="/basic"
        datePublished={PUBLISHED}
        dateModified={MODIFIED}
        section="기본기"
        tags={["기본기", "24반 무예", "검술", "창술", "봉술", "보법", "호흡"]}
      />
      <BasicPage />
    </>
  );
}
