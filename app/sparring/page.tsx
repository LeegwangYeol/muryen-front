import type { Metadata } from "next";
import SparringPage from "../component/sparring-page";

const PUBLISHED = "2026-01-01T00:00:00+09:00";
const MODIFIED = "2026-04-23T00:00:00+09:00";

export const metadata: Metadata = {
  title: "갑주 대련 · 조선 무예 실전 수련",
  description:
    "두정갑을 입고 실제 타격이 오가는 갑주 대련 — 시연이 아닌 실전. 대학경당 계보를 잇는 무련의 대련 방식과 철학을 소개합니다.",
  alternates: { canonical: "/sparring" },
  openGraph: {
    type: "article",
    title: "갑주 대련 · 조선 무예 실전 수련 | 무련",
    description:
      "조선 24반 무예 실전 대련 — 두정갑·목검·목창. 대학경당 계보 서울 수련 모임 무련.",
    url: "/sparring",
    siteName: "무련",
    locale: "ko_KR",
    publishedTime: PUBLISHED,
    modifiedTime: MODIFIED,
    authors: ["무련"],
    section: "갑주 대련",
    tags: ["갑주 대련", "24반 무예", "무예도보통지", "조선 무예", "대학경당", "실전 대련"],
    images: [
      {
        url: "/images/announce/gumiAllone.webp",
        alt: "무련 갑주 대련",
      },
    ],
  },
};

export default function Sparring() {
  return <SparringPage />;
}
