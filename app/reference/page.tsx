import type { Metadata } from "next";
import ReferencePage from "../component/reference-page";

export const metadata: Metadata = {
  title: "참고 자료 · 무예도보통지",
  description:
    "무예도보통지(1790) 원전과 현대 복원 연구, 관련 문헌을 모은 무련의 참고 자료실.",
  alternates: { canonical: "/reference" },
  openGraph: {
    title: "참고 자료 · 무예도보통지 | 무련",
    description: "무예도보통지 원전과 복원 연구 자료.",
    url: "/reference",
  },
};

export default function Reference() {
  return <ReferencePage />;
}
