import type { Metadata } from "next";
import SparringPage from "../component/sparring-page";

export const metadata: Metadata = {
  title: "갑주 대련 · 조선 무예 실전 수련",
  description:
    "두정갑을 입고 실제 타격이 오가는 갑주 대련 — 시연이 아닌 실전. 대학경당 계보를 잇는 무련의 대련 방식과 철학을 소개합니다.",
  alternates: { canonical: "/sparring" },
  openGraph: {
    title: "갑주 대련 · 조선 무예 실전 수련 | 무련",
    description:
      "조선 24반 무예 실전 대련 — 두정갑·목검·목창. 대학경당 계보 서울 수련 모임 무련.",
    url: "/sparring",
  },
};

export default function Sparring() {
  return <SparringPage />;
}
