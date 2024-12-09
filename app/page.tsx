"use client";

import { useState } from "react";
import { Noto_Sans_KR } from "next/font/google";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navigation from "./component/navigation";
import Hero from "./component/hero";
import Philosophy from "./component/philosophy";
import Techniques from "./component/techniques";
import Training from "./component/call-to-action";

const notoSansKR = Noto_Sans_KR({ subsets: ["latin"] });

export default function Home() {
  const [activeTab, setActiveTab] = useState("philosophy");

  return (
    <div className={`min-h-screen bg-slate-50 ${notoSansKR.className}`}>
      <div className="flex">
        <Navigation />
        <main className="flex-1">
          <Hero />
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start bg-white border-b">
              <TabsTrigger value="philosophy">Philosophy</TabsTrigger>
              <TabsTrigger value="techniques">Techniques</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[calc(100vh-64px-48px)]">
              <TabsContent value="philosophy">
                <Philosophy />
              </TabsContent>
              <TabsContent value="techniques">
                <Techniques />
              </TabsContent>
              <TabsContent value="training">
                <Training />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
