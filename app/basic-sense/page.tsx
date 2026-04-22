import type { Metadata } from "next";
import Muye24Introduction from "../component/intro-basic";

export const metadata: Metadata = {
  title: "24반 무예 소개 · 무예도보통지 24기",
  description:
    "조선 정조 때 편찬된 무예도보통지(1790)의 24가지 국방무예를 소개합니다. 지상무예 18기 + 마상무예 6기 — 수원 화성 장용영 군사들이 수련한 조선의 실전 무예.",
  alternates: { canonical: "/basic-sense" },
  openGraph: {
    title: "24반 무예 소개 · 무예도보통지 24기 | 무련",
    description:
      "무예도보통지 24가지 국방무예 — 지상 18기 · 마상 6기. 무련이 잇는 조선 전통 무예의 전모.",
    url: "/basic-sense",
  },
};

export default function BasicSensePage() {
  return <Muye24Introduction />;
}
