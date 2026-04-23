import type { Metadata } from "next";
import HomeClient from "./component/home-client";

export const metadata: Metadata = {
  title: {
    absolute: "무련 — 武로 緣을 잇다 | 24반 무예 · 갑주 대련 · 대학경당 계보",
  },
  description:
    "조선 24반 무예를 갑주 입고 대련합니다. 대학경당 계보를 잇는 서울 수련 동호회 '무련'. 회비 무료, 숙련도 무관, 주말 수련. 무예도보통지에 수록된 24가지 국방무예를 복원합니다.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "무련 — 武로 緣을 잇다 | 24반 무예 · 갑주 대련",
    description:
      "조선 24반 무예를 갑주 입고 대련합니다. 대학경당 계보를 잇는 서울 수련 동호회. 회비 무료·숙련도 무관.",
    url: "/",
  },
};

export default function Home() {
  return <HomeClient />;
}
