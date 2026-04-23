import { SITE } from "@/lib/contact";

interface FeedItem {
  title: string;
  link: string;
  description: string;
  category?: string;
  pubDate?: Date;
}

// 공개된 주요 페이지를 RSS 아이템으로 노출.
// 향후 블로그/소식 페이지 생기면 이 배열에 추가 또는 동적 소스 연결.
function getItems(): FeedItem[] {
  const base = SITE.url;
  const now = new Date();
  return [
    {
      title: "무련 — 조선 24반 무예 · 갑주 대련 · 대학경당 계보",
      link: `${base}/`,
      description:
        "조선 24반 무예를 갑주 입고 대련합니다. 대학경당 계보를 잇는 서울 수련 동호회 '무련'. 회비 무료, 숙련도 무관, 주말 수련.",
      category: "소개",
      pubDate: now,
    },
    {
      title: "갑주 대련 · 조선 무예 실전 수련",
      link: `${base}/sparring`,
      description:
        "두정갑을 입고 실제 타격이 오가는 갑주 대련 — 시연이 아닌 실전. 대학경당 계보를 잇는 무련의 대련 방식과 철학.",
      category: "대련",
      pubDate: now,
    },
    {
      title: "24반 무예 소개 · 무예도보통지 24기",
      link: `${base}/basic-sense`,
      description:
        "무예도보통지(1790)에 수록된 24가지 국방무예 — 지상무예 18기 + 마상무예 6기. 수원 화성 장용영 군사들이 수련한 조선의 실전 무예.",
      category: "24반 무예",
      pubDate: now,
    },
    {
      title: "24반 무예 기본기 — 검·창·봉",
      link: `${base}/basic`,
      description:
        "검·창·봉 기본 자세부터 호흡·보법까지. 24반 무예의 토대가 되는 기본기 수련 가이드.",
      category: "기본기",
      pubDate: now,
    },
    {
      title: "투로 · 24반 무예 형(形)",
      link: `${base}/pattern`,
      description:
        "본국검·쌍수도·제독검·월도 등 무예도보통지 투로(형)를 수련하며 기법의 맥락을 읽는 방법.",
      category: "투로",
      pubDate: now,
    },
    {
      title: "베기 · 조선 검술 실전 기법",
      link: `${base}/cutting`,
      description:
        "본국검·쌍수도로 짚단·대나무 베기를 통해 검의 궤적과 타격 원리를 체화하는 24반 무예 수련법.",
      category: "베기",
      pubDate: now,
    },
    {
      title: "전통 무기·갑주 · 장비 소개",
      link: `${base}/equipment`,
      description:
        "두정갑·목검·목창·대도 등 24반 무예 수련에 쓰이는 전통 병기와 방호구를 소개합니다.",
      category: "장비",
      pubDate: now,
    },
    {
      title: "참고 자료 · 무예도보통지",
      link: `${base}/reference`,
      description:
        "무예도보통지(1790) 원전과 현대 복원 연구, 관련 문헌을 모은 무련의 참고 자료실.",
      category: "참고",
      pubDate: now,
    },
  ];
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(d: Date): string {
  return d.toUTCString();
}

export async function GET(): Promise<Response> {
  const items = getItems();
  const lastBuildDate = toRfc822(new Date());

  const itemsXml = items
    .map((item) => {
      const pub = item.pubDate ? toRfc822(item.pubDate) : lastBuildDate;
      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
      <description><![CDATA[${item.description}]]></description>${
        item.category ? `\n      <category>${escapeXml(item.category)}</category>` : ""
      }
      <pubDate>${pub}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE.name)} — 24반 무예 · 갑주 대련</title>
    <link>${escapeXml(SITE.url)}</link>
    <atom:link href="${escapeXml(SITE.url)}/feed.xml" rel="self" type="application/rss+xml" />
    <description><![CDATA[${SITE.description}]]></description>
    <language>ko-KR</language>
    <copyright>© ${new Date().getFullYear()} 무련 (武聯)</copyright>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <ttl>1440</ttl>
    <image>
      <url>${escapeXml(SITE.url)}/images/announce/gumiAllone.webp</url>
      <title>${escapeXml(SITE.name)}</title>
      <link>${escapeXml(SITE.url)}</link>
    </image>
${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
