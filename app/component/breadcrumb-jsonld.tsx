import { SITE } from "@/lib/contact";

interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * 서브 페이지 상단에 BreadcrumbList 구조화 데이터를 삽입합니다.
 * 구글 SERP에서 "무련 > 대련" 같은 경로가 페이지 제목 위에 표시됩니다.
 *
 * Usage:
 *   <BreadcrumbJsonLd items={[{ name: "대련", path: "/sparring" }]} />
 *   // 홈은 자동으로 1번 아이템으로 prepend됩니다.
 */
export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const full: BreadcrumbItem[] = [{ name: "무련", path: "/" }, ...items];

  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: full.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path === "/" ? "" : item.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
