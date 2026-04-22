import type { Metadata } from "next";
import BasicPage from "../component/basic-page";

export const metadata: Metadata = {
  title: "24반 무예 기본기",
  description:
    "검·창·봉 기본 자세부터 호흡·보법까지 — 24반 무예의 토대가 되는 기본기 수련 가이드.",
  alternates: { canonical: "/basic" },
  openGraph: {
    title: "24반 무예 기본기 수련 | 무련",
    description: "검·창·봉 기본 자세와 보법·호흡 — 무련의 기본기 수련법.",
    url: "/basic",
  },
};

export default function Basic() {
  return <BasicPage />;
}
