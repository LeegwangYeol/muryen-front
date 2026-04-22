import type { Metadata } from "next";
import CuttingPage from "../component/cutting-page";

export const metadata: Metadata = {
  title: "베기 · 조선 검술 실전 기법",
  description:
    "본국검·쌍수도로 짚단·대나무 베기를 통해 검의 궤적과 타격 원리를 체화하는 24반 무예 수련법.",
  alternates: { canonical: "/cutting" },
  openGraph: {
    title: "베기 · 조선 검술 실전 기법 | 무련",
    description: "짚단·대나무 베기 — 조선 검술의 궤적과 타격 원리.",
    url: "/cutting",
  },
};

export default function Cutting() {
  return <CuttingPage />;
}
