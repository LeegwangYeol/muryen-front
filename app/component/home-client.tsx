"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/main-layout";
import Hero from "./hero";
import Philosophy from "./philosophy";
import VideoCircle from "./video-circle";
import HowWork from "./how-work";
import WhyMuryeon from "./why-muryeon";
import TargetAudience from "./target-audience";
import TrainingSystem from "./training-system";
import InquirySection from "./inquiry-section";
import { mockVideos } from "./mock-data";
import { useTheme } from "../context/theme-context";

export default function HomeClient() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("philosophy");
  // 첫 방문이면 오프닝 노출. 같은 세션 내 재방문이면 즉시 본문.
  const [isOpening, setIsOpening] = useState(true);

  useEffect(() => {
    // 세션 내 재방문 감지 — 한 번 본 사람은 2.5초 기다리지 않음
    try {
      if (sessionStorage.getItem("muryen-opening-seen")) {
        setIsOpening(false);
        return;
      }
      sessionStorage.setItem("muryen-opening-seen", "1");
    } catch {
      /* private mode 등 sessionStorage 실패해도 정상 흐름 유지 */
    }
    const timer = setTimeout(() => setIsOpening(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isOpening) {
    return (
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden cursor-pointer"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2.5, delay: 1 }}
        aria-hidden="true"
        onClick={() => setIsOpening(false)}
        onTouchStart={() => setIsOpening(false)}
        title="클릭하면 바로 진입"
      >
        <motion.div
          className="relative w-full h-full"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <Hero />
        </motion.div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpening(false);
          }}
          className="absolute bottom-8 right-8 z-10 px-4 py-2 text-xs sm:text-sm rounded-full bg-white/10 hover:bg-white/20 text-white/90 border border-white/30 backdrop-blur-sm transition-colors"
          aria-label="오프닝 건너뛰기"
        >
          건너뛰기 →
        </button>
      </motion.div>
    );
  }

  return (
    <MainLayout>
      <h1 className="sr-only">
        무련(武緣) — 조선 24반 무예 · 갑주 대련 · 대학경당 계보를 잇는 서울 수련 동호회. 무련은 무예도보통지의 기록을 몸으로 읽어내는 방식으로 24반 무예를 수련합니다.
      </h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-14 md:top-4 z-40 flex justify-center px-2 py-3 pointer-events-none isolate [transform:translateZ(0)]">
          <TabsList
            className={`pointer-events-auto max-w-[96vw] md:max-w-[600px] justify-center border shadow-sm rounded-full transition-colors duration-200 text-[11px] sm:text-sm gap-0.5 sm:gap-1 px-1 sm:px-2 ${
              theme === "dark"
                ? "bg-gray-900 border-gray-700 text-gray-200"
                : "bg-white border-gray-200 text-gray-800"
            }`}
          >
            <TabsTrigger
              value="philosophy"
              className={`transition-all duration-200 px-2 sm:px-3 py-1.5 ${
                theme === "dark"
                  ? "data-[state=active]:bg-gray-700 hover:bg-gray-700/50"
                  : "data-[state=active]:bg-gray-100 hover:bg-gray-50"
              }`}
            >
              <span className="sm:hidden">무련</span>
              <span className="hidden sm:inline">무련이란</span>
            </TabsTrigger>
            <TabsTrigger
              value="reason"
              className={`transition-all duration-200 px-2 sm:px-3 py-1.5 ${
                theme === "dark"
                  ? "data-[state=active]:bg-gray-700 hover:bg-gray-700/50"
                  : "data-[state=active]:bg-gray-100 hover:bg-gray-50"
              }`}
            >
              <span className="sm:hidden">수련법</span>
              <span className="hidden sm:inline">어떻게 수련하는가</span>
            </TabsTrigger>
            <TabsTrigger
              value="training"
              className={`transition-all duration-200 px-2 sm:px-3 py-1.5 ${
                theme === "dark"
                  ? "data-[state=active]:bg-gray-700 hover:bg-gray-700/50"
                  : "data-[state=active]:bg-gray-100 hover:bg-gray-50"
              }`}
            >
              <span className="sm:hidden">의미</span>
              <span className="hidden sm:inline">왜 수련하는가</span>
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="">
          <ScrollArea>
            <TabsContent value="philosophy" className="overflow-hidden">
              <Philosophy />
            </TabsContent>
            <TabsContent value="reason" className="overflow-hidden">
              <HowWork />
            </TabsContent>
            <TabsContent value="training">
              <VideoCircle videos={mockVideos} />
            </TabsContent>
          </ScrollArea>
        </div>
      </Tabs>

      <WhyMuryeon />
      <TargetAudience />
      <TrainingSystem />
      <InquirySection />
    </MainLayout>
  );
}
