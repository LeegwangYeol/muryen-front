import { SITE } from "@/lib/contact";

interface ArticleJsonLdProps {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  section: string;
  tags: string[];
  image?: string;
}

/**
 * Article JSON-LD 구조화 데이터.
 * 구글이 콘텐츠를 "기사"로 인식해 리치 스니펫·뉴스 캐러셀에 노출될 가능성을 높입니다.
 */
export function ArticleJsonLd({
  headline,
  description,
  path,
  datePublished,
  dateModified,
  section,
  tags,
  image = "/images/announce/gumiAllone.webp",
}: ArticleJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE.url}${path}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}${path}` },
    headline,
    description,
    image: [`${SITE.url}${image}`],
    datePublished,
    dateModified,
    articleSection: section,
    keywords: tags.join(", "),
    author: { "@id": `${SITE.url}/#organization` },
    publisher: { "@id": `${SITE.url}/#organization` },
    inLanguage: "ko-KR",
    isPartOf: { "@id": `${SITE.url}/#website` },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
