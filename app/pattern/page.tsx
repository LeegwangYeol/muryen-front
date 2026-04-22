import type { Metadata } from "next";
import PatternPage from "../component/patten-page";

export const metadata: Metadata = {
  title: "투로 · 24반 무예 형(形)",
  description:
    "본국검·쌍수도·제독검·월도 등 무예도보통지 투로(형)를 수련하며 기법의 맥락을 읽는 방법.",
  alternates: { canonical: "/pattern" },
  openGraph: {
    title: "투로 · 24반 무예 형(形) | 무련",
    description: "본국검·쌍수도·제독검·월도 투로 — 조선 검술 형(形)의 수련.",
    url: "/pattern",
  },
};

export default function Pattern() {
  return <PatternPage />;
}
