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
import { mockVideos } from "./mock-data";
import { useTheme } from "../context/theme-context";

export default function HomeClient() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("philosophy");
  const [isOpening, setIsOpening] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpening(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (isOpening) {
    return (
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2.5, delay: 1 }}
      >
        <motion.div
          className="relative w-full h-full"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <Hero />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <MainLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-300"
          style={{
            maxWidth: "600px",
            marginLeft: "8rem",
          }}
        >
          <TabsList
            className={`w-full justify-center backdrop-blur-sm border shadow-sm rounded-full transition-colors duration-200 hover:animate-shake ${
              theme === "dark"
                ? "bg-gray-800/90 border-gray-700 text-gray-200"
                : "bg-white/95 border-gray-200 text-gray-800"
            }`}
          >
            <TabsTrigger
              value="philosophy"
              className={`transition-all duration-200 ${
                theme === "dark"
                  ? "data-[state=active]:bg-gray-700 hover:bg-gray-700/50"
                  : "data-[state=active]:bg-gray-100 hover:bg-gray-50"
              }`}
            >
              무련이란?
            </TabsTrigger>
            <TabsTrigger
              value="reason"
              className={`transition-all duration-200 ${
                theme === "dark"
                  ? "data-[state=active]:bg-gray-700 hover:bg-gray-700/50"
                  : "data-[state=active]:bg-gray-100 hover:bg-gray-50"
              }`}
            >
              어떻게 수련할까요?
            </TabsTrigger>
            <TabsTrigger
              value="training"
              className={`transition-all duration-200 ${
                theme === "dark"
                  ? "data-[state=active]:bg-gray-700 hover:bg-gray-700/50"
                  : "data-[state=active]:bg-gray-100 hover:bg-gray-50"
              }`}
            >
              왜 수련을 해야하는가요?
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
    </MainLayout>
  );
}
