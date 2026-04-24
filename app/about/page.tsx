import type { Metadata } from "next";
import AboutPage from "@/app/component/about-page";
import { SITE } from "@/lib/contact";

export const metadata: Metadata = {
  title: "소개 — 무련 · 24반 무예경당협회 · 무예도보통지",
  description:
    "무련은 무예도보통지를 바탕으로 24반 무예를 수련하는 사회인 동아리입니다. 대학경당에서 이어진 계보와 조선 정조 때 편찬된 공식 군사 무예서의 전통을 소개합니다.",
  alternates: { canonical: `${SITE.url}/about` },
  openGraph: {
    title: "소개 | 무련",
    description:
      "무련 · 24반 무예경당협회 · 무예도보통지 · 도보통지 속 기예를 한 페이지에서.",
    url: `${SITE.url}/about`,
  },
};

export default function Page() {
  return <AboutPage />;
}
