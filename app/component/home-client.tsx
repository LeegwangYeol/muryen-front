"use client";

import { useState, useEffect } from "react";
import { Noto_Sans_KR } from "next/font/google";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import Image from "next/image";
import Navigation from "./navigation";
import Hero from "./hero";
import Philosophy from "./philosophy";
import Techniques from "./techniques";
import Training from "./call-to-action";

const notoSansKR = Noto_Sans_KR({ subsets: ["latin"] });

export default function HomeClient() {
  const [activeTab, setActiveTab] = useState("philosophy");
  const [isOpening, setIsOpening] = useState(true);
  const [isNavExpanded, setIsNavExpanded] = useState(true);

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
        transition={{ duration: 1.5, delay: 1 }}
      >
        <motion.div
          className="relative w-full h-full"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Image
            src="/images/hero.jpeg"
            alt="Opening"
            fill
            className="object-cover"
            priority
            onError={(e) => {
              setIsOpening(false);
            }}
          />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`min-h-screen bg-transparent ${notoSansKR.className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex">
        <Navigation onExpand={setIsNavExpanded} />
        <main
          className={`flex-1 transition-all duration-300 ${
            isNavExpanded ? "ml-64" : "ml-24"
          }`}
        >
          <Hero />
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div
              className="fixed top-64 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-300"
              style={{
                maxWidth: "600px",
                marginLeft: isNavExpanded ? "8rem" : "3rem",
              }}
            >
              <TabsList className="w-full justify-center bg-white/95 backdrop-blur-sm border-b shadow-sm rounded-full">
                <TabsTrigger value="philosophy">무련이란?</TabsTrigger>
                <TabsTrigger value="reason">어떻게 수련할까요?</TabsTrigger>
                <TabsTrigger value="training">
                  왜 수련을 해야하는가요?
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="mt-12">
              <ScrollArea>
                <TabsContent value="philosophy">
                  <Philosophy />
                </TabsContent>
                <TabsContent value="reason" className="overflow-hidden">
                  <Techniques />
                </TabsContent>
                <TabsContent value="training">
                  <Training />
                </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>
        </main>
      </div>
    </motion.div>
  );
}
