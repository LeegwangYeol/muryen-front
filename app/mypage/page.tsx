import { Metadata } from "next";
import { MainLayout } from "@/components/layout/main-layout";
import { DashboardStatCards } from "@/components/dashboard/stat-cards";
import { PageHeading, SubHeading, Body, CardContainer } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "나의 무련 기록",
  description: "수련 출석률, 무예 숙련도, 대련 통계를 확인하는 마이페이지.",
};

export default function MyPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <PageHeading size="lg" className="mb-2">나의 무련 기록</PageHeading>
        <Body size="base" className="mb-8 text-gray-500 dark:text-gray-400">
          꾸준한 수련이 훌륭한 무사를 만듭니다. 지금까지의 성장을 한눈에 확인하세요.
        </Body>

        <CardContainer className="mb-8 p-6 bg-gradient-to-r from-[rgb(var(--accent))] to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <SubHeading size="lg" className="text-white mb-1">김무련 무사님, 환영합니다!</SubHeading>
              <p className="text-white/80 text-sm">현재 소속: 서울 대학경당 계보 무련 동호회</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">총 수련 시간</p>
              <p className="text-3xl font-black">128 시간</p>
            </div>
          </div>
        </CardContainer>

        <DashboardStatCards />
      </div>
    </MainLayout>
  );
}
