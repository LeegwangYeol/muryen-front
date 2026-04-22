import type { Metadata } from "next";
import Equipment from "../component/equipment";

export const metadata: Metadata = {
  title: "전통 무기·갑주 · 장비 소개",
  description:
    "두정갑·목검·목창·대도 등 24반 무예 수련에 쓰이는 전통 병기와 방호구를 소개합니다.",
  alternates: { canonical: "/equipment" },
  openGraph: {
    title: "전통 무기·갑주 · 장비 소개 | 무련",
    description: "두정갑·목검·목창 — 무련이 쓰는 조선 전통 병기와 갑주.",
    url: "/equipment",
  },
};

export default function EquipmentPage() {
  return <Equipment />;
}
