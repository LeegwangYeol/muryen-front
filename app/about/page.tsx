import type { Metadata } from "next";
import AboutPage from "@/app/component/about-page";
import { BreadcrumbJsonLd } from "@/app/component/breadcrumb-jsonld";
import { ArticleJsonLd } from "@/app/component/article-jsonld";
import { SITE } from "@/lib/contact";

const OG_IMAGE = "/images/announce/gumiAllone.webp";
const PUBLISHED = "2026-04-24T00:00:00+09:00";
const MODIFIED = "2026-04-27T00:00:00+09:00";

export const metadata: Metadata = {
  title: "소개 — 무련 · 24반 무예경당협회 · 무예도보통지",
  description:
    "무련은 무예도보통지를 바탕으로 24반 무예를 수련하는 사회인 동아리입니다. 대학경당에서 이어진 계보와 조선 정조 때 편찬된 공식 군사 무예서의 전통을 소개합니다.",
  alternates: { canonical: `${SITE.url}/about` },
  openGraph: {
    type: "article",
    title: "소개 | 무련",
    description:
      "무련 · 24반 무예경당협회 · 무예도보통지 · 도보통지 속 기예를 한 페이지에서.",
    url: `${SITE.url}/about`,
    siteName: SITE.name,
    locale: "ko_KR",
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
    authors: ["무련"],
    section: "소개",
    tags: ["무련", "24반 무예", "무예도보통지", "대학경당", "조선 무예"],
    images: [{ url: OG_IMAGE, alt: "무련 소개" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "소개 | 무련",
    description:
      "무련 · 24반 무예경당협회 · 무예도보통지 · 도보통지 속 기예.",
    images: [OG_IMAGE],
  },
};

export default function Page() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "소개", path: "/about" }]} />
      <ArticleJsonLd
        headline="소개 — 무련 · 24반 무예경당협회 · 무예도보통지"
        description="무련은 무예도보통지를 바탕으로 24반 무예를 수련하는 사회인 동아리입니다. 대학경당 계보·조선 정조의 공식 군사 무예서를 소개합니다."
        path="/about"
        datePublished={PUBLISHED}
        dateModified={MODIFIED}
        section="소개"
        tags={["무련", "24반 무예", "무예도보통지", "대학경당", "조선 무예"]}
      />
      <AboutPage />
    </>
  );
}
